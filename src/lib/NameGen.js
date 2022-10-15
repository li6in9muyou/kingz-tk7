import { sample } from "lodash-es";

const adj = "非常勇敢,懦弱,胆小,不聪明,内向,无聊,邪恶".split(",");
const connect = "的,之".split(",");
const names = "小明,小强,阿飞,阿甘,卢瑟,小红,小丽".split(",");

export default function () {
  return sample(adj) + sample(connect) + sample(names);
}
