import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { Verse } from '@/types/verse';
import { apiRequest } from '@/lib/queryClient';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVerseSelect: (verse: Verse) => void;
}

export function SearchPanel({ isOpen, onClose, onVerseSelect }: SearchPanelProps) {
  const [searchType, setSearchType] = useState<'chapter' | 'text'>('chapter');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChapterVerseSearch = async () => {
    if (!chapter || !verse) {
      setError('Please enter both chapter and verse numbers');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await apiRequest(`/api/verses/search?chapter=${chapter}&verse=${verse}`);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No verse found for the specified chapter and verse');
      }
    } catch (err) {
      setError('Failed to search verses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSearch = async () => {
    if (!textQuery.trim()) {
      setError('Please enter search text');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await apiRequest(`/api/verses/search?q=${encodeURIComponent(textQuery)}`);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No verses found matching your search');
      }
    } catch (err) {
      setError('Failed to search verses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerseClick = (selectedVerse: Verse) => {
    onVerseSelect(selectedVerse);
    onClose();
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
    setChapter('');
    setVerse('');
    setTextQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md verse-container border-l z-50 overflow-y-auto"
           style={{ borderColor: 'hsl(var(--border-color))' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--text-primary))' }}>
              Search Verses
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Type Toggle */}
          <div className="mb-6">
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              Search Type
            </Label>
            <div className="flex space-x-2">
              <Button
                variant={searchType === 'chapter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('chapter')}
                className="flex-1"
              >
                Chapter & Verse
              </Button>
              <Button
                variant={searchType === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchType('text')}
                className="flex-1"
              >
                Text Search
              </Button>
            </div>
          </div>

          {/* Chapter & Verse Search */}
          {searchType === 'chapter' && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <Label htmlFor="chapter" className="text-sm secondary-text mb-2 block">
                    Chapter (1-18)
                  </Label>
                  <Input
                    id="chapter"
                    type="number"
                    min="1"
                    max="18"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="verse" className="text-sm secondary-text mb-2 block">
                    Verse
                  </Label>
                  <Input
                    id="verse"
                    type="number"
                    min="1"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>
              <Button
                onClick={handleChapterVerseSearch}
                disabled={loading}
                className="w-full accent-button"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Find Verse'}
              </Button>
            </div>
          )}

          {/* Text Search */}
          {searchType === 'text' && (
            <div className="mb-6">
              <Label htmlFor="textQuery" className="text-sm secondary-text mb-2 block">
                Search Text
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="textQuery"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  placeholder="Enter Sanskrit, Hindi, or English text..."
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                />
                <Button
                  onClick={handleTextSearch}
                  disabled={loading}
                  className="accent-button"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Clear Results */}
          {(searchResults.length > 0 || error) && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                className="w-full"
              >
                Clear Results
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'hsl(var(--bg-accent))', color: 'hsl(var(--text-error))' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
                Results ({searchResults.length})
              </Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: 'hsl(var(--bg-secondary))' }}
                    onClick={() => handleVerseClick(result)}
                  >
                    <div className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                      Chapter {result.chapter}, Verse {result.verse}
                    </div>
                    <div className="text-xs secondary-text line-clamp-3">
                      {result.engMeaning.substring(0, 150)}
                      {result.engMeaning.length > 150 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}