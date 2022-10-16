import { rest } from "msw";
import { last, random, times } from "lodash-es";
import { sleep } from "../lib/utility";

export const handlers = [
  rest.get("/saved_games/:player_id", async (_, res, ctx) => {
    await sleep(1000);
    return res(
      ctx.status(200),
      ctx.json(
        times(random(3, 10), (idx) => ({
          idx,
          match_token: `${idx + 1}${idx + 1}ABCDABCDAB`,
        }))
      )
    );
  }),
  rest.get("/player_handle", async (req, res, ctx) => {
    await sleep(1000);
    const secret = req.url.searchParams.get("secret");
    if (null === secret) {
      return res(ctx.status(400));
    }
    return res(ctx.status(200), ctx.text(`p${secret}`));
  }),
  rest.post("/match/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    const player_id = last(req.url.pathname.split("/"));
    return res(ctx.status(200), ctx.text(`GridToken${player_id}`));
  }),
];
