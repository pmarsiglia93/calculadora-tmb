import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  FORMULAS_TMB,
  NIVEIS_ATIVIDADE,
  OBJETIVOS,
  arredondar,
  calcularGET,
  calcularTMB,
  caloriasDoObjetivo,
  objetivoPorId,
  paraNumero,
  variacaoPesoSemanal,
} from "../../lib/formulas";
import { Campo, Cartao, Estatistica, Nota, Segmentado } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

export default function CalculadoraTMB() {
  const { perfil, numeros, completo } = usePerfil();
  const [formula, setFormula] = useState("mifflin");
  const [percentualGordura, setPercentualGordura] = useState("");

  const resultado = useMemo(() => {
    if (!completo) return null;

    const gordura = paraNumero(percentualGordura);
    const tmb = calcularTMB({
      formula,
      ...numeros,
      percentualGordura: Number.isFinite(gordura) ? gordura : 0,
    });
    const get = calcularGET(tmb, perfil.atividade);

    return {
      tmb,
      get,
      /* quanto do gasto vem do movimento, e não do metabolismo parado */
      gastoAtividade: get - tmb,
      metas: OBJETIVOS.map((objetivo) => {
        const calorias = caloriasDoObjetivo(get, objetivo.id);
        return {
          ...objetivo,
          calorias,
          variacaoSemanal: variacaoPesoSemanal(calorias, get),
        };
      }),
    };
  }, [completo, formula, numeros, percentualGordura, perfil.atividade]);

  const katchSemGordura =
    formula === "katch" && !(paraNumero(percentualGordura) > 0);

  const nivel = NIVEIS_ATIVIDADE.find((n) => n.id === perfil.atividade);
  const objetivoAtual = objetivoPorId(perfil.objetivo);
  const metaAtual = resultado?.metas.find((m) => m.id === perfil.objetivo);

  return (
    <div className="pilha">
      <Cartao
        titulo="Gasto energético diário"
        descricao="Quantas calorias seu corpo queima em repouso e com o seu dia a dia."
      >
        <div className="pilha-media">
          <Segmentado
            rotulo="Fórmula"
            valor={formula}
            aoMudar={setFormula}
            opcoes={Object.entries(FORMULAS_TMB).map(([id, f]) => ({
              valor: id,
              rotulo: f.nome.split(" ")[0],
            }))}
          />
          <p className="texto-auxiliar">{FORMULAS_TMB[formula].descricao}</p>

          {formula === "katch" && (
            <Campo
              rotulo="Percentual de gordura"
              dica="use a calculadora de composição corporal"
              sufixo="%"
              placeholder="18"
              valor={percentualGordura}
              aoMudar={setPercentualGordura}
              min="3"
              max="70"
            />
          )}

          {!completo && <AvisoPerfil />}

          {katchSemGordura && completo && (
            <Nota atencao>
              Informe o percentual de gordura para usar Katch-McArdle. Enquanto isso, o
              resultado abaixo usa Mifflin-St Jeor.
            </Nota>
          )}

          {resultado && (
            <>
              <div className="grade-resultados">
                <Estatistica
                  rotulo="TMB — metabolismo basal"
                  valor={arredondar(resultado.tmb).toLocaleString("pt-BR")}
                  unidade="kcal"
                  nota="O que você gasta em repouso absoluto"
                />
                <Estatistica
                  rotulo="Gasto com atividade"
                  valor={`+${arredondar(resultado.gastoAtividade).toLocaleString("pt-BR")}`}
                  unidade="kcal"
                  nota={nivel?.rotulo}
                />
                <Estatistica
                  destaque
                  rotulo="GET — gasto total"
                  valor={arredondar(resultado.get).toLocaleString("pt-BR")}
                  unidade="kcal/dia"
                  nota="Calorias para manter o peso atual"
                />
              </div>

              <div className="proporcao-gasto">
                <div
                  className="proporcao-gasto-basal"
                  style={{ flex: resultado.tmb }}
                  title="Metabolismo basal"
                />
                <div
                  className="proporcao-gasto-atividade"
                  style={{ flex: resultado.gastoAtividade }}
                  title="Gasto com atividade"
                />
              </div>
              <div className="proporcao-legenda">
                <span>
                  <i className="ponto basal" /> Basal{" "}
                  {arredondar((resultado.tmb / resultado.get) * 100)}%
                </span>
                <span>
                  <i className="ponto atividade" /> Atividade{" "}
                  {arredondar((resultado.gastoAtividade / resultado.get) * 100)}%
                </span>
              </div>
            </>
          )}
        </div>
      </Cartao>

      {resultado && (
        <Cartao
          titulo="Calorias por objetivo"
          descricao={`Seu objetivo atual é "${objetivoAtual.rotulo}". Troque no perfil para ver outro cenário em destaque.`}
        >
          <div className="rolagem-horizontal">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Objetivo</th>
                  <th>Calorias/dia</th>
                  <th>Diferença</th>
                  <th>Peso por semana</th>
                </tr>
              </thead>
              <tbody>
                {resultado.metas.map((meta) => (
                  <tr key={meta.id} className={meta.id === perfil.objetivo ? "linha-ativa" : ""}>
                    <td>
                      <strong>{meta.rotulo}</strong>
                      <div className="texto-auxiliar">{meta.detalhe}</div>
                    </td>
                    <td>{arredondar(meta.calorias).toLocaleString("pt-BR")} kcal</td>
                    <td className={meta.ajuste === 0 ? "" : meta.ajuste < 0 ? "negativo" : "positivo"}>
                      {meta.ajuste === 0
                        ? "—"
                        : `${meta.ajuste > 0 ? "+" : ""}${arredondar(
                            meta.calorias - resultado.get
                          )} kcal`}
                    </td>
                    <td>
                      {meta.variacaoSemanal === 0
                        ? "estável"
                        : `${meta.variacaoSemanal > 0 ? "+" : ""}${arredondar(
                            meta.variacaoSemanal,
                            2
                          ).toLocaleString("pt-BR")} kg`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {metaAtual && (
            <Nota>
              Mantendo <strong>{arredondar(metaAtual.calorias).toLocaleString("pt-BR")} kcal</strong>{" "}
              por dia, a projeção é de{" "}
              <strong>
                {arredondar(Math.abs(metaAtual.variacaoSemanal * 4), 1).toLocaleString("pt-BR")} kg
              </strong>{" "}
              {metaAtual.ajuste < 0 ? "perdidos" : metaAtual.ajuste > 0 ? "ganhos" : "de variação"} em
              um mês. Estimativas assumem constância — reavalie a cada 3 ou 4 semanas.
            </Nota>
          )}
        </Cartao>
      )}
    </div>
  );
}
