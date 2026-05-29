// ═══════════════════════════════════════════════════════════════════════════════
// CONSULTA PÚBLICA — ARABUTÃ
// Google Apps Script — Cole este código em script.google.com
// ═══════════════════════════════════════════════════════════════════════════════

const SPREADSHEET_ID = "SEU_ID_DA_PLANILHA_AQUI"; // ← substitua após criar a planilha
const ABA_CONTRIBUICOES = "Contribuições";
const ABA_PARTICIPANTES = "Participantes";

// ───────────────────────────────────────────────────────────────────────────────
// Função principal — recebe o POST do formulário
// ───────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const linhas = dados.linhas;

    if (!linhas || linhas.length === 0) {
      return resposta({ status: "erro", mensagem: "Nenhuma linha recebida" });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const abaContrib = obterOuCriarAba(ss, ABA_CONTRIBUICOES, cabecalhoContribuicoes());
    const abaPartic  = obterOuCriarAba(ss, ABA_PARTICIPANTES, cabecalhoParticipantes());

    // Registra cada contribuição como uma linha
    linhas.forEach((l) => {
      abaContrib.appendRow([
        l.protocolo,
        l.dataHora,
        l.nome,
        l.email,
        l.bairro,
        l.perfil,
        l.lei,
        l.tema,
        l.artigo,
        l.tipoContribuicao,
        l.sugestao,
        l.justificativa,
      ]);
    });

    // Registra o participante uma única vez (pelo protocolo)
    const primeira = linhas[0];
    abaPartic.appendRow([
      primeira.protocolo,
      primeira.dataHora,
      primeira.nome,
      primeira.email,
      primeira.telefone,
      primeira.bairro,
      primeira.perfil,
      primeira.contatoAutorizado,
      linhas.length,
      [...new Set(linhas.map((l) => l.lei))].join(", "),
    ]);

    return resposta({ status: "ok", protocolo: primeira.protocolo });

  } catch (err) {
    return resposta({ status: "erro", mensagem: err.message });
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Auxiliares
// ───────────────────────────────────────────────────────────────────────────────
function obterOuCriarAba(ss, nome, cabecalho) {
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    aba.appendRow(cabecalho);
    aba.getRange(1, 1, 1, cabecalho.length)
      .setFontWeight("bold")
      .setBackground("#1a5c38")
      .setFontColor("#ffffff");
    aba.setFrozenRows(1);
  }
  return aba;
}

function cabecalhoContribuicoes() {
  return [
    "Protocolo",
    "Data/Hora",
    "Nome",
    "E-mail",
    "Bairro/Localidade",
    "Perfil",
    "Lei",
    "Tema",
    "Artigo",
    "Tipo de contribuição",
    "Sugestão proposta",
    "Justificativa",
  ];
}

function cabecalhoParticipantes() {
  return [
    "Protocolo",
    "Data/Hora",
    "Nome",
    "E-mail",
    "Telefone",
    "Bairro/Localidade",
    "Perfil",
    "Contato autorizado",
    "Qtd. contribuições",
    "Leis comentadas",
  ];
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ───────────────────────────────────────────────────────────────────────────────
// GET de teste — acesse a URL do script no navegador para verificar se funciona
// ───────────────────────────────────────────────────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online", sistema: "Consulta Pública Arabutã" }))
    .setMimeType(ContentService.MimeType.JSON);
}
