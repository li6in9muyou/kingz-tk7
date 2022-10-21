export const evStartNewGame = () => "开始新对局";
export const evResumeSavedGame = (idx) => ({
  type: "从残局开始玩",
  payload: idx,
});
export const evMySavedGame = () => "我的历史对局";
export const evStartLocalComputerGame = () => "跟电脑玩";
export const evCloudDeclineMatch = () => "服务器返回匹配失败";
export const evStartMatching = () => "匹配玩家";
export const evLocalQuit = () => "本地玩家要求退出";
export const evLocalSaveThenQuit = () => "本地玩家保存退出";
export const evGameOver = (winner) => ({
  type: "游戏正常结束",
  payload: winner,
});
export const evBackToGameTitle = () => "返回主界面";
export const evRemotePlayerWentOffline = () => "你的对手离开了对局";
export const evMatchIsMade = () => "匹配成功";
export const evStartPollingMatchStatus = () => "开始反复查询匹配状态";
export const evRegister = (nickname) => ({
  type: "注册新用户",
  payload: nickname,
});
export const evCancelMatching = () => "不等了，跟电脑玩";
export const evInitGameState = (game_state) => ({
  type: "初始游戏状态",
  payload: game_state,
});
export const evUpdateGameState = (game_state) => ({
  type: "更新游戏状态",
  payload: game_state,
});
export const evPushLocalGameStateToCloud = (game_state) => ({
  type: "推送游戏状态到云端",
  payload: game_state,
});
export const evLocalMove = (game_move) => ({
  type: "本地玩家出招",
  payload: game_move,
});
