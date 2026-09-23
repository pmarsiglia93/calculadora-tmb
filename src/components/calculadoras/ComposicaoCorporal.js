import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  arredondar,
  classificarGordura,
  classificarRCEst,
  classificarRCQ,
  massaMagra,
  paraNumero,
  percentualGorduraMarinha,
  razaoCinturaEstatura,
  razaoCinturaQuadril,
} from "../../lib/formulas";
import { Campo, Cartao, Distintivo, Estatistica, Nota } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

export default function ComposicaoCorporal() {
  const { numeros, completo } = usePerfil();
  const [medidas, setMedidas] = useState({ pescoco: "", cintura: "", quadril: "" });

  const definir = (campo) => (valor) => setMedidas((m) => ({ ...m, [campo]: valor }));

  const n = {
    pescoco: paraNumero(medidas.pescoco),
    cintura: paraNumero(medidas.cintura),
    quadril: paraNumero(medidas.quadril),
  };

  const precisaQuadril = numeros.sexo === "feminino";
  const medidasOk =
    Number.isFinite(n.pescoco) &&
    Number.isFinite(n.cintura) &&
    n.pescoco > 0 &&
    n.cintura > 0 &&
    (!precisaQuadril || (Number.isFinite(n.quadril) && n.quadril > 0));

  const resultado = useMemo(() => {
    if (!completo || !medidasOk) return null;

    const percentual = percentualGorduraMarinha({
      sexo: numeros.sexo,
      altura: numeros.altura,
      pescoco: n.pescoco,
      cintura: n.cintura,
      quadril: n.quadril,
    });
    if (!Number.isFinite(percentual) || percentual <= 0) return { invalido: true };

    const magra = massaMagra(numeros.peso, percentual);
    const rcest = razaoCinturaEstatura(n.cintura, numeros.altura);
    const rcq = Number.isFinite(n.quadril) && n.quadril > 0
      ? razaoCinturaQuadril(n.cintura, n.quadril)
      : null;

    return {
      percentual,
      classificacao: classificarGordura(percentual, numeros.sexo),
      massaGorda: numeros.peso - magra,
      massaMagra: magra,
      rcest,
      classeRcest: classificarRCEst(rcest),
      rcq,
      classeRcq: rcq ? classificarRCQ(rcq, numeros.sexo) : null,
    };
  }, [completo, medidasOk, n.cintura, n.pescoco, n.quadril, numeros]);

  return (
    <Cartao
      titulo="Composição corporal"
      descricao="Método da Marinha americana: fita métrica e três medidas resolvem. Meça relaxado, pela manhã."
    >
      <div className="pilha-media">
        {!completo && <AvisoPerfil />}

        <div className="grade-campos">
          <Campo
            rotulo="Pescoço"
            dica="abaixo do pomo de adão"
            sufixo="cm"
            placeholder="38"
            valor={medidas.pescoco}
            aoMudar={definir("pescoco")}
          />
          <Campo
            rotulo="Cintura"
            dica={numeros.sexo === "masculino" ? "na altura do umbigo" : "na parte mais estreita"}
            sufixo="cm"
            placeholder="82"
            valor={medidas.cintura}
            aoMudar={definir("cintura")}
          />
          <Campo
            rotulo={`Quadril${precisaQuadril ? "" : " (opcional)"}`}
            dica="parte mais larga"
            sufixo="cm"
            placeholder="98"
            valor={medidas.quadril}
            aoMudar={definir("quadril")}
          />
        </div>

        {resultado?.invalido && (
          <Nota atencao>
            As medidas não fecham a conta. Confira se cintura e pescoço estão em centímetros e
            se a cintura é maior que o pescoço.
          </Nota>
        )}

        {resultado && !resultado.invalido && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="Gordura corporal"
                valor={arredondar(resultado.percentual, 1).toLocaleString("pt-BR")}
                unidade="%"
              />
              <Estatistica
                rotulo="Massa magra"
                valor={arredondar(resultado.massaMagra, 1).toLocaleString("pt-BR")}
                unidade="kg"
                nota="músculo, osso, água e órgãos"
              />
              <Estatistica
                rotulo="Massa de gordura"
                valor={arredondar(resultado.massaGorda, 1).toLocaleString("pt-BR")}
                unidade="kg"
              />
            </div>

            <div className="linha-distintivos">
              <Distintivo tom={resultado.classificacao.tom}>
                {resultado.classificacao.rotulo}
              </Distintivo>
              <Distintivo tom={resultado.classeRcest.tom}>
                Cintura/estatura {arredondar(resultado.rcest, 2).toLocaleString("pt-BR")} ·{" "}
                {resultado.classeRcest.rotulo}
              </Distintivo>
              {resultado.classeRcq && (
                <Distintivo tom={resultado.classeRcq.tom}>
                  Cintura/quadril {arredondar(resultado.rcq, 2).toLocaleString("pt-BR")} ·{" "}
                  {resultado.classeRcq.rotulo}
                </Distintivo>
              )}
            </div>

            <Nota>
              Com o percentual em mãos, volte à calculadora de gasto energético e escolha a
              fórmula <strong>Katch-McArdle</strong> — ela usa a massa magra e costuma ser a
              estimativa mais fiel.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
