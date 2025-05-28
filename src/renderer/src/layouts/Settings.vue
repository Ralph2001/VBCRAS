<template>
  <div class="h-full w-full">
    <Sidebar />
    <div class="h-full w-full p-10 bg-gray-100 overflow-y-auto">
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
import Sidebar from '../views/pages/Settings/component/Sidebar.vue';

const route = useRoute();


</script>
