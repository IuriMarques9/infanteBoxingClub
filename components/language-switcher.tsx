'use client';

import { useLanguage } from '../contexts/language-context';
import { Button } from '../components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'pt' ? 'default' : 'ghost'}
        size="sm"
        className={language === 'pt' ? 'text-white' : 'text-black'}
        onClick={() => setLanguage('pt')}
      >
        PT
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={language === 'en' ? 'text-white' : 'text-black'}
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
