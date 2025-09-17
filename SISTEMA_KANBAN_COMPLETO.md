# 🎯 KANBAN API - Sistema Completo

## ✅ **Sistema Implementado:**

Seguindo exatamente seu padrão de código, implementei o sistema completo com:

### 🔧 **Entidades Criadas:**
- ✅ **Users** (Usuários) - Login/Register/Profile
- ✅ **Projects** (Projetos) - CRUD completo
- ✅ **Columns** (Colunas) - CRUD completo
- ✅ **Tasks** (Tarefas) - CRUD + mover entre colunas

### 🛡️ **Autenticação:**
- ✅ **Middleware JWT** protegendo todas as rotas exceto login/register
- ✅ **Token obrigatório** para acessar funcionalidades do Kanban

---

## 📋 **Rotas Disponíveis:**

### 🟢 **USUÁRIOS** (`/api/users`)
```bash
POST /api/users/login      # Fazer login
POST /api/users/register   # Registrar usuário
GET  /api/users/profile    # Ver perfil (🔒 protegida)
```

### 🟢 **PROJETOS** (`/api/projects`)
```bash
POST   /api/projects       # Criar projeto (🔒 protegida)
GET    /api/projects       # Listar projetos (🔒 protegida)
GET    /api/projects/:id   # Ver projeto (🔒 protegida)
PUT    /api/projects/:id   # Atualizar projeto (🔒 protegida)
DELETE /api/projects/:id   # Deletar projeto (🔒 protegida)
```

### 🟢 **COLUNAS** (`/api/columns`)
```bash
POST   /api/columns                  # Criar coluna (🔒 protegida)
GET    /api/columns/project/:projectId # Listar colunas do projeto (🔒 protegida)
GET    /api/columns/:id              # Ver coluna (🔒 protegida)
PUT    /api/columns/:id              # Atualizar coluna (🔒 protegida)
DELETE /api/columns/:id              # Deletar coluna (🔒 protegida)
```

### 🟢 **TAREFAS** (`/api/tasks`)
```bash
POST   /api/tasks                   # Criar tarefa (🔒 protegida)
GET    /api/tasks/column/:columnId  # Listar tarefas da coluna (🔒 protegida)
GET    /api/tasks/:id               # Ver tarefa (🔒 protegida)
PUT    /api/tasks/:id               # Atualizar tarefa (🔒 protegida)
PUT    /api/tasks/:id/move          # Mover tarefa entre colunas (🔒 protegida)
DELETE /api/tasks/:id               # Deletar tarefa (🔒 protegida)
```

---

## 🚀 **Exemplos de Uso:**

### **1. Fazer Login e obter token:**
```bash
POST /api/users/login
Content-Type: application/json

{
    "email": "usuario@email.com",
    "password": "senha123"
}
```
**Resposta:** `{ "token": "eyJhbGci..." }`

### **2. Criar um projeto:**
```bash
POST /api/projects
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
    "name": "Meu Projeto Kanban"
}
```

### **3. Criar colunas para o projeto:**
```bash
POST /api/columns
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
    "name": "A Fazer",
    "projectId": "id-do-projeto",
    "order": 1
}
```

### **4. Criar uma tarefa:**
```bash
POST /api/tasks
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
    "title": "Implementar autenticação",
    "description": "Criar sistema de login com JWT",
    "columnId": "id-da-coluna",
    "order": 1
}
```

### **5. Mover tarefa entre colunas:**
```bash
PUT /api/tasks/id-da-tarefa/move
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
    "columnId": "id-da-nova-coluna",
    "order": 2
}
```

---

## 📁 **Estrutura Criada:**

```
src/
├── users/
│   ├── controllers/
│   ├── domain/
│   └── infraestructure/
├── projects/
│   ├── controllers/
│   ├── domain/
│   └── infraestructure/
├── columns/
│   ├── controllers/
│   ├── domain/
│   └── infraestructure/
├── tasks/
│   ├── controllers/
│   ├── domain/
│   └── infraestructure/
└── core/
    └── middleware/
        └── auth.ts
```

---

## ⚙️ **Padrão Seguido:**

Implementei **exatamente** seguindo seu estilo:

### **Repository Pattern:**
```typescript
// domain/entity.repository.ts
export const entityRepository = new EntityRepository();
```

### **Controller Pattern:**
```typescript
// controllers/entity.controller.ts
export async function createEntity(data) { ... }
```

### **Route Pattern:**
```typescript
// infraestructure/entity.infraestructure.ts
router.post('/', authMiddleware, async (req, res) => { ... });
```

### **Error Handling:**
```typescript
try {
    const result = await controller(data);
    res.json({ message: 'Sucesso', result });
} catch (error) {
    res.status(500).json({ error: 'Mensagem de erro' });
}
```

---

## 🎉 **Sistema Pronto!**

Agora você tem um **Kanban completo** com:
- ✅ **Autenticação JWT**
- ✅ **CRUD de Projetos**
- ✅ **CRUD de Colunas**
- ✅ **CRUD de Tarefas**
- ✅ **Mover tarefas entre colunas**
- ✅ **Todas as rotas protegidas**

O sistema segue exatamente seu padrão de código e está pronto para uso!
