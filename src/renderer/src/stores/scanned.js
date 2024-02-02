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
                let tokenStr = localStorage.getItem('token')
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
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get("/scanned", { headers: { "Authorization": `Bearer ${tokenStr}` } });
                this.scanned = response.data.scans;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async addData(name, filepath, type, uploaded_by) {
            try {
                let tokenStr = localStorage.getItem('token')
                await axios.post(
                    "/scanned/add",
                    { name, filepath, type, uploaded_by },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${tokenStr}`
                        },
                    }
                )
            } catch (error) {

            }
        }

    }
})