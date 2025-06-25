<template>
  <div class="h-screen relative mainHTML scale-70 bg-[#F7FAFC]">

    <Noice />
    <NavBar />
    <Menu />
    <ToastContainer />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import NavBar from "../components/client/NavBar.vue";
import Menu from "../components/Menu.vue";
import Noice from "./Noice.vue";
import ToastContainer from "../components/ToastContainer.vue";

// onMounted(() => {
//   window.UpdateApi.onUpdateCheck((event, info) => {
//     console.log('Checking for updates:', info);
//   });

//   window.UpdateApi.onUpdateAvailable((event, info) => {
//     console.log('Update available:', info);
//   });
//   window.UpdateApi.onUpdateNotAvailable((event, info) => {
//     console.log('Update not available:', info);
//   });

//   window.UpdateApi.onUpdateDownloaded((event, info) => {
//     console.log('Update downloaded:', info);
//   });

//   window.UpdateApi.onUpdateError((event, errorMessage) => {
//     console.error('Update error:', errorMessage);
//   });
//   window.UpdateApi.appVersion((event, app_versiong) => {
//     console.log('Hi')
//   });
// })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;

}

.fade-enter-to {
  opacity: 1;

}

.fade-leave-from {
  opacity: 1;

}

.fade-leave-to {
  opacity: 0;

}
</style>