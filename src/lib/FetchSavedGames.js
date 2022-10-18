import axios from "axios";
import { Book, sleep } from "./utility";

export default async function fetchSavedGames() {
  for (let i = 0; i < 3; i++) {
    try {
      return (await axios.get(`/saved_games/${Book.player_id}`)).data;
    } catch (e) {
      await sleep(300);
    }
  }
  return [];
}
