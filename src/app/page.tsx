import { connection } from "next/server";
import { SortSelect } from "@/components/SortSelect/SortSelect";
import { StoryList } from "@/components/StoryList/StoryList";
import { getRandomStories, STORY_COUNT } from "@/lib/hn/api";
import { parseSort, sortLabel, sortStories } from "@/lib/hn/sorting";
import { createSeed, isValidSeed, seededRandom } from "@/utils/random";
import styles from "./page.module.scss";

type Props = {
  searchParams: Promise<{ seed?: string | string[]; sort?: string | string[] }>;
};

export default async function Home({ searchParams }: Props) {
  await connection();
  const params = await searchParams;

  // The seed decides which 10 stories are picked, so changing the sort keeps the same stories.
  const seed = isValidSeed(params.seed) ? params.seed : createSeed();
  const sort = parseSort(params.sort);
  const stories = sortStories(await getRandomStories(STORY_COUNT, seededRandom(seed)), sort);

  return (
    <main className={styles.main}>
      <h2 className="visually-hidden">
        10 tilfældige Hacker News-historier, sorteret efter {sortLabel(sort).toLowerCase()}
      </h2>
      <SortSelect seed={seed} sort={sort} />
      <StoryList stories={stories} sort={sort} />
    </main>
  );
}
