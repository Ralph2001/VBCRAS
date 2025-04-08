
import { defineStore } from 'pinia'
import axios from 'axios'
import makeRequest from '../axios';

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
        errorMessage: null
    }),
    actions: {
        async get_all_form1a() {
            try {
                this.form1a = await makeRequest('GET', 'form1a');
                this.errorMessage = null; // Clear previous errors on success
            } catch (error) {
                console.error('Error fetching form1a:', error);
                this.errorMessage = 'Failed to load Form1a data. Please try again later.';
            }
        },

        async get_form1a_by_id(id) {
            try {
                return await makeRequest('GET', `form1a/${id}`);
            } catch (error) {
                console.error('Error fetching form1a by ID:', error);
                this.errorMessage = 'Failed to fetch the form details. Please try again later.';
            }
        },

        async add_form1a(data) {
            try {
                const response = await makeRequest('POST', 'form1a', data);
                this.form1a.push(response);
                this.errorMessage = null;
                return { status: true, id: response.id };
            } catch (error) {
                console.error('Error inserting data:', error);
                this.errorMessage = 'Failed to add the form. Please try again later.';
            }
        },

        async edit_form1a(id, data) {
            try {
                const updatedForm = await makeRequest('PUT', `form1a/${id}`, data);

                const index = this.form1a.findIndex(form => form.id === id);
                if (index !== -1) {
                    this.form1a[index] = updatedForm;
                }

                this.errorMessage = null;
            } catch (error) {
                console.error('Error updating data:', error);
                this.errorMessage = 'Failed to update the form. Please try again later.';
            }
        },

        async delete_form1a(id) {
            try {
                await makeRequest('DELETE', `form1a/${id}`);
                this.form1a = this.form1a.filter(form => form.id !== id);

                this.errorMessage = null;
                return true;
            } catch (error) {
                console.error('Error deleting data:', error);
                this.errorMessage = 'Failed to delete the form. Please try again later.';
                return false;
            }
        },

        

        async get_all_form2a() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/form2a`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.form2a = response.data
                return true
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
                return true
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
                return true
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
                return true
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
                return true
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
                return true
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
                return true
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
