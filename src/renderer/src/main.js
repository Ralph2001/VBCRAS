import { createApp } from 'vue'
import App from './App.vue'
import 'flowbite';


import ToastService from 'primevue/toastservice';

import { createRouter, createWebHistory } from 'vue-router';

import Start from './views/Start.vue';
import Scanned from './views/Scanned.vue';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/index.css'

import PrimeVue from 'primevue/config';
import Lara from './assets/presets/lara';


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

const app = createApp(App);


app.use(router)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(ToastService);
app.use(VueSweetalert2)
app.mount('#app')



