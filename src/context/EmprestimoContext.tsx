import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { emprestimoService } from "../services/emprestimoService";
import type { LivroEmprestimo, Reserva } from "../services/emprestimoService";

export type { LivroEmprestimo, Reserva };

interface EmprestimoContextType {
  emprestimos: LivroEmprestimo[];
  reservas: Reserva[];
  carregando: boolean;
  erro: string | null;
  adicionarEmprestimo: (livro: Omit<LivroEmprestimo, 'id' | 'dataEmprestimo' | 'status'>) => Promise<void>;
  devolverLivro: (id: string) => Promise<void>;
  adicionarReserva: (reserva: Omit<Reserva, 'id' | 'dataReserva' | 'status'>) => Promise<void>;
  cancelarReserva: (id: string) => Promise<void>;
  notificarAtraso: (id: string) => void;
  buscarEmprestimosPorUsuario: (usuario: string) => LivroEmprestimo[];
  buscarReservasPorUsuario: (usuario: string) => Reserva[];
  recarregarDados: () => Promise<void>;
}

const EmprestimoContext = createContext<EmprestimoContextType | undefined>(undefined);

export function EmprestimoProvider({ children }: { children: ReactNode }) {
  const [emprestimos, setEmprestimos] = useState<LivroEmprestimo[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [emprestimosData, reservasData] = await Promise.all([
        emprestimoService.getEmprestimos(),
        emprestimoService.getReservas()
      ]);
      setEmprestimos(emprestimosData);
      setReservas(reservasData);
    } catch (error) {
      setErro('Erro ao carregar dados. Verifique se o servidor está rodando.');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarEmprestimo = async (livro: Omit<LivroEmprestimo, 'id' | 'dataEmprestimo' | 'status'>) => {
    try {
      const novoEmprestimo = {
        ...livro,
        dataEmprestimo: new Date().toISOString().split('T')[0],
        status: 'emprestado' as const
      };
      const emprestimoCriado = await emprestimoService.adicionarEmprestimo(novoEmprestimo);
      setEmprestimos(prev => [...prev, emprestimoCriado]);
    } catch (error) {
      console.error('Erro ao adicionar empréstimo:', error);
      throw error;
    }
  };

  const devolverLivro = async (id: string) => {
    try {
      const emprestimoAtualizado = await emprestimoService.devolverLivro(id);
      setEmprestimos(prev => prev.map(emprestimo => 
        emprestimo.id === id ? emprestimoAtualizado : emprestimo
      ));
    } catch (error) {
      console.error('Erro ao devolver livro:', error);
      throw error;
    }
  };

  const adicionarReserva = async (reserva: Omit<Reserva, 'id' | 'dataReserva' | 'status'>) => {
    try {
      const novaReserva = {
        ...reserva,
        dataReserva: new Date().toISOString().split('T')[0],
        status: 'pendente' as const
      };
      const reservaCriada = await emprestimoService.adicionarReserva(novaReserva);
      setReservas(prev => [...prev, reservaCriada]);
    } catch (error) {
      console.error('Erro ao adicionar reserva:', error);
      throw error;
    }
  };

  const cancelarReserva = async (id: string) => {
    try {
      const reservaAtualizada = await emprestimoService.cancelarReserva(id);
      setReservas(prev => prev.map(reserva => 
        reserva.id === id ? reservaAtualizada : reserva
      ));
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      throw error;
    }
  };

  const notificarAtraso = (id: string) => {
    const emprestimo = emprestimos.find(e => e.id === id);
    if (emprestimo) {
      // Aqui você pode implementar a lógica de notificação real
      // Por exemplo, enviar email, SMS, etc.
      alert(`Notificação enviada para ${emprestimo.usuario} (${emprestimo.emailUsuario}) sobre o atraso do livro "${emprestimo.titulo}"`);
    }
  };

  const buscarEmprestimosPorUsuario = (usuario: string) => {
    return emprestimos.filter(emprestimo => 
      emprestimo.usuario.toLowerCase().includes(usuario.toLowerCase()) ||
      emprestimo.emailUsuario.toLowerCase().includes(usuario.toLowerCase())
    );
  };

  const buscarReservasPorUsuario = (usuario: string) => {
    return reservas.filter(reserva => 
      reserva.usuario.toLowerCase().includes(usuario.toLowerCase()) ||
      reserva.emailUsuario.toLowerCase().includes(usuario.toLowerCase())
    );
  };

  const recarregarDados = async () => {
    await carregarDados();
  };

  return (
    <EmprestimoContext.Provider value={{
      emprestimos,
      reservas,
      carregando,
      erro,
      adicionarEmprestimo,
      devolverLivro,
      adicionarReserva,
      cancelarReserva,
      notificarAtraso,
      buscarEmprestimosPorUsuario,
      buscarReservasPorUsuario,
      recarregarDados
    }}>
      {children}
    </EmprestimoContext.Provider>
  );
}

export function useEmprestimo() {
  const context = useContext(EmprestimoContext);
  if (!context) {
    throw new Error('useEmprestimo deve ser usado dentro de EmprestimoProvider');
  }
  return context;
}
