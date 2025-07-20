import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting store (in-memory for development)
const rateLimitStore = new Map();

function rateLimit(ip, limit = 25, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function sanitizeSearchQuery(query) {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .substring(0, 200);
}

let versesCache = null;

function loadVerses() {
  if (versesCache) {
    return versesCache;
  }

  try {
    const csvPath = path.join(__dirname, 'attached_assets', 'Bhagwad_Gita.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    const verses = parseCSV(csvText);
    versesCache = verses;
    return verses;
  } catch (error) {
    console.error('Error loading verses:', error);
    return [];
  }
}

function parseCSV(csvText) {
  const verses = [];
  const lines = csvText.split('\n');
  let currentRecord = [];
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
          // Handle escaped quote
          currentField += '"';
          charIndex++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        currentRecord.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    if (!inQuotes) {
      // End of record
      currentRecord.push(currentField.trim());
      
      if (currentRecord.length >= 8 && currentRecord[0]) {
        verses.push({
          id: recordIndex + 1,
          verseId: currentRecord[0],
          chapter: parseInt(currentRecord[1]) || null,
          verse: parseInt(currentRecord[2]) || null,
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
      // Continue multiline field
      currentField += '\n';
    }
    
    lineIndex++;
  }
  
  return verses;
}

// Middleware for rate limiting
app.use('/api', (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!rateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }
  
  next();
});

// API Routes
app.get('/api/verses', (req, res) => {
  try {
    const verses = loadVerses();
    const { q, chapter, verse: verseNum } = req.query;

    // Handle search
    if (q) {
      const sanitizedQuery = sanitizeSearchQuery(q);
      if (!sanitizedQuery) {
        return res.status(400).json({ error: 'Invalid search query' });
      }

      const searchResults = verses.filter(v =>
        v.shloka.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
        v.transliteration.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
        v.hinMeaning.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
        v.engMeaning.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
        v.wordMeaning.toLowerCase().includes(sanitizedQuery.toLowerCase())
      ).slice(0, 50);

      return res.json(searchResults);
    }

    // Handle chapter and verse lookup
    if (chapter && verseNum) {
      const chapterNum = parseInt(chapter);
      const verseNumber = parseInt(verseNum);

      if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 18) {
        return res.status(400).json({ error: 'Invalid chapter number' });
      }

      if (isNaN(verseNumber) || verseNumber < 1 || verseNumber > 200) {
        return res.status(400).json({ error: 'Invalid verse number' });
      }

      const foundVerse = verses.find(v => v.chapter === chapterNum && v.verse === verseNumber);
      if (!foundVerse) {
        return res.status(404).json({ error: 'Verse not found' });
      }

      return res.json([foundVerse]);
    }

    // Return all verses (limited)
    res.json(verses.slice(0, 100));
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verses/random', (req, res) => {
  try {
    const verses = loadVerses();
    
    if (verses.length === 0) {
      return res.status(404).json({ error: 'No verses found' });
    }

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    res.json(randomVerse);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verses/count', (req, res) => {
  try {
    const verses = loadVerses();
    res.json({ count: verses.length });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verses/next/:id', (req, res) => {
  try {
    const { id } = req.params;
    const verses = loadVerses();
    const currentIndex = verses.findIndex(v => v.verseId === decodeURIComponent(id));
    
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    const nextIndex = (currentIndex + 1) % verses.length;
    const nextVerse = verses[nextIndex];
    
    res.json(nextVerse);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verses/previous/:id', (req, res) => {
  try {
    const { id } = req.params;
    const verses = loadVerses();
    const currentIndex = verses.findIndex(v => v.verseId === decodeURIComponent(id));
    
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    const previousIndex = currentIndex === 0 ? verses.length - 1 : currentIndex - 1;
    const previousVerse = verses[previousIndex];
    
    res.json(previousVerse);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/verses');
  console.log('- GET /api/verses/random');
  console.log('- GET /api/verses/count');
  console.log('- GET /api/verses/next/:id');
  console.log('- GET /api/verses/previous/:id');
});