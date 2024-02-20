
<template>
    <div class="h-screen mx-auto container " @keyup.ctrl.space="sayHi()">
        <NavBar />
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
    transition: opacity 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    /* transform: rotateX(-100px); */

}
</style>

<script setup>
import NavBar from '../components/client/NavBar.vue'

const sayHi = () => {

    console.log('Hi Ralph')
}
</script>