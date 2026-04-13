import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({ name: "logo", title: "Логотип", type: "image" }),
    defineField({ name: "phone", title: "Телефон", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Соцсети",
      type: "array",
      of: [
        defineField({
          name: "link",
          type: "object",
          fields: [
            { name: "label", title: "Подпись", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        }),
      ],
    }),
    defineField({ name: "heroVideo", title: "Hero-видео (URL)", type: "url" }),
    defineField({ name: "metaDefaults", title: "SEO по умолчанию", type: "text", rows: 3 }),
  ],
});
