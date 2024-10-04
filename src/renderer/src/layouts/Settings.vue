<template>
  <div class="h-screen w-full">
    <SideBar />
    <div class="h-full w-full p-10 ">
      <div class="fixed top-0 left-0 right-0 bg-slate-100 border border-gray-300 overflow-y-scroll">
        <p class="font-medium text-xs text-gray-700  ml-72 py-1.5">{{ pageTitle }} </p>
      </div>
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


const pageTitle = computed(() => {
  /**
   * cce_date_counts
      cce_holidays
      cce_templates
   */
  switch (route.name) {
    case 'dashboard':
      return 'Dashboard';
    case 'cce_date_counts':
      return 'CCE & CFN > Date Counts';
    case 'cce_holidays':
      return 'CCE & CFN > Holidays';
    case 'cce_templates':
      return 'CCE & CFN > Templates';


    default:
      return '';
  }
});
</script>
