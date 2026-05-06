import { Home, Info, ShoppingBag, Calendar, Clock, Mail } from "lucide-react";
import { FC, SVGProps } from "react";
import { BUSINESS, MAPS_EMBED_URL } from "./business";

type IconType = FC<SVGProps<SVGSVGElement>>;

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const navLinksEn: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/contacto", label: "Contact", icon: Mail },
  { href: "/sobre", label: "About us", icon: Info },
];

const navLinksPt: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/contacto", label: "Contacto",  icon: Mail },
  { href: "/sobre", label: "Sobre Nós", icon: Info },
];

export const content = {
  en: {
    metaDescription: "Infante Boxing Club in Olhão. Competition, maintenance, and educational boxing affiliated with the Portuguese Boxing Federation. Start with your 1st class free.",
    navLinks: navLinksEn,
    hero: {
      title: "Infante",
      titleHighlight: "Boxing",
      titleSuffix: "Club",
      subtitle: "Where discipline, strength, and community forge champions inside and outside the ring.",
      cta: "Class Schedule",
      ctaPrimary: "Start Training Now",
    },
    nav: {
      joinCta: "Join Us",
    },
    events: {
      empty: {
        title: "No events scheduled",
        description: "Stay tuned — new events are coming soon.",
      },
    },
    merchExtra: {
      empty: {
        title: "Coming soon",
        description: "Our merchandise will be available shortly.",
      },
      soldOut: "Sold out",
      noImage: "No image available",
      askButton: "Ask about this product",
    },
    modalidadesExtra: {
      noImagePlaceholder: "Photo coming soon",
    },
    status: {
      pago: "Paid",
      atraso: "Overdue",
      isento: "Exempt",
    },
    seguroLabels: {
      dinheiro: "Cash",
      mbway: "MBWay",
    },
    docsCategoria: {
      cc: "ID Document",
      declaracao: "Declaration",
      inspecao_medica: "Medical Inspection",
      seguro: "Insurance",
      autorizacao: "Authorization",
      contrato: "Contract",
      outro: "Other",
    },
    scheduleExtra: {
      subtitleInline: "Find the perfect class to fit your goals and schedule.",
      emptyDay: "Rest",
      fallbackByTurma: "Classes grouped by class below.",
      legendTitle: "Age groups",
      ageSuffix: "yrs",
    },
    nextEvent: {
      title: "Upcoming Event",
      eventName: "Gala Boxe 'Odivelas a PUGNAR'",
      eventDescription: "An evening of intense bouts featuring our top athletes. Get ready for an unforgettable show of skill, heart, and determination.",
      date: "October 26, 2024",
      time: "8:00 PM",
      location: "Pavilhão Multiusos de Odivelas",
      cta: "See more",
    },
    partnerships: {
      eyebrow: "Partners & Sponsors",
      title: "Who trusts us",
      subtitle: "We are backed by companies and institutions that believe in sport, discipline and community.",
    },
    boxingStyles: {
      title: "Find Your Fight",
      subtitle: "We offer different boxing modalities to suit your level and goals.",
      ctaLabel: "Learn More",
      styles: [
        {
          title: "Competition Boxing",
          description: "Competitive Boxing is a nationally and internationally regulated sport. With age, gender, and weight divisions, the competition takes place in a ring, under clear rules and overseen by certified referees. Regular practice develops strength, endurance, coordination, tactical reasoning, and sportsmanship.",
          image: "/boxeCompeticao.png",
          icon: "Trophy",
          horario: "Mon/Wed/Fri · 19h-20h",
          slug: "boxe-competicao",
        },
        {
          title: "Maintenance Boxing",
          description: "Maintenance Boxing is a non-competitive discipline focused on improving physical fitness through training based on boxing methodology. Non-contact technique, combining punching bag exercises, physical circuits, coordination, and joint mobility. Ideal for all ages.",
          image: "/boxeManutencao.png",
          icon: "Dumbbell",
          horario: "Tue/Thu · 19h-20h",
          slug: "boxe-manutencao",
        },
        {
          title: "Educational Boxing",
          description: "Educational Boxing is a methodology recognized by the Portuguese Boxing Federation as an effective means of introducing the sport. Non-contact, it promotes technical, motor, and behavioral training, adapted for different age groups.",
          image: "/boxeEducativo.png",
          icon: "GraduationCap",
          horario: "Mon to Fri · 17h30-19h",
          slug: "boxe-educativo",
        },
      ]
    },
    dailyLife: {
      title: "Day-to-day at the gym",
      subtitle: "The sweat, the focus, the camaraderie. This is what our daily grind looks like.",
      cta: "See More",
    },
    merch: {
      title: "Club Gear",
      subtitle: "Represent Infante Boxing Club with our official merchandise.",
      cta: "Buy Now",
      products: [
        { name: "Boxing Gloves", price: "€49.99" },
        { name: "Club T-Shirt", price: "€24.99" },
        { name: "Training Shorts", price: "€34.99" },
        { name: "Hand Wraps", price: "€9.99" },
      ]
    },
    schedule: {
      title: "Schedule",
      subtitle: "Find the perfect class to fit your goals and schedule.",
      observations: "* Closed on Saturdays and Sundays",
      table: {
        time: "Time",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      },
      classes: [
        "Gatinhos (5-7 years)",
        "Suricatas (8-11 years)",
        "Leões (11-13 years)",
        "Adults",
        "Closed",
        "Open Gym",
        "Women's Class"
      ],
    },
    team: {
      title: "About the Club",
      intro1: "Our association was born from Ricardo Infante's passion for boxing and its positive impact on people's lives. With the unconditional support of family and close friends, the project has grown with purpose and become a local and national reference.",
      intro2: "More than a boxing club, we are a community built on mutual support, respect, and personal development through sport. Our partnership with the Portuguese Boxing Federation reinforces our commitment to quality, rigor, and professionalism.",
      pillars: [
        {
          icon: "Target",
          title: "Technique & Rigor",
          text: "Certified training, Federation-backed methodology, adapted to every age.",
        },
        {
          icon: "Users",
          title: "Community",
          text: "An inclusive environment where everyone is welcome — from kids to seniors.",
        },
        {
          icon: "Heart",
          title: "Transformation",
          text: "Boxing as a tool for personal growth, discipline, and self-confidence.",
        },
      ],
      teamTitle: "Our Team",
      coaches: [
        {
          name: "Ricardo Infante",
        },
        {
          name: "Rafael Ruiz",
        },
      ],
    },
    contact: {
      title: "Contact Us",
      subtitle: "Ready to join? Have a question or suggestion? Contact us—we promise to get back to you as soon as possible!",
      phone: BUSINESS.phone,
      email: BUSINESS.email,
      address: BUSINESS.address.full,
      attendanceHours: BUSINESS.hours.label.en,
      mapsEmbedUrl: MAPS_EMBED_URL,
      infoLabels: {
        phone: "Phone",
        email: "Email",
        address: "Address",
        attendanceHours: "Attendance Hours",
        mapTitle: "Where to find us",
      },
      prefillModalidade: "Hello, I would like to know more about",
      prefillProduto: "Hello, I have a question about the product:",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        subject: "Subject",
        submit: "Send Message",
        submitLoader: "Sending...",
        subjects: {
          aula_gratis: "Free trial class",
          produto: "Store / product question",
          evento: "Event question",
          geral: "General inquiry",
        },
        privacyPolicy: {
          preLink: "I accept the",
          linkText: "Privacy Policy"
        }
      },
      toast: {
        error:{
          title: "Error",
          description: "Something went wrong. Please try again.",
        },
        success:{
          title: "Message Sent!",
          description: "Thanks for reaching out. We'll get back to you shortly.",
        }
      },
    },
    footer: {
      tagline: "Since 2020. Affiliated with the Portuguese Boxing Federation.",
      columns: {
        brand: "Infante Boxing Club",
        nav: "Explore",
        contact: "Contact",
        legal: "Legal",
      },
      nav: [
        { href: "/", label: "Home" },
        { href: "/contacto", label: "Contact" },
        { href: "/sobre", label: "About" },
      ],
      legal: [
        { href: "/privacy-policy", label: "Privacy Policy" },
      ],
      fullForm: "Contact Form →",
    },
     privacyPolicy: {
      breadcrumbHome: "Home",
      backButton: "Back to Home",
      title: "Privacy Policy",
      phoneLabel: "Phone",
      intro: "At Infante Boxing Club, we respect your privacy. This site only collects the personal data (name and email) through the contact form, for the sole purpose of responding to the query or question you sent us.",
      sections: [
        {
          title: "1. What we do with your data:",
          content: {
            type: 'list',
            items: [
              "The data is used exclusively to respond to your contact request.",
              "It is not saved in databases or used for any other purpose.",
              "It is not shared with third parties.",
              "After the response, the data is discarded and not recorded in our systems."
            ]
          }
        },
        {
          title: "2. Legal basis",
          content: {
            type: 'paragraph',
            text: "The processing is based on your explicit consent when filling out and submitting the form."
          }
        },
        {
          title: "3. Contacts",
          content: {
            type: 'contact',
            text: "For any questions about this policy or your data, you can contact us at:",
            details: {
              email: BUSINESS.email,
              phone: BUSINESS.phoneDigits.replace(/^351/, '')
            }
          }
        }
      ]
    },
    rightsReserved: {
      allRights: "All rights reserved to Infante Boxing Club - Powered by ",
    }
  },
  pt: {
    metaDescription: "Infante Boxing Club em Olhão. Boxe de competição, manutenção e educativo afiliado à Federação Portuguesa de Boxe. Começa com a 1ª aula grátis.",
    navLinks: navLinksPt,
    hero: {
      title: "Infante",
      titleHighlight: "Boxing",
      titleSuffix: "Club",
      subtitle: "Luta pelo teu bem-estar. Vem treinar connosco!",
      cta: "Horário das Aulas",
      ctaPrimary: "Começa a Treinar Agora",
    },
    nav: {
      joinCta: "Junta-te a nós",
    },
    events: {
      empty: {
        title: "Sem eventos agendados",
        description: "Fica atento — novos eventos em breve.",
      },
    },
    merchExtra: {
      empty: {
        title: "Brevemente disponível",
        description: "O nosso merchandising estará disponível em breve.",
      },
      soldOut: "Esgotado",
      noImage: "Imagem indisponível",
      askButton: "Pedir info",
    },
    modalidadesExtra: {
      noImagePlaceholder: "Fotografia em breve",
    },
    status: {
      pago: "Pago",
      atraso: "Em atraso",
      isento: "Isento",
    },
    seguroLabels: {
      dinheiro: "Dinheiro",
      mbway: "MBWay",
    },
    docsCategoria: {
      cc: "Documento de Identificação",
      declaracao: "Declaração",
      inspecao_medica: "Inspeção Médica",
      seguro: "Seguro",
      autorizacao: "Autorização",
      contrato: "Contrato",
      outro: "Outro",
    },
    scheduleExtra: {
      subtitleInline: "Encontre a aula perfeita para os seus objetivos e horário.",
      emptyDay: "Descanso",
      fallbackByTurma: "Aulas agrupadas por turma em baixo.",
      legendTitle: "Escalões",
      ageSuffix: "anos",
    },
     nextEvent: {
      title: "Próximo Evento",
      eventName: "Gala Boxe 'Odivelas a PUGNAR'",
      eventDescription: "Uma noite de combates intensos com os nossos melhores atletas. Prepare-se para um espetáculo inesquecível de técnica, coração e determinação.",
      date: "26 de Outubro de 2024",
      time: "20:00",
      location: "Pavilhão Multiusos de Odivelas",
      cta: "Saber Mais",
    },
    partnerships: {
      eyebrow: "Parceiros e Patrocinadores",
      title: "Quem confia em nós",
      subtitle: "Contamos com o apoio de empresas e instituições que acreditam no desporto, na disciplina e na comunidade.",
    },
    boxingStyles: {
      title: "Boxe para Todos: Do Bem-Estar à Alta Competição",
      subtitle: "No nosso clube, todos têm a oportunidade de praticar boxe, seja com o objetivo de melhorar a forma física e manter um estilo de vida saudável, ou com a ambição de competir e evoluir no desporto.",
      ctaLabel: "Saber Mais",
      styles: [
        {
          title: "Boxe de Competição",
          description: "Disciplina regulamentada nacional e internacionalmente. Divisões por idade, sexo e peso, em ringue, com regras claras e árbitros certificados. Desenvolve força, resistência, coordenação, raciocínio tático e espírito desportivo.",
          image: "/boxeCompeticao.png",
          icon: "Trophy",
          horario: "Seg/Qua/Sex · 19h-20h",
          slug: "boxe-competicao",
        },
        {
          title: "Boxe de Manutenção",
          description: "Vertente não competitiva focada na condição física. Técnica sem contacto, com saco de boxe, circuitos, coordenação e mobilidade. Ideal para todas as idades — saúde física e mental num ambiente seguro.",
          image: "/boxeManutencao.png",
          icon: "Dumbbell",
          horario: "Ter/Qui · 19h-20h",
          slug: "boxe-manutencao",
        },
        {
          title: "Boxe Educativo",
          description: "Metodologia reconhecida pela Federação Portuguesa de Boxe para iniciação à modalidade. Sem contacto pleno, promove ensino técnico, motor e comportamental, adaptado a diferentes faixas etárias.",
          image: "/boxeEducativo.png",
          icon: "GraduationCap",
          horario: "Seg a Sex · 17h30-19h",
          slug: "boxe-educativo",
        },
      ]
    },
    dailyLife: {
      title: "O dia-a-dia no ginásio",
      subtitle: "O suor, o foco, a camaradagem. É assim o nosso quotidiano.",
      cta: "Ver Mais",
    },
    merch: {
      title: "Equipamento do Clube",
      subtitle: "Represente o Infante Boxing Club com o nosso merchandise oficial.",
      cta: "Comprar Agora",
      products: [
        { name: "Luvas de Boxe", price: "€49,99" },
        { name: "T-Shirt do Clube", price: "€24,99" },
        { name: "Calções de Treino", price: "€34,99" },
        { name: "Ligas de Mãos", price: "€9,99" },
      ]
    },
    schedule: {
      title: "Horário",
      subtitle: "Encontre a aula perfeita para os seus objetivos e horário.",
      observations: "* Encerrado aos sábados e domingos",
      table: {
        time: "Hora",
        monday: "Segunda",
        tuesday: "Terça",
        wednesday: "Quarta",
        thursday: "Quinta",
        friday: "Sexta",
        saturday: "Sábado",
        sunday: "Domingo",
      },
      classes: [
        "Gatinhos (5-7 anos)",
        "Suricatas (8-11 anos)",
        "Leões (11-13 anos)",
        "Adultos",
        "Fechado",
        "Ginasio Aberto",
        "Boxe Feminino"
      ],
    },
    team: {
      title: "Sobre o Clube",
      intro1: "A nossa associação nasceu da paixão de Ricardo Infante pelo boxe e pelo impacto positivo que pode ter na vida das pessoas. Com o apoio incondicional da família e amigos próximos, o projeto ganhou forma e tornou-se numa referência local e nacional.",
      intro2: "Mais do que um clube de boxe, somos uma comunidade que acredita na entreajuda, no respeito mútuo e no desenvolvimento pessoal através do desporto. A ligação com a Federação Portuguesa de Boxe reforça o nosso compromisso com a qualidade, rigor e profissionalismo.",
      pillars: [
        {
          icon: "Target",
          title: "Técnica e Rigor",
          text: "Treino certificado, metodologia da Federação, adaptado a cada idade.",
        },
        {
          icon: "Users",
          title: "Comunidade",
          text: "Um ambiente inclusivo onde todos são bem-vindos — de crianças a seniores.",
        },
        {
          icon: "Heart",
          title: "Transformação",
          text: "O boxe como ferramenta de crescimento pessoal, disciplina e autoconfiança.",
        },
      ],
      teamTitle: "A Nossa Equipa",
      coaches: [
        {
          name: "Ricardo Infante",
        },
        {
          name: "Rafael Ruiz",
        },
      ],
    },
    contact: {
      title: "Contacte-nos",
      subtitle: "Pronto para se juntar? Tem uma duvida ou sugestão? Entre em contacto connosco prometemos ser o mais breves possveis!",
      phone: BUSINESS.phone,
      email: BUSINESS.email,
      address: BUSINESS.address.full,
      attendanceHours: BUSINESS.hours.label.pt,
      mapsEmbedUrl: MAPS_EMBED_URL,
      infoLabels: {
        phone: "Telefone",
        email: "Email",
        address: "Morada",
        attendanceHours: "Horário de Atendimento",
        mapTitle: "Onde nos encontrar",
      },
      prefillModalidade: "Olá, gostaria de saber mais sobre",
      prefillProduto: "Olá, tenho uma dúvida sobre o produto:",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        subject: "Assunto",
        submit: "Enviar Mensagem",
        submitLoader: "A Enviar...",
        subjects: {
          aula_gratis: "1ª aula grátis",
          produto: "Dúvidas sobre a loja / produto",
          evento: "Dúvidas sobre eventos",
          geral: "Diversos",
        },
        privacyPolicy: {
          preLink: "Eu aceito a",
          linkText: "Política de Privacidade"
        }
      },
      toast: {
        error:{
          title: "Erro!",
          description: "Algo Correu mal. Por favor, tente novamente!",
        },
        success:{
          title: "Mensagem Enviada!",
          description: "Obrigado por contactar. Prometemos ser o mais breves possivel!",
        }
      },
    },
    footer: {
      tagline: "Desde 2020. Afiliado à Federação Portuguesa de Boxe.",
      columns: {
        brand: "Infante Boxing Club",
        nav: "Explorar",
        contact: "Contacto",
        legal: "Legal",
      },
      nav: [
        { href: "/", label: "Início" },
        { href: "/contacto", label: "Contacto" },
        { href: "/sobre", label: "Sobre Nós" },
      ],
      legal: [
        { href: "/privacy-policy", label: "Política de Privacidade" },
      ],
      fullForm: "Formulário de Contacto →",
    },
    rightsReserved: {
      allRights: "Todos os direitos reservados a Infante Boxing Club - Fornecido por ",
    },
    privacyPolicy: {
      breadcrumbHome: "Início",
      backButton: "Voltar ao Início",
      title: "Política de Privacidade",
      phoneLabel: "Telémovel",
      intro: "Na Infante Boxing Club, respeitamos a sua privacidade. Este site apenas recolhe os dados pessoais (nome e email) através do formulário de contacto, com o único objetivo de responder à dúvida ou questão que nos enviou.",
      sections: [
        {
          title: "1. O que fazemos com os seus dados:",
          content: {
            type: 'list',
            items: [
              "Os dados são usados exclusivamente para responder ao seu pedido de contacto.",
              "Não são guardados em bases de dados, nem utilizados para qualquer outra finalidade.",
              "Não são partilhados com terceiros.",
              "Após a resposta, os dados são descartados e não ficam registados nos nossos sistemas."
            ]
          }
        },
        {
          title: "2. Base legal",
          content: {
            type: 'paragraph',
            text: "O tratamento é feito com base no seu consentimento explícito ao preencher e submeter o formulário."
          }
        },
        {
          title: "3. Contactos",
          content: {
            type: 'contact',
            text: "Para qualquer questão sobre esta política ou sobre os seus dados, pode contactar-nos através de:",
            details: {
              email: BUSINESS.email,
              phone: BUSINESS.phoneDigits.replace(/^351/, '')
            }
          }
        }
      ]
    },
    }
};
