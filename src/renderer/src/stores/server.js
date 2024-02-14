import { defineStore } from 'pinia'
import axios from 'axios'
import { ConnectionMode } from '../stores/connection'


export const ServerStore = defineStore('server', {
    state: () => ({
        // active: null,
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
                    }
                } catch (error) {
                    console.error('Error starting server:', error);
                }
            }
        },
        AutoStart() {
            this.auto = !this.auto

            if (this.auto) {
                localStorage.setItem('auto', true)
            } else {
                localStorage.setItem('auto', false)
            }
        },
        async checkAutoStart() {
            if (this.auto) {
                const start_server = await window.LocalCivilApi.StartServer();
                if (start_server) {
                    this.status = true
                    this.hostAddress = start_server.addresses[0]
                    localStorage.setItem('status', true)
                }
            }
            return
        }


    },
});
