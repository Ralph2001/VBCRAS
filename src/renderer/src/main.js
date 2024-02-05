import { createApp, markRaw } from 'vue'
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

import Layout from './views/Layout.vue';

import Start from './views/Start.vue';
import Scanned from './views/ScannedDocuments.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';
import Connection from './views/Connection.vue';
import Profile from './views/Profile.vue';



const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            { path: "Start", component: Start, name: "Start" },
            { path: "scanned", component: Scanned, name: "Scanned Documents" },
        ],
    },
    { path: "/login", component: Login, name: "Login" },
    { path: "/profile", component: Profile, name: "Profile" },
    { path: "/Signup", component: Signup, name: "Signup" },
    { path: "/connect", component: Connection, name: "Connection" },





];


const router = createRouter({
    history: createWebHistory(),
    routes
})


const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})
const app = createApp(App);


app.use(router)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(ToastService)
app.use(VueSweetalert2)
app.use(pinia)
app.mount('#app')




