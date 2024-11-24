<template>
    <div class="flex flex-col gap-1 h-full items-center">
        <label for="" class="text-xs font-medium">Type Something</label>
        <input v-model="inputText" type="text" class="border border-gray-300 rounded-sm font-medium text-sm">

        <ul v-if="filteredSuggestions.length" class="bg-white h-[90%] text-gray-800 font-medium">
            <li v-for="(suggestion, index) in filteredSuggestions" :key="index">
                {{ suggestion }}
            </li>
        </ul>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const inputText = ref()

const suggestions = ref([
    'Alcala, Pangasinan',
    'Bautista, Pangasinan',
    'Bayambang, Pangasinan',
])

const filteredSuggestions = computed(() => {
    const data = inputText.value ? inputText.value.toLowerCase() : ''

    if (!data) return []

    return suggestions.value.filter((suggestion) =>
        suggestion.toLowerCase().includes(data)
    );
})
</script>