import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { UserProfile } from './UserProfile';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-quiz-ocean/50 to-quiz-earth/50 backdrop-blur-md shadow-md px-4 py-3 rounded-b-xl overflow-x-hidden">

      <div className="flex justify-between items-center">
        {/* Links Desktop */}
        <div className="hidden md:flex items-center gap-6">
            <Button
            variant="link"
            className="text-white font-semibold hover:text-quiz-gold transition-all duration-300"
            onClick={() => navigate('/')}
          >
            {t('homeMenu')}
          </Button>
          <Button
            variant="link"
            className="text-white font-semibold hover:text-quiz-gold transition-all duration-300"
            onClick={() => navigate('/about')}
          >
            {t('aboutUs')}
          </Button>
          <Button
            variant="link"
            className="text-white font-semibold hover:text-quiz-gold transition-all duration-300"
            onClick={() => navigate('/howtoplay')}
          >
            {t('howToPlayMenu')}
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="link" onClick={toggleMenu} className="text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <LanguageSelector position="inline" />
          </div>
          {user && <UserProfile />}
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 bg-background/90 p-4 rounded-lg shadow-lg animate-fade-in">
          <Button
            variant="link"
            className="text-white font-semibold hover:text-quiz-gold transition-all duration-300"
            onClick={() => { navigate('/about'); setMenuOpen(false); }}
          >
            {t('Sobre Nós')}
          </Button>
          <Button
            variant="link"
            className="text-white font-semibold hover:text-quiz-gold transition-all duration-300"
            onClick={() => { navigate('/comoJogar'); setMenuOpen(false); }}
          >
            {t('Como Jogar')}
          </Button>
        </div>
      )}
    </header>
  );
};
