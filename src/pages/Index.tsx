import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, Clock, Target, Trophy, MapPin, Users, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Leaderboard } from '@/components/Leaderboard';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import heroGlobe from '@/assets/hero-globe.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="min-h-screen bg-gradient-to-br from-background/60 via-background/30 to-background/50 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Header with language selector and user profile */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
            <LanguageSelector position="inline" />
            {user && <UserProfile />}
          </div>
          
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-quiz-ocean/20 to-quiz-earth/20 rounded-full blur-3xl scale-150 opacity-30"></div>
              <img 
                src={heroGlobe} 
                alt="Globo terrestre ilustrado" 
                className="w-48 h-36 md:w-64 md:h-48 object-cover rounded-2xl shadow-2xl relative z-10 border-4 border-quiz-gold/20"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight">
              {t('title')}
              <span className="block text-3xl md:text-4xl font-semibold mt-2 text-quiz-ocean">
                {t('subtitle')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>


          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/quiz')}
                size="lg"
                variant="quiz"
                className="text-xl px-12 py-6"
              >
                <Globe className="w-6 h-6 mr-3" />
                {t('startQuiz')}
              </Button>
              
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  variant="quizOutline"
                  className="text-xl px-12 py-6"
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

          {/* Leaderboard Section */}
          <Leaderboard />

          {/* Tips */}
          <Card className="p-4 bg-quiz-continent/20 border-quiz-continent max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong className="text-quiz-ocean">{t('tips')}</strong> {t('tipsDesc')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
