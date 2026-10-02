import { PokeApiService } from "./services/PokeApiService.js";
import { formatarPokemon, msgErro } from "./utils/textFormatters.js";

async function main(): Promise<void> {
  const api = new PokeApiService();

  try {
    const pikachu = await api.buscarPokemon("Pikachu");
    console.log(formatarPokemon(pikachu));
  } catch (erro) {
    if (erro instanceof Error) console.log(msgErro(erro.message));
  }

  try {
    await api.buscarPokemon("pokemon-inexistente");
  } catch (erro) {
    if (erro instanceof Error) console.log(msgErro(erro.message));
  }
}

main();
