import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from "vue-router"

const router = useRouter();
export const ConnectionMode = defineStore('connect', {
    state: () => ({
        mode: localStorage.getItem('mode'),
        host: localStorage.getItem('host'),
        error: null,
    }),
    getters: {
        // Add getters as needed
    },
    actions: {
        async checkConnection(host) {
            try {
                const response = await axios.get(`http://${host}:1216/connect`, {
                    headers: { "Content-Type": "application/json",
                    timeout: 5000, },
                });
                if (response.status === 201) {
                    return true;
                } else {
                    this.error = 'Connection failed with status: '
                    return false;
                }
            } catch (error) {
                this.error = error.message;
                console.log(error)
                // this.router.push('/connection')
                return false;
            }
        },
        async assignHost(host) {

            try {
                const connect = await this.checkConnection(host)

                if (connect) {
                    localStorage.setItem('host', host + ':1216');
                    this.host = host;
                    this.router.push('/login')
                }
                else {
                    this.error = "Cant' Connect to the Host Address"
                }
            } catch (error) {
                console.log(error)
            }


        },
        async changeMode(newMode) {
            if (newMode === 'Server' || newMode === 'Client') {
                this.config.mode = newMode;
                localStorage.setItem('mode', newMode);

                if (newMode === 'Server') {
                    this.assignHost('localhost');
                }

            } else {

                this.error = 'Invalid mode. Please choose Server or Client.';
            }
        },
    },
});
