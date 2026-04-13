import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Статья блога",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Заголовок", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Лид", type: "text", rows: 3 }),
    defineField({ name: "content", title: "Контент", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "coverImage", title: "Обложка", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", title: "Дата публикации", type: "datetime" }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
  ],
});
