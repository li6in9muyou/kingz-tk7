import getBrowserFingerprint from "get-browser-fingerprint";
import axios from "axios";
import { isEmpty, isString } from "lodash-es";

export interface OnlineHandle {
  handle: string;
  nickName: string;
}

function get_secret() {
  return getBrowserFingerprint();
}

export function get_local_nick_name() {
  return localStorage.getItem("kingz-nickName");
}

export function has_registered() {
  return get_local_nick_name() !== null;
}

async function fetch_handle(secret, name: string) {
  const cache = localStorage.getItem("kingz-handle");
  if (cache !== null) {
    return cache;
  }
  const handle = (
    await axios.get("/player_handle", {
      params: {
        secret,
        nickName: name,
      },
    })
  ).data;
  localStorage.setItem("kingz-handle", handle);
  return handle;
}

async function fetch_local_identity(nickName): Promise<OnlineHandle | null> {
  const secret = get_secret();
  localStorage.setItem("kingz-secret", secret);
  if (has_registered()) {
    const name = get_local_nick_name();
    const handle = await fetch_handle(secret, name);
    return { handle, nickName: name };
  } else {
    const invalid_arg =
      !isString(nickName) || (isString(nickName) && isEmpty(nickName));
    if (invalid_arg) {
      throw "no stored nickName, should provide one through argument";
    }
    const handle = await fetch_handle(secret, nickName);
    localStorage.setItem("kingz-nickName", nickName);
    return { handle, nickName };
  }
}

export default fetch_local_identity;
