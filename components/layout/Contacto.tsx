'use client';
import { Mail, Phone } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

export default function Contacto() {
  const { language } = useLanguage();
  const C = content[language];

  const formSchema = z.object({
    name: z.string().min(2, { message: language === 'pt' ? "O nome deve ter pelo menos 2 caracteres." : "Name must be at least 2 characters." }),
    email: z.string().email({ message: language === 'pt' ? "Por favor, insira um email válido." : "Please enter a valid email address." }),
    message: z.string().min(10, { message: language === 'pt' ? "A mensagem deve ter pelo menos 10 caracteres." : "Message must be at least 10 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });


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
                <Phone stroke="var(--primary)" className="h-6 w-6" />
                <span className="text-lg">{C.contact.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail stroke="var(--primary)" className="h-6 w-6" />
                <span className="text-lg">{C.contact.email}</span>
              </div>
            </div>
          </div>
          <div>
            <Form {...form}>
              <form 
                action={`https://formsubmit.co/associacao.infante@gmail.com`} 
                method="POST"
                className="space-y-4"
              >
                {/* FormSubmit specific fields */}
                <input type="hidden" name="_template" value="table" /> {/* Email Template */}
                <input type="hidden" name="_captcha" value="false" /> {/* ReCaptcha Remove */}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">{C.contact.form.name}</FormLabel>
                      <FormControl>
                        <Input placeholder={C.contact.form.name} {...field} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
                      </FormControl>
                      <FormMessage className="text-background" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">{C.contact.form.email}</FormLabel>
                      <FormControl>
                        <Input placeholder={C.contact.form.email} {...field} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
                      </FormControl>
                      <FormMessage className="text-background" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">{C.contact.form.message}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={C.contact.form.message} {...field} rows={5} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
                      </FormControl>
                      <FormMessage className="text-background" />
                    </FormItem>
                  )}
              />
                <Button type="submit" size="lg" className="w-full font-bold bg-primary-foreground text-primary hover:bg-primary-foreground/90">{C.contact.form.submit}</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
