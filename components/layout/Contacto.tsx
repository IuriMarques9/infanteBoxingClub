'use client';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useLanguage } from "../../contexts/language-context";
import { content } from "../../lib/content";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../components/ui/form";
import { Checkbox } from "../../components/ui/checkbox";
import Link from "next/link";
import { useToast } from "../../hooks/use-toast";

export const SUBJECT_KEYS = ['aula_gratis', 'produto', 'evento', 'geral'] as const
export type SubjectKey = (typeof SUBJECT_KEYS)[number]

interface ContactoProps {
  defaultMessage?: string;
  defaultSubject?: SubjectKey;
}

export default function Contacto({ defaultMessage = "", defaultSubject = "geral" }: ContactoProps) {
  const { language } = useLanguage();
  const C = content[language];
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: language === 'pt' ? "O nome deve ter pelo menos 2 caracteres." : "Name must be at least 2 characters." }),
    email: z.string().email({ message: language === 'pt' ? "Por favor, insira um email válido." : "Please enter a valid email address." }),
    subject: z.enum(SUBJECT_KEYS),
    message: z.string().min(10, { message: language === 'pt' ? "A mensagem deve ter pelo menos 10 caracteres." : "Message must be at least 10 characters." }),
    privacyPolicy: z.boolean().refine(val => val === true, {
      message: language === 'pt' ? "Tem de aceitar a política de privacidade." : "You must accept the privacy policy.",
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: defaultSubject,
      message: defaultMessage,
      privacyPolicy: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch('/api/emailSender', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: C.contact.toast.success.title,
          description: C.contact.toast.success.description,
        });
        form.reset();
      } else {
        console.log(response.status, await response.text());
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: C.contact.toast.error.title,
        description: C.contact.toast.error.description,
      });
      return;
    }
  }

  function onInvalid(errors: FieldErrors<FormValues>) {
    const errorMessages = Object.values(errors).map(error => error.message).join('\n');
    toast({
      variant: "destructive",
      title: C.contact.toast.error.title,
      description: <div className="whitespace-pre-line">{errorMessages}</div>,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{C.contact.form.name}</FormLabel>
              <FormControl>
                <Input placeholder={C.contact.form.name} {...field} className="bg-background/40 border-white/10 placeholder:text-white/40" />
              </FormControl>
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
                <Input placeholder={C.contact.form.email} {...field} className="bg-background/40 border-white/10 placeholder:text-white/40" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {C.contact.form.subject}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <select
                    {...field}
                    className="appearance-none flex h-11 w-full rounded-md border border-white/10 bg-background/40 px-4 py-2 pr-10 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 cursor-pointer [color-scheme:dark] hover:border-white/20 transition-colors"
                  >
                    {SUBJECT_KEYS.map((key) => (
                      <option key={key} value={key} className="bg-[#0A0A0A] text-white">
                        {C.contact.form.subjects[key]}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </FormControl>
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
                <Textarea placeholder={C.contact.form.message} {...field} rows={6} className="bg-background/40 border-white/10 placeholder:text-white/40" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:text-background"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white/70">
                  {C.contact.form.privacyPolicy.preLink}{' '}
                  <Link href={`/${language}/privacy-policy`} className="underline font-bold hover:text-primary">
                    {C.contact.form.privacyPolicy.linkText}
                  </Link>
                  .
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full font-bold bg-primary text-background hover:bg-primary/90 uppercase tracking-wider"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? C.contact.form.submitLoader : C.contact.form.submit}
        </Button>
      </form>
    </Form>
  );
}
