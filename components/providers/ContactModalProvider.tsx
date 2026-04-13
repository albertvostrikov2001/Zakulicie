"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ContactModalLazy = dynamic(
  () => import("@/components/blocks/ContactModal").then((m) => m.ContactModal),
  { ssr: false }
);

type ContactCtx = {
  openContact: () => void;
  closeContact: () => void;
};

const ContactModalContext = createContext<ContactCtx | null>(null);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openContact, closeContact }), [openContact, closeContact]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModalLazy open={open} onClose={closeContact} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
