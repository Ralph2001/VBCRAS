import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useHostStore } from "./connection";
import { ref } from "vue";

const router = useRouter();

export const useServerAuthStore = defineStore("ServerAuth", {
    state: () => ({
        token: localStorage.getItem("token"),
        user: "",
        error: "",
    }),
    getters: {},
    actions: {
        async login(password) {
            try {
                const host = useHostStore();
                const hostAddress = localStorage.getItem('host')
                const username = 'admin'
                const response = await axios.post(
                    "http://" + hostAddress + ":1216/login",
                    { username, password },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.token = response.data.token;
                localStorage.setItem("token", this.token);
                this.router.push("/server/Dashboard");
            } catch (error) {
                console.log(error)
                this.error = error.response.data.error;
            }
        },
        async isServerAuthenticated() {
            const token = localStorage.getItem("token");
            if (token) {
                const host = useHostStore();
                const hostAddress = host.host;
                const tokenStr = token;
                try {
                    const user = await axios.get("http://" + hostAddress + ":1216/user", {
                        headers: { Authorization: `Bearer ${tokenStr}` },
                    });
                    this.user = user.data.username;
                    console.log(user)
                    return true;
                } catch (error) {
                    localStorage.removeItem("token");
                    return false;
                }
            } else {
                localStorage.removeItem("token");
                return false;
            }
        },
        UserLogout() {
            this.token = null
            localStorage.removeItem("token");
            this.router.push('/server/login')
        }
    },
});
