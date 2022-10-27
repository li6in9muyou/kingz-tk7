import { IGameCloud } from "../../mocks/generic_server";
import { IGridGameState } from "./Adapter";
import { join, random, uniqBy } from "lodash-es";
import { sleep } from "../../lib/utility";

class Cloud implements IGameCloud {
  game: IGridGameState = {
    request: [],
    response: [],
  };

  private async opponent_moves() {
    while (true) {
      this.game.request.push([random(0, 2), random(0, 2)]);
      this.game.request = uniqBy(this.game.request, join) as [[number, number]];
      await sleep(600);
    }
  }

  get_game_state(): any {
    return { ...this.game };
  }

  update_game_state(
    match_id: string,
    player_id: string,
    game_state: any
  ): void {
    this.game = { ...this.game, ...game_state };
  }

  on_match_is_made() {
    this.game.request = [];
    this.game.response = [];
    this.opponent_moves();
  }
}

export default Cloud;
