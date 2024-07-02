import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useHostStore } from './connection'
import { ref } from 'vue'



export const AuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        user: '',
        user_details: [],
        error: '',
    }),
    getters: {},
    actions: {
        async login(username, password) {
            try {
                const host = useHostStore()
                const hostAddress = host.host
                const response = await axios.post(
                    'http://' + hostAddress + ':1216/login',
                    { username, password },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                this.token = response.data.token
                localStorage.setItem('token', this.token)
                this.router.push('/client/welcome')
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        async signUp(username, password, position) {
            try {
                const host = useHostStore()
                const hostAddress = host.host
                const signup = await axios.post(
                    'http://' + hostAddress + ':1216/signup',
                    { username, password, position },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                this.router.push('/client/login')
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        async isAuthenticated() {
            const token = localStorage.getItem('token')
            if (token) {
                const host = useHostStore()
                const hostAddress = host.host
                const tokenStr = token
                try {
                    const user = await axios.get(
                        'http://' + hostAddress + ':1216/user',
                        {
                            headers: { Authorization: `Bearer ${tokenStr}` },
                        }
                    )
                    this.user = user.data.username
                    // console.log(user)
                    this.user_details = user.data
                    return true
                } catch (error) {
                    localStorage.removeItem('token')
                    return false
                }
            } else {
                localStorage.removeItem('token')
                return false
            }
        },
        UserLogout() {
            this.token = null
            localStorage.removeItem('token')
            this.router.push('/client/login')
        },
    },
})
