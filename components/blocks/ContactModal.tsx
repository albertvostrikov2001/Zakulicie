"use client";

import { ContactForm } from "@/components/blocks/ContactForm";
import { Modal } from "@/components/ui/Modal";

type Props = { open: boolean; onClose: () => void };

export function ContactModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Обсудить проект">
      <ContactForm idPrefix="modal-cf" />
    </Modal>
  );
}
