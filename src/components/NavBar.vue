<script setup>
import { useWallet } from '../composables/useWallet'

const { direccionWallet, conectarWallet, desconectarWallet } = useWallet()
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      <img src="/src/assets/logoJN.png" alt="Logo JN Tickets" style="width: 150px; height: 120px" />
    </div>

    <input type="text" placeholder="Hinted search text" class="search" />

    <div class="nav-links">
      <router-link class="link" to="/">Inicio</router-link>
      <router-link class="link" to="/mis-tickets">Mis Tickets</router-link>
      <button class="wallet-btn"  @click="direccionWallet ? desconectarWallet() : conectarWallet()">
        {{
          direccionWallet
            ? direccionWallet.slice(0, 6) + '...' + direccionWallet.slice(-4)
            : 'Conectar Wallet'
        }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Tus estilos actuales sin cambios */
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  align-items: center;
  background: #b6dbf9;
  padding: 15px;
  flex-wrap: wrap;
}

.logo img {
  height: 100px;
}

.search {
  flex: 1;
  max-width: 350px;
  margin: 0 2rem;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.nav-links {
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.link {
  text-decoration: none;
  color: #062c49;
  font-weight: 600;
}

.wallet-btn {
  background-color: #062c49;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.wallet-btn:hover {
  background-color: #041a2e;
}
</style>
