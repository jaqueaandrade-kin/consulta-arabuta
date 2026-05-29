import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO — substitua pela URL gerada no Google Apps Script
// Veja o arquivo INSTRUCOES.md para o passo a passo completo
// ─────────────────────────────────────────────────────────────────────────────
// Proxy serverless no próprio Vercel — evita bloqueio de CORS do Google
const PROXY_URL = "/api/enviar";

// ─────────────────────────────────────────────────────────────────────────────
// PALETA — Identidade Visual Arabutã / Plano Diretor
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  vermelho:     "#D92B2B",
  vermelhoEsc:  "#B02020",
  amarelo:      "#F5B800",
  amareloClaro: "#FEF3C7",
  laranja:      "#E8651A",
  laranjaClaro: "#FDE8D5",
  cinzaEsc:     "#3D3D3D",
  cinzaMed:     "#5A5A5A",
  cinzaClaro:   "#F2F2F2",
  cinzaBorda:   "#DEDEDE",
  preto:        "#1A1A1A",
  branco:       "#FFFFFF",
  fundo:        "#F7F7F7",
};

async function enviarParaGoogleSheets(identificacao, contribuicoes) {
  const protocolo = "ARB-" + Date.now().toString(36).toUpperCase();
  const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const linhas = contribuicoes.map((c) => ({
    protocolo,
    dataHora,
    nome: identificacao.nome,
    email: identificacao.email,
    telefone: identificacao.telefone || "",
    bairro: identificacao.bairro || "",
    perfil: identificacao.perfil,
    contatoAutorizado: identificacao.contatoAutorizado ? "Sim" : "Não",
    lei: c.nomeLei,
    tema: c.tema === "Outro (especificar)" ? c.temaOutro : c.tema,
    artigo: c.artigo || "",
    tipoContribuicao: c.tipo,
    sugestao: c.sugestao || "",
    justificativa: c.justificativa || "",
  }));

  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linhas }),
  });

  if (!response.ok) throw new Error("Falha no envio");
  return protocolo;
}

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DAS LEIS — cores na paleta municipal
// ─────────────────────────────────────────────────────────────────────────────
const LEIS = [
  {
    id: "plano_diretor",
    nome: "Lei Geral do Plano Diretor",
    sigla: "PD",
    descricao: "Institui o Plano Diretor Municipal de Arabutã, estabelecendo princípios, diretrizes, macrozoneamento e instrumentos da política urbana.",
    cor: C.vermelho,
    corEsc: C.vermelhoEsc,
    corClara: "#FDECEA",
    link: "https://drive.google.com/open?id=1L0IePQ-XNHJHSghLbYO49w-x3MCbRwan&usp=drive_copy",
    anexos: [
      { nome: "Anexo I — Mapa Macrozoneamento Municipal", link: "https://drive.google.com/file/d/1_9NEVf6bw6XYYevz8q3Tt8y1UHDkRFJN/view?usp=sharing" },
      { nome: "Anexo II — Mapa Perímetro Urbano Municipal", link: "https://drive.google.com/file/d/1pAlJDWVmN9O3yLvy5H5nojM2vatqbbzC/view?usp=sharing" },
      { nome: "Anexo III — Mapa Perímetro Urbano Sede", link: "https://drive.google.com/file/d/1x8_nJYhDRnhabV3BwtK7QWUQT77drDXT/view?usp=sharing" },
      { nome: "Anexo IV — Mapa Perímetro Urbano Nova Estrela", link: "https://drive.google.com/file/d/1Yn3BC91C-2KYllqifxqxJ5Rnr3qlz1eK/view?usp=sharing" },
      { nome: "Anexo V — Mapa Perímetro Urbano Canhada Grande", link: "https://drive.google.com/file/d/1yy2QAybuJGKpvIUHwQYS6s41vEVUzsJe/view?usp=sharing" },
      { nome: "Anexo VI — Memorial Descritivo do Perímetro Urbano Municipal", link: null },
      { nome: "Anexo VII — Plano de Ação e Investimento", link: "https://drive.google.com/file/d/1_H44x-wuBRwMLQoZnDZjYpNXjLUQKCKM/view?usp=sharing" },
    ],
    temas: [
      "Princípios e objetivos do Plano Diretor",
      "Perímetro urbano e delimitação territorial",
      "Macrozoneamento municipal",
      "Macrozona Urbana",
      "Macrozona de Produção Agropecuária",
      "Macrozona de Interesse Logístico e Industrial",
      "Macrozona de Interesse Turístico",
      "Áreas Especiais de Interesse Social",
      "Áreas de Interesse Ambiental",
      "Política de Desenvolvimento Urbano",
      "Política de Mobilidade e Sistema Viário",
      "Política de Infraestrutura Territorial",
      "Política de Proteção Ambiental",
      "Adaptação Climática e Gestão de Riscos",
      "Política de Desenvolvimento Rural",
      "Territórios Produtivos Rurais",
      "Instrumentos urbanísticos (IPTU Progressivo, Direito de Preempção, etc.)",
      "Gestão democrática e participação popular",
      "Sistema de acompanhamento e revisão do Plano",
      "Outro (especificar)",
    ],
  },
  {
    id: "uso_ocupacao",
    nome: "Lei de Uso e Ocupação do Solo",
    sigla: "UO",
    descricao: "Disciplina o uso e a ocupação do solo urbano e rural, institui o zoneamento municipal e define os parâmetros urbanísticos para cada zona.",
    cor: C.laranja,
    corEsc: "#C04D0A",
    corClara: C.laranjaClaro,
    link: "https://drive.google.com/file/d/1Pv17Y0_kve91wM4yBSKzFSBNw3H4euDy/view?usp=sharing",
    anexos: [
      { nome: "Anexo I — Mapa de Macrozoneamento Municipal", link: "https://drive.google.com/file/d/1h_z0pHTlvwQuY7l_gsOgj2WAuSf8f7BI/view?usp=sharing" },
      { nome: "Anexo II — Mapas de Zoneamento de Uso e Ocupação do Solo", link: "https://drive.google.com/file/d/1VmZMHlvUfKJnGGgXiZZevfM4STEg1DMR/view?usp=sharing" },
      { nome: "Anexo III — Mapa de Zoneamento Urbano — Sede Municipal", link: "https://drive.google.com/file/d/16bT4HPBmIs58L5ju72wocCFwlnQ7ijKK/view?usp=sharing" },
      { nome: "Anexo IV — Mapa de Zoneamento Urbano — Nova Estrela", link: "https://drive.google.com/file/d/1XHDtZFAs8kG97m4pf3PA_lEnb6qh5LDx/view?usp=sharing" },
      { nome: "Anexo V — Mapa de Zoneamento Urbano — Canhada Grande", link: "https://drive.google.com/file/d/1QquJvl_L_Flo2tGMKHSZ1fc52P0OeBo9/view?usp=sharing" },
      { nome: "Anexo VI — Mapas do Sistema Viário Municipal", link: null },
      { nome: "Anexo VII — Mapa do Sistema Viário Municipal — Sede", link: null },
      { nome: "Anexo VIII — Mapa do Sistema Viário Municipal — Nova Estrela", link: null },
      { nome: "Anexo IX — Mapa do Sistema Viário Municipal — Canhada Grande", link: null },
      { nome: "Anexo X — Sistema Viário — Seções Transversais", link: null },
      { nome: "Anexo XI — Índices Urbanísticos", link: "https://drive.google.com/file/d/18Gt6WTnewQSs_lIxliWpSsuEXGWqcFBz/view?usp=sharing" },
      { nome: "Anexo XII — Tabela de Uso do Solo", link: "https://drive.google.com/file/d/1c4CiFYXXedaFGPg8TN13DUIpVOSd78MT/view?usp=sharing" },
      { nome: "Anexo XIII — Tabela de Vagas de Estacionamento", link: "https://drive.google.com/file/d/192KDIcmzyMDrYrHKh4h9OUlAu-wP_NE6/view?usp=sharing" },
      { nome: "Anexo XIV — Glossário", link: null },
    ],
    temas: [
      "Zona Residencial (ZR)",
      "Zona de Comércio e Serviços (ZCS)",
      "Zona Mista Central (ZMC)",
      "Zona Especial de Interesse Social (ZEIS)",
      "Zona Industrial (ZI)",
      "Zona de Preservação Permanente (ZPP)",
      "Zona Verde e de Lazer (ZVL)",
      "Zona Institucional e Comunitária (ZIC)",
      "Zona de Expansão Urbana (ZEU)",
      "Zona Rural",
      "Parâmetros urbanísticos (recuos, gabarito, taxa de ocupação, coeficiente de aproveitamento)",
      "Usos permitidos e proibidos por zona",
      "Atividades de impacto de vizinhança",
      "Sistema viário e hierarquia viária",
      "Afastamentos e alinhamentos",
      "Estacionamento e vagas",
      "Índices e tabelas de parâmetros urbanísticos (Anexos)",
      "Mapas de zoneamento (Anexos cartográficos)",
      "Disposições transitórias",
      "Outro (especificar)",
    ],
  },
  {
    id: "parcelamento",
    nome: "Lei de Parcelamento do Solo",
    sigla: "PS",
    descricao: "Disciplina o parcelamento, o desmembramento, o remembramento e demais formas de reorganização do solo para fins urbanos no Município.",
    cor: C.amarelo,
    corEsc: "#C98F00",
    corClara: C.amareloClaro,
    link: "https://drive.google.com/file/d/1mb57O3V1R42Ao7EGnr3yJxPQqeSuLACe/view",
    anexos: [],
    temas: [
      "Condições gerais para parcelamento e remembramento",
      "Dimensões mínimas e máximas de lotes",
      "Vedações ao parcelamento (áreas de risco, APPs, etc.)",
      "Requisitos de infraestrutura dos loteamentos",
      "Áreas públicas obrigatórias (verdes, equipamentos, arruamento)",
      "Condomínios de lotes",
      "Desdobro e desmembramento",
      "Remembramento de lotes",
      "Processo de aprovação do parcelamento",
      "Documentação e projetos exigidos",
      "Prazos para implantação do loteamento",
      "Obras de infraestrutura obrigatórias",
      "Registro e regularização fundiária",
      "Parcelamento de interesse social",
      "Fiscalização e penalidades",
      "Disposições transitórias",
      "Outro (especificar)",
    ],
  },
];

const TIPOS_CONTRIBUICAO = [
  { valor: "sugestao_alteracao",   label: "Sugestão de alteração" },
  { valor: "inclusao_dispositivo", label: "Inclusão de novo dispositivo" },
  { valor: "exclusao_trecho",      label: "Exclusão de trecho" },
  { valor: "ajuste_redacao",       label: "Ajuste de redação" },
  { valor: "sem_contribuicao",     label: "Sem contribuição sobre este tema" },
];

const PERFIS = [
  "Morador(a) do município",
  "Proprietário(a) de imóvel",
  "Empresário(a) / Comerciante",
  "Produtor(a) rural / Agricultor(a)",
  "Profissional da área técnica (arquitetura, engenharia, urbanismo, direito)",
  "Servidor(a) público(a)",
  "Representante de entidade / associação",
  "Estudante",
  "Outro",
];

const STEP_INTRO       = "intro";
const STEP_LGPD        = "lgpd";
const STEP_IDENTIFICACAO = "identificacao";
const STEP_SELECAO_LEI = "selecao_lei";
const STEP_CONTRIBUICAO = "contribuicao";
const STEP_REVISAO     = "revisao";
const STEP_CONFIRMACAO = "confirmacao";

const STEP_ORDER = [STEP_LGPD, STEP_IDENTIFICACAO, STEP_SELECAO_LEI, STEP_CONTRIBUICAO, STEP_REVISAO];
const STEP_LABELS = {
  [STEP_LGPD]: "Consentimento",
  [STEP_IDENTIFICACAO]: "Identificação",
  [STEP_SELECAO_LEI]: "Escolha da lei",
  [STEP_CONTRIBUICAO]: "Contribuições",
  [STEP_REVISAO]: "Revisão e envio",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function ConsultaPublica() {
  const [step, setStep] = useState(STEP_INTRO);
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [identificacao, setIdentificacao] = useState({
    nome: "", email: "", telefone: "", perfil: "", bairro: "", contatoAutorizado: false,
  });
  const [leiSelecionada, setLeiSelecionada] = useState(null);
  const [contribuicoes, setContribuicoes] = useState([]);
  const [contribuicaoAtual, setContribuicaoAtual] = useState({
    tema: "", temaOutro: "", artigo: "", tipo: "", sugestao: "", justificativa: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const [protocolo, setProtocolo] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  const lei = LEIS.find((l) => l.id === leiSelecionada);
  const currentIdx = STEP_ORDER.indexOf(step);

  function validarIdentificacao() {
    const e = {};
    if (!identificacao.nome.trim()) e.nome = "Nome é obrigatório";
    if (!identificacao.email.trim()) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(identificacao.email)) e.email = "E-mail inválido";
    if (!identificacao.perfil) e.perfil = "Selecione seu perfil";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function validarContribuicao() {
    const e = {};
    if (!contribuicaoAtual.tema) e.tema = "Selecione um tema";
    if (contribuicaoAtual.tema === "Outro (especificar)" && !contribuicaoAtual.temaOutro.trim())
      e.temaOutro = "Descreva o tema";
    if (!contribuicaoAtual.tipo) e.tipo = "Selecione o tipo de contribuição";
    if (contribuicaoAtual.tipo !== "sem_contribuicao" && !contribuicaoAtual.sugestao.trim())
      e.sugestao = "Descreva sua sugestão";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function adicionarContribuicao() {
    if (!validarContribuicao()) return;
    setContribuicoes([...contribuicoes, { ...contribuicaoAtual, lei: leiSelecionada, nomeLei: lei.nome, id: Date.now() }]);
    setContribuicaoAtual({ tema: "", temaOutro: "", artigo: "", tipo: "", sugestao: "", justificativa: "" });
    setErros({});
  }

  function removerContribuicao(id) {
    setContribuicoes(contribuicoes.filter((c) => c.id !== id));
  }

  async function handleEnviar() {
    setEnviando(true);
    setErroEnvio("");
    try {
      const prot = await enviarParaGoogleSheets(identificacao, contribuicoes);
      setProtocolo(prot);
      setStep(STEP_CONFIRMACAO);
    } catch {
      setErroEnvio("Não foi possível enviar agora. Verifique sua conexão ou tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: C.fundo,
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      color: C.preto,
    }}>

      {/* ── CABEÇALHO ── */}
      <div style={{
        background: C.preto,
        borderBottom: `4px solid ${C.vermelho}`,
      }}>
        {/* Faixa decorativa superior — padrão geométrico da identidade */}
        <div style={{
          height: 8,
          background: `repeating-linear-gradient(90deg, ${C.vermelho} 0px, ${C.vermelho} 32px, ${C.amarelo} 32px, ${C.amarelo} 64px, ${C.laranja} 64px, ${C.laranja} 96px, ${C.cinzaMed} 96px, ${C.cinzaMed} 128px)`,
        }} />
        <div style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}>
          {/* Logotipo textual — substitua por <img> se tiver o arquivo SVG/PNG */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              background: C.amarelo,
              width: 48, height: 48,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "900", fontSize: 22, color: C.preto,
              letterSpacing: "-1px",
            }}>PD</div>
          </div>
          <div>
            <div style={{ color: C.amarelo, fontWeight: "900", fontSize: 18, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Plano Diretor
            </div>
            <div style={{ color: C.amarelo, fontWeight: "900", fontSize: 22, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Arabutã
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 3, letterSpacing: "0.06em" }}>
              MUNICIPIO DE ARABUTÃ · SANTA CATARINA
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{
              background: C.vermelho,
              color: C.branco,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Consulta Pública
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>
              29 mai a 29 jun · 2026
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRA DE PROGRESSO ── */}
      {STEP_ORDER.includes(step) && (
        <div style={{ background: C.cinzaEsc, borderBottom: `3px solid ${C.amarelo}` }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "flex" }}>
              {STEP_ORDER.map((s, i) => {
                const ativo = i === currentIdx;
                const feito = i < currentIdx;
                return (
                  <div key={s} style={{
                    flex: 1,
                    padding: "10px 4px",
                    textAlign: "center",
                    borderBottom: ativo ? `3px solid ${C.amarelo}` : "3px solid transparent",
                    marginBottom: -3,
                  }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: ativo ? "bold" : "normal",
                      color: ativo ? C.amarelo : feito ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {feito ? "✓ " : ""}{STEP_LABELS[s]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ════════════════ INTRO ════════════════ */}
        {step === STEP_INTRO && (
          <div>
            {/* Banner de abertura */}
            <div style={{
              background: C.cinzaEsc,
              borderLeft: `6px solid ${C.vermelho}`,
              padding: "28px 32px",
              marginBottom: 24,
            }}>
              <div style={{ color: C.amarelo, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: "bold" }}>
                Revisão do Plano Diretor Municipal · 2026
              </div>
              <h1 style={{ color: C.branco, margin: "0 0 12px", fontSize: 26, fontWeight: "900", lineHeight: 1.2 }}>
                Participe da construção do futuro de Arabutã
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                Esta consulta pública recebe contribuições sobre três minutas de projeto de lei que integram o novo Plano Diretor Municipal. Suas sugestões serão analisadas pela equipe técnica.
              </p>
            </div>

            {/* Cards das leis */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.12em", color: C.cinzaMed, marginBottom: 14 }}>
                Minutas em consulta pública
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {LEIS.map((l) => (
                  <div key={l.id} style={{
                    background: C.branco,
                    border: `1px solid ${C.cinzaBorda}`,
                    borderLeft: `5px solid ${l.cor}`,
                    padding: "18px 20px",
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <div style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: l.cor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "900", fontSize: 13, color: l.id === "parcelamento" ? C.preto : C.branco,
                      letterSpacing: "0.02em",
                    }}>{l.sigla}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 15, color: C.preto, marginBottom: 3 }}>{l.nome}</div>
                      <div style={{ color: C.cinzaMed, fontSize: 13, lineHeight: 1.5 }}>{l.descricao}</div>
                    </div>
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <a href={l.link} target="_blank" rel="noreferrer" style={{
                        background: C.branco,
                        border: `1.5px solid ${l.cor}`,
                        color: l.cor,
                        padding: "8px 14px",
                        fontSize: 12,
                        fontWeight: "bold",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}>Ver minuta</a>
                      {l.anexos && l.anexos.length > 0 && (
                        <div style={{ textAlign: "right" }}>
                          {l.anexos.filter(a => a.link).map((a, i) => (
                            <a key={i} href={a.link} target="_blank" rel="noreferrer" style={{
                              display: "block",
                              fontSize: 11,
                              color: l.cor,
                              textDecoration: "underline",
                              marginTop: 3,
                              whiteSpace: "nowrap",
                            }}>{a.nome}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aviso */}
            <div style={{
              background: C.amareloClaro,
              border: `1px solid ${C.amarelo}`,
              borderLeft: `4px solid ${C.amarelo}`,
              padding: "12px 16px",
              fontSize: 13,
              color: C.cinzaEsc,
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              <strong>Atencao:</strong> Contribuicoes genericas poderao nao ser consideradas caso nao indiquem claramente o artigo ou tema da minuta a que se referem.
            </div>

            <button onClick={() => setStep(STEP_LGPD)} style={{
              background: C.vermelho,
              color: C.branco,
              border: "none",
              padding: "16px 0",
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Iniciar participacao
            </button>
          </div>
        )}

        {/* ════════════════ LGPD ════════════════ */}
        {step === STEP_LGPD && (
          <Card titulo="Termo de Consentimento para Tratamento de Dados Pessoais">
            <p style={{ color: C.cinzaMed, lineHeight: 1.7, fontSize: 14, marginTop: 0 }}>
              Em conformidade com a <strong style={{ color: C.preto }}>Lei Geral de Protecao de Dados Pessoais (Lei n. 13.709/2018)</strong>, informamos que os dados coletados serao utilizados exclusivamente para fins de participacao nesta consulta publica referente a revisao do Plano Diretor Municipal de Arabuta.
            </p>

            <Subtitulo>Os dados poderao ser utilizados para:</Subtitulo>
            <ul style={{ color: C.cinzaMed, lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
              <li>Sistematizacao e analise das contribuicoes recebidas;</li>
              <li>Elaboracao de relatorios tecnicos de participacao social;</li>
              <li>Eventual contato com os participantes, caso autorizado.</li>
            </ul>

            <Subtitulo>Garantias ao participante:</Subtitulo>
            <ul style={{ color: C.cinzaMed, lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
              <li>Seus dados serao tratados de forma confidencial;</li>
              <li>Nao serao compartilhados com terceiros para fins comerciais;</li>
              <li>Sua identificacao nao sera divulgada publicamente, salvo autorizacao expressa.</li>
            </ul>

            <div
              onClick={() => setLgpdAceito(!lgpdAceito)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
                background: lgpdAceito ? "#FEF3C7" : C.cinzaClaro,
                border: `2px solid ${lgpdAceito ? C.amarelo : C.cinzaBorda}`,
                padding: "14px 16px",
                margin: "20px 0",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 22, height: 22, flexShrink: 0, marginTop: 1,
                background: lgpdAceito ? C.vermelho : C.branco,
                border: `2px solid ${lgpdAceito ? C.vermelho : C.cinzaBorda}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.branco, fontSize: 14, fontWeight: "bold",
              }}>
                {lgpdAceito && "✓"}
              </div>
              <span style={{ fontSize: 14, color: C.preto, lineHeight: 1.5 }}>
                <strong>Li e concordo</strong> com os termos acima e autorizo o tratamento dos meus dados pessoais para as finalidades descritas.
              </span>
            </div>

            <BotoesNav>
              <BotaoVoltar onClick={() => setStep(STEP_INTRO)} />
              <BotaoAvancar disabled={!lgpdAceito} onClick={() => setStep(STEP_IDENTIFICACAO)} />
            </BotoesNav>
          </Card>
        )}

        {/* ════════════════ IDENTIFICAÇÃO ════════════════ */}
        {step === STEP_IDENTIFICACAO && (
          <Card titulo="Identificacao do Participante">
            <p style={{ color: C.cinzaMed, fontSize: 14, marginTop: 0, lineHeight: 1.6 }}>
              Suas informacoes de identificacao sao confidenciais e nao serao divulgadas publicamente.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Campo label="Nome completo *" style={{ gridColumn: "span 2" }} erro={erros.nome}>
                <FInput placeholder="Seu nome completo" value={identificacao.nome}
                  onChange={(v) => setIdentificacao({ ...identificacao, nome: v })} erro={erros.nome} />
              </Campo>
              <Campo label="E-mail *" erro={erros.email}>
                <FInput type="email" placeholder="seu@email.com" value={identificacao.email}
                  onChange={(v) => setIdentificacao({ ...identificacao, email: v })} erro={erros.email} />
              </Campo>
              <Campo label="Telefone (opcional)">
                <FInput placeholder="(49) 9 0000-0000" value={identificacao.telefone}
                  onChange={(v) => setIdentificacao({ ...identificacao, telefone: v })} />
              </Campo>
              <Campo label="Bairro / Localidade (opcional)" style={{ gridColumn: "span 2" }}>
                <FInput placeholder="Ex: Centro, Nova Estrela, Canhada Grande..." value={identificacao.bairro}
                  onChange={(v) => setIdentificacao({ ...identificacao, bairro: v })} />
              </Campo>
              <Campo label="Perfil do participante *" style={{ gridColumn: "span 2" }} erro={erros.perfil}>
                <FSelect value={identificacao.perfil} options={PERFIS} placeholder="Selecione seu perfil..."
                  onChange={(v) => setIdentificacao({ ...identificacao, perfil: v })} erro={erros.perfil} />
              </Campo>
              <div style={{ gridColumn: "span 2" }}>
                <div
                  onClick={() => setIdentificacao({ ...identificacao, contatoAutorizado: !identificacao.contatoAutorizado })}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                    background: identificacao.contatoAutorizado ? C.amareloClaro : C.cinzaClaro,
                    border: `1.5px solid ${identificacao.contatoAutorizado ? C.amarelo : C.cinzaBorda}`,
                    padding: "12px 14px",
                  }}
                >
                  <FCheckbox checked={identificacao.contatoAutorizado} />
                  <span style={{ fontSize: 13, color: C.cinzaMed, lineHeight: 1.5 }}>
                    Autorizo ser contactado(a) pela equipe tecnica para esclarecimentos sobre minhas contribuicoes.
                  </span>
                </div>
              </div>
            </div>

            <BotoesNav style={{ marginTop: 24 }}>
              <BotaoVoltar onClick={() => setStep(STEP_LGPD)} />
              <BotaoAvancar onClick={() => { if (validarIdentificacao()) setStep(STEP_SELECAO_LEI); }} />
            </BotoesNav>
          </Card>
        )}

        {/* ════════════════ SELEÇÃO DE LEI ════════════════ */}
        {step === STEP_SELECAO_LEI && (
          <Card titulo="Selecione a minuta que deseja comentar">
            <p style={{ color: C.cinzaMed, fontSize: 14, marginTop: 0, lineHeight: 1.6 }}>
              Escolha uma das tres minutas. Apos enviar suas contribuicoes, voce podera retornar para comentar outra lei.
            </p>

            <div style={{ display: "grid", gap: 12, margin: "20px 0" }}>
              {LEIS.map((l) => {
                const sel = leiSelecionada === l.id;
                return (
                  <div key={l.id} onClick={() => setLeiSelecionada(l.id)} style={{
                    border: `2px solid ${sel ? l.cor : C.cinzaBorda}`,
                    background: sel ? l.corClara : C.branco,
                    padding: "18px 20px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 16,
                    transition: "all 0.15s",
                  }}>
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      background: sel ? l.cor : C.cinzaClaro,
                      border: `2px solid ${sel ? l.cor : C.cinzaBorda}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "900", fontSize: 13,
                      color: sel ? (l.id === "parcelamento" ? C.preto : C.branco) : C.cinzaMed,
                      transition: "all 0.15s",
                    }}>{l.sigla}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 15, color: sel ? l.corEsc : C.preto, marginBottom: 3 }}>{l.nome}</div>
                      <div style={{ color: C.cinzaMed, fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>{l.descricao}</div>
                      <a href={l.link} target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-block",
                          border: `1.5px solid ${l.cor}`,
                          color: l.cor,
                          background: C.branco,
                          padding: "5px 12px",
                          fontSize: 11,
                          fontWeight: "bold",
                          textDecoration: "none",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}>Consultar minuta</a>
                        {l.anexos && l.anexos.length > 0 && (
                          <div style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ fontSize: 11, color: C.cinzaMed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, fontWeight: "bold" }}>Anexos disponíveis:</div>
                            {l.anexos.map((a, i) => (
                              a.link ? (
                                <a key={i} href={a.link} target="_blank" rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ display: "block", fontSize: 12, color: l.cor, textDecoration: "underline", marginTop: 3, lineHeight: 1.4 }}>
                                  {a.nome}
                                </a>
                              ) : (
                                <div key={i} style={{ display: "block", fontSize: 12, color: C.cinzaMed, marginTop: 3, lineHeight: 1.4 }}>
                                  {a.nome} <span style={{ fontSize: 10, color: "#bbb" }}>(em breve)</span>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                    </div>
                    <div style={{
                      width: 22, height: 22, flexShrink: 0,
                      border: `2px solid ${sel ? l.cor : C.cinzaBorda}`,
                      background: sel ? l.cor : C.branco,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: l.id === "parcelamento" && sel ? C.preto : C.branco,
                      fontWeight: "bold", fontSize: 13,
                    }}>
                      {sel && "✓"}
                    </div>
                  </div>
                );
              })}
            </div>

            <BotoesNav>
              <BotaoVoltar onClick={() => setStep(STEP_IDENTIFICACAO)} />
              <BotaoAvancar
                cor={lei?.cor}
                disabled={!leiSelecionada}
                onClick={() => setStep(STEP_CONTRIBUICAO)}
              />
            </BotoesNav>
          </Card>
        )}

        {/* ════════════════ CONTRIBUIÇÃO ════════════════ */}
        {step === STEP_CONTRIBUICAO && lei && (
          <div>
            {/* Header da lei */}
            <div style={{
              background: lei.cor,
              padding: "14px 24px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: "rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "900", fontSize: 14,
                color: lei.id === "parcelamento" ? C.preto : C.branco,
              }}>{lei.sigla}</div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 16, color: lei.id === "parcelamento" ? C.preto : C.branco }}>{lei.nome}</div>
                <div style={{ fontSize: 12, color: lei.id === "parcelamento" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)" }}>
                  Adicione uma ou mais contribuicoes antes de prosseguir
                </div>
              </div>
            </div>

            <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderTop: "none", padding: "24px 28px" }}>

              {/* Contribuicoes ja adicionadas */}
              {contribuicoes.filter((c) => c.lei === leiSelecionada).length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <Subtitulo>
                    Contribuicoes adicionadas ({contribuicoes.filter((c) => c.lei === leiSelecionada).length})
                  </Subtitulo>
                  <div style={{ display: "grid", gap: 8 }}>
                    {contribuicoes.filter((c) => c.lei === leiSelecionada).map((c) => (
                      <div key={c.id} style={{
                        border: `1px solid ${lei.cor}44`,
                        borderLeft: `4px solid ${lei.cor}`,
                        padding: "12px 14px",
                        background: lei.corClara,
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
                      }}>
                        <div>
                          <div style={{ fontWeight: "bold", color: lei.corEsc, fontSize: 14 }}>
                            {c.tema === "Outro (especificar)" ? c.temaOutro : c.tema}
                            {c.artigo && <span style={{ fontWeight: "normal", color: C.cinzaMed, fontSize: 13 }}> · Art. {c.artigo}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: C.cinzaMed, marginTop: 2 }}>
                            {TIPOS_CONTRIBUICAO.find((t) => t.valor === c.tipo)?.label}
                          </div>
                          {c.sugestao && (
                            <div style={{ fontSize: 13, color: C.cinzaEsc, marginTop: 5, lineHeight: 1.5 }}>
                              {c.sugestao.length > 120 ? c.sugestao.slice(0, 120) + "..." : c.sugestao}
                            </div>
                          )}
                        </div>
                        <button onClick={() => removerContribuicao(c.id)} style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: C.vermelho, fontSize: 20, flexShrink: 0, padding: "0 4px", lineHeight: 1,
                        }}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulario nova contribuicao */}
              <div style={{
                background: C.cinzaClaro,
                border: `1.5px dashed ${C.cinzaBorda}`,
                padding: "20px 22px",
                marginBottom: 20,
              }}>
                <div style={{ fontWeight: "bold", color: C.cinzaEsc, marginBottom: 16, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  + Nova contribuicao
                </div>

                <Campo label="Tema / Assunto *" erro={erros.tema} style={{ marginBottom: 14 }}>
                  <FSelect
                    value={contribuicaoAtual.tema}
                    onChange={(v) => { setContribuicaoAtual({ ...contribuicaoAtual, tema: v, temaOutro: "" }); setErros({ ...erros, tema: null }); }}
                    options={lei.temas}
                    placeholder="Selecione o tema..."
                    cor={lei.cor}
                    erro={erros.tema}
                  />
                </Campo>

                {contribuicaoAtual.tema === "Outro (especificar)" && (
                  <Campo label="Descreva o tema *" erro={erros.temaOutro} style={{ marginBottom: 14 }}>
                    <FInput placeholder="Descreva o tema ou assunto..." value={contribuicaoAtual.temaOutro}
                      onChange={(v) => setContribuicaoAtual({ ...contribuicaoAtual, temaOutro: v })} erro={erros.temaOutro} />
                  </Campo>
                )}

                <Campo label="Artigo (opcional)" style={{ marginBottom: 14 }}>
                  <FInput placeholder="Ex: 12, 15, paragrafo 2 do art. 20..."
                    value={contribuicaoAtual.artigo}
                    onChange={(v) => setContribuicaoAtual({ ...contribuicaoAtual, artigo: v })} />
                  <div style={{ fontSize: 12, color: C.cinzaMed, marginTop: 4 }}>
                    Informe o numero do artigo se sua contribuicao se referir a um dispositivo especifico.
                  </div>
                </Campo>

                <Campo label="Tipo de contribuicao *" erro={erros.tipo} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TIPOS_CONTRIBUICAO.map((t) => {
                      const sel = contribuicaoAtual.tipo === t.valor;
                      return (
                        <button key={t.valor}
                          onClick={() => { setContribuicaoAtual({ ...contribuicaoAtual, tipo: t.valor }); setErros({ ...erros, tipo: null }); }}
                          style={{
                            padding: "8px 14px",
                            border: `2px solid ${sel ? lei.cor : C.cinzaBorda}`,
                            background: sel ? lei.cor : C.branco,
                            color: sel ? (lei.id === "parcelamento" ? C.preto : C.branco) : C.cinzaMed,
                            fontSize: 13, fontWeight: sel ? "bold" : "normal",
                            cursor: "pointer",
                            transition: "all 0.12s",
                          }}>{t.label}</button>
                      );
                    })}
                  </div>
                  {erros.tipo && <ErroCampo>{erros.tipo}</ErroCampo>}
                </Campo>

                {contribuicaoAtual.tipo && contribuicaoAtual.tipo !== "sem_contribuicao" && (
                  <>
                    <Campo label="Sugestao proposta *" erro={erros.sugestao} style={{ marginBottom: 14 }}>
                      <FTextarea
                        placeholder="Descreva sua sugestao de forma clara e objetiva. Indique a alteracao, inclusao, exclusao ou ajuste que propoe..."
                        value={contribuicaoAtual.sugestao} rows={4}
                        onChange={(v) => { setContribuicaoAtual({ ...contribuicaoAtual, sugestao: v }); setErros({ ...erros, sugestao: null }); }}
                        erro={erros.sugestao} />
                    </Campo>
                    <Campo label="Justificativa tecnica ou pratica (opcional)">
                      <FTextarea
                        placeholder="Explique os motivos da sua sugestao: por que a alteracao e necessaria? Quais problemas ela resolve?"
                        value={contribuicaoAtual.justificativa} rows={3}
                        onChange={(v) => setContribuicaoAtual({ ...contribuicaoAtual, justificativa: v })} />
                    </Campo>
                  </>
                )}

                <button onClick={adicionarContribuicao} style={{
                  marginTop: 16,
                  background: lei.cor,
                  color: lei.id === "parcelamento" ? C.preto : C.branco,
                  border: "none",
                  padding: "11px 24px",
                  fontSize: 14, fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  + Adicionar esta contribuicao
                </button>
              </div>

              <BotoesNav>
                <BotaoVoltar onClick={() => { setLeiSelecionada(null); setStep(STEP_SELECAO_LEI); }} label="Trocar lei" />
                <BotaoAvancar
                  cor={lei.cor}
                  label="Revisar e enviar"
                  disabled={contribuicoes.filter((c) => c.lei === leiSelecionada).length === 0}
                  onClick={() => setStep(STEP_REVISAO)}
                />
              </BotoesNav>
              {contribuicoes.filter((c) => c.lei === leiSelecionada).length === 0 && (
                <div style={{ fontSize: 13, color: C.vermelho, marginTop: 8 }}>
                  Adicione ao menos uma contribuicao para prosseguir.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════ REVISÃO ════════════════ */}
        {step === STEP_REVISAO && (
          <Card titulo="Revisao e envio das contribuicoes">
            <p style={{ color: C.cinzaMed, fontSize: 14, marginTop: 0, lineHeight: 1.6 }}>
              Confira seus dados e contribuicoes antes de enviar. Apos o envio voce podera comentar outras minutas.
            </p>

            {/* Identificacao */}
            <div style={{ background: C.cinzaClaro, border: `1px solid ${C.cinzaBorda}`, padding: "16px 20px", marginBottom: 20 }}>
              <Subtitulo>Participante</Subtitulo>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14 }}>
                <InfoItem label="Nome" value={identificacao.nome} />
                <InfoItem label="E-mail" value={identificacao.email} />
                {identificacao.telefone && <InfoItem label="Telefone" value={identificacao.telefone} />}
                {identificacao.bairro && <InfoItem label="Bairro/Localidade" value={identificacao.bairro} />}
                <InfoItem label="Perfil" value={identificacao.perfil} />
              </div>
            </div>

            {/* Contribuicoes */}
            {LEIS.map((l) => {
              const cs = contribuicoes.filter((c) => c.lei === l.id);
              if (cs.length === 0) return null;
              return (
                <div key={l.id} style={{ marginBottom: 16 }}>
                  <div style={{
                    background: l.cor, color: l.id === "parcelamento" ? C.preto : C.branco,
                    padding: "10px 16px", fontWeight: "bold", fontSize: 14,
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{
                      background: "rgba(0,0,0,0.15)", padding: "2px 8px",
                      fontSize: 12, fontWeight: "900",
                    }}>{l.sigla}</span>
                    {l.nome} — {cs.length} contribuicao{cs.length !== 1 ? "oes" : ""}
                  </div>
                  <div style={{ border: `1px solid ${l.cor}44`, borderTop: "none" }}>
                    {cs.map((c, i) => (
                      <div key={c.id} style={{
                        padding: "14px 16px",
                        borderBottom: i < cs.length - 1 ? `1px solid ${l.cor}22` : "none",
                        background: i % 2 === 0 ? C.branco : l.corClara,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <span style={{ fontWeight: "bold", color: l.corEsc, fontSize: 14 }}>
                              {c.tema === "Outro (especificar)" ? c.temaOutro : c.tema}
                            </span>
                            {c.artigo && <span style={{ color: C.cinzaMed, fontSize: 13 }}> · Art. {c.artigo}</span>}
                            <div style={{ fontSize: 12, color: C.cinzaMed, marginTop: 2 }}>
                              {TIPOS_CONTRIBUICAO.find((t) => t.valor === c.tipo)?.label}
                            </div>
                          </div>
                          <button onClick={() => removerContribuicao(c.id)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: C.vermelho, fontSize: 18, padding: "0 4px",
                          }}>x</button>
                        </div>
                        {c.sugestao && <div style={{ fontSize: 13, color: C.cinzaEsc, marginTop: 8, lineHeight: 1.6 }}>{c.sugestao}</div>}
                        {c.justificativa && (
                          <div style={{ fontSize: 12, color: C.cinzaMed, marginTop: 5, fontStyle: "italic", lineHeight: 1.5 }}>
                            <strong>Justificativa:</strong> {c.justificativa}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {contribuicoes.length === 0 && (
              <div style={{ color: C.vermelho, fontSize: 14, background: "#FEF2F2", border: `1px solid ${C.vermelho}44`, padding: "12px 16px", marginBottom: 16 }}>
                Nenhuma contribuicao adicionada. Volte e adicione ao menos uma contribuicao.
              </div>
            )}

            {erroEnvio && (
              <div style={{ background: "#FEF2F2", border: `1.5px solid ${C.vermelho}`, padding: "12px 16px", marginBottom: 14, color: C.vermelhoEsc, fontSize: 14 }}>
                {erroEnvio}
              </div>
            )}

            <BotoesNav>
              <BotaoVoltar onClick={() => setStep(STEP_CONTRIBUICAO)} label="Adicionar mais contribuicoes" />
              <BotaoAvancar
                label={enviando ? "Enviando..." : "Enviar participacao"}
                disabled={contribuicoes.length === 0 || enviando}
                onClick={handleEnviar}
              />
            </BotoesNav>
          </Card>
        )}

        {/* ════════════════ CONFIRMAÇÃO ════════════════ */}
        {step === STEP_CONFIRMACAO && (
          <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}` }}>
            <div style={{ background: C.vermelho, padding: "4px 0" }} />
            <div style={{ padding: "48px 40px", textAlign: "center" }}>
              <div style={{
                width: 64, height: 64,
                background: C.vermelho,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, color: C.branco, fontWeight: "bold",
                margin: "0 auto 20px",
              }}>✓</div>
              <h2 style={{ margin: "0 0 12px", color: C.preto, fontSize: 22, fontWeight: "900" }}>
                Participacao registrada com sucesso!
              </h2>
              <p style={{ color: C.cinzaMed, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 20px", fontSize: 15 }}>
                Obrigado(a) por contribuir com a revisao do Plano Diretor de Arabuta. {contribuicoes.length > 1 ? `Suas ${contribuicoes.length} contribuicoes foram registradas` : "Sua contribuicao foi registrada"} e serao analisadas pela equipe tecnica.
              </p>
              <div style={{
                display: "inline-block",
                background: C.cinzaClaro,
                border: `2px solid ${C.amarelo}`,
                padding: "10px 24px",
                marginBottom: 16,
                fontFamily: "monospace",
                fontSize: 17,
                color: C.preto,
                letterSpacing: "0.12em",
                fontWeight: "bold",
              }}>
                Protocolo: {protocolo}
              </div>
              <p style={{ color: C.cinzaMed, fontSize: 13, marginBottom: 32 }}>
                Guarde seu numero de protocolo. Contribuicoes registradas com o e-mail <strong>{identificacao.email}</strong>.
              </p>
              <button
                onClick={() => { setStep(STEP_SELECAO_LEI); setLeiSelecionada(null); }}
                style={{
                  background: C.branco,
                  border: `2px solid ${C.vermelho}`,
                  color: C.vermelho,
                  padding: "12px 28px",
                  fontSize: 14, fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Comentar outra lei
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── RODAPÉ ── */}
      <div style={{
        background: C.preto,
        borderTop: `4px solid ${C.vermelho}`,
        padding: "20px",
        textAlign: "center",
      }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.8 }}>
          Prefeitura Municipal de Arabuta · Santa Catarina<br />
          Consulta Publica — Revisao do Plano Diretor Municipal 2026<br />
          Realizado em parceria com FEPESE
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES AUXILIARES
// ─────────────────────────────────────────────────────────────────────────────

function Card({ titulo, children }) {
  return (
    <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}` }}>
      <div style={{
        background: C.cinzaEsc,
        borderLeft: `5px solid ${C.vermelho}`,
        padding: "18px 28px",
        color: C.branco,
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>{titulo}</div>
      <div style={{ padding: "28px 28px" }}>{children}</div>
    </div>
  );
}

function Subtitulo({ children }) {
  return (
    <div style={{
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: C.cinzaMed,
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: 18,
      borderBottom: `2px solid ${C.amarelo}`,
      paddingBottom: 4,
      display: "inline-block",
    }}>{children}</div>
  );
}

function Campo({ label, children, style, erro }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", color: erro ? C.vermelho : C.cinzaEsc, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </label>
      {children}
      {erro && <ErroCampo>{erro}</ErroCampo>}
    </div>
  );
}

function ErroCampo({ children }) {
  return <div style={{ fontSize: 12, color: C.vermelho, marginTop: 4 }}>{children}</div>;
}

function FInput({ value, onChange, placeholder, type = "text", erro }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "10px 12px",
        border: `1.5px solid ${erro ? C.vermelho : C.cinzaBorda}`,
        fontSize: 14, color: C.preto, background: C.branco, outline: "none",
        fontFamily: "Arial, sans-serif",
      }} />
  );
}

function FTextarea({ value, onChange, placeholder, rows = 3, erro }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "10px 12px",
        border: `1.5px solid ${erro ? C.vermelho : C.cinzaBorda}`,
        fontSize: 14, color: C.preto, background: C.branco,
        resize: "vertical", outline: "none", lineHeight: 1.6,
        fontFamily: "Arial, sans-serif",
      }} />
  );
}

function FSelect({ value, onChange, options, placeholder, cor, erro }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "10px 12px",
        border: `1.5px solid ${erro ? C.vermelho : cor ? `${cor}88` : C.cinzaBorda}`,
        fontSize: 14,
        color: value ? C.preto : C.cinzaMed,
        background: C.branco, outline: "none", cursor: "pointer",
        fontFamily: "Arial, sans-serif",
      }}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function FCheckbox({ checked }) {
  return (
    <div style={{
      width: 20, height: 20, flexShrink: 0, marginTop: 2,
      background: checked ? C.vermelho : C.branco,
      border: `2px solid ${checked ? C.vermelho : C.cinzaBorda}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: C.branco, fontSize: 13, fontWeight: "bold",
    }}>
      {checked && "✓"}
    </div>
  );
}

function BotoesNav({ children, style }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24, ...style }}>
      {children}
    </div>
  );
}

function BotaoVoltar({ onClick, label = "Voltar" }) {
  return (
    <button onClick={onClick} style={{
      background: C.branco,
      color: C.cinzaMed,
      border: `1.5px solid ${C.cinzaBorda}`,
      padding: "13px 20px",
      fontSize: 14, fontWeight: "bold",
      cursor: "pointer",
      textTransform: "uppercase", letterSpacing: "0.05em",
      fontFamily: "Arial, sans-serif",
    }}>
      &larr; {label}
    </button>
  );
}

function BotaoAvancar({ onClick, disabled, label = "Continuar", cor }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1,
      background: disabled ? C.cinzaBorda : cor || C.vermelho,
      color: cor === C.amarelo ? C.preto : C.branco,
      border: "none",
      padding: "13px 24px",
      fontSize: 15, fontWeight: "bold",
      cursor: disabled ? "not-allowed" : "pointer",
      textTransform: "uppercase", letterSpacing: "0.05em",
      opacity: disabled ? 0.6 : 1,
      fontFamily: "Arial, sans-serif",
    }}>
      {label} &rarr;
    </button>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.cinzaMed, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: 14, color: C.preto, marginTop: 2, fontWeight: "500" }}>{value}</div>
    </div>
  );
}
