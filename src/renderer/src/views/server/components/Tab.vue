<template>
    <div class="w-full" v-show="props.title === selectedTitle">
        <slot />
    </div>
</template>

<script setup>
import { inject } from 'vue';
const props = defineProps({
    title: String
})
const selectedTitle = inject("selectedTitle")



</script>

<style lang="scss" scoped></style>