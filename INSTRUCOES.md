# Instruções de implantação — Consulta Pública Arabutã

Siga os passos abaixo na ordem. Tempo estimado: **30 minutos**.

---

## PARTE 1 — Configurar o Google Sheets (banco de dados)

### 1.1 Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) com a conta Google da Prefeitura
2. Clique em **"+"** para criar uma nova planilha
3. Renomeie para **"Consulta Pública Arabutã 2026"**
4. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/  →→→ ESTE_TRECHO_É_O_ID  ←←← /edit
   ```

---

### 1.2 Criar o Apps Script (recebe os dados do formulário)

1. Na planilha, clique em **Extensões → Apps Script**
2. Apague todo o conteúdo do editor
3. Cole o conteúdo do arquivo **`google-apps-script/Codigo.gs`** (que está nesta pasta)
4. Na linha 8, substitua `SEU_ID_DA_PLANILHA_AQUI` pelo ID copiado no passo anterior:
   ```js
   const SPREADSHEET_ID = "1BxiM...seuId...aqui";
   ```
5. Clique em **Salvar** (ícone de disquete ou Ctrl+S)

---

### 1.3 Publicar o Apps Script como Web App

1. Clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem ⚙️ e selecione **"App da Web"**
3. Preencha:
   - **Descrição:** `Consulta Pública v1`
   - **Executar como:** `Eu (sua conta)`
   - **Quem tem acesso:** `Qualquer pessoa` ← **importante**
4. Clique em **Implantar**
5. Autorize as permissões quando solicitado (clique em "Avançado" se aparecer aviso)
6. Copie a **URL da implantação** — ela terá este formato:
   ```
   https://script.google.com/macros/s/AKfy.../exec
   ```

---

## PARTE 2 — Configurar o projeto React

### 2.1 Inserir a URL do Apps Script

Abra o arquivo **`src/App.jsx`** e localize a linha 9:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID_AQUI/exec";
```

Substitua pela URL copiada no passo 1.3:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

Salve o arquivo.

---

### 2.2 Instalar as dependências

Você precisa ter o **Node.js** instalado (baixe em [nodejs.org](https://nodejs.org) — versão LTS).

Abra o terminal na pasta do projeto e rode:

```bash
npm install
```

### 2.3 Testar localmente (opcional)

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador. Preencha e envie uma contribuição de teste e verifique se apareceu na planilha.

---

## PARTE 3 — Publicar no Vercel (link público)

### 3.1 Criar conta no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** e entre com uma conta GitHub (ou crie uma conta GitHub gratuita antes)

### 3.2 Enviar o projeto para o GitHub

1. Acesse [github.com](https://github.com) e crie um repositório novo chamado `consulta-arabuta`
2. Na pasta do projeto, rode no terminal:
   ```bash
   git init
   git add .
   git commit -m "Consulta pública Arabutã"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/consulta-arabuta.git
   git push -u origin main
   ```

### 3.3 Fazer o deploy no Vercel

1. No painel do Vercel, clique em **"Add New Project"**
2. Selecione o repositório `consulta-arabuta`
3. As configurações são detectadas automaticamente (Vite + React)
4. Clique em **Deploy**
5. Em 1–2 minutos o site estará no ar com uma URL como:
   ```
   https://consulta-arabuta.vercel.app
   ```

> 💡 **Domínio personalizado:** No painel do Vercel, em Settings → Domains, você pode adicionar um domínio próprio como `consulta.arabuta.sc.gov.br` gratuitamente.

---

## PARTE 4 — Divulgar

Compartilhe o link por:
- Site oficial da prefeitura
- WhatsApp dos grupos comunitários
- Redes sociais (Facebook, Instagram)
- E-mail para associações, sindicatos e profissionais locais
- Mural e recepção da prefeitura (com QR Code)

Para gerar o QR Code, acesse [qr-code-generator.com](https://www.qr-code-generator.com) e cole a URL do Vercel.

---

## PARTE 5 — Acompanhar as respostas

As respostas ficam salvas automaticamente em duas abas da planilha:

| Aba | Conteúdo |
|---|---|
| **Contribuições** | Uma linha por contribuição (tema, sugestão, justificativa) |
| **Participantes** | Uma linha por participante (dados de identificação) |

Para filtrar por lei: na aba **Contribuições**, use o filtro na coluna **"Lei"**.

Para exportar para Excel: **Arquivo → Baixar → Microsoft Excel (.xlsx)**

---

## Suporte

Em caso de dúvidas técnicas, os arquivos do projeto estão organizados assim:

```
consulta-arabuta/
├── src/
│   ├── App.jsx          ← formulário principal (edite aqui os textos)
│   └── main.jsx         ← entrada do React (não alterar)
├── google-apps-script/
│   └── Codigo.gs        ← script que salva na planilha
├── index.html           ← página HTML base (não alterar)
├── package.json         ← dependências do projeto
├── vite.config.js       ← configuração do build
└── INSTRUCOES.md        ← este arquivo
```
