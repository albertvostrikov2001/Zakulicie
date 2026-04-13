export const casesQuery = `*[_type == "case"] | order(year desc) {
  _id,
  title,
  "slug": slug.current,
  client,
  "serviceTypeSlug": serviceType->slug.current,
  year,
  participantsCount,
  scaleLabel,
  excerpt,
  task,
  solution,
  result,
  resultNumbers,
  heroImage,
  heroVideo,
  gallery,
  clientQuote,
  isFeatured,
  seoTitle,
  seoDescription
}`;

export const caseBySlugQuery = `*[_type == "case" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  client,
  "serviceTypeSlug": serviceType->slug.current,
  year,
  participantsCount,
  scaleLabel,
  excerpt,
  task,
  solution,
  result,
  resultNumbers,
  heroImage,
  heroVideo,
  gallery,
  clientQuote,
  isFeatured,
  seoTitle,
  seoDescription
}`;

export const blogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  coverImage,
  publishedAt,
  seoTitle,
  seoDescription
}`;

export const blogBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  coverImage,
  publishedAt,
  seoTitle,
  seoDescription
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  text,
  author,
  position,
  company,
  "relatedCaseSlug": relatedCase->slug.current
}`;
