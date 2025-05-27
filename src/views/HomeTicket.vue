<script setup>
import Navbar from '../components/NavBar.vue'
import EventCarousel from '../components/EventCarousel.vue'
</script>
<template>
  <div>
    <Navbar />
    <div class="centro">
      <p class="texto-centro">Bienvenido a J|N Tickets</p>
      <p class="description">
        Dónde podras encontrar boletos para los eventos mas TOP de este 2025
      </p>
    </div>
    <h2 style="padding-left: 2rem">Eventos próximos</h2>
    <EventCarousel />
  </div>
</template>
<style scoped>
.centro {
  display: flex;
  flex-direction: column;
  background-color: #03304f;
  width: 100%;
  height: 150px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
}
.texto-centro {
  color: #ffffff;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: x-large;
  font-weight: 900;
}
.description {
  color: #ffffff;
  font-size: medium;
  font-weight: 300;
}
</style>
