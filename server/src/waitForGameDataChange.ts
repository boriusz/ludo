import { client } from "./index";

const waitForGameDataChange = async (gameId: number): Promise<boolean> => {
  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (await checkIfChanged(gameId)) {
        clearInterval(interval);
        resolve(true);
      }
    }, 1000);
  });
  return true;
};

const checkIfChanged = async (gameId: number) => {
  const gameData = await client.get(gameId.toString());
  if (!gameData) return false;
  const parsedGameData = JSON.parse(gameData);
  return parsedGameData?.hasChanged;
};

export default waitForGameDataChange;
