import { ref, onMounted } from 'vue'

const direccionWallet = ref(null)

export function useWallet() {
  async function conectarWallet() {
    if (window.ethereum) {
        try {
        const cuentas = await window.ethereum.request({ method: 'eth_requestAccounts' })
        direccionWallet.value = cuentas[0]
        localStorage.removeItem('walletDisconnected')
        } catch (e) {
        console.error('Error al conectar wallet:', e)
        }
    }
  }

  async function verificarWalletConectada() {
    const fueDesconectada = localStorage.getItem('walletDisconnected') === 'true'

    if (window.ethereum && !fueDesconectada) {
        const cuentas = await window.ethereum.request({ method: 'eth_accounts' })
        direccionWallet.value = cuentas.length > 0 ? cuentas[0] : null
    }
  }

  function desconectarWallet() {
    direccionWallet.value = null
    localStorage.setItem('walletDisconnected', 'true')
  }

  onMounted(verificarWalletConectada)

  return {
    direccionWallet,
    conectarWallet,
    desconectarWallet
  }
}