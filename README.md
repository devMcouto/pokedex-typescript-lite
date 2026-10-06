# Pokédex TypeScript Lite

## Sobre o projeto

Aplicação de terminal em Node.js com TypeScript que consulta dados de Pokémon na PokeAPI e organiza os resultados em um catálogo local, salvo no arquivo `pc_box.json`.

## Objetivo

Praticar os conceitos do Módulo 01: Node.js, TypeScript, interfaces, classes, async/await, fetch, tratamento de erros, métodos de array, GitHub, GitFlow e Kanban.

## Tecnologias utilizadas

- Node.js
- TypeScript
- TSX
- PokeAPI
- Git e GitHub

## Pré-requisitos

- Node.js 18 ou superior (precisa do `fetch` nativo)
- npm
- Git

## Como instalar

```bash
git clone https://github.com/devMcouto/pokedex-typescript-lite.git
cd pokedex-typescript-lite
npm install
```

## Como executar

```bash
npm run start
```

Outros scripts: `npm run dev` (mesmo que start) e `npm run build` (compila com `tsc`).

## Funcionalidades

- Buscar Pokémon por nome ou ID na PokeAPI
- Tratar erro de Pokémon inexistente (404)
- Transformar a resposta da API em um objeto simplificado
- Adicionar ao catálogo local (`pc_box.json`)
- Impedir Pokémon duplicado
- Listar o catálogo
- Remover Pokémon por ID
- Exibir mensagens claras no terminal

## Exemplos de execução

### Busca válida

Entrada testada: opção `1` e `pikachu`

```
[OK] Pokémon encontrado: pikachu
#25 - pikachu | Tipos: electric | Altura: 4 | Peso: 60 | HP: 35 | ATK: 55 | DEF: 40
[OK] pikachu adicionado ao catálogo.
```

### Busca inválida

Entrada testada: opção `1` e `pokemon-inexistente`

```
[ERRO] Pokémon não encontrado: pokemon-inexistente
```

### Duplicidade

Entrada testada: adicionar `pikachu` duas vezes

```
[AVISO] pikachu já está no catálogo.
```

### Remoção

Entrada testada: opção `3` e ID `25`

```
[OK] Pokémon removido do catálogo.
```

## Estrutura do projeto

```
src/
├── main.ts # ponto de entrada, injeta as dependências
├── controllers/
│ └── TerminalController.ts # menu e interação com o usuário
├── services/
│ ├── PokeApiService.ts # integração com a PokeAPI (fetch)
│ └── BoxService.ts # persistência em pc_box.json
├── models/
│ ├── Pokemon.ts # interfaces PokemonResumo e PokemonApiResponse
│ └── CustomErrors.ts # APIError e LocalBoxError
└── utils/
└── textFormatters.ts # funções de formatação de texto
pc_box.json # banco de dados local
tsconfig.json
package.json
```

## Conceitos aplicados

- **TypeScript e interface:** `PokemonApiResponse` foi aplicado para descrever o arquivo JSON que vem da API e `PokemonResumo` descreve o objeto simplificado que o programa usa depois de converter a resposta, indicando qual o formato dos dados e os tipando, o que faz o TypeScript avisar de erros ainda no editor, assim criando um autocomplete indicando os dados necessários durante o desenvolvimento.

- **Fetch e async/await:** O fetch foi utilizado para realizar a requisiçao para a API,async torna a funçao assincrona , como o fetch nao recebe a resposta imediatamente ele retorna uma promise que seria como uma promessa de que vai ser entregue, o await é usado para esperar a promise terminar e entregar o resultado quando terminar, `Promise<PokemonResumo>` representa o que vai ser entregue , que no caso é o PokemonResumo.

- **Tratamento de erros:** `APIError` foi implementado para tratar os erros customizados, relacionados a API , a vantagem é saber qual o tipo de problema aconteceu. `LocalBoxError` faz a mesma coisa porém trata os erros de armazenamento local. Quando um Pokémon nao existe (404) ou a rede falha, o `PokeApiService` lança um `APIError`, quando há problema com o arquivo o `BoxService` lança `LocalBoxError`. O `TerminalController` captura esses erros no try/catch e exibe a mensagem [ERRO].

- **Métodos de array:** O map foi utilizado em PokeApiService quando a API devolve a informaçao como uma lista de objetos o map percorre essa lista criando um novo array com os nomes em string. Já o obterStat devolve os atributos stats da lista , e o find foi usado para encontrar o item por nome, hp,attack ou defense.
  Em BoxService o some foi utilizado para verificar se um elemento atende a condiçao , como verificar se o Pokémon ja existe , assim quando usar adicionar ele impede o duplicado e no remover confirma que o pokémon existe antes de remover. Ainda em boxService foi utilizado o filter para criar um novo array apenas com os elementos que atendem a condiçao como um filtro.
  Em TerminalController foi utilizado o forEach para percorrer o cátalogo de Pokémon e imprimir cada Pokémon no terminal,sem criar um novo array. O reduce foi utilizado para somar o peso de todos os Pokémons do catálogo em um unico número o peso somado, a funcao dele é transformar vários elementos em um unico resultado.

- **Classes:**

`PokeApiService:` Essa camada usa o fetch para consultar a PokeAPI,trata o erro de pokemon inexistente e falhas de rede, simplificando a resposta da API no objeto PokemonResumo.
`BoxService:` É a camada de persistência, ler e gravar as informaçoes adicionadas em pc_box.json, bloqueando duplicados pelo id e remover pelo id e lista o que está salvo.
TerminalController: É a camada de interface, mostra o menu , é onde o usuario informa a opçao e ela chama os services e exibe as mensagens [OK],[AVISO] e [ERRO].

O atributo private foi utilizado para encapsular o que é interno da classe, como caminhoArquivo no (BoxService) e baseUrl no (PokeApiService), nenhuma outra parte do programa precisa mexer neles.Métodos como salvar, mapearResposta e obterStat sao auxiliares, só existem para os métodos publicos funcionarem. Assim quem usa a classe so enxerga o essencial(listar,adicionar,remover,buscarPokemon).

O `TerminalController` recebe o `PokeApiService` e o `BoxService` pelo construtor ao invés de criá-los dentro dele. Isso se chama injeção de dependências, e quem cria e entrega os objetos é o `main.ts`. Assim as classes ficam separadas podendo alterar ou trocar peças sem mexer nas outras.

## Organização do Kanban

Link do Kanban: https://github.com/users/devMcouto/projects/1/views/1

## Branches utilizadas

- `main`: versão final
- `develop`: integração
- `feat/pokedex`: desenvolvimento do sistema
- `docs/readme`: documentação

## Vídeo de apresentação

COLE_AQUI_O_LINK_DO_VIDEO

## Melhorias futuras

- Exibir filtros por tipo de Pokémon
- Criar uma API própria com Express
