import { defineStore } from 'pinia'
import makeRequest from '../axios'

const formKeys = [
    'form1a', 'form2a', 'form3a',
    'form1b', 'form2b', 'form3b',
    'form1c', 'form2c', 'form3c'
]

export const useForms = defineStore('forms', {
    // Pinia store for managing forms
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

    // Dito natin iloloop ngayon yung formKeys 
    actions: Object.assign(
        {},
        ...formKeys.map(formKey => {

            // Kahit wag na to pero system pang console log natin maya may sira dun sa formkey na yun
            const formattedFormName = formKey.charAt(0).toUpperCase() + formKey.slice(1)

            // AHHHHHH LALA


            /**
             * Function to fetch all forms of a specific type
             * @returns {Promise<void>}
             * @throws {Error} If the request fails
             * @description Fetches all forms of the specified type from the server and updates the state.
             */

            
            return {
                [`get_all_${formKey}`]: async function () {
                    try {
                        this[formKey] = await makeRequest('GET', formKey)
                        this.errorMessage = null
                    } catch (error) {
                        console.error(`Error fetching ${formKey}:`, error)
                        this.errorMessage = `Failed to load ${formattedFormName} data. Please try again later.`
                    }
                },

                [`get_${formKey}_by_id`]: async function (id) {
                    try {
                        return await makeRequest('GET', `${formKey}/${id}`)
                    } catch (error) {
                        console.error(`Error fetching ${formKey} by ID:`, error)
                        this.errorMessage = `Failed to fetch ${formattedFormName} details. Please try again later.`
                    }
                },

                [`add_${formKey}`]: async function (data) {
                    try {
                        const response = await makeRequest('POST', formKey, data)
                        this[formKey].push(response)
                        this.errorMessage = null
                        return { status: true, id: response.id }
                    } catch (error) {
                        console.error(`Error adding ${formKey}:`, error)
                        this.errorMessage = `Failed to add ${formattedFormName}. Please try again later.`
                    }
                },

                [`edit_${formKey}`]: async function (id, data) {
                    try {
                        const updatedForm = await makeRequest('PUT', `${formKey}/${id}`, data)
                        const index = this[formKey].findIndex(form => form.id === id)
                        if (index !== -1) this[formKey][index] = updatedForm
                        this.errorMessage = null
                    } catch (error) {
                        console.error(`Error updating ${formKey}:`, error)
                        this.errorMessage = `Failed to update ${formattedFormName}. Please try again later.`
                    }
                },

                [`delete_${formKey}`]: async function (id) {
                    try {
                        await makeRequest('DELETE', `${formKey}/${id}`)
                        this[formKey] = this[formKey].filter(form => form.id !== id)
                        this.errorMessage = null
                        return true
                    } catch (error) {
                        console.error(`Error deleting ${formKey}:`, error)
                        this.errorMessage = `Failed to delete ${formattedFormName}. Please try again later.`
                        return false
                    }
                }
            }
        })
    )
})