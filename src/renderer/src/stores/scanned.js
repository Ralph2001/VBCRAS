import { defineStore } from 'pinia'
import axios from "axios";

export const useScannedDocuments = defineStore('scanned', {
    state: () => ({
        scanned: [],
        asOf: ""
    }),
    getters: {
        totalCount: (state) => {
            return state.scanned.length
        },
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
        async refresh() {
            this.getScanned()
        },
        getTime() {
            this.asOf = new Date().toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Manila'
            });
        },
        async multipleAdd(data) {

            try {
                const hostAdd = localStorage.getItem("host");
                let tokenStr = localStorage.getItem('token')
                await axios.post(
                    `http://${hostAdd}:1216/scanned/add`, data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenStr}`,

                    },
                }
                )
                this.refresh()
            } catch (error) {
            }
        }
    }
})