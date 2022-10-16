import axios from "axios";
import fetch_local_identity from "./LocalIdentity";

type MatchHandle = string;

export async function try_match(): Promise<MatchHandle> {
  const local_handle = await fetch_local_identity(null);
  const match_handle = (await axios.post(`/match/${local_handle.handle}`)).data;
  localStorage.setItem("kingz-match-handle", match_handle);
  return match_handle;
}

export async function cancel_match() {
  const local_handle = await fetch_local_identity(null);
  await axios.delete(`/match/${local_handle.handle}`);
  localStorage.removeItem("kingz-match-handle");
}
