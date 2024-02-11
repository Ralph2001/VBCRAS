import { defineStore } from 'pinia'
import axios from 'axios'

export const ServerStore = defineStore('server', {
    state: () => ({
        active: localStorage.getItem('server'),
        status: null

    }),
    getters: {

    },
    actions: {
        async activate() {
            if (this.active) {
                try {
                    const stop_server = await window.LocalCivilApi.StopServer();
                    if (stop_server) {
                        this.active = localStorage.setItem('server', false);
                    }
                } catch (error) {
                    console.error('Error stopping server:', error);
                }
            } else {
                try {
                    const start_server = await window.LocalCivilApi.StartServer();
                    if (start_server) {
                        this.active = localStorage.setItem('server', true);

                    }
                } catch (error) {
                    console.error('Error starting server:', error);

                }
            }
        },

        getStatus() {
            if (this.active === '') {
                this.active = localStorage.setItem('server', false)
            }

            return this.active = localStorage.getItem('server')
        }

    },
});
