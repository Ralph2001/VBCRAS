<template>
  <div class="h-screen w-full">
    <SideBar />
    <div class="h-full w-full p-10 bg-slate-200">
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from '../views/pages/Settings/component/SideBar.vue';

const route = useRoute();


</script>
