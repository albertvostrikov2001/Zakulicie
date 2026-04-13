import { PageWrapper } from "@/components/layout/PageWrapper";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Реквизиты",
  description: `Реквизиты организации ${SITE_NAME} для договоров и счетов.`,
  alternates: { canonical: `${getSiteUrl()}/requisites` },
};

export default function RequisitesPage() {
  return (
    <PageWrapper>
      <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">Реквизиты</h1>
      <div className="mt-10 max-w-2xl space-y-4 text-sm text-text-secondary">
        <p className="text-text-muted">
          Заполните фактические реквизиты юридического лица. Ниже — структура блока для сайта.
        </p>
        <dl className="grid gap-3 border border-border bg-surface/50 p-6">
          <div>
            <dt className="text-text-muted">Полное наименование</dt>
            <dd className="text-text-primary">[Полное наименование организации]</dd>
          </div>
          <div>
            <dt className="text-text-muted">Сокращённое наименование</dt>
            <dd className="text-text-primary">{SITE_NAME}</dd>
          </div>
          <div>
            <dt className="text-text-muted">ИНН / КПП</dt>
            <dd className="text-text-primary">[ИНН] / [КПП]</dd>
          </div>
          <div>
            <dt className="text-text-muted">ОГРН</dt>
            <dd className="text-text-primary">[ОГРН]</dd>
          </div>
          <div>
            <dt className="text-text-muted">Юридический адрес</dt>
            <dd className="text-text-primary">[Адрес]</dd>
          </div>
          <div>
            <dt className="text-text-muted">Банковские реквизиты</dt>
            <dd className="text-text-primary">[Банк, БИК, р/с, к/с]</dd>
          </div>
          <div>
            <dt className="text-text-muted">Email</dt>
            <dd className="text-text-primary">[Email для документооборота]</dd>
          </div>
        </dl>
      </div>
    </PageWrapper>
  );
}
