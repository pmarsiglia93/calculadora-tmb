import { Nota } from "../ui";

/** Mostrado quando o perfil ainda não tem peso, altura e idade preenchidos. */
export default function AvisoPerfil() {
  return (
    <Nota atencao>
      Preencha <a href="#perfil">seu perfil</a> (idade, peso e altura) para liberar este
      cálculo.
    </Nota>
  );
}
