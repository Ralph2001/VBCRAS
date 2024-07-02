import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'


export const useHostStore = defineStore('host', {
    state: () => ({
        host: localStorage.getItem('host'),
        hostAuto: localStorage.getItem('hostAuto'),
    }),
    actions: {
        async isConnected() {
            if (!this.host) {
                // console.log('No Host Waah')
                return false
            }
            try {
                const hostAdd = localStorage.getItem('host')
                const response = await axios.get(
                    `http://${hostAdd}:1216/connect`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (response.status === 201) {
                    console.log('Connected')
                    return true
                } else {
                    return false
                }
            } catch (error) {
                return false
            }
        },
        async connectHost(val) {
            try {
                const response = await axios.get(`http://${val}:1216/connect`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (response.status === 201) {
                    this.host = val
                    localStorage.setItem('host', val)
                    this.router.push('/client/login')
                    return true
                } else {
                    console.log('connection error')
                    localStorage.removeItem('host')
                    return false
                }
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
                this.router.push('/client')
            } else {
                console.log('Already Disconnected')
            }
        },
    },
})
