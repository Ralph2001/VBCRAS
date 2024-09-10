<template>
    <div class="relative w-full">
        <input type="text" :readonly="readonly" ref="input" :id="label" :value="modelValue" @input="onChange"
            :tabindex="skip ? '-1' : ''" :class="[
                baseClasses,
                {
                    'text-center': middle,
                    'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                    'border border-gray-300 focus:ring-blue-500 focus:border-blue-500': !unbordered,
                    'italic': italic,
                    'font-bold': bold,
                    'bg-transparent': isTransparent,
                    'focus:ring-red-400 focus:border-red-400': she,
                    'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error
                }
            ]" />
        <ul v-if="isOpen && props.modelValue && results.length"
            class="absolute shadow-lg z-50 bg-white w-full border p-1 max-h-[15rem] overflow-y-scroll ">
            <li v-for="address in results" :key="address.address"
                class="p-3 cursor-pointer focus:outline-none focus:bg-blue-100  active:bg-gray-100 hover:bg-blue-100 w-full font-semibold text-sm "
                tabindex="0" @click="setResult(titleCase(address.address))"
                @keyup.enter="setResult(titleCase(address.address))">{{
                    titleCase(address.address) }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import { onClickOutside } from "@vueuse/core";
import philippines from "../../utils/Philippines";
const regions = computed(() => {
    return Object.keys(philippines[0]);
})

import { useDebounceFn } from '@vueuse/core'

const philippines_address = computed(() => {
    const allAddressSet = new Set();

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName, municipality]) => {
                    Object.entries(municipality.barangay_list).forEach(([index, barangay]) => {
                        const fullAddress = `${barangay}, ${municipalityName}, ${provinceName}`;
                        allAddressSet.add(fullAddress);
                    });
                });
            });
        });
    });

    const allAddress = Array.from(allAddressSet).map(address => ({ address }));
    return allAddress.sort((a, b) => (a.address > b.address) ? 1 : -1);
});


const input = ref("");
const isOpen = ref(false);
const results = ref([]);

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-white' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);


const props = defineProps({
    label: {
        type: String,
        required: false
    },
    readonly: Boolean,
    skip: {
        type: Boolean,
        default: false,
    },
    items: {
        type: [Array, Object],
        required: false,
    },
    modelValue: {
        required: false,
        type: [String, Number],
        default: "",
    },
    nolabel: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: 'auto',
    },
    middle: Boolean,
    unbordered: {
        type: Boolean,
        default: false
    },
    italic: Boolean,
    bold: {
        type: Boolean,
        default: false
    },
    isTransparent: { type: Boolean, default: false },
    she: {
        type: Boolean,
        default: false
    },

    error: {
        type: Boolean,
        default: false
    },
});

onClickOutside(input, () => (isOpen.value = false));

function onChange(e) {
    if (e.target.value.length < 2) {
        return
    }
    debouncedFn()
    isOpen.value = true;
    emit("update:modelValue", e.target.value);
}

const debouncedFn = useDebounceFn(() => {
    filterResults()
}, 600)


function filterResults() {
    results.value = philippines_address.value.filter(address => address.address.toLowerCase().includes(props.modelValue.toLowerCase()));
}


function setResult(result) {
    isOpen.value = false;
    emit("update:modelValue", result);
}

const emit = defineEmits(["update:modelValue"]);

function titleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}




</script>