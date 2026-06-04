import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { ContactModalProvider } from "@/components/providers/ContactModalProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — event-агентство Новосибирск`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Премиальное event-агентство в Новосибирске: корпоративные и деловые мероприятия, тимбилдинг, активации, аренда реквизита. 20 лет, 3000+ событий.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    url: siteUrl,
    images: [
      {
        url: "/cases/semejnyj-korporativ-varmix-warmax/cover.webp",
        width: 1920,
        height: 1080,
        alt: "Event-агентство Закулисье — организация мероприятий в Новосибирске",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
    <html lang="ru">
      <body className={`${display.variable} ${body.variable} min-h-screen bg-bg font-body antialiased`}>
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Перейти к содержимому
        </a>
        <SmoothScrollProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </SmoothScrollProvider>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
