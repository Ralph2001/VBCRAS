import { createApp } from 'vue'
import App from './App.vue'
import 'flowbite';
import { createRouter, createWebHistory } from 'vue-router';
import './assets/css/index.css'

import Start from './views/Start.vue';
import Scanned from './views/Scanned.vue';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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




createApp(App).use(router).use(VueSweetalert2).mount('#app')



  