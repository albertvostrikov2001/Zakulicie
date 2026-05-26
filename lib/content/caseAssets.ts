/** Cover focal points and slug migration for updated cases (2026). */
export type CaseAssetMeta = {
  /** New canonical slug (URL + public/cases folder) */
  slug: string;
  /** Previous slug — gallery/blur-data source before migration */
  legacySlug: string;
  /** CSS object-position for cover images */
  coverFocal: string;
  /** Partial match against asset filename in assets/ */
  assetMatch: string;
};

export const UPDATED_CASE_ASSETS: CaseAssetMeta[] = [
  {
    slug: "spartakiada-metall-profil",
    legacySlug: "spartakiada",
    coverFocal: "center top",
    assetMatch: "65f07c17",
  },
  {
    slug: "yubilej-bolotninskaya-gofrotara",
    legacySlug: "bolotninskaya-gofrotara",
    coverFocal: "center center",
    assetMatch: "4c33cdf3",
  },
  {
    slug: "artdom-dizajn-konferenciya",
    legacySlug: "artdom",
    coverFocal: "center center",
    assetMatch: "a24b08ca",
  },
  {
    slug: "veterinarnyj-forum",
    legacySlug: "veterinarnyy-festival",
    coverFocal: "right center",
    assetMatch: "f962de77",
  },
  {
    slug: "novogodnij-korporativ-alfa-dengi",
    legacySlug: "alfa-dengi-kazino",
    coverFocal: "center bottom",
    assetMatch: "7685e9f3",
  },
  {
    slug: "otkrytie-fontana-centralnyj-park",
    legacySlug: "otkrytie-fontana-ivanushki",
    coverFocal: "center center",
    assetMatch: "22253c5e",
  },
  {
    slug: "yubilej-sts-25-let",
    legacySlug: "25-let-sts",
    coverFocal: "center center",
    assetMatch: "3aa05735",
  },
  {
    slug: "korporativ-lyubimaya-kuhnya",
    legacySlug: "lyubimaya-kuhnya-natalnaaya-karta",
    coverFocal: "center center",
    assetMatch: "d53b5d2a",
  },
  {
    slug: "otkrytie-lerua-merlen-kemerovo",
    legacySlug: "opening-lerua-kemerovo",
    coverFocal: "center center",
    assetMatch: "c53fce61",
  },
  {
    slug: "dr-zolotoe-yabloko-master-klassy",
    legacySlug: "dr-zolotogo-yabloka",
    coverFocal: "left center",
    assetMatch: "e33d82c5",
  },
  {
    slug: "cherno-belyj-fest-sibirskij-moll",
    legacySlug: "sibmoll",
    coverFocal: "center center",
    assetMatch: "3f0b6127",
  },
  {
    slug: "korporativ-metall-profil-ng",
    legacySlug: "novogodniy-russkiy-stil",
    coverFocal: "center center",
    assetMatch: "8d9b5290",
  },
  {
    slug: "semejnyj-korporativ-varmix-warmax",
    legacySlug: "family-day-warmex",
    coverFocal: "center center",
    assetMatch: "ba1af89f",
  },
  {
    slug: "obuchenie-detej-pdd",
    legacySlug: "obuchenie-detej-pdd",
    coverFocal: "center center",
    assetMatch: "2f8bba93",
  },
  {
    slug: "blagotvoritelnyj-bal-detskaya-ploshchadka",
    legacySlug: "blagotvoritelnyy-bal",
    coverFocal: "center top",
    assetMatch: "61c78b61",
  },
  {
    slug: "otkrytie-ofisov-alfa-bank",
    legacySlug: "opening-alfa-bank",
    coverFocal: "center center",
    assetMatch: "14b3bb66",
  },
  {
    slug: "den-shahtera-prokopevsk",
    legacySlug: "den-shahtera",
    coverFocal: "center top",
    assetMatch: "den-shahtera",
  },
  {
    slug: "ceremoniya-ya-volonter",
    legacySlug: "premiya-ya-volonter",
    coverFocal: "center center",
    assetMatch: "546b9b31",
  },
  {
    slug: "ugol-rossii-majning",
    legacySlug: "ugol-rossii-mining",
    coverFocal: "right center",
    assetMatch: "ugol-rossii-majning",
  },
];

export const LEGACY_SLUG_REDIRECTS: Record<string, string> = Object.fromEntries(
  UPDATED_CASE_ASSETS.filter((c) => c.slug !== c.legacySlug).map((c) => [c.legacySlug, c.slug])
);

export function getCaseAssetMeta(slug: string): CaseAssetMeta | undefined {
  return UPDATED_CASE_ASSETS.find((c) => c.slug === slug || c.legacySlug === slug);
}
