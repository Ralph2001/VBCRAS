<template>
    <div class="flex mt-2  flex-row justify-cente6r h-16 items-center gap-2 p-2 w-full">
        <button
        :disabled="!props.month && !props.type && !props.year"
            class="rounded-full hover:bg-gray-50 active:scale-95 px-2 disabled:text-gray-200 text-blue-400 hover:text-blue-500"
            @click="navigateHistory()">
            <font-awesome-icon icon="fa-solid fa-circle-arrow-left" />
        </button>

        <nav class="flex p-2 w-full bg-white text-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center" disabled>
                    <a @click="emits('navigate', 'home')" :class="{
                        'pointer-events-none text-gray-400': !type,
                        'text-gray-700': type,
                    }"
                        class="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        Home
                    </a>
                </li>
                <li>
                    <div class="flex items-center" v-if="props.type">
                        <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <a @click="emits('navigate', 'types')" :class="{
                            'pointer-events-none text-gray-400': !year,
                            'text-gray-700': year,
                        }"
                            class="ms-1 text-sm font-medium hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                                props.type }}</a>
                    </div>
                </li>
                <li>
                    <div class="flex items-center" v-if="props.year">
                        <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <a @click="emits('navigate', 'year')" :class="{
                            'pointer-events-none text-gray-400': !month,
                            'text-gray-700': month,
                        }"
                            class="ms-1 text-sm font-medium hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                                props.year }}</a>
                    </div>
                </li>
                <!-- Months -->
                <li v-if="props.month">
                    <div class="flex items-center">
                        <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ props.month
                            }}</span>
                    </div>
                </li>
            </ol>
        </nav>

    </div>
</template>
<script setup>
const props = defineProps({
    type: {
        type: [String, Number]
    },
    year: {
        type: [String, Number]
    },
    month: {
        type: [String, Number]
    },
})

const emits = defineEmits([
    'navigate',
])

const navigateHistory = () => {
    // Combine the conditions and determine the event to emit
    if (props.type && props.year && props.month) {
        emits('navigate', 'year');
    } else if (props.type && props.year) {
        emits('navigate', 'types');
    } else if (props.type) {
        emits('navigate', 'home');
    }
};
</script>