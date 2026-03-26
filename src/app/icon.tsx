import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #FF6B35 0%, #C0392B 100%)",
          borderRadius: "16px",
          color: "white",
          display: "flex",
          fontSize: 34,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.08em",
          width: "100%",
        }}
      >
        CX
      </div>
    ),
    size
  );
}
