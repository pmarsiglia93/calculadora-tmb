import { useEffect, useState } from "react";
import "./App.css";
import Cabecalho from "./components/Cabecalho";
import Destaque from "./components/Destaque";
import Duvidas from "./components/Duvidas";
import Guias from "./components/Guias";
import PainelFerramentas from "./components/PainelFerramentas";
import PainelPerfil from "./components/PainelPerfil";
import Rodape from "./components/Rodape";
import { ProvedorPerfil } from "./context/PerfilContext";

const CHAVE_TEMA = "fitcalc:tema";

function temaInicial() {
  try {
    const salvo = window.localStorage.getItem(CHAVE_TEMA);
    if (salvo) return salvo;
  } catch {
    /* sem localStorage: segue com a preferência do sistema */
  }
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
}

export default function App() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      window.localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
      /* sem persistência disponível */
    }
  }, [tema]);

  return (
    <ProvedorPerfil>
      <Cabecalho
        tema={tema}
        aoTrocarTema={() => setTema((atual) => (atual === "escuro" ? "claro" : "escuro"))}
      />
      <main>
        <Destaque />
        <PainelPerfil />
        <PainelFerramentas />
        <Guias />
        <Duvidas />
      </main>
      <Rodape />
    </ProvedorPerfil>
  );
}
