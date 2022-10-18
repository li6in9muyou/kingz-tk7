import getBrowserFingerprint from "get-browser-fingerprint";
import axios from "axios";
import { isEmpty, isString } from "lodash-es";
import { Book } from "./utility";

export interface OnlineHandle {
  handle: string;
  nickName: string;
}

export const get_local_nick_name = () => Book.nick_name;

function get_secret() {
  return getBrowserFingerprint();
}

export function has_registered() {
  return Book.nick_name !== null;
}

async function fetch_handle(secret, name: string) {
  const cache = Book.player_id;
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
  Book.player_id = handle;
  return handle;
}

async function fetch_local_identity(nickName): Promise<OnlineHandle | null> {
  const secret = get_secret();
  Book.secret = secret;
  if (has_registered()) {
    const name = Book.nick_name;
    const handle = await fetch_handle(secret, name);
    return { handle, nickName: name };
  } else {
    const invalid_arg =
      !isString(nickName) || (isString(nickName) && isEmpty(nickName));
    if (invalid_arg) {
      throw "no stored nickName, should provide one through argument";
    }
    const handle = await fetch_handle(secret, nickName);
    Book.nick_name = nickName;
    return { handle, nickName };
  }
}

export default fetch_local_identity;
