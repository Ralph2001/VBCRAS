import { defineStore } from 'pinia'
import makeRequest from '../axios'

import { useActivityLog } from './logs'

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
            // Kahit wag na to pero pang console log natin maya may sira dun sa formkey na yun
            const formattedFormName = formKey.charAt(0).toUpperCase() + formKey.slice(1)
            const activityLog = useActivityLog()

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
                        await activityLog.createNewLog(
                            'VIEW',
                            'Forms',
                            `User viewed a record from  ${formattedFormName}. Form ID: ${id}`,
                            'SUCCESS'
                        )

                        return await makeRequest('GET', `${formKey}/${id}`)


                    } catch (error) {
                        console.error(`Error fetching ${formKey} by ID:`, error)
                        this.errorMessage = `Failed to fetch ${formattedFormName} details. Please try again later.`

                        await activityLog.createNewLog(
                            'VIEW',
                            'Forms',
                            `Failed to view a record from ${formattedFormName}. Form ID: ${id}`,
                            'FAILED'
                        )

                    }
                },

                [`add_${formKey}`]: async function (data) {
                    try {
                        const response = await makeRequest('POST', formKey, data)
                        this[formKey].push(response)
                        this.errorMessage = null

                        await activityLog.createNewLog(
                            'CREATE',
                            'Forms',
                            `Created a new record in ${formattedFormName}. Form ID: ${response.id}`,
                            'SUCCESS'
                        )


                        return { status: true, id: response.id }
                    } catch (error) {
                        console.error(`Error adding ${formKey}:`, error)
                        this.errorMessage = `Failed to add ${formattedFormName}. Please try again later.`

                        await activityLog.createNewLog(
                            'CREATE',
                            'Forms',
                            `Attempted to create a new record in ${formattedFormName} but failed.`,
                            'FAILED'
                        )

                    }
                },

                [`edit_${formKey}`]: async function (id, data) {
                    try {
                        const updatedForm = await makeRequest('PUT', `${formKey}/${id}`, data)
                        const index = this[formKey].findIndex(form => form.id === id)
                        if (index !== -1) this[formKey][index] = updatedForm
                        this.errorMessage = null

                        await activityLog.createNewLog(
                            'UPDATE',
                            'Forms',
                            `Updated record in ${formattedFormName}. Form ID: ${id}`,
                            'SUCCESS'
                        )

                    } catch (error) {
                        console.error(`Error updating ${formKey}:`, error)
                        this.errorMessage = `Failed to update ${formattedFormName}. Please try again later.`

                        await activityLog.createNewLog(
                            'UPDATE',
                            'Forms',
                            `Attempted to update record in ${formattedFormName} but failed.`,
                            'FAILED'
                        )
                    }
                },

                [`delete_${formKey}`]: async function (id) {
                    try {
                        await makeRequest('DELETE', `${formKey}/${id}`)
                        this[formKey] = this[formKey].filter(form => form.id !== id)
                        this.errorMessage = null

                        await activityLog.createNewLog(
                            'DELETE',
                            'Forms',
                            `Deleted a record from ${formattedFormName}.\n\nForm ID: ${id}`,
                            'SUCCESS'
                        )
                        return true
                    } catch (error) {
                        console.error(`Error deleting ${formKey}:`, error)
                        this.errorMessage = `Failed to delete ${formattedFormName}. Please try again later.`

                        await activityLog.createNewLog(
                            'DELETE',
                            'Forms',
                            `Attempted to delete a record from ${formattedFormName} but failed. Form ID: ${id}`,
                            'FAILED'
                        )

                        return false
                    }
                }
            }
        })
    )
})