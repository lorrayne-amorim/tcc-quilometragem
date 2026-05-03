import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { Contract, isAddress } from 'ethers'
import { auth } from '../config/firebase'
import { useMetaMask } from '../hooks/useMetaMask'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract'

function getFirebaseError(code) {
  const msgs = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  }
  return msgs[code] || 'Erro ao fazer login. Tente novamente.'
}

// ─── Login Form ────────────────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, senha)
    } catch (err) {
      setError(getFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Painel Admin</h1>
        <p className="text-slate-400 text-sm mb-6">Faça login para acessar o painel.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ─── Connect Wallet ────────────────────────────────────────────────
function ConnectWallet({ user, connect, error, loading }) {
  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🦊
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Conectar MetaMask</h2>
        <p className="text-slate-400 text-sm mb-1">
          Logado como <span className="text-white">{user.email}</span>
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Conecte sua carteira na rede <span className="text-blue-400">Sepolia</span> para continuar.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          onClick={connect}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer mb-3"
        >
          {loading ? 'Conectando...' : 'Conectar MetaMask'}
        </button>
        <button
          onClick={() => signOut(auth)}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer"
        >
          Sair da conta
        </button>
      </div>
    </main>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────
function Dashboard({ user, account, provider, onDisconnect }) {
  const [tab, setTab] = useState('registrar')

  // Formulário registrar km
  const [formChassi, setFormChassi] = useState('')
  const [formKm, setFormKm] = useState('')
  const [formObs, setFormObs] = useState('')
  const [txLoading, setTxLoading] = useState(false)
  const [txResult, setTxResult] = useState(null)
  const [txError, setTxError] = useState(null)

  // Formulário gerenciar entidades
  const [formAddress, setFormAddress] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authResult, setAuthResult] = useState(null)
  const [authError, setAuthError] = useState(null)

  async function handleRegistrar(e) {
    e.preventDefault()
    setTxResult(null)
    setTxError(null)
    setTxLoading(true)
    try {
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.registrarQuilometragem(
        formChassi.trim().toUpperCase(),
        BigInt(formKm),
        formObs.trim()
      )
      await tx.wait()
      setTxResult(tx.hash)
      setFormChassi('')
      setFormKm('')
      setFormObs('')
    } catch (err) {
      setTxError(err.reason || err.message)
    } finally {
      setTxLoading(false)
    }
  }

  async function handleEntidade(acao) {
    if (!isAddress(formAddress)) return setAuthError('Endereço Ethereum inválido.')
    setAuthResult(null)
    setAuthError(null)
    setAuthLoading(true)
    try {
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = acao === 'autorizar'
        ? await contract.autorizarEntidade(formAddress)
        : await contract.revogarEntidade(formAddress)
      await tx.wait()
      setAuthResult({ acao, hash: tx.hash })
      setFormAddress('')
    } catch (err) {
      setAuthError(err.reason || err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <p className="font-mono text-blue-400 text-xs mt-0.5">{account}</p>
        </div>
        <button
          onClick={onDisconnect}
          className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-6">
        {[['registrar', 'Registrar Km'], ['entidades', 'Gerenciar Entidades']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Registrar Km */}
      {tab === 'registrar' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="font-semibold text-white mb-4">Registrar Quilometragem</h2>
          <form onSubmit={handleRegistrar} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nº do Chassi</label>
              <input
                type="text"
                value={formChassi}
                onChange={(e) => setFormChassi(e.target.value)}
                required
                placeholder="9BWZZZ377VT004251"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Quilometragem (km)</label>
              <input
                type="number"
                value={formKm}
                onChange={(e) => setFormKm(e.target.value)}
                required
                min="0"
                placeholder="45000"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Observação</label>
              <textarea
                value={formObs}
                onChange={(e) => setFormObs(e.target.value)}
                rows={3}
                placeholder="Ex: Revisão de 45.000 km na concessionária"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600 resize-none"
              />
            </div>

            {txError && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm">
                {txError}
              </div>
            )}
            {txResult && (
              <div className="bg-green-900/30 border border-green-700 text-green-400 rounded-lg p-3 text-sm">
                ✓ Registrado com sucesso!
                <a
                  href={`https://sepolia.etherscan.io/tx/${txResult}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-mono text-xs mt-1 text-green-500 hover:underline truncate"
                >
                  {txResult}
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={txLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {txLoading ? 'Aguardando confirmação na MetaMask...' : 'Registrar na Blockchain'}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Gerenciar Entidades */}
      {tab === 'entidades' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="font-semibold text-white mb-1">Gerenciar Entidades</h2>
          <p className="text-slate-400 text-sm mb-4">
            Autorize ou revogue entidades habilitadas a registrar quilometragem.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Endereço da Entidade</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>

            {authError && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm">
                {authError}
              </div>
            )}
            {authResult && (
              <div className="bg-green-900/30 border border-green-700 text-green-400 rounded-lg p-3 text-sm">
                ✓ Entidade {authResult.acao === 'autorizar' ? 'autorizada' : 'revogada'} com sucesso!
                <a
                  href={`https://sepolia.etherscan.io/tx/${authResult.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-mono text-xs mt-1 text-green-500 hover:underline truncate"
                >
                  {authResult.hash}
                </a>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleEntidade('autorizar')}
                disabled={authLoading || !formAddress}
                className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {authLoading ? 'Processando...' : 'Autorizar'}
              </button>
              <button
                onClick={() => handleEntidade('revogar')}
                disabled={authLoading || !formAddress}
                className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {authLoading ? 'Processando...' : 'Revogar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ─── Admin root ───────────────────────────────────────────────────
export default function Admin() {
  const [user, setUser] = useState(undefined)
  const { account, provider, connect, error: walletError, loading: walletLoading, disconnect } = useMetaMask()

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u ?? null))
  }, [])

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return <LoginForm />

  if (!account) return <ConnectWallet user={user} connect={connect} error={walletError} loading={walletLoading} />

  return (
    <Dashboard
      user={user}
      account={account}
      provider={provider}
      onDisconnect={() => { signOut(auth); disconnect() }}
    />
  )
}
