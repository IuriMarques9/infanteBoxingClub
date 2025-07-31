import { Russo_One } from "next/font/google";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/rootlayout/footers/Footer";
import Header from "@/components/rootlayout/headers/Header";
import ToTopButton from "@/components/rootlayout/ToTopButton";

// Fonte principal (Inter)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fonte secundária (Russo One)
const russoOne = Russo_One({
  variable: "--font-russo-one",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Infante Boxing Club - Website Oficial",
  description: "Bem-vindo ao Infante Boxing Club. Deixa-te de sedentarismo e luta pelo teu bem-estar. Vem treinar connosco!",
  autor: "Iuri Marques, RedDune Solutions"
};

export default function RootLayout({ children }) {
  	return (
		<html lang="pt-pt">
			<body className={`${inter.variable} ${russoOne.variable} antialiased`}>
				{/* Header */}                    
				<Header />
				
				{children}
				
				{/* Botão para voltar ao topo */}
				<ToTopButton />
        
        		{/* Footer */}
				<Footer />
			</body>
		</html>
  );
}
