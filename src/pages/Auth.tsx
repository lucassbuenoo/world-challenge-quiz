import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Globe, User, Mail, Calendar, Phone, MapPin, Lock } from 'lucide-react';

export function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    phone: '',
    country: ''
  });

  // Check for password reset flow
  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      setIsResetPassword(true);
      setIsLogin(false);
      setIsForgotPassword(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Handle password reset
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth?reset=true`
        });
        
        if (error) {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email enviado!",
            description: "Verifique sua caixa de entrada para redefinir a senha.",
          });
          setIsForgotPassword(false);
        }
      } else if (isResetPassword) {
        // Handle new password update
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Erro",
            description: "As senhas não coincidem",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 6) {
          toast({
            title: "Erro",
            description: "A senha deve ter pelo menos 6 caracteres",
            variant: "destructive",
          });
          return;
        }

        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase.auth.updateUser({
          password: formData.password
        });

        if (error) {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Senha redefinida!",
            description: "Sua senha foi alterada com sucesso.",
          });
          navigate('/');
        }
      } else if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Erro no login",
            description: error,
            variant: "destructive",
          });
        } else {
          navigate('/');
        }
      } else {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Erro no cadastro",
            description: "As senhas não coincidem",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 6) {
          toast({
            title: "Erro no cadastro",
            description: "A senha deve ter pelo menos 6 caracteres",
            variant: "destructive",
          });
          return;
        }

        const { error } = await signUp(formData);
        if (error) {
          toast({
            title: "Erro no cadastro", 
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Conta criada!",
            description: "Sua conta foi criada com sucesso.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-quiz-continent/5 to-background flex items-center justify-center p-4">
      <LanguageSelector position="top-right" />
      
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm border-2 border-quiz-continent/30">
        <div className="text-center mb-6">
          <Globe className="w-12 h-12 text-quiz-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">
            {isResetPassword ? 'Nova Senha' : (isForgotPassword ? 'Recuperar Senha' : (isLogin ? t('welcome') : t('createAccount')))}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isResetPassword ? 'Digite sua nova senha' : (isForgotPassword ? 'Digite seu email para receber o link de recuperação' : (isLogin ? t('enterCredentials') : t('fillForm')))}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !isForgotPassword && !isResetPassword && (
            <>
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="birthdate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('birthdate')}
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('country')}
                </Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required={!isResetPassword}
              className="mt-1"
              disabled={isResetPassword}
            />
          </div>

          {(!isForgotPassword && !isResetPassword) || (isResetPassword) ? (
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {isResetPassword ? 'Nova Senha' : t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
            </div>
          ) : null}

          {(!isLogin && !isForgotPassword) || isResetPassword ? (
            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {isResetPassword ? 'Confirmar Nova Senha' : 'Confirmar Senha'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="quiz"
          >
            {loading ? t('loading') : (
              isResetPassword ? 'Redefinir Senha' : 
              isForgotPassword ? 'Enviar Email' : 
              (isLogin ? t('signIn') : t('signUp'))
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!isForgotPassword && !isResetPassword ? (
            <>
              <p className="text-muted-foreground">
                {isLogin ? t('noAccount') : t('haveAccount')}
              </p>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-quiz-gold"
              >
                {isLogin ? t('signUp') : t('signIn')}
              </Button>
              
              {isLogin && (
                <div>
                  <Button
                    variant="link"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-muted-foreground hover:text-quiz-gold"
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
              )}
            </>
          ) : !isResetPassword ? (
            <Button
              variant="link"
              onClick={() => {
                setIsForgotPassword(false);
                setIsLogin(true);
              }}
              className="text-quiz-gold"
            >
              Voltar ao Login
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}