'use client';
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";

export default function Contacto() {
  const { language } = useLanguage();
  const C = content[language];
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: C.contact.toast.title,
      description: C.contact.toast.description,
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-headline text-5xl md:text-6xl uppercase">
              {C.contact.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {C.contact.subtitle}
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-lg">{C.contact.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <span className="text-lg">{C.contact.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-lg">{C.contact.email}</span>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="text" placeholder={C.contact.form.name} required />
              <Input type="email" placeholder={C.contact.form.email} required />
              <Textarea placeholder={C.contact.form.message} required rows={5}/>
              <Button type="submit" size="lg" className="w-full font-bold">{C.contact.form.submit}</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
