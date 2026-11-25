"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import styles from "./TopBar.module.scss";

/** Re-renders the server page, which picks 10 new random stories. */
export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refresh = () => startTransition(() => router.refresh());

  return (
    <button
      type="button"
      className={styles.refreshButton}
      onClick={refresh}
      disabled={isPending}
      aria-busy={isPending}
    >
      {/* Both labels share one grid cell, so the button keeps the width of the longest one. */}
      <span className={styles.label} hidden={isPending}>
        Vis 10 nye historier
      </span>
      <span className={styles.label} hidden={!isPending}>
        Henter…
      </span>
    </button>
  );
}
