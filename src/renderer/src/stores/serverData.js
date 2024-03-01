import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useHostStore } from "./connection";
import { ref } from "vue";

const router = useRouter();

export const useServerDataStore = defineStore("ServerData", {
    state: () => ({
        token: localStorage.getItem("token"),
        users: []
    }),
    getters: {},
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
        }
    },
});
