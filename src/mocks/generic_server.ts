import { rest, setupWorker } from "msw";
import { constant, last, random, times } from "lodash-es";
import { sleep } from "../lib/utility";

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

export interface IGameCloud {
  update_game_state: (
    match_id: string,
    player_id: string,
    game_state: any
  ) => void;
  get_game_state: (match_id: string, player_id: string) => any;
  on_match_is_made: (request: any) => void;
}

let cloud_version = 0;

export const get_handlers = (cloud: IGameCloud) => [
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
  rest.get("/match/:player_id/:match_id/opponent", async (req, res, ctx) => {
    await sleep(1000);
    const ans = next_matching_status();
    if (ans === "success") {
      cloud.on_match_is_made(req);
    }
    return res(ctx.text(ans));
  }),
  rest.put("/match/:match_id/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    const client_game_state = (await req.json()).game_state;
    cloud.update_game_state(
      req.params.match_id as string,
      req.params.player_id as string,
      client_game_state
    );
    cloud_version += 1;
    return res(ctx.status(200));
  }),
  rest.get("/match/:match_id/:player_id", async (req, res, ctx) => {
    await sleep(1000);
    const cloud_game_state = cloud.get_game_state(
      req.params.match_id as string,
      req.params.player_id as string
    );
    return res(
      ctx.json({ version: cloud_version, game_state: cloud_game_state })
    );
  }),
];

export default (cloud) => setupWorker(...get_handlers(cloud));
