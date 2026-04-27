'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// O `LanguageProvider` agora recebe a língua determinada pela URL
// (`/[lang]/...`) via prop. O switcher chama `setLanguage()` que
// faz `router.replace()` para a versão localizada do mesmo path,
// preservando query/hash.
export const LanguageProvider = ({ children, initialLanguage = 'pt' }: { children: ReactNode; initialLanguage?: Language }) => {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  // Mantém o state em sync se a URL mudar (ex.: navigation de history).
  useEffect(() => { setLanguageState(initialLanguage) }, [initialLanguage])

  function setLanguage(next: Language) {
    if (next === language) return
    // Persistir preferência durante 1 ano para o middleware respeitar
    // na próxima visita à raiz `/`.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    // Substituir prefixo /pt ou /en pelo novo, mantendo o resto do path.
    const segments = pathname.split('/')
    if (segments[1] === 'pt' || segments[1] === 'en') {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    const newPath = segments.join('/') || '/'
    setLanguageState(next)
    router.replace(newPath)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
