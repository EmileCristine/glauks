import estilos from './Cadastro.module.css'
import Logo from '../assets/images/logo-branco.png'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'

const cadastroSchema = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido!' }),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export function Cadastro(){
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const { register } = useAuth()

    const { 
        register: registerForm, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema)
    });

    const cadastrar = async (data: CadastroFormData) => {
        setIsLoading(true);
        try {
            await register(data.email, data.senha, data.nome);
            alert('Cadastro realizado com sucesso!');
            navigate('/inicial');
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            let errorMessage = 'Ocorreu um erro durante o cadastro';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email já está em uso';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'A senha é muito fraca';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    } 

  return(

    <section>
        <img 
            className={estilos.logoImg}
            src={Logo}
        />
        <form className={estilos.form} onSubmit={handleSubmit(cadastrar)}>

            <div className={estilos.opcoes}>
                <div>
                  <Link to="/" className={estilos.opcLog}>Log in</Link>
                </div>
                <div className={estilos.opc}>cadastro
                </div>
            </div>

            {/* ADICIONE ESTE CAMPO NOME */}
            <h1>Nome</h1>
            <input 
                {...registerForm('nome')}
                className={estilos.campo} 
                type="text"
                placeholder="Digite seu nome"
                disabled={isLoading}
            />
            {errors.nome && (
                <p className={estilos.erro}>
                    {errors.nome.message}
                </p>
            )}

            <h1>Email</h1>
            <input 
                {...registerForm('email')}
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
                {...registerForm('senha')}
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

            <h1>Confirmar Senha</h1>
            <input 
                {...registerForm('confirmarSenha')}
                className={estilos.campo} 
                type="password"
                placeholder="Confirme sua senha"
                disabled={isLoading}
            />
            {errors.confirmarSenha && (
                <p className={estilos.erro}>
                    {errors.confirmarSenha.message}
                </p>
            )}

            <button type="submit" className={estilos.enter} disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Enter'}
            </button>
        </form>

    </section>
  )
}
