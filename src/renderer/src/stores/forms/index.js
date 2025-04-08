import { defineStore } from 'pinia';
import makeRequest from '../../axios';

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
        errorMessage: null,
        loading: false,
    }),

    actions: {
        async get_all_form(formType) {
            try {
                this.loading = true;
                this[formType] = await makeRequest('GET', formType);
                this.errorMessage = null;
            } catch (error) {
                console.error(`Error fetching ${formType}:`, error);
                this.errorMessage = `Failed to load ${formType} data. Please try again later.`;
            } finally {
                this.loading = false;
            }
        },

        async add_form(formType, data) {
            try {
                const response = await makeRequest('POST', formType, data);
                this[formType].push(response); // Add new form to the state
                this.errorMessage = null;
                return { status: true, id: response.id };
            } catch (error) {
                console.error(`Error adding ${formType}:`, error);
                this.errorMessage = `Failed to add ${formType}. Please try again later.`;
            }
        },

        async edit_form(formType, id, data) {
            try {
                const updatedForm = await makeRequest('PUT', `${formType}/${id}`, data);

                // Find the form and update it in the state
                const index = this[formType].findIndex(form => form.id === id);
                if (index !== -1) {
                    this[formType][index] = updatedForm;
                }

                this.errorMessage = null;
            } catch (error) {
                console.error(`Error updating ${formType}:`, error);
                this.errorMessage = `Failed to update ${formType}. Please try again later.`;
            }
        },

        async delete_form(formType, id) {
            try {
                await makeRequest('DELETE', `${formType}/${id}`);
                this[formType] = this[formType].filter(form => form.id !== id);
                this.errorMessage = null;
                return true;
            } catch (error) {
                console.error(`Error deleting ${formType}:`, error);
                this.errorMessage = `Failed to delete ${formType}. Please try again later.`;
                return false;
            }
        },
    },
});
