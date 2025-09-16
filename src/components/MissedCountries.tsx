import { countries } from '@/data/countries';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MissedCountriesProps {
  correctCountries: string[];
}

export function MissedCountries({ correctCountries }: MissedCountriesProps) {
  const { t } = useTranslation();
  
  const missedCountries = countries.filter(
    country => !correctCountries.includes(country.id)
  );

  // Group by continent
  const continentGroups = missedCountries.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = [];
    }
    acc[country.continent].push(country);
    return acc;
  }, {} as Record<string, typeof countries>);

  if (missedCountries.length === 0) {
    return (
      <Card className="p-6 bg-quiz-correct/10 border-quiz-correct">
        <div className="text-center">
          <h3 className="text-xl font-bold text-quiz-correct mb-2">
            🎉 {t('perfectScore')} 🎉
          </h3>
          <p className="text-muted-foreground">
            {t('discoveredAllCountries')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-destructive/5 border-destructive/20">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-destructive" />
        <h3 className="text-lg font-semibold text-destructive">
          {t('missedCountries')} ({missedCountries.length})
        </h3>
      </div>
      
      <ScrollArea className="max-h-80 overflow-y-auto">
        <div className="space-y-3 pr-4">
          {Object.entries(continentGroups).map(([continent, countryList]) => (
            <div key={continent} className="space-y-2">
              <Badge variant="outline" className="text-xs border-muted-foreground text-muted-foreground">
                {continent} ({countryList.length})
              </Badge>
              
              <div className="flex flex-wrap gap-1">
                {countryList.map(country => (
                  <Badge 
                    key={country.id} 
                    variant="secondary" 
                    className="text-xs bg-destructive/10 text-destructive border-destructive/20"
                  >
                    {country.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}