import { defineStore } from 'pinia';
import { useForms } from '.';

export const useFormAvailable = defineStore('formAvailable', {
    state: () => ({
        form1a: [],
        form2a: [],
        form3a: [],
    }),

    actions: {
        /**
         * Birth Available
         */
        async get_all_form1a() {
            const formsStore = useForms();
            await formsStore.get_all_form('form1a');
            this.form1a = formsStore.form1a;
        },

        async add_form1a(data) {
            const formsStore = useForms();
            await formsStore.add_form('form1a', data);
            this.form1a = formsStore.form1a;
        },

        async edit_form1a(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form1a', id, data);
            this.form1a = formsStore.form1a;
        },

        async delete_form1a(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form1a', id);
            this.form1a = formsStore.form1a;
        },
        /**
        * Death Available
        */
        async get_all_form2a() {
            const formsStore = useForms();
            await formsStore.get_all_form('form2a');
            this.form2a = formsStore.form2a;
        },

        async add_form2a(data) {
            const formsStore = useForms();
            await formsStore.add_form('form2a', data);
            this.form2a = formsStore.form2a;
        },

        async edit_form2a(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form2a', id, data);
            this.form2a = formsStore.form2a;
        },

        async delete_form2a(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form2a', id);
            this.form2a = formsStore.form2a;
        },
        /**
        * Marriage Available
        */
        async get_all_form3a() {
            const formsStore = useForms();
            await formsStore.get_all_form('form3a');
            this.form3a = formsStore.form3a;
        },

        async add_form3a(data) {
            const formsStore = useForms();
            await formsStore.add_form('form3a', data);
            this.form3a = formsStore.form3a;
        },

        async edit_form3a(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form3a', id, data);
            this.form3a = formsStore.form3a;
        },

        async delete_form3a(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form3a', id);
            this.form3a = formsStore.form3a;
        },
    },
});
