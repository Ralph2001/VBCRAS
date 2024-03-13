<template>
    <div
        class="fixed z-50 bg-white h-full top-0  left-0 hidden  p-5 px-10  md:block md:w-[50%] lg:w-[30%] border-gray-200 border-r shadow-lg ">
        <div class="flex flex-col gap-2 justify-center items-center h-full">
            <p class="text-gray-800  font-sans font-bold text-3xl mt-auto antialiased ">{{ header }}</p>
            <p class="text-gray-500  font-sans font-bold text-xs mb-auto text-nowrap">Vital Bridge Civil Registry and Archive System</p>
            <p class="text-gray-400  font-sans font-bold text-xs "></p>
            <div>
                <Wave />
            </div>
        </div>
    </div>
</template>

<script setup>
import Wave from '../Wave.vue';

const props = defineProps({
    header: {
        type: String,
        required: true
    }
})
</script>
