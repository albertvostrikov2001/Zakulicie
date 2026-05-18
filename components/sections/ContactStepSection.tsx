"use client";

import { ContactStepForm } from "@/components/forms/ContactStepForm";

export function ContactStepSection() {
  return (
    <section id="contact-form" className="scroll-mt-20" aria-label="Заявка">
      <ContactStepForm />
    </section>
  );
}
