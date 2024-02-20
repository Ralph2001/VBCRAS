import { defineStore } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

export const useServerStore = defineStore("server", {
  state: () => ({
    server: localStorage.getItem("server"),
    auto: localStorage.getItem("auto"),
    host: null
  }),
  actions: {
    async isServerRunning() {
      const start_server = await window.LocalCivilApi.StartServer();
      if (!start_server) {
        return true;
      } else {
        return false
      }
    },
    isServerAutoStart() {
      if (this.auto) {
        if (this.isServerRunning()) {
          return
        } else {
          console.log('staaart')
          this.serverSwitch()
        }
      }
      return
    },
    async serverSwitch() {
      if (this.server) {
        try {
          const stop_server = await window.LocalCivilApi.StopServer();
          if (stop_server) {
            this.server = false
            localStorage.removeItem('server')
            localStorage.removeItem('host')
          }
        } catch (error) {
          console.error('Error stopping server:', error);
        }
      }
      else {
        try {
          const start_server = await window.LocalCivilApi.StartServer();
          if (start_server) {
            this.server = true
            this.host = start_server.addresses[0]
            localStorage.setItem('server', true)
            localStorage.setItem('host', '127.0.0.1:1216')
          }
        } catch (error) {
          console.error('Error starting server:', error);
        }
      }
    },
    autoServerSwitch() {
      if (this.auto) {
        this.auto = false;
        localStorage.removeItem("auto");
      } else {
        this.auto = true;
        localStorage.setItem("auto", true);
      }
    },
    serverStatus() {
      return this.server;
    },
  },
});
