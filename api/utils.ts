import * as fs from "fs";
import * as path from "path";

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

export function saveData(data: any) {
  const dataFilePath = path.join(__dirname, "data.json");
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export function loadData() {
  const dataFilePath = path.join(__dirname, "data.json");
  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(rawData);
  }
  return {};
}
