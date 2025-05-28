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
        Donde podrás encontrar boletos para los eventos más TOP de este 2025
      </p>
    </div>
    <h2 id="title">Eventos próximos</h2>
    <EventCarousel />
  </div>
</template>
<style scoped>
.centro {
  background-color: #062c49; 
  color: white; 
  text-align: center; 
  padding: 2rem 1rem; 
  width: 100vw; 
  margin-left: calc(-50vw + 50%);
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
#title {
  color: #062c49;
  font-weight: 600;
  padding-left: 2rem;
  padding-top: 1rem;
}
</style>
