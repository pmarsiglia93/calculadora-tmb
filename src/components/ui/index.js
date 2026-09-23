/**
 * Pequena biblioteca de componentes visuais compartilhados por todas as
 * calculadoras. Nada de estado global aqui — só apresentação.
 */
import { useId } from "react";
import "./ui.css";

export function Cartao({ titulo, descricao, acao, children, className = "" }) {
  return (
    <section className={`cartao ${className}`}>
      {(titulo || acao) && (
        <header className="cartao-cabecalho">
          <div>
            {titulo && <h3 className="cartao-titulo">{titulo}</h3>}
            {descricao && <p className="cartao-descricao">{descricao}</p>}
          </div>
          {acao}
        </header>
      )}
      {children}
    </section>
  );
}

export function Campo({
  rotulo,
  dica,
  sufixo,
  erro,
  tipo = "number",
  valor,
  aoMudar,
  ...resto
}) {
  const id = useId();
  return (
    <div className={`campo ${erro ? "campo-erro" : ""}`}>
      <label className="campo-rotulo" htmlFor={id}>
        <span>{rotulo}</span>
        {dica && <span className="campo-dica">{dica}</span>}
      </label>
      <div className="campo-controle">
        <input
          id={id}
          type={tipo}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          inputMode={tipo === "number" ? "decimal" : undefined}
          {...resto}
        />
        {sufixo && <span className="campo-sufixo">{sufixo}</span>}
      </div>
      {erro && <span className="campo-mensagem">{erro}</span>}
    </div>
  );
}

export function CampoSelecao({ rotulo, dica, valor, aoMudar, opcoes, ...resto }) {
  const id = useId();
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        <span>{rotulo}</span>
        {dica && <span className="campo-dica">{dica}</span>}
      </label>
      <div className="campo-controle">
        <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value)} {...resto}>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function Segmentado({ rotulo, valor, aoMudar, opcoes }) {
  return (
    <div className="campo">
      {rotulo && <span className="campo-rotulo">{rotulo}</span>}
      <div className="segmentado" role="group" aria-label={rotulo}>
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={valor === opcao.valor}
            onClick={() => aoMudar(opcao.valor)}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Deslizante({ rotulo, dica, valor, aoMudar, min, max, passo = 0.1 }) {
  const id = useId();
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        <span>{rotulo}</span>
        {dica && <span className="campo-dica">{dica}</span>}
      </label>
      <input
        id={id}
        className="deslizante"
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
      />
    </div>
  );
}

export function Estatistica({ rotulo, valor, unidade, nota, destaque = false }) {
  return (
    <div className={`estatistica ${destaque ? "destaque" : ""}`}>
      <div className="estatistica-rotulo">{rotulo}</div>
      <div className="estatistica-valor">
        {valor}
        {unidade && <span className="unidade">{unidade}</span>}
      </div>
      {nota && <div className="estatistica-nota">{nota}</div>}
    </div>
  );
}

export function Distintivo({ tom = "neutro", children }) {
  return <span className={`distintivo ${tom}`}>{children}</span>;
}

/** Barra de classificação: destaca a faixa em que o resultado caiu. */
export function BarraFaixas({ faixas, faixaAtiva }) {
  return (
    <div className="barra-faixas">
      <div className="barra-faixas-trilha">
        {faixas.map((faixa) => (
          <span
            key={faixa.rotulo}
            className={`tom-${faixa.tom} ${faixa.rotulo === faixaAtiva ? "ativa" : ""}`}
          />
        ))}
      </div>
      <div className="barra-faixas-legendas">
        {faixas.map((faixa) => (
          <span key={faixa.rotulo} className={faixa.rotulo === faixaAtiva ? "ativa" : ""}>
            {faixa.curto ?? faixa.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Nota({ children, atencao = false, icone = "i" }) {
  return (
    <p className={`nota ${atencao ? "atencao" : ""}`}>
      <span className="nota-icone" aria-hidden="true">
        {atencao ? "!" : icone}
      </span>
      <span>{children}</span>
    </p>
  );
}
