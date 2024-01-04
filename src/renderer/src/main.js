import { createApp } from 'vue'
import App from './App.vue'
import 'flowbite';
import { createRouter, createWebHistory } from 'vue-router';
import './assets/css/index.css'

import Start from './views/Start.vue';
import Scanned from './views/Scanned.vue';


const routes = [
    {
        path: "/", component: Start, name: "Start"
    },
    {
        path: "/scanned", component: Scanned, name: "Scanned Documents"
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')
