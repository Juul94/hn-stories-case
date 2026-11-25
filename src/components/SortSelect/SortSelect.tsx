"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ChangeEvent } from "react";
import { SORT_OPTIONS, type SortOption } from "@/lib/hn/sorting";
import styles from "./SortSelect.module.scss";

type Props = {
  seed: string;
  sort: SortOption;
};

/** Changes ?sort and keeps ?seed, so the server sorts the same 10 stories again. */
export function SortSelect({ seed, sort }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const query = new URLSearchParams({ seed, sort: event.target.value });
    startTransition(() => router.replace(`/?${query}`, { scroll: false }));
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort" className={styles.label}>
        Sortér efter
      </label>
      <select
        id="sort"
        className={styles.select}
        value={sort}
        onChange={changeSort}
        aria-busy={isPending}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
