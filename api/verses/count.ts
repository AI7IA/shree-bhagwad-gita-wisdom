import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 25, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIP(req: VercelRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

let verseCount: number | null = null;

function getVerseCount(): number {
  if (verseCount !== null) {
    return verseCount;
  }

  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Bhagwad_Gita.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    const verses = parseCSV(csvText);
    verseCount = verses.length;
    return verseCount;
  } catch (error) {
    console.error('Error counting verses:', error);
    return 0;
  }
}

function parseCSV(csvText: string): any[] {
  const verses: any[] = [];
  const lines = csvText.split('\n');
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let recordIndex = 0;

  // Skip header
  let lineIndex = 1;
  
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      
      if (char === '"') {
        if (inQuotes && line[charIndex + 1] === '"') {
          currentField += '"';
          charIndex++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRecord.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    if (!inQuotes) {
      currentRecord.push(currentField.trim());
      
      if (currentRecord.length >= 8 && currentRecord[0]) {
        verses.push({
          id: recordIndex + 1,
          verseId: currentRecord[0],
          chapter: parseInt(currentRecord[1]) || 0,
          verse: parseInt(currentRecord[2]) || 0
        });
        recordIndex++;
      }
      
      currentRecord = [];
      currentField = '';
    } else {
      currentField += '\n';
    }
    
    lineIndex++;
  }
  
  return verses;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientIP = getClientIP(req);

  // Rate limiting
  if (!rateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }

  // Security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const count = getVerseCount();
    return res.status(200).json({ count });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}