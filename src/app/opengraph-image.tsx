import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const alt = "CREX - IPL Cricket Intelligence";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "linear-gradient(135deg, #fff7f3 0%, #ffffff 48%, #ffe0d2 100%)",
          color: "#0A0F1E",
          display: "flex",
          height: "100%",
          width: "100%",
          padding: "48px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #C0392B 100%)",
            borderRadius: "36px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "42px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: "999px",
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "12px 20px",
                textTransform: "uppercase",
              }}
            >
              IPL Intelligence
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.16)",
                borderRadius: "24px",
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                padding: "18px 24px",
              }}
            >
              Live. Analytics. Fantasy.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "820px" }}>
            <div style={{ display: "flex", fontSize: 104, fontWeight: 900, letterSpacing: "0.06em", lineHeight: 1, textTransform: "uppercase" }}>
              CREX
            </div>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 700, lineHeight: 1.1 }}>
              Feel every IPL moment with live scores, analytics, and fantasy insight.
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            {["10 Teams", "74 Matches", "Live Win Probability"].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "999px",
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 600,
                  padding: "14px 22px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
