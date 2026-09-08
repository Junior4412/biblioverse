import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const groups = {
  'Ficção Científica': [
    '2001: Uma Odisseia no Espaco', 'A Guerra dos Mundos', 'A Mao Esquerda da Escuridao',
    'A Maquina do Tempo', 'Admiravel Mundo Novo', 'Androides Sonham com Ovelhas Eletricas?',
    'Aniquilacao', 'Blade Runner: Androides Sonham com Ovelhas Eletricas?', 'Contato', 'Divergente',
    'Encontro com Rama', 'Eu, Robo', 'Fundacao', 'Jogos Vorazes', 'Klara e o Sol', 'Matadouro-Cinco',
    'Perdido em Marte', 'Projeto Hail Mary', 'Recursao', 'Superinteligencia', 'Uma Breve Historia do Tempo',
    'Vida 3.0', 'O Fim da Eternidade', 'O Fim da Infancia', 'O Guia do Mochileiro das Galaxias',
    'O Homem do Castelo Alto', 'O Problema dos Tres Corpos', 'Os Despossuidos',
  ],
  Fantasia: [
    'A Batalha do Labirinto', 'A Bússola de Ouro', 'A Cancao de Aquiles', 'A Coroa de Ossos Dourados',
    'A Rainha Vermelha', 'A Sociedade do Anel', 'A Troca', 'A Vida Invisivel de Addie LaRue',
    'Alice no Pais das Maravilhas', 'As Duas Torres', 'Cidade dos Ossos', 'Corte de Espinhos e Rosas',
    'Harry Potter e a Pedra Filosofal', 'Jonathan Strange e Mr. Norrell', 'Mistborn: O Imperio Final',
    'Nona Casa', 'O Aprendiz de Assassino', 'O Caminho dos Reis', 'O Ladrao de Raios',
    'O Leao, a Feiticeira e o Guarda-Roupa', 'O Hobbit', 'O Priorado da Laranjeira',
    'O Retorno do Rei', 'O Silmarillion', 'O Temor do Sabio', 'Percy Jackson e o Ladrao de Raios',
    'Sombra e Ossos', 'Trono de Vidro', 'Vilao',
  ],
  Terror: [
    'A Assombracao da Casa da Colina', 'A Entidade', 'A Estrada da Noite', 'A Hora do Vampiro',
    'A Volta do Parafuso', 'Entrevista com o Vampiro', 'Eu Sou a Lenda', 'It: A Coisa',
    'O Bebe de Rosemary', 'O Cemiterio', 'O Chamado de Cthulhu', 'O Exorcista', 'O Iluminado',
  ],
  Suspense: [
    'A Garota no Trem', 'A Mulher na Janela', 'A Paciente Silenciosa', 'Anjos e Demonios',
    'Antes de Dormir', 'Assassinato no Expresso do Oriente', 'E Nao Sobrou Nenhum', 'Garota Exemplar',
    'Lugares Escuros', 'Morte no Nilo', 'No Escuro', 'O Casal que Mora ao Lado', 'O Codigo Da Vinci',
    'O Homem de Giz', 'O Nome da Rosa', 'O Silencio dos Inocentes', 'Objetos Cortantes',
  ],
  Mangás: [
    '20th Century Boys Vol. 1', 'Ataque dos Titas Vol. 1', 'Berserk Vol. 1', 'Demon Slayer Vol. 1',
    'Dragon Ball Vol. 1', 'Fruits Basket Vol. 1', 'Haikyu!! Vol. 1', 'Naruto Vol. 1', 'Vinland Saga Vol. 1',
  ],
  HQs: [
    'A Piada Mortal', 'Batman: Ano Um', 'Batman: O Cavaleiro das Trevas', 'Demolidor: A Queda de Murdock',
    'Heartstopper Vol. 1', 'Reino do Amanha', 'Saga Vol. 1', 'Sandman: Preludios e Noturnos',
    'Sapiens: Uma Historia Grafica', 'Solitario', 'Superman: Entre a Foice e o Martelo', 'V de Vinganca',
    'X-Men: Deus Ama, o Homem Mata',
  ],
  Filosofia: [
    'A Estrutura das Revolucoes Cientificas', 'A Náusea', 'A Republica', 'A Sociedade do Cansaco',
    'Assim Falou Zaratustra', 'Cartas a Lucilio', 'Crítica da Razao Pura', 'Meditacoes', 'O Contrato Social',
    'O Mundo de Sofia', 'O Principe', 'O Segundo Sexo', 'Sociedade do Cansaco',
  ],
  Negócios: [
    'A Arte da Guerra', 'A Estrategia do Oceano Azul', 'A Meta', 'A Psicologia Financeira', 'A Startup Enxuta',
    'Comece pelo Porquê', 'De Zero a Um', 'Empresas Feitas para Vencer', 'Feitas para Durar', 'Hooked',
    'O Dilema da Inovacao', 'O Gestor Eficaz', 'O Homem mais Rico da Babilonia', 'O Investidor Inteligente',
    'O Jeito Disney de Encantar os Clientes', 'Os Segredos da Mente Milionaria', 'Pai Rico, Pai Pobre',
    'Posicionamento', 'Quem Pensa Enriquece', 'Rapido e Devagar',
  ],
  'Desenvolvimento Pessoal': [
    '12 Regras Para a Vida', 'Ansiedade: Como Enfrentar o Mal do Seculo', 'Como Fazer Amigos e Influenciar Pessoas',
    'Essencialismo', 'Faça Tempo', 'Inteligencia Emocional', 'Mais Esperto que o Diabo',
    'Mindfulness em Oito Semanas', 'O Milagre da Manha', 'O Monge e o Executivo', 'O Poder da Acao',
    'O Poder do Agora', 'O Poder do Habito', 'Os 7 Habitos das Pessoas Altamente Eficazes',
    'Roube como um Artista', 'A Sutil Arte de Ligar o Foda-se',
  ],
  Tecnologia: [
    'Algoritmos para Viver', 'Armas de Destruicao Matematica', 'Entendendo Algoritmos',
    'O Programador Pragmatico',
  ],
  História: [
    '1499: O Brasil Antes de Cabral', '21 Licoes para o Seculo 21', 'A Era dos Extremos',
    'A Origem das Especies', 'Brasil: Uma Biografia', 'Breves Respostas para Grandes Questoes',
    'Eu Sou Malala', 'Homo Deus', 'O Diario de Anne Frank', 'O Gene',
  ],
  Clássicos: [
    'A Metamorfose', 'A Peste', 'A Rebeliao de Atlas', 'A Revolucao dos Bichos', 'Anna Karenina',
    'Capitaes da Areia', 'Cem Anos de Solidao', 'Crime e Castigo', 'Grande Sertao: Veredas', 'Guerra e Paz',
    'O Cortico', 'O Estrangeiro', 'O Medico e o Monstro', 'O Morro dos Ventos Uivantes',
    'O Pequeno Principe', 'O Processo', 'O Quinze', 'O Retrato de Dorian Gray', 'O Sol e Para Todos',
    'Os Irmaos Karamazov', 'Romeu e Julieta', 'Sao Bernardo', 'Vidas Secas',
  ],
  Romance: [
    'A Biblioteca da Meia-Noite', 'A Casa dos Espiritos', 'A Catedral do Mar', 'A Cidade do Sol',
    'A Cinco Passos de Voce', 'A Cor Purpura', 'A Culpa e das Estrelas', 'A Hipotese do Amor',
    'A Menina que Roubava Livros', 'A Seleção', 'Amor e Gelato', 'Aristoteles e Dante Descobrem os Segredos do Universo',
    'As Vantagens de Ser Invisivel', 'Como Eu Era Antes de Voce', 'Daisy Jones & The Six', 'E Assim que Acaba',
    'Extraordinario', 'Me Chame Pelo Seu Nome', 'Novembro, 9', 'O Amor nos Tempos do Colera',
    'O Cacador de Pipas', 'O Conto da Aia', 'O Lado Feio do Amor', 'O Peso do Passaro Morto',
    'O Sol e Para Todos', 'Olhos d Agua', 'Orgulho e Preconceito', 'Os Dois Morrem no Final',
    'Os Sete Maridos de Evelyn Hugo', 'Para Todos os Garotos que Ja Amei', 'Pequena Coreografia do Adeus',
    'Persuasao', 'Pessoas Normais', 'Razao e Sensibilidade', 'Sem Esperanca',
    'Simon vs. A Agenda Homo Sapiens', 'Talvez Um Dia', 'Todas as Suas Imperfeicoes', 'Tudo e Rio',
    'Um Dia', 'Vermelho, Branco e Sangue Azul',
  ],
  Drama: [
    'A Casa dos Espiritos', 'A Cidade do Sol', 'A Cor Purpura', 'A Peste', 'A Sociedade do Cansaco',
    'O Conto da Aia', 'O Peso do Passaro Morto', 'Olhos d Agua', 'Pequena Coreografia do Adeus', 'Tudo e Rio',
  ],
}

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll('?', '').trim()
const assignments = new Map()

for (const [genre, titles] of Object.entries(groups)) {
  for (const title of titles) assignments.set(normalize(title), genre)
}

const [inputPath = 'genre-review.csv', outputDirectory = '.'] = process.argv.slice(2)
const csv = await readFile(inputPath, 'utf8')
const lines = csv.trimEnd().split(/\r?\n/)
const rows = lines.slice(1).map((line) => {
  const cells = [...line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map((match) => (match[1] ?? match[2]).replaceAll('""', '"'))
  return { id: cells[0], title: cells[1], author: cells[2], suggestion: cells[3] }
})

const remaining = rows.filter((row) => row.suggestion === 'SEM SUGESTÃO')
const missing = remaining.filter((row) => !assignments.has(normalize(row.title)))
if (missing.length) {
  throw new Error(`Faltam categorias para: ${missing.map((row) => row.title).join(' | ')}`)
}

const review = [
  'id,title,author,genero_sugerido,origem',
  ...remaining.map((row) => [row.id, row.title, row.author, assignments.get(normalize(row.title)), 'classificacao editorial por titulo e autor']
    .map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')),
  '',
].join('\n')

const sql = [
  '-- Revise genre-review-curated.csv antes de executar estas atualizações.',
  'begin;',
  ...remaining.map((row) => {
    const genre = assignments.get(normalize(row.title)).replaceAll("'", "''")
    return `update public.books set genre_id = (select id from public.genres where name = '${genre}') where id = '${row.id}' and genre_id is null;`
  }),
  'commit;',
  '',
].join('\n')

await writeFile(resolve(outputDirectory, 'genre-review-curated.csv'), review, 'utf8')
await writeFile(resolve(outputDirectory, 'genre-updates-curated.sql'), sql, 'utf8')
console.log(`Pronto: ${remaining.length} livros categorizados para revisão.`)
