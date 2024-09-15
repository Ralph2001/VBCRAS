import { defineStore } from 'pinia'
import axios from 'axios'

export const useSetup = defineStore('useSetup', {
    state: () => ({
        isSetupDone: true,
        defaults: [],
        user_positions: [],
        scanned_types: [],
        holidays: []
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
                this.defaults = response.data
                this.isSetupDone = true
                return true
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
            return true
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
                return true
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
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
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

        async getHolidays() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')

                const response = await axios.get(
                    `http://${hostAdd}:1216/get-holidays`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.holidays = response.data
                console.log(response)
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },

        async addHolidays(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/add-holiday`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.getHolidays()
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async removeHoliday(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/remove-holiday/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.getHolidays()
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        }
    }
})
