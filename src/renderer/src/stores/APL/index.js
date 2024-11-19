import { defineStore } from 'pinia'
import axios from 'axios'

export const useApplicationMarriageLicense = defineStore('useApplicationMarriageLicense', {
    state: () => ({
        application_marriage_license: [],
    }),
    actions: {
        async getApplicationMarriageLicense() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/application-marriage-license`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )

                this.application_marriage_license = response.data
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async addApplicationMarriageLicense(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const add = await axios.post(`http://${hostAdd}:1216/application-marriage-license`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                })
                this.refresh()
            } catch (error) {

            }
        },
        // async removeAusf(id) {
        //     try {
        //         const hostAdd = localStorage.getItem('host');
        //         let tokenStr = localStorage.getItem('token');
        //         const response = await axios.delete(`http://${hostAdd}:1216/ausf/${id}`, {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${tokenStr}`,
        //             },
        //         });
        //         this.refresh()
        //     } catch (error) {
        //         console.error("There was an error deleting the Ausf record: ", error);
        //     }
        // },

        async refresh() {
            this.getApplicationMarriageLicense()
        }

    },
})
