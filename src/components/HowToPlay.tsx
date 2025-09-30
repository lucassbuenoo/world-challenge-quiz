import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Trophy } from 'lucide-react';
import heroGlobe from '@/assets/hero-globe.jpg';

const HowToPlay = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      icon: <MapPin className="w-6 h-6 text-quiz-ocean" />,
      title: 'Adivinhe os países',
      description: 'Digite o nome do país que aparece no mapa. Se estiver correto, ele ficará verde!'
    },
    {
      icon: <Clock className="w-6 h-6 text-quiz-ocean" />,
      title: 'Tempo limite',
      description: 'Você tem 15 minutos para acertar todos os países.'
    },
    {
      icon: <Trophy className="w-6 h-6 text-quiz-ocean" />,
      title: 'Ranking',
      description: 'No ranking, vence quem acertar mais países no menor tempo possível.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-quiz-ocean/20 to-quiz-earth/20 relative">
      <Header />

      <div className="pt-28 p-6 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        {/* Imagem do globo */}
        <div className="w-64 h-48 md:w-96 md:h-64 relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={heroGlobe}
            alt="Globo terrestre ilustrado"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          {t('Como Jogar')}
        </h1>

        {/* Descrição */}
        <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
          Aprenda rapidamente como se divertir e melhorar seus conhecimentos de geografia!
        </p>

        {/* Cards com os passos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 bg-background/70 border border-quiz-ocean rounded-xl shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {step.icon}
                <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
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
          {t('Voltar para a página inicial')}
        </Button>
      </div>
    </div>
  );
};

export default HowToPlay;
