/** Raw item from `item/{id}.json`. Every field except `id` can be missing. */
export type HNItem = {
  id: number;
  type?: "story" | "comment" | "job" | "poll" | "pollopt";
  by?: string;
  time?: number;
  title?: string;
  url?: string;
  score?: number;
  deleted?: boolean;
  dead?: boolean;
};

/** Raw user from `user/{id}.json`. */
export type HNUser = {
  id: string;
  karma: number;
  created: number;
};

/** A story ready to render. */
export type Story = {
  id: number;
  title: string;
  /** External URL, or the HN thread when the story has no URL (Ask HN). */
  url: string;
  /** Domain of the external URL, or null for HN threads. */
  domain: string | null;
  /** Unix time in seconds. */
  time: number;
  score: number;
  author: {
    id: string;
    /** Null when the user could not be fetched. */
    karma: number | null;
  };
};
