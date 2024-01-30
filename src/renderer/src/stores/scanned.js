import { defineStore } from 'pinia'
import axios from "axios";


export const scannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        isLoading: false,
        title: "Scanned Documents",
        types: ["Birth", "Death", "Marriage", "Legal", "Other"]
    }),
    getters: {
        totalCount: (state) => {
            return state.scanned.length + 1000000
        }
    },
    actions: {
        async getScanned() {
            try {
                this.isLoading = true;
                const response = await axios.get("http://127.0.0.1:1216/scanned");
                this.scanned = response.data.scans;
                this.isLoading = false;

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async refresh() {
            try {
                this.isLoading = false;
                const response = await axios.get("http://127.0.0.1:1216/scanned");
                this.scanned = response.data.scans;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

    }
})