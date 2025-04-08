import { defineStore } from 'pinia'
import axios from 'axios'

export const useScannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        scanned_types: [],
        loading: false,
        isError: false,
        errorMessage: '',
        isFetched: false
    }),
    getters: {
        totalCount: (state) => {
            return state.scanned.length
        }
    },
    actions: {
        async getScanned({
            type = null,
            year = null,
            month = null,
            search = null
        } = {}) {
            try {
                const hostAdd = localStorage.getItem('host')
                const tokenStr = localStorage.getItem('token')
                this.loading = true

                // Build query parameters based on the filter selection
                const params = {}
                if (type) params.type = type
                if (year) params.year = year
                if (month) params.month = month
                if (search) params.SearchQuery = search

                // Pass params using axios' 'params' option
                const response = await axios
                    .get(`http://${hostAdd}:1216/scanned`, {
                        headers: { Authorization: `Bearer ${tokenStr}` },
                        params,
                        timeout: 30000 // 30 Seconds Timeout
                    })
                    .catch((error) => {
                        if (error.code === 'ECONNABORTED') {
                            console.error('Request timed out')
                        } else {
                            this.isError = true
                            this.errorMessage =
                                'Something went wrong... try again later.'
                        }
                    })
                console.log(response.data)

                this.scanned = response.data
                this.loading = false
                this.isFetched = true
                return true

                // Store the filtered scanned data
            } catch (error) {
                this.isError = true
                this.errorMessage = 'Something went wrong... try again later.'
                console.error('Error fetching data:', error)
                return false
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
                    this.loading = false
                    this.scanned_types = response.data
                    console.log(response)
                } else {
                    this.loading = false
                    this.isError = true
                    this.errorMessage =
                        'Something went wrong... try again later'
                    console.log('Error')
                }
            } catch (error) {
                this.loading = false
                this.isError = true
                this.errorMessage = 'Something went wrong... try again later.'
                console.error('Error fetching data:', error)
            }
        },
        async refresh() {
            this.getScanned()
        },

        async multipleAdd(data) {
            try {
                console.log("Adding Scan: " + data)
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                await axios.post(`http://${hostAdd}:1216/scanned`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`
                    }
                })
                this.refresh()
                const status = true
                return { status }
            } catch (error) {
                this.isError = true
                this.errorMessage = 'Something went wrong... try again later.'
                const status = false
                return { error, status }
            }
        }
    }
})
