import { PageWrapper } from "@/components/layout/PageWrapper";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Реквизиты",
  description: "Реквизиты ООО «ЗАКУЛИСЬЕ» для договоров, счетов и документооборота.",
  alternates: { canonical: `${getSiteUrl()}/requisites` },
};

export default function RequisitesPage() {
  return (
    <PageWrapper>
      <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">Реквизиты</h1>
      <div className="mt-10 max-w-2xl space-y-4 text-sm text-text-secondary">
        <dl className="grid gap-3 border border-border bg-surface/50 p-6">
          <div>
            <dt className="text-text-muted">Полное наименование</dt>
            <dd className="text-text-primary">Общество с ограниченной ответственностью «ЗАКУЛИСЬЕ»</dd>
          </div>
          <div>
            <dt className="text-text-muted">Сокращённое наименование</dt>
            <dd className="text-text-primary">ООО «ЗАКУЛИСЬЕ»</dd>
          </div>
          <div>
            <dt className="text-text-muted">Бренд</dt>
            <dd className="text-text-primary">Event-агентство «Закулисье»</dd>
          </div>
          <div>
            <dt className="text-text-muted">ИНН / КПП</dt>
            <dd className="text-text-primary">5404489890 / 54061001</dd>
          </div>
          <div>
            <dt className="text-text-muted">ОГРН</dt>
            <dd className="text-text-primary">1135476115510</dd>
          </div>
          <div>
            <dt className="text-text-muted">ОКВЭД</dt>
            <dd className="text-text-primary">92.34 — прочая зрелищно-развлекательная деятельность</dd>
          </div>
          <div>
            <dt className="text-text-muted">Юридический адрес</dt>
            <dd className="text-text-primary">г. Новосибирск, ул. Революции, д. 6, кв. 248</dd>
          </div>
          <div>
            <dt className="text-text-muted">Директор</dt>
            <dd className="text-text-primary">Елгина Екатерина Эдуардовна</dd>
          </div>
          <div>
            <dt className="text-text-muted">Банковские реквизиты</dt>
            <dd className="space-y-1 text-text-primary">
              <p>ФИЛИАЛ «НОВОСИБИРСКИЙ» ОАО «АЛЬФА-БАНК»</p>
              <p>р/с 40702810723240000312</p>
              <p>БИК 045004774</p>
              <p>к/с 30101810600000000774</p>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Телефон</dt>
            <dd className="text-text-primary">
              <a href="tel:+79232460505" className="hover:text-accent">
                +7 923 246-05-05
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Email</dt>
            <dd className="text-text-primary">
              <a href="mailto:Zakulisie54@gmail.com" className="hover:text-accent">
                Zakulisie54@gmail.com
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </PageWrapper>
  );
}
