import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: "es", name: "Español", flag: "🇪🇸" }
];

interface LanguageSelectorProps {
  position?: 'center' | 'top-right' | 'inline';
}

export function LanguageSelector({ position = 'center' }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();

  if (position === 'top-right') {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
          <SelectTrigger className="w-48 bg-card border-quiz-continent/50 hover:bg-card/90">
            <SelectValue />
          </SelectTrigger>
          <SelectContent 
            className="bg-card border-quiz-continent/50"
            align="end" /* garante alinhamento à direita */
            sideOffset={4} /* espaço do trigger */
          >
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="hover:bg-quiz-continent/20 focus:bg-quiz-continent/20 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (position === 'center') {
    return (
      <div className="flex flex-col items-center gap-2 mb-6">
        <p className="text-sm text-muted-foreground font-medium">
          {t('chooseLanguage')}
        </p>
        <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
          <SelectTrigger className="w-64 bg-card border-quiz-continent/50 hover:bg-card/90 z-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent 
            className="bg-card border-quiz-continent/50 z-50"
            align="center"
            sideOffset={4}
          >
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="hover:bg-quiz-continent/20 focus:bg-quiz-continent/20 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Inline version for header
  return (
    <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
      <SelectTrigger className="w-40 bg-card border-quiz-continent/50 hover:bg-card/90">
        <SelectValue />
      </SelectTrigger>
      <SelectContent 
        className="bg-card border-quiz-continent/50"
        align="end" /* impede de estourar pra direita */
        sideOffset={4}
      >
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="hover:bg-quiz-continent/20 focus:bg-quiz-continent/20 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
