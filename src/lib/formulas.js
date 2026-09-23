/**
 * Fórmulas de saúde, nutrição e treino.
 * Funções puras: recebem números, devolvem números/objetos. Sem React aqui,
 * o que deixa tudo fácil de testar e reutilizar.
 *
 * Convenções: peso em kg, altura em cm, idade em anos, sexo "masculino" | "feminino".
 */

// ---------------------------------------------------------------- utilitários

export const arredondar = (valor, casas = 0) => {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
};

export const limitar = (valor, min, max) => Math.min(Math.max(valor, min), max);

/** Converte "1.234,5" ou "1234.5" em número. Devolve NaN se não der. */
export const paraNumero = (valor) => {
  if (typeof valor === "number") return valor;
  if (typeof valor !== "string" || valor.trim() === "") return NaN;
  return Number(valor.replace(/\./g, "").replace(",", "."));
};

// -------------------------------------------------- taxa metabólica basal (TMB)

export const FORMULAS_TMB = {
  mifflin: {
    nome: "Mifflin-St Jeor",
    descricao: "Padrão-ouro atual para quem não sabe o % de gordura.",
  },
  harris: {
    nome: "Harris-Benedict (revisada)",
    descricao: "Clássica de 1984. Costuma estimar um pouco acima.",
  },
  katch: {
    nome: "Katch-McArdle",
    descricao: "A mais precisa — exige o percentual de gordura.",
  },
};

/** Mifflin-St Jeor (1990) */
export function tmbMifflin({ peso, altura, idade, sexo }) {
  const base = 10 * peso + 6.25 * altura - 5 * idade;
  return sexo === "masculino" ? base + 5 : base - 161;
}

/** Harris-Benedict revisada por Roza & Shizgal (1984) */
export function tmbHarrisBenedict({ peso, altura, idade, sexo }) {
  return sexo === "masculino"
    ? 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade
    : 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade;
}

/** Katch-McArdle (1996) — usa a massa livre de gordura */
export function tmbKatchMcArdle({ peso, percentualGordura }) {
  const massaMagra = peso * (1 - percentualGordura / 100);
  return 370 + 21.6 * massaMagra;
}

export function calcularTMB({ formula, peso, altura, idade, sexo, percentualGordura }) {
  if (formula === "katch" && percentualGordura > 0) {
    return tmbKatchMcArdle({ peso, percentualGordura });
  }
  if (formula === "harris") return tmbHarrisBenedict({ peso, altura, idade, sexo });
  return tmbMifflin({ peso, altura, idade, sexo });
}

// -------------------------------------------------------- gasto total (GET/TDEE)

export const NIVEIS_ATIVIDADE = [
  {
    id: "sedentario",
    fator: 1.2,
    rotulo: "Sedentário",
    detalhe: "Trabalho sentado, pouco ou nenhum exercício",
  },
  {
    id: "leve",
    fator: 1.375,
    rotulo: "Levemente ativo",
    detalhe: "Exercício leve 1 a 3x por semana",
  },
  {
    id: "moderado",
    fator: 1.55,
    rotulo: "Moderadamente ativo",
    detalhe: "Exercício moderado 3 a 5x por semana",
  },
  {
    id: "intenso",
    fator: 1.725,
    rotulo: "Muito ativo",
    detalhe: "Treino intenso 6 a 7x por semana",
  },
  {
    id: "atleta",
    fator: 1.9,
    rotulo: "Atleta",
    detalhe: "Treino pesado 2x ao dia ou trabalho braçal",
  },
];

export const fatorAtividade = (id) =>
  NIVEIS_ATIVIDADE.find((n) => n.id === id)?.fator ?? 1.2;

export const calcularGET = (tmb, nivelAtividade) => tmb * fatorAtividade(nivelAtividade);

export const OBJETIVOS = [
  {
    id: "cutting-agressivo",
    rotulo: "Perder peso rápido",
    ajuste: -0.2,
    detalhe: "Déficit de 20% — exige atenção à proteína e ao sono",
  },
  {
    id: "cutting",
    rotulo: "Perder peso",
    ajuste: -0.1,
    detalhe: "Déficit de 10% — o mais sustentável",
  },
  {
    id: "manutencao",
    rotulo: "Manter peso",
    ajuste: 0,
    detalhe: "Comer no próprio gasto energético",
  },
  {
    id: "bulking",
    rotulo: "Ganhar massa",
    ajuste: 0.1,
    detalhe: "Superávit de 10% — ganho limpo",
  },
  {
    id: "bulking-agressivo",
    rotulo: "Ganhar massa rápido",
    ajuste: 0.2,
    detalhe: "Superávit de 20% — ganha mais gordura junto",
  },
];

export const objetivoPorId = (id) => OBJETIVOS.find((o) => o.id === id) ?? OBJETIVOS[2];

export const caloriasDoObjetivo = (get, objetivoId) =>
  get * (1 + objetivoPorId(objetivoId).ajuste);

/** ~7700 kcal por kg de tecido. Devolve kg por semana (negativo = perda). */
export const variacaoPesoSemanal = (caloriasAlvo, get) =>
  ((caloriasAlvo - get) * 7) / 7700;

// ------------------------------------------------------------------ macros

/**
 * Distribui as calorias em proteína, gordura e carboidrato.
 * proteinaPorKg e gorduraPorKg em g/kg de peso corporal; o carbo fecha a conta.
 */
export function calcularMacros({ calorias, peso, proteinaPorKg, gorduraPorKg }) {
  const proteinaG = peso * proteinaPorKg;
  const gorduraG = peso * gorduraPorKg;
  const kcalProteina = proteinaG * 4;
  const kcalGordura = gorduraG * 9;
  const kcalCarbo = Math.max(calorias - kcalProteina - kcalGordura, 0);
  const carboG = kcalCarbo / 4;
  const total = kcalProteina + kcalGordura + kcalCarbo || 1;

  return {
    proteina: { gramas: proteinaG, kcal: kcalProteina, percentual: (kcalProteina / total) * 100 },
    gordura: { gramas: gorduraG, kcal: kcalGordura, percentual: (kcalGordura / total) * 100 },
    carboidrato: { gramas: carboG, kcal: kcalCarbo, percentual: (kcalCarbo / total) * 100 },
    /** true quando proteína + gordura já estouram as calorias do dia */
    estourou: kcalProteina + kcalGordura > calorias,
  };
}

// --------------------------------------------------------------------- IMC

export const calcularIMC = (peso, alturaCm) => peso / (alturaCm / 100) ** 2;

export const FAIXAS_IMC = [
  { limite: 18.5, rotulo: "Abaixo do peso", tom: "alerta" },
  { limite: 25, rotulo: "Peso normal", tom: "bom" },
  { limite: 30, rotulo: "Sobrepeso", tom: "alerta" },
  { limite: 35, rotulo: "Obesidade grau I", tom: "risco" },
  { limite: 40, rotulo: "Obesidade grau II", tom: "risco" },
  { limite: Infinity, rotulo: "Obesidade grau III", tom: "risco" },
];

export const classificarIMC = (imc) => FAIXAS_IMC.find((f) => imc < f.limite) ?? FAIXAS_IMC.at(-1);

// ------------------------------------------------------- composição corporal

/**
 * Percentual de gordura pelo método da Marinha americana (medidas em cm).
 * Homens usam cintura e pescoço; mulheres somam o quadril.
 */
export function percentualGorduraMarinha({ sexo, altura, pescoco, cintura, quadril }) {
  if (sexo === "masculino") {
    if (cintura - pescoco <= 0) return NaN;
    return (
      495 /
        (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) -
      450
    );
  }
  if (cintura + quadril - pescoco <= 0) return NaN;
  return (
    495 /
      (1.29579 -
        0.35004 * Math.log10(cintura + quadril - pescoco) +
        0.221 * Math.log10(altura)) -
    450
  );
}

const FAIXAS_GORDURA = {
  masculino: [
    { limite: 6, rotulo: "Gordura essencial", tom: "alerta" },
    { limite: 14, rotulo: "Atlético", tom: "bom" },
    { limite: 18, rotulo: "Em forma", tom: "bom" },
    { limite: 25, rotulo: "Aceitável", tom: "alerta" },
    { limite: Infinity, rotulo: "Acima do recomendado", tom: "risco" },
  ],
  feminino: [
    { limite: 14, rotulo: "Gordura essencial", tom: "alerta" },
    { limite: 21, rotulo: "Atlética", tom: "bom" },
    { limite: 25, rotulo: "Em forma", tom: "bom" },
    { limite: 32, rotulo: "Aceitável", tom: "alerta" },
    { limite: Infinity, rotulo: "Acima do recomendado", tom: "risco" },
  ],
};

export const classificarGordura = (percentual, sexo) =>
  FAIXAS_GORDURA[sexo].find((f) => percentual < f.limite) ?? FAIXAS_GORDURA[sexo].at(-1);

export const massaMagra = (peso, percentualGordura) => peso * (1 - percentualGordura / 100);

/** Razão cintura-quadril: indicador de risco cardiovascular */
export const razaoCinturaQuadril = (cintura, quadril) => cintura / quadril;

export function classificarRCQ(rcq, sexo) {
  const faixas =
    sexo === "masculino"
      ? [
          { limite: 0.9, rotulo: "Risco baixo", tom: "bom" },
          { limite: 1, rotulo: "Risco moderado", tom: "alerta" },
          { limite: Infinity, rotulo: "Risco alto", tom: "risco" },
        ]
      : [
          { limite: 0.8, rotulo: "Risco baixo", tom: "bom" },
          { limite: 0.85, rotulo: "Risco moderado", tom: "alerta" },
          { limite: Infinity, rotulo: "Risco alto", tom: "risco" },
        ];
  return faixas.find((f) => rcq < f.limite);
}

/** Razão cintura-estatura: ideal abaixo de 0,5 para os dois sexos */
export const razaoCinturaEstatura = (cintura, altura) => cintura / altura;

export const classificarRCEst = (valor) => {
  if (valor < 0.4) return { rotulo: "Abaixo do esperado", tom: "alerta" };
  if (valor < 0.5) return { rotulo: "Saudável", tom: "bom" };
  if (valor < 0.6) return { rotulo: "Risco aumentado", tom: "alerta" };
  return { rotulo: "Risco alto", tom: "risco" };
};

// -------------------------------------------------------------- peso ideal

/** Fórmulas clássicas de peso ideal (altura em cm) */
export function pesosIdeais({ altura, sexo }) {
  const polegadasAcimaDe5Pes = Math.max(altura / 2.54 - 60, 0);
  const homem = sexo === "masculino";

  return [
    {
      nome: "Devine",
      valor: (homem ? 50 : 45.5) + 2.3 * polegadasAcimaDe5Pes,
    },
    {
      nome: "Robinson",
      valor: (homem ? 52 : 49) + (homem ? 1.9 : 1.7) * polegadasAcimaDe5Pes,
    },
    {
      nome: "Miller",
      valor: (homem ? 56.2 : 53.1) + (homem ? 1.41 : 1.36) * polegadasAcimaDe5Pes,
    },
    {
      nome: "Hamwi",
      valor: (homem ? 48 : 45.5) + (homem ? 2.7 : 2.2) * polegadasAcimaDe5Pes,
    },
  ];
}

/** Faixa de peso com IMC saudável (18,5 a 24,9) */
export function faixaPesoSaudavel(alturaCm) {
  const m = alturaCm / 100;
  return { minimo: 18.5 * m * m, maximo: 24.9 * m * m };
}

// ------------------------------------------------------------------- água

/**
 * Ingestão diária: ~35 ml por kg + reposição do treino
 * (cerca de 600 ml por hora de atividade) e ajuste para clima quente.
 */
export function consumoAgua({ peso, minutosTreino = 0, climaQuente = false }) {
  const base = peso * 35;
  const treino = (minutosTreino / 60) * 600;
  const clima = climaQuente ? base * 0.1 : 0;
  const totalMl = base + treino + clima;
  return {
    baseMl: base,
    treinoMl: treino,
    climaMl: clima,
    totalMl,
    litros: totalMl / 1000,
    copos: totalMl / 250,
  };
}

// -------------------------------------------------------------------- 1RM

/** Estimativas de repetição máxima a partir de carga x repetições */
export function calcular1RM(carga, repeticoes) {
  if (repeticoes === 1) {
    return { epley: carga, brzycki: carga, lombardi: carga, media: carga };
  }
  const epley = carga * (1 + repeticoes / 30);
  const brzycki = (carga * 36) / (37 - repeticoes);
  const lombardi = carga * repeticoes ** 0.1;
  return { epley, brzycki, lombardi, media: (epley + brzycki + lombardi) / 3 };
}

/** Tabela de percentuais do 1RM com a estimativa de repetições de cada carga */
export const TABELA_PERCENTUAIS = [
  { percentual: 100, reps: 1 },
  { percentual: 95, reps: 2 },
  { percentual: 90, reps: 4 },
  { percentual: 85, reps: 6 },
  { percentual: 80, reps: 8 },
  { percentual: 75, reps: 10 },
  { percentual: 70, reps: 12 },
  { percentual: 65, reps: 16 },
  { percentual: 60, reps: 20 },
];

// ------------------------------------------------------ frequência cardíaca

/** Tanaka (2001): mais precisa que a antiga 220 - idade */
export const fcMaxTanaka = (idade) => 208 - 0.7 * idade;
export const fcMaxClassica = (idade) => 220 - idade;

export const ZONAS_FC = [
  { id: 1, min: 0.5, max: 0.6, nome: "Zona 1 — Recuperação", efeito: "Aquecimento e regeneração" },
  { id: 2, min: 0.6, max: 0.7, nome: "Zona 2 — Base aeróbica", efeito: "Queima de gordura e resistência" },
  { id: 3, min: 0.7, max: 0.8, nome: "Zona 3 — Aeróbico", efeito: "Melhora do condicionamento" },
  { id: 4, min: 0.8, max: 0.9, nome: "Zona 4 — Limiar", efeito: "Aumento do limiar anaeróbio" },
  { id: 5, min: 0.9, max: 1, nome: "Zona 5 — Máximo", efeito: "Potência e VO2 máx (tiros curtos)" },
];

/**
 * Karvonen usa a FC de repouso para personalizar as zonas.
 * Sem FC de repouso, cai no percentual simples da FC máxima.
 */
export function zonasTreino({ fcMax, fcRepouso }) {
  const usarKarvonen = Number.isFinite(fcRepouso) && fcRepouso > 0;
  const reserva = fcMax - (fcRepouso || 0);

  return ZONAS_FC.map((zona) => ({
    ...zona,
    de: usarKarvonen ? reserva * zona.min + fcRepouso : fcMax * zona.min,
    ate: usarKarvonen ? reserva * zona.max + fcRepouso : fcMax * zona.max,
    metodo: usarKarvonen ? "Karvonen" : "% da FC máxima",
  }));
}

// -------------------------------------------------------------- corrida

/** Pace em segundos por km */
export const paceSegundosPorKm = (distanciaKm, tempoSegundos) => tempoSegundos / distanciaKm;

export const velocidadeKmH = (distanciaKm, tempoSegundos) => distanciaKm / (tempoSegundos / 3600);

export const formatarTempo = (segundos) => {
  if (!Number.isFinite(segundos) || segundos < 0) return "--";
  const total = Math.round(segundos);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dd = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dd(m)}:${dd(s)}` : `${m}:${dd(s)}`;
};

/** Fórmula de Riegel: prevê o tempo em outra distância a partir de uma prova */
export const preverTempoRiegel = (tempoSegundos, distanciaKm, novaDistanciaKm) =>
  tempoSegundos * (novaDistanciaKm / distanciaKm) ** 1.06;

export const PROVAS = [
  { nome: "5 km", km: 5 },
  { nome: "10 km", km: 10 },
  { nome: "21,1 km (meia)", km: 21.0975 },
  { nome: "42,2 km (maratona)", km: 42.195 },
];

/** Gasto calórico aproximado da corrida: ~1 kcal por kg por km */
export const caloriasCorrida = (peso, distanciaKm) => peso * distanciaKm * 1.036;
