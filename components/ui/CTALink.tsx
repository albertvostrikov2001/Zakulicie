"use client";

import { useCTANavigation } from "@/hooks/useCTANavigation";
import { getContactFormHref } from "@/lib/contactFormNavigation";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

type CTALinkProps = ComponentPropsWithoutRef<"a"> & {
  onNavigate?: () => void;
};

export const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(function CTALink(
  { onNavigate, onClick, href, children, ...rest },
  ref
) {
  const { navigateToForm } = useCTANavigation();

  return (
    <a
      {...rest}
      ref={ref}
      href={href ?? getContactFormHref()}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
        navigateToForm();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
});
