<template>
    <div class="flex flex-col col-span-2 border-gray-300 border p-4 h-max overflow-y-scroll bg-white shadow-sm">
        <div class="flex flex-col gap-4 p-4">
            <div v-for="date in petition_dates" :key="date.form_key" class="flex flex-col">
                <p class="font-medium">{{ date.name }}</p>
                <div class="flex flex-col indent-8">
                    <div class="grid grid-cols-6 items-center">
                        <p class="text-sm col-span-5">{{ date.question }}</p>
                        <div class="flex items-center justify-center">
                            <Input :readonly="isSubmitted" v-model="formData[date.form_key]" class="w-20" center />
                        </div>
                    </div>
                    <div v-for="(option, index) in dateOptions" :key="index" class="grid grid-cols-6 items-center h-10">
                        <p class="text-sm col-span-5">{{ option.label }}</p>
                        <div class="flex items-center justify-center">
                            <CheckBox :readonly="isSubmitted" v-model="formData[option.modelKey(date.form_key)]" />
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="!isSubmitted" class="border rounded px-4 py-1.5 w-max text-gray-800 ml-auto font-medium"
                @click="save_configuration">
                Save Date Configuration
            </button>
            <button v-if="isSubmitted" class="border rounded px-4 py-1.5 w-max text-gray-800 ml-auto font-medium"
                @click="reset_configuration">
                Reset
            </button>
            <p class="text-xs text-gray-500">Note: This will be the default date counts.</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import CheckBox from '../essentials/buttons/CheckBox.vue';
import Input from '../essentials/inputs/Input.vue';
import { useDate } from '../../stores/Date';

const date_config = useDate();
const formData = reactive({}); // Initialize as an empty object for dynamic keys
const petition_dates = [
    { name: 'Date Notice', form_key: 'notice_day', question: 'How many days after the current date should the notice be issued?' },
    { name: 'Certificate Start', form_key: 'certificate_start', question: 'How many days after the notice date should the certificate start?' },
    { name: 'Certificate End', form_key: 'certificate_end', question: 'How many days after the certificate start should the certificate end?' },
    { name: 'Date Issued', form_key: 'date_issued', question: 'How many days after the certificate end should the issued date be?' },
    { name: 'Grant Date', form_key: 'date_granted', question: 'How many days after the issued date should the grant date be?' },
];

const dateOptions = [
    { label: 'Should the count of added days include weekends?', modelKey: key => `include_weekends_${key}` },
    { label: 'Should the count of added days include holidays?', modelKey: key => `include_holidays_${key}` },
    { label: 'Should the end date be allowed to fall on a weekend?', modelKey: key => `allow_weekend_end_${key}` },
    { label: 'Should the end date be allowed to fall on a holiday?', modelKey: key => `allow_holiday_end_${key}` },
];

const config_status = ref(false);
const isSubmitted = computed(() => config_status.value || date_config.date_rules.length > 0);

onMounted(async () => {
    const dates = await date_config.get_date_rules();
    if (dates.length > 0) {
        Object.assign(formData, mapDateRules(dates[0]));
    }
});

function mapDateRules(dateRule) {
    return Object.keys(dateRule).reduce((acc, key) => {
        acc[key] = dateRule[key];
        return acc;
    }, {});
}

const save_configuration = async () => {
    const data = { ...formData }; // Spread operator to simplify data extraction
    const add = await date_config.create_date_rules(data);
    if (add) {
        config_status.value = true;
    }
}
const reset_configuration = async () => {
    const data = { ...formData }; // Spread operator to simplify data extraction
    const add = await date_config.create_date_rules(data);
    if (add) {
        config_status.value = true;
    }
}
</script>
