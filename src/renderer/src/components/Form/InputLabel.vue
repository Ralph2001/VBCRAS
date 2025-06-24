<template>
    <div :class="{ 'flex flex-row': twoInput, 'grid grid-cols-3': !twoInput }"
        class="text-sm items-center font-roboto font-bold">
        <p :class="{ 'basis-[25%]': twoInput }">{{ label }}</p>

        <div :class="{ 'grow': twoInput }" class="relative flex flex-row items-center gap-2 col-span-2 w-full">
            <slot></slot>

            <div class=" w-5 h-5">
                <div v-if="error?.status"
                    class="relative group flex items-center justify-center text-red-500 hover:text-red-600 cursor-pointer">
                    <font-awesome-icon icon="fa-solid fa-circle-exclamation"
                        class="text-red-500 text-base custom-pulse" />

                    <!-- Tooltip -->
                    <div
                        class="absolute hidden group-hover:flex -top-2 right-6 bg-white text-gray-700 border border-gray-200 text-xs rounded-md shadow-md px-3 py-1 whitespace-nowrap z-50">
                        {{ error?.message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    twoInput: {
        type: Boolean,
        default: false
    },
    error: {
        type: Object, // or Array if multiple errors
        default: () => ({ status: false, message: '' })
    }
})
</script>
<style scoped>
@keyframes customPulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
}

.custom-pulse {
    animation: customPulse 2s infinite;
}
</style>