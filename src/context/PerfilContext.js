/**
 * Perfil compartilhado entre as calculadoras.
 *
 * A ideia é simples: o usuário digita peso, altura, idade e nível de atividade
 * uma única vez e todas as ferramentas da página passam a usar esses dados.
 * O perfil fica salvo no localStorage, então ele sobrevive ao refresh.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { paraNumero } from "../lib/formulas";

const CHAVE_ARMAZENAMENTO = "fitcalc:perfil";

const PERFIL_INICIAL = {
  sexo: "masculino",
  idade: "",
  peso: "",
  altura: "",
  atividade: "moderado",
  objetivo: "manutencao",
};

const PerfilContext = createContext(null);

function lerArmazenamento() {
  try {
    const salvo = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return salvo ? { ...PERFIL_INICIAL, ...JSON.parse(salvo) } : PERFIL_INICIAL;
  } catch {
    // localStorage bloqueado (modo privado, por exemplo) — segue sem persistir.
    return PERFIL_INICIAL;
  }
}

export function ProvedorPerfil({ children }) {
  const [perfil, setPerfil] = useState(lerArmazenamento);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(perfil));
    } catch {
      /* sem persistência disponível */
    }
  }, [perfil]);

  const valor = useMemo(() => {
    const idade = paraNumero(perfil.idade);
    const peso = paraNumero(perfil.peso);
    const altura = paraNumero(perfil.altura);

    return {
      perfil,
      atualizar: (campo, novoValor) =>
        setPerfil((atual) => ({ ...atual, [campo]: novoValor })),
      limpar: () => setPerfil(PERFIL_INICIAL),
      /** números já convertidos, prontos para as fórmulas */
      numeros: { idade, peso, altura, sexo: perfil.sexo },
      /** true quando dá para calcular qualquer coisa que dependa do corpo */
      completo: [idade, peso, altura].every((n) => Number.isFinite(n) && n > 0),
    };
  }, [perfil]);

  return <PerfilContext.Provider value={valor}>{children}</PerfilContext.Provider>;
}

export function usePerfil() {
  const contexto = useContext(PerfilContext);
  if (!contexto) throw new Error("usePerfil precisa estar dentro de <ProvedorPerfil>");
  return contexto;
}
