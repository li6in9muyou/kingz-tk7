import { rest } from "msw";
import { constant, last, random, sample, times } from "lodash-es";
import { sleep } from "../lib/utility";
import RockScissorPaper from "../game/RockScissorPaper";

let _current = 0;
const _seconds_before_match_is_made = 4;
const _matching_status = [
  ...times(_seconds_before_match_is_made, constant("waiting")),
  "success",
];
function next_matching_status() {
  const s = _matching_status[_current];
  _current += 1;
  if (_current === _matching_status.length) {
    _current = 0;
  }
  return s;
}

let cloud_version = 0;
const game = new RockScissorPaper({});

async function cloud() {
  while (!game.shouldTerminate().shouldTerminate) {
    game.makeOpponentMove(sample(["s", "r", "p"]));
    cloud_version += 1;
    await sleep(200);
  }
}

cloud();

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
    const client = await req.json();
    game.makeMove(last(client.game_state.response));
    cloud_version += 1;
    return res(ctx.status(200));
  }),
  rest.get("/match/:match_id/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.json({ version: cloud_version, game_state: game.state }));
  }),
];
