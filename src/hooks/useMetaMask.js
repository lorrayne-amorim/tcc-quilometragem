import { useState, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { SEPOLIA_CHAIN_ID, SEPOLIA_HEX } from '../config/contract'

export function useMetaMask() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const connect = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      if (!window.ethereum) throw new Error('MetaMask não encontrada. Instale a extensão.')

      const p = new BrowserProvider(window.ethereum)
      const network = await p.getNetwork()

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_HEX }],
        })
      }

      const accounts = await p.send('eth_requestAccounts', [])
      setProvider(p)
      setAccount(accounts[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setProvider(null)
  }, [])

  return { account, provider, error, loading, connect, disconnect }
}
