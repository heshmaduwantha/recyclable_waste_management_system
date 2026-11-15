import React from "react";
import { statusLabel } from "../../../shared/contracts";
export const Status = ({ value }: { value: string }) => (
  <span className={"status " + value}>{statusLabel(value)}</span>
);
export const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="empty">{children}</div>
);
export const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);
export const date = (s: string) =>
  new Date(s).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
export const num = (n: unknown) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
export function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay" onClick={close}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-head">
          <h2>{title}</h2>
          <button className="quiet" onClick={close} aria-label="Close dialog">
            ✕
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
