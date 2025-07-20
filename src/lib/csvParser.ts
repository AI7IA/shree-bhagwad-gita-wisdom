import { Verse } from '@/types/verse';

export async function parseCSV(csvText: string): Promise<Verse[]> {
  const verses: Verse[] = [];
  const lines = csvText.split('\n');
  
  // Skip header row
  let i = 1;
  
  while (i < lines.length) {
    let currentRecord = '';
    let inQuotes = false;
    
    // Handle multi-line records
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim() && !inQuotes) {
        i++;
        continue;
      }
      
      currentRecord += (currentRecord ? '\n' : '') + line;
      
      // Count quotes to determine if we're inside a quoted field
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 === 1) {
        inQuotes = !inQuotes;
      }
      
      i++;
      
      // If we're not in quotes and have content, process the record
      if (!inQuotes && currentRecord.trim()) {
        break;
      }
    }
    
    if (currentRecord.trim()) {
      const values = parseCSVLine(currentRecord);
      
      if (values.length >= 8) {
        const chapterNum = parseInt(values[1]);
        const verseNum = parseInt(values[2]);
        
        if (!isNaN(chapterNum) && !isNaN(verseNum)) {
          const verse: Verse = {
            id: values[0].trim(),
            chapter: chapterNum,
            verse: verseNum,
            shloka: values[3].replace(/\\n/g, '\n').trim(),
            transliteration: values[4].replace(/\\n/g, '\n').trim(),
            hinMeaning: values[5].trim(),
            engMeaning: values[6].trim(),
            wordMeaning: values[7].trim()
          };
          verses.push(verse);
        }
      }
    }
  }

  return verses;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i - 1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      i++;
      continue;
    } else {
      current += char;
    }
    i++;
  }
  
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, ''));
}

export async function loadVersesFromCSV(): Promise<Verse[]> {
  try {
    const response = await fetch('/attached_assets/Bhagwad_Gita.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    return await parseCSV(csvText);
  } catch (error) {
    console.error('Error loading verses:', error);
    // Return empty array if CSV fails to load
    return [];
  }
}
