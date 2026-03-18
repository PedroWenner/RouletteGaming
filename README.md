# Lucky Spin Roulette - IEAD Belvedere Edition 🎡

Este projeto é uma aplicação desktop profissional para sorteios numéricos, desenvolvida com uma arquitetura robusta de múltiplos agentes.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop Runtime**: Electron 28
- **Build System**: Vite 5
- **Testes**: Vitest
- **Arquitetura**: Modular (Core Engine Independente)

## ✨ Funcionalidades

- **Range Personalizável**: Defina o número mínimo e máximo para o sorteio.
- **Animação Premium**: Efeito visual de rotação estilo "Slot Machine".
- **Efeito Sonoro**: Som de "Jackpot" ao revelar o vencedor.
- **Histórico**: Painel com os últimos 20 resultados sorteados.
- **Acessibilidade**: Suporte a atalhos de teclado (Enter para girar, Esc para resetar).

## 📂 Estrutura do Projeto

- `src/core/`: Motor da roleta (lógica pura em TypeScript).
- `src/renderer/`: App React (Interface do usuário).
- `src/main/`: Configurações do processo principal do Electron.
- `src/shared/`: Modelos e tipos compartilhados.

## 🛠️ Como Executar

### Pré-requisitos
- Node.js (v18+)
- npm

### Instalação
```bash
npm install
```

### Desenvolvimento
Para rodar a interface:
```bash
npm run dev
```

Para rodar o modo desktop (com Electron):
```bash
npm start
```

### Compilação e Empacotamento
Para gerar os arquivos de produção:
```bash
npm run build
```

Para gerar o instalador Windows (.exe):
```bash
npm run package
```

## 🆕 Últimas Atualizações

- **Sistema de Temas**: Suporte a Temas Claro (otimizado para Datashow) e Escuro.
- **Layout Widescreen**: Novo posicionamento horizontal da roleta e resultados para evitar rolagem.
- **Gestão de Salas**: Edição dinâmica de nomes de salas e ranking automatizado de presença e ofertas.
- **Nome Oficial**: Aplicativo renomeado para **IEAD Roleta**.
- **Testes Unitários**: Integração do **Vitest** para garantir a confiabilidade do motor da roleta (`src/core`).
- **Build de Distribuição**: O instalador oficial (`.exe`) é gerado agora em `dist/installers/`.
- **Áudio e Visual**: Adicionado efeito sonoro de Jackpot e animação premium de slot machine.
