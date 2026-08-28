# CARLA

**Energia Inteligente: otimizando o consumo através da computação.**

Projeto desenvolvido para o hackathon de **Sustentabilidade Tecnológica**.

## O que é

CARLA é uma plataforma que ajuda empresas a decidir **quando** e **onde** rodar suas cargas
computacionais mais pesadas — treinamentos, processamento em lote, backups — para aproveitar os
momentos e regiões em que a energia elétrica no Brasil está mais limpa.

A ideia é simples: nem toda hora do dia, nem toda região do país, tem a mesma "cor" de energia.
Em certos horários e lugares, a rede está sendo abastecida principalmente por hidrelétrica, solar
ou eólica; em outros, entram em ação usinas térmicas, bem mais poluentes. Um datacenter que roda
no mesmo ritmo o dia inteiro, sem levar isso em conta, desperdiça a oportunidade de reduzir suas
emissões sem trocar uma linha de hardware — só ajustando *quando* e *onde* processa.

## O problema

Datacenters consomem energia em larga escala, e boa parte das tarefas que rodam neles não precisa
acontecer "agora": pode esperar algumas horas, ou até ser direcionada para outra região do país.
O Brasil tem uma das matrizes elétricas mais limpas do mundo, mas ela varia bastante — o Nordeste
tem sol e vento fortes de dia, o Sul e o Centro-Oeste têm base hidrelétrica estável, e em vários
lugares parte dessa energia limpa é até desperdiçada por falta de demanda ou de linhas de
transmissão (o chamado *curtailment*). CARLA usa um modelo preditivo pra transformar esses dados
em uma recomendação prática — e essa economia de carbono pode virar crédito de carbono, um
incentivo fiscal real para as empresas.

## Como funciona, em três passos

1. **Dados** — consumo da operação, clima por região e composição da matriz elétrica (hídrica,
   solar, eólica) de cada lugar do país.
2. **Modelo preditivo** — um motor de pontuação cruza esses sinais para estimar, hora a hora e
   região a região, onde e quando a energia está mais limpa, com um índice de confiança para cada
   previsão.
3. **Recomendação** — a saída vira ação: o melhor horário para rodar uma carga pesada, a melhor
   região para expandir ou migrar, e a estimativa de CO₂ evitado (e do crédito de carbono
   correspondente).

## O que dá pra fazer na plataforma

- **Dashboard** — para empresas que já têm um datacenter: acompanha o consumo da operação atual,
  mostra a intensidade de carbono da rede ao longo do dia, recomenda a melhor janela de horário
  para cargas pesadas e calcula o CO₂ evitado.
- **Mapa Regional** — um mapa interativo do Brasil com duas visões: a adequação de cada região
  para instalar um datacenter (clima, matriz limpa, disponibilidade hídrica e curtailment, mês a
  mês), e onde já existem datacenters em operação hoje, com informações de cada um.
- **Contato** — canal direto para falar com o time.

## Sobre os dados

Este é um projeto de hackathon: os números de consumo, matriz energética e datacenters existentes
são **simulados**, construídos a partir de fatos reais e conhecidos sobre a matriz elétrica
brasileira (como a força da Itaipu em Foz do Iguaçu, ou o curtailment eólico/solar no Nordeste),
mas não vêm de uma fonte de dados ao vivo. Uma versão de produção substituiria isso por dados reais
de operadores como o ONS ou serviços como o ElectricityMaps.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O projeto é construído com Next.js, React e
TypeScript.
