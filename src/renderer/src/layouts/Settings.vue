<template>
  <div class="flex h-auto ">
    <Sidebar />
    <div class="flex-1 p-10 bg-gray-100 overflow-y-auto">
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
import Sidebar from '../views/pages/Settings/component/Sidebar.vue'; // Adjust path if needed

const route = useRoute();
</script>