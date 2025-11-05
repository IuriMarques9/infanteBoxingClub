
'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/language-context';
import { content } from '../../lib/content';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const C = content[language].privacyPolicy;

  return (
    <>
      <Header />
      <main className="flex-grow bg-secondary">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="mb-8">
            <nav className="flex items-center text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                {C.breadcrumbHome}
              </Link>
              <ChevronRight size={18} className="mx-1" />
              <span className="text-foreground">{C.title}</span>
            </nav>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-4xl md:text-5xl uppercase tracking-wider">{C.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-lg text-muted-foreground">{C.intro}</p>

              {C.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-headline text-2xl text-primary">{section.title}</h3>
                  {section.content.type === 'paragraph' && (
                    <p className="text-muted-foreground">{section.content.text}</p>
                  )}
                  {section.content.type === 'list' && (
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {section.content.items?.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.content.type === 'contact' && section.content.details && (
                     <div>
                        <p className="text-muted-foreground">{section.content.text}</p>
                        <div className="mt-2 space-y-1">
                           <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {section.content.details.email}</p>
                           <p className="text-muted-foreground"><span className="font-semibold text-foreground">{C.phoneLabel}:</span> {section.content.details.phone}</p>
                        </div>
                     </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
