export const sleep = (milliSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSeconds));

class LocalStore {
  get handle(): string {
    return localStorage.getItem("kingz-handle");
  }

  set handle(value: string) {
    if (value === null) {
      localStorage.removeItem("kingz-handle");
    }
    localStorage.setItem("kingz-handle", value);
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
