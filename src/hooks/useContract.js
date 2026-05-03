import { useState, useCallback } from 'react'
import { JsonRpcProvider, Contract } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract'

const PUBLIC_PROVIDER = new JsonRpcProvider('https://sepolia.gateway.tenderly.co')

export function useContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const consultarHistorico = useCallback(async (chassi) => {
    setError(null)
    setLoading(true)
    try {
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, PUBLIC_PROVIDER)
      return await contract.consultarHistorico(chassi)
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const registrarQuilometragem = useCallback(async (provider, chassi, km, observacao) => {
    setError(null)
    setLoading(true)
    try {
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.registrarQuilometragem(chassi, BigInt(km), observacao)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const autorizarEntidade = useCallback(async (provider, address) => {
    setError(null)
    setLoading(true)
    try {
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.autorizarEntidade(address)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const revogarEntidade = useCallback(async (provider, address) => {
    setError(null)
    setLoading(true)
    try {
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.revogarEntidade(address)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setError(err.reason || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, consultarHistorico, registrarQuilometragem, autorizarEntidade, revogarEntidade }
}