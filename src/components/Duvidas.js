const PERGUNTAS = [
  {
    pergunta: "Qual fórmula de gasto energético devo escolher?",
    resposta:
      "Se você não sabe seu percentual de gordura, use Mifflin-St Jeor — é a mais precisa entre as que usam só peso, altura e idade. Se você já mediu a composição corporal, Katch-McArdle leva vantagem porque parte da massa magra. Harris-Benedict é a clássica e tende a estimar um pouco acima.",
  },
  {
    pergunta: "Os resultados substituem um nutricionista ou médico?",
    resposta:
      "Não. Toda fórmula aqui é uma estimativa populacional: o erro típico fica entre 5% e 15% para uma pessoa específica. Use os números como ponto de partida e ajuste conforme a resposta real do seu corpo ao longo de semanas. Condições de saúde, gravidez e uso de medicamentos exigem acompanhamento profissional.",
  },
  {
    pergunta: "Por que meu peso não cai mesmo comendo o valor calculado?",
    resposta:
      "Três causas dominam: o gasto estimado está acima do real, a ingestão está sendo subestimada (óleo, bebidas e beliscadas somam muito) ou o período avaliado é curto demais. Compare médias de 7 a 14 dias antes de mudar qualquer coisa e, se necessário, reduza 100 a 150 kcal por vez.",
  },
  {
    pergunta: "Com que frequência devo refazer os cálculos?",
    resposta:
      "A cada 4 semanas ou sempre que o peso variar 4 a 5 kg. O gasto energético cai conforme você emagrece, tanto pela massa menor quanto pela redução do gasto espontâneo.",
  },
  {
    pergunta: "Meus dados ficam salvos em algum servidor?",
    resposta:
      "Não existe servidor. Todo cálculo roda no seu navegador e o perfil fica guardado no armazenamento local do próprio dispositivo. Limpar os dados do site — ou clicar em 'Limpar perfil' — apaga tudo.",
  },
  {
    pergunta: "O percentual de gordura pela fita é confiável?",
    resposta:
      "O método da Marinha americana tem margem de erro de cerca de 3 pontos percentuais contra o DEXA. Ele é excelente para acompanhar tendência: meça sempre no mesmo horário, em jejum, com a fita rente à pele e sem apertar.",
  },
];

export default function Duvidas() {
  return (
    <section className="secao" id="duvidas">
      <div className="container">
        <div className="secao-cabecalho">
          <span className="etiqueta">Dúvidas frequentes</span>
          <h2>Perguntas que aparecem sempre</h2>
        </div>

        <div className="perguntas">
          {PERGUNTAS.map((item, indice) => (
            <details className="pergunta" key={item.pergunta} open={indice === 0}>
              <summary>
                {item.pergunta}
                <span className="pergunta-sinal" aria-hidden="true" />
              </summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
