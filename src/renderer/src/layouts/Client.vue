<template>
    <div class="h-screen relative px-4">
        <NavBar />
        <router-view v-slot="{ Component }">
            <transition mode="out-in" name="slide">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style>
.slide_down-enter-active,
.slide_down-leave-active {
    transition: animate__animated animate__fadeInDown
}

.slide_down-enter-from,
.slide_down-leave-to {
    opacity: 0;
    /* transform: rotateX(-100px); */

}


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
import { ref } from 'vue';
import NavBar from '../components/client/NavBar.vue'

const showsuccess = ref(false)

const show = () => {
    showsuccess.value = !showsuccess.value
}

</script>