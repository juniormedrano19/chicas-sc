import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import type { ContactInput } from "./schema";

export interface NormalizedContactSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  consent: boolean;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

export interface ContactRepository {
  submit(input: ContactInput): Promise<{ id: string }>;
}

export const contactRepository: ContactRepository = {
  async submit(input: ContactInput) {
    // Generar documento con ID normalizado y predecible en Firestore
    const collectionRef = collection(firestore, "contactSubmissions");
    const docRef = doc(collectionRef);
    const id = docRef.id;

    const normalizedData: NormalizedContactSubmission = {
      id,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      whatsapp: input.whatsapp ? input.whatsapp.trim() : null,
      message: input.message.trim(),
      consent: input.consent,
      status: "new",
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, normalizedData);

    return { id };
  },
};
