import RockScissorPaper, { RSPMoveType } from "./RockScissorPaper";
import {
  evLocalMove,
  evUpdateGameState,
  evInitGameState,
  evGameOver,
  evPushLocalGameStateToCloud,
} from "../../lib/Events";
import IGameAgent from "../IGameAgent";

export default class RSPAdapter implements IGameAgent {
  private game: RockScissorPaper | null = null;
  private event_bus: any;

  private makeMove(isLocal: boolean, cmd: RSPMoveType) {
    if (isLocal) {
      this.game.makeMove(cmd);
    } else {
      this.game.makeOpponentMove(cmd);
    }
    this.event_bus.publish(evUpdateGameState(this.game.state));
    const { shouldTerminate, reason } = this.game.shouldTerminate();
    if (shouldTerminate) {
      this.event_bus.publish(evGameOver(reason === "win" ? "local" : "remote"));
    }
  }

  handleLocalMove(m: RSPMoveType) {
    this.makeMove(true, m);
    this.event_bus.publish(evPushLocalGameStateToCloud(this.game.state));
  }

  handleOpponentMove(m: RSPMoveType) {
    this.makeMove(false, m);
  }

  handleCloudUpdate(game_state: any) {
    if (this.game === null) {
      this.game = new RockScissorPaper(game_state);
      this.event_bus.publish(evInitGameState(this.game.state));
    }
    for (
      let i = this.game.state.request.length;
      i < game_state.request.length;
      i++
    ) {
      this.handleOpponentMove(game_state.request[i]);
    }
  }

  attach_event_bus(event_bus: any) {
    this.event_bus = event_bus;
    this.event_bus.subscribe(evLocalMove(), this.handleLocalMove.bind(this));
  }
}
