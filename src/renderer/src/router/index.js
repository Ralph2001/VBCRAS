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
            path: '/mode/',
            name: 'mode',
            children: [
                {
                    path: 'server',
                    component: () => import('../views/ServerMode.vue'),
                    name: 'server',
                    beforeEnter: async (to, from) => {
                        const mode = useModeStore()
                        const storedMode = localStorage.getItem('mode')
                        const server = useServerStore()

                        const is_server_running = await server.isServerRunning()

                        if (mode.checkMode() && storedMode == 'server') {
                            if (is_server_running) {
                                return { name: 'server_login' }
                            }
                            return true
                        } else {
                            return { name: 'Home' }
                        }
                    },
                },
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
        {
            path: '/server/login',
            name: 'server_login',
            component: () => import('../views/Login.vue'),
            beforeEnter: async (to, from) => {
                const auth = useServerAuthStore()
                const authenticated = await auth.isServerAuthenticated()
                if (authenticated) {
                    return { name: 'server_dashboard' }
                }
                return true
            },
        },

        //////////////////////
        // Server Page Here //
        //////////////////////
        {
            path: '/server/',
            name: 'server_page',
            component: () => import('../layouts/Server.vue'),
            beforeEnter: async (to, from) => {
                const auth = useServerAuthStore()
                const authenticated = await auth.isServerAuthenticated()
                if (authenticated) {
                    return true
                }
                return { name: 'server_login' }
            },
            children: [
                {
                    path: 'dashboard',
                    component: () => import('../views/server/Dashboard.vue'),
                    name: 'server_dashboard',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'scanned',
                    component: () => import('../views/server/Scanned.vue'),
                    name: 'server_scanned',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'users',
                    component: () => import('../views/server/Users.vue'),
                    name: 'server_users',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'users/profile/:id',
                    component: () =>
                        import('../views/server/users/profile.vue'),
                    name: 'check_users',
                    beforeEnter: async (to, from) => {
                        // console.log(to.params.id)
                        const user_data = useUserData()
                        const getUserData = await user_data.getUserData(
                            to.params.id
                        )
                        if (getUserData) {
                            user_data.getUserScannedLogs()
                        }

                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'corrections',
                    component: () => import('../views/server/Corrections.vue'),
                    name: 'server_corrections',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'forms',
                    component: () => import('../views/server/Forms.vue'),
                    name: 'server_forms',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
                    },
                },
                {
                    path: 'datarecords',
                    component: () => import('../views/server/DataRecords.vue'),
                    name: 'server_records',
                    beforeEnter: async (to, from) => {
                        const auth = useServerAuthStore()
                        const authenticated = await auth.isServerAuthenticated()
                        if (authenticated) {
                            return true
                        }
                        return { name: 'server_login' }
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