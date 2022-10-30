import { pgGameTitle } from "./PageSymbol";

export const sleep = (milliSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSeconds));

class LocalStore {
  load(state) {
    this.player_id = state?.player_id ?? this.player_id;
    this.secret = state?.secret ?? this.secret;
    this.nick_name = state?.nick_name ?? this.nick_name;
    this.match_handle = state?.match_handle ?? this.match_handle;
    this.page = state?.page ?? pgGameTitle;
  }

  private getter(label: string) {
    return localStorage.getItem(`kingz-${label}`);
  }

  private setter(label: string, value) {
    return localStorage.setItem(`kingz-${label}`, value ?? "");
  }

  has_registered(): boolean {
    return this.nick_name !== "";
  }

  has_player_id(): boolean {
    return this.player_id !== "";
  }

  get page(): string {
    return this.getter("player-page");
  }

  set page(page) {
    this.setter("player-page", page);
  }

  get player_id(): string {
    return this.getter("player-handle");
  }

  set player_id(value: string) {
    this.setter("player-handle", value);
  }

  get secret(): string {
    return this.getter("secret");
  }

  set secret(value: string) {
    this.setter("secret", value);
  }

  get nick_name() {
    return this.getter("nickName");
  }

  set nick_name(value) {
    this.setter("nickName", value);
  }

  get match_handle() {
    return this.getter("match-handle");
  }

  set match_handle(value) {
    this.setter("match-handle", value);
  }
}

export const Book = new LocalStore();
