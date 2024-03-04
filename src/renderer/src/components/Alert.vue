<template>
    <div class="absolute top-5  flex flex-row w-full justify-center z-50">
        <div :class="{ 'bg-green-400 ': success, 'bg-red-400': error }"
            class="w-[20rem] flex p-4 items-center justify-center  text-white rounded-sm shadow">
            <p class="text-sm font-semibold">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
    },
    error: {
        type: Boolean,
    }
})

</script>

