<script setup>
import Navbar from '../components/NavBar.vue'
import { ref, onMounted, watch } from 'vue'
import { useWallet } from '../composables/useWallet'

const { direccionWallet } = useWallet()
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const tickets = ref([])

// Mapea nombres de evento a imagenes locales (igual que en EventCarousel)
function getImageForEvent(eventName) {
  const mapImages = {
    'LUIS MIGUEL': '/src/assets/luis-miguel.jpg',
    'TAYLOR SWIFT': '/src/assets/taylor-swift.avif',
    'BAD BUNNY': '/src/assets/bad-bunny.jpg',
    'LADY GAGA': '/src/assets/lady-gaga.jpeg',
    'SHAKIRA': '/src/assets/shakira.webp',
    'MORAT': '/src/assets/morat.avif',
  }
  return mapImages[eventName] || '/src/assets/default-event.jpg' // Imagen por defecto si no encuentra
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

    // Asignar imagen a cada ticket según su evento, si no viene la imagen
    tickets.value = (data.tickets || []).map(t => ({
      ...t,
      image: t.image || getImageForEvent(t.eventName)
    }))
  } catch (error) {
    console.error(error)
    tickets.value = []
  }
}

// Cargar tickets cuando cambia la wallet
watch(direccionWallet, (newVal) => {
  if (newVal) cargarTickets()
  else tickets.value = []
})

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
    <h2 style="padding: 20px; color: #062c49; font-weight: bold;">Mis Tickets</h2>

    <div v-if="!direccionWallet" style="padding: 1rem; color: red">
      <p>Conecta tu wallet para ver tus tickets.</p>
    </div>

    <div v-else>
      <div v-if="tickets.length === 0" style="padding: 1rem; color: #062c49;">
        <p>No tienes tickets comprados aún.</p>
      </div>

      <div v-else class="tickets-container">
        <div v-for="ticket in tickets" :key="ticket.id || ticket.txHash || ticket.seat" class="ticket-card">
          <img :src="ticket.image" alt="Evento" class="ticket-image" />
          <h3>{{ ticket.eventName }}</h3>
          <p>{{ ticket.subtitle || '' }}</p>
          <p>Fecha: {{ ticket.date }}</p>
          <p>Zona: {{ ticket.zone }}</p>
          <p>Asiento: {{ ticket.seat }}</p>
          <p>Precio: {{ ticket.price }} ETH</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tickets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  justify-items: center;
}
.ticket-card {
  background-color: #062c49;
  color: white;
  border-radius: 12px;
  padding: 1rem;
  width: 250px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}
.ticket-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
</style>