import { defineStore } from 'pinia'
import axios from 'axios'

export const AuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        user: '',
        error: null,
    }),
    getters: {

    },
    actions: {
        async login(username, password) {
            try {
                const response = await axios.post('/login', { username, password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
            } catch (error) {
                this.error = error.response.data.error;
                throw this.error
            }
        },
        isAuthenticated() {
            if (this.token !== null) {
                return true;
            }
            return false
        },
        logout() {
            this.token = null,
                this.error = null,
                this.user = null,
                localStorage.removeItem('token', this.token);

        },
        async Profile() {
            try {
                const tokenStr = this.token;
                const user = await axios.get('/user', {
                    headers: { "Authorization": `Bearer ${tokenStr}` }
                });

                this.user = user.data.username;

            } catch (error) {

            }
        },
        async Signup(username, password) {
            try {
                await axios.post('/signup', { username, password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            } catch (error) {
                this.error = error.response.data.error;
                throw this.error
            }
        }


    },
});
