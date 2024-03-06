import { defineStore } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

export const useServerStore = defineStore("server", {
  state: () => ({
    server: localStorage.getItem("server"),
    auto: localStorage.getItem("auto"),
    serverAddress: localStorage.getItem("serverAddress"),
  }),
  actions: {
    async isServerRunning() {
      const isit_running = await window.LocalCivilApi.IsServerRunning();
      if (isit_running) {
        localStorage.setItem('host', '127.0.0.1')
        return true
      }
      return false
    },
    async serverSwitch() {
      try {
        const server_running = await this.isServerRunning()
        if (server_running) {
          const stop_server = await window.LocalCivilApi.StopServer();
          if (stop_server) {
            this.server = false
            localStorage.removeItem('serverAddress')
            localStorage.removeItem('server')
            localStorage.removeItem('host')
          }
        } else {
          const start_server = await window.LocalCivilApi.StartServer();
          if (start_server) {
            this.server = true
            this.serverAddress = start_server.addresses[0]
            localStorage.setItem('serverAddress', start_server.addresses[0])
            localStorage.setItem('server', true)
            localStorage.setItem('host', '127.0.0.1')

            setTimeout(() => {
              this.router.push('/server/login')
            }, 3000);
          } else {
            this.server = true
          }

        }
      } catch (error) {
        console.log(error)
      }
    }
  },
});
