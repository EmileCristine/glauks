import { ref, get, set, update, remove, push, query, orderByChild } from 'firebase/database';
import { db } from '../firebase/config';

export interface LivroEmprestimo {
  id: string;
  titulo: string;
  usuario: string;
  emailUsuario: string;
  capa: string;
  dataEmprestimo: string;
  dataDevolucao: string;
  dataDevolucaoEsperada: string;
  status: 'emprestado' | 'devolvido' | 'atrasado';
  isbn?: string;
  autor?: string;
}

export interface Reserva {
  id: string;
  titulo: string;
  capa: string;
  usuario: string;
  emailUsuario: string;
  dataReserva: string;
  status: 'pendente' | 'disponivel' | 'cancelada';
  isbn?: string;
  autor?: string;
}

class EmprestimoService {
  // Buscar todos os empréstimos
  async getEmprestimos(): Promise<LivroEmprestimo[]> {
    try {
      const emprestimosRef = ref(db, 'emprestimos');
      const snapshot = await get(emprestimosRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      throw error;
    }
  }

  // Buscar todas as reservas
  async getReservas(): Promise<Reserva[]> {
    try {
      const reservasRef = ref(db, 'reservas');
      const snapshot = await get(reservasRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      throw error;
    }
  }

  // Adicionar novo empréstimo
  async adicionarEmprestimo(emprestimo: Omit<LivroEmprestimo, 'id'>): Promise<LivroEmprestimo> {
    try {
      const emprestimosRef = ref(db, 'emprestimos');
      const newRef = push(emprestimosRef);
      await set(newRef, emprestimo);
      
      return {
        id: newRef.key!,
        ...emprestimo
      };
    } catch (error) {
      console.error('Erro ao adicionar empréstimo:', error);
      throw error;
    }
  }

  // Atualizar empréstimo (devolver livro)
  async atualizarEmprestimo(id: string, dados: Partial<LivroEmprestimo>): Promise<void> {
    try {
      const emprestimoRef = ref(db, `emprestimos/${id}`);
      await update(emprestimoRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar empréstimo:', error);
      throw error;
    }
  }

  // Devolver livro
  async devolverLivro(id: string): Promise<void> {
    return this.atualizarEmprestimo(id, {
      status: 'devolvido',
      dataDevolucao: new Date().toISOString().split('T')[0]
    });
  }

  // Adicionar nova reserva
  async adicionarReserva(reserva: Omit<Reserva, 'id'>): Promise<Reserva> {
    try {
      const reservasRef = ref(db, 'reservas');
      const newRef = push(reservasRef);
      await set(newRef, reserva);
      
      return {
        id: newRef.key!,
        ...reserva
      };
    } catch (error) {
      console.error('Erro ao adicionar reserva:', error);
      throw error;
    }
  }

  // Atualizar reserva
  async atualizarReserva(id: string, dados: Partial<Reserva>): Promise<void> {
    try {
      const reservaRef = ref(db, `reservas/${id}`);
      await update(reservaRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  }

  // Cancelar reserva
  async cancelarReserva(id: string): Promise<void> {
    return this.atualizarReserva(id, { status: 'cancelada' });
  }

  // Buscar empréstimos por usuário
  async buscarEmprestimosPorUsuario(termo: string): Promise<LivroEmprestimo[]> {
    try {
      const emprestimos = await this.getEmprestimos();
      const termoLower = termo.toLowerCase();
      return emprestimos.filter(emprestimo => 
        emprestimo.usuario.toLowerCase().includes(termoLower) ||
        emprestimo.emailUsuario.toLowerCase().includes(termoLower) ||
        emprestimo.titulo.toLowerCase().includes(termoLower) ||
        (emprestimo.autor && emprestimo.autor.toLowerCase().includes(termoLower))
      );
    } catch (error) {
      console.error('Erro ao buscar empréstimos por usuário:', error);
      throw error;
    }
  }

  // Buscar reservas por usuário
  async buscarReservasPorUsuario(termo: string): Promise<Reserva[]> {
    try {
      const reservas = await this.getReservas();
      const termoLower = termo.toLowerCase();
      return reservas.filter(reserva => 
        reserva.usuario.toLowerCase().includes(termoLower) ||
        reserva.emailUsuario.toLowerCase().includes(termoLower) ||
        reserva.titulo.toLowerCase().includes(termoLower) ||
        (reserva.autor && reserva.autor.toLowerCase().includes(termoLower))
      );
    } catch (error) {
      console.error('Erro ao buscar reservas por usuário:', error);
      throw error;
    }
  }

  // Método adicional: remover empréstimo (se necessário)
  async removerEmprestimo(id: string): Promise<void> {
    try {
      const emprestimoRef = ref(db, `emprestimos/${id}`);
      await remove(emprestimoRef);
    } catch (error) {
      console.error('Erro ao remover empréstimo:', error);
      throw error;
    }
  }

  // Método adicional: remover reserva (se necessário)
  async removerReserva(id: string): Promise<void> {
    try {
      const reservaRef = ref(db, `reservas/${id}`);
      await remove(reservaRef);
    } catch (error) {
      console.error('Erro ao remover reserva:', error);
      throw error;
    }
  }
}

export const emprestimoService = new EmprestimoService();