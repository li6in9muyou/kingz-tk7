import RockScissorPaper, { RSPMoveType } from "./RockScissorPaper";
import {
  evLocalMove,
  evUpdateGameState,
  evInitGameState,
  evGameOver,
} from "../lib/Events";

export default class {
  private game: RockScissorPaper;

  constructor(private readonly event_bus, init_state) {
    this.game = new RockScissorPaper(init_state);
    this.event_bus.publish(evInitGameState(init_state));
    this.event_bus.subscribe(evLocalMove(), this.handleLocalMove.bind(this));
  }

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
  }

  makeOpponentMove(m: RSPMoveType) {
    this.makeMove(false, m);
  }
}
