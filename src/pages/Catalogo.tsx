import estilos from './Catalogo.module.css';
import { useState, useEffect } from 'react';
import { Livro } from '../components/Livro';
import { useBusca } from '../context/BuscaContext';

interface Livro {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export function Catalogo() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const { termoBusca } = useBusca();

  const buscarLivros = async (termo: string) => {
    if (!termo.trim()) return;

    setError(null);
    setCarregando(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}&maxResults=40`
      );
      const dados = await response.json();

      if (dados.items) {
        setLivros(dados.items);
      } else {
        setLivros([]);
        setError(new Error("Nenhum livro encontrado."));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!termoBusca) {
      buscarLivros("romance");
    }
  }, []);

  useEffect(() => {
    if (termoBusca) {
      buscarLivros(termoBusca);
    }
  }, [termoBusca]);

  return (
    <main className={estilos.section}>
      <span className={estilos.title}>Catálogo Geral</span>

      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      {!carregando && livros.length === 0 && !error && <p>Nenhum livro encontrado.</p>}

      <div className={estilos.listaLivros}>
        {carregando
          ? Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={estilos.skeletonCard}></div>
            ))
          : livros.map((umLivro) => (
              <Livro key={umLivro.id} propsLivro={umLivro} />
            ))
        }
      </div>
    </main>
  );
}

