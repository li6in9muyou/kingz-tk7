import { sleep } from "../lib/utility";
import axios from "axios";
import debug from "debug";
const note = debug("OnlineAdapter");

export default class {
  private readonly subs = [];
  private version: number = -1;

  constructor(private readonly match_handle, private readonly player_id) {}

  async push_state_to_cloud(state: any) {
    for (let i = 0; i < 3; i++) {
      const resp = await axios.put(
        `/match/${this.match_handle}/${this.player_id}`,
        {
          version: ++this.version,
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
    note("emit");
  }

  private async poll_once() {
    const cloud_state = (
      await axios.get(`/match/${this.match_handle}/${this.player_id}`)
    ).data;
    note("cloud_state=%o", cloud_state);
    if (cloud_state.version > this.version) {
      this.version = cloud_state.version;
      this.emit(cloud_state.game_state);
    }
  }

  private async poll() {
    for (let i = 0; i < 20; i++) {
      await this.poll_once();
      note("poll no.%d", i);
      await sleep(500);
    }
  }
}
