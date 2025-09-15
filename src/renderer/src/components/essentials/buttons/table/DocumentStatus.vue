<template>
    <div class="w-full flex flex-col items-center justify-center h-full p-1">
        <div
            v-if="props.params.data.status === 'PENDING'"
            class="h-full w-full bg-yellow-100 flex flex-row items-center justify-center gap-2"
        >
            <div class="w-10 flex items-center justify-center h-full 1">
                <font-awesome-icon icon="fa-regular fa-clock" />
            </div>
            <div class="flex-1">
                <p class="font-medium text-start">PENDING</p>
            </div>
        </div>
        <div
            v-if="props.params.data.status === 'FINISHED'"
            class="h-full w-full items-center bg-green-400 flex flex-row justify-center gap-2"
        >
            <div class="w-10 flex items-center justify-center h-full">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
            </div>
            <div class="flex-1">
                <p class="font-medium text-start">COMPLETED</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped></style>
