PRD V2 — Plataforma de Pesquisa, Geração, Aprovação, Criativos e Distribuição Multicanal
1. Visão do produto

Desenvolver uma plataforma especialista em pesquisa, reaproveitamento de conteúdo, geração editorial, criação de peças visuais, aprovação e distribuição multicanal, permitindo que o usuário siga dois caminhos iniciais:

Pesquisar um assunto com base em fontes confiáveis.
Enviar um artigo pronto para uso integral, adaptação, expansão ou enriquecimento com novas pesquisas.

A partir disso, o sistema deve:

gerar um artigo-mestre;
derivar versões específicas para LinkedIn, Instagram, X e Facebook;
gerar criativos visuais adequados a cada rede;
permitir aprovação por e-mail;
usar n8n como camada de envio e automação;
integrar-se por webhooks com n8n e outros sistemas;
preparar o caminho para publicação automática futura nas redes sociais.
2. Objetivo do produto

Centralizar em um único sistema toda a cadeia de produção de conteúdo multicanal, desde a entrada do tema ou artigo-base até a geração de peças finais aprovadas e prontas para publicação ou integração.

Objetivos principais
reduzir o tempo de produção de conteúdo;
elevar a confiabilidade das pesquisas;
padronizar a adaptação por canal;
diminuir problemas com autenticação e entrega de e-mails;
permitir automação com governança;
gerar textos e criativos coerentes com cada rede;
criar uma base escalável para publicação futura automatizada.
3. Problema que o sistema resolve

Hoje, o fluxo de produção de conteúdo costuma estar fragmentado:

pesquisa em ferramentas soltas;
texto feito em um lugar;
imagens em outro;
aprovação por e-mail manual;
automações separadas;
dificuldade para respeitar particularidades de cada rede.

O produto resolve isso com uma cadeia única:

entrada → pesquisa/processamento → artigo-mestre → adaptação por rede → geração de criativos → aprovação → liberação → integração/publicação futura

4. Princípio arquitetural central
Decisão de produto

O app não deve ser o responsável direto por enviar e-mails.

O app será o núcleo editorial, de governança e orquestração.

O n8n será a camada operacional de entrega e automação, responsável por:

envio de e-mails;
reenvios;
notificações;
integrações auxiliares;
chamadas externas;
ações assíncronas.

Isso é especialmente vantajoso porque o n8n já suporta múltiplas formas de autenticação e integração com Gmail, SMTP e Microsoft Outlook, e a própria documentação destaca diferenças importantes entre provedores — por exemplo, Gmail com app password/SMTP e Outlook/Microsoft 365 com restrições a autenticação básica no fluxo de Send Email.

5. Escopo macro da solução

A solução passa a ter 13 grandes blocos:

Módulo de entrada
Módulo de pesquisa e grounding
Módulo de ingestão de artigo pronto
Módulo de geração editorial
Módulo de adaptação social
Módulo de criativos
Módulo de composição visual
Módulo de aprovação
Módulo de integração com n8n
Módulo de multi-API e fallback
Dashboard operacional
Auditoria, governança e segurança
Base para publicação automática futura
6. Requisitos funcionais
RF-01 — Triagem inicial de caminho

O sistema deve apresentar dois caminhos iniciais ao usuário:

Pesquisar assunto
Enviar artigo pronto
Regras
a escolha deve ocorrer logo no início do fluxo;
o sistema deve registrar a origem do job;
o dashboard deve exibir a origem do conteúdo.
RF-02 — Pesquisa guiada com fontes confiáveis

O usuário deve poder informar:

tema;
objetivo;
público-alvo;
idioma;
profundidade;
tom;
tamanho desejado;
instruções editoriais;
preferência por fontes específicas.
Regras
o sistema deve consultar provedores de busca configurados;
deve consolidar resultados;
deve ranquear confiabilidade;
deve guardar as referências utilizadas;
deve sinalizar a recência do conteúdo.
RF-03 — Upload, colagem ou URL de artigo pronto

O sistema deve aceitar:

texto colado;
upload de documento;
URL de artigo;
entrada vinda de webhook.
Regras
extrair e normalizar o texto;
identificar título, subtítulos e blocos;
permitir edição antes do processamento;
registrar a origem.
RF-04 — Modos de uso do artigo enviado

Ao enviar um artigo, o usuário poderá escolher:

usar integralmente;
resumir;
reescrever;
expandir;
adaptar para redes sociais;
usar como base para novas pesquisas.
Regras
o sistema deve registrar qual estratégia foi usada;
deve informar, quando aplicável, o que veio do artigo original e o que veio de nova pesquisa;
deve manter trilha de auditoria.
RF-05 — Geração do artigo-mestre

O sistema deve criar um artigo-mestre como fonte central do fluxo.

Estrutura mínima
título;
subtítulo opcional;
resumo;
corpo;
CTA opcional;
referências;
metadados editoriais.
Regras
o usuário pode editar antes de prosseguir;
o artigo-mestre é a base oficial de todas as derivações.
RF-06 — Menu de destinos sociais

Após a geração do artigo-mestre, o sistema deve exibir um menu com:

LinkedIn
Instagram
X
Facebook
Todos
Regras
o usuário pode escolher um ou vários canais;
cada canal deve receber adaptação própria;
“Todos” não significa copiar o mesmo texto para todos.
RF-07 — Sub-agents especialistas por rede

O sistema deve possuir sub-agents para:

LinkedIn
Instagram
X
Facebook
Função
adaptar tom;
ajustar estrutura;
sugerir CTA;
sugerir hashtags;
respeitar limites do canal;
preparar payloads futuros de publicação.

Isso é importante porque as plataformas têm formatos e fluxos distintos. O LinkedIn documenta APIs próprias para Posts, Images e Videos, incluindo estados como rascunho e processamento; o Instagram/Meta documenta publicação de imagem, vídeo, reels e carrossel; e o X mantém fluxo específico para upload de mídia e postagem.

RF-08 — Setup de aprovadores

O sistema deve permitir cadastrar até 5 aprovadores por fluxo ou workspace.

Campos
nome;
e-mail;
ordem;
obrigatório ou opcional;
ativo/inativo;
nível de decisão.
RF-09 — SLA de aprovação

O sistema deve permitir definir prazo de aprovação.

Regra default
24 horas, caso o usuário não informe outro prazo.
Após expiração

O sistema deve permitir configuração de política:

liberar no dashboard;
liberar para publicação automática futura;
voltar para revisão;
exigir decisão manual.
Recomendação de produto

O default mais seguro deve ser:
“liberar no dashboard para decisão final”.

RF-10 — Aprovação por e-mail via n8n

O envio de e-mails de aprovação deve ser feito pelo n8n, não pelo app.

Fluxo
app gera pacote;
app dispara webhook para n8n;
n8n envia os e-mails;
aprovador interage;
resposta retorna ao app;
dashboard é atualizado.
Ações do aprovador
aprovar;
rejeitar;
pedir ajustes;
aprovar com comentário.
RF-11 — Dashboard operacional

O dashboard deve conter, no mínimo:

Visão geral
rascunhos;
aguardando aprovação;
aprovados;
expirados;
liberados;
publicados;
rejeitados;
falhas.
Conteúdos
artigo-mestre;
versões sociais;
criativos gerados;
filtros e busca.
Aprovações
fila;
prazo;
aprovador;
status;
reenvio.
Integrações
n8n;
APIs;
webhooks;
redes sociais.
Redes sociais
contas conectadas;
status de token;
escopos;
última sincronização.
Auditoria
ações;
eventos;
falhas;
uso de APIs;
histórico de decisão.
RF-12 — Integração com n8n

O sistema deve ter integração nativa com n8n.

Casos de uso
envio de e-mails;
notificação de aprovação;
atualização de CRM/CMS;
recebimento de artigos via webhook;
envio de conteúdo final para outros sistemas;
automações auxiliares.
Requisitos
webhook de saída;
webhook de retorno;
segredo/HMAC;
logs;
retry policy;
idempotência.
RF-13 — Recebimento de dados via webhook

O sistema deve aceitar entrada externa com:

tema;
briefing;
artigo;
rede de destino;
prazo;
aprovadores;
metadados;
ID externo.
RF-14 — Emissão de webhooks de evento

O sistema deve enviar webhooks em eventos como:

job criado;
pesquisa concluída;
artigo-mestre concluído;
criativos concluídos;
enviado para aprovação;
aprovado;
rejeitado;
expirado;
liberado;
erro.
7. Módulo de criativos
RF-15 — Geração de criativos visuais

O sistema deve gerar criativos para mídias sociais, com dimensões adequadas ao destino.

Tipos
imagem única;
imagem com texto aplicado;
carrossel;
vídeo curto;
capa/thumbnail;
pacote multiformato.
RF-16 — Formatos por rede

O sistema deve preparar formatos adequados por canal.

LinkedIn
post com imagem;
carrossel/documento visual;
vídeo curto;
arte de capa.
Instagram
feed quadrado;
retrato;
stories;
capa de reel;
carrossel;
legenda.
X
post com imagem;
sequência com imagens;
arte com texto incorporado;
vídeo curto.
Facebook
post com imagem;
carrossel;
vídeo curto;
legenda adaptada.

O suporte programático a imagem, vídeo, reels e carrossel no Instagram/Facebook é oficialmente documentado pela Meta, e o LinkedIn já documenta suporte a posts com imagens e vídeos dentro da sua linha atual de APIs de conteúdo.

RF-17 — Aplicação de texto sobre imagem

O sistema deve permitir gerar imagens com texto sobreposto.

Elementos
headline;
subtítulo;
CTA;
marca;
rodapé;
identificação do canal.
Regras
respeitar área segura;
preservar legibilidade;
ajustar quebra de linha;
gerar variações com e sem texto;
permitir edição posterior.
RF-18 — Geração automática de carrossel

O sistema deve transformar um artigo ou resumo em carrossel.

Estrutura sugerida
capa;
problema;
contexto;
pontos-chave;
conclusão;
CTA final.
Regras
permitir editar slide a slide;
exportar como imagens individuais;
salvar como conjunto.
RF-19 — Geração de vídeos curtos

O sistema deve permitir gerar pequenos vídeos para redes sociais.

Entradas possíveis
artigo completo;
resumo;
tópicos;
roteiro gerado;
imagens e assets da marca.
Saída
vídeo vertical ou quadrado;
com legendas;
com transições simples;
com CTA final;
com capa.
Estratégia recomendada

No MVP, usar geração por template com motion simples, sem depender de editor avançado.

RF-20 — Biblioteca de templates

O sistema deve permitir uso de templates por:

rede social;
objetivo;
nicho;
estilo visual;
identidade da marca.
RF-21 — Gerenciador de assets

O sistema deve possuir um repositório de:

logos;
fontes;
cores;
fundos;
imagens base;
ícones;
trilhas e sons, no caso de vídeo.
RF-22 — Preview por rede

Antes da aprovação, o usuário deve visualizar como o conteúdo tende a ficar em cada canal.

Deve mostrar
texto;
imagem;
carrossel;
vídeo curto;
CTA;
hashtags;
variações.
8. Multi-API por função e fallback
RF-23 — Cadastro de múltiplas APIs por domínio de uso

O sistema deve permitir configurar múltiplos provedores para cada domínio:

Domínios
busca/pesquisa;
geração de texto;
geração de imagem;
geração de vídeo;
OCR/extração;
voz/narração futura;
entrega/automação.
RF-24 — Roteamento inteligente por API

O sistema deve possuir um API Router que escolha qual API usar conforme política configurada.

Estratégias
primária + fallback;
round-robin;
menor custo;
menor latência;
maior qualidade;
política por workspace;
política por tarefa.
RF-25 — Fallback automático

O sistema deve trocar automaticamente de provedor quando houver:

timeout;
indisponibilidade;
erro de autenticação;
limite de cota;
custo acima do permitido;
qualidade abaixo do mínimo.
RF-26 — Configuração por tipo de tarefa

Exemplos:

Busca
Brave
SerpApi
Perplexity
Texto
LLM A
LLM B
LLM C
Imagem
provedor A
provedor B
Vídeo
provedor A
provedor B
Entrega
n8n webhook A
n8n webhook B
RF-27 — Política de fallback configurável

O admin deve poder dizer algo como:

“se a API 1 falhar, use a 2”;
“se o custo passar de X, use a mais barata”;
“para vídeo, use apenas o provedor premium”;
“para jobs urgentes, priorize latência”.
RF-28 — Monitoramento de custo por job

O sistema deve registrar custo por:

pesquisa;
geração de texto;
imagem;
vídeo;
processamento total.
9. Setup e configuração
RF-29 — Aba de aprovação
aprovadores;
ordem;
SLA;
regra de expiração;
política após expiração.
RF-30 — Aba n8n / delivery
webhook de envio;
webhook de retorno;
segredo;
timeout;
retries;
ambientes.
RF-31 — Aba de APIs de busca
provedores;
chaves;
prioridade;
fallback;
limites.
RF-32 — Aba de APIs de texto
provedores;
parâmetros;
fallback;
política de custo.
RF-33 — Aba de APIs de imagem
provedores;
estilos;
resolução;
fallback.
RF-34 — Aba de APIs de vídeo
provedores;
templates;
duração máxima;
fallback.
RF-35 — Aba de redes sociais
LinkedIn;
Instagram;
Facebook;
X;
status de autenticação;
escopos;
expiração do token.
RF-36 — Aba de branding
logo;
cores;
fontes;
CTA padrão;
assinatura;
tom institucional.
10. Requisitos funcionais adicionais recomendados
RF-37 — Biblioteca de fontes confiáveis

Whitelist e blacklist de domínios.

RF-38 — Score de confiabilidade

Pontuação baseada em:

qualidade das fontes;
diversidade;
recência;
consistência.
RF-39 — Versionamento de conteúdo

Cada item deve ter:

número de versão;
autor;
data;
motivo da revisão.
RF-40 — Comparação entre versões

Visualização de diferenças entre textos e peças.

RF-41 — Detecção de duplicidade interna

Alertar semelhança excessiva com conteúdo anterior.

RF-42 — Modo rascunho humano + IA

Comandos como:

melhorar;
resumir;
deixar técnico;
adaptar para rede X;
criar carrossel;
criar vídeo curto.
RF-43 — Agendamento futuro

Mesmo que a publicação automática entre depois, o sistema deve prever:

publicar já;
agendar;
apenas aprovar e guardar.
11. Requisitos não funcionais
RNF-01 — Segurança
criptografia de credenciais;
TLS;
cofre de segredos;
assinatura de webhooks;
segregação por tenant.
RNF-02 — Auditoria
registro de toda ação;
trilha de aprovação;
logs de integração;
logs de fallback.
RNF-03 — Escalabilidade
filas assíncronas;
workers;
arquitetura orientada a eventos;
multi-tenant.
RNF-04 — Resiliência
retry;
backoff;
circuit breaker;
fallback de APIs;
fallback de entrega.
RNF-05 — Observabilidade
logs estruturados;
métricas;
tracing;
alertas.
RNF-06 — Performance
resposta rápida no dashboard;
jobs longos em background;
atualização de status em tempo real.
12. Perfis de usuário
Admin
configura sistema;
gerencia integrações;
define políticas;
acessa auditoria.
Editor
cria, revisa e envia conteúdos.
Aprovador
aprova, rejeita ou comenta.
Operador de automação
integra com n8n;
monitora webhooks;
ajusta fluxos operacionais.
Auditor
consulta histórico, evidências e logs.
13. Fluxos principais
Fluxo A — Pesquisa do zero
usuário escolhe pesquisar assunto;
informa parâmetros;
Search Orchestrator pesquisa;
fontes são ranqueadas;
artigo-mestre é gerado;
usuário escolhe redes;
sub-agents geram cópias por canal;
Creative Studio gera criativos;
pacote vai para aprovação;
app envia webhook ao n8n;
n8n envia e-mails;
respostas retornam ao app;
dashboard é atualizado.
Fluxo B — Artigo pronto
usuário envia artigo;
escolhe modo de uso;
artigo é processado;
artigo-mestre é gerado ou normalizado;
sistema cria versões sociais;
sistema cria criativos;
segue para aprovação.
Fluxo C — Integração externa
n8n ou sistema externo envia webhook;
app cria job;
conteúdo é processado;
evento de retorno é enviado;
se configurado, fluxo segue para aprovação.
14. Arquitetura lógica recomendada
Camadas
Frontend / Dashboard
interface do usuário;
preview;
setup;
revisão.
API Gateway
autenticação;
roteamento;
multi-tenant.
Orchestrator
coordena os módulos internos.
Search Orchestrator
pesquisa;
ranking;
grounding.
Content Engine
artigo-mestre;
variantes textuais.
Social Adaptation Engine
versões por canal.
Creative Studio
peças visuais;
carrosséis;
vídeos curtos.
Media Composition Engine
montagem de layouts;
overlay de texto;
export.
Approval Manager
regras de SLA;
estados;
callbacks de aprovação.
API Router
múltiplas APIs;
fallback;
custo;
políticas.
Integration Hub
webhooks;
n8n;
eventos externos.
Audit & Compliance Service
logs;
trilhas;
evidências.
Infra
banco;
filas;
storage;
cache.
15. Entidades principais do modelo de dados
Workspace
User
ContentJob
SourceRecord
MasterArticle
SocialVariant
CreativeAsset
CarouselPack
VideoAsset
ApprovalFlow
Approver
ApprovalAction
IntegrationEndpoint
ApiProvider
ApiRoutingPolicy
CredentialVaultRef
AuditLog
16. Regras de negócio
RB-01

O artigo-mestre é sempre a base principal das derivações.

RB-02

Cada rede recebe adaptação própria.

RB-03

A expiração default é 24 horas.

RB-04

Após expiração, o default é liberar no dashboard, não publicar sozinho.

RB-05

Máximo de 5 aprovadores por fluxo.

RB-06

O envio de e-mails é feito pelo n8n.

RB-07

Credenciais nunca ficam expostas em texto puro.

RB-08

Toda troca de API por fallback deve ser registrada.

RB-09

Criativos devem manter vínculo com o artigo-mestre e com a variante social correspondente.

17. Roadmap sugerido
Fase 1 — MVP forte
triagem dos dois caminhos;
pesquisa multi-provider;
artigo-mestre;
adaptação para redes;
aprovação via n8n;
dashboard;
webhooks;
auditoria básica;
geração de imagem única e carrossel simples.
Fase 2
multi-API completa;
fallback por política;
overlay de texto;
templates de branding;
preview avançado;
score de confiabilidade;
controle de custo.
Fase 3
vídeos curtos;
publicação automática social;
agendamento;
analytics por rede;
calendário editorial.
18. MVP recomendado de verdade

Eu recomendo que o MVP tenha:

entrada por tema ou artigo;
até 3 APIs de busca;
2 APIs de texto;
1 ou 2 APIs de imagem;
app + n8n integrados;
aprovação por e-mail via n8n;
artigo-mestre;
versões para LinkedIn, Instagram, X e Facebook;
geração de imagem e carrossel;
dashboard;
setup completo;
webhooks;
auditoria.

E deixaria para a fase seguinte:

vídeo curto avançado;
publicação social automática;
analytics de performance social.
19. Métricas de sucesso
Produto
tempo médio por job;
taxa de aprovação;
taxa de retrabalho;
uso por rede;
uso de criativos.
Operação
falhas por API;
uso de fallback;
falhas de webhook;
tempo de entrega via n8n;
custo médio por job.
Negócio
conteúdos por cliente/mês;
retenção;
expansão por workspace;
uso de integrações.
20. Principais riscos
Dependência de APIs externas

Mitigar com multi-provider e fallback.

Diferenças entre redes sociais

Mitigar com sub-agents e conectores dedicados por plataforma. O cenário atual das APIs reforça que LinkedIn, Meta/Instagram/Facebook e X precisam ser tratados separadamente, porque os fluxos e capacidades não são homogêneos.

Problemas de autenticação de e-mail

Mitigar usando n8n como camada de entrega, desacoplando isso do core. A documentação do n8n mostra requisitos e diferenças reais entre Gmail, SMTP genérico e Outlook/Microsoft.

Custo operacional

Mitigar com roteamento por custo, fallback e cache.

Conteúdo fraco ou mal fundamentado

Mitigar com score de confiabilidade, ranking de fontes e revisão humana.

21. Resumo executivo final

A versão 2 do produto evolui de um gerador de artigos para uma plataforma editorial multicanal com automação operacional, aprovação, criativos e governança. O app passa a ser o cérebro editorial e de compliance, enquanto o n8n assume a camada prática de entrega e automação. O sistema aceita tema ou artigo pronto, pesquisa com múltiplas APIs, gera artigo-mestre, adapta o conteúdo para LinkedIn, Instagram, X e Facebook, cria imagens, carrosséis e vídeos curtos, envia para aprovação via n8n e deixa tudo pronto para publicação futura com integração oficial por plataforma. Esse desenho está mais alinhado com a realidade das APIs sociais e com os desafios práticos de autenticação, fallback e operação.
