<template>
  <div class="h-screen">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>