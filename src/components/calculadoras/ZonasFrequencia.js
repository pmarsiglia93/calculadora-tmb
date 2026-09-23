import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  arredondar,
  fcMaxClassica,
  fcMaxTanaka,
  paraNumero,
  zonasTreino,
} from "../../lib/formulas";
import { Campo, Cartao, Estatistica, Nota, Segmentado } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

export default function ZonasFrequencia() {
  const { numeros, completo } = usePerfil();
  const [metodo, setMetodo] = useState("tanaka");
  const [fcRepouso, setFcRepouso] = useState("");

  const idadeOk = Number.isFinite(numeros.idade) && numeros.idade > 0;

  const resultado = useMemo(() => {
    if (!idadeOk) return null;
    const fcMax = metodo === "tanaka" ? fcMaxTanaka(numeros.idade) : fcMaxClassica(numeros.idade);
    const repouso = paraNumero(fcRepouso);
    return {
      fcMax,
      repouso: Number.isFinite(repouso) && repouso > 0 ? repouso : null,
      zonas: zonasTreino({ fcMax, fcRepouso: repouso }),
    };
  }, [fcRepouso, idadeOk, metodo, numeros.idade]);

  return (
    <Cartao
      titulo="Zonas de frequência cardíaca"
      descricao="Descubra em que batimento treinar para cada objetivo — do aeróbico leve ao tiro máximo."
    >
      <div className="pilha-media">
        {!completo && !idadeOk && <AvisoPerfil />}

        <div className="grade-campos">
          <Segmentado
            rotulo="Fórmula da FC máxima"
            valor={metodo}
            aoMudar={setMetodo}
            opcoes={[
              { valor: "tanaka", rotulo: "Tanaka" },
              { valor: "classica", rotulo: "220 − idade" },
            ]}
          />
          <Campo
            rotulo="FC de repouso (opcional)"
            dica="mais precisão via Karvonen"
            sufixo="bpm"
            placeholder="60"
            valor={fcRepouso}
            aoMudar={setFcRepouso}
            min="30"
            max="120"
          />
        </div>

        {resultado && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="FC máxima estimada"
                valor={arredondar(resultado.fcMax)}
                unidade="bpm"
                nota={metodo === "tanaka" ? "208 − 0,7 × idade" : "220 − idade"}
              />
              <Estatistica
                rotulo="Método das zonas"
                valor={resultado.repouso ? "Karvonen" : "% da FC máx"}
                nota={
                  resultado.repouso
                    ? `reserva de ${arredondar(resultado.fcMax - resultado.repouso)} bpm`
                    : "informe a FC de repouso para personalizar"
                }
              />
            </div>

            <div className="zonas">
              {resultado.zonas.map((zona) => (
                <div key={zona.id} className={`zona zona-${zona.id}`}>
                  <div className="zona-barra" />
                  <div className="zona-conteudo">
                    <div className="zona-topo">
                      <strong>{zona.nome}</strong>
                      <span className="zona-faixa">
                        {arredondar(zona.de)}–{arredondar(zona.ate)} bpm
                      </span>
                    </div>
                    <span className="texto-auxiliar">{zona.efeito}</span>
                  </div>
                </div>
              ))}
            </div>

            <Nota>
              Para medir a FC de repouso, conte os batimentos por um minuto ainda deitado, antes
              de levantar da cama. A maior parte do volume semanal deve ficar nas zonas 2 e 3.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
