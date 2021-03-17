import { client } from "./index";

const waitForGameDataChange = async (gameId: number) => {
  await new Promise((resolve) => {
    let interval = setInterval(async () => {
      if (await checkIfChanged(gameId)) {
        clearInterval(interval);
        resolve(true);
      } else {
      }
    }, 3000);
  });
  return true;
};

const checkIfChanged = async (gameId: number) => {
  const gameData = await client.get(gameId.toString());
  if (!gameData) {
    return false;
  }
  const parsedGameData = JSON.parse(gameData);
  return parsedGameData?.hasChanged;
};

export default waitForGameDataChange;
