import { FERRAMENTAS } from "../lib/ferramentas";
import { IconeSeta } from "./ui/Icones";

/** Seção de abertura da página. */
export default function Destaque() {
  return (
    <section className="destaque" id="topo">
      <div className="destaque-brilho" aria-hidden="true" />
      <div className="container destaque-conteudo">
        <span className="destaque-etiqueta">
          {FERRAMENTAS.length} calculadoras · grátis · sem cadastro
        </span>

        <h1>
          Os números da sua <span className="texto-gradiente">evolução física</span> em um só
          lugar
        </h1>

        <p className="destaque-texto">
          Preencha seu perfil uma única vez e use todas as ferramentas: gasto calórico,
          macronutrientes, composição corporal, carga de treino, zonas de frequência cardíaca e
          ritmo de corrida.
        </p>

        <div className="destaque-acoes">
          <a className="botao-principal" href="#perfil">
            Começar pelo perfil
            <IconeSeta width={18} height={18} />
          </a>
          <a className="botao-secundario" href="#calculadoras">
            Ver calculadoras
          </a>
        </div>

        <dl className="destaque-numeros">
          <div>
            <dt>Fórmulas validadas</dt>
            <dd>Mifflin, Katch, Karvonen, Riegel e mais</dd>
          </div>
          <div>
            <dt>Cálculo instantâneo</dt>
            <dd>Tudo roda no seu navegador</dd>
          </div>
          <div>
            <dt>Seus dados ficam com você</dt>
            <dd>Nada é enviado para servidor algum</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
