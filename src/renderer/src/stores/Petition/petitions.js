import { defineStore } from 'pinia'
import axios from 'axios'

export const usePetitions = defineStore('petitions', {
    state: () => ({
        petitions: [],
        latest: null,
        cce_latest: null,
        cfn_latest: null,
        petitionData: [],
        relation_to_document_owner: ['Brother', 'Mother', 'Father', 'Sister'],
        saved_supporting: [],
        saved_clerical: []
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
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions/get-petition/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
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
        async edit_petition(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/petitions/edit-petition/${id}`,
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
                this.cce_latest = response

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
                this.cfn_latest = response
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

                this.refresh()
                return true
            } catch (error) {
                return false
            }
        },

        async refresh() {
            this.get_all_petitions()
            this.get_saved_supporting_documents()
            this.get_saved_clerical_errors()
        },

        // ADDITIONALS

        // /petitions/supporting-documents
        // /petitions/clerical-errors

        async get_saved_supporting_documents() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions/supporting-documents`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )

                this.saved_supporting = response.data.supporting_documents
                return true
            } catch (error) {
                return false
            }
        },
        async get_saved_clerical_errors() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/petitions/clerical-errors`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )

                this.saved_clerical = response.data.clerical_errors
                return true
            } catch (error) {
                return false
            }
        }
    }
})
