import { sleep } from "../lib/utility";
import axios from "axios";
import debug from "debug";
const note = debug("OnlineAdapter");

let pollStarted = false;

export default class {
  private readonly subs = [];
  private version: number = -1;

  constructor(private readonly match_handle, private readonly player_id) {}

  async push_state_to_cloud(state: any) {
    const pushing_version = ++this.version;
    for (let i = 0; i < 3; i++) {
      const resp = await axios.put(
        `/match/${this.match_handle}/${this.player_id}`,
        {
          version: pushing_version,
          game_state: state,
        }
      );
      if (resp.status == 200) {
        break;
      }
    }
  }

  subscribe(callback) {
    this.subs.push(callback);
    note("subscribed: %o", callback);
    this.poll();
  }

  private emit(ev: any) {
    for (const sub of this.subs) {
      sub(ev);
    }
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
      await this.poll_once();
      await sleep(2000);
    } while (true);
  }
}
