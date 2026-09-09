export const navLinks = [
  { label: "Quiénes somos", href: "/#quienes-somos" },
  { label: "Nosotras", href: "/#nosotras" },
  { label: "Partidos", href: "/#partidos" },
  { label: "Recuerdos", href: "/#recuerdos" },
  { label: "Comunidad", href: "/#redes" },
];
export type Member = {
  name: string;
  role: string;
  initials: string;
  number: string;
  quote: string;
  image?: string;
};

export const members: Member[] = [
  {
    name: "Laura",
    role: "Coordinación",
    initials: "VA",
    number: "01",
    quote: "La celeste nació conmigo y se lleva en el corazón. Gracias a Sporting Cristal por darme tantas alegrías. En las buenas y malas siempre. Fuerza Cristal!!",
    image:"/images/integrantes/laura.jpeg"
  },
  {
    name: "Sol",
    role: "Comunidad",
    initials: "CA",
    number: "02",
    quote: "La mejor tribuna es la que compartimos.",
        image:"/images/integrantes/sol.jpeg"
  },
  {
    name: "Estrella",
    role: "Comunicaciones",
    initials: "LU",
    number: "03",
    quote: "Cada encuentro merece ser recordado.",
         image:"/images/integrantes/estrella.jpeg"
  },
  {
    name: "Andrea",
    role: "Encuentros",
    initials: "AN",
    number: "04",
    quote: "Siempre hay lugar para una celeste más.",
  },
  {
    name: "Integrante 5",
    role: "Integrante",
    initials: "DA",
    number: "05",
    quote: "Juntas, en las buenas y en las malas.",
  },
  {
    name: "Integrante 6",
    role: "Integrante",
    initials: "MA",
    number: "06",
    quote: "Una camiseta, miles de historias.",
  },
];
export type Testimonial = {
  name: string;
  text: string;
  tag: string;
  image?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Laura",
    text: "Llegué por el amor a Cristal. Me quedé por las amigas que encontré en el camino.",
    tag: "Chica SC",
      image: "/images/integrantes/laura.jpeg",
  },
  {
    name: "Sol",
    text: "Compartir un gol, una previa, una tarde de fútbol… con ellas todo se vive más bonito.",
    tag: "Chica SC",
          image: "/images/integrantes/sol.jpeg",
  },
  {
    name: "Estrella",
    text: "Aquí todas tenemos algo en común: una pasión que no se explica, se vive.",
      tag: "Chica SC",
            image: "/images/integrantes/estrella.jpeg",
  },
];
export const faqs = [
  {
    q: "¿Qué es Chicas SC?",
    a: "Somos una comunidad de chicas que comparte su pasión por Sporting Cristal. Este es un espacio para encontrarnos, alentar y construir amistades alrededor de la celeste. Somos una comunidad independiente del club.",
  },
  {
    q: "¿Cómo puedo formar parte del grupo?",
    a: "Cuéntanos un poco de ti en el formulario de contacto y selecciona la casilla de consentimiento. Cuando el canal esté habilitado, el equipo podrá responderte con los siguientes pasos.",
  },
  {
    q: "¿Necesito ir a todos los partidos?",
    a: "La idea es compartir la pasión a tu ritmo. Puedes sumarte a los encuentros que se ajusten a tu disponibilidad; los detalles de participación se coordinan con el grupo.",
  },
  {
    q: "¿Cómo me entero de los próximos encuentros?",
    a: "Publicaremos las fechas confirmadas en esta página y los canales oficiales del grupo cuando estén disponibles.",
  },
  {
    q: "¿Puedo proponer una colaboración?",
    a: "¡Sí! Escríbenos tu propuesta desde el formulario de contacto. Nos interesa conocer iniciativas que aporten a nuestra comunidad.",
  },
];
