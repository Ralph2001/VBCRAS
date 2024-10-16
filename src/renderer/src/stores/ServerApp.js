import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useHostStore } from './Connection'
import { useModeStore } from './mode'

export const useServerStore = defineStore('server', {
    state: () => ({

    }),
    actions: {
        async isServerRunning() {
            try {
                const isit_running = await window.LocalCivilApi.IsServerRunning()
                return isit_running
            } catch (error) {
                return false
            }
        },

        async start_server() {
            const connection = useHostStore()
            const mode = useModeStore()


            try {
                if (await this.isServerRunning()) {
                    connection.host = '127.0.0.1'
                    mode.mode = 'server'

                    localStorage.setItem('host', '127.0.0.1')
                    localStorage.setItem('mode', 'server')
                    return true
                } else {
                    const start = await window.LocalCivilApi.StartServer()
                    if (start.success) {
                        connection.host = '127.0.0.1'
                        mode.mode = 'server'

                        localStorage.setItem('host', '127.0.0.1')
                        localStorage.setItem('mode', 'server')

                        setTimeout(() => {
                            this.router.push('/login')
                        }, 500) // Delay para may time commonnect

                        return true
                    }
                    return false
                }
            } catch (error) {
                return false
            }
        },

        async close_server() {
            const connection = useHostStore()
            const mode = useModeStore()

            try {
                const close = await window.LocalCivilApi.StopServer()
                if (close) {
                    connection.host = ''
                    mode.mode = ''

                    localStorage.removeItem('host')
                    localStorage.removeItem('mode')
                    this.router.push('/')          // Use router to navigate
                    return true
                }
                return false
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
})
