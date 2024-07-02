import { defineStore } from "pinia";
import { useRouter } from "vue-router";



export const useModeStore = defineStore("mode", {

  state: () => ({
    mode: localStorage.getItem("mode"),
  }),
  actions: {
    changeMode(val) {
      const validModes = ["client", "server"];

      if (!validModes.includes(val)) {
        console.log("Invalid Mode:", val);
        return;
      }

      this.mode = val;
      localStorage.setItem("mode", val);
      this.router.push(`/mode/${val}`);
    },
    getMode() {
      if (!this.mode) {
        return;
      }
      return this.mode;
    },
    checkMode() {
      // Used in vue-router

      // if (!this.mode) {
      //   this.router.push("/");
      // } else if (this.mode === "server") {
      //   this.router.push("/mode/server");
      // } else if (this.mode === "client") {
      //   this.router.push("/mode/client");
      // }

      if (this.mode) {
        return true;
      }
      return false;
    },
    removeMode() {
      this.mode = null;
      localStorage.removeItem("mode");
      this.router.push("/");
    },
  },
});
