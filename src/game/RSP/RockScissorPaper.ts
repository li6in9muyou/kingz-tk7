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
  iMoved = false;
  oppMoved = false;
  _state: {
    roundIdx: number;
    request: RSPMoveType[];
    response: RSPMoveType[];
    result: RSPResultType[];
  } = { request: [], response: [], result: [], roundIdx: 0 };

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
    where.push(cmd);
    this.battle();
    if (this.iMoved && this.oppMoved) {
      this._state.roundIdx += 1;
      this.iMoved = false;
      this.oppMoved = false;
    }
  }

  makeMove(cmd: RSPMoveType) {
    if (!this.iMoved) {
      this.iMoved = true;
      this.submitMove(this._state.response, cmd);
    }
  }

  makeOpponentMove(cmd: RSPMoveType) {
    if (!this.oppMoved) {
      this.oppMoved = true;
      this.submitMove(this._state.request, cmd);
    }
  }

  shouldTerminate() {
    const scores = countBy(this._state.result, identity);
    const lostRoundsCnt = scores[ROUND_RESULT.Lose];
    const winRoundsCnt = scores[ROUND_RESULT.Win];
    const threshold = Math.ceil(GAME_CONFIG.maxRounds / 2);
    if (lostRoundsCnt >= threshold) {
      return { shouldTerminate: true, reason: "lost" };
    }
    if (winRoundsCnt >= threshold) {
      return { shouldTerminate: true, reason: "win" };
    }
    return { shouldTerminate: false, reason: "" };
  }

  get state() {
    return { ...this._state };
  }
}
