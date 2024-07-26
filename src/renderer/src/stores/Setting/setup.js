import { defineStore } from 'pinia'
import axios from 'axios'


export const useSetup = defineStore('useSetup', {
    state: () => ({
        isSetupDone: false,
        municipal_civil_registrar: '',
        mayor: '',
        municipality_province: ''
    }),
    actions: {
        async getSystemSetting() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.get(
                    `http://${hostAdd}:1216/system-settings`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )


                if (response.data < 1) {
                    this.isSetupDone = false
                    return false
                }
                this.municipal_civil_registrar = response.data[0].municipal_civil_registrar
                this.mayor = response.data[0].mayor
                this.municipality_province = response.data[0].municipality_province



                console.log(response.data)

                this.isSetupDone = true
                return true


                // if (response.data) {
                //     this.isSetupDone = true
                // }

                // else {
                //     this.isSetupDone = false
                // }


            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async setSystemSetting(data) {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')
                const response = await axios.post(
                    `http://${hostAdd}:1216/system-settings`,
                    data,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )

            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
    },
})
