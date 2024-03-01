<template>
    <div class="p-4 sm:ml-64">

        <div v-for="user in data.users" :key="user.id">
            {{ user.name }}
        </div>
    </div>
</template>

<script setup>
import { useServerDataStore } from '../../stores/serverData'
import { onMounted } from 'vue';


const data = useServerDataStore()

onMounted(() => {
    data.getAllUser()
})
</script>

