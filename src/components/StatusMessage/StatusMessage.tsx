import type { ReactNode } from "react";
import styles from "./StatusMessage.module.scss";

type Props = {
  title: string;
  children: ReactNode;
  /** "alert" for errors (announced at once), "status" for neutral messages. */
  role: "alert" | "status";
  /** Shows a "Prøv igen" button. Only usable from a client component. */
  onRetry?: () => void;
};

/** Centered message box for the error and empty states. */
export function StatusMessage({ title, children, role, onRetry }: Props) {
  return (
    <div className={styles.box} role={role}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{children}</p>
      {onRetry && (
        <button type="button" className={styles.action} onClick={onRetry}>
          Prøv igen
        </button>
      )}
    </div>
  );
}
