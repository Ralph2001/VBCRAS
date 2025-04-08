import { defineStore } from 'pinia';
import { useForms } from '.';

export const useFormDestroyed = defineStore('formDestroyed', {
    state: () => ({
        form1c: [],
        form2c: [],
        form3c: [],
    }),

    actions: {
        /**
         * Birth Destroyed
         */
        async get_all_form1c() {
            const formsStore = useForms();
            await formsStore.get_all_form('form1c');
        },

        async add_form1c(data) {
            const formsStore = useForms();
            await formsStore.add_form('form1c', data);
        },

        async edit_form1c(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form1c', id, data);
        },

        async delete_form1c(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form1c', id);
        },
        /**
        * Death Destroyed
        */
        async get_all_form2c() {
            const formsStore = useForms();
            await formsStore.get_all_form('form2c');
        },

        async add_form2c(data) {
            const formsStore = useForms();
            await formsStore.add_form('form2c', data);
        },

        async edit_form2c(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form2c', id, data);
        },

        async delete_form2c(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form2c', id);
        },
        /**
        * Marriage Destroyed
        */
        async get_all_form3c() {
            const formsStore = useForms();
            await formsStore.get_all_form('form3c');
        },

        async add_form3c(data) {
            const formsStore = useForms();
            await formsStore.add_form('form3c', data);
        },

        async edit_form3c(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form3c', id, data);
        },

        async delete_form3c(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form3c', id);
        },
    },
});
