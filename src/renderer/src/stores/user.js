import { defineStore } from 'pinia'

export const ComputerName = defineStore('computername', {
    state: () => ({
        user: '',
    }),
    getters: {

    },
    actions: {
        async getUserName() {
            try {
                const userName = await window.LocalCivilApi.getUser();
                this.user = userName;
            } catch (error) {
                console.error("Error:", error);
            }
        }

    }
})