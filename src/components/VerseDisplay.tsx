import { Verse } from '@/types/verse';
import { Settings } from '@/types/verse';
import { Button } from '@/components/ui/button';
import { VoiceControls } from '@/components/VoiceControls';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface VerseDisplayProps {
  verse: Verse | null;
  settings: Settings;
  onNewVerse: () => void;
  onPreviousVerse: () => void;
  onNextVerse: () => void;
  loading: boolean;
}

export function VerseDisplay({ 
  verse, 
  settings, 
  onNewVerse, 
  onPreviousVerse,
  onNextVerse,
  loading 
}: VerseDisplayProps) {
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="verse-container rounded-xl p-6 md:p-8">
          <div className="text-center secondary-text">
            Loading verses...
          </div>
        </div>
      </main>
    );
  }

  if (!verse) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="verse-container rounded-xl p-6 md:p-8">
          <div className="text-center secondary-text">
            No verse available. Please check the data source.
          </div>
        </div>
      </main>
    );
  }

  const fontSizeClass = `font-size-${settings.fontSize}`;

  return (
    <main className={`max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 ${fontSizeClass}`}>
      <div className="verse-container rounded-xl p-6 md:p-8">
        {/* Verse Header */}
        <div className="text-center mb-6">
          <div className="font-medium mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
            Chapter {verse.chapter}, Verse {verse.verse}
          </div>
        </div>

        {/* Sanskrit Shloka */}
        {settings.showSanskrit && (
          <div className="mb-8">
            <h3 className={`${fontSizeClass} font-semibold mb-3 uppercase tracking-wide text-center underline`} style={{ color: 'hsl(var(--text-secondary))' }}>
              Sanskrit
            </h3>
            <div className={`sanskrit-text ${fontSizeClass} leading-relaxed text-center py-4`} style={{ color: 'hsl(var(--text-sanskrit))' }}>
              {verse.shloka?.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              )) || <div>No Sanskrit text available</div>}
            </div>
          </div>
        )}

        {/* Transliteration */}
        {settings.showTransliteration && (
          <div className="mb-8">
            <h3 className={`${fontSizeClass} font-semibold mb-3 uppercase tracking-wide text-center underline`} style={{ color: 'hsl(var(--text-secondary))' }}>
              Transliteration
            </h3>
            <div className={`${fontSizeClass} leading-relaxed italic text-center`} style={{ color: 'hsl(var(--text-primary))' }}>
              {verse.transliteration?.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              )) || <p>No transliteration available</p>}
            </div>
          </div>
        )}

        {/* Hindi Meaning */}
        {settings.showHindi && (
          <div className="mb-8">
            <h3 className={`${fontSizeClass} font-semibold mb-3 uppercase tracking-wide text-center underline`} style={{ color: 'hsl(var(--text-secondary))' }}>
              Hindi Meaning
            </h3>
            <div className={`${fontSizeClass} leading-relaxed text-center`} style={{ color: 'hsl(var(--text-primary))' }}>
              <p>{verse.hinMeaning || 'No Hindi meaning available'}</p>
            </div>
          </div>
        )}

        {/* English Meaning */}
        {settings.showEnglish && (
          <div className="mb-8">
            <h3 className={`${fontSizeClass} font-semibold mb-3 uppercase tracking-wide text-center underline`} style={{ color: 'hsl(var(--text-secondary))' }}>
              English Meaning
            </h3>
            <div className={`${fontSizeClass} leading-relaxed text-center`} style={{ color: 'hsl(var(--text-primary))' }}>
              <p>{verse.engMeaning || 'No English meaning available'}</p>
            </div>
          </div>
        )}

        {/* Voice Controls */}
        <div className="mb-8">
          <VoiceControls
            sanskritText={verse.shloka}
            transliterationText={verse.transliteration}
            hindiText={verse.hinMeaning}
            englishText={verse.engMeaning}
          />
        </div>

        {/* Divider */}
        <div className="border-t my-8" style={{ borderColor: 'hsl(var(--border-color))' }}></div>

        {/* Detailed Word Meaning */}
        <div className="mb-8">
          <h3 className={`${fontSizeClass} font-semibold mb-4 uppercase tracking-wide text-center underline`} style={{ color: 'hsl(var(--text-secondary))' }}>
            Detailed Word Meaning
          </h3>
          <div className={`${fontSizeClass} leading-relaxed text-center`} style={{ color: 'hsl(var(--text-secondary))' }}>
            {verse.wordMeaning?.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return <br key={index} />;
              return <p key={index} className="mb-2">{paragraph}</p>;
            }) || <p>No word meaning available</p>}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t" 
             style={{ borderColor: 'hsl(var(--border-color))' }}>
          
          {/* Navigation Buttons Row */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onPreviousVerse}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-6 py-3 rounded-lg font-medium hover:bg-[#778899] transition-all duration-200 bg-[#fafafa] border border-gray-200"
              style={{ 
                fontSize: '16px',
                color: 'hsl(var(--button-text))'
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Verse
            </Button>
            
            <Button
              onClick={onNextVerse}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-6 py-3 rounded-lg font-medium hover:bg-[#778899] transition-all duration-200 bg-[#fafafa] border border-gray-200"
              style={{ 
                fontSize: '16px',
                color: 'hsl(var(--button-text))'
              }}
            >
              Next Verse
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* New Verse Button */}
          <Button
            onClick={onNewVerse}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-6 py-3 rounded-lg font-medium hover:bg-[#778899] transition-all duration-200 bg-[#fafafa] border border-gray-200"
            style={{ 
              fontSize: '16px',
              color: 'hsl(var(--button-text))'
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Verse
          </Button>
        </div>
      </div>
    </main>
  );
}
