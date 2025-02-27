<template>
    <div class="relative w-full h-full ">
        <button :tabindex="tabIndex" @focus="onFocus" @click="onClick" :class="buttonClass"
            class="w-full relative p-0 outline-none hover:border-blue-400  hover:border  h-full  bg-blue-100 ring-0 active:bg-blue-200 focus:bg-blue-200 py-0 text-ellipsis">
            <p @focus="onFocus" @click="onClick" :class="[isCenter ? 'justify-center' : 'pl-2']"
                class="font-semibold text-xs flex items-center text-gray-900 absolute top-0 bottom-0 text-nowrap truncate right-0 left-0 w-full overflow-x-hidden "
                v-if="!props.isSeparated">
                {{ formData[field] }}
            </p>

            <div @focus="onFocus" @click="onClick"
                class="flex flex-row absolute w-full justify-around text-gray-900 top-0 bottom-0 overflow-x-hidden"
                v-if="props.isSeparated">
                <p class="font-semibold text-xs flex items-center" v-if="separatedDate.day">{{ separatedDate.day }}</p>
                <p class="font-semibold text-xs flex items-center" v-if="separatedDate.month">{{ separatedDate.month }}
                </p>
                <p class="font-semibold text-xs flex items-center" v-if="separatedDate.year">{{ separatedDate.year }}
                </p>
            </div>

            <font-awesome-icon icon="fa-solid fa-circle-exclamation" v-if="error"
                class="absolute right-0 bottom-0  top-0 text-xs pr-1 text-red-400"
                @mouseover="show_required_dialog = true" @mouseleave="show_required_dialog = false" />
        </button>

        <div v-if="show_required_dialog"
            class="absolute z-50 h-10 bg-gray-700 transition-all text-white text-xs rounded-sm p-3 -right-[8.5rem] top-0 font-medium">
            <p>This is required field.</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, defineEmits, ref, watch } from 'vue';
import { parse, format, isValid } from 'date-fns'; // You can install date-fns if needed for date formatting

// Props
const props = defineProps({
    field: { type: String, required: true },
    tabIndex: { type: Number, required: true },
    formData: { type: Object, required: true },
    documentName: { type: String, required: true },
    activeInputField: { type: String, default: '' },
    openFormInput: { type: Function, required: true },
    isDate: { type: Boolean, default: false },
    isSeparated: { type: Boolean, default: false }, // new prop to control separation of date
    isCenter: { type: Boolean, default: false }, // new prop to control separation of date
    isAddress: { type: Boolean, default: false }, // new prop to control separation of date
    error: { type: Boolean, default: false }, // new prop to control separation of date
});

const show_required_dialog = ref(false)

// Emits
const emit = defineEmits(['focus-next', 'focus-previous']);

// Ref to store the separated date parts
const separatedDate = ref({
    month: '',
    day: '',
    year: ''
});

// Method to format date into separate parts (month, day, year)
const separateDate = () => {
    const date = props.formData[props.field];

    if (date && props.isSeparated) {
        const parsedDate = parse(date, 'dd MMMM, yyyy', new Date());

        if (isValid(parsedDate)) {
            separatedDate.value.month = format(parsedDate, 'MMMM').toUpperCase(); // Get Month
            separatedDate.value.day = format(parsedDate, 'dd'); // Get Day
            separatedDate.value.year = format(parsedDate, 'yyyy'); // Get Year
        } else {
            // If the date is invalid, clear the separated date
            separatedDate.value = { month: '', day: '', year: '' };
        }
    }
};

// Watch for changes to formData to trigger reformatting if needed
watch(() => props.formData[props.field], separateDate, { immediate: true });

// Methods
const onFocus = () => {
    props.openFormInput(props.documentName, props.field, props.tabIndex, props.isDate, props.isAddress);
};

const onClick = () => {
    props.openFormInput(props.documentName, props.field, props.tabIndex, props.isDate, props.isAddress);
};

// Computed class for button
const buttonClass = computed(() => {
    return [
        props.activeInputField === props.field
            ? 'bg-blue-400'
            : props.formData[props.field] !== ''
                ? 'bg-yellow-50/80'
                : 'bg-blue-100',
    ];
});
</script>

<style scoped>
/* You can add specific styles for the component here */
</style>