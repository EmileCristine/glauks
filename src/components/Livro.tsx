import estilos from './Livro.module.css';
import { Customizador } from './Customizador';

interface VolumeInfo {
  title: string;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface LivroProps {
  propsLivro: {
    id: string;
    volumeInfo: VolumeInfo;
  };
}

export function Livro({ propsLivro }: LivroProps) {
  return (
    <Customizador>
      <figure>
        <img
          className={estilos.capa}
          src={propsLivro.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
          alt={`Capa do livro: ${propsLivro.volumeInfo.title}`}
        />
      </figure>
    </Customizador>
  );
}