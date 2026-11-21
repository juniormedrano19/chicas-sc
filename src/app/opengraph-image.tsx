import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Escudo blanco de Chicas SC sobre fondo celeste, igual al favicon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), "src/app/apple-icon.png"));
  const source = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#75bee9" }}>
      {/* ImageResponse renders a PNG from this embedded local asset. */}
      <img src={source} alt="Logo de Chicas SC" width={500} height={500} style={{ objectFit: "contain" }} />
    </div>, size,
  );
}
