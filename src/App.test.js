import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza a chamada principal e a navegação das calculadoras", () => {
  render(<App />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/evolução física/i);
  expect(screen.getByRole("heading", { name: /seu perfil/i })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /gasto energético/i })
  ).toBeInTheDocument();
});

test("pede o preenchimento do perfil antes de calcular", () => {
  render(<App />);
  expect(screen.getAllByText(/preencha/i).length).toBeGreaterThan(0);
});
