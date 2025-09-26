import estilos from '../pages/Emprestimo.module.css';
import { useEmprestimo } from '../context/EmprestimoContext';
import type { LivroEmprestimo, Reserva } from '../context/EmprestimoContext';

interface EmprestimoCardProps {
  emprestimo: LivroEmprestimo;
}

interface ReservaCardProps {
  reserva: Reserva;
}

export function EmprestimoCard({ emprestimo }: EmprestimoCardProps) {
  const { devolverLivro, notificarAtraso } = useEmprestimo();

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularDiasAtraso = () => {
    const hoje = new Date();
    const dataDevolucao = new Date(emprestimo.dataDevolucaoEsperada);
    const diferenca = hoje.getTime() - dataDevolucao.getTime();
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
  };

  const handleDevolver = async () => {
    if (window.confirm(`Confirmar devolução do livro "${emprestimo.titulo}"?`)) {
      try {
        await devolverLivro(emprestimo.id);
      } catch (error) {
        alert('Erro ao devolver livro. Tente novamente.');
      }
    }
  };

  const handleNotificar = () => {
    notificarAtraso(emprestimo.id);
  };

  return (
    <div className={estilos.card}>
      <img src={emprestimo.capa} alt={emprestimo.titulo} />
      <div className={estilos.cardContent}>
        <h3>{emprestimo.titulo}</h3>
        <p><strong>Usuário:</strong> {emprestimo.usuario}</p>
        <p><strong>Empréstimo:</strong> {formatarData(emprestimo.dataEmprestimo)}</p>
        <p><strong>Devolução:</strong> {formatarData(emprestimo.dataDevolucaoEsperada)}</p>
        
        {emprestimo.status === 'devolvido' && (
          <p><strong>Devolvido em:</strong> {formatarData(emprestimo.dataDevolucao)}</p>
        )}

        {emprestimo.status === 'atrasado' && (
          <div>
            <p className={estilos.expira}>
              <strong>Atrasado há {calcularDiasAtraso()} dias</strong>
            </p>
            <button 
              className={estilos.btnAtraso} 
              onClick={handleNotificar}
            >
              Enviar Notificação
            </button>
          </div>
        )}

        {emprestimo.status === 'emprestado' && (
          <button 
            className={estilos.btnDevolver} 
            onClick={handleDevolver}
          >
            Marcar como Devolvido
          </button>
        )}

        <div className={estilos.status}>
          <span className={`${estilos.statusBadge} ${estilos[emprestimo.status]}`}>
            {emprestimo.status === 'emprestado' && ' Emprestado'}
            {emprestimo.status === 'devolvido' && ' Devolvido'}
            {emprestimo.status === 'atrasado' && ' Atrasado'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReservaCard({ reserva }: ReservaCardProps) {
  const { cancelarReserva } = useEmprestimo();

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleCancelar = async () => {
    if (window.confirm(`Confirmar cancelamento da reserva do livro "${reserva.titulo}"?`)) {
      try {
        await cancelarReserva(reserva.id);
      } catch (error) {
        alert('Erro ao cancelar reserva. Tente novamente.');
      }
    }
  };

  return (
    <div className={estilos.card}>
      <img src={reserva.capa} alt={reserva.titulo} />
      <div className={estilos.cardContent}>
        <h3>{reserva.titulo}</h3>
        {reserva.autor && <p className={estilos.autor}>por {reserva.autor}</p>}
        <p><strong>Usuário:</strong> {reserva.usuario}</p>
        <p><strong>Email:</strong> {reserva.emailUsuario}</p>
        <p><strong>Reservado em:</strong> {formatarData(reserva.dataReserva)}</p>
        
        <div className={estilos.status}>
          <span className={`${estilos.statusBadge} ${estilos[reserva.status]}`}>
            {reserva.status === 'pendente' && ' Pendente'}
            {reserva.status === 'disponivel' && ' Disponível'}
            {reserva.status === 'cancelada' && ' Cancelada'}
          </span>
        </div>

        {reserva.status === 'pendente' && (
          <button 
            className={estilos.btnCancelar} 
            onClick={handleCancelar}
          >
            Cancelar Reserva
          </button>
        )}
      </div>
    </div>
  );
}
