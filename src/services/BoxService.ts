import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PokemonResumo } from "../models/Pokemon.js";
import { LocalBoxError } from "../models/CustomErros.js";

export class BoxService {
  private readonly caminhoArquivo: string;
  constructor(nomeArquivo: string = "pc_box.json") {
    this.caminhoArquivo = path.resolve(process.cwd(), nomeArquivo);
  }

  async listar(): Promise<PokemonResumo[]> {
    try {
      const conteudo: string = await readFile(this.caminhoArquivo, "utf-8");
      const dados: unknown = JSON.parse(conteudo);

      if (!Array.isArray(dados)) {
        throw new LocalBoxError(
          "O arquivo pc_box.json está em formato inválido.",
        );
      }

      return dados as PokemonResumo[];
    } catch (erro) {
      if (erro instanceof LocalBoxError) {
        throw erro;
      }

      if (this.arquivoNaoExiste(erro)) {
        await this.salvar([]);
        return [];
      }

      throw new LocalBoxError("Não foi possível ler o pc_box.json.");
    }
  }

  async adicionar(pokemon: PokemonResumo): Promise<boolean> {
    const box: PokemonResumo[] = await this.listar();

    const jaExiste: boolean = box.some((item) => item.id === pokemon.id);
    if (jaExiste) {
      return false;
    }

    box.push(pokemon);
    await this.salvar(box);
    return true;
  }

  async remover(id: number): Promise<boolean> {
    const box: PokemonResumo[] = await this.listar();

    const existe: boolean = box.some((item) => item.id === id);
    if (!existe) {
      return false;
    }

    const atualizado: PokemonResumo[] = box.filter((item) => item.id !== id);
    await this.salvar(atualizado);
    return true;
  }

  private async salvar(box: PokemonResumo[]): Promise<void> {
    try {
      await writeFile(
        this.caminhoArquivo,
        JSON.stringify(box, null, 2),
        "utf-8",
      );
    } catch {
      throw new LocalBoxError("Não foi possível gravar no pc_box.json.");
    }
  }

  private arquivoNaoExiste(erro: unknown): boolean {
    return (
      typeof erro === "object" &&
      erro !== null &&
      "code" in erro &&
      (erro as { code: string }).code === "ENOENT"
    );
  }
}
