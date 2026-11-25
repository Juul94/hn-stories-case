import { http, HttpResponse } from "msw";
import { HN_API_BASE } from "@/lib/hn/api";
import type { HNItem, HNUser } from "@/lib/hn/types";

export type MockData = {
  ids: number[];
  items: Record<number, HNItem | null>;
  users: Record<string, HNUser | null>;
};

/** MSW handlers that answer the three HN endpoints from `data`. Unknown ids give `null`, like the real API. */
export function hnHandlers(data: MockData) {
  return [
    http.get(`${HN_API_BASE}/topstories.json`, () => HttpResponse.json(data.ids)),
    http.get(`${HN_API_BASE}/item/:id`, ({ params }) => {
      const id = Number(String(params.id).replace(".json", ""));
      return HttpResponse.json(data.items[id] ?? null);
    }),
    http.get(`${HN_API_BASE}/user/:id`, ({ params }) => {
      const id = String(params.id).replace(".json", "");
      return HttpResponse.json(data.users[id] ?? null);
    }),
  ];
}
