import { defineStore } from 'pinia'
import axios from 'axios'

export const usePetitions = defineStore('petitions', {
    state: () => ({
        petitions: [],
        latest: '',
        petitionData: [],
        relation_to_document_owner: ['Brother', 'Mother', 'Father', 'Sister']
    }),
    actions: {
        async get_all_petitions() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.petitions = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_petition_by_id(id) {
            try {
                if (!this.isFetched) {
                    const hostAdd = localStorage.getItem('host')
                    let tokenStr = localStorage.getItem('token')
                    const response = await axios.get(
                        `http://${hostAdd}:1216/petitions/get-petition/${id}`,
                        { headers: { Authorization: `Bearer ${tokenStr}` } }
                    )
                    return response.data
                } else {
                    console.log('⚡')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_petition(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/petitions/add-petition`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )

                this.refresh()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },

        async get_latest_cce() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions/latest-cce`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.latest = response
                return response
            } catch (error) {
                return false
            }
        },
        async get_latest_cfn() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions/latest-cfn`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.latest = response
                return response

            } catch (error) {
                return false
                // console.error('Error fetching data:', error)
                // this.router.push('/login')
            }
        },

        async remove_petition(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/petition/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                console.log(response)
                this.refresh()
                return true
            } catch (error) {
                return false
            }
        },

        async refresh() {
            this.get_all_petitions()
        }
    }
})
