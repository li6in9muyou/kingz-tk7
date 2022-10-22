export const sleep = (milliSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSeconds));

class LocalStore {
  load(state) {
    this.player_id = state?.player_id;
    this.secret = state?.secret;
    this.nick_name = state?.nick_name;
    this.match_handle = state?.match_handle;
  }

  get player_id(): string {
    return localStorage.getItem("kingz-player-handle");
  }

  set player_id(value: string) {
    if (value === null) {
      localStorage.removeItem("kingz-player-handle");
    }
    localStorage.setItem("kingz-player-handle", value);
  }

  get secret(): string {
    return localStorage.getItem("kingz-secret");
  }

  set secret(value: string) {
    localStorage.setItem("kingz-secret", value);
  }

  get nick_name() {
    return localStorage.getItem("kingz-nickName");
  }

  set nick_name(value) {
    localStorage.setItem("kingz-nickName", value);
  }

  get match_handle() {
    return localStorage.getItem("kingz-match-handle");
  }

  set match_handle(value) {
    localStorage.setItem("kingz-match-handle", value);
  }
}

export const Book = new LocalStore();
