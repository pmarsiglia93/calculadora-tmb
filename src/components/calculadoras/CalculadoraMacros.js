import { useMemo, useState } from "react";
import { usePerfil } from "../../context/PerfilContext";
import {
  arredondar,
  calcularGET,
  calcularMacros,
  calcularTMB,
  caloriasDoObjetivo,
  objetivoPorId,
  paraNumero,
} from "../../lib/formulas";
import { Campo, Cartao, Deslizante, Estatistica, Nota, Segmentado } from "../ui";
import AvisoPerfil from "./AvisoPerfil";

/* Presets de distribuição em g/kg de peso corporal. */
const PRESETS = {
  equilibrado: { rotulo: "Equilibrado", proteina: 1.8, gordura: 0.9 },
  lowcarb: { rotulo: "Low carb", proteina: 2.2, gordura: 1.5 },
  performance: { rotulo: "Performance", proteina: 1.6, gordura: 0.8 },
};

const CORES = {
  proteina: "var(--proteina)",
  carboidrato: "var(--carbo)",
  gordura: "var(--gordura)",
};

const NOMES = {
  proteina: "Proteína",
  carboidrato: "Carboidrato",
  gordura: "Gordura",
};

export default function CalculadoraMacros() {
  const { perfil, numeros, completo } = usePerfil();
  const [preset, setPreset] = useState("equilibrado");
  const [proteinaPorKg, setProteinaPorKg] = useState(PRESETS.equilibrado.proteina);
  const [gorduraPorKg, setGorduraPorKg] = useState(PRESETS.equilibrado.gordura);
  const [caloriasManuais, setCaloriasManuais] = useState("");
  const [refeicoes, setRefeicoes] = useState(4);

  const caloriasSugeridas = useMemo(() => {
    if (!completo) return 0;
    const tmb = calcularTMB({ formula: "mifflin", ...numeros });
    return caloriasDoObjetivo(calcularGET(tmb, perfil.atividade), perfil.objetivo);
  }, [completo, numeros, perfil.atividade, perfil.objetivo]);

  const caloriasEditadas = paraNumero(caloriasManuais);
  const calorias = Number.isFinite(caloriasEditadas) && caloriasEditadas > 0
    ? caloriasEditadas
    : caloriasSugeridas;

  const macros = useMemo(() => {
    if (!completo || calorias <= 0) return null;
    return calcularMacros({
      calorias,
      peso: numeros.peso,
      proteinaPorKg,
      gorduraPorKg,
    });
  }, [calorias, completo, gorduraPorKg, numeros.peso, proteinaPorKg]);

  const aplicarPreset = (id) => {
    setPreset(id);
    setProteinaPorKg(PRESETS[id].proteina);
    setGorduraPorKg(PRESETS[id].gordura);
  };

  const ordem = ["proteina", "carboidrato", "gordura"];

  return (
    <div className="pilha">
      <Cartao
        titulo="Distribuição de macronutrientes"
        descricao="Divida as calorias do seu objetivo entre proteína, carboidrato e gordura."
      >
        <div className="pilha-media">
          {!completo && <AvisoPerfil />}

          <Segmentado
            rotulo="Estratégia"
            valor={preset}
            aoMudar={aplicarPreset}
            opcoes={Object.entries(PRESETS).map(([id, p]) => ({ valor: id, rotulo: p.rotulo }))}
          />

          <div className="grade-campos">
            <Campo
              rotulo="Calorias do dia"
              dica={
                caloriasSugeridas
                  ? `sugerido: ${arredondar(caloriasSugeridas)}`
                  : "defina o perfil"
              }
              sufixo="kcal"
              placeholder={caloriasSugeridas ? String(arredondar(caloriasSugeridas)) : "2000"}
              valor={caloriasManuais}
              aoMudar={setCaloriasManuais}
            />
            <Campo
              rotulo="Refeições por dia"
              tipo="number"
              min="1"
              max="8"
              valor={refeicoes}
              aoMudar={(v) => setRefeicoes(Number(v) || 1)}
            />
          </div>

          <div className="grade-campos">
            <Deslizante
              rotulo="Proteína"
              dica={`${proteinaPorKg.toLocaleString("pt-BR")} g por kg`}
              min={1}
              max={3}
              passo={0.1}
              valor={proteinaPorKg}
              aoMudar={(v) => {
                setProteinaPorKg(v);
                setPreset("");
              }}
            />
            <Deslizante
              rotulo="Gordura"
              dica={`${gorduraPorKg.toLocaleString("pt-BR")} g por kg`}
              min={0.5}
              max={2}
              passo={0.1}
              valor={gorduraPorKg}
              aoMudar={(v) => {
                setGorduraPorKg(v);
                setPreset("");
              }}
            />
          </div>

          {macros?.estourou && (
            <Nota atencao>
              Proteína e gordura sozinhas já passam das calorias do dia. Reduza um dos dois
              ou aumente as calorias — o carboidrato ficou zerado.
            </Nota>
          )}

          {macros && (
            <>
              <div className="barra-macros" aria-hidden="true">
                {ordem.map((chave) => (
                  <div
                    key={chave}
                    className="barra-macros-parte"
                    style={{
                      width: `${macros[chave].percentual}%`,
                      background: CORES[chave],
                    }}
                  />
                ))}
              </div>

              <div className="grade-resultados">
                {ordem.map((chave) => (
                  <div className="macro-cartao" key={chave} style={{ "--cor-macro": CORES[chave] }}>
                    <div className="macro-topo">
                      <span className="macro-nome">{NOMES[chave]}</span>
                      <span className="macro-percentual">
                        {arredondar(macros[chave].percentual)}%
                      </span>
                    </div>
                    <div className="macro-gramas">
                      {arredondar(macros[chave].gramas)}
                      <span className="unidade">g</span>
                    </div>
                    <div className="texto-auxiliar">
                      {arredondar(macros[chave].kcal)} kcal · {arredondar(macros[chave].gramas / refeicoes)} g
                      por refeição
                    </div>
                  </div>
                ))}
              </div>

              <div className="grade-resultados">
                <Estatistica
                  rotulo="Calorias-alvo"
                  valor={arredondar(calorias).toLocaleString("pt-BR")}
                  unidade="kcal"
                  nota={objetivoPorId(perfil.objetivo).rotulo}
                />
                <Estatistica
                  rotulo="Por refeição"
                  valor={arredondar(calorias / refeicoes).toLocaleString("pt-BR")}
                  unidade="kcal"
                  nota={`${refeicoes} refeições`}
                />
                <Estatistica
                  rotulo="Proteína por refeição"
                  valor={arredondar(macros.proteina.gramas / refeicoes)}
                  unidade="g"
                  nota="mire 25 a 40 g por refeição"
                />
              </div>

              <Nota>
                Referência: 1,6 a 2,2 g de proteína por kg cobre a maioria dos praticantes de
                musculação. Gordura abaixo de 0,6 g/kg por muito tempo atrapalha a produção
                hormonal.
              </Nota>
            </>
          )}
        </div>
      </Cartao>
    </div>
  );
}
