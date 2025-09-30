import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Leaderboard } from '@/components/Leaderboard';
import { useAuth } from '@/hooks/useAuth';
import heroGlobe from '@/assets/hero-globe.jpg';
import { Header } from '@/components/Header';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Hero image */}
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-quiz-ocean/20 to-quiz-earth/20 rounded-full blur-3xl scale-125 opacity-25"></div>
            <img
              src={heroGlobe}
              alt="Globo terrestre ilustrado"
              className="w-48 h-36 md:w-64 md:h-48 object-cover rounded-2xl shadow-2xl relative z-10 border-4 border-quiz-gold/20"
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight">
            {t('title')}
            <span className="block text-3xl md:text-4xl font-semibold mt-2 text-quiz-ocean">
              {t('subtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/quiz')}
                size="lg"
                variant="quiz"
                className="text-2xl px-16 py-6 animate-pulse-slow hover:scale-105 transition-transform"
              >
                <Globe className="w-6 h-6 mr-3" />
                {t('startQuiz')}
              </Button>

              {!user && (
                <Button
                  onClick={() => navigate('/auth')}
                  size="lg"
                  variant="quizOutline"
                  className="text-2xl px-16 py-6 hover:scale-105 transition-transform"
                >
                  <User className="w-6 h-6 mr-3" />
                  {t('login')}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('readyMessage')}
            </p>
          </div>

          {/* Ranking Section */}
          <div className="mt-12">
            {/* Destaque do top 1 apenas se usuário logado */}
            <Leaderboard highlightTop={!!user} />
          </div>

          {/* Tips */}
          <Card className="p-4 bg-quiz-continent/20 border-quiz-continent max-w-2xl mx-auto mt-8">
            <p className="text-sm text-muted-foreground">
              <strong className="text-quiz-ocean">{t('tips')}</strong>{' '}
              {t('tipsDesc')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
