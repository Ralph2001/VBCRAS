import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import './axios'
import App from './App.vue'
import 'flowbite';

import { createRouter, createWebHashHistory } from 'vue-router';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/index.css'

import PrimeVue from 'primevue/config';
import Lara from './assets/presets/lara';

import Layout from './views/Layout.vue';





const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            { path: "Start", component: () => import('./views/client/Start.vue'), name: "home" },
            { path: "scanned", component: () => import('./views/client/ScannedDocuments.vue'), name: "Scanned Documents" },
        ],
    },
    { path: "/login", component: () => import('./views/client/Login.vue'), name: "Login" },
    { path: "/profile", component: () => import('./views/client/Profile.vue'), name: "Profile" },
    { path: "/Signup", component: () => import('./views/client/Signup.vue'), name: "Signup" },
    {
        path: '/connection/',
        children: [
            { path: "mode", component: () => import('./views/Mode.vue'), name: "mode" },
            { path: "client", component: () => import('./views/mode/ClientMode.vue'), name: "client" },
            { path: "server", component: () => import('./views/mode/AdminMode.vue'), name: "server" },
        ]
    },
    {
        path: '/admin/',
        children: [
            { path: "login", component: () => import('./views/admin/login.vue'), name: "login" },

        ]
    }

];


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})
const app = createApp(App);


app.use(router)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(VueSweetalert2)
app.use(pinia)
app.mount('#app')
router.push('/connection/mode')





