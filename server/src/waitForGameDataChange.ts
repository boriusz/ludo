import { client } from "./index";

const waitForGameDataChange = async (gameId: number): Promise<boolean> => {
  if (await checkIfChanged(gameId)) setTimeout(() => true, 1000);

  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (await checkIfChanged(gameId)) {
        clearInterval(interval);
        resolve(true);
      }
    }, 3000);
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
