import { defineStore } from 'pinia'
import axios from 'axios'

export const useRecords = defineStore('records', {
    state: () => ({
        records: [],
        latest: null,
    }),
    actions: {
        async getRecords() {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    const response = await axios.get(
                        `http://${hostAdd}:1216/records`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }
                    )
                    this.records = response.data.record_data
                    console.log('⚡')
                } else {
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async addRecord(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                await axios.post(`http://${hostAdd}:1216/records/add`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenStr}`,
                    },
                })
                const status = true
                this.refresh()
                return { status }
            } catch (error) {
                const status = false
                return { error, status }
            }
        },
        async refresh() {
            this.getRecords()
        },
    },
})
