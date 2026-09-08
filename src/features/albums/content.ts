export type AlbumPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Album = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: AlbumPhoto[];
  isExample: boolean;
};

const history: AlbumPhoto = {
  src: "/images/history.jpg",
  width: 1600,
  height: 380,
  alt: "Referentes de la historia de Sporting Cristal",
  caption: "Imagen de referencia del Club Sporting Cristal, no del grupo.",
};
const terrace: AlbumPhoto = {
  src: "/images/terrace.jpg",
  width: 1920,
  height: 2000,
  alt: "Imagen de referencia de la tribuna celeste",
  caption: "Fondo de referencia del Club Sporting Cristal, no del grupo.",
};

const previasPhotos: AlbumPhoto[] = [
  { src: "/images/somos/foto1.jpeg", width: 1440, height: 1798, alt: "Chicas SC reunidas antes de un partido", caption: "La previa empieza cuando nos volvemos a encontrar." },
  { src: "/images/somos/foto2.jpeg", width: 1440, height: 1626, alt: "Integrantes de Chicas SC en una previa", caption: "Celeste, amigas y una misma pasión." },
  { src: "/images/somos/foto3.jpeg", width: 1440, height: 1440, alt: "Recuerdo de Chicas SC", caption: "Un momento para guardar." },
  { src: "/images/somos/foto4.jpeg", width: 1440, height: 1920, alt: "Encuentro de Chicas SC antes del partido", caption: "Donde la emoción se hace familia." },
  { src: "/images/somos/foto5.jpeg", width: 1440, height: 1920, alt: "Chicas SC compartiendo una previa", caption: "Siempre listas para alentar." },
];

// Replace these examples with authorized group albums and photographs.
export const albums: Album[] = [
  { slug: "una-tarde-celeste", title: "Una tarde celeste", description: "Los encuentros que queremos guardar para siempre.", cover: history.src, photos: [history], isExample: true },
  { slug: "juntas-en-la-tribuna", title: "Juntas en la tribuna", description: "Un mismo aliento y muchas historias por compartir.", cover: terrace.src, photos: [terrace], isExample: true },
  { slug: "amistad-en-celeste", title: "Amistad en celeste", description: "Recuerdos que nacen dentro y fuera de la cancha.", cover: history.src, photos: [history], isExample: true },
  { slug: "nuestras-previas", title: "Nuestras previas", description: "La emoción de encontrarnos antes de cada partido.", cover: previasPhotos[0].src, photos: previasPhotos, isExample: false },
  { slug: "pasion-compartida", title: "Pasión compartida", description: "Una camiseta que nos reúne y nos inspira.", cover: history.src, photos: [history], isExample: true },
  { slug: "momentos-para-recordar", title: "Momentos para recordar", description: "Pequeños momentos que se convierten en grandes recuerdos.", cover: terrace.src, photos: [terrace], isExample: true },
];

export function getAlbum(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}
