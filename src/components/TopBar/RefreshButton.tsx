"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSeed } from "@/utils/random";
import styles from "./TopBar.module.scss";

/** Loads the page with a new seed, which picks 10 new random stories in the default sort. */
export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // aria-disabled instead of disabled, so the button keeps keyboard focus while loading.
  const refresh = () => {
    if (isPending) return;
    startTransition(() => router.replace(`/?seed=${createSeed()}`));
  };

  return (
    <button
      type="button"
      className={styles.refreshButton}
      onClick={refresh}
      aria-disabled={isPending}
      aria-busy={isPending}
    >
      {/* Both labels share one grid cell, so the button keeps the width of the longest one. */}
      <span className={styles.label} hidden={isPending}>
        Vis 10 nye historier
      </span>
      <span className={styles.label} hidden={!isPending}>
        <span className={styles.spinner} aria-hidden="true" />
        Henter…
      </span>
    </button>
  );
}
