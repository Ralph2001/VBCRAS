
import { defineStore } from 'pinia'
import axios from 'axios'


export const useForms = defineStore('forms', {
    state: () => ({
        form1a: [],
        form2a: [],
        form3a: [],
        form1b: [],
        form2b: [],
        form3b: [],
        form1c: [],
        form2c: [],
        form3c: [],
        allForms: [],
    }),
    actions: {
        // async get_all_forms() {
        //     // wait all to finish
        //     try {
        //         await Promise.all([
        //             this.get_all_form1a(),
        //             this.get_all_form2a(),
        //             this.get_all_form3a(),
        //             this.get_all_form1b(),
        //             this.get_all_form2b(),
        //             this.get_all_form3b(),
        //             this.get_all_form1c(),
        //             this.get_all_form2c(),
        //             this.get_all_form3c()
        //         ]);
        //         this.allForms = [
        //             ...this.form1a,
        //             ...this.form2a,
        //             ...this.form3a,
        //             ...this.form1b,
        //             ...this.form2b,
        //             ...this.form3b,
        //             ...this.form1c,
        //             ...this.form2c,
        //             ...this.form3c
        //         ];
        //     } catch (error) {
        //         console.error('Error fetching data:', error)
        //     }
        // },
        async get_all_form1a() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1a`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form1a = response.data
            } catch (error) {
                console.error('Error fetching data:', error)

            }
        },
        async get_form1a_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form1a(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form1a`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1a()
                return { status:true, id: response.data.id }
                
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form1a(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form1a/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1a()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form1a(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form1a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form1a()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form2A, Form3A, Form1B, Form2B, Form3B, Form1C, Form2C, Form3C

        async get_all_form2a() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2a`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form2a = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form2a_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form2a(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form2a`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form2a()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form2a(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form2a/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form2a()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form2a(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form2a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form2a()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form3A, Form1B, Form2B, Form3B, Form1C, Form2C, Form3C

        async get_all_form3a() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form3a`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form3a = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form3a_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form3a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form3a(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form3a`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form3a()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form3a(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form3a/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form3a()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form3a(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form3a/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form3a()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form1B, Form2B, Form3B, Form1C, Form2C, Form3C

        async get_all_form1b() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1b`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form1b = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form1b_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form1b(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form1b`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1b()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form1b(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form1b/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1b()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form1b(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form1b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form1b()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form2B, Form3B, Form1C, Form2C, Form3C

        async get_all_form2b() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2b`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form2b = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form2b_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form2b(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form2b`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form2b()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form2b(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form2b/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form2b()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form2b(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form2b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form2b()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form3B, Form1C, Form2C, Form3C

        async get_all_form3b() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form3b`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form3b = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form3b_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form3b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form3b(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form3b`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form3b()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form3b(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form3b/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form3b()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form3b(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form3b/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form3b()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Repeat similar actions for Form1C, Form2C, Form3C

        async get_all_form1c() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1c`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form1c = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form1c_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form1c/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        async add_form1c(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/form1c`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1c()
            } catch (error) {
                console.error('Error inserting data:', error)
            }
        },
        async edit_form1c(id, data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.put(
                    `http://${hostAdd}:1216/form1c/${id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                this.get_all_form1c()
            } catch (error) {
                console.error('Error updating data:', error)
            }
        },
        async delete_form1c(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.delete(
                    `http://${hostAdd}:1216/form1c/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.get_all_form1c()
                return true
            } catch (error) {
                console.error('Error deleting data:', error)
                return false
            }
        },

        // Actions for Form2C
        async get_all_form2c() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2c`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form2c = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_form2c_by_id(id) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2c/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                return response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
    }
}
)
