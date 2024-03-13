import { defineStore } from 'pinia'
import axios from "axios";

export const useUserData = defineStore('user_data', {
    state: () => ({
        user_data: null,
        scanned_logs: null

    }),
    actions: {
        async getUserData(user_id) {
            try {
                const hostAdd = localStorage.getItem("host");
                let tokenStr = localStorage.getItem('token')
                const userId = user_id
                const response = await axios.get(`http://${hostAdd}:1216/user/select/${userId}`,
                    { headers: { "Authorization": `Bearer ${tokenStr}` } });

                this.user_data = response.data.user_data;
                // this.username = response.data.user_data.name
                return true

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async getUserScannedLogs() {
            try {
                const hostAdd = localStorage.getItem("host");
                let tokenStr = localStorage.getItem('token')
                const user_name = this.user_data.name
                const response = await axios.get(`http://${hostAdd}:1216/scanned/log/view/${user_name}`,
                    { headers: { "Authorization": `Bearer ${tokenStr}` } });

                this.scanned_logs = response.data.logs
                // this.user_data = response.data.user_data;
                // console.log(this.username)
                console.log(response)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
    }
})