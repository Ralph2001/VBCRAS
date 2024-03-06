<template>
    <Navbar />
    <div class="container mx-auto w-screen max-w-screen-2xl px-5 ">
        <router-view />
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script>