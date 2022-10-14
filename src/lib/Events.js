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
