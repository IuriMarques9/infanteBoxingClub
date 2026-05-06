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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import Link from "next/link";
import { useToast } from "../../hooks/use-toast";

export const SUBJECT_KEYS = ['aula_gratis', 'produto', 'evento', 'geral'] as const
export type SubjectKey = (typeof SUBJECT_KEYS)[number]

interface ContactoProps {
  defaultMessage?: string;
  defaultSubject?: SubjectKey;
}

export default function Contacto({ defaultMessage = "", defaultSubject }: ContactoProps) {
  const { language } = useLanguage();
  const C = content[language];
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: language === 'pt' ? "O nome deve ter pelo menos 2 caracteres." : "Name must be at least 2 characters." }),
    email: z.string().email({ message: language === 'pt' ? "Por favor, insira um email válido." : "Please enter a valid email address." }),
    subject: z.enum(SUBJECT_KEYS, {
      errorMap: () => ({ message: language === 'pt' ? "Por favor escolha um assunto." : "Please choose a subject." }),
    }),
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
      subject: defaultSubject as SubjectKey,
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
              <FormLabel className="sr-only">{C.contact.form.subject}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={C.contact.form.subject} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBJECT_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {C.contact.form.subjects[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
