import { useMemo } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  FAIXAS_IMC,
  arredondar,
  calcularIMC,
  classificarIMC,
  faixaPesoSaudavel,
} from "../../lib/formulas";
import { BarraFaixas, Cartao, Distintivo, Estatistica, Nota } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

const CURTOS = ["Abaixo", "Normal", "Sobrepeso", "Obes. I", "Obes. II", "Obes. III"];
const faixasComRotuloCurto = FAIXAS_IMC.map((faixa, i) => ({ ...faixa, curto: CURTOS[i] }));

export default function CalculadoraIMC() {
  const { numeros, completo } = usePerfil();

  const resultado = useMemo(() => {
    if (!completo) return null;
    const imc = calcularIMC(numeros.peso, numeros.altura);
    const faixa = faixaPesoSaudavel(numeros.altura);
    const classificacao = classificarIMC(imc);

    /* quanto falta (ou sobra) para entrar na faixa saudável */
    let ajuste = 0;
    if (numeros.peso < faixa.minimo) ajuste = faixa.minimo - numeros.peso;
    if (numeros.peso > faixa.maximo) ajuste = faixa.maximo - numeros.peso;

    return { imc, faixa, classificacao, ajuste };
  }, [completo, numeros]);

  return (
    <Cartao
      titulo="Índice de massa corporal"
      descricao="Uma triagem rápida — não distingue músculo de gordura, mas serve de ponto de partida."
    >
      <div className="pilha-media">
        {!completo && <AvisoPerfil />}

        {resultado && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="Seu IMC"
                valor={arredondar(resultado.imc, 1).toLocaleString("pt-BR")}
                unidade="kg/m²"
              />
              <Estatistica
                rotulo="Faixa de peso saudável"
                valor={`${arredondar(resultado.faixa.minimo, 1).toLocaleString("pt-BR")}–${arredondar(
                  resultado.faixa.maximo,
                  1
                ).toLocaleString("pt-BR")}`}
                unidade="kg"
                nota="IMC entre 18,5 e 24,9"
              />
              <Estatistica
                rotulo="Ajuste até a faixa"
                valor={
                  resultado.ajuste === 0
                    ? "0"
                    : `${resultado.ajuste > 0 ? "+" : ""}${arredondar(
                        resultado.ajuste,
                        1
                      ).toLocaleString("pt-BR")}`
                }
                unidade="kg"
                nota={resultado.ajuste === 0 ? "você já está na faixa" : "para entrar na faixa"}
              />
            </div>

            <div>
              <Distintivo tom={resultado.classificacao.tom}>
                {resultado.classificacao.rotulo}
              </Distintivo>
            </div>

            <BarraFaixas
              faixas={faixasComRotuloCurto}
              faixaAtiva={resultado.classificacao.rotulo}
            />

            <Nota>
              O IMC ignora composição corporal: quem treina pesado pode aparecer como
              "sobrepeso" tendo pouca gordura. Cruze com o percentual de gordura e a razão
              cintura-estatura.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
