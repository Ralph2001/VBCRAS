
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'core-js/features/promise/with-resolvers';
import PrimeVue from 'primevue/config'
// import Lara from './assets/presets/lara'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// import { RecycleScroller } from 'vue-virtual-scroller'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



/* import specific icons */
import {
    faTrash,
    faUserSecret,
    faPowerOff,
    faCaretDown,
    faRightFromBracket,
    faGear,
    faFilePdf,
    faDesktop,
    faFilter,
    faFolder,
    faBarsProgress,
    faMagnifyingGlass,
    faCircleArrowLeft,
    faRepeat,
    faArrowRotateLeft,
    faArrowLeft,
    faXmark,
    faFolderOpen,
    faChevronCircleRight,
    faCircleQuestion,
    faUserCheck,
    faChartLine,
    faFlag,
    faPrint,
    faScroll,
    faAngleDown,
    faRotateRight,
    faLightbulb,
    faListCheck,
    faCircleInfo,

    faHouse,
    faLandmarkDome,
    faFilePen,
    faFileLines,

    faMarker,
    faExpand,
    faCompress,
    faWindowRestore,
    faArrowDown,
    faUpload,
    faHandPointer,
    faPlus,
    faUpRightAndDownLeftFromCenter,
    faLeftRight,
    faUpDown,
    faTextHeight,
    faArrowsUpDown,
    faArrowsLeftRight,
    faNetworkWired,
    faBars,
    faWindowMinimize,
    faCircleCheck,
    faTriangleExclamation,
    faRightToBracket, 
    faAnglesRight,
    faCheck,
    faFile, 
    faCamera,
    faPenToSquare,
    faWrench,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faChevronDown,
    faCircleExclamation,
    faPaperclip,
    faInfo,
    faArrowsRotate,
    faTowerCell,
    faFileWord,
    faCaretRight,
    faCopy,
    faDatabase,
    faRetweet,
    faShare,
    faX,
    faY
    


} from '@fortawesome/free-solid-svg-icons'

import { faEye, faUser, faWindowMaximize, faFloppyDisk, faClock } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(
    faTrash,
    faUserSecret,
    faPowerOff,
    faCaretDown,
    faRightFromBracket,
    faGear,
    faFilePdf,
    faDesktop,
    faFilter,
    faFolder,
    faBarsProgress,
    faMagnifyingGlass,
    faCircleArrowLeft,
    faRepeat,
    faArrowRotateLeft,
    faArrowLeft,
    faXmark,
    faFolderOpen,
    faChevronCircleRight,
    faCircleQuestion,
    faUserCheck,
    faChartLine,
    faFlag,
    faPrint,
    faScroll,
    faAngleDown,
    faRotateRight,
    faLightbulb,
    faListCheck,
    faCircleInfo,

    faHouse,
    faLandmarkDome,
    faFilePen,
    faFileLines,
    faUser,
    faEye,

    faMarker,
    faExpand,
    faCompress,
    faWindowMaximize,
    faWindowRestore,
    faArrowDown,
    faUpload,
    faHandPointer,
    faPlus,
    faUpRightAndDownLeftFromCenter,
    faLeftRight,
    faUpDown,
    faTextHeight,
    faArrowsUpDown,
    faArrowsLeftRight,
    faNetworkWired,
    faBars,
    faWindowMinimize,
    faCircleCheck,
    faTriangleExclamation,
    faRightToBracket, 
    faAnglesRight,
    faCheck,
    faFile, 
    faCamera,
    faFloppyDisk,
    faPenToSquare,
    faWrench,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faChevronDown,
    faCircleExclamation,
    faClock,
    faPaperclip,
    faInfo,
    faArrowsRotate,
    faTowerCell,
    faFileWord,
    faCaretRight,
    faCopy,
    faDatabase,
    faRetweet,
    faShare,
    faX,
    faY
    
 

)

import './assets/index.css'
import 'animate.css';
import 'flowbite'
import 'animate.css'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'


const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})
app.use(router)
app.use(pinia)

// app.component('RecycleScroller', RecycleScroller)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueSweetalert2)
app.component('VueDatePicker', VueDatePicker)

app.use(PrimeVue, { unstyled: true })

app.mount('#app')
