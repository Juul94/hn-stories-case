import { RefreshButton } from "./RefreshButton";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./TopBar.module.scss";

export function TopBar() {
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <span className={styles.logo} aria-hidden="true">
            HN
          </span>
          Hacker News
        </h1>
        <div className={styles.actions}>
          <ThemeToggle />
          <RefreshButton />
        </div>
      </div>
    </header>
  );
}
