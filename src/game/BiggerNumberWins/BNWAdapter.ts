import IGameAgent from "../IGameAgent";
import {
  evLocalMove,
  evUpdateGameState,
  evInitGameState,
  evGameOver,
  evPushLocalGameStateToCloud,
} from "../../lib/Events";

export interface BNWGameState {
  remote_moved: boolean;
  remote_number: number | null;
  my_number: number;
}

export default class BNWAdapter implements IGameAgent {
  event_bus: any;
  game: BNWGameState = null;

  private should_terminate(): boolean {
    return this.game.remote_number !== null;
  }

  attach_event_bus(event_bus: any, init_game_state: any) {
    this.event_bus = event_bus;
    this.event_bus.subscribe(evLocalMove(), this.handleLocalMove.bind(this));
  }

  handleCloudUpdate(game_state: BNWGameState) {
    if (this.game === null) {
      this.game = game_state;
      this.event_bus.publish(evInitGameState(this.game));
    }
    this.game.remote_moved = game_state.remote_moved;
    this.game.remote_number = game_state.remote_number;
    this.event_bus.publish(evUpdateGameState(this.game));
  }

  handleLocalMove(move: number) {
    this.game.my_number = move;
    this.event_bus.publish(evPushLocalGameStateToCloud(this.game));
    this.event_bus.publish(evUpdateGameState(this.game));
    if (this.should_terminate()) {
      this.event_bus.publish(
        evGameOver(
          this.game.remote_number < this.game.my_number ? "local" : "remote"
        )
      );
    }
  }
}
