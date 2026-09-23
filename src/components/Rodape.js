export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape-conteudo">
        <div>
          <span className="marca-nome">
            Fit<strong>Calc</strong>
          </span>
          <p className="texto-auxiliar">
            Calculadoras de nutrição e treino que rodam inteiramente no seu navegador.
          </p>
        </div>

        <p className="rodape-aviso">
          Conteúdo informativo. Não substitui avaliação médica ou nutricional individualizada.
        </p>

        <p className="texto-auxiliar">
          Feito com React por{" "}
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            Paulo Marsiglia
          </a>
        </p>
      </div>
    </footer>
  );
}
