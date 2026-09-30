import type { PokemonResumo } from "../models/Pokemon.js";

export function normalizarEntrada(texto: string): string {
  return texto.trim().toLowerCase();
}

export function formatarPokemon(pokemon: PokemonResumo): string {
  const tipos: string = pokemon.tipos.join(", ");
  return (
    `#${pokemon.id} - ${pokemon.nome} | Tipos: ${tipos} | ` +
    `Altura: ${pokemon.altura} | Peso: ${pokemon.peso} | ` +
    `HP: ${pokemon.hp} | ATK: ${pokemon.ataque} | DEF: ${pokemon.defesa}`
  );
}

export function msgOk(texto: string): string {
  return `[OK] ${texto}`;
}

export function msgAviso(texto: string): string {
  return `[AVISO] ${texto}`;
}

export function msgErro(texto: string): string {
  return `[ERRO] ${texto}`;
}
