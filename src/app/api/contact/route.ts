import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { contactSchema } from "@/features/contact/schema";
import { firestore } from "@/lib/firebase/client";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(request.url).origin &&
    origin !== process.env.APP_ORIGIN
  ) {
    return NextResponse.json(
      { error: "Origen no permitido." },
      { status: 403 },
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Formato no válido." }, { status: 415 });
  }

  // Bound bytes before parsing, including requests without Content-Length.
  let raw = "";
  const reader = request.body?.getReader();
  if (!reader) {
    return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  const decoder = new TextDecoder();
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Mensaje demasiado largo." },
          { status: 413 },
        );
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer el mensaje." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Mensaje no válido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los campos del formulario." },
      { status: 422 },
    );
  }

  if (process.env.CONTACT_ENABLED === "false") {
    return NextResponse.json(
      { error: "El canal de contacto todavía no está habilitado." },
      { status: 503 },
    );
  }

  const { name, email, message, whatsapp } = parsed.data;

  try {
    await addDoc(collection(firestore, "contactSubmissions"), {
      name,
      email,
      whatsapp: whatsapp || null,
      message,
      consentAt: serverTimestamp(),
      status: "new",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Error saving contact message to Firestore:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu mensaje. Intenta más tarde." },
      { status: 500 },
    );
  }
}
