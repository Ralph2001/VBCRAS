<template>
    <div class="space-y-4 max-w-2xl bg-white overflow-y-auto h-full p-4">
        <div v-for="(section, sectionKey) in pref" :key="sectionKey" class="bg-white rounded-md border px-4 py-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2 capitalize tracking-wide">
                {{ formatKey(sectionKey) }}
            </h3>

            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
                <div v-for="(value, key) in section" :key="key" class="flex flex-col gap-1">
                    <label class="text-gray-500 capitalize">{{ formatKey(key) }}</label>
                    <InputforForm type="number"
                        class="w-full text-xs px-2 py-1 rounded border border-gray-300 focus:ring-1 focus:ring-blue-400"
                        v-model="pref[sectionKey][key]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import InputforForm from './InputforForm.vue';

const pref = reactive({
    logo: {
        left_scale: 0.35,
        right_scale: 0.35,
        left_x: 420,
        left_y: 790,
        right_x: 110,
        right_y: 790,
    },
    header: { x: 0, y: 6.5 },
    concern: { x: 72, y: 135 },
    page_book_number: { x: 125, y: 163 },
    body_data: { x: 110, y: 205 },
    issued_to: { x: 0, y: 300 },
    verifier: { x: 72, y: 185 },
    c_mcr: { x: 360, y: 216 },
    billing_info: { x: 76, y: 118 },
    authentication: { x: 0, y: 280 },
    remarks_config: { x: 80, y: 260, font: 12, width: 480 },
})

function formatKey(key) {
    return key.replace(/_/g, ' ')
}
</script>
