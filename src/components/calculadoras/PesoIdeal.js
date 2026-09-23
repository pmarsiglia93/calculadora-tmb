import { useMemo } from "react";
import { usePerfil } from "../../context/PerfilContext";
import { arredondar, faixaPesoSaudavel, pesosIdeais } from "../../lib/formulas";
import { Cartao, Estatistica, Nota } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

export default function PesoIdeal() {
  const { numeros, completo } = usePerfil();

  const resultado = useMemo(() => {
    if (!completo) return null;
    const formulas = pesosIdeais({ altura: numeros.altura, sexo: numeros.sexo });
    const media = formulas.reduce((soma, f) => soma + f.valor, 0) / formulas.length;
    return {
      formulas,
      media,
      faixa: faixaPesoSaudavel(numeros.altura),
      diferenca: numeros.peso - media,
    };
  }, [completo, numeros]);

  return (
    <Cartao
      titulo="Peso ideal"
      descricao="Quatro fórmulas clássicas, calculadas só a partir da altura e do sexo."
    >
      <div className="pilha-media">
        {!completo && <AvisoPerfil />}

        {resultado && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="Média das fórmulas"
                valor={arredondar(resultado.media, 1).toLocaleString("pt-BR")}
                unidade="kg"
              />
              <Estatistica
                rotulo="Faixa saudável (IMC)"
                valor={`${arredondar(resultado.faixa.minimo, 1).toLocaleString("pt-BR")}–${arredondar(
                  resultado.faixa.maximo,
                  1
                ).toLocaleString("pt-BR")}`}
                unidade="kg"
              />
              <Estatistica
                rotulo="Diferença para o seu peso"
                valor={`${resultado.diferenca > 0 ? "+" : ""}${arredondar(
                  resultado.diferenca,
                  1
                ).toLocaleString("pt-BR")}`}
                unidade="kg"
              />
            </div>

            <div className="rolagem-horizontal">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Fórmula</th>
                    <th>Peso estimado</th>
                    <th>Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.formulas.map((f) => (
                    <tr key={f.nome}>
                      <td>{f.nome}</td>
                      <td>{arredondar(f.valor, 1).toLocaleString("pt-BR")} kg</td>
                      <td>
                        {numeros.peso - f.valor > 0 ? "+" : ""}
                        {arredondar(numeros.peso - f.valor, 1).toLocaleString("pt-BR")} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Nota>
              Essas fórmulas nasceram para dosagem de medicamentos e não consideram massa
              muscular. Trate o número como referência, não como meta.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
