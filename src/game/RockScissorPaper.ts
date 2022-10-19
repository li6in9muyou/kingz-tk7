import { countBy, identity, map, zip } from "lodash-es";

const MOVES = {
  Scissor: "s",
  Rock: "r",
  Paper: "p",
};

const ROUND_RESULT = {
  Tie: "tie",
  Lose: "lose",
  Win: "win",
  Unknown: "xxx",
};

const GAME_CONFIG = {
  maxRounds: 5,
};

export type RSPMoveType = keyof typeof MOVES;
export type RSPResultType = keyof typeof ROUND_RESULT;

export default class {
  _state: {
    request: RSPMoveType[];
    response: RSPMoveType[];
    result: RSPResultType[];
  } = { request: [], response: [], result: [] };

  constructor(init_state: any) {
    this._state = { ...this._state, ...init_state };
    this.battle();
  }

  private battle() {
    const showHands = (mine, enemy) => {
      if (mine === enemy) {
        return ROUND_RESULT.Tie;
      } else if (
        (mine === MOVES.Paper && enemy === MOVES.Rock) ||
        (mine === MOVES.Rock && enemy === MOVES.Scissor) ||
        (mine === MOVES.Scissor && enemy === MOVES.Paper)
      ) {
        return ROUND_RESULT.Win;
      } else {
        return ROUND_RESULT.Lose;
      }
    };

    const result = [
      ...map(zip(this._state.response, this._state.request), (pair) => {
        const [mine, enemy] = pair;
        return mine && enemy ? showHands(mine, enemy) : ROUND_RESULT.Unknown;
      }),
    ] as RSPResultType[];

    this._state = { ...this._state, result };
  }

  private submitMove(where, cmd) {
    if (where.length < GAME_CONFIG.maxRounds) {
      where.push(cmd);
      this.battle();
    }
  }

  makeMove(cmd: RSPMoveType) {
    this.submitMove(this._state.response, cmd);
  }

  makeOpponentMove(cmd: RSPMoveType) {
    this.submitMove(this._state.request, cmd);
  }

  shouldTerminate() {
    const lostRoundsCnt = countBy(this._state.result, identity)[
      ROUND_RESULT.Lose
    ];
    const gameIsLost = lostRoundsCnt >= Math.ceil(GAME_CONFIG.maxRounds / 2);
    return { shouldTerminate: gameIsLost, reason: gameIsLost ? "lost" : "win" };
  }

  get state() {
    return { ...this._state };
  }
}
