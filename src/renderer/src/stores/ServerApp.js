import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'


export const useServerStore = defineStore('server', {
    state: () => ({
    }),
    actions: {
        async isServerRunning() {
            try {
                const isit_running = await window.LocalCivilApi.IsServerRunning()
                if (isit_running) {
                    return true
                }
                return false
            } catch (error) {
                return false
            }
        },

        async start_server() {
            try {
                if (await this.isServerRunning()) {
                    localStorage.setItem('host', '127.0.0.1')
                    localStorage.setItem('mode', 'server')
                    return true
                }
                else {
                    const start = await window.LocalCivilApi.StartServer()

                    if (start.success) {
                        localStorage.setItem('host', '127.0.0.1')
                        localStorage.setItem('mode', 'server')
                        this.router.push('/login')


                        return true
                    }
                    return false
                }
            } catch (error) {
                return false
            }
        },

        async close_server() {
            try {
                const close = await await window.LocalCivilApi.StopServer()
                if (close) {
                    localStorage.removeItem('host')
                    localStorage.removeItem('mode')
                    this.router.push('/')
                    return true
                }
                return false
            } catch (error) {
                console.log(error)
                return false
            }
        }


        // async serverSwitch() {
        //     try {
        //         const server_running = await this.isServerRunning()
        //         if (server_running) {
        //             const stop_server = await window.LocalCivilApi.StopServer()
        //             if (stop_server) {
        //                 this.server = false

        //                 localStorage.removeItem('server')
        //                 localStorage.removeItem('host')
        //             }
        //         } else {
        //             const start_server =
        //                 await window.LocalCivilApi.StartServer()
        //             if (start_server) {
        //                 this.server = true
        //                 this.serverAddress = start_server.addresses[0]
        //                 localStorage.setItem(
        //                     'serverAddress',
        //                     start_server.addresses[0]
        //                 )
        //                 localStorage.setItem('server', true)
        //                 localStorage.setItem('host', '127.0.0.1')

        //                 // setTimeout(() => {
        //                 //   this.router.push('/server/login')
        //                 // }, 3000);
        //             } else {
        //                 this.server = true
        //             }
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
    },
})
