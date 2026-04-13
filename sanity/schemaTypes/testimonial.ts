import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Отзыв",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Текст", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "author", title: "Автор", type: "string" }),
    defineField({ name: "position", title: "Должность", type: "string" }),
    defineField({ name: "company", title: "Компания", type: "string" }),
    defineField({ name: "photo", title: "Фото", type: "image", options: { hotspot: true } }),
    defineField({
      name: "relatedCase",
      title: "Связанный кейс",
      type: "reference",
      to: [{ type: "case" }],
    }),
  ],
});
