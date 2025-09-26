import { useState } from 'react';
import { useEmprestimo } from '../context/EmprestimoContext';
import estilos from '../pages/Emprestimo.module.css';

interface AdicionarEmprestimoProps {
  onClose: () => void;
}

export function AdicionarEmprestimo({ onClose }: AdicionarEmprestimoProps) {
  const { adicionarEmprestimo } = useEmprestimo();
  const [formData, setFormData] = useState({
    titulo: '',
    usuario: '',
    emailUsuario: '',
    capa: '',
    autor: '',
    dataDevolucaoEsperada: '',
    isbn: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.usuario || !formData.emailUsuario || !formData.dataDevolucaoEsperada) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailUsuario)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    // Validar data de devolução (deve ser futura)
    const dataDevolucao = new Date(formData.dataDevolucaoEsperada);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataDevolucao <= hoje) {
      alert('A data de devolução deve ser futura.');
      return;
    }

    try {
      await adicionarEmprestimo({
        titulo: formData.titulo,
        usuario: formData.usuario,
        emailUsuario: formData.emailUsuario,
        capa: formData.capa || 'https://via.placeholder.com/150x200?text=Sem+Capa',
        autor: formData.autor,
        dataDevolucao: '',
        dataDevolucaoEsperada: formData.dataDevolucaoEsperada,
        isbn: formData.isbn
      });

      alert('Empréstimo adicionado com sucesso!');
      onClose();
    } catch (error) {
      alert('Erro ao adicionar empréstimo. Verifique se o servidor está rodando.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calcular data mínima (amanhã)
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const dataMinima = amanha.toISOString().split('T')[0];

  return (
    <div className={estilos.modalOverlay}>
      <div className={estilos.modal}>
        <div className={estilos.modalHeader}>
          <h2>Novo Empréstimo</h2>
          <button className={estilos.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={estilos.form}>
          <div className={estilos.formGroup}>
            <label htmlFor="titulo">Título do Livro *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Digite o título do livro"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="autor">Autor</label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Nome do autor"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN do livro"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="usuario">Nome do Usuário *</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              placeholder="Nome completo do usuário"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="emailUsuario">Email do Usuário *</label>
            <input
              type="email"
              id="emailUsuario"
              name="emailUsuario"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
              placeholder="email@exemplo.com"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="capa">URL da Capa</label>
            <input
              type="url"
              id="capa"
              name="capa"
              value={formData.capa}
              onChange={handleChange}
              placeholder="https://exemplo.com/capa.jpg"
            />
          </div>

          <div className={estilos.formGroup}>
            <label htmlFor="dataDevolucaoEsperada">Data de Devolução Esperada *</label>
            <input
              type="date"
              id="dataDevolucaoEsperada"
              name="dataDevolucaoEsperada"
              value={formData.dataDevolucaoEsperada}
              onChange={handleChange}
              min={dataMinima}
              required
            />
          </div>

          <div className={estilos.formActions}>
            <button type="button" onClick={onClose} className={estilos.btnCancelar}>
              Cancelar
            </button>
            <button type="submit" className={estilos.btnConfirmar}>
              Adicionar Empréstimo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
