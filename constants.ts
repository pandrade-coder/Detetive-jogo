
import { GameCard } from './types';

const generateCards = (): GameCard[] => {
  const cards: GameCard[] = [];

  // 5 Dossiers
  const dossierData = [
    { id: "D1", nome: "Major Silas", cargo: "Chefe de Segurança", descricao: "Veterano, rígido, conhece todos os pontos cegos das câmeras. Sob pressão financeira.", code: "SXP-01" },
    { id: "D2", nome: "Engª. Beatriz Viana", cargo: "Projetista-chefe", descricao: "Ambiciosa, em disputa por promoção. O Dr. Rossi ia denunciá-la por sabotagem.", code: "SXP-02" },
    { id: "D3", nome: "Dr. Klaus", cargo: "Químico Sênior", descricao: "Trabalha com combustíveis. Exausto e prestes a se aposentar. Mentiu sobre medicação.", code: "SXP-03" },
    { id: "D4", nome: "Sérgio 'Sombra'", cargo: "Técnico de Manutenção", descricao: "Conhece as tubulações. Possui dívidas de jogo. Estava no subsolo na hora do crime.", code: "SXP-04" },
    { id: "D5", nome: "Elena", cargo: "Secretária Administrativa", descricao: "Discreta, ouve tudo. Viu vultos saindo pelo corredor de manutenção.", code: "SXP-05" }
  ];

  dossierData.forEach((d) => {
    cards.push({
      id: `dossier-${d.id}`,
      type: 'dossier',
      title: `${d.nome} (${d.cargo})`,
      description: d.descricao,
      code: d.code
    });
  });

  // 12 Evidências Forenses
  const evidenceData = [
    { id: "E1", titulo: "Laudo Necropsia", texto: "Óbito entre 22h45 e 23h15. Golpe na nuca por objeto contundente. Sem sinais de defesa.", code: "EVD-E1" },
    { id: "E2", titulo: "Registro Biométrico", texto: "Falha de sistema entre 22h50 e 23h01. Beatriz saiu às 22h05, mas não há registro de entrada no quarto.", code: "EVD-E2" },
    { id: "E3", titulo: "Fragmento de Fibra", texto: "Lasca de Cromo-Vanádio e graxa encontrada na ferida. Material usado em ferramentas pesadas.", code: "EVD-E3" },
    { id: "E4", titulo: "Digital Latente", texto: "Digital de Sérgio 'Sombra' encontrada no cofre onde o protótipo estava guardado.", code: "EVD-E4" },
    { id: "E5", titulo: "Resíduo Químico", texto: "Traços de combustível 'Hydra-Z' nas mãos da vítima. Substância de acesso restrito ao Dr. Klaus.", code: "EVD-E5" },
    { id: "E6", titulo: "Extrato Bancário", texto: "Transferência de US$ 250.000 agendada para 23h30 em criptoativos. Beneficiário oculto.", code: "EVD-E6" },
    { id: "E7", titulo: "Gravação de Áudio", texto: "22h42: 'O sistema vai cair em 5 minutos. Pegue o drive e saia'. Som de impacto metálico.", code: "EVD-E7" },
    { id: "E8", titulo: "Objeto Quebrado", texto: "Lenço com iniciais 'K.W.' (Klaus) encontrado com cheiro de reagentes sob a bancada.", code: "EVD-E8" },
    { id: "E9", titulo: "Log de Sistemas", texto: "O comando de desligar as câmeras partiu do terminal da Sala da Chefia (Beatriz) às 22h48.", code: "EVD-E9" },
    { id: "E10", titulo: "Foto da Cena", texto: "Pegadas tamanho 42/43 com graxa indo em direção à porta de serviço dos fundos.", code: "EVD-E10" },
    { id: "E11", titulo: "E-mail Rascunho", texto: "Dr. Rossi pretendia denunciar a Engª Viana por falsificar testes de estresse do motor.", code: "EVD-E11" },
    { id: "E12", titulo: "Maleta Vazia", texto: "Protótipo sumiu. Requer uma chave física (Token USB) que ficava com a vítima.", code: "EVD-E12" }
  ];

  evidenceData.forEach((d) => {
    cards.push({
      id: `evid-${d.id}`,
      type: 'evidence',
      title: d.titulo,
      description: d.texto,
      code: d.code
    });
  });

  // 8 Interrogatórios
  const interrogationData = [
    { id: "I1", autor: "Major Silas", texto: "Fiz ronda externa das 22h30 às 23h15. Não vi ninguém entrar ou sair.", code: "TRN-I1" },
    { id: "I2", autor: "Engª. Beatriz", texto: "Fui para o alojamento às 22h05. Não saí de lá até ser chamada pelo Major.", code: "TRN-I2" },
    { id: "I3", autor: "Dr. Klaus", texto: "Tive labirintite, tomei sedativo e apaguei no meu dormitório desde as 21h.", code: "TRN-I3" },
    { id: "I4", autor: "Sérgio 'Sombra'", texto: "Estava no subsolo consertando o gerador. O Major Silas sabia que eu estava lá.", code: "TRN-I4" },
    { id: "I5", autor: "Elena", texto: "Ouvi passos de botas no corredor de manutenção durante o apagão das 22h50.", code: "TRN-I5" },
    { id: "I6", autor: "Acareação", texto: "Beatriz diz que Klaus discutiu com a vítima sobre bônus de aposentadoria às 20h.", code: "TRN-I6" },
    { id: "I7", autor: "Guarda Mendes", texto: "Ouvi um estrondo metálico às 22h45 vindo do Hangar, seguido do apagão.", code: "TRN-I7" },
    { id: "I8", autor: "Álibi Verificado", texto: "Registro mostra que Beatriz só entrou no quarto à 00h45. Klaus não retirou sedativos.", code: "TRN-I8" }
  ];

  interrogationData.forEach((d) => {
    cards.push({
      id: `inter-${d.id}`,
      type: 'interrogation',
      title: d.autor,
      description: d.texto,
      code: d.code
    });
  });

  // 6 Recursos Táticos (Mantendo os textos do prompt anterior)
  const resourceData = [
    {
      title: "Mandado de Busca e Apreensão",
      description: "AUTORIZAÇÃO JUDICIAL: Permite a entrada forçada. Revele 2 cartas do topo. BÔNUS: Se uma for Evidência Forense [E], não gastam Tempo nesta rodada.",
      code: "TAC-R1"
    },
    {
      title: "Soro da Verdade (Pentotal Sódico)",
      description: "PROTOCOLO MÉDICO: Escolha um Interrogatório [I]. O sistema confirma se o suspeito mentiu ou disse a verdade.",
      code: "TAC-R2"
    },
    {
      title: "Análise de Laboratório (Espectrometria)",
      description: "SUPORTE TÉCNICO: Escolha [E3], [E5] ou [E8]. O laboratório confirma qual Suspeito [D] possui vestígios idênticos.",
      code: "TAC-R3"
    },
    {
      title: "Reconstituição do Crime",
      description: "INTELIGÊNCIA: Olhe as 4 primeiras cartas do topo. Reorganize-as ou coloque uma no fundo do baralho.",
      code: "TAC-R4"
    },
    {
      title: "Escuta Telefônica (Interceptação)",
      description: "OPERAÇÃO SIGILOSA: Escolha um Suspeito [D]. Descubra seu Motivo Real e conexões financeiras/emocionais ocultas.",
      code: "TAC-R5"
    },
    {
      title: "Pressão Psicológica (Nível 3)",
      description: "TÁTICA DE CAMPO: Revele a próxima carta. Se for Interrogatório [I], descarte e compre outra sem gastar tempo.",
      code: "TAC-R6"
    }
  ];

  resourceData.forEach((data, i) => {
    cards.push({
      id: `rec-${i + 1}`,
      type: 'resource',
      title: data.title,
      description: data.description,
      code: data.code
    });
  });

  return cards;
};

export const INITIAL_CARDS = generateCards();
