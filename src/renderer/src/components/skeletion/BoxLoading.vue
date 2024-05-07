<template>
    <div>
        <fieldset :class="width"
            class="border border-solid border-gray-300 shadow-sm rounded-sm h-full flex items-center flex-wrap px-4 pt-4 pb-7">
            <legend class=" text-blackabsolute bg-white leading-2 font-bold italic text-sm tracking-wide"> Loading
            </legend>
            <slot></slot>
        </fieldset>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>