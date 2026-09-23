/** Catálogo das calculadoras: usado na navegação e no índice da página. */
import Calculadora1RM from "../components/calculadoras/Calculadora1RM";
import CalculadoraAgua from "../components/calculadoras/CalculadoraAgua";
import CalculadoraCorrida from "../components/calculadoras/CalculadoraCorrida";
import CalculadoraIMC from "../components/calculadoras/CalculadoraIMC";
import CalculadoraMacros from "../components/calculadoras/CalculadoraMacros";
import CalculadoraTMB from "../components/calculadoras/CalculadoraTMB";
import ComposicaoCorporal from "../components/calculadoras/ComposicaoCorporal";
import PesoIdeal from "../components/calculadoras/PesoIdeal";
import ZonasFrequencia from "../components/calculadoras/ZonasFrequencia";
import {
  IconeAlvo,
  IconeBalanca,
  IconeChama,
  IconeCoracao,
  IconeFita,
  IconeGota,
  IconeHaltere,
  IconePrato,
  IconeTenis,
} from "../components/ui/Icones";

export const FERRAMENTAS = [
  {
    id: "gasto-energetico",
    nome: "Gasto energético",
    resumo: "TMB, GET e calorias por objetivo",
    icone: IconeChama,
    componente: CalculadoraTMB,
  },
  {
    id: "macros",
    nome: "Macronutrientes",
    resumo: "Proteína, carboidrato e gordura do dia",
    icone: IconePrato,
    componente: CalculadoraMacros,
  },
  {
    id: "imc",
    nome: "IMC",
    resumo: "Índice de massa corporal e faixa saudável",
    icone: IconeBalanca,
    componente: CalculadoraIMC,
  },
  {
    id: "composicao",
    nome: "Composição corporal",
    resumo: "% de gordura, massa magra e risco",
    icone: IconeFita,
    componente: ComposicaoCorporal,
  },
  {
    id: "peso-ideal",
    nome: "Peso ideal",
    resumo: "Quatro fórmulas clássicas comparadas",
    icone: IconeAlvo,
    componente: PesoIdeal,
  },
  {
    id: "agua",
    nome: "Hidratação",
    resumo: "Quanta água beber por dia",
    icone: IconeGota,
    componente: CalculadoraAgua,
  },
  {
    id: "1rm",
    nome: "Carga máxima (1RM)",
    resumo: "Estimativa de 1RM e tabela de séries",
    icone: IconeHaltere,
    componente: Calculadora1RM,
  },
  {
    id: "frequencia",
    nome: "Zonas de treino",
    resumo: "Faixas de batimento por objetivo",
    icone: IconeCoracao,
    componente: ZonasFrequencia,
  },
  {
    id: "corrida",
    nome: "Corrida",
    resumo: "Pace, velocidade e previsão de provas",
    icone: IconeTenis,
    componente: CalculadoraCorrida,
  },
];
