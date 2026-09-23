import { usePerfil } from "../context/PerfilContext";
import { NIVEIS_ATIVIDADE, OBJETIVOS, arredondar, calcularIMC } from "../lib/formulas";
import { Campo, CampoSelecao, Segmentado } from "./ui";
import { IconeUsuario } from "./ui/Icones";

export default function PainelPerfil() {
  const { perfil, atualizar, limpar, numeros, completo } = usePerfil();

  const nivel = NIVEIS_ATIVIDADE.find((n) => n.id === perfil.atividade);
  const objetivo = OBJETIVOS.find((o) => o.id === perfil.objetivo);

  return (
    <section className="secao" id="perfil">
      <div className="container">
        <div className="secao-cabecalho">
          <span className="etiqueta">Passo 1</span>
          <h2>Seu perfil</h2>
          <p>
            Estes dados alimentam todas as calculadoras da página e ficam salvos apenas no seu
            navegador.
          </p>
        </div>

        <div className="perfil-painel">
          <form className="perfil-formulario" onSubmit={(e) => e.preventDefault()}>
            <Segmentado
              rotulo="Sexo biológico"
              valor={perfil.sexo}
              aoMudar={(v) => atualizar("sexo", v)}
              opcoes={[
                { valor: "masculino", rotulo: "Masculino" },
                { valor: "feminino", rotulo: "Feminino" },
              ]}
            />

            <div className="grade-campos">
              <Campo
                rotulo="Idade"
                sufixo="anos"
                placeholder="30"
                valor={perfil.idade}
                aoMudar={(v) => atualizar("idade", v)}
                min="10"
                max="100"
              />
              <Campo
                rotulo="Peso"
                sufixo="kg"
                placeholder="75"
                valor={perfil.peso}
                aoMudar={(v) => atualizar("peso", v)}
                min="25"
                max="300"
                step="0.1"
              />
              <Campo
                rotulo="Altura"
                sufixo="cm"
                placeholder="178"
                valor={perfil.altura}
                aoMudar={(v) => atualizar("altura", v)}
                min="100"
                max="250"
              />
            </div>

            <CampoSelecao
              rotulo="Nível de atividade"
              dica={nivel?.detalhe}
              valor={perfil.atividade}
              aoMudar={(v) => atualizar("atividade", v)}
              opcoes={NIVEIS_ATIVIDADE.map((n) => ({
                valor: n.id,
                rotulo: `${n.rotulo} (×${n.fator.toLocaleString("pt-BR")})`,
              }))}
            />

            <CampoSelecao
              rotulo="Objetivo"
              dica={objetivo?.detalhe}
              valor={perfil.objetivo}
              aoMudar={(v) => atualizar("objetivo", v)}
              opcoes={OBJETIVOS.map((o) => ({ valor: o.id, rotulo: o.rotulo }))}
            />

            <button type="button" className="botao-texto" onClick={limpar}>
              Limpar perfil
            </button>
          </form>

          <aside className={`perfil-resumo ${completo ? "ativo" : ""}`}>
            <div className="perfil-resumo-icone">
              <IconeUsuario width={22} height={22} />
            </div>

            {completo ? (
              <>
                <h3>Perfil pronto</h3>
                <ul className="perfil-resumo-lista">
                  <li>
                    <span>Sexo</span>
                    <strong>{perfil.sexo === "masculino" ? "Masculino" : "Feminino"}</strong>
                  </li>
                  <li>
                    <span>Idade</span>
                    <strong>{numeros.idade} anos</strong>
                  </li>
                  <li>
                    <span>Peso</span>
                    <strong>{numeros.peso.toLocaleString("pt-BR")} kg</strong>
                  </li>
                  <li>
                    <span>Altura</span>
                    <strong>{numeros.altura.toLocaleString("pt-BR")} cm</strong>
                  </li>
                  <li>
                    <span>IMC</span>
                    <strong>
                      {arredondar(calcularIMC(numeros.peso, numeros.altura), 1).toLocaleString(
                        "pt-BR"
                      )}
                    </strong>
                  </li>
                  <li>
                    <span>Objetivo</span>
                    <strong>{objetivo?.rotulo}</strong>
                  </li>
                </ul>
                <a className="botao-principal bloco" href="#calculadoras">
                  Ir para as calculadoras
                </a>
              </>
            ) : (
              <>
                <h3>Faltam dados</h3>
                <p className="texto-auxiliar">
                  Informe idade, peso e altura para liberar os cálculos. Nada é enviado para
                  fora do seu navegador.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
