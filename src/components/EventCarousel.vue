<script setup>
import { ref, reactive, computed } from 'vue'
import EventCard from './EventCard.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const carousel = ref(null)
const scrollLeft = () => carousel.value.scrollBy({ left: -220, behavior: 'smooth' })
const scrollRight = () => carousel.value.scrollBy({ left: 220, behavior: 'smooth' })

const events = [
  {
    id: 1,
    title: 'LUIS MIGUEL',
    subtitle: 'Tour 2025',
    date: '15-DICIEMBRE-2025',
    image: '/src/assets/luis-miguel.jpg',
    price: '0.0008 ETH',
  },
  {
    id: 2,
    title: 'TAYLOR SWIFT',
    subtitle: 'THE ERAS TOUR',
    date: '13-OCTUBRE-2025',
    image: '/src/assets/taylor-swift.avif',
    price: '0.0010 ETH',
  },
  {
    id: 3,
    title: 'BAD BUNNY',
    subtitle: 'World Tour',
    date: '11-DICIEMBRE-2025',
    image: '/src/assets/bad-bunny.jpg',
    price: '0.0012 ETH',
  },
  {
    id: 4,
    title: 'LADY GAGA',
    subtitle: 'The Mayhem Ball',
    date: '6-MARZO-2025',
    image: '/src/assets/lady-gaga.jpeg',
    price: '0.0007 ETH',
  },
  {
    id: 5,
    title: 'SHAKIRA',
    date: '30-MAYO-2025',
    subtitle: 'WOLRD TOUR',
    image: '/src/assets/shakira.webp',
    price: '0.0009 ETH',
  },
  {
    id: 6,
    title: 'MORAT',
    subtitle: 'Asuntos Pendientes',
    date: '02-AGOSTO-2025',
    image: '/src/assets/morat.avif',
    price: '0.0006 ETH',
  },
]

const showModal = ref(false)
const showLoginModal = ref(false)

const selectedEvent = reactive({ title: '', subtitle: '', date: '', image: '', price: '' })

const zonas = [
  { id: 'platino', nombre: 'Platino', asientos: ['124', '125', '126', '132', '133', '134'] },
  {
    id: 'oro',
    nombre: 'Oro',
    asientos: ['105b', '106b', '107b', '127', '131', '118b', '119b', '120b'],
  },
  {
    id: 'plata',
    nombre: 'Plata',
    asientos: ['105e', '106e', '107e', '108b', '128', '129', '130', '117b', '118e', '119e', '120e'],
  },
  {
    id: 'butaca',
    nombre: 'Butaca',
    asientos: [
      '105g',
      '106g',
      '107g',
      '108e',
      '110b',
      '112b',
      '113b',
      '115b',
      '117e',
      '118g',
      '119g',
      '120g',
    ],
  },
  { id: 'cancha', nombre: 'Cancha General', asientos: ['Cancha General'] },
  {
    id: 'preferente',
    nombre: 'Preferente',
    asientos: [
      '105r',
      '106r',
      '107r',
      '108g',
      '109e',
      '110e',
      '111e',
      '112e',
      '113e',
      '114e',
      '115e',
      '116e',
      '117g',
      '118r',
      '119r',
      '120r',
    ],
  },
  {
    id: 'luneta',
    nombre: 'Luneta',
    asientos: ['108r', '109g', '110g', '111g', '112g', '113g', '114g', '115g', '116g', '117r'],
  },
  {
    id: 'lunetaEspecial',
    nombre: 'Luneta Especial',
    asientos: ['109r', '110r', '111r', '112r', '113r', '114r', '115r', '116r'],
  },
  { id: 'balcon', nombre: 'Balcón', asientos: ['407', '408', '409', '410', '411', '412', '413'] },
]

const zonaSeleccionada = ref('')
const asientoSeleccionado = ref('')
const asientosVendidos = reactive(new Set())

const direccionWallet = ref(null)

// Checa wallet conectada al montar
async function checkWalletConnection() {
  if (window.ethereum) {
    const cuentas = await window.ethereum.request({ method: 'eth_accounts' })
    direccionWallet.value = cuentas.length > 0 ? cuentas[0] : null
  }
}
checkWalletConnection()

// Escuchar cambios en cuentas de MetaMask para actualizar estado wallet
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    direccionWallet.value = accounts.length > 0 ? accounts[0] : null
  })
}

const isWalletConnected = computed(() => direccionWallet.value !== null)

async function connectWallet() {
  if (window.ethereum) {
    try {
      const cuentas = await window.ethereum.request({ method: 'eth_requestAccounts' })
      direccionWallet.value = cuentas[0]
      showLoginModal.value = false
    } catch {
      alert('Conexión cancelada o fallida')
    }
  } else {
    alert('MetaMask no está instalado')
  }
}

// Función para enviar la transacción de pago a MetaMask
async function payTicket(priceETH) {
  if (!direccionWallet.value) throw new Error('Wallet no conectada')

  const transactionParameters = {
    to: '0xf1D13E46fDf4Fe616fEEF543C9A9Dd8bBc3d7c16', // REEMPLAZA por dirección correcta
    from: direccionWallet.value,
    value: '0x' + (parseFloat(priceETH) * 1e18).toString(16), // Convertir ETH a wei en hex
  }

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  })

  return txHash
}

// Función que llama al backend para mintear el ticket
async function mintTicket(txHash) {
  const priceNumber = parseFloat(selectedEvent.price.replace(' ETH', ''))

  const payload = {
    wallet_address: direccionWallet.value,
    event_data: {
      eventName: selectedEvent.title,
      date: selectedEvent.date,
      zone: zonaSeleccionada.value,
      seat: asientoSeleccionado.value,
      price: priceNumber,
      txHash: txHash,
    },
  }

  try {
    const res = await fetch(`${BACKEND_URL}/tickets/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Error minteando ticket')
    await res.json()
  } catch (error) {
    throw error
  }
}

const openModal = (event) => {
  selectedEvent.title = event.title
  selectedEvent.subtitle = event.subtitle
  selectedEvent.price = event.price
  selectedEvent.date = event.date
  selectedEvent.image = event.image
  zonaSeleccionada.value = ''
  asientoSeleccionado.value = ''
  mensaje.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  zonaSeleccionada.value = ''
  asientoSeleccionado.value = ''
  mensaje.value = ''
  showLoginModal.value = false
}

const mensaje = ref('')

const asientosDisponibles = computed(() => {
  if (!zonaSeleccionada.value) return []
  const zona = zonas.find((z) => z.id === zonaSeleccionada.value)
  if (!zona) return []
  return zona.asientos
})

const isAsientoDisponible = (zonaId, asiento) => {
  return !asientosVendidos.has(`${zonaId}-${asiento}`)
}

const confirmarCompra = async () => {
  if (!zonaSeleccionada.value || !asientoSeleccionado.value) return
  if (!isWalletConnected.value) {
    showLoginModal.value = true
    return
  }
  const key = `${zonaSeleccionada.value}-${asientoSeleccionado.value}`
  if (asientosVendidos.has(key)) {
    mensaje.value = 'Este asiento ya está vendido, selecciona otro.'
    return
  }

  try {
    mensaje.value = 'Enviando transacción de pago...'
    const txHash = await payTicket(selectedEvent.price.replace(' ETH', ''))
    mensaje.value = 'Pago enviado. Transacción: ${txHash}. Minteando ticket...'

    asientosVendidos.add(key)

    await mintTicket(txHash)

    mensaje.value = 'Ticket minteado con éxito.'
  } catch (error) {
    mensaje.value = 'Error en compra: ' + error.message
  }
}

const cargarAsientos = () => {
  asientoSeleccionado.value = ''
}
</script>

<template>
  <div class="carousel-container">
    <button @click="scrollLeft">&#x276E;</button>
    <div class="carousel" ref="carousel">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :title="event.title"
        :subtitle="event.subtitle"
        :date="event.date"
        :price="event.price"
        :image="event.image"
        @select="openModal"
      />
    </div>
    <button @click="scrollRight">&#x276F;</button>

    <!-- Modal de compra -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2 class="titleee">{{ selectedEvent.title }}</h2>
        <h3 class="subtitleee">{{ selectedEvent.subtitle }}</h3>
        <p class="dateee">{{ selectedEvent.date }}</p>
        <p class="priceee">$ {{ selectedEvent.price }}</p>
        <div
          class="imggg"
          style="display: flex; flex-direction: row; justify-content: center; align-items: center"
        >
          <img
            :src="selectedEvent.image"
            alt="Evento"
            style="width: 200px; max-height: 300px; object-fit: cover"
          />
          <img src="/src/assets/arena-mty.jpg" alt="Mapa Arena Monterrey" class="map-image" />
        </div>

        <h3>Selecciona zona y asiento</h3>

        <label for="zona">Zona:</label>
        <select id="zona" v-model="zonaSeleccionada" @change="cargarAsientos">
          <option value="" disabled>Selecciona una zona</option>
          <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
            {{ zona.nombre }}
          </option>
        </select>

        <label for="asiento">Asiento:</label>
        <select id="asiento" v-model="asientoSeleccionado" :disabled="!zonaSeleccionada">
          <option value="" disabled>Selecciona un asiento</option>
          <option
            v-for="asiento in asientosDisponibles"
            :key="asiento"
            :value="asiento"
            :disabled="!isAsientoDisponible(zonaSeleccionada, asiento)"
          >
            {{ asiento }}
          </option>
        </select>

        <div class="modal-buttons">
          <button
            @click="confirmarCompra"
            :disabled="!asientoSeleccionado"
            style="background-color: greenyellow; border-radius: 9px; margin: 5px; padding: 5px"
          >
            <p id="22" style="font-size: large">Confirmar Compra</p>
          </button>
          <button
            @click="closeModal"
            style="background-color: red; border-radius: 9px; margin: 5px; padding: 5px"
          >
            <p id="33" style="font-size: large">Cerrar</p>
          </button>
        </div>

        <p
          v-if="mensaje"
          :style="{
            color: mensaje.includes('Debes conectar') ? 'red' : 'green',
            fontWeight: 'bold',
          }"
        >
          {{ mensaje }}
        </p>
      </div>
    </div>

    <!-- Modal para conectar wallet -->
    <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
      <div class="modal-content" style="text-align: center">
        <h3>Conecta tu wallet MetaMask</h3>
        <p>Debes iniciar sesión con MetaMask para poder comprar boletos.</p>
        <button
          @click="connectWallet"
          style="
            margin: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            background-color: #062c49;
            color: white;
          "
        >
          Conectar Wallet
        </button>
        <button @click="showLoginModal = false" style="padding: 0.5rem 1rem; border-radius: 5px">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #b6dbf9;
  padding: 1rem;
}
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  max-width: 90%;
}
button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #062c49;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
.map-image {
  width: 390px;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 1rem;
}
.titleee {
  font-size: x-large;
  font-weight: 900;
  color: #03304f;
}
.subtitleee {
  font-size: small;
  font-weight: 600;
}
.dateee {
  font-size: small;
  font-weight: 900;
  color: magenta;
}
.priceee {
  font-size: small;
  font-weight: 900;
  color: green;
}
</style>