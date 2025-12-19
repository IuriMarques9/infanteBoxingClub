'use client';
import { Mail, Phone } from "lucide-react";
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

export default function Contacto() {
	const { language } = useLanguage();
	const C = content[language];
	const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: language === 'pt' ? "O nome deve ter pelo menos 2 caracteres." : "Name must be at least 2 characters." }),
    email: z.string().email({ message: language === 'pt' ? "Por favor, insira um email válido." : "Please enter a valid email address." }),
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
      message: "",
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
        console.log(response.status, await response.text())
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
                <Phone stroke="#CEA755" className="h-6 w-6" />
                <span className="text-lg">{C.contact.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail stroke="#CEA755" className="h-6 w-6" />
                <span className="text-lg">{C.contact.email}</span>
              </div>
            </div>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">{C.contact.form.name}</FormLabel>
                      <FormControl>
                        <Input placeholder={C.contact.form.name} {...field} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
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
                        <Input placeholder={C.contact.form.email} {...field} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
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
                        <Textarea placeholder={C.contact.form.message} {...field} rows={5} className="bg-background/20 border-primary-foreground/50 placeholder:text-primary-foreground/70" />
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
                          className="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-secondary"
						            />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                         {C.contact.form.privacyPolicy.preLink}{' '}
                          <Link href="/privacy-policy" className="underline font-bold hover:text-primary">
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
                  className="w-full font-bold bg-primary-foreground text-white hover:bg-primary-foreground/90"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? C.contact.form.submitLoader : C.contact.form.submit}
                </Button>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

