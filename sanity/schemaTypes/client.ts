import { defineField, defineType } from "sanity";

export const clientBrand = defineType({
  name: "client",
  title: "Клиент",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Название", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Логотип (моно)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "industry", title: "Отрасль", type: "string" }),
    defineField({ name: "isVisible", title: "Показывать на сайте", type: "boolean", initialValue: true }),
  ],
});
