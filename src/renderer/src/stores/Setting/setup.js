import { defineStore } from 'pinia'
import axios from 'axios'


export const useSetup = defineStore('useSetup', {
    state: () => ({
        isSetupDone: false,
        municipal_civil_registrar: '',
        mayor: '',
        municipality_province: '',
        user_positions: [],
        scanned_types: []
    }),
    actions: {
        async getSystemSetting() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/system-settings`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )


                if (response.data < 1) {
                    this.isSetupDone = false
                    return false
                }
                this.municipal_civil_registrar = response.data[0].municipal_civil_registrar
                this.mayor = response.data[0].mayor
                this.municipality_province = response.data[0].municipality_province

                this.isSetupDone = true
                return true


            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async setSystemSetting(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/system-settings`,
                    data,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )

            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async addScannedType(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/add-scanned-type`,
                    data,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.refreshScannedTypes()

            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async getScannedType() {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    const response = await axios.get(
                        `http://${hostAdd}:1216/get-scanned-type`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }

                    )
                    this.scanned_types = response.data
                    console.log(response)
                } else {
                    console.log('Error')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },

        async refreshScannedTypes() {
            this.getScannedType()
        },
        // async getUserPositions() {
        //     try {
        //         const hostAdd = localStorage.getItem('host')
        //         let tokenStr = localStorage.getItem('token')
        //         const response = await axios.get(
        //             `http://${hostAdd}:1216/get-positions`,
        //             { headers: { Authorization: `Bearer ${tokenStr}` } }
        //         )

        //         this.user_positions = response.data

        //     } catch (error) {
        //         console.error('Error fetching data:', error)
        //         this.router.push('/login')
        //     }
        // },
        // async addUserPositions(data) {
        //     try {
        //         const hostAdd = localStorage.getItem('host')
        //         let tokenStr = localStorage.getItem('token')
        //         const response = await axios.post(
        //             `http://${hostAdd}:1216/add-positions`,
        //             data,
        //             { headers: { Authorization: `Bearer ${tokenStr}` } }
        //         )
        //         console.log(response)
        //         this.refreshPosition()
        //     } catch (error) {
        //         console.error('Error fetching data:', error)
        //         this.router.push('/login')
        //     }
        // },
        // async removeUserPositions(data) {
        //     try {
        //         const hostAdd = localStorage.getItem('host')
        //         let tokenStr = localStorage.getItem('token')
        //         const response = await axios.delete(
        //             `http://${hostAdd}:1216/add-position`,
        //             data,
        //             { headers: { Authorization: `Bearer ${tokenStr}` } }
        //         )
        //         this.refreshPosition()
        //     } catch (error) {
        //         console.error('Error fetching data:', error)
        //         this.router.push('/login')
        //     }
        // },
        // async refreshPosition() {
        //     this.getUserPositions()
        // },

    },
})
