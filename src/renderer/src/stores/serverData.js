import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useHostStore } from "./connection";
import { ref } from "vue";

const router = useRouter();

export const useServerDataStore = defineStore("ServerData", {
    state: () => ({
        token: localStorage.getItem("token"),
        scanned_logs: []
    }),
    getters: {
        get_scanned(state) {
            return state.scanned_logs
        }
    },
    actions: {
        async getAllUser() {
            const token = localStorage.getItem("token");
            if (token) {
                const hostAddress = localStorage.getItem('host');
                const tokenStr = token;
                try {
                    const users = await axios.get("http://" + hostAddress + ":1216/users", {
                        headers: { Authorization: `Bearer ${tokenStr}` },
                    });
                    this.users = users.data.users
                    return true;
                } catch (error) {
                    localStorage.removeItem("token");
                    return false;
                }
            } else {
                localStorage.removeItem("token");
                return false;
            }
        }, async getScannedLog() {
            const token = localStorage.getItem("token");
            if (token) {
                const hostAddress = localStorage.getItem('host');
                const tokenStr = token;
                try {
                    const scanned_logs_data = await axios.get("http://" + hostAddress + ":1216/scanned/log/view", {
                        headers: { Authorization: `Bearer ${tokenStr}` },
                    });
                    this.scanned_logs = scanned_logs_data.data.scans
                    return true;
                } catch (error) {
                    localStorage.removeItem("token");
                    return false;
                }
            } else {
                localStorage.removeItem("token");
                return false;
            }
        }
    },
});
