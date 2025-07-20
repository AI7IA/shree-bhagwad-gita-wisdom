import { X } from 'lucide-react';
import { Settings } from '@/types/verse';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onUpdateSetting }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 verse-container border-l z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Settings</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Font Size Settings */}
          <div className="mb-8">
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              Font Size
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  onClick={() => onUpdateSetting('fontSize', size)}
                  className="p-3 text-left justify-start"
                  style={{
                    backgroundColor: settings.fontSize === size ? 'hsl(var(--accent-primary))' : 'transparent',
                    color: settings.fontSize === size ? 'white' : 'hsl(var(--text-primary))',
                    borderColor: settings.fontSize === size ? 'hsl(var(--accent-primary))' : 'hsl(var(--border-color))'
                  }}
                >
                  <div>
                    <div className="font-medium capitalize">{size}</div>
                    <div className="text-xs secondary-text">
                      {size === 'small' ? '14px' : 
                       size === 'medium' ? '16px' : 
                       size === 'large' ? '18px' : '20px'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Language Display Toggles */}
          <div className="mb-8">
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              Display Languages
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-sanskrit" className="font-medium">Show Sanskrit</Label>
                <Switch
                  id="show-sanskrit"
                  checked={settings.showSanskrit}
                  onCheckedChange={(checked) => onUpdateSetting('showSanskrit', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-transliteration" className="font-medium">Show Transliteration</Label>
                <Switch
                  id="show-transliteration"
                  checked={settings.showTransliteration}
                  onCheckedChange={(checked) => onUpdateSetting('showTransliteration', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-hindi" className="font-medium">Show Hindi Meaning</Label>
                <Switch
                  id="show-hindi"
                  checked={settings.showHindi}
                  onCheckedChange={(checked) => onUpdateSetting('showHindi', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-english" className="font-medium">Show English Meaning</Label>
                <Switch
                  id="show-english"
                  checked={settings.showEnglish}
                  onCheckedChange={(checked) => onUpdateSetting('showEnglish', checked)}
                />
              </div>
            </div>
          </div>

          {/* Auto-advance Settings */}
          <div className="mb-8">
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              Auto-advance Timer
            </Label>
            <Select
              value={settings.autoAdvance.toString()}
              onValueChange={(value) => onUpdateSetting('autoAdvance', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Off</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="120">2 minutes</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verse Mode Settings */}
          <div className="mb-8">
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              Verse Selection
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => onUpdateSetting('verseMode', 'random')}
                className="p-3"
                style={{
                  backgroundColor: settings.verseMode === 'random' ? 'hsl(var(--accent-primary))' : 'transparent',
                  color: settings.verseMode === 'random' ? 'white' : 'hsl(var(--text-primary))',
                  borderColor: settings.verseMode === 'random' ? 'hsl(var(--accent-primary))' : 'hsl(var(--border-color))'
                }}
              >
                Random
              </Button>
              <Button
                variant="outline"
                onClick={() => onUpdateSetting('verseMode', 'sequential')}
                className="p-3"
                style={{
                  backgroundColor: settings.verseMode === 'sequential' ? 'hsl(var(--accent-primary))' : 'transparent',
                  color: settings.verseMode === 'sequential' ? 'white' : 'hsl(var(--text-primary))',
                  borderColor: settings.verseMode === 'sequential' ? 'hsl(var(--accent-primary))' : 'hsl(var(--border-color))'
                }}
              >
                Sequential
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="pt-6 border-t" style={{ borderColor: 'hsl(var(--border-color))' }}>
            <Label className="text-sm font-semibold secondary-text mb-3 uppercase tracking-wide block">
              About
            </Label>
            <div className="text-sm secondary-text space-y-2">
              <p>Shree Bhagwad Gita Wisdom by AI7IA</p>
              <p>Contains all 701 verses from the Bhagavad Gita</p>
              <p>Text sourced from authentic Sanskrit manuscripts</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
