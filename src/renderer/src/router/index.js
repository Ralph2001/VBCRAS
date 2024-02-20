import { useModeStore } from "../stores/mode";
import { useHostStore } from "../stores/connection";
import { AuthStore } from "../stores/clientAuth";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Mode.vue"),
      beforeEnter: (to, from) => {
        const mode = useModeStore();
        if (mode.checkMode()) {
          const storedMode = localStorage.getItem("mode");
          return { name: storedMode }; // if (mode) { return to mode client || server } else { return to home }
        }
        return true;
      },
    },
    {
      path: "/mode/",
      name: "mode",
      children: [
        {
          path: "server",
          component: () => import("../views/ServerMode.vue"),
          name: "server",
          beforeEnter: (to, from) => {
            const mode = useModeStore();

            const storedMode = localStorage.getItem("mode");
            if (mode.checkMode() && storedMode == "server") {
              // make sure
              return true;
            } else {
              return { name: "home" };
            }
          },
        },
        {
          path: "client",
          component: () => import("../views/ClientMode.vue"),
          name: "client",
          beforeEnter: async (to, from) => {
            const mode = useModeStore();
            const con = useHostStore();
            const storedMode = localStorage.getItem("mode");
            const connection = await con.isConnected()

            if (mode.checkMode() && storedMode == "client") {
              if (connection) {
                return { name: "client_login" };
              } else {
                return true;
              }
            } else {
              return { name: "home" };
            }
          },
        },
      ],
    },
    {
      path: "/server/login",
      name: "server_login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/server/",
      name: "server_page",
      component: () => import("../layouts/Server.vue"),
      children: [
        {
          path: "dashboard",
          component: () => import("../views/server/Dashboard.vue"),
          name: "server_dashboard",
        },
        {
          path: "users",
          component: () => import("../views/server/Users.vue"),
          name: "server_users",
        },
      ],
    },

    // Client Login
    {
      path: "/client/login",
      name: "client_login",
      component: () => import("../views/client/Login.vue"),
      beforeEnter: async (to, from) => {
        const auth = AuthStore();
        const con = useHostStore();
        const storedMode = localStorage.getItem("mode");
        const authKey = await auth.isAuthenticated();
        const connection = await con.isConnected()

        if (storedMode === "client") {
          if (connection) {
            if (authKey) {
              return { name: "client_welcome" }; // isAuthenticated go to login
            }
            return true; // isconnected go to login
          } else {
            return { name: "client" }; // isnotconnected go to connection
          }
        } else {
          return { name: "home" }; // not client go to home
        }
      },
    },
    {
      path: "/client/signup",
      name: "client_signup",
      component: () => import("../views/client/Signup.vue"),
      beforeEnter: async (to, from) => {

        const con = useHostStore();
        const storedMode = localStorage.getItem("mode");
        const connection = await con.isConnected()

        if (storedMode === "client") {
          if (connection) {
            return true; // isconnected go to signup
          } else {
            return { name: "client" }; // isnotconnected go to connection
          }
        } else {
          return { name: "home" }; // not client go to home
        }
      },
    },
    {
      path: "/client/",
      name: "client_page",
      component: () => import("../layouts/Client.vue"),
      beforeEnter: async (to, from) => {
        const auth = AuthStore();
        const con = useHostStore();
        const authKey = await auth.isAuthenticated();
        const connection = await con.isConnected()
        if (connection) {
          if (authKey) {
            return true;
          }
          return { name: "client" }
        }
        return { name: "client" };
      },
      children: [
        {
          path: "welcome",
          name: "client_welcome",
          component: () => import("../views/client/Welcome.vue"),
          beforeEnter: async (to, from) => {
            const auth = AuthStore();
            const authKey = await auth.isAuthenticated();
            const con = useHostStore();
            const connection = await con.isConnected()
            if (connection) {
              if (authKey) {
                return true;
              }
              return { name: "client" }
            }
            return { name: "client" };
          },
        },

        {
          path: "scanned",
          name: "client_scanned",
          component: () => import("../views/client/Scanned.vue"),
          beforeEnter: async (to, from) => {
            const auth = AuthStore();
            const authKey = await auth.isAuthenticated();
            const con = useHostStore();
            const connection = await con.isConnected()
            if (connection) {
              if (authKey) {
                return true;
              }
              return { name: "client" }
            }
            return { name: "client" };
          },
        },
      ],
    },
  ],
});

export default router;
