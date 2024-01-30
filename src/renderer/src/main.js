import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './axios'
import App from './App.vue'
import 'flowbite';
import ToastService from 'primevue/toastservice';
import { createRouter, createWebHistory } from 'vue-router';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/index.css'

import PrimeVue from 'primevue/config';
import Lara from './assets/presets/lara';



import Start from './views/Start.vue';
import Scanned from './views/Scanned.vue';
import CCE from './views/CCE.vue'
import Forms from './views/Forms.vue'
import Collections from './views/Collections.vue'
import Scannedv2 from './views/ScannedDocuments.vue';

const routes = [
    {
        path: "/", component: Start, name: "Start"
    },
    {
        path: "/scanned", component: Scanned, name: "Scanned Documents"
    },
    {
        path: "/scannedv2", component: Scannedv2, name: "Scanned Documentsv2"
    },
    {
        path: "/cce", component: CCE, name: "CCE"
    },
    {
        path: "/forms", component: Forms, name: "Forms"
    },
    {
        path: "/collections", component: Collections, name: "Collections"
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


const pinia = createPinia()
const app = createApp(App);


app.use(router)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(ToastService)
app.use(VueSweetalert2)
app.use(pinia)
app.mount('#app')




