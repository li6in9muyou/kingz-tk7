import { rest } from "msw";
import { last, random, repeat, times } from "lodash-es";
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
  rest.post("/register", async (req, res, ctx) => {
    if (
      localStorage.getItem("kingz-nickName") !== null &&
      localStorage.getItem("kingz-secret") !== null
    ) {
      return res(ctx.status(409), ctx.text("user already exists"));
    }

    const text = await req.text();
    const [nk_pair, secret_pair] = text.split("&");
    const [nnk, nickName] = nk_pair?.split("=");
    const [sk, secret] = secret_pair?.split("=");
    if (
      nnk !== "nickName" ||
      sk !== "secret" ||
      sk === undefined ||
      nnk === undefined
    ) {
      return res(ctx.status(400));
    } else {
      const n = decodeURIComponent(nickName);
      const s = decodeURIComponent(secret);
      localStorage.setItem("kingz-nickName", n);
      localStorage.setItem("kingz-secret", s);
      return res(ctx.status(200), ctx.text(`p${repeat("Y", 11)}`));
    }
  }),
  rest.post("/match/:player_id", async (req, res, ctx) => {
    const player_id = last(req.url.pathname.split("/"));
    return res(ctx.status(200), ctx.text(`GridToken${player_id}`));
  }),
];
