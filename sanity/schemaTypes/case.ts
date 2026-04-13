import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "case",
  title: "Кейс",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Название", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (транслит)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "client", title: "Клиент", type: "string" }),
    defineField({
      name: "serviceType",
      title: "Тип услуги",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({ name: "year", title: "Год", type: "number" }),
    defineField({ name: "participantsCount", title: "Участников", type: "number" }),
    defineField({ name: "scaleLabel", title: "Масштаб (строка)", type: "string" }),
    defineField({ name: "excerpt", title: "Кратко", type: "text", rows: 2 }),
    defineField({ name: "task", title: "Задача", type: "text", rows: 4 }),
    defineField({ name: "solution", title: "Решение", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "result", title: "Результат", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "resultNumbers",
      title: "Цифры результата",
      type: "array",
      of: [
        {
          type: "object",
          name: "resultNumber",
          fields: [
            { name: "label", title: "Подпись", type: "string" },
            { name: "value", title: "Значение", type: "string" },
          ],
        },
      ],
    }),
    defineField({ name: "heroImage", title: "Hero-изображение", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroVideo", title: "Hero-видео (URL)", type: "url" }),
    defineField({
      name: "gallery",
      title: "Галерея",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "clientQuote",
      title: "Цитата клиента",
      type: "object",
      fields: [
        { name: "text", title: "Текст", type: "text", rows: 4 },
        { name: "author", title: "Автор", type: "string" },
        { name: "position", title: "Должность", type: "string" },
        { name: "company", title: "Компания", type: "string" },
      ],
    }),
    defineField({ name: "isFeatured", title: "Флагманский", type: "boolean", initialValue: false }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", client: "client", year: "year" },
    prepare({ title, client, year }) {
      return { title, subtitle: [client, year].filter(Boolean).join(" · ") };
    },
  },
});
