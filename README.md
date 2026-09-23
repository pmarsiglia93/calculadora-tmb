# FitCalc — calculadoras de nutrição e treino

Aplicação React de página única que reúne nove calculadoras de saúde, nutrição e
performance. O usuário preenche o perfil (sexo, idade, peso, altura, nível de
atividade e objetivo) uma única vez e todas as ferramentas passam a usar esses
dados. Nada sai do navegador: não há back-end, API ou coleta de dados.

> Projeto que nasceu como uma calculadora de taxa metabólica basal e foi
> reescrito para virar uma página completa de ferramentas fitness.

## Calculadoras

| Ferramenta | O que entrega | Base |
| --- | --- | --- |
| Gasto energético | TMB, GET e calorias para cinco objetivos | Mifflin-St Jeor, Harris-Benedict revisada, Katch-McArdle |
| Macronutrientes | Gramas e percentuais de proteína, carboidrato e gordura | g/kg de peso corporal, com presets e ajuste fino |
| IMC | Índice, classificação da OMS e faixa de peso saudável | peso / altura² |
| Composição corporal | % de gordura, massa magra, cintura-quadril e cintura-estatura | Método da Marinha americana |
| Peso ideal | Quatro estimativas comparadas com o peso atual | Devine, Robinson, Miller, Hamwi |
| Hidratação | Meta diária em litros e copos | 35 ml/kg + reposição de treino e clima |
| Carga máxima (1RM) | 1RM estimado e tabela de percentuais por objetivo | Epley, Brzycki, Lombardi |
| Zonas de treino | Cinco faixas de frequência cardíaca | Tanaka e Karvonen |
| Corrida | Pace, velocidade, gasto calórico e previsão de provas | Fórmula de Riegel |

Além das ferramentas, a página traz seis guias explicando como interpretar os
números e uma seção de dúvidas frequentes.

## Decisões técnicas

- **React 19 + Create React App**, sem nenhuma dependência de UI. Ícones são SVG
  inline e o layout usa CSS puro com variáveis.
- **`src/lib/formulas.js`** concentra toda a matemática em funções puras,
  separada da interface e coberta por testes.
- **Contexto de perfil** (`src/context/PerfilContext.js`) compartilha os dados
  entre as calculadoras e persiste em `localStorage`.
- **Tema claro e escuro** por tokens CSS, com a preferência do sistema como
  padrão inicial.
- **Acessibilidade**: campos com `label`, abas com `aria-pressed`/`aria-current`,
  respeito a `prefers-reduced-motion` e foco visível.

## Estrutura

```
src/
├── App.js                   # composição da página e troca de tema
├── lib/
│   ├── formulas.js          # todas as fórmulas (funções puras)
│   ├── formulas.test.js     # testes das fórmulas
│   └── ferramentas.js       # catálogo das calculadoras
├── context/PerfilContext.js # perfil compartilhado + localStorage
├── components/
│   ├── ui/                  # campos, cartões, estatísticas, ícones
│   └── calculadoras/        # uma calculadora por arquivo
└── styles/global.css        # tokens, temas e base
```

## Rodando o projeto

```bash
npm install
npm start     # desenvolvimento em http://localhost:3000
npm test      # testes das fórmulas e da renderização
npm run build # build de produção
```

## Aviso

O conteúdo é informativo e usa estimativas populacionais, com margem de erro
típica de 5% a 15% para um indivíduo específico. Não substitui avaliação médica
ou nutricional.
