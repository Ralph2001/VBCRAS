<template>
    <div class="relative w-full h-full">
        <button :tabindex="tabIndex" @focus="onFocus" @click="onClick" :class="buttonClass"
            class="w-full p-0 outline-none ring-0 bg-blue-100 hover:bg-blue-200 active:bg-blue-200 focus:bg-blue-200 h-[90%] py-0"></button>

        <!-- Display Full Date when isSeparated is false -->
        <p @focus="onFocus" @click="onClick"
        :class="[isCenter?'justify-center' : 'pl-2']"
            class="font-medium text-xs flex items-center absolute top-0 bottom-0  right-0 left-0 w-full overflow-x-hidden "
            v-if="!props.isSeparated">
            {{ formData[field] }}
        </p>

        <!-- Display Separated Date when isSeparated is true -->
        <div @focus="onFocus" @click="onClick" class="flex flex-row absolute w-full justify-around top-0 bottom-0 overflow-x-hidden"
            v-if="props.isSeparated">
            <p class="font-medium text-xs flex items-center" v-if="separatedDate.month">{{ separatedDate.month }}</p>
            <p class="font-medium text-xs flex items-center" v-if="separatedDate.day">{{ separatedDate.day }}</p>
            <p class="font-medium text-xs flex items-center" v-if="separatedDate.year">{{ separatedDate.year }}</p>
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
});

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
        const parsedDate = parse(date, 'MMMM dd, yyyy', new Date());

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
    props.openFormInput(props.documentName, props.field, props.tabIndex, props.isDate);
};

const onClick = () => {
    props.openFormInput(props.documentName, props.field, props.tabIndex, props.isDate);
};

// Computed class for button
const buttonClass = computed(() => {
    return [
        props.activeInputField === props.field
            ? 'bg-blue-300'
            : props.formData[props.field] !== ''
                ? 'bg-yellow-50'
                : 'bg-blue-100',
    ];
});
</script>

<style scoped>
/* You can add specific styles for the component here */
</style>