import { PokeApiService } from "./services/PokeApiService.js";
import { BoxService } from "./services/BoxService.js";
import { TerminalController } from "./controllers/TerminalController.js";

async function main(): Promise<void> {
  const pokeApi = new PokeApiService();
  const box = new BoxService();
  const controller = new TerminalController(pokeApi, box);
  await controller.iniciar();
}

main();
