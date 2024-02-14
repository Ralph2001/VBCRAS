<template>
    Hi {{ Auth.user }}

    <router-link to="/Start" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        go to home
    </router-link>
</template>

<script setup>
import { onMounted } from 'vue';
import { AuthStore } from '../stores/auth';


const Auth = AuthStore();
onMounted(() => {
    Auth.Profile()
})
</script>