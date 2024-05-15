<template>
    <div class="flex gap-2 items-center flex-row w-full ">
        <div>
            <font-awesome-icon :icon="icon" class="text-3xl" />
        </div>
        <div class="flex flex-col ms-2 ">
            <p class="text-2xl font-bold text-gray-700">{{ title }}</p>
            <p class="text-md font-light italic text-gray-700">{{ description }}</p>
        </div>
    </div>
    <div class="flex w-full  px-2 ">

    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    icon: String
})
</script>

<style lang="scss" scoped></style>