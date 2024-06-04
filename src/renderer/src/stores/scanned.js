import { defineStore } from 'pinia'
import axios from 'axios'

export const useScannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        loading: false,
        isFetched: false,
        viewMode: localStorage.getItem('SviewMode'),
        OpenMode: localStorage.getItem('SOpenMode')
            ? localStorage.getItem('SOpenMode')
            : 'OpenSideBar',
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
                    this.loading = false
                    this.isFetched = true
                    this.scanned = response.data.scans
                } else {
                    console.log('⚡')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async refresh() {
            this.getScanned()
        },
        getTime() {
            this.asOf = new Date().toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Manila',
            })
        },
        changeViewMode() {
            if (this.viewMode) {
                this.viewMode = ''
                localStorage.removeItem('SviewMode')
            } else {
                this.viewMode = true
                localStorage.setItem('SviewMode', true)
            }
        },
        changeOpeningMode(data) {
            this.OpenMode = data
            localStorage.setItem('SOpenMode', this.OpenMode)
        },
        async multipleAdd(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                await axios.post(`http://${hostAdd}:1216/scanned/add`, data, {
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
        async add_log(data) {
            const hostAdd = localStorage.getItem('host')
            let tokenStr = localStorage.getItem('token')
            const add_log = await axios.post(
                `http://${hostAdd}:1216/scanned/log/add`,
                data,
                { headers: { Authorization: `Bearer ${tokenStr}` } }
            )

            console.log(add_log)
            if (add_log) {
                return true
            }
            return false
        },
        async deleteRecord(id, device_used) {
            const valueID = id
            const device_used_to_delete = device_used
            let tokenStr = localStorage.getItem('token')
            const host = localStorage.getItem('host')
            axios
                .delete(
                    `http://${host}:1216/scanned/delete/${valueID}&${device_used_to_delete}`,
                    {
                        headers: { Authorization: `Bearer ${tokenStr}` },
                    }
                )
                .then((response) => {
                    this.refresh()
                })
        },
    },
})
