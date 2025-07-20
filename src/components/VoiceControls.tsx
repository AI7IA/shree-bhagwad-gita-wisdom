import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Settings,
  ChevronDown,
  ChevronUp,
  SkipForward
} from 'lucide-react';
import { useSpeechSynthesis, SpeechOptions } from '@/hooks/useSpeechSynthesis';

interface VoiceControlsProps {
  sanskritText?: string;
  transliterationText?: string;
  hindiText?: string;
  englishText?: string;
}

export function VoiceControls({
  sanskritText,
  transliterationText,
  hindiText,
  englishText
}: VoiceControlsProps) {
  const { speak, stop, pause, resume, speaking, paused, supported, voices, getVoicesForLanguage } = useSpeechSynthesis();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'sanskrit' | 'transliteration' | 'hindi' | 'english'>('hindi');
  const [speechOptions, setSpeechOptions] = useState<SpeechOptions>({
    rate: 0.6,
    pitch: 1,
    volume: 1,
    pauseBetweenLines: true,
    pauseDuration: 1000
  });
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // Auto-select Hindi first, then fallback to other available text types
  useEffect(() => {
    if (hindiText) setSelectedLanguage('hindi');
    else if (sanskritText) setSelectedLanguage('sanskrit');
    else if (transliterationText) setSelectedLanguage('transliteration');
    else if (englishText) setSelectedLanguage('english');
  }, [sanskritText, transliterationText, hindiText, englishText]);

  // Mobile-specific: Enable audio context on user interaction
  useEffect(() => {
    const enableAudioContext = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Resume audio context for mobile browsers
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    };

    // Add event listeners for mobile touch events
    const events = ['touchstart', 'touchend', 'mousedown', 'mouseup'];
    events.forEach(event => {
      document.addEventListener(event, enableAudioContext, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudioContext);
      });
    };
  }, []);

  if (!supported) {
    return (
      <div className="text-center p-4 text-sm text-gray-500">
        Voice synthesis not supported in this browser
      </div>
    );
  }

  // Check if we're on mobile
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const getTextToSpeak = () => {
    switch (selectedLanguage) {
      case 'sanskrit':
        return sanskritText?.replace(/\n/g, ' ') || '';
      case 'transliteration':
        return transliterationText?.replace(/\n/g, ' ') || '';
      case 'hindi':
        return hindiText || '';
      case 'english':
        return englishText || '';
      default:
        return '';
    }
  };

  const handleSpeak = () => {
    const text = getTextToSpeak();
    if (!text.trim()) return;

    const voice = selectedVoice ? voices.find(v => v.name === selectedVoice) : undefined;
    
    // Enable pause between lines for Sanskrit and transliteration
    const shouldPause = (selectedLanguage === 'sanskrit' || selectedLanguage === 'transliteration') && speechOptions.pauseBetweenLines;
    
    // Slower rate for Sanskrit to make it more understandable
    const adjustedRate = selectedLanguage === 'sanskrit' ? Math.min(speechOptions.rate || 0.7, 0.6) : speechOptions.rate;
    
    speak(text, {
      ...speechOptions,
      rate: adjustedRate,
      voice: voice || null,
      pauseBetweenLines: shouldPause
    });
  };

  const handleStop = () => {
    stop();
  };

  const handlePauseResume = () => {
    if (paused) {
      resume();
    } else {
      pause();
    }
  };

  const getAvailableVoices = () => {
    switch (selectedLanguage) {
      case 'hindi':
        return getVoicesForLanguage('hi');
      case 'english':
        return getVoicesForLanguage('en');
      case 'sanskrit':
      case 'transliteration':
        return [
          ...getVoicesForLanguage('hi'),
          ...getVoicesForLanguage('en'),
          ...getVoicesForLanguage('sa')
        ];
      default:
        return voices;
    }
  };

  const availableVoices = getAvailableVoices();

  return (
    <div className="border rounded-lg p-4 space-y-4" style={{ borderColor: 'hsl(var(--border-color))' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" style={{ color: 'hsl(var(--text-secondary))' }} />
          <span className="font-medium text-sm" style={{ color: 'hsl(var(--text-primary))' }}>
            Voice Controls
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-1"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="language-select" className="text-xs font-medium min-w-fit">
            Text:
          </Label>
          <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hindiText && (
                <SelectItem value="hindi">Hindi</SelectItem>
              )}
              {sanskritText && (
                <SelectItem value="sanskrit">Sanskrit</SelectItem>
              )}
              {transliterationText && (
                <SelectItem value="transliteration">Transliteration</SelectItem>
              )}
              {englishText && (
                <SelectItem value="english">English</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className={`flex items-center gap-2 ${isMobile ? 'gap-3' : 'gap-2'}`}>
          <Button
            onClick={handleSpeak}
            disabled={speaking || !getTextToSpeak().trim()}
            size={isMobile ? "default" : "sm"}
            className={`flex-1 ${isMobile ? 'h-12 text-base' : ''}`}
          >
            <Play className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />
            {speaking ? 'Speaking...' : 'Speak'}
          </Button>
          <Button
            onClick={handlePauseResume}
            disabled={!speaking}
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={isMobile ? 'h-12 px-4' : ''}
          >
            {paused ? <Play className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} /> : <Pause className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />}
          </Button>
          <Button
            onClick={handleStop}
            disabled={!speaking}
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={isMobile ? 'h-12 px-4' : ''}
          >
            <Square className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'hsl(var(--border-color))' }}>
            {availableVoices.length > 0 && (
              <div>
                <Label htmlFor="voice-select" className="text-xs font-medium">
                  Voice
                </Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="w-full h-8 text-xs mt-1">
                    <SelectValue placeholder="Default voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="rate-slider" className="text-xs font-medium">
                Speed: {speechOptions.rate?.toFixed(1)}x
              </Label>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechOptions.rate || 0.7]}
                onValueChange={(value) => setSpeechOptions(prev => ({ ...prev, rate: value[0] }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pitch-slider" className="text-xs font-medium">
                Pitch: {speechOptions.pitch?.toFixed(1)}
              </Label>
              <Slider
                id="pitch-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechOptions.pitch || 1]}
                onValueChange={(value) => setSpeechOptions(prev => ({ ...prev, pitch: value[0] }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="volume-slider" className="text-xs font-medium">
                Volume: {Math.round((speechOptions.volume || 1) * 100)}%
              </Label>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[speechOptions.volume || 1]}
                onValueChange={(value) => setSpeechOptions(prev => ({ ...prev, volume: value[0] }))}
                className="mt-1"
              />
            </div>

            {(selectedLanguage === 'sanskrit' || selectedLanguage === 'transliteration') && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pause-switch" className="text-xs font-medium">
                    Pause between verse lines
                  </Label>
                  <Switch
                    id="pause-switch"
                    checked={speechOptions.pauseBetweenLines || false}
                    onCheckedChange={(checked) => setSpeechOptions(prev => ({ ...prev, pauseBetweenLines: checked }))}
                  />
                </div>

                {speechOptions.pauseBetweenLines && (
                  <div>
                    <Label htmlFor="pause-duration-slider" className="text-xs font-medium">
                      Pause duration: {((speechOptions.pauseDuration || 1000) / 1000).toFixed(1)}s
                    </Label>
                    <Slider
                      id="pause-duration-slider"
                      min={500}
                      max={3000}
                      step={250}
                      value={[speechOptions.pauseDuration || 1000]}
                      onValueChange={(value) => setSpeechOptions(prev => ({ ...prev, pauseDuration: value[0] }))}
                      className="mt-1"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}