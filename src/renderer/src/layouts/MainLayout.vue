<template>
  <div class="h-screen relative mainHTML scale-70 bg-[#FDFDFE]">

    <NavBar />
    <Menu />

    <router-view v-slot="{ Component }">
      <transition mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import NavBar from "../components/client/NavBar.vue";
import Menu from "../components/Menu.vue";


onMounted(() => {
  window.UpdateApi.onUpdateCheck((event, info) => {
    console.log('Checking for updates:', info);
  });

  window.UpdateApi.onUpdateAvailable((event, info) => {
    console.log('Update available:', info);
  });
  window.UpdateApi.onUpdateNotAvailable((event, info) => {
    console.log('Update not available:', info);
  });

  window.UpdateApi.onUpdateDownloaded((event, info) => {
    console.log('Update downloaded:', info);
  });

  window.UpdateApi.onUpdateError((event, errorMessage) => {
    console.error('Update error:', errorMessage);
  });
  window.UpdateApi.appVersion((event, app_versiong) => {
    console.log('Hi')
  });
})
</script>
