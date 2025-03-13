import { defineStore } from 'pinia'
import axios from 'axios'
import { useHostStore } from './Connection'

export const AuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        user: '',
        user_details: [],
        user_id: '',
        user_role: '',
        error: ''
    }),
    getters: {},
    actions: {
        async login(username, password) {
            try {
                const host = useHostStore()
                const hostAddress = host.host || localStorage.getItem('host')
                const response = await axios.post(
                    'http://' + hostAddress + ':1216/login',
                    { username, password },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                this.token = response.data.access_token
                localStorage.setItem('token', this.token)
                this.router.push('/pages/welcome')
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        async signUp(username, password) {
            try {
                const host = useHostStore()
                const hostAddress = host.host
                const signup = await axios.post(
                    'http://' + hostAddress + ':1216/signup ',
                    { username, password },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                this.router.push('/login')
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        async isAuthenticated() {
            const token = localStorage.getItem('token')
            if (token) {
                const host = useHostStore()
                const hostAddress = host.host || localStorage.getItem('host')
                const tokenStr = token
                try {
                    const user = await axios.get(
                        'http://' + hostAddress + ':1216/user',
                        {
                            headers: { Authorization: `Bearer ${tokenStr}` }
                        }
                    )
                    // console.log(user)

                    this.user = user.data.username
                    this.user_id = user.data.id
                    this.user_role = user.data.role

                    return true
                } catch (error) {
                    // console.log(error)
                    localStorage.removeItem('token')
                    return false
                }
            } else {
                localStorage.removeItem('token')
                return false
            }
        },
        logout() {
            this.token = null
            localStorage.removeItem('token')
            this.router.push('/login')
        }
    }
})
