import type { BrandDisplayData } from "@/data/clients";
import Image from "next/image";

interface BrandDisplayProps {
  display: BrandDisplayData;
  brandName: string;
}

export function BrandDisplay({ display, brandName }: BrandDisplayProps) {
  if (display.type === "logo") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={display.logoSrc}
            alt={display.logoAlt}
            width={120}
            height={60}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.45,
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-body)",
            textAlign: "center",
          }}
        >
          {brandName}
        </span>
      </div>
    );
  }

  return (
    <span
      style={{
        fontSize: "clamp(13px, 1.5vw, 18px)",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "var(--color-text-primary)",
        textAlign: "center",
        fontFamily: "var(--font-display)",
        lineHeight: 1.2,
        display: "block",
      }}
    >
      {brandName}
    </span>
  );
}
