import { PageWrapper } from "@/components/layout/PageWrapper";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description: `Публичная оферта на оказание услуг ${SITE_NAME}.`,
  alternates: { canonical: `${getSiteUrl()}/oferta` },
};

export default function OfertaPage() {
  return (
    <PageWrapper>
      <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
        Публичная оферта
      </h1>
      <div className="mt-10 max-w-3xl space-y-6 text-sm leading-relaxed text-text-secondary">
        <p>
          Настоящий документ является публичной офертой в адрес юридических и дееспособных физических лиц
          (далее — Заказчик) о заключении договора возмездного оказания услуг по организации событий и
          сопутствующим работам на условиях, изложенных ниже.
        </p>
        <h2 className="font-display text-xl text-text-primary">1. Общие положения</h2>
        <p>
          Акцепт оферты совершается Заказчиком путём оплаты счёта, подписания договора или направления
          подтверждения по каналам связи, указанным {SITE_NAME}. Без акцепта услуги оказываются на основании
          отдельного письменного договора.
        </p>
        <h2 className="font-display text-xl text-text-primary">2. Предмет</h2>
        <p>
          Исполнитель обязуется оказать услуги по организации мероприятий, указанных в задании/смете,
          согласованной Сторонами, а Заказчик обязуется принять и оплатить услуги.
        </p>
        <h2 className="font-display text-xl text-text-primary">3. Стоимость и оплата</h2>
        <p>
          Стоимость, порядок и сроки оплаты определяются сметой и договором. НДС указывается при
          применимости. Подрядные услуги третьих лиц могут выставляться по факту согласования.
        </p>
        <h2 className="font-display text-xl text-text-primary">4. Ответственность</h2>
        <p>
          Стороны несут ответственность в соответствии с законодательством РФ. Исполнитель не отвечает за
          обстоятельства непреодолимой силы и действия третьих лиц вне зоны контроля Исполнителя, о
          которых Стороны уведомляют друг друга.
        </p>
        <h2 className="font-display text-xl text-text-primary">5. Заключительные положения</h2>
        <p>
          Оферта действует до момента размещения на сайте новой редакции. Актуальная версия определяется по
          дате публикации. Текст является шаблоном — утвердите юридически значимую редакцию с вашим
          консультантом.
        </p>
        <p className="text-text-muted">Апрель 2026.</p>
      </div>
    </PageWrapper>
  );
}
