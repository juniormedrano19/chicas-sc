import nextEnv from "@next/env";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (Object.values(firebaseConfig).some((value) => !value)) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_* values in .env.local.");
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// 1. Limpiar roles anteriores para mantener sólo 001, 002, 003
const rolesSnap = await getDocs(collection(firestore, "roles"));
for (const d of rolesSnap.docs) {
  if (!["001", "002", "003"].includes(d.id)) {
    try {
      await deleteDoc(d.ref);
    } catch {
      // Ignorar
    }
  }
}

// 2. Definir roles con IDs 001, 002, 003
const roles = [
  {
    id: "001",
    nombre: "Superadministrador",
    descripcion:
      "Acceso total, configuración del sistema y administración de usuarios",
    createdAt: new Date().toISOString(),
  },
  {
    id: "002",
    nombre: "Administrador",
    descripcion:
      "Gestión de contenidos, comunidad y configuraciones generales",
    createdAt: new Date().toISOString(),
  },
  {
    id: "003",
    nombre: "Usuario",
    descripcion: "Miembro del equipo con acceso estándar",
    createdAt: new Date().toISOString(),
  },
];

// 3. Crear usuario Junior Medrano (id autogenerado, idRol "001")
// Si ya existe usuario jmedrano2019, lo actualizamos o creamos nuevo
let userDocRef = doc(collection(firestore, "users"));
const usersSnap = await getDocs(collection(firestore, "users"));
const existingUser = usersSnap.docs.find(
  (d) => d.data().usuario === "jmedrano2019",
);

if (existingUser) {
  userDocRef = existingUser.ref;
}

const adminUser = {
  id: userDocRef.id,
  idRol: "001", // Enlazado a 001 (Superadministrador)
  codigo: "001JMM",
  urlAvatar: "",
  nombres: "Junior",
  apellidos: "Medrano",
  usuario: "jmedrano2019",
  isBlocked: false,
  createdAt: new Date().toISOString(),
};

// 4. Escribir batch
const batch = writeBatch(firestore);

for (const role of roles) {
  batch.set(doc(firestore, "roles", role.id), role, { merge: true });
}

batch.set(userDocRef, adminUser, { merge: true });

await batch.commit();

console.log(`✅ Roles configurados con IDs 001, 002, 003:`);
for (const r of roles) {
  console.log(`  - [${r.nombre}]: ID="${r.id}"`);
}

console.log(`✅ Usuario configurado:`);
console.log(
  `  - [${adminUser.nombres} ${adminUser.apellidos}]: ID="${adminUser.id}", idRol="${adminUser.idRol}", usuario="${adminUser.usuario}", codigo="${adminUser.codigo}"`,
);
