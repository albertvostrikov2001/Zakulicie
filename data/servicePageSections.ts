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
    introH2: "Корпоративы, внутренние события и мероприятия для сотрудников и партнёров.",
    includesH2: "Что входит в организацию корпоративного мероприятия",
    whyH2: "Почему стоит нам доверять",
    casesH2: "Кейсы корпоративных мероприятий",
    leadH2: "Обсудить корпоративное мероприятие",
  },
  "delovye-meropriyatiya": {
    includesH2: "Какие задачи решают деловые мероприятия",
    whyH2: "Почему стоит выбирать именно Закулисье",
    casesH2: "Кейсы деловых событий",
    leadH2: "Обсудить деловое мероприятие",
  },
  timbilding: {
    includesH2: "Какие бывают командообразующие форматы",
    whyH2: "Почему стоит заказать тимбилдинг именно у нас",
    casesH2: "Кейсы командных мероприятий",
    leadH2: "Подобрать формат командного события",
  },
  "reklamnye-akcii": {
    includesH2: "Из чего складывается работа",
    whyH2: "Чем мы отличаемся от других агентств",
  },
};

export function getServiceSectionTitles(slug: ServiceSlug): ServiceSectionTitles {
  return { ...DEFAULTS, ...(OVERRIDES[slug] ?? {}) };
}
