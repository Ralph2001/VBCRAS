import { defineStore } from 'pinia'
import axios from 'axios'

export const useActivityLog = defineStore('useActivityLog', {
    state: () => ({
        logs: [],
        selectedLog: null,
    }),

    actions: {
        getAuthHeaders() {
            const tokenStr = localStorage.getItem('token')
            return {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenStr}`,
            }
        },

        getBaseUrl() {
            const hostAdd = localStorage.getItem('host')
            return `http://${hostAdd}:1216/logs`
        },

        async createNewLog(action, module, details = '', status = 'SUCCESS') {
            try {
                const payload = { action, module, details, status }
                const response = await axios.post(this.getBaseUrl(), payload, {
                    headers: this.getAuthHeaders(),
                })
                console.log('Activity Log Created:', response.data)
                return response.data
            } catch (error) {
                console.error('Failed to create activity log:', error)
                return false
            }
        },

        async fetchAllLogs() {
            try {
                const response = await axios.get(this.getBaseUrl(), {
                    headers: this.getAuthHeaders(),
                })
                this.logs = response.data.items
            } catch (error) {
                console.error('Error fetching activity logs:', error)
            }
        },

        async fetchPaginatedLogs({ page = 1, pageSize = 20, filters = {}, sortField = 'timestamp', sortOrder = 'desc' }) {
            const hostAdd = localStorage.getItem('host')
            const tokenStr = localStorage.getItem('token')

            const params = new URLSearchParams({
                page,
                page_size: pageSize,
                sort: sortField,
                order: sortOrder,
                ...filters,
            })

            const response = await axios.get(`http://${hostAdd}:1216/logs?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${tokenStr}`,
                },
            })

            return response
        },


        async fetchLogById(id) {
            try {
                const response = await axios.get(`${this.getBaseUrl()}/${id}`, {
                    headers: this.getAuthHeaders(),
                })
                this.selectedLog = response.data
                return response.data
            } catch (error) {
                console.error(`Error fetching log ID ${id}:`, error)
                return false
            }
        },

        async updateLog(id, updatedData) {
            try {
                const response = await axios.put(`${this.getBaseUrl()}/${id}`, updatedData, {
                    headers: this.getAuthHeaders(),
                })
                console.log('Activity Log Updated:', response.data)
                this.fetchAllLogs()
                return response.data
            } catch (error) {
                console.error(`Error updating log ID ${id}:`, error)
                return false
            }
        },

        async deleteLog(id) {
            try {
                await axios.delete(`${this.getBaseUrl()}/${id}`, {
                    headers: this.getAuthHeaders(),
                })
                console.log(`Activity Log ID ${id} deleted.`)
                this.fetchAllLogs()
                return true
            } catch (error) {
                console.error(`Error deleting log ID ${id}:`, error)
                return false
            }
        },
    },
})
