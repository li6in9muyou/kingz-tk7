import RockScissorPaper, { RSPMoveType } from "./RockScissorPaper";
import {
  evLocalMove,
  evUpdateGameState,
  evInitGameState,
  evGameOver,
  evPushLocalGameStateToCloud,
} from "../lib/Events";
import { isEmpty, last } from "lodash-es";

export default class {
  private game: RockScissorPaper;

  constructor(private readonly event_bus, init_state) {
    this.game = new RockScissorPaper(init_state);
    this.event_bus.publish(evInitGameState(this.game.state));
    this.event_bus.publish(evUpdateGameState(this.game.state));
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
    this.event_bus.publish(evPushLocalGameStateToCloud(this.game.state));
  }

  handleOpponentMove(m: RSPMoveType) {
    this.makeMove(false, m);
  }

  mergeCloudState(game_state: any) {
    if (!isEmpty(game_state.request)) {
      this.handleOpponentMove(last(game_state.request));
    }
  }
}
