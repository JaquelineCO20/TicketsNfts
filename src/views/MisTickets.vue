<script setup>
import Navbar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const tickets = ref([])
const direccionWallet = ref(null)

// Obtener wallet conectada al montar
async function checkWalletConnection() {
  if (window.ethereum) {
    const cuentas = await window.ethereum.request({ method: 'eth_accounts' })
    direccionWallet.value = cuentas.length > 0 ? cuentas[0] : null
  }
}
checkWalletConnection()

// Escuchar cambios de cuenta en MetaMask
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    direccionWallet.value = accounts.length > 0 ? accounts[0] : null
    if (direccionWallet.value) cargarTickets()
    else tickets.value = []
  })
}

// Función para cargar tickets del backend
async function cargarTickets() {
  if (!direccionWallet.value) {
    tickets.value = []
    return
  }
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/user/${direccionWallet.value}`)
    if (!res.ok) throw new Error('Error al obtener tickets')
    const data = await res.json()
    tickets.value = data.tickets || [] // Ajusta esta línea si el backend devuelve otro formato
  } catch (error) {
    console.error(error)
    tickets.value = []
  }
}

// Cargar tickets al montar si wallet ya está conectada
onMounted(() => {
  if (direccionWallet.value) {
    cargarTickets()
  }
})
</script>

<template>
  <div>
    <Navbar />
    <h2 style="padding: 20px">Mis Tickets</h2>

    <div v-if="!direccionWallet" style="padding: 1rem; color: red">
      <p class="fff">Conecta tu wallet para ver tus tickets.</p>
    </div>

    <div v-else>
      <div v-if="tickets.length === 0" style="padding: 1rem">
        <p class="fff">No tienes tickets comprados aún.</p>
      </div>

      <div v-else class="tickets-container">
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
          <h3>{{ ticket.eventName }}</h3>
          <p>Fecha: {{ ticket.date }}</p>
          <p>Zona: {{ ticket.zone }}</p>
          <p>Asiento: {{ ticket.seat }}</p>
          <p>Precio: {{ ticket.price }} ETH</p>
          <img :src="ticket.image" alt="Evento" style="width: 100%; border-radius: 8px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tickets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}
.ticket-card {
  background-color: #062c49;
  color: white;
  border-radius: 12px;
  padding: 1rem;
  width: 250px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.fff {
  color: #000000;
}
</style>