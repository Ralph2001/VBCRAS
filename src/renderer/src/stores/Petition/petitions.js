import { defineStore } from 'pinia'
import axios from 'axios'

export const usePetitions = defineStore('petitions', {
    state: () => ({
        petitions: [],
        latest: null,
    }),
    actions: {
        async getPetitions() {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    const response = await axios.get(
                        `http://${hostAdd}:1216/petitions`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }
                    )
                    this.petitions = response.data.petitions
                    console.log(response)
                } else {
                    console.log('⚡')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async getLatestPetition() {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    const response = await axios.get(
                        `http://${hostAdd}:1216/petitions/latest/petition_number`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }
                    )
                    this.latest = response.data.petitions
                    console.log(this.latest)
                    return true
                } else {
                    return false
                    console.log('⚡')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async addPetition(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                await axios.post(`http://${hostAdd}:1216/petitions/add`, data, {
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
            this.getPetitions()
        },
    },
})
