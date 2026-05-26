export type BrandDisplayData =
  | { type: "logo"; logoSrc: string; logoAlt: string }
  | { type: "text" };

export interface ClientData {
  id: string;
  brandName: string;
  display: BrandDisplayData;
  backText: string;
}

/** 12 confirmed clients from case portfolio */
export const clients: ClientData[] = [
  {
    id: "metall-profil",
    brandName: "Металл Профиль",
    display: { type: "text" },
    backText: "Стратегическая сессия и парусный тимбилдинг для дилеров",
  },
  {
    id: "lerua-merlen",
    brandName: "Леруа Мерлен",
    display: { type: "text" },
    backText: "Открытие гипермаркета в Кемерово — городское событие",
  },
  {
    id: "alfa-bank",
    brandName: "Альфа-Банк",
    display: { type: "text" },
    backText: "Серия открытий офисов — репутационный формат",
  },
  {
    id: "sts",
    brandName: "СТС",
    display: { type: "text" },
    backText: "Юбилейная церемония — 25 лет в эфире",
  },
  {
    id: "warmex",
    brandName: "Warmex",
    display: { type: "text" },
    backText: "Family Day с юбилеем компании — 500+ человек",
  },
  {
    id: "promeko",
    brandName: "Промэко",
    display: { type: "text" },
    backText: "Тимбилдинг на открытом воздухе — 800 участников",
  },
  {
    id: "zolotoe-yabloko",
    brandName: "Золотое Яблоко",
    display: { type: "text" },
    backText: "День рождения бренда, рекламное и обучающее мероприятие",
  },
  {
    id: "suek",
    brandName: "СУЭК",
    display: { type: "text" },
    backText: "День шахтёра — 8 000 гостей и большая сцена",
  },
  {
    id: "bolotninskaya",
    brandName: "Болотнинская Гофротара",
    display: { type: "text" },
    backText: "Юбилей производства, городское событие",
  },
  {
    id: "chistaya-sloboda",
    brandName: "Чистая Слобода",
    display: { type: "text" },
    backText: "Серия имиджевых мероприятий ЖК",
  },
  {
    id: "sibmoll",
    brandName: "СибМолл",
    display: { type: "text" },
    backText: "Рекламные акции, выставки, фестивали на территории ТЦ",
  },
  {
    id: "artdom",
    brandName: "АртДом",
    display: { type: "text" },
    backText: "Всероссийская дизайнерская конференция, обучающее и рекламное мероприятие",
  },
];
