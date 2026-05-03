# KmChain — Histórico de Quilometragem em Blockchain

> Protótipo desenvolvido como Trabalho de Conclusão de Curso do Bacharelado em Sistemas de Informação do IFES Campus Cachoeiro de Itapemirim.
>
> **Autora:** Lorrayne Amorim Fernandes da Cunha  
> **Orientador:** Prof. Dr. João Paulo de Brito Gonçalves  
> **Ano:** 2026

---

## Acesse o sistema

O sistema está hospedado gratuitamente no GitHub Pages e pode ser acessado por qualquer pessoa, em qualquer dispositivo, sem instalação:

🔗 **https://lorrayne-amorim.github.io/tcc-quilometragem**

---

## Chassi para teste

Utilize o chassi abaixo para testar a consulta pública sem precisar cadastrar nada:

9LXKGPZT45YUR2540

> O sistema converte automaticamente para maiúsculas. Acesse "Consulta Pública" e digite o chassi acima para ver o histórico registrado na blockchain.
> 
## Sobre o projeto

O KmChain é um sistema baseado em tecnologia Blockchain para garantir a autenticidade da quilometragem automotiva. Utilizando Smart Contracts na rede Ethereum Sepolia, o sistema permite que entidades credenciadas (como oficinas mecânicas, concessionárias, vistorias) registrem a quilometragem de veículos de forma imutável e auditável, impedindo fraudes de hodômetro.

**Endereço do contrato na Sepolia:**
```
0x34a284b45e5ae15aa44fa6dff299df06bb705e04
```

Você pode verificar o contrato publicamente em:  
🔍 https://sepolia.etherscan.io/address/0x34a284b45e5ae15aa44fa6dff299df06bb705e04

---

## O que cada usuário pode fazer

### Qualquer pessoa — Consulta Pública
> Não precisa de cadastro, login ou MetaMask.

- Acesse o sistema pelo link acima
- Clique em **"Consulta Pública"**
- Digite o número do chassi do veículo
- Clique em **"Consultar"**
- O histórico completo de quilometragem será exibido diretamente da blockchain

### Entidade Credenciada — Painel Admin
> Requer login no Firebase + carteira MetaMask na rede Sepolia.

- Acesse o sistema e clique em **"Painel Admin"**
- Faça login com e-mail e senha cadastrados
- Conecte sua carteira MetaMask
- Registre a quilometragem do veículo pelo chassi
- A transação é confirmada na blockchain em segundos

---

## Como instalar a MetaMask (necessário apenas para registro)

A MetaMask é uma extensão gratuita do navegador que funciona como carteira digital na blockchain. Ela é necessária **somente** para entidades que vão registrar quilometragem.

**Passo a passo:**

1. Abra o Google Chrome
2. Acesse **metamask.io/download**
3. Clique em **"Install MetaMask for Chrome"**
4. Clique em **"Adicionar ao Chrome"** → **"Adicionar extensão"**
5. Clique no ícone da raposa laranja no canto superior direito
6. Clique em **"Criar uma nova carteira"**
7. Crie uma senha e anote as 12 palavras de recuperação em local seguro
8. Após criar a carteira, clique no nome da rede no topo e selecione **"Sepolia"**
   - Se Sepolia não aparecer, clique em **"Adicionar uma rede conhecida"** e procure por Sepolia

> ⚠️ A consulta pública **não requer MetaMask**. Qualquer pessoa pode consultar o histórico diretamente pelo navegador.

---

## Funcionalidades

- Consulta pública de histórico por chassi — sem login, sem MetaMask
- Login seguro com Firebase Authentication (e-mail e senha)
- Conexão com carteira MetaMask na rede Sepolia
- Registro de quilometragem por chassi (apenas entidades autorizadas)
- Validação incremental: o contrato rejeita automaticamente qualquer quilometragem menor que a última registrada
- Gerenciamento de entidades: o administrador pode autorizar ou revogar oficinas
- Rastreabilidade completa: cada registro contém chassi, quilometragem, data/hora e endereço da entidade responsável

---

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Smart Contract | Solidity 0.8.0+ |
| Rede Blockchain | Ethereum Sepolia (testnet) |
| IDE do contrato | Remix IDE |
| Interface web | React 18 + Vite |
| Comunicação blockchain | Ethers.js v6 |
| Autenticação | Firebase Authentication |
| Estilização | Tailwind CSS |
| Assinatura de transações | MetaMask |
| Hospedagem | GitHub Pages |

---

## Como rodar localmente

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) v18 ou superior
- [Git](https://git-scm.com/)
- Extensão [MetaMask](https://metamask.io/) no Chrome (apenas para testar o painel admin)

**1. Clone o repositório:**
```bash
git clone https://github.com/lorrayne-amorim/tcc-quilometragem.git
cd tcc-quilometragem
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

**4. Acesse no navegador:**
```
http://localhost:5173
```

---

## Como fazer o deploy

Para gerar o build e publicar no GitHub Pages:

```bash
npm run build
npm run deploy
```

O sistema ficará disponível em:
```
https://lorrayne-amorim.github.io/tcc-quilometragem
```

---

## Smart Contract

O contrato `HistoricoQuilometragem.sol` implementa as seguintes regras:

- **Validação incremental:** impede o registro de quilometragem menor que a última registrada
- **Controle de acesso:** apenas entidades cadastradas pelo administrador podem registrar
- **Consulta pública:** qualquer pessoa pode consultar o histórico sem autenticação
- **Rastreabilidade:** cada registro armazena chassi, quilometragem, timestamp do bloco e endereço da entidade

---

## Cenários de teste validados

| Cenário | Resultado |
|---|---|
| Registro válido (km crescente, entidade autorizada) | ✅ Confirmado na blockchain |
| Retrocesso de hodômetro (km menor que a última) | ✅ Rejeitado pelo contrato |
| Registro por entidade não autorizada | ✅ Bloqueado pelo modificador onlyAuthorized |
| Consulta pública do histórico por chassi | ✅ Funciona sem login e sem MetaMask |

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos como requisito parcial para obtenção do título de Bacharel em Sistemas de Informação pelo IFES Campus Cachoeiro de Itapemirim (2026).
