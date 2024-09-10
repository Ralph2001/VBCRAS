import { defineStore } from "pinia";
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
      // this.router.push(`/mode/${val}`);
    },
    getMode() {
      if (!this.mode) {
        return;
      }
      return this.mode;
    },
    checkMode() {
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
