import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import { arredondar, consumoAgua } from "../../lib/formulas";
import { Campo, Cartao, Estatistica, Nota, Segmentado } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

export default function CalculadoraAgua() {
  const { numeros, completo } = usePerfil();
  const [minutosTreino, setMinutosTreino] = useState("60");
  const [climaQuente, setClimaQuente] = useState("nao");

  const resultado = useMemo(() => {
    if (!completo) return null;
    return consumoAgua({
      peso: numeros.peso,
      minutosTreino: Number(minutosTreino) || 0,
      climaQuente: climaQuente === "sim",
    });
  }, [climaQuente, completo, minutosTreino, numeros.peso]);

  return (
    <Cartao
      titulo="Hidratação diária"
      descricao="Base de 35 ml por kg, mais a reposição do que você sua treinando."
    >
      <div className="pilha-media">
        {!completo && <AvisoPerfil />}

        <div className="grade-campos">
          <Campo
            rotulo="Minutos de treino por dia"
            sufixo="min"
            placeholder="60"
            valor={minutosTreino}
            aoMudar={setMinutosTreino}
            min="0"
            max="360"
          />
          <Segmentado
            rotulo="Clima quente ou muito seco"
            valor={climaQuente}
            aoMudar={setClimaQuente}
            opcoes={[
              { valor: "nao", rotulo: "Não" },
              { valor: "sim", rotulo: "Sim" },
            ]}
          />
        </div>

        {resultado && (
          <>
            <div className="grade-resultados">
              <Estatistica
                destaque
                rotulo="Meta do dia"
                valor={arredondar(resultado.litros, 1).toLocaleString("pt-BR")}
                unidade="litros"
              />
              <Estatistica
                rotulo="Em copos de 250 ml"
                valor={Math.ceil(resultado.copos)}
                unidade="copos"
              />
              <Estatistica
                rotulo="Só para o treino"
                valor={arredondar(resultado.treinoMl)}
                unidade="ml"
                nota="durante e logo após a sessão"
              />
            </div>

            <div className="copos" aria-hidden="true">
              {Array.from({ length: Math.min(Math.ceil(resultado.copos), 16) }).map((_, i) => (
                <span key={i} className="copo" />
              ))}
              {resultado.copos > 16 && <span className="texto-auxiliar">+{Math.ceil(resultado.copos) - 16}</span>}
            </div>

            <Nota>
              Urina amarelo-clara é o melhor indicador prático. Em treinos longos ou no calor,
              inclua sódio — só água em excesso dilui os eletrólitos.
            </Nota>
          </>
        )}
      </div>
    </Cartao>
  );
}
