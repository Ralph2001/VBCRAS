import { defineStore } from 'pinia'
import axios from "axios";

export const useScannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
    }),
    getters: {
        // totalCount: (state) => {
        //     return state.scanned.length
        // },
    },
    actions: {
        async getScanned() {
            try {
                const hostAdd = localStorage.getItem("host");
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(`http://${hostAdd}:1216/scanned`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
                this.scanned = response.data.scans;

            } catch (error) {
                console.error("Error fetching data:", error);
                this.router.push('/login')
            }
        },
    }
})