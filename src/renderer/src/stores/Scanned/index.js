import { defineStore } from 'pinia'
import axios from 'axios'

export const useScannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        scanned_types: [],
        loading: false,
        isFetched: false,
    }),
    getters: {
        totalCount: (state) => {
            return state.scanned.length
        },
    },
    actions: {
        async getScanned() {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    this.loading = true
                    const response = await axios.get(
                        `http://${hostAdd}:1216/scanned`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }

                    )
                    console.log(response)
                    this.scanned = response.data
                    this.loading = false
                    this.isFetched = true
                    // this.scanned = response.data.scans
                } else {
                    console.log('⚡')
                }
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
                    this.loading = true
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

            }
        },
        async refresh() {
            this.getScanned()
        },

        async multipleAdd(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                await axios.post(`http://${hostAdd}:1216/scanned`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                })
                this.refresh()
                const status = true
                return { status }
            } catch (error) {
                const status = false
                return { error, status }
            }
        },

    },
})
