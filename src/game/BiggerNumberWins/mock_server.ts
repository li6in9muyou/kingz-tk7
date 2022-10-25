import { IGameCloud } from "../../mocks/generic_server";
import { BNWGameState } from "./BNWAdapter";
import { noop } from "lodash-es";

class BiggerNumberWinsGameCloud implements IGameCloud {
  game: BNWGameState = {
    remote_number: null,
    remote_moved: false,
    my_number: null,
  };

  get_game_state(): any {
    return { ...this.game };
  }

  update_game_state(
    match_id: string,
    player_id: string,
    game_state: any
  ): void {
    this.game.remote_moved = true;
    this.game.remote_number = Math.floor(Math.random() * 100 + 1);
    this.game.my_number = game_state.my_number;
  }

  on_match_is_made = noop;
}

export default BiggerNumberWinsGameCloud;
