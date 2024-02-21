

import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import PrimeVue from 'primevue/config';
import Lara from './assets/presets/lara';


import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faPowerOff, faCaretDown, faRightFromBracket, faGear, faFilePdf, faDesktop } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faPowerOff, faCaretDown, faRightFromBracket, faGear, faFilePdf, faDesktop)

import "./assets/index.css";
import 'flowbite';
import "animate.css";

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});
app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(VueSweetalert2);
app.use(PrimeVue, { unstyled: true, pt: Lara })

app.mount("#app");
