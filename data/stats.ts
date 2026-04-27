export type StatItem = {
  value: number;
  suffix: string;
  unit: string;
  label: string;
  /** Подстрока под цифрой, мелким */
  detail: string;
};

export const siteStats: StatItem[] = [
  {
    value: 20,
    suffix: "",
    unit: "",
    label: "ЛЕТ НА РЫНКЕ",
    detail: "с 2004 года",
  },
  {
    value: 3000,
    suffix: "+",
    unit: "",
    label: "МЕРОПРИЯТИЙ",
    detail: "реализовано",
  },
  {
    value: 50,
    suffix: "+",
    unit: "",
    label: "ФЕДЕРАЛЬНЫХ БРЕНДОВ",
    detail: "среди клиентов",
  },
  {
    value: 8000,
    suffix: "",
    unit: "",
    label: "МАКС. ОХВАТ",
    detail: "участников в одном событии",
  },
];
