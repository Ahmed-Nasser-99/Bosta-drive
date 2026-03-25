"use client";

import React, { useEffect } from "react";
import XIcon from "@/components/icons/XIcon";
import { dismissIconButton } from "@/components/ui/styles";

type ModalHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

function ModalHeader({ children, className = "" }: ModalHeaderProps) {
  return (
    <div
      className={`box-border flex min-h-[52px] items-center border-b border-border px-5 py-4 pr-14 text-foreground ${className}`}
    >
      {children}
    </div>
  );
}

ModalHeader.displayName = "Modal.Header";

type ModalBodyProps = {
  children?: React.ReactNode;
  className?: string;
};

function ModalBody({ children, className = "" }: ModalBodyProps) {
  return <div className={`box-border p-5 ${className}`}>{children}</div>;
}

ModalBody.displayName = "Modal.Body";

type ModalFooterProps = {
  children?: React.ReactNode;
  withTopBorder?: boolean;
  className?: string;
};

function ModalFooter({
  children,
  withTopBorder = true,
  className = "",
}: ModalFooterProps) {
  return (
    <div
      className={`box-border px-5 py-4 ${withTopBorder ? "border-t border-border" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

ModalFooter.displayName = "Modal.Footer";

type RootProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

function ModalRoot({
  open,
  onClose,
  children,
  panelClassName = "max-w-md",
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
}: RootProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/60"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-lg shadow-black/10 dark:shadow-black/40 ${panelClassName}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="absolute right-5 top-5 z-1 box-border flex justify-end">
          <button
            type="button"
            className={dismissIconButton}
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
