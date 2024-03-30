<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <p v-if="Province">Province</p>
            <p v-if="City">City/Municipality</p>
            <p v-if="Barangay">Barangay</p>
        </label>

        <select :id="id" @change="emit('update:modelValue', $event.target.value)"
            class="bg-gray-50 border font-bold border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option disabled selected></option>
            <option v-if="Province || City" v-for="(value, key) in options" :value="key" :key="key">{{ key }}
            </option>
            <option v-if="Barangay" v-for="(value, key) in options" :value="value" :key="key">{{ value }} </option>
        </select>
    </div>
</template>


<script setup>
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    id: String,
    options: {
        type: [Array, Object],
        required: false
    },
    Province: {
        type: Boolean,
        default: false
    },
    City: {
        type: Boolean,
        default: false
    },
    Barangay: {
        type: Boolean,
        default: false
    }
})
</script>
