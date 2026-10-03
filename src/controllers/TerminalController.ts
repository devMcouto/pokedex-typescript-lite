import { createInterface } from "node:readline/promises";
import type { Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PokeApiService } from "../services/PokeApiService.js";
import { BoxService } from "../services/BoxService.js";
import { APIError, LocalBoxError } from "../models/CustomErros.js";
import type { PokemonResumo } from "../models/Pokemon.js";
import {
  formatarPokemon,
  msgAviso,
  msgErro,
  msgOk,
} from "../utils/textFormatters.js";

export class TerminalController {
  private readonly pokeApi: PokeApiService;
  private readonly box: BoxService;
  constructor(pokeApi: PokeApiService, box: BoxService) {
    this.pokeApi = pokeApi;
    this.box = box;
  }
  async iniciar(): Promise<void> {
    const rl: Interface = createInterface({ input: stdin, output: stdout });
    let rodando: boolean = true;
    console.log("=== Pokédex TypeScript Lite ===");
    try {
      while (rodando) {
        this.exibirMenu();
        const opcao: string = (await rl.question("Escolha uma opção: ")).trim();
        switch (opcao) {
          case "1":
            await this.buscarEAdicionar(rl);
            break;
          case "2":
            await this.listarBox();
            break;
          case "3":
            await this.removerPorId(rl);
            break;
          case "0":
            rodando = false;
            console.log("Até logo!");
            break;
          default:
            console.log(msgAviso("Opção inválida."));
        }
      }
    } finally {
      rl.close();
    }
  }

  private exibirMenu(): void {
    console.log("1 - Buscar Pokémon e adicionar ao catálogo");
    console.log("2 - Listar catálogo");
    console.log("3 - Remover Pokémon pelo ID");
    console.log("0 - Sair");
  }

  private async buscarEAdicionar(rl: Interface): Promise<void> {
    const entrada: string = await rl.question("Nome ou ID do Pokémon: ");

    try {
      const pokemon: PokemonResumo = await this.pokeApi.buscarPokemon(entrada);
      console.log(msgOk(`Pokémon encontrado: ${pokemon.nome}`));
      console.log(formatarPokemon(pokemon));
      const adicionado: boolean = await this.box.adicionar(pokemon);
      if (adicionado) {
        console.log(msgOk(`${pokemon.nome} adicionado ao catálogo.`));
      } else {
        console.log(msgAviso(`${pokemon.nome} já está no catálogo.`));
      }
    } catch (erro) {
      this.tratarErro(erro);
    }
  }

  private async listarBox(): Promise<void> {
    try {
      const pokemons: PokemonResumo[] = await this.box.listar();
      if (pokemons.length === 0) {
        console.log(msgAviso("Catálogo vazio."));
        return;
      }
      console.log("\nCatálogo atual:");
      pokemons.forEach((pokemon) => console.log(formatarPokemon(pokemon)));
      const pesoTotal: number = pokemons.reduce(
        (total, pokemon) => total + pokemon.peso,
        0,
      );
      console.log(
        `\nTotal: ${pokemons.length} Pokémon | Peso somado: ${pesoTotal}`,
      );
    } catch (erro) {
      this.tratarErro(erro);
    }
  }

  private async removerPorId(rl: Interface): Promise<void> {
    const entrada: string = await rl.question("ID do Pokémon a remover: ");
    const id: number = Number(entrada.trim());

    if (!Number.isInteger(id) || id <= 0) {
      console.log(msgAviso("Informe um ID numérico válido."));
      return;
    }

    try {
      const removido: boolean = await this.box.remover(id);
      if (removido) {
        console.log(msgOk("Pokémon removido do catálogo."));
      } else {
        console.log(msgAviso("Nenhum Pokémon encontrado com esse ID."));
      }
    } catch (erro) {
      this.tratarErro(erro);
    }
  }

  private tratarErro(erro: unknown): void {
    if (erro instanceof APIError || erro instanceof LocalBoxError) {
      console.log(msgErro(erro.message));
    } else {
      console.log(msgErro("Ocorreu um erro inesperado."));
    }
  }
}
