import { useState } from "react";
import "./CalculadoraBasal.css"; // Importando o arquivo CSS

export default function CalculadoraBasal() {
  const [formData, setFormData] = useState({
    idade: "",
    peso: "",
    altura: "",
    genero: "masculino",
    atividade: "sedentario",
  });
  const [resultado, setResultado] = useState(null);

  const calcularTMB = () => {
    const { idade, peso, altura, genero, atividade } = formData;
    if (!idade || !peso || !altura) return;

    let tmb;
    if (genero === "masculino") {
      tmb = 88.36 + 13.4 * peso + 4.8 * altura - 5.7 * idade;
    } else {
      tmb = 447.6 + 9.2 * peso + 3.1 * altura - 4.3 * idade;
    }

    const fatores = {
      sedentario: 1.2,
      moderado: 1.55,
      intenso: 1.9,
    };

    const tmbAtividade = tmb * fatores[atividade];
    setResultado({ basal: tmb, atividade: tmbAtividade });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2>Calculadora de Gasto Energético</h2>
      <form className="formulario">
        <label>Idade:</label>
        <input type="number" name="idade" value={formData.idade} onChange={handleChange} />

        <label>Peso (kg):</label>
        <input type="number" name="peso" value={formData.peso} onChange={handleChange} />

        <label>Altura (cm):</label>
        <input type="number" name="altura" value={formData.altura} onChange={handleChange} />

        <label>Gênero:</label>
        <select name="genero" value={formData.genero} onChange={handleChange}>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </select>

        <label>Nível de Atividade:</label>
        <select name="atividade" value={formData.atividade} onChange={handleChange}>
          <option value="sedentario">Sedentário</option>
          <option value="moderado">Moderado</option>
          <option value="intenso">Intenso</option>
        </select>

        <button type="button" onClick={calcularTMB}>Calcular</button>
      </form>

      {resultado && (
        <div className="resultado">
          <p>Gasto energético basal: <strong>{resultado.basal.toFixed(2)}</strong> kcal</p>
          <p>Gasto energético com atividade: <strong>{resultado.atividade.toFixed(2)}</strong> kcal</p>
        </div>
      )}
    </div>
  );
}
