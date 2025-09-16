import { countries, continentNames, Country } from '@/data/countries';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

interface CountryListProps {
  correctCountries: string[];
}

export function CountryList({ correctCountries }: CountryListProps) {
  const groupedCountries = correctCountries.reduce((acc, countryId) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      if (!acc[country.continent]) {
        acc[country.continent] = [];
      }
      acc[country.continent].push(country);
    }
    return acc;
  }, {} as Record<string, Country[]>);

  // Ordenar países dentro de cada continente
  Object.keys(groupedCountries).forEach(continent => {
    groupedCountries[continent].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-quiz-ocean" />
        <h2 className="text-lg font-semibold text-foreground">
          Países Descobertos ({correctCountries.length}/196)
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(continentNames).map(([continent, continentPt]) => {
          const countriesInContinent = groupedCountries[continent] || [];
          const totalInContinent = countries.filter(c => c.continent === continent).length;
          
          return (
            <Card key={continent} className="p-4 bg-quiz-continent/20 border-quiz-continent">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-quiz-ocean">{continentPt}</h3>
                <Badge variant="outline" className="border-quiz-ocean text-quiz-ocean">
                  {countriesInContinent.length}/{totalInContinent}
                </Badge>
              </div>
              
              <div className="space-y-1 min-h-[120px]">
                {countriesInContinent.map(country => (
                  <div
                    key={country.id}
                    className="text-sm bg-quiz-correct/20 text-quiz-earth p-2 rounded border border-quiz-correct/30 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2"
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}