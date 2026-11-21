import { ImageResponse } from "next/og";

export const alt = "Chicas SC — Una pasión que nos une. Comunidad de hinchas de Sporting Cristal.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#1B265C", color: "white", borderBottom: "20px solid #6ac5fd" }}>
      <div style={{ display: "flex", color: "#6ac5fd", fontSize: 28, letterSpacing: 6 }}>UNA MISMA PASIÓN CELESTE</div>
      <div style={{ display: "flex", marginTop: 24, fontSize: 126, fontWeight: 700, letterSpacing: -5 }}>CHICAS SC</div>
      <div style={{ display: "flex", marginTop: 24, fontSize: 34 }}>Comunidad de hinchas de Sporting Cristal</div>
    </div>, size,
  );
}
