# CARLA

**Energia Inteligente: otimizando o consumo através da computação.**

Projeto desenvolvido para o hackathon de **Sustentabilidade Tecnológica**.

> *Sem trocar uma única linha de hardware, CARLA transforma dados de clima e matriz elétrica em
> decisão de agendamento — e ajuda cada carga computacional pesada a rodar na hora e no lugar em
> que o Brasil está queimando menos carbono.*

## Sumário

- [O que é](#o-que-é)
- [O problema](#o-problema)
- [A solução: como funciona](#a-solução-como-funciona)
- [Funcionalidades](#funcionalidades)
- [Sobre os dados e o modelo](#sobre-os-dados-e-o-modelo)
- [Roadmap: do MVP ao produto](#roadmap-do-mvp-ao-produto)
- [Stack técnica](#stack-técnica)
- [Rodando localmente](#rodando-localmente)
- [Contato](#contato)

## O que é

CARLA é uma plataforma que ajuda empresas a decidir **quando** e **onde** rodar suas cargas
computacionais mais pesadas — treinamentos, processamento em lote, backups — para aproveitar os
momentos e as regiões em que a energia elétrica no Brasil está mais limpa.

A analogia mais simples: é como programar a máquina de lavar para rodar quando o sol está a pino e
a energia solar está sobrando em casa — só que em escala de datacenter, olhando o país inteiro.
Muitas tarefas não precisam rodar "agora": um treinamento de IA, um backup, um processamento em
lote podem esperar algumas horas, ou rodar em outra região. CARLA identifica essa janela.

## O problema

Datacenters consomem energia (e água, para resfriamento) em larga escala, e nem toda hora do dia —
nem toda região do país — tem a mesma "cor" de energia:

- O Brasil tem uma das matrizes elétricas mais limpas do mundo, majoritariamente renovável, mas ela
  varia bastante: o **Nordeste** tem sol e vento fortes de dia, o **Sul** e o **Centro-Oeste** têm
  base hidrelétrica estável, o **Norte** depende de grandes hidrelétricas isoladas.
- Em vários momentos, o sistema interligado nacional aciona **usinas térmicas** — bem mais
  poluentes — para atender picos de demanda, especialmente no chamado **horário de ponta**
  (18h–21h), quando a tarifa também fica mais cara.
- Ao mesmo tempo, em regiões como o Nordeste, parte da energia limpa já gerada é **desperdiçada**
  por falta de demanda ou de linhas de transmissão suficientes — o fenômeno conhecido como
  **curtailment**. É capacidade limpa pronta, sobrando, sem uso.

Uma empresa que roda suas cargas no mesmo ritmo o dia inteiro, sem levar nada disso em conta,
desperdiça a chance de reduzir emissões sem comprar nenhum equipamento novo — só ajustando *quando*
e *onde* processa. E essa economia de carbono pode virar **crédito de carbono**, um incentivo
fiscal real para empresas no Brasil.

## A solução: como funciona

1. **Dados** — consumo da operação, clima por região e composição da matriz elétrica (hidrelétrica,
   solar, eólica) de cada lugar do país alimentam o modelo.
2. **Modelo de pontuação** — um motor de scoring pondera múltiplos fatores para estimar, mês a mês
   e região a região, o quão favorável é cada lugar:
   - **Energia limpa** — participação de hidrelétrica, solar e eólica na matriz local
   - **Curtailment** — quanta energia limpa já é gerada ali e hoje é desperdiçada (mais
     curtailment = mais capacidade "de graça" disponível pra novas cargas)
   - **Resfriamento** — clima da região, quanto mais próximo do ideal para *free cooling*, melhor
   - **Disponibilidade hídrica** — água é um recurso crítico pro resfriamento de datacenters
   
   Cada previsão sai com um **índice de confiança** (mais alto quando uma fonte claramente domina
   a matriz local) e a **fonte dominante** (hídrica, solar ou eólica).
3. **Recomendação** — a saída vira ação prática: a melhor janela de horário para rodar cargas
   pesadas no dashboard, a melhor região pra expandir ou migrar no mapa, e a estimativa de CO₂
   evitado (e do crédito de carbono correspondente) calculada pela diferença real de intensidade de
   carbono entre o horário mais sujo e o mais limpo do dia — não uma média genérica da rede.

## Funcionalidades

- **Dashboard** — para empresas que já têm um datacenter: escolhe estado e cidade (o consumo e a
  intensidade de carbono variam bastante por região), acompanha o consumo da operação e a
  intensidade de carbono da rede ao longo do dia, recebe a recomendação de melhor horário para
  cargas pesadas, vê a oportunidade de expansão se houver uma região mais favorável no mês, e
  calcula o CO₂ evitado / crédito de carbono estimado.
- **Mapa Regional** — mapa interativo do Brasil (zoom, arrastar, clicar em estados e marcadores)
  com duas visões:
  - *Adequação por região* — o score do modelo por estado, mês a mês, com ranking das cidades
    candidatas a receber um novo datacenter (cada uma com foto real do lugar);
  - *Datacenters no Brasil* — onde já existem datacenters em operação hoje (podendo haver mais de
    um na mesma região), com capacidade e uso de cada um, e um ranking pela nota da região onde
    estão.
- **Contato** — canal direto para falar com o time.

## Sobre os dados e o modelo

Este é um projeto de hackathon — vale ser claro sobre o que é real e o que é simulado.

**O que está de fato implementado e rodando:** a fórmula de pontuação por região (energia limpa,
curtailment, resfriamento, água, com pesos definidos), o cálculo do índice de confiança e da fonte
dominante, a curva diária de intensidade de carbono por região (incluindo o horário de ponta
nacional), e o cálculo de CO₂ evitado pela diferença real entre horário sujo e limpo. Nada disso é
maquiagem de slide — é código rodando no produto que você está usando.

**O que é simulado:** os números de consumo de uma operação, a composição exata da matriz elétrica
por cidade, e o catálogo de datacenters existentes (nomes, capacidade e uso) são **dados
ilustrativos**, construídos a partir de fatos públicos e conhecidos sobre a matriz brasileira — a
força da hidrelétrica de Itaipu em Foz do Iguaçu, o curtailment eólico documentado no Rio Grande do
Norte, o horário de ponta das 18h–21h — mas não vêm de uma integração ao vivo com uma fonte de
dados real. O ranking de datacenters hoje reflete só a nota da região onde cada um está; ainda não
avalia capacidade disponível, encaixe da carga ou distância até a origem dos dados — isso está no
roadmap, não no produto atual.

## Roadmap: do MVP ao produto

O núcleo já está provado: a cadeia clima → matriz energética → score → recomendação roda de ponta a
ponta. Para virar produto, os próximos passos seriam:

- Trocar a fórmula simulada de matriz e consumo por dados reais do grid — o **ONS** (Operador
  Nacional do Sistema Elétrico) publica geração por fonte e por região; serviços como o
  **ElectricityMaps** também cobrem o Brasil com intensidade de carbono em tempo real.
- Evoluir o ranking de datacenters existentes para um motor de match de verdade: um **portão de
  viabilidade** (a carga cabe na capacidade livre daquele datacenter?) antes de pontuar por
  carbono, encaixe de uso e localidade dos dados.
- Conectar a recomendação de horário a um orquestrador de tarefas real (Kubernetes, Airflow,
  Slurm), em vez de só sugerir.
- Adicionar as peças de produção: retreino periódico do modelo com dados históricos, autenticação,
  e um plano B para quando a fonte de dados externa cair.

## Stack técnica

Next.js (App Router) + React + TypeScript, Tailwind CSS para estilo, Recharts para os gráficos, e
`d3-geo` / `d3-zoom` para o mapa interativo do Brasil (GeoJSON dos estados, simplificado a partir de
dados do IBGE).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Contato

- E-mail: [contato@carla.eco](mailto:contato@carla.eco)
- Formulário de contato: disponível na página `/contato` da própria plataforma
<!-- - Demo ao vivo: adicionar aqui a URL da Vercel quando o deploy estiver no ar -->

