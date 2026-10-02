import type { PokemonApiResponse, PokemonResumo } from "../models/Pokemon.js";
import { APIError } from "../models/CustomErros.js";
import { normalizarEntrada } from "../utils/textFormatters.js";

export class PokeApiService {
  private readonly baseUrl: string = "http://pokeapi.co/api/v2/pokemon";

  async buscarPokemon(nomeOuId: string): Promise<PokemonResumo> {
    const termo: string = normalizarEntrada(nomeOuId);

    if (termo === "") {
      throw new APIError("Informe um nome ou ID de pokémon.");
    }

    try {
      const resposta = await fetch(
        `${this.baseUrl}/${encodeURIComponent(termo)}`,
      );

      if (resposta.status === 404) {
        throw new APIError(`Pokémon não encontrado: ${termo}`, 404);
      }

      if (!resposta.ok) {
        throw new APIError(
          `Erro ao consultar a PokeAPI (status ${resposta.status}).`,
          resposta.status,
        );
      }

      const dados = (await resposta.json()) as PokemonApiResponse;
      return this.mapearResposta(dados);
    } catch (erro) {
      if (erro instanceof APIError) {
        throw erro;
      }
      throw new APIError(
        "Não foi possível conectar á PokeAPI. Verifique sua internet.",
      );
    }
  }

  private mapearResposta(dados: PokemonApiResponse): PokemonResumo {
    return {
      id: dados.id,
      nome: dados.name,
      tipos: dados.types.map((item) => item.type.name),
      altura: dados.height,
      peso: dados.weight,
      hp: this.obterStat(dados, "hp"),
      ataque: this.obterStat(dados, "attack"),
      defesa: this.obterStat(dados, "defense"),
    };
  }

  private obterStat(dados: PokemonApiResponse, nomeStat: string): number {
    const stat = dados.stats.find((item) => item.stat.name === nomeStat);
    return stat ? stat.base_stat : 0;
  }
}
