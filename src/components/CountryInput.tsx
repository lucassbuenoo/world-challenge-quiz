import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CountryInputProps {
  onSubmit: (countryName: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CountryInput({ onSubmit, disabled, placeholder }: CountryInputProps) {
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || t('countryPlaceholder')}
          disabled={disabled}
          className="pl-10 text-lg h-12 bg-card border-2 border-quiz-continent focus:border-primary transition-colors"
          autoComplete="off"
          autoFocus
        />
      </div>
      <Button 
        type="submit" 
        disabled={disabled || !value.trim()}
        className="h-12 px-6 bg-gradient-earth text-secondary-foreground hover:opacity-90 transition-opacity font-semibold"
      >
        {t('confirm')}
      </Button>
    </form>
  );
}