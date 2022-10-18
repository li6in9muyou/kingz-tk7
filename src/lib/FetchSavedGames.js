import axios from "axios";
import { sleep } from "./utility";

export default async function fetchSavedGames() {
  for (let i = 0; i < 3; i++) {
    try {
      return (await axios.get("/saved_games/pABCDABCDABCD")).data;
    } catch (e) {
      await sleep(300);
    }
  }
  return [];
}
