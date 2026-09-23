import { IconeLua, IconeSol } from "./ui/Icones";

export default function Cabecalho({ tema, aoTrocarTema }) {
  return (
    <header className="cabecalho">
      <div className="container cabecalho-conteudo">
        <a className="marca" href="#topo">
          <span className="marca-simbolo" aria-hidden="true" />
          <span className="marca-nome">
            Fit<strong>Calc</strong>
          </span>
        </a>

        <nav className="cabecalho-nav" aria-label="Seções">
          <a href="#perfil">Perfil</a>
          <a href="#calculadoras">Calculadoras</a>
          <a href="#guias">Guias</a>
          <a href="#duvidas">Dúvidas</a>
        </nav>

        <button
          type="button"
          className="botao-tema"
          onClick={aoTrocarTema}
          aria-label={tema === "escuro" ? "Ativar tema claro" : "Ativar tema escuro"}
          title={tema === "escuro" ? "Tema claro" : "Tema escuro"}
        >
          {tema === "escuro" ? <IconeSol /> : <IconeLua />}
        </button>
      </div>
    </header>
  );
}
