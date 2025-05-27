import { createRouter, createWebHistory } from 'vue-router'
import HomeTicket from '../views/HomeTicket.vue'
import MisTickets from '../views/MisTickets.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeTicket },
    { path: '/mis-tickets', name: 'MisTickets', component: MisTickets },
  ],
})

export default router
