import { useModeStore } from '../stores/mode'
import { useHostStore } from '../stores/connection'
import { AuthStore } from '../stores/clientAuth'
import { useServerAuthStore } from '../stores/ServerAuth'
import { useServerStore } from '../stores/server'
import { useUserData } from '../stores/clientData'

import {
    createRouter,
    createMemoryHistory,
    createWebHashHistory,
} from 'vue-router'
import { useSetup } from '../stores/Setting/setup'

const router = createRouter({
    history: createMemoryHistory(),
    // history: createWebHashHistory(),

    _routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/Mode.vue'),
            beforeEnter: (to, from) => {
                const mode = useModeStore()
                if (mode.checkMode()) {
                    const storedMode = localStorage.getItem('mode')
                    return { name: storedMode } // if (mode) { return to mode client || server } else { return to Home }
                }
                return true
            },
        },
        {
            path: '/setup',
            name: 'Setup',
            component: () => import('../views/configure_setup.vue'),
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
                            console.log('yes')
                            return { name: 'client_welcome' }
                        }
                        console.log(setup)
                        return true
                    }
                    return { name: 'client' }
                }
                return { name: 'client' }
            },
        },
        {
            path: '/mode/',
            name: 'mode',
            children: [
                {
                    path: 'client',
                    component: () => import('../views/ClientMode.vue'),
                    name: 'client',
                    beforeEnter: async (to, from) => {
                        const mode = useModeStore()
                        const con = useHostStore()
                        const storedMode = localStorage.getItem('mode')
                        const connection = await con.isConnected()

                        if (mode.checkMode() && storedMode == 'client') {
                            if (connection) {
                                return { name: 'client_login' }
                            } else {
                                return true
                            }
                        } else {
                            return { name: 'Home' }
                        }
                    },
                },
            ],
        },


        // Client Login
        {
            path: '/client/login',
            name: 'client_login',
            component: () => import('../views/client/Login.vue'),
            beforeEnter: async (to, from) => {
                const auth = AuthStore()
                const con = useHostStore()
                const storedMode = localStorage.getItem('mode')
                const authKey = await auth.isAuthenticated()
                const connection = await con.isConnected()

                if (storedMode === 'client') {
                    if (connection) {
                        if (authKey) {
                            return { name: 'client_welcome' } // isAuthenticated go to login
                        }
                        return true // isconnected go to login
                    } else {
                        return { name: 'client' } // isnotconnected go to connection
                    }
                } else {
                    return { name: 'Home' } // not client go to Home
                }
            },
        },
        {
            path: '/client/signup',
            name: 'client_signup',
            component: () => import('../views/client/Signup.vue'),
            beforeEnter: async (to, from) => {
                const con = useHostStore()
                const storedMode = localStorage.getItem('mode')
                const connection = await con.isConnected()

                if (storedMode === 'client') {
                    if (connection) {
                        return true // isconnected go to signup
                    } else {
                        return { name: 'client' } // isnotconnected go to connection
                    }
                } else {
                    return { name: 'Home' } // not client go to Home
                }
            },
        },
        {
            path: '/client/',
            name: 'client_page',
            component: () => import('../layouts/Client.vue'),
            beforeEnter: async (to, from) => {
                const auth = AuthStore()
                const con = useHostStore()
                const authKey = await auth.isAuthenticated()
                const connection = await con.isConnected()
                if (connection) {
                    if (authKey) {
                        return true
                    }
                    return { name: 'client' }
                }
                return { name: 'client' }
            },
            children: [
                {
                    path: 'welcome',
                    name: 'client_welcome',
                    component: () => import('../views/client/Welcome.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const con = useHostStore()
                        const setup = useSetup()

                        const isSetupDone = await setup.getSystemSetting()
                        const authKey = await auth.isAuthenticated()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                if (isSetupDone) {
                                    return true
                                }
                                return { name: 'Setup' }
                                // return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },

                {
                    path: 'scanned',
                    name: 'client_scanned',
                    component: () => import('../views/client/Scanned.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },
                {
                    path: 'cce',
                    name: 'client_cce',
                    component: () => import('../views/client/CCE.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },
                {
                    path: 'cce_approval/:id',
                    name: 'client_cce_approval',
                    component: () => import('../views/client/CCE/Approval.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },
                {
                    path: 'forms',
                    name: 'client_forms',
                    component: () => import('../views/client/Forms.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },
                {
                    path: 'ausf',
                    name: 'client_ausf',
                    component: () => import('../views/client/AUSF.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
                },
                {
                    path: 'data_record',
                    name: 'data_record',
                    component: () => import('../views/client/DataRecord.vue'),
                    beforeEnter: async (to, from) => {
                        const auth = AuthStore()
                        const authKey = await auth.isAuthenticated()
                        const con = useHostStore()
                        const connection = await con.isConnected()
                        if (connection) {
                            if (authKey) {
                                return true
                            }
                            return { name: 'client' }
                        }
                        return { name: 'client' }
                    },
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
