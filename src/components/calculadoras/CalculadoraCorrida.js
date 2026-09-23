import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  PROVAS,
  arredondar,
  caloriasCorrida,
  formatarTempo,
  paceSegundosPorKm,
  paraNumero,
  preverTempoRiegel,
  velocidadeKmH,
} from "../../lib/formulas";
import { Campo, Cartao, Estatistica, Nota } from "../ui";

export default function CalculadoraCorrida() {
  const { numeros } = usePerfil();
  const [distancia, setDistancia] = useState("5");
  const [tempo, setTempo] = useState({ horas: "0", minutos: "30", segundos: "0" });

  const definirTempo = (campo) => (valor) => setTempo((t) => ({ ...t, [campo]: valor }));

  const resultado = useMemo(() => {
    const km = paraNumero(distancia);
    const segundos =
      (Number(tempo.horas) || 0) * 3600 +
      (Number(tempo.minutos) || 0) * 60 +
      (Number(tempo.segundos) || 0);

    if (!(km > 0) || !(segundos > 0)) return null;

    return {
      km,
      segundos,
      pace: paceSegundosPorKm(km, segundos),
      velocidade: velocidadeKmH(km, segundos),
      calorias: numeros.peso > 0 ? caloriasCorrida(numeros.peso, km) : null,
      previsoes: PROVAS.map((prova) => ({
        ...prova,
        tempo: preverTempoRiegel(segundos, km, prova.km),
        pace: preverTempoRiegel(segundos, km, prova.km) / prova.km,
      })),
    };
  }, [distancia, numeros.peso, tempo]);

  return (
    <Cartao
      titulo="Pace e previsão de provas"
      descricao="Informe uma corrida que você já fez e veja seu ritmo e o tempo esperado em outras distâncias."
    >
      <div className="pilha-media">
        <div className="grade-campos">
          <Campo
            rotulo="Distância"
            sufixo="km"
            placeholder="5"
            valor={distancia}
            aoMudar={setDistancia}
            min="0.1"
            step="0.1"
          />
          <Campo rotulo="Horas" placeholder="0" valor={tempo.horas} aoMudar={definirTempo("horas")} min="0" />
          <Campo rotulo="Minutos" placeholder="30" valor={tempo.minutos} aoMudar={definirTempo("minutos")} min="0" max="59" />
          <Campo rotulo="Segundos" placeholder="0" valor={tempo.segundos} aoMudar={definirTempo("segundos")} min="0" max="59" />
        </div>

        {resultado && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="Pace"
                valor={formatarTempo(resultado.pace)}
                unidade="min/km"
              />
              <Estatistica
                rotulo="Velocidade média"
                valor={arredondar(resultado.velocidade, 1).toLocaleString("pt-BR")}
                unidade="km/h"
              />
              <Estatistica
                rotulo="Gasto calórico"
                valor={
                  resultado.calorias ? arredondar(resultado.calorias).toLocaleString("pt-BR") : "—"
                }
                unidade="kcal"
                nota={resultado.calorias ? "aproximado, ~1 kcal/kg/km" : "informe o peso no perfil"}
              />
            </div>

            <div className="rolagem-horizontal">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Prova</th>
                    <th>Tempo previsto</th>
                    <th>Pace necessário</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.previsoes.map((prova) => (
                    <tr key={prova.nome}>
                      <td>{prova.nome}</td>
                      <td>
                        <strong>{formatarTempo(prova.tempo)}</strong>
                      </td>
                      <td>{formatarTempo(prova.pace)} /km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Nota>
              As previsões usam a fórmula de Riegel e assumem treino específico para a distância.
              Quanto maior o salto (5 km para maratona, por exemplo), mais otimista ela tende a ser.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
