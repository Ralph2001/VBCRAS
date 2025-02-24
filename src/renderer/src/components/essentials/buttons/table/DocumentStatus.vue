<template>
    <div class="w-full flex flex-col items-center justify-center h-full p-1  ">
        <div v-if="props.params.data.status === 'PENDING'" class=" h-full w-full bg-yellow-100 flex flex-row
            items-center justify-center gap-2">
            <font-awesome-icon icon="fa-regular fa-clock" />
            <p class="font-medium">PENDING
            </p>
        </div>
        <div v-if="props.params.data.status === 'FINISHED'" class=" h-full w-full bg-green-400 text-white flex flex-row
            items-center justify-center gap-2">
            <font-awesome-icon icon="fa-solid fa-circle-check" />
            <p class="font-medium">COMPLETED
            </p>
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