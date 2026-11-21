import { collection, doc, getDoc, getDocs, runTransaction } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import type { Album, AlbumPhoto } from "./content";

export async function getStoredAlbum(slug: string): Promise<Album | null> {
  const snapshot = await getDoc(doc(firestore, "albums", slug));
  if (!snapshot.exists()) return null;
  const photos = await getDocs(collection(firestore, "albums", slug, "photos"));
  const data = snapshot.data();
  return {
    slug: snapshot.id, title: data.title, description: data.description,
    cover: data.cover, isExample: false,
    photos: photos.docs.sort((a, b) => a.data().order - b.data().order)
      .map((photo) => photo.data() as AlbumPhoto),
  };
}

export async function getStoredAlbums(): Promise<Album[]> {
  const snapshot = await getDocs(collection(firestore, "albums"));
  const albums = await Promise.all(snapshot.docs.map((item) => getStoredAlbum(item.id)));
  return albums.filter((album): album is Album => album !== null);
}

export async function saveStoredAlbum(previousSlug: string | null, album: Album) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(album.slug)) throw new Error("El slug solo admite letras minúsculas, números y guiones.");
  if (!album.title.trim() || !album.photos.length) throw new Error("Agrega un título y al menos una foto.");
  if (album.photos.length > 100) throw new Error("Puedes guardar hasta 100 fotos por álbum.");
  const oldSlug = previousSlug ?? album.slug;
  const previousPhotos = await getDocs(collection(firestore, "albums", oldSlug, "photos"));
  await runTransaction(firestore, async (transaction) => {
    const target = doc(firestore, "albums", album.slug);
    const existing = await transaction.get(target);
    if (existing.exists() && previousSlug !== album.slug) throw new Error("Ese slug ya pertenece a otro álbum.");
    if (previousSlug && previousSlug !== album.slug) transaction.delete(doc(firestore, "albums", previousSlug));
    previousPhotos.docs.forEach((photo) => transaction.delete(photo.ref));
    transaction.set(target, {
      title: album.title.trim(), description: album.description.trim(),
      cover: album.photos[0].src, slug: album.slug,
    });
    album.photos.forEach((photo, order) => transaction.set(doc(firestore, "albums", album.slug, "photos", String(order)), { ...photo, order }));
  });
}

export async function deleteStoredAlbum(slug: string) {
  const photos = await getDocs(collection(firestore, "albums", slug, "photos"));
  await runTransaction(firestore, async (transaction) => {
    photos.docs.forEach((photo) => transaction.delete(photo.ref));
    transaction.delete(doc(firestore, "albums", slug));
  });
}
