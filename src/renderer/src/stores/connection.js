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
        async connectHost(host) {
            try {
                const response = await axios.get(`http://${host}:1216/connect`, {
                    headers: {
                        "Content-Type": "application/json",
                        timeout: 5000,
                    },
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
                const connect = await this.connectHost(host)
                if (connect) {
                    localStorage.setItem('host', host + ':1216');
                    this.host = host;
                    this.router.push('/login')
                    return true
                }
                else {
                    this.error = "Cant' Connect to the Host Address"
                    return false
                }
            } catch (error) {
                console.log(error)
            }

        },
        async changeMode(newMode) {
            if (newMode === 'Server' || newMode === 'Client') {
                if (newMode === 'Server') {
                    this.mode = newMode;
                    localStorage.setItem('mode', newMode);
                    this.assignHost('localhost');
                }
                this.mode = newMode;
                localStorage.setItem('mode', newMode);
                localStorage.removeItem('host');
            }
            else if (newMode === 'None') {
                localStorage.removeItem('mode');
                localStorage.removeItem('host');

                this.mode = null
                this.router.push('/connect')
            }
            else {
                this.error = 'Invalid mode. ';
            }
        },
        async checkConnection() {
            if (!this.host) {
                this.router.push('/connect')
                return
            }

            const connection = await this.connectHost(this.host.replace(':1216', ''))
            console.log(connection)
        }
    },
});
