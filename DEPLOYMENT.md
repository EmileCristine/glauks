# 🚀 Guia de Deploy - Sistema Glauks

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Firebase](https://console.firebase.google.com)
- Git configurado

## 🔧 Configuração do Firebase

### 1. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em **Settings** → **Environment Variables** e adicione:

```
VITE_FIREBASE_API_KEY=AIzaSyCreF56JD4rVlAGPRai3YJ3XB8xDD3isaI
VITE_FIREBASE_AUTH_DOMAIN=projeto-glauks.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://projeto-glauks-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=projeto-glauks
VITE_FIREBASE_STORAGE_BUCKET=projeto-glauks.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=810784881705
VITE_FIREBASE_APP_ID=1:810784881705:web:a71832a2159cef73943038
```

### 2. Configurar Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `projeto-glauks`
3. Vá em **Authentication** → **Sign-in method**
4. Habilite **Email/Password**
5. Vá em **Firestore Database**
6. Crie o banco em modo de teste
7. Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /emprestimos/{document} {
      allow read, write: if request.auth != null;
    }
    match /reservas/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deploy no Vercel

### Opção 1: Deploy via GitHub

1. **Criar repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/glauks-adm.git
   git push -u origin main
   ```

2. **Conectar no Vercel:**
   - Acesse [Vercel Dashboard](https://vercel.com/dashboard)
   - Clique em **New Project**
   - Importe o repositório do GitHub
   - Configure as variáveis de ambiente
   - Clique em **Deploy**

### Opção 2: Deploy via Vercel CLI

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## 🔒 Segurança

### Dados Sensíveis Protegidos

O `.gitignore` foi configurado para proteger:
- ✅ Configurações do Firebase (`src/firebase/config.ts`)
- ✅ Arquivo de banco local (`db.json`)
- ✅ Variáveis de ambiente (`.env*`)
- ✅ Arquivos de build (`dist/`, `build/`)

### Variáveis de Ambiente

As credenciais do Firebase agora são carregadas via variáveis de ambiente, mantendo os dados sensíveis seguros.

## 📱 Funcionalidades no Ambiente Web

### ✅ Funcionalidades Disponíveis

- **Autenticação completa** (Login/Cadastro/Logout)
- **Proteção de rotas** (usuários não autenticados são redirecionados)
- **Gerenciamento de empréstimos** (CRUD completo)
- **Gerenciamento de reservas** (CRUD completo)
- **Interface responsiva** (funciona em desktop e mobile)
- **Persistência de dados** (Firebase Firestore)
- **Validação de formulários** (React Hook Form + Zod)

### 🔄 Migração de Dados

Se você tem dados no `db.json`, migre para o Firestore:

1. Acesse o Firebase Console
2. Vá em **Firestore Database**
3. Crie as coleções `emprestimos` e `reservas`
4. Importe os dados manualmente ou use o script de migração

## 🛠️ Comandos de Desenvolvimento

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Desenvolvimento com JSON Server (local)
npm run dev:full
```

## 📊 Monitoramento

### Vercel Analytics
- Acesse o dashboard do Vercel
- Monitore performance e erros
- Configure alertas

### Firebase Analytics
- Configure no Firebase Console
- Monitore uso da aplicação
- Configure eventos personalizados

## 🔧 Solução de Problemas

### ❌ "Firebase: Error (auth/configuration-not-found)"
- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Confirme se os valores estão corretos

### ❌ "Firestore: Missing or insufficient permissions"
- Verifique as regras de segurança no Firebase Console
- Confirme se o usuário está autenticado

### ❌ "Build failed"
- Verifique se todas as dependências estão no `package.json`
- Confirme se o comando de build está correto

## 🎉 Sistema Pronto para Produção!

Seu sistema Glauks agora está configurado para:
- ✅ Deploy seguro no Vercel
- ✅ Dados sensíveis protegidos
- ✅ Funcionalidades completas no ambiente web
- ✅ Autenticação e persistência de dados
- ✅ Interface responsiva

**URL de produção:** Será fornecida pelo Vercel após o deploy
