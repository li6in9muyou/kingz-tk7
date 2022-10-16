import axios from "axios";
import fetch_local_identity from "./LocalIdentity";

type MatchHandle = string;

export async function try_match(): Promise<MatchHandle> {
  const local_handle = await fetch_local_identity(null);
  return (await axios.post(`/match/${local_handle.handle}`)).data;
}
