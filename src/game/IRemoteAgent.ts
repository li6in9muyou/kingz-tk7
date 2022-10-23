export default interface IRemoteAgent {
  attach_event_bus(event_bus: any);
  push_state_to_cloud(game_state: any): Promise<void>;
  close(): Promise<void>;
}
