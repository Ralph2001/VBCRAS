import { defineStore } from 'pinia';
import { useForms } from '.';

export const useFormIntact = defineStore('formIntact', {
    state: () => ({
        form1b: [],
        form2b: [],
        form3b: [],
    }),

    actions: {
        /**
         * Birth Intact
         */
        async get_all_form1b() {
            const formsStore = useForms();
            await formsStore.get_all_form('form1b');
            this.form1b = formsStore.form1b;
        },

        async add_form1b(data) {
            const formsStore = useForms();
            await formsStore.add_form('form1b', data);
            this.form1b = formsStore.form1b;
        },

        async edit_form1b(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form1b', id, data);
            this.form1b = formsStore.form1b;
        },

        async delete_form1b(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form1b', id);
            this.form1b = formsStore.form1b;
        },
        /**
        * Death Intact
        */
        async get_all_form2b() {
            const formsStore = useForms();
            await formsStore.get_all_form('form2b');
            this.form2b = formsStore.form2b;
        },

        async add_form2b(data) {
            const formsStore = useForms();
            await formsStore.add_form('form2b', data);
            this.form2b = formsStore.form2b;
        },

        async edit_form2b(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form2b', id, data);
            this.form2b = formsStore.form2b;
        },

        async delete_form2b(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form2b', id);
            this.form2b = formsStore.form2b;
        },
        /**
        * Marriage Intact
        */
        async get_all_form3b() {
            const formsStore = useForms();
            await formsStore.get_all_form('form3b');
            this.form3b = formsStore.form3b;
        },

        async add_form3b(data) {
            const formsStore = useForms();
            await formsStore.add_form('form3b', data);
            this.form3b = formsStore.form3b;
        },

        async edit_form3b(id, data) {
            const formsStore = useForms();
            await formsStore.edit_form('form3b', id, data);
            this.form3b = formsStore.form3b;
        },

        async delete_form3b(id) {
            const formsStore = useForms();
            await formsStore.delete_form('form3b', id);
            this.form3b = formsStore.form3b;
        },
    },
});
