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
