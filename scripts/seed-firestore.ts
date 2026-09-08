import nextEnv from "@next/env";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc } from "firebase/firestore";

import { sofascoreSeed } from "../src/features/matches/sofascore-seed-data.ts";

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
const batch = writeBatch(firestore);

for (const { teamId, data } of sofascoreSeed.teams) {
  batch.set(doc(firestore, "teams", teamId), data, { merge: true });
}

for (const { leagueId, data } of sofascoreSeed.leagues) {
  batch.set(doc(firestore, "leagues", leagueId), data, { merge: true });
}

for (const { matchId, data } of sofascoreSeed.matches) {
  const { kickoffAtSeconds, ...match } = data;
  batch.set(
    doc(firestore, "matches", matchId),
    { ...match, kickoffAt: new Date(kickoffAtSeconds * 1000) },
    { merge: true },
  );
}

await batch.commit();

console.log(
  `Firestore seeded: ${sofascoreSeed.teams.length} teams, ${sofascoreSeed.leagues.length} leagues, ${sofascoreSeed.matches.length} matches.`,
);
