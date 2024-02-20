import { defineStore } from 'pinia'


import { useRouter } from "vue-router"

const router = useRouter();

export const ServerStore = defineStore('server', {
    state: () => ({
        status: localStorage.getItem('status'),
        hostAddress: null,
        auto: localStorage.getItem('auto'),
    }),
    getters: {
        getStatus(state) {
            return state.status
        },
    },
    actions: {
        async activate() {
            if (this.status) {
                try {
                    const stop_server = await window.LocalCivilApi.StopServer();
                    if (stop_server) {
                        this.status = false
                        localStorage.removeItem('status')
                        localStorage.removeItem('host')
                    }
                } catch (error) {
                    console.error('Error stopping server:', error);
                }
            }
            else {
                try {
                    const start_server = await window.LocalCivilApi.StartServer();
                    if (start_server) {
                        this.status = true
                        this.hostAddress = start_server.addresses[0]
                        localStorage.setItem('status', true)
                        localStorage.setItem('host', '127.0.0.1:1216')
                    }
                } catch (error) {
                    console.error('Error starting server:', error);
                }
            }
        },
        async AutoStart() {
            this.auto = !this.auto

            if (this.auto) {
                localStorage.setItem('auto', true)
            } else {
                localStorage.removeItem('auto')
            }
        },
        async checkAutoStart() {
            if (!this.status) {
                if (this.auto) {
                    const start_server = await window.LocalCivilApi.StartServer();
                    if (start_server) {
                        this.status = true
                        this.hostAddress = start_server.addresses[0]
                        localStorage.setItem('status', true)
                    }
                }
                else {
                    return
                }
            }

        },
        async checkStatus() {
            if (this.status) {
                this.router.push('/admin/login')
            }
            else {
                return
            }
        }


    },
});
