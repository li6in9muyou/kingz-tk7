export default interface IGameAgent {
  attach_event_bus(event_bus: any, init_game_state: any);
  handleLocalMove(move: any);
  handleCloudUpdate(game_state: any);
}
