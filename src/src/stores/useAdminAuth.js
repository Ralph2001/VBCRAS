import { defineStore } from 'pinia'
import axios from 'axios';

import { useRouter } from "vue-router"

const router = useRouter();


export const useAdminAuth = defineStore('adminAuth', {

    state: () => ({
        token: localStorage.getItem('AdminToken'),
        Adminuser: '',
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
                })

                if (response.status === 200) {
                    const tokenStr = response.data.token;
                    const user = await axios.get('/user', {
                        headers: { "Authorization": `Bearer ${tokenStr}` }
                    })

                    if (!user.data.id_admin) {
                        this.error = "Invalid Username or Password"
                        return
                    }
                    console.log('Success')
                    localStorage.setItem('AdminToken', tokenStr)
                    this.router.push('/admin/panel')
                    return true
                }
                else {
                    this.error = "Invalid Username or Password"

                }

            } catch (error) {
                this.error = "Invalid Username or Password"
            }
        },
    }

})