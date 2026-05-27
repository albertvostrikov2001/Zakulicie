"use client";

import { useCTANavigation } from "@/hooks/useCTANavigation";
import type { ComponentPropsWithoutRef } from "react";

type CTAButtonProps = ComponentPropsWithoutRef<"button"> & {
  onNavigate?: () => void;
};

export function CTAButton({ onNavigate, onClick, type = "button", children, ...rest }: CTAButtonProps) {
  const { navigateToForm } = useCTANavigation();

  return (
    <button
      {...rest}
      type={type}
      onClick={(event) => {
        onNavigate?.();
        navigateToForm();
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
