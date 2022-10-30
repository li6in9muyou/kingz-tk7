import getBrowserFingerprint from "get-browser-fingerprint";
import axios from "axios";
import { isEmpty, isString } from "lodash-es";
import { Book } from "./utility";
import { LocalIdentityTrace as lit } from "../loggers";

export interface OnlineHandle {
  handle: string;
  nickName: string;
}

export const get_local_nick_name = () => Book.nick_name;

function get_secret() {
  return getBrowserFingerprint();
}

export const has_registered = Book.has_registered.bind(Book);

async function fetch_handle(secret, name: string) {
  lit(`fetching player handle with ${secret} ${name}`);
  const handle = (
    await axios.get("/player_handle", {
      params: {
        secret,
        nickName: name,
      },
    })
  ).data;
  Book.player_id = handle;
  lit(`handle is ${handle}`);
  return handle;
}

async function fetch_local_identity(nickName): Promise<OnlineHandle | null> {
  const secret = get_secret();
  Book.secret = secret;
  lit(`fetch_local_identity with nickName: ${nickName}`);
  if (has_registered()) {
    lit(`has registered`);
    const name = Book.nick_name;
    const handle = await fetch_handle(secret, name);
    return { handle, nickName: name };
  } else {
    lit(`not yet registered`);
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
