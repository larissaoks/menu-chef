# Menu do Chef

Painel para organizar o cardápio de pequenos restaurantes, marmiteiros e chefs autônomos. A interface permite consultar receitas por categoria e dificuldade, pesquisar ingredientes e gerenciar disponibilidade, preparo e porções.

## Executar localmente

```bash
npm install
npm run dev
```

Para validar a aplicação:

```bash
npm run lint
npm run build
```

## Acesso

O login valida as credenciais pela API [DummyJSON Users](https://dummyjson.com/docs/users#users-login). Para teste, use o usuário `emilys` e a senha `emilyspass`. A sessão (incluindo os tokens retornados pela API) fica salva no `localStorage` deste navegador.

## Funcionalidades

- Listagem e detalhes de receitas da [DummyJSON Recipes](https://dummyjson.com/docs/recipes).
- Filtros por categoria, dificuldade e busca por nome/ingredientes.
- Cadastro, edição de tempo e porções, disponibilidade e exclusão de pratos.
- Rotas do painel protegidas por autenticação.
- React Query para consultas e mutações; Context API para sessão e alterações locais.
- As alterações do CRUD também são armazenadas no `localStorage`, porque a DummyJSON retorna respostas simuladas para POST, PUT/PATCH e DELETE e não persiste mudanças no servidor.