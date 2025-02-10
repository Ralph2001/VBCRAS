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
        async removeApplicationMarriageLicense(id) {
            try {
                const hostAdd = localStorage.getItem('host');
                let tokenStr = localStorage.getItem('token');
                const response = await axios.delete(`http://${hostAdd}:1216/application-marriage-license/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                });
                this.refresh()
                return true
            } catch (error) {
                console.error("There was an error deleting the Marriage License record: ", error);
                return false
            }
        },
        async getApplicationMarriageLicenseById(id) {
            try {
                const hostAdd = localStorage.getItem('host');
                let tokenStr = localStorage.getItem('token');
                const response = await axios.get(
                    `http://${hostAdd}:1216/application-marriage-license/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )


                return response
            } catch (error) {
                return false
            }
        },

        async refresh() {
            this.getApplicationMarriageLicense()
        }

    },
})
