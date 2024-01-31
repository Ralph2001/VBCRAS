import { defineStore } from 'pinia'
import axios from "axios";
import { useRouter } from "vue-router"


const router = useRouter();

export const scannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        isLoading: false,
        title: "Scanned Documents",
        types: ["Birth", "Death", "Marriage", "Legal", "Other"]
    }),
    getters: {
        totalCount: (state) => {
            return state.scanned.length
        }
    },
    actions: {
        async getScanned() {
            try {
                this.isLoading = true;
                let tokenStr = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjY4NjU1NCwianRpIjoiN2Y1YjlmMGUtZTM4My00ZDAyLWE2YTUtZjEzMTI2ZjM3MzA0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzA2Njg2NTU0LCJjc3JmIjoiNzhlZTU3OGUtODhhMS00M2NkLTlhN2ItNzgxMzQ5YThjYjBkIiwiZXhwIjoxNzA2Njg3NDU0fQ.0IKPkXbAAYHrIIUpYBU37lX7sIEeTYMPbLVcErFUUto';
                const response = await axios.get("/scanned", { headers: { "Authorization": `Bearer ${tokenStr}` } });
                this.scanned = response.data.scans;
                this.isLoading = false;

            } catch (error) {
                console.error("Error fetching data:", error);
                this.router.push('/login')
            }
        },
        async refresh() {
            try {
                this.isLoading = false;
                const response = await axios.get("/scanned");
                this.scanned = response.data.scans;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

    }
})