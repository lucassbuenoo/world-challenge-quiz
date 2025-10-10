import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import heroGlobe from '@/assets/hero-globe.jpg';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Curiosidades — agora com tradução
  const curiosities = t('about.curiosities', { returnObjects: true }) as {
    country: string;
    fact: string;
  }[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-quiz-ocean/20 to-quiz-earth/20 relative">
      <Header />

      <div className="pt-28 p-6 flex flex-col items-center text-center space-y-8">
        {/* Imagem */}
        <div className="w-64 h-48 md:w-96 md:h-64 relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={heroGlobe}
            alt={t('about.imageAlt')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          {t('about.title')}
        </h1>

        {/* Descrição */}
        <p className="text-lg md:text-xl text-foreground/90 max-w-3xl leading-relaxed">
          {t('about.description')}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
          {curiosities.map((item, index) => (
            <Card
              key={index}
              className="p-4 bg-background/70 border border-quiz-ocean rounded-xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer"
              title={item.country}
            >
              <div className="flex items-center justify-center mb-2">
                <Flag className="w-6 h-6 text-quiz-ocean mr-2 animate-bounce-slow" />
                <h3 className="font-semibold text-foreground">{item.country}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{item.fact}</p>
            </Card>
          ))}
        </div>

        {/* Botão voltar */}
        <Button
          onClick={() => navigate('/')}
          size="lg"
          variant="quiz"
          className="px-10 py-4 animate-pulse-slow hover:scale-105 transition-transform mt-8"
        >
          {t('about.backButton')}
        </Button>
      </div>
    </div>
  );
};

export default About;
