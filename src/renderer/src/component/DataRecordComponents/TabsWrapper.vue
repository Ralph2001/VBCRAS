<template>
    <div class="w-full text-sm font-medium text-center text-gray-700 border-b border-gray-200 shadow-lg">
        <ul class="flex flex-wrap -mb-px s">
            <li v-for="tab in slots.default()" :key="tab.props.title"
                :class="{ 'text-blue-600 border-b-2 border-blue-600': selectedTitle === tab.props.title }"
                @click="selectedTitle = tab.props.title">
                <p class="inline-block p-4 rounded-t-lg cursor-pointer">
                    <font-awesome-icon :icon="tab.props.icon" />
                    {{ tab.props.title }}
                </p>
            </li>
        </ul>
    </div>
    <div class="flex h-full p-4 overflow-y-scroll w-full bg-gray-100">
        <slot />
    </div>
</template>

<script setup>
import { provide, ref, useSlots } from 'vue';

const props = defineProps({
    title: String,
    icon: { type: String, default: 'fa-solid fa-file-lines' },
});

const slots = useSlots();
const tabTitles = ref(slots.default() ? slots.default().map(tab => tab.props.title) : []);
const selectedTitle = ref(tabTitles.value[0]);


provide("selectedTitle", selectedTitle)
</script>