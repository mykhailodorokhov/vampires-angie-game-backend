import { kv } from "@vercel/kv";
import { playersDataType } from "./types";

export async function saveData(data: playersDataType) {
  await kv.set("players-data", data);
}

export async function loadData() {
  return (await kv.get("players-data")) as playersDataType;
}

export function generateIdentifier(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;

  let identifier = "";
  for (let i = 0; i < length; i++) {
    identifier += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return identifier;
}
