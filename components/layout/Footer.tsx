import { Facebook, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Contacto from "./Contacto";
import RightsReserved from "./RightsReserved";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4">
        <Contacto />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src={"/infanteLogo.png"} alt={"Infante Boxing Club Logo"} width={40} height={40} className="rounded-full" />
            <span className="font-headline text-xl tracking-wide">Infante Boxing Club</span>
          </div>
          
          <Link href={"https://www.instagram.com/fisiomed_cc/"} className="hover:brightness-[0.8] transition-all duration-300 group cursor-pointer">
            <Image src={"/fisiomedLogo.jpg"} alt={"Fisiomed"} width={150} height={150} className="max-" />
          </Link>
          

          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=100088583096544" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://www.instagram.com/infanteboxing_club/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
             <a href="mailto:geral@associacaoinfate.pt" className="text-muted-foreground hover:text-primary">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
        <RightsReserved />

      </div>
    </footer>
  );
};

export default Footer;
