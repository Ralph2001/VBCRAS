import { defineStore } from 'pinia'
import axios from 'axios'

export const useAusf = defineStore('useAusf', {
    state: () => ({
        ausf: [],
        is_fetched: false
    }),
    actions: {
        async getAUSF() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/ausf`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                console.log(response)
                this.ausf = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async addAusf(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const add = await axios.post(`http://${hostAdd}:1216/ausf`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                })
                this.refresh()
            } catch (error) {

            }
        },
        async removeAusf(id) {
            try {
                const hostAdd = localStorage.getItem('host');
                let tokenStr = localStorage.getItem('token');
                const response = await axios.delete(`http://${hostAdd}:1216/ausf/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                });
                this.refresh()
            } catch (error) {
                console.error("There was an error deleting the Ausf record: ", error);
            }
        },

        async refresh() {
            this.getAUSF()
        }

    },
})
