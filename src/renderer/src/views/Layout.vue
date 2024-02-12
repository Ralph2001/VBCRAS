<template>
    <Navbar />
    <div class="container mx-auto w-screen">
        <router-view />
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script>