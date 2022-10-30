import { sleep } from "./utility";
import { evCloudSendEvent } from "./Events";
import axios from "axios";
import debug from "debug";
import IRemoteAgent from "../game/IRemoteAgent";
import { IGridGameState } from "../game/TicTacToe/Adapter";
const note = debug("Trace:OnlineAdapter");

let pollStarted = false;

export default class RegularPollingAdapter implements IRemoteAgent {
  private pleaseStopPolling: boolean = false;
  private eb: any;
  private version: number = -1;
  private readonly flipResponseRequest: boolean;

  constructor(
    private readonly match_handle,
    private readonly player_id,
    which: number
  ) {
    note(`which is ${which}, 1 means useRequestArray`);
    this.flipResponseRequest = which === 1;
  }

  attach_event_bus(event_bus: any) {
    this.eb = event_bus;
    this.poll();
  }

  async close(): Promise<void> {
    this.pleaseStopPolling = true;
    return;
  }

  async push_state_to_cloud(state: any) {
    const flipped = this.flipped(state);
    const pushing_version = ++this.version;
    for (let i = 0; i < 3; i++) {
      const resp = await axios.put(
        `/match/${this.match_handle}/${this.player_id}`,
        {
          version: pushing_version,
          game_state: flipped,
        }
      );
      if (resp.status == 200) {
        break;
      }
    }
  }

  private emit(ev: any) {
    const e = evCloudSendEvent(this.flipped(ev));
    note(`emitting ${e} to event_bus`);
    this.eb.publish(e);
  }

  private async poll_once() {
    const cloud_state = (
      await axios.get(`/match/${this.match_handle}/${this.player_id}`)
    ).data;
    if (cloud_state.version > this.version) {
      note(
        "emit\ncloud_state.game_state=%o",
        JSON.stringify(cloud_state.game_state)
      );
      this.emit(cloud_state.game_state);
    }
    this.version = cloud_state.version;
  }

  private async poll() {
    const saw = pollStarted;
    do {
      if (saw) {
        return;
      }
      if (this.pleaseStopPolling) {
        break;
      }
      await this.poll_once();
      await sleep(2000);
    } while (true);
  }

  private flipped(state: IGridGameState) {
    const ans = { request: null, response: null };
    if (this.flipResponseRequest) {
      ans.response = [...state.request];
      ans.request = [...state.response];
    } else {
      ans.response = [...state.response];
      ans.request = [...state.request];
    }
    return ans;
  }
}
