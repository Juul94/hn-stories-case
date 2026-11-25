"use client";

import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import styles from "./page.module.scss";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Shown when the top list cannot be fetched. reset() renders the page again. */
export default function ErrorPage({ reset }: Props) {
  return (
    <main className={styles.main}>
      <StatusMessage title="Historierne kunne ikke hentes" role="alert" onRetry={reset}>
        Hacker News svarer ikke lige nu. Prøv igen om lidt.
      </StatusMessage>
    </main>
  );
}
