"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";

const pillars = [
  {
    title: "Качество исполнения",
    body: "Свет, звук, сценарий и сервис — не конкурируют друг с другом, а собираются в один стандарт. Это заметно и гостю, и команде заказчика на площадке.",
  },
  {
    title: "Двадцать лет практики",
    body: "Мы выросли на задачах, где ошибка стоит дорого: съезды, открытия, длинные активности. Отсюда — привычка к регламентам и спокойной дисциплине.",
  },
  {
    title: "Собственный реквизит",
    body: "Парк декораций и конструкций снимает неопределённость: сроки монтажа понятнее, фактура предсказуемее, аренда для коллег по рынку — прозрачнее.",
  },
  {
    title: "Сибирь как база",
    body: "Знаем локальные площадки и поставщиков — без экспериментов на вашем бренде. Умеем работать как с региональными, так и с федеральными брифами.",
  },
];

export function WhyWeBlock() {
  return (
    <Section muted>
      <RevealOnScroll>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Почему мы</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Не шире списка услуг — глубже ответственность за результат
        </h2>
      </RevealOnScroll>
      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {pillars.map((p, i) => (
          <RevealOnScroll key={p.title} delay={i * 0.05}>
            <div className="max-w-lg">
              <h3 className="font-display text-xl font-medium text-text-primary md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">{p.body}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
