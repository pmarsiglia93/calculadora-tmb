import { useRef, useState } from "react";
import { FERRAMENTAS } from "../lib/ferramentas";

export default function PainelFerramentas() {
  const [ativa, setAtiva] = useState(FERRAMENTAS[0].id);
  const painel = useRef(null);
  const ferramenta = FERRAMENTAS.find((f) => f.id === ativa) ?? FERRAMENTAS[0];
  const Calculadora = ferramenta.componente;

  /*
   * Calculadoras têm alturas bem diferentes. Se o topo do painel ficou acima da
   * janela ao trocar de aba, o usuário cairia num espaço vazio — então trazemos
   * o painel de volta para a área visível (descontando o cabeçalho fixo).
   */
  const selecionar = (id) => {
    setAtiva(id);
    const topo = painel.current?.getBoundingClientRect().top ?? 0;
    if (topo < 80) {
      window.scrollTo({ top: window.scrollY + topo - 90, behavior: "smooth" });
    }
  };

  return (
    <section className="secao" id="calculadoras">
      <div className="container">
        <div className="secao-cabecalho">
          <span className="etiqueta">Passo 2</span>
          <h2>Calculadoras</h2>
          <p>Escolha a ferramenta — seus dados do perfil já entram preenchidos.</p>
        </div>

        <div className="ferramentas">
          <nav className="ferramentas-menu" aria-label="Calculadoras disponíveis">
            {FERRAMENTAS.map((item) => {
              const Icone = item.icone;
              const selecionada = item.id === ativa;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`ferramenta-aba ${selecionada ? "ativa" : ""}`}
                  onClick={() => selecionar(item.id)}
                  aria-current={selecionada ? "true" : undefined}
                >
                  <span className="ferramenta-icone">
                    <Icone />
                  </span>
                  <span className="ferramenta-texto">
                    <strong>{item.nome}</strong>
                    <span>{item.resumo}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="ferramentas-conteudo" key={ativa} ref={painel}>
            <Calculadora />
          </div>
        </div>
      </div>
    </section>
  );
}
