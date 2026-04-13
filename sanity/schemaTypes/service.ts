import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Услуга",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Название", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", title: "Кратко", type: "text", rows: 2 }),
    defineField({ name: "fullDescription", title: "Полное описание", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "heroImage", title: "Hero", type: "image", options: { hotspot: true } }),
    defineField({
      name: "benefits",
      title: "Почему мы",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", title: "Заголовок", type: "string" },
            { name: "description", title: "Описание", type: "text", rows: 3 },
          ],
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "question", title: "Вопрос", type: "string" },
            { name: "answer", title: "Ответ", type: "text", rows: 4 },
          ],
        }),
      ],
    }),
    defineField({
      name: "relatedCases",
      title: "Кейсы",
      type: "array",
      of: [{ type: "reference", to: [{ type: "case" }] }],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
  ],
});
