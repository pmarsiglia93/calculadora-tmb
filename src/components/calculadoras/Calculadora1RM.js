import { useMemo, useState } from "react";
import {
  TABELA_PERCENTUAIS,
  arredondar,
  calcular1RM,
  paraNumero,
} from "../../lib/formulas";
import { Campo, Cartao, Estatistica, Nota, Segmentado } from "../ui";

const EXERCICIOS = [
  { valor: "supino", rotulo: "Supino" },
  { valor: "agachamento", rotulo: "Agachamento" },
  { valor: "terra", rotulo: "Terra" },
];

/** Arredonda para o múltiplo de 2,5 kg mais próximo — o que dá para montar na barra. */
const anilhaMaisProxima = (valor) => Math.round(valor / 2.5) * 2.5;

export default function Calculadora1RM() {
  const [exercicio, setExercicio] = useState("supino");
  const [carga, setCarga] = useState("");
  const [repeticoes, setRepeticoes] = useState("8");

  const resultado = useMemo(() => {
    const c = paraNumero(carga);
    const r = paraNumero(repeticoes);
    if (!(c > 0) || !(r > 0)) return null;
    if (r > 12) return { impreciso: true };
    return calcular1RM(c, r);
  }, [carga, repeticoes]);

  return (
    <Cartao
      titulo="Repetição máxima (1RM)"
      descricao="Estime sua carga máxima sem precisar testá-la — e monte as séries a partir dela."
    >
      <div className="pilha-media">
        <Segmentado
          rotulo="Exercício"
          valor={exercicio}
          aoMudar={setExercicio}
          opcoes={EXERCICIOS}
        />

        <div className="grade-campos">
          <Campo
            rotulo="Carga levantada"
            sufixo="kg"
            placeholder="80"
            valor={carga}
            aoMudar={setCarga}
            min="1"
          />
          <Campo
            rotulo="Repetições até a falha"
            dica="ideal entre 3 e 10"
            placeholder="8"
            valor={repeticoes}
            aoMudar={setRepeticoes}
            min="1"
            max="12"
          />
        </div>

        {resultado?.impreciso && (
          <Nota atencao>
            Acima de 12 repetições a estimativa perde muita precisão. Use uma série mais pesada
            como referência.
          </Nota>
        )}

        {resultado && !resultado.impreciso && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="1RM estimado"
                valor={arredondar(resultado.media, 1).toLocaleString("pt-BR")}
                unidade="kg"
                nota="média de três fórmulas"
              />
              <Estatistica rotulo="Epley" valor={arredondar(resultado.epley, 1).toLocaleString("pt-BR")} unidade="kg" />
              <Estatistica rotulo="Brzycki" valor={arredondar(resultado.brzycki, 1).toLocaleString("pt-BR")} unidade="kg" />
              <Estatistica rotulo="Lombardi" valor={arredondar(resultado.lombardi, 1).toLocaleString("pt-BR")} unidade="kg" />
            </div>

            <div className="rolagem-horizontal">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>% do 1RM</th>
                    <th>Carga</th>
                    <th>Repetições estimadas</th>
                    <th>Uso típico</th>
                  </tr>
                </thead>
                <tbody>
                  {TABELA_PERCENTUAIS.map((linha) => (
                    <tr key={linha.percentual}>
                      <td>{linha.percentual}%</td>
                      <td>
                        <strong>
                          {anilhaMaisProxima(
                            (resultado.media * linha.percentual) / 100
                          ).toLocaleString("pt-BR")}{" "}
                          kg
                        </strong>
                      </td>
                      <td>{linha.reps}</td>
                      <td className="texto-auxiliar">
                        {linha.percentual >= 90
                          ? "Força máxima"
                          : linha.percentual >= 75
                          ? "Força e hipertrofia"
                          : linha.percentual >= 65
                          ? "Hipertrofia"
                          : "Resistência e técnica"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Nota>
              Cargas arredondadas para múltiplos de 2,5 kg. Teste de 1RM real só com técnica
              consolidada, aquecimento progressivo e alguém observando.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
