import estilos from './Customizador.module.css';

export function Customizador({ children }: { children: any }) {
  return <div className={estilos.conteiner}>{children}</div>;
}