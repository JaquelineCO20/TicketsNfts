<script setup>
defineProps({
  title: String,
  subtitle: String,
  date: String,
  image: String,
  price: String,
})
</script>
<template>
  <div class="event-card" @click="$emit('select', { title, subtitle, date, image, price })">
    <img :src="image" :alt="title" class="poster" />
    <div class="info">
      <h2 class="artista">{{ title }}</h2>
      <h3 class="nombretour">{{ subtitle }}</h3>
      <p class="fechaa">{{ date }}</p>
      <p class="pricee">$ {{ price }}</p>
    </div>
  </div>
</template>
<style scoped>
.event-card {
  height: 312px;
  width: 241px;
  background: #062c49;
  border-radius: 25px;
  overflow: hidden;
  text-align: center;
  margin: 0 10px;
  transition: transform 0.2s;
}
.event-card:hover {
  transform: scale(1.05);
}
.poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.artista {
  font-size: medium;
  font-weight: 900;
  color: white;
}
.nombretour {
  font-size: smaller;
  font-weight: 500;
  color: white;
}
.fechaa {
  font-size: smaller;
  font-weight: 900;
  color: white;
}
.pricee {
  font-size: small;
  font-weight: 900;
  color: greenyellow;
}
</style>
