import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'


export const useHostStore = defineStore('host', {
    state: () => ({
        host: localStorage.getItem('host'),

    }),
    actions: {
        async isConnected() {
            if (!this.host) {
                console.log('No Host Waah, He needs some milk')
                return false
            }
            try {
                const hostAdd = localStorage.getItem('host')
                const response = await axios.get(
                    `http://${hostAdd}:1216/test-server`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (response.status === 201) { return true }
                return false
            } catch (error) {
                return false
            }
        },
        async connectHost(val) {
            try {
                const response = await axios.get(`http://${val}:1216/test-server`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (response.status === 201) {
                    this.host = val
                    localStorage.setItem('host', val)

                    /**
                     *  Go To Login Page if Connected
                     */

                    this.router.push('/login')
                    return true
                }
                console.log('connection error')
                localStorage.removeItem('host')
                return false

            } catch (error) {
                console.log(error)
                localStorage.removeItem('host')
                return false
            }
        },
        removeConnection() {
            if (this.isConnected()) {
                this.host = null
                localStorage.removeItem('host')
                localStorage.removeItem('token')
                localStorage.removeItem('mode')
                this.router.push('/')
                return
            }
            console.log('Already Disconnected')

        },
        async isServerRunning() {
            const server = await window.LocalCivilApi.IsServerRunning()
            if (server) {
                localStorage.setItem('host', '127.0.0.1')
                this.host = '127.0.0.1'
                return true
            }
            return false
        },
    },
})
