/** Публичные контакты агентства */
export const CONTACT_PHONE     = "+7 (383) 209-44-90";
export const CONTACT_PHONE_TEL = "+73832094490";
export const CONTACT_EMAIL     = "hello@zakulicie.ru";

/** Дополнительный мобильный (директор) — используется в реквизитах */
export const CONTACT_PHONE_MOBILE     = "+7 923 246-05-05";
export const CONTACT_PHONE_MOBILE_TEL = "+79232460505";

/** Юридический адрес (из реквизитов) */
export const CONTACT_CITY          = "Новосибирск";
export const CONTACT_STREET        = "ул. Революции, 6";
export const CONTACT_POSTAL_CODE   = "630004";

export const EVENT_TYPE_OPTIONS = [
  { value: "corporate", label: "Корпоративное" },
  { value: "business", label: "Деловое" },
  { value: "team", label: "Тимбилдинг" },
  { value: "promo", label: "Рекламная акция" },
  { value: "opening", label: "Открытие" },
  { value: "other", label: "Другое" },
] as const;
