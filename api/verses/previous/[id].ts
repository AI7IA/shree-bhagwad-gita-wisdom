import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

interface Verse {
  id: number;
  verseId: string;
  chapter: number;
  verse: number;
  shloka: string;
  transliteration: string;
  hinMeaning: string;
  engMeaning: string;
  wordMeaning: string;
}

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

let versesCache: Verse[] | null = null;

function loadVerses(): Verse[] {
  if (versesCache) {
    return versesCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Bhagwad_Gita.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    const verses = parseCSV(csvText);
    versesCache = verses;
    return verses;
  } catch (error) {
    console.error('Error loading verses:', error);
    return [];
  }
}

function parseCSV(csvText: string): Verse[] {
  const verses: Verse[] = [];
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
          verse: parseInt(currentRecord[2]) || 0,
          shloka: currentRecord[3] || '',
          transliteration: currentRecord[4] || '',
          hinMeaning: currentRecord[5] || '',
          engMeaning: currentRecord[6] || '',
          wordMeaning: currentRecord[7] || ''
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
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid verse ID' });
    }

    const verses = loadVerses();
    const currentIndex = verses.findIndex(v => v.verseId === decodeURIComponent(id));
    
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    // Get previous verse (wrap around to last if at beginning)
    const previousIndex = currentIndex === 0 ? verses.length - 1 : currentIndex - 1;
    const previousVerse = verses[previousIndex];
    
    return res.status(200).json(previousVerse);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}