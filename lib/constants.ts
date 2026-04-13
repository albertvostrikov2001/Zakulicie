/** Контакты-заглушки; заменить в CMS / env при запуске. */
export const CONTACT_PHONE = "+7 (383) 209-44-90";
export const CONTACT_PHONE_TEL = "+73832094490";
export const CONTACT_EMAIL = "hello@zakulicie.ru";

export const EVENT_TYPE_OPTIONS = [
  { value: "corporate", label: "Корпоративное" },
  { value: "business", label: "Деловое" },
  { value: "team", label: "Тимбилдинг" },
  { value: "promo", label: "Рекламная акция" },
  { value: "opening", label: "Открытие" },
  { value: "other", label: "Другое" },
] as const;
