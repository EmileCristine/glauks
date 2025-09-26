import estilos from './Login.module.css';
import Logo from '../assets/images/logo-branco.png';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string()
          .email({ message: 'Informe um e-mail válido!' }),
  senha: z.string()
          .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const autenticarUsuario = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.senha);
      navigate('inicial');
    } catch (error: any) {
      console.error('Erro no login:', error);
      let errorMessage = 'Ocorreu um erro durante a autenticação';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <img 
        className={estilos.logoImg}
        src={Logo}
        alt="Logo"
      />
      <form 
        className={estilos.form}
        onSubmit={handleSubmit(autenticarUsuario)}
      >
        <div className={estilos.opcoes}>
          <div className={estilos.opc}>Log in</div>
          <div>
            <Link to="/cadastro" className={estilos.opcCad}>Cadastro</Link>
          </div>
        </div>

        <h1>Usuário</h1>
        <input 
          {...register('email')}
          className={estilos.campo} 
          type="email"
          placeholder="Digite seu e-mail"
          disabled={isLoading}
        />
        {errors.email && (
          <p className={estilos.erro}>
            {errors.email.message}
          </p>
        )}

        <h1>Senha</h1>
        <input 
          {...register('senha')}
          className={estilos.campo} 
          type="password" 
          placeholder="Digite sua senha"
          disabled={isLoading}
        />
        {errors.senha && (
          <p className={estilos.erro}>
            {errors.senha.message}
          </p>
        )}

        <button 
          type="submit" 
          className={estilos.enter}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Enter'}
        </button>
      </form>
    </section>
  );
}