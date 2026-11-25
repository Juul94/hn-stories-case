import { RefreshButton } from "./RefreshButton";
import styles from "./TopBar.module.scss";

export function TopBar() {
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Hacker News</h1>
        <RefreshButton />
      </div>
    </header>
  );
}
