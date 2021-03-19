export default class Dice {
  public static async roll(): Promise<number> {
    const response = await fetch("/game/roll");
    return response.json();
  }
}
