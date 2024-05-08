<template>
    <div class="w-full h-full flex flex-row gap-3">
        {{ props.params.data.type }} <p>{{ props.params.data.registry_number }}</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

onMounted(() => {
    console.log(props)
})

</script>

<style lang="scss" scoped></style>