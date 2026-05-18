import type { ServiceSlug } from "@/lib/types";

/** Visible section headings per service landing — overrides defaults in `[slug]/page`. */
export type ServiceSectionTitles = {
  /** Optional intro block directly under hero */
  introH2?: string;
  includesH2: string;
  whyH2: string;
  casesH2: string;
  leadH2: string;
};

const DEFAULTS: ServiceSectionTitles = {
  includesH2: "Что включает услуга",
  whyH2: "Почему «Закулисье»",
  casesH2: "Релевантные кейсы",
  leadH2: "Обсудить проект",
};

const OVERRIDES: Partial<Record<ServiceSlug, Partial<ServiceSectionTitles>>> = {
  "korporativnye-meropriyatiya": {
    introH2: "Корпоративы, внутренние события и мероприятия для сотрудников",
    includesH2: "Что входит в организацию корпоративного мероприятия",
    whyH2: "Почему компании доверяют нам корпоративные события",
    casesH2: "Кейсы корпоративных мероприятий",
    leadH2: "Обсудить корпоративное мероприятие",
  },
  "delovye-meropriyatiya": {
    introH2: "Конференции, дилерские съезды, открытия и бизнес-события",
    includesH2: "Форматы деловых мероприятий",
    whyH2: "Подход к организации деловых мероприятий",
    casesH2: "Кейсы деловых событий",
    leadH2: "Обсудить деловое мероприятие",
  },
  timbilding: {
    introH2: "Сценарии тимбилдинга под задачи бизнеса",
    includesH2: "Форматы командных событий",
    whyH2: "Почему тимбилдинг заказывают у «Закулисья»",
    casesH2: "Кейсы командных мероприятий",
    leadH2: "Подобрать формат командного события",
  },
};

export function getServiceSectionTitles(slug: ServiceSlug): ServiceSectionTitles {
  return { ...DEFAULTS, ...(OVERRIDES[slug] ?? {}) };
}
