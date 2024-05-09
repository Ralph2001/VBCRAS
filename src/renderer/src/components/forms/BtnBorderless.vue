<template>

    <button type="button" class="w-full h-full p-2 text-center rounded-s">{{ label }}</button>

</template>

<script setup>
const props = defineProps({
    label: String
})
</script>

<style lang="scss" scoped></style>