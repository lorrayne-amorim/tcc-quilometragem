import { useState } from 'react'
import { useContract } from '../hooks/useContract'

function parseRegistro(reg) {
  // Struct RegistroKm: quilometragem[0], timestamp[1], entidade[2], observacao[3]
  return {
    quilometragem: reg.quilometragem ?? reg[0],
    timestamp: reg.timestamp ?? reg[1],
    entidade: reg.entidade ?? reg[2],
    observacao: reg.observacao ?? reg[3],
  }
}

function formatData(timestamp) {
  if (!timestamp) return '—'
  return new Date(Number(timestamp) * 1000).toLocaleString('pt-BR')
}

function formatKm(km) {
  return Number(km).toLocaleString('pt-BR') + ' km'
}

function shortenAddress(addr) {
  if (!addr) return '—'
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export default function ConsultaPublica() {
  const [chassi, setChassi] = useState('')
  const [historico, setHistorico] = useState(null)
  const [chassiBuscado, setChassisBuscado] = useState('')
  const { loading, error, consultarHistorico } = useContract()

  async function handleBuscar(e) {
    e.preventDefault()
    const valor = chassi.trim().toUpperCase()
    if (!valor) return
    const resultado = await consultarHistorico(valor)
    setHistorico(resultado)
    setChassisBuscado(valor)
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Consulta de Histórico</h1>
        <p className="text-slate-400 text-sm">
          Digite o número do chassi para verificar o histórico de quilometragem registrado na blockchain Ethereum Sepolia.
          Nenhum login necessário.
        </p>
      </div>

      <form onSubmit={handleBuscar} className="flex gap-3 mb-8">
        <input
          type="text"
          value={chassi}
          onChange={(e) => setChassi(e.target.value)}
          placeholder="Ex: 9BWZZZ377VT004251"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={loading || !chassi.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-4 mb-6 text-sm">
          Erro ao consultar: {error}
        </div>
      )}

      {!loading && historico !== null && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-sm">Chassi </span>
              <span className="font-mono text-blue-400 font-semibold">{chassiBuscado}</span>
            </div>
            <span className="text-slate-500 text-sm">{historico.length} registro(s)</span>
          </div>

          {historico.length === 0 ? (
            <div className="text-center py-14 text-slate-500">
              <p className="text-lg mb-1">Nenhum registro encontrado</p>
              <p className="text-sm">Este chassi ainda não possui histórico na blockchain.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-left border-b border-slate-700">
                    <th className="px-5 py-3 font-medium">#</th>
                    <th className="px-5 py-3 font-medium">Data / Hora</th>
                    <th className="px-5 py-3 font-medium">Quilometragem</th>
                    <th className="px-5 py-3 font-medium">Entidade</th>
                    <th className="px-5 py-3 font-medium">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((reg, i) => {
                    const r = parseRegistro(reg)
                    return (
                      <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                        <td className="px-5 py-4 text-slate-500">{i + 1}</td>
                        <td className="px-5 py-4 text-slate-300">{formatData(r.timestamp)}</td>
                        <td className="px-5 py-4 text-white font-semibold">{formatKm(r.quilometragem)}</td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-blue-400" title={r.entidade}>
                            {shortenAddress(r.entidade)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{r.observacao || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-14 text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p>Consultando a blockchain...</p>
        </div>
      )}
    </main>
  )
}
