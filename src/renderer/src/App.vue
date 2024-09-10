<template>
  <div class="h-screen relative">
    <router-view v-slot="{ Component }">
      <transition mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
   
  </div>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('Alt', (e) => {
  e.preventDefault()
})
</script>
