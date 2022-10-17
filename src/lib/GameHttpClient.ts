import axios from "axios";
import fetch_local_identity from "./LocalIdentity";
import { evCloudDeclineMatch, evMatchIsMade } from "./Events.js";
import { sleep } from "./utility";

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

export async function poll_match() {
  const match_handle = localStorage.getItem("kingz-match-handle");
  if (match_handle === null) {
    throw "no match handle is found, can no poll";
  }
  let r;
  let retry = 3;
  while (r?.status !== 200 && retry > 0) {
    try {
      r = await axios.get(`/match/${match_handle}/opponent`);
    } catch (error) {
      console.groupCollapsed("GameHttpClient error:");
      if (error.response) {
        console.error(error.response.status, "!= 2xx");
        console.log("response.data", error.response.data);
        console.log("response.headers", error.response.headers);
      } else if (error.request) {
        console.error("no response is received");
        console.log("error.request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("axios error");
        console.log(error.message);
      }
      console.log("error.config", error.config);
      console.groupEnd();
      await sleep(500);
    }
    retry -= 1;
  }
  if (r?.data === undefined) {
    throw "poll_match_fail";
  }
  switch (r.data) {
    case "success": {
      return true;
    }
    case "fail":
    case "waiting": {
      return false;
    }
    default: {
      console.warn(`poll_match(): unknown status code ${r.status}`, r);
      return "err";
    }
  }
}

export function poll(eb) {
  if (localStorage.getItem("making") === null) {
    return;
  }
  poll_match()
    .then((r) => {
      if (r) {
        eb.publish(evMatchIsMade());
      } else {
        poll(eb);
      }
    })
    .catch((err) => {
      if (err === "poll_match_fail") {
        eb.publish(evCloudDeclineMatch());
      } else {
        throw err;
      }
    });
}
