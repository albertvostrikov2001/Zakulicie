import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Image from "@/components/ui/SiteImage";

export const metadata: Metadata = {
  title: "О компании — стандарт, опыт и география",
  description:
    "«Закулисье»: 20 лет на рынке event в Новосибирске, 3000+ мероприятий, работа с крупными брендами, собственный реквизит и команда полного цикла.",
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title: `О компании | ${SITE_NAME}`,
    url: `${getSiteUrl()}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "О нас", path: "/about" },
        ]}
      />
      <PageWrapper>
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">О компании</h1>
        <div className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-card border border-border">
          <Image
            src={unsplashPhoto("1560439514-4e9645039924", 2000)}
            alt="Команда и атмосфера делового мероприятия"
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
        <div className="mt-10 max-w-3xl space-y-6 text-text-secondary">
          <p className="text-lg leading-relaxed text-text-primary/90">
            «Закулисье» — агентство событий для компаний, где сбой на площадке воспринимается так же
            остро, как сбой в бизнес-процессе. Мы работаем в Новосибирске и по Сибири, закрываем
            федеральные брифы и длинные контракты, где важны повторяемость качества и управляемость
            процесса.
          </p>
          <p>
            За двадцать лет мы прошли путь от локальных задач до форматов уровня дилерских съездов,
            региональных форумов и открытий флагманских объектов. Это не про «масштаб ради цифры» — про
            накопленные регламенты: как вести репетиции, как синхронизировать службы, как говорить с
            площадкой и городом, когда проект публичный.
          </p>
          <p>
            Собственный реквизит и производство — часть нашей модели. Это ускоряет монтаж, делает фактуру
            предсказуемой и позволяет арендодателям на рынке получать комплекты без лишних согласований.
          </p>
          <p>
            Мы не строим коммуникацию вокруг праздничных клише. Наш язык ближе к инженерной культуре:
            понятные роли, ясные тайминги, спокойная ответственность. Если задача требует постановки и
            режиссуры как единого механизма — мы подключаем этот уровень как экспертизу, а не как
            «отдельную услугу для красоты».
          </p>
          <p>
            Для нас показатель зрелости проекта прост: заказчик спокоен в день события, а гости видят
            собранный бренд — не на презентации, а в деталях потока, света и сервиса.
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
