import { useModeStore } from '../stores/mode'
import { useHostStore } from '../stores/Connection'
import { AuthStore } from '../stores/Authentication'

import {
    createRouter,
    createMemoryHistory,
    createWebHashHistory,
} from 'vue-router'
import { useSetup } from '../stores/Setting/setup'

import { navGuard } from './Guards'
import { useServerStore } from '../stores/ServerApp'


/**
 *  Return True = Stay To That Path
 */



const router = createRouter({
    /**
     *  createMemoryHistory(), this is only applicable in development
     *  use 
     *  createWebHashHistory() in production 
     */
    history: createMemoryHistory(),
    // history: createWebHashHistory(),

    _routes: [

        /**
         *   
         *  Main Path
         * 
         */

        {
            path: '/',
            name: 'Home',
            component: () => import('../views/Mode.vue'),
            beforeEnter: async (to, from) => {
                const mode = useModeStore()
                const connection = useHostStore()
                const server = useServerStore()
                // If 'Client' check the saved host address and try to connect to it, if connection error stay at home
                // If 'Server' check the server app status if running, if not try to run the server and redirect to login
                if (mode.checkMode()) {
                    const storedMode = localStorage.getItem('mode')
                    if (storedMode === 'client') {
                        // Connect in saved host
                        // No Host address? stay home
                        // Connected? Proceed to Login Page
                        const saved_ip = localStorage.getItem('host')
                        if (!saved_ip) { return true }

                        const is_person_connected = await connection.isConnected()
                        if (is_person_connected) {
                            return { name: 'login' }
                        } else return true
                    }
                    else if (storedMode === 'server') {
                        const check_server_status = await server.isServerRunning()
                        if (check_server_status) {
                            return { name: 'login' }
                        }
                        else return true
                    }

                    // return
                }

                /**
                 *  If No Mode Selected Continue To This Path
                 */

                return true
            },
        },

        /**
         * 
         * 
         *  End of main path
         * 
         */


        /**
         *  Login Page
         *  Signup Page
         *  Validate Users
         *  Add Security
         */

        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            beforeEnter: async (to, from) => {
                const auth = AuthStore()
                const connection = useHostStore()
                const authKey = await auth.isAuthenticated()

                const is_connected = await connection.isConnected()

                if (is_connected) {
                    if (authKey) {

                        return { name: 'page_welcome' }
                    }

                    return true
                }
                console.log(is_connected)
            }

        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/Signup.vue'),
            beforeEnter: async (to, from) => {
                const auth = AuthStore()
                const connection = useHostStore()
                const authKey = await auth.isAuthenticated()
                const mode = useModeStore()

                if (mode.checkMode()) {
                    if (await connection.isConnected()) {
                        /**
                         *  is connected
                         */
                        return true
                    }

                    /**
                     *  Not Connected, redirect to home
                     */
                    return { name: 'Home' }
                }
                /**
                 *  No Mode Selected, redirect to home
                 */
                return { name: 'Home' }
            },
        },

        // Validate Page
        // Default Values for System Settings
        // Before Proceeding into Welcome check if the systema already setup
        {
            path: '/setup',
            name: 'setup',
            component: () => import('../views/Setup.vue'),
            beforeEnter: async (to, from) => {
                const auth = AuthStore()
                const setup = useSetup()
                const con = useHostStore()

                const isSetupDone = await setup.getSystemSetting()
                const authKey = await auth.isAuthenticated()
                const connection = await con.isConnected()

                if (connection) {
                    if (authKey) {
                        if (isSetupDone) {
                            return { name: 'page_welcome' }
                        }
                        return true
                    }
                    return { name: 'login' }
                }
                return { name: 'Home' }
            },
        },
        {
            path: '/settings/',
            name: 'system_settings',
            component: () => import('../layouts/Settings.vue'),
            beforeEnter: navGuard,

            /**
             * /settings/cce-holidays
                /settings/cce-templates
                /settings/cce-templates
             */
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('../views/pages/Settings/Dashboard.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'cce-date-counts',
                    name: 'cce_date_counts',
                    component: () => import('../views/pages/Settings/CCE/DateCount.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'cce-holidays',
                    name: 'cce_holidays',
                    component: () => import('../views/pages/Settings/CCE/Holidays.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'cce-templates',
                    name: 'cce_templates',
                    component: () => import('../views/pages/Settings/CCE/Templates.vue'),
                    beforeEnter: navGuard
                },
            ],
        },


        /**
         * 
         * Main Pages for All System Apps
         * Validate Connection and Credentials before proceeding 
         * Also check the mode
         * 
         */

        {
            path: '/pages/',
            name: 'system_page',
            component: () => import('../layouts/MainLayout.vue'),
            beforeEnter: navGuard,

            children: [
                {
                    path: 'welcome',
                    name: 'page_welcome',
                    component: () => import('../views/pages/Welcome.vue'),
                    beforeEnter: navGuard
                },

                {
                    path: 'scanned',
                    name: 'page_scanned',
                    component: () => import('../views/pages/Scanned.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'cce',
                    name: 'page_cce',
                    component: () => import('../views/pages/CCE.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'cce_approval/:id',
                    name: 'page_cce_approval',
                    component: () => import('../views/pages/CCE/Approval.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'forms',
                    name: 'page_forms',
                    component: () => import('../views/pages/Forms.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'marriage-license',
                    name: 'marriage_license',
                    component: () => import('../views/pages/MarriageLicense.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'supplemental',
                    name: 'supplemental',
                    component: () => import('../views/pages/Supplemental.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'legitimation',
                    name: 'legitimation',
                    component: () => import('../views/pages/Legitimation.vue'),
                    beforeEnter: navGuard
                },
                {
                    path: 'ausf',
                    name: 'page_ausf',
                    component: () => import('../views/pages/AUSF.vue'),
                    beforeEnter: navGuard
                },

            ],
        },
    ],
    get routes() {
        return this._routes
    },
    set routes(value) {
        this._routes = value
    },
})

export default router
