import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from '@/components/Timer';
import { CountryInput } from '@/components/CountryInput';
import { CountryList } from '@/components/CountryList';
import { ProgressBar } from '@/components/ProgressBar';
import { WorldMap } from '@/components/WorldMap';
import { MissedCountries } from '@/components/MissedCountries';
import { UserProfile } from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { findCountryByName } from '@/data/countries';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useGameScores } from '@/hooks/useGameScores';
import { Square, Home, Trophy, User, Clock, Map, Target, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QUIZ_DURATION = 15 * 60; // 15 minutos em segundos

export function Quiz() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { saveScore } = useGameScores();

  const [correctCountries, setCorrectCountries] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleCountrySubmit = (countryName: string) => {
    const country = findCountryByName(countryName);

    if (!country) {
      toast({
        title: t('countryNotFound'),
        description: `"${countryName}" ${t('countryNotFoundDesc')}`,
        variant: "destructive",
      });
      return;
    }

    if (correctCountries.includes(country.id)) {
      toast({
        title: t('countryAlreadyFound'),
        description: `${country.name} ${t('countryAlreadyFoundDesc')}`,
        variant: "destructive",
      });
      return;
    }

    setCorrectCountries(prev => [...prev, country.id]);
    toast({
      title: t('correct'),
      description: `${country.name} ${t('correctDesc')}`,
    });

    // Verificar se todos os países foram descobertos
    if (correctCountries.length + 1 === 196) {
      handleQuizEnd();
    }
  };

  const handleTimeUp = () => {
    const time = startTime ? Date.now() - startTime : 0;
    setFinalTime(time);
    setIsFinished(true);

    // Save score if user is authenticated
    if (user && profile) {
      saveScore({
        user_id: user.id,
        correct_answers: correctCountries.length,
        total: 196,
        time: Math.round(time / 1000), // Convert to seconds
      });
    }

    toast({
      title: t('timeUp'),
      description: `${t('timeUpDesc')} ${correctCountries.length} ${t('countries')}`,
    });
  };

  const handleQuizEnd = () => {
    const time = startTime ? Date.now() - startTime : 0;
    setFinalTime(time);
    setIsFinished(true);

    // Save score if user is authenticated
    if (user && profile) {
      saveScore({
        user_id: user.id,
        correct_answers: correctCountries.length,
        total: 196,
        time: Math.round(time / 1000), // Convert to seconds
      });
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
  };

  const handleQuit = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    navigate('/');
  };

  const percentage = Math.round((correctCountries.length / 196) * 100);

  // Start screen - removed, now using inline start button

  if (isFinished) {
    const timeInMinutes = finalTime ? Math.round(finalTime / 60000) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-quiz-continent/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center bg-card/95 backdrop-blur-sm border-2 border-quiz-gold/30">
          <Trophy className="w-16 h-16 text-quiz-gold mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('quizFinished')}
          </h1>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-quiz-continent/20 p-4 rounded-lg border border-quiz-continent">
                <div className="text-2xl font-bold text-quiz-ocean">{correctCountries.length}</div>
                <div className="text-sm text-muted-foreground">{t('countriesDiscoveredLabel')}</div>
              </div>
              <div className="bg-quiz-continent/20 p-4 rounded-lg border border-quiz-continent">
                <div className="text-2xl font-bold text-quiz-earth">{percentage}%</div>
                <div className="text-sm text-muted-foreground">{t('percentage')}</div>
              </div>
            </div>

            <div className="bg-quiz-continent/20 p-4 rounded-lg border border-quiz-continent">
              <div className="text-xl font-semibold text-quiz-gold">{timeInMinutes} {t('minutes')}</div>
              <div className="text-sm text-muted-foreground">{t('totalTime')}</div>
            </div>

            <div className="space-y-2">
              <p className="text-lg text-foreground">
                {percentage >= 90 ? t('excellentGeography') :
                  percentage >= 70 ? t('goodGeography') :
                    percentage >= 50 ? t('okGeography') :
                      percentage >= 30 ? t('beginnerGeography') :
                        t('studyMore')}
              </p>

              <p className="text-muted-foreground">
                {t('discoveredOf')} {correctCountries.length} {t('of')} 196 {t('unRecognizedCountries')}
              </p>
            </div>

            {/* Missed Countries Section */}
            <MissedCountries correctCountries={correctCountries} />

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="quiz"
              >
                {t('playAgain')}
              </Button>
              <Button
                variant="quizOutline"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                {t('home')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-quiz-continent/5 to-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com controles */}
        <Card className="p-4 bg-card/95 backdrop-blur-sm border-2 border-quiz-continent/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Timer
                duration={QUIZ_DURATION}
                onTimeUp={handleTimeUp}
                isPaused={!isStarted}
              />
              <Badge variant="outline" className="text-lg px-4 py-2 border-quiz-ocean text-quiz-ocean">
                {correctCountries.length}/196
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {user && <UserProfile />}
              <div className="flex gap-2">
                {!isStarted ? (
                  <Button
                    onClick={handleStart}
                    className="mx-auto flex items-center justify-center
               px-10 py-6 text-2xl font-bold rounded-2xl
               bg-green-600 text-white shadow-lg
               hover:bg-green-700 hover:scale-105 hover:shadow-xl
               transition-transform animate-pulse"
                  >
                    <Trophy className="w-7 h-7 mr-3" />
                    {t('startQuizButton')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleQuizEnd}
                      className="border-quiz-ocean text-quiz-ocean hover:bg-quiz-ocean hover:text-primary-foreground"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      {t('finish')}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleQuit}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {t('exit')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Barra de progresso */}
        <Card className="p-4 bg-card/95 backdrop-blur-sm border-2 border-quiz-continent/50">
          <ProgressBar current={correctCountries.length} total={196} />
        </Card>

        {/* Input para países */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-2 border-quiz-continent/50">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t('typeCountryName')}
            </h2>
            <CountryInput
              onSubmit={handleCountrySubmit}
              disabled={isFinished || !isStarted}
            />
          </div>
        </Card>

        {/* Mapa Interativo */}
        <WorldMap
          correctCountries={correctCountries}
          isGameFinished={isFinished}
        />

        {/* Lista de países por continente */}
        <CountryList correctCountries={correctCountries} />
      </div>

      {/* Modal de confirmação para sair do quiz */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-2 border-quiz-continent/50">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-center">
              {t('confirmExit')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              {t('exitQuizWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 justify-center">
            <AlertDialogCancel
              onClick={() => setShowExitDialog(false)}
              className="bg-quiz-continent/20 text-foreground hover:bg-quiz-continent/30 border-quiz-continent"
            >
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('exit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}