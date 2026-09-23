/** Conteúdo editorial: o "porquê" por trás dos números das calculadoras. */
const GUIAS = [
  {
    categoria: "Energia",
    titulo: "TMB, GET e o déficit que funciona",
    texto:
      "A TMB é o que você gastaria deitado o dia inteiro — algo entre 60% e 70% do total. O GET soma treino, trabalho e movimentação. Emagrecer é comer abaixo do GET; um déficit de 10% a 20% preserva músculo e não destrói a adesão.",
    itens: [
      "Déficits maiores que 25% custam massa magra e energia de treino",
      "1 kg de gordura equivale a cerca de 7.700 kcal",
      "Recalcule o GET a cada 4 a 5 kg de variação de peso",
    ],
  },
  {
    categoria: "Nutrição",
    titulo: "Proteína é a prioridade da dieta",
    texto:
      "Entre 1,6 e 2,2 g por kg de peso é a faixa em que a literatura mostra melhor retenção de massa magra, tanto em déficit quanto em superávit. Distribuir em 3 a 5 refeições com 25 a 40 g cada aproveita melhor o estímulo de síntese proteica.",
    itens: [
      "Em déficit agressivo, suba para até 2,4 g/kg",
      "Gordura nunca abaixo de 0,6 g/kg por longos períodos",
      "Carboidrato é o combustível do treino — corte por último",
    ],
  },
  {
    categoria: "Treino",
    titulo: "Como usar o 1RM na prática",
    texto:
      "O 1RM estimado vira um mapa de cargas. Força se desenvolve acima de 85% com poucas repetições; hipertrofia acontece em uma janela ampla, de 65% a 85%, desde que as séries cheguem perto da falha.",
    itens: [
      "Força: 3 a 5 séries de 3 a 5 reps a 85–92%",
      "Hipertrofia: 3 a 4 séries de 6 a 12 reps a 70–80%",
      "Reestime o 1RM a cada 6 a 8 semanas",
    ],
  },
  {
    categoria: "Cardio",
    titulo: "Por que treinar na zona 2",
    texto:
      "A zona 2 (60% a 70% da FC máxima) é onde o corpo melhora a capacidade de usar gordura como combustível e constrói base aeróbica sem gerar fadiga acumulada. É o ritmo em que dá para conversar em frases completas.",
    itens: [
      "80% do volume em zonas leves, 20% em intensidade alta",
      "Tiros na zona 5 rendem mais em sessões curtas",
      "FC de repouso caindo ao longo das semanas é sinal de progresso",
    ],
  },
  {
    categoria: "Composição",
    titulo: "A balança mente, a fita não",
    texto:
      "Peso oscila com água, sódio, glicogênio e ciclo hormonal. Acompanhe médias semanais, circunferência de cintura e fotos no mesmo horário e luz. A razão cintura-estatura abaixo de 0,5 é um dos marcadores mais simples e confiáveis de saúde metabólica.",
    itens: [
      "Pese-se sempre em jejum, após o banheiro",
      "Compare médias de 7 dias, nunca dias isolados",
      "Meça a cintura a cada 2 semanas",
    ],
  },
  {
    categoria: "Recuperação",
    titulo: "Sono e água movem o ponteiro",
    texto:
      "Dormir menos de 6 horas reduz a perda de gordura e aumenta a de massa magra em déficit calórico. A desidratação de apenas 2% do peso corporal já derruba força e concentração no treino.",
    itens: [
      "7 a 9 horas de sono, com horário consistente",
      "Cerca de 35 ml de água por kg, mais o que você sua",
      "Cafeína até 8 horas antes de dormir",
    ],
  },
];

export default function Guias() {
  return (
    <section className="secao secao-alternada" id="guias">
      <div className="container">
        <div className="secao-cabecalho">
          <span className="etiqueta">Entenda os números</span>
          <h2>Guias rápidos</h2>
          <p>
            Calcular é fácil; interpretar é o que muda o resultado. Um resumo direto do que a
            evidência aponta em cada frente.
          </p>
        </div>

        <div className="grade-guias">
          {GUIAS.map((guia) => (
            <article className="guia" key={guia.titulo}>
              <span className="guia-categoria">{guia.categoria}</span>
              <h3>{guia.titulo}</h3>
              <p>{guia.texto}</p>
              <ul>
                {guia.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
