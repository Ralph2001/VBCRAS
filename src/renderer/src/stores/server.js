import { defineStore } from 'pinia'
import axios from 'axios'

export const ServerStore = defineStore('server', {
    state: () => ({
        // active: null,
        status: localStorage.getItem('status')

    }),
    getters: {
        getStatus(state) {
            return state.status
        }
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
                        localStorage.setItem('status', true)
                    }
                } catch (error) {
                    console.error('Error starting server:', error);
                }
            }
        },

    },
});
