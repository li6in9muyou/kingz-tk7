import IGameAgent from "../IGameAgent";
import {
  evLocalMove,
  evUpdateGameState,
  evInitGameState,
  evGameOver,
  evPushLocalGameStateToCloud,
  evBlockLocalInput,
  evCancelBlockLocalInput,
} from "../../lib/Events";
import { constant, times, uniq } from "lodash-es";

export interface IGridGameState {
  request: [number, number][];
  response: [number, number][];
}

export const getGridGameInitialState: () => IGridGameState = () => ({
  request: [],
  response: [],
});

type Piece = "x" | "o" | "";

export default class Adapter implements IGameAgent {
  event_bus: any;
  game: IGridGameState = null;
  winner: Piece;

  private build_grid(): Piece[][] {
    const grid = [
      [...times(3, constant(""))],
      [...times(3, constant(""))],
      [...times(3, constant(""))],
    ] as Piece[][];
    for (const requestElement of this.game.request) {
      const [x, y] = requestElement;
      grid[x][y] = "x";
    }
    for (const responseElement of this.game.response) {
      const [x, y] = responseElement;
      grid[x][y] = "o";
    }
    return grid;
  }

  private should_terminate(): boolean {
    const grid = this.build_grid();
    for (let i = 0; i < 3; i++) {
      const pieces_row = new Set([grid[i][0], grid[i][1], grid[i][2]]);
      if (pieces_row.size === 1 && grid[i][0] !== "") {
        this.winner = grid[i][0];
        return true;
      }
    }
    for (let i = 0; i < 3; i++) {
      const pieces_row = new Set([grid[0][i], grid[1][i], grid[2][i]]);
      if (pieces_row.size === 1 && grid[0][i] !== "") {
        this.winner = grid[0][i];
        return true;
      }
    }
    const nw_to_se = new Set([grid[0][0], grid[1][1], grid[2][2]]);
    const ne_to_sw = new Set([grid[0][2], grid[1][1], grid[2][0]]);
    const if_terminate =
      (ne_to_sw.size === 1 && grid[1][1] !== "") ||
      (nw_to_se.size === 1 && grid[1][1] !== "");
    if (if_terminate) {
      this.winner = grid[1][1];
    }
    return if_terminate;
  }

  attach_event_bus(event_bus: any, init_game_state: any) {
    this.event_bus = event_bus;
    this.event_bus.subscribe(evLocalMove(), this.handleLocalMove.bind(this));
  }

  handleCloudUpdate(game_state: IGridGameState) {
    if (this.game === null) {
      this.game = game_state;
      this.event_bus.publish(evInitGameState(this.game));
    }
    this.game.request = [...game_state.request];
    this.event_bus.publish(evUpdateGameState(this.game));
    this.check_game_over();
    this.event_bus.publish(evCancelBlockLocalInput());
  }

  handleLocalMove(move: [number, number]) {
    if (
      this.game.response.length !== 0 &&
      this.game.response.length >= this.game.request.length
    ) {
      return;
    }
    this.game.response.push(move);
    this.game.response = uniq(this.game.response);
    this.event_bus.publish(evPushLocalGameStateToCloud(this.game));
    this.event_bus.publish(evUpdateGameState(this.game));
    this.check_game_over();
    this.event_bus.publish(evBlockLocalInput());
  }

  private check_game_over() {
    if (this.should_terminate()) {
      this.event_bus.publish(
        evGameOver(this.winner === "o" ? "local" : "remote")
      );
    }
  }
}
