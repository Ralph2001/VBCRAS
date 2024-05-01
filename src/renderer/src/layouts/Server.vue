<template>
    <div class="h-screen">
        <Sidebar />
        <router-view>
        </router-view>
    </div>
</template>
<script setup>
import Sidebar from '../components/admin/Sidebar.vue';
</script>
