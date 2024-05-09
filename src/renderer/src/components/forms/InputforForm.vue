<template>
    <div class="grid grid-cols-2 ">
        <p>{{ label }}</p>
        <div class="flex flex-row items-center gap-1 ">
            :
            <InputNoLabel width="full" />
        </div>
    </div>
</template>

<script setup>
import InputNoLabel from './InputNoLabel.vue';

const props = defineProps({
    label: String
})

</script>

<style lang="scss" scoped></style>