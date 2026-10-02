import { PokeApiService } from "./services/PokeApiService.js";
import { formatarPokemon, msgErro } from "./utils/textFormatters.js";
import { BoxService } from "./services/BoxService.js";

async function main(): Promise<void> {
  const api = new PokeApiService();
  const box = new BoxService();

  const pikachu = await api.buscarPokemon("pikachu");

  console.log("Adicionar 1ª vez:", await box.adicionar(pikachu));
  console.log("Adicionar 2ª vez:", await box.adicionar(pikachu));

  const salvos = await box.listar();
  salvos.forEach((p) => console.log(formatarPokemon(p)));

  console.log("Remover ID 25:", await box.remover(25));
  console.log("Remover ID 25 de novo:", await box.remover(25));

  console.log("Total no box:", (await box.listar()).length);
}

main();
