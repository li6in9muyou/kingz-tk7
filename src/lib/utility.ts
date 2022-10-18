export const sleep = (milliSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSeconds));

class LocalStore {
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
}

export const Book = new LocalStore();
