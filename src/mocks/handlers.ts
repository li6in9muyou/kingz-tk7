import { rest } from "msw";
import { last, random, times, constant } from "lodash-es";
import { sleep } from "../lib/utility";

let _current = 0;
const _matching_status = [...times(4, constant("waiting")), "success"];
function next_matching_status() {
  const s = _matching_status[_current];
  _current += 1;
  if (_current === _matching_status.length) {
    _current = 0;
  }
  return s;
}

let _rsp_game_state = {
  version: 0,
  game_state: { request: [], response: [] },
};

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
  rest.delete("/match/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.status(200));
  }),
  rest.get("/match/:match_id/opponent", async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.text(next_matching_status()));
  }),
  rest.put("/match/:match_id/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    _rsp_game_state = await req.json();
    _rsp_game_state.version += 1;
    return res(ctx.status(200));
  }),
  rest.get("/match/:match_id/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    if (_rsp_game_state.game_state.request.length < 5) {
      _rsp_game_state.game_state.request.push("s");
    }
    return res(ctx.json(_rsp_game_state));
  }),
];
