import { useState } from 'react';
import estilos from './Emprestimo.module.css';
import { useEmprestimo } from '../context/EmprestimoContext';
import { useBusca } from '../context/BuscaContext';
import { EmprestimoCard, ReservaCard } from '../components/EmprestimoCard';
import { AdicionarEmprestimo } from '../components/AdicionarEmprestimo';

export function Emprestimo() {
  const { emprestimos, reservas, carregando, erro } = useEmprestimo();
  const { termoBusca } = useBusca();
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

  // Filtrar empréstimos por status
  const emprestimosPendentes = emprestimos.filter(e => e.status === 'emprestado' || e.status === 'atrasado');
  const emprestimosAtrasados = emprestimos.filter(e => e.status === 'atrasado');
  const emprestimosDevolvidos = emprestimos.filter(e => e.status === 'devolvido');
  const reservasAtivas = reservas.filter(r => r.status === 'pendente');

  // Filtrar por termo de busca (usuário, email ou título do livro)
  const filtrarPorBusca = (lista: any[]) => {
    if (!termoBusca.trim()) return lista;
    const termo = termoBusca.toLowerCase();
    return lista.filter(item => 
      item.usuario.toLowerCase().includes(termo) ||
      item.emailUsuario.toLowerCase().includes(termo) ||
      item.titulo.toLowerCase().includes(termo) ||
      (item.autor && item.autor.toLowerCase().includes(termo))
    );
  };

  return (
    <main className={estilos.section}>

      {/* Controles */}
      <div className={estilos.controles}>
        <div className={estilos.infoBusca}>
          {termoBusca && (
            <p className={estilos.buscaInfo}>
              🔍 Buscando por: "<strong>{termoBusca}</strong>"
            </p>
          )}
          {erro && (
            <p className={estilos.erroInfo}>
              ⚠️ {erro}
            </p>
          )}
          {!termoBusca && !erro && (
            <p className={estilos.buscaInfo}>
              Todos os empréstimos e reservas
            </p>
          )}
        </div>
        <button 
          className={estilos.btnAdicionar}
          onClick={() => setMostrarAdicionar(true)}
          disabled={carregando}
        >
          {carregando ? '⏳ Carregando...' : '+ Novo Empréstimo'}
        </button>
      </div>

      {/* Empréstimos Pendentes */}
      <span className={estilos.title}>Empréstimos Pendentes</span>
      <div className={estilos.livros}>
        {filtrarPorBusca(emprestimosPendentes).length === 0 ? (
          <p className={estilos.semDados}>
            {termoBusca ? `Nenhum empréstimo encontrado para "${termoBusca}".` : 'Nenhum empréstimo pendente no momento.'}
          </p>
        ) : (
          filtrarPorBusca(emprestimosPendentes).map((emprestimo) => (
            <EmprestimoCard key={emprestimo.id} emprestimo={emprestimo} />
          ))
        )}
      </div>

      {/* Livros Atrasados */}
      <span className={estilos.title}>Livros Atrasados</span>
      <div className={estilos.livros}>
        {filtrarPorBusca(emprestimosAtrasados).length === 0 ? (
          <p className={estilos.semDados}>
            {termoBusca ? `Nenhum livro atrasado encontrado para "${termoBusca}".` : 'Nenhum livro atrasado no momento.'}
          </p>
        ) : (
          filtrarPorBusca(emprestimosAtrasados).map((emprestimo) => (
            <EmprestimoCard key={emprestimo.id} emprestimo={emprestimo} />
          ))
        )}
      </div>

      {/* Reservas Recentes */}
      <span className={estilos.title}>Reservas Recentes</span>
      <div className={estilos.livros}>
        {filtrarPorBusca(reservasAtivas).length === 0 ? (
          <p className={estilos.semDados}>
            {termoBusca ? `Nenhuma reserva encontrada para "${termoBusca}".` : 'Nenhuma reserva pendente no momento.'}
          </p>
        ) : (
          filtrarPorBusca(reservasAtivas).map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} />
          ))
        )}
      </div>

      {/* Modal para adicionar empréstimo */}
      {mostrarAdicionar && (
        <AdicionarEmprestimo onClose={() => setMostrarAdicionar(false)} />
      )}
    </main>
  );
}