import {
  calcular1RM,
  calcularGET,
  calcularIMC,
  calcularMacros,
  calcularTMB,
  caloriasDoObjetivo,
  classificarIMC,
  consumoAgua,
  faixaPesoSaudavel,
  formatarTempo,
  paraNumero,
  percentualGorduraMarinha,
  preverTempoRiegel,
  zonasTreino,
} from "./formulas";

const homem = { peso: 80, altura: 180, idade: 30, sexo: "masculino" };
const mulher = { peso: 60, altura: 165, idade: 28, sexo: "feminino" };

describe("taxa metabólica basal", () => {
  test("Mifflin-St Jeor bate com o cálculo manual", () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(calcularTMB({ formula: "mifflin", ...homem })).toBeCloseTo(1780, 5);
    // 10*60 + 6.25*165 - 5*28 - 161 = 1330.25
    expect(calcularTMB({ formula: "mifflin", ...mulher })).toBeCloseTo(1330.25, 5);
  });

  test("Harris-Benedict estima acima de Mifflin para o mesmo perfil", () => {
    expect(calcularTMB({ formula: "harris", ...homem })).toBeGreaterThan(
      calcularTMB({ formula: "mifflin", ...homem })
    );
  });

  test("Katch-McArdle usa a massa magra", () => {
    // massa magra = 80 * 0.8 = 64 -> 370 + 21.6*64 = 1752.4
    expect(
      calcularTMB({ formula: "katch", ...homem, percentualGordura: 20 })
    ).toBeCloseTo(1752.4, 5);
  });

  test("sem percentual de gordura, Katch cai para Mifflin", () => {
    expect(calcularTMB({ formula: "katch", ...homem, percentualGordura: 0 })).toBeCloseTo(
      calcularTMB({ formula: "mifflin", ...homem }),
      5
    );
  });
});

describe("gasto total e objetivos", () => {
  test("aplica o fator de atividade", () => {
    expect(calcularGET(2000, "sedentario")).toBeCloseTo(2400);
    expect(calcularGET(2000, "moderado")).toBeCloseTo(3100);
  });

  test("déficit e superávit ajustam as calorias", () => {
    expect(caloriasDoObjetivo(2000, "cutting")).toBeCloseTo(1800);
    expect(caloriasDoObjetivo(2000, "manutencao")).toBeCloseTo(2000);
    expect(caloriasDoObjetivo(2000, "bulking-agressivo")).toBeCloseTo(2400);
  });
});

describe("macronutrientes", () => {
  test("proteína e gordura saem do peso e o carboidrato fecha a conta", () => {
    const macros = calcularMacros({
      calorias: 2000,
      peso: 80,
      proteinaPorKg: 2,
      gorduraPorKg: 1,
    });

    expect(macros.proteina.gramas).toBe(160); // 640 kcal
    expect(macros.gordura.gramas).toBe(80); // 720 kcal
    expect(macros.carboidrato.gramas).toBeCloseTo(160); // 640 kcal restantes
    expect(
      macros.proteina.percentual + macros.gordura.percentual + macros.carboidrato.percentual
    ).toBeCloseTo(100);
    expect(macros.estourou).toBe(false);
  });

  test("sinaliza quando proteína e gordura estouram as calorias", () => {
    const macros = calcularMacros({
      calorias: 1000,
      peso: 90,
      proteinaPorKg: 2.5,
      gorduraPorKg: 1.5,
    });

    expect(macros.estourou).toBe(true);
    expect(macros.carboidrato.gramas).toBe(0);
  });
});

describe("IMC", () => {
  test("calcula e classifica", () => {
    expect(calcularIMC(80, 180)).toBeCloseTo(24.69, 2);
    expect(classificarIMC(24.69).rotulo).toBe("Peso normal");
    expect(classificarIMC(17).rotulo).toBe("Abaixo do peso");
    expect(classificarIMC(31).rotulo).toBe("Obesidade grau I");
  });

  test("faixa saudável usa IMC de 18,5 a 24,9", () => {
    const faixa = faixaPesoSaudavel(180);
    expect(faixa.minimo).toBeCloseTo(59.94, 2);
    expect(faixa.maximo).toBeCloseTo(80.68, 2);
  });
});

describe("composição corporal", () => {
  test("percentual de gordura cai em faixa plausível", () => {
    const percentual = percentualGorduraMarinha({
      sexo: "masculino",
      altura: 180,
      pescoco: 38,
      cintura: 85,
    });
    expect(percentual).toBeGreaterThan(10);
    expect(percentual).toBeLessThan(25);
  });

  test("cintura menor que o pescoço não produz número", () => {
    expect(
      percentualGorduraMarinha({ sexo: "masculino", altura: 180, pescoco: 40, cintura: 38 })
    ).toBeNaN();
  });
});

describe("hidratação", () => {
  test("soma base, treino e clima", () => {
    const { totalMl } = consumoAgua({ peso: 80, minutosTreino: 60, climaQuente: false });
    expect(totalMl).toBeCloseTo(80 * 35 + 600);
  });
});

describe("1RM", () => {
  test("com 1 repetição o 1RM é a própria carga", () => {
    expect(calcular1RM(100, 1).media).toBe(100);
  });

  test("Epley segue a fórmula original", () => {
    expect(calcular1RM(100, 10).epley).toBeCloseTo(133.33, 2);
  });
});

describe("zonas de frequência cardíaca", () => {
  test("sem FC de repouso usa percentual da FC máxima", () => {
    const zonas = zonasTreino({ fcMax: 190, fcRepouso: NaN });
    expect(zonas[0].de).toBeCloseTo(95);
    expect(zonas[4].ate).toBeCloseTo(190);
    expect(zonas[0].metodo).toBe("% da FC máxima");
  });

  test("com FC de repouso usa Karvonen", () => {
    const zonas = zonasTreino({ fcMax: 190, fcRepouso: 60 });
    // 50% de 130 de reserva + 60 = 125
    expect(zonas[0].de).toBeCloseTo(125);
    expect(zonas[4].ate).toBeCloseTo(190);
    expect(zonas[0].metodo).toBe("Karvonen");
  });
});

describe("corrida", () => {
  test("formata tempo em minutos e horas", () => {
    expect(formatarTempo(330)).toBe("5:30");
    expect(formatarTempo(3725)).toBe("1:02:05");
  });

  test("Riegel prevê tempo maior para distância maior", () => {
    const tempo10k = preverTempoRiegel(1500, 5, 10); // 25 min nos 5 km
    expect(tempo10k).toBeGreaterThan(3000);
    expect(tempo10k).toBeLessThan(3300);
  });
});

describe("conversão de entrada", () => {
  test("aceita vírgula decimal e rejeita vazio", () => {
    expect(paraNumero("72,5")).toBe(72.5);
    expect(paraNumero("80")).toBe(80);
    expect(paraNumero("")).toBeNaN();
  });
});
