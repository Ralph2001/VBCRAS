<template>
    <div>
        <button
            type="button"
            class="text-gray-600 hover:text-gray-700 border border-gray-200 shadow-sm active:scale-95 transition-all hover:bg-gray-100 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
        >
            <slot> </slot>
            <span class="sr-only">Button</span>
        </button>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
