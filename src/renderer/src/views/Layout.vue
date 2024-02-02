<template>
    <Navbar />
    <div class="container mx-auto">
        <router-view />
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script>