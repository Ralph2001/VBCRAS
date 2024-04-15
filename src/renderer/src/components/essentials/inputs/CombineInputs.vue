<template>
    <div class="flex flex-row gap-[2px] w-[50%]">
        <div class="basis-[55%]">
            <input
                type="text"
                v-model="type"
                class="bg-gray-50 border-s-gray-300 border-t-gray-300 border-b-gray-300 border-e-white font-bold text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>
        <div class="grow">
            <input
                v-model="petition_number"
                type="text"
                class="bg-gray-50 border text-center border-gray-300 font-bold text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>
        <div class="basis-[60%]">
            <input
                v-model="year"
                type="text"
                class="bg-gray-50 border-e-gray-300 border-t-gray-300 border-b-gray-300 border-s-white font-bold text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const type = ref('CCE')
const petition_number = ref('')
const year = ref('2024')

const combinedValue = ref('')

const updateCombinedValue = () => {
    combinedValue.value = type.value + petition_number.value + year.value
}
</script>

<style lang="scss" scoped></style>
