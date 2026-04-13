/**
 * Ссылки на изображения Unsplash с параметрами, которые стабильно отдают 200
 * (часть старых URL без ixlib возвращает 404).
 */
export function unsplashPhoto(id: string, width: number, height?: number): string {
  const base = `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=80`;
  return height != null ? `${base}&h=${height}` : base;
}
