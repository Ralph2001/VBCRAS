import { defineStore } from 'pinia'

export const useComputerStore = defineStore('computer', {
    state: () => ({
        desktop_name: '',
    }),
    actions: {
        async getUserName() {
            try {
                const userName = await window.LocalCivilApi.getUser();
                this.desktop_name = userName;
            } catch (error) {
                console.error("Error:", error);
            }
        }

    }
})