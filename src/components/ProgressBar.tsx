import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useTranslation();
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{t('countriesDiscovered')}</span>
        <span className="font-semibold text-quiz-ocean">
          {current}/{total} ({percentage}%)
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-3 bg-quiz-continent/20"
      />
    </div>
  );
}