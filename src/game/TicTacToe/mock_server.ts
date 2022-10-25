import { IGameCloud } from "../../mocks/generic_server";
import { IGridGameState } from "./Adapter";

class Cloud implements IGameCloud {
  game: IGridGameState = {
    request: [],
    response: [],
  };

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
    this.game.request = [[0, 0]];
    this.game.response = [];
  }
}

export default Cloud;
