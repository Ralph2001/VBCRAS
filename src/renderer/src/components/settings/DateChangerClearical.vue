<template>
    <div class="flex flex-col col-span-2 border-gray-300 border p-4 h-max overflow-y-scroll bg-white shadow-sm">
        <div class="flex flex-col gap-4 p-4">
            <div class="flex flex-col" v-for="date in petition_dates" :key="date.name">
                <p class="font-medium">{{ date.name }}</p>
                <div class="flex flex-col indent-8">
                    <div class="grid grid-cols-6 items-center">
                        <p class="text-sm col-span-5">{{ date.question }}</p>
                        <div class="flex items-center justify-center">
                            <Input :readonly="config_status || date_config.date_rules.length > 0"
                                v-model="formData[date.form_key]" class="w-20" center />
                        </div>
                    </div>
                    <div class="grid grid-cols-6 items-center h-10">
                        <p class="text-sm col-span-5">Should the count of added days include weekends?</p>
                        <div class="flex items-center justify-center">
                            <CheckBox :readonly="config_status || date_config.date_rules.length > 0"
                                v-model="formData[`include_weekends_${date.form_key}`]" />
                        </div>
                    </div>
                    <div class="grid grid-cols-6 items-center h-10">
                        <p class="text-sm col-span-5">Should the count of added days include holidays?</p>
                        <div class="flex items-center justify-center">
                            <CheckBox :readonly="config_status || date_config.date_rules.length > 0"
                                v-model="formData[`include_holidays_${date.form_key}`]" />
                        </div>
                    </div>
                    <div class="grid grid-cols-6 items-center h-10">
                        <p class="text-sm col-span-5">Should the end date be allowed to fall on a weekend?</p>
                        <div class="flex items-center justify-center">
                            <CheckBox :readonly="config_status || date_config.date_rules.length > 0"
                                v-model="formData[`allow_weekend_end_${date.form_key}`]" />
                        </div>
                    </div>
                    <div class="grid grid-cols-6 items-center h-10">
                        <p class="text-sm col-span-5">Should the end date be allowed to fall on a holiday?</p>
                        <div class="flex items-center justify-center">
                            <CheckBox :readonly="config_status || date_config.date_rules.length > 0"
                                v-model="formData[`allow_holiday_end_${date.form_key}`]" />
                        </div>
                    </div>
                </div>
            </div>



            <button :disabled="config_status || date_config.date_rules.length > 0"
                :class="[config_status || date_config.date_rules.length > 0 ? 'bg-green-400 hover:cursor-not-allowed' : 'bg-blue-600']"
                class="border rounded  px-4 py-1.5 w-max  text-white ml-auto font-medium" @click="save_configuration">{{
                    config_status || date_config.date_rules.length > 0 ? 'Saved! ' : 'Save Date Configuration' }}</button>
            <p class="text-xs text-gray-500">Note: You can edit or change the default configuration settings in CCE &
                CFN >
                Settings.</p>


        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import CheckBox from '../essentials/buttons/CheckBox.vue';
import Input from '../essentials/inputs/Input.vue';
import { useDate } from '../../stores/Date';

const date_config = useDate()


onMounted(async () => {

    date_value.value = await date_config.get_date_rules()
})
const date_value = ref()

const petition_dates = [
    {
        name: 'Date Notice',
        form_key: 'notice_day',
        question: `How many days after the current date should the notice be issued?`
    },
    {
        name: 'Certificate Start',
        form_key: 'certificate_start',
        question: `How many days after the notice date should the certificate start?`
    },
    {
        name: 'Certificate End',
        form_key: 'certificate_end',
        question: `How many days after the certificate start should the certificate end?`
    },
    {
        name: 'Date Issued',
        form_key: 'date_issued',
        question: `How many days after the certificate end should the issued date be?`
    },
    {
        name: 'Grant Date',
        form_key: 'date_granted',
        question: `How many days after the issued date should the grant date be set?`
    },
];



const formData = reactive({
    notice_day: '',
    include_holidays_notice_day: false,
    include_weekends_notice_day: false,
    allow_weekend_end_notice_day: false,
    allow_holiday_end_notice_day: false,

    certificate_start: '',
    include_holidays_certificate_start_day: false,
    include_weekends_certificate_start_day: false,
    allow_weekend_certificate_start_day: false,
    allow_holiday_certificate_start_day: false,

    certificate_end: '',
    include_holidays_certificate_end_day: false,
    include_weekends_certificate_end_day: false,
    allow_weekend_certificate_end_day: false,
    allow_holiday_certificate_end_day: false,

    date_issued: '',
    include_holidays_issued_day: false,
    include_weekends_issued_day: false,
    allow_weekend_issued_day: false,
    allow_holiday_issued_day: false,

    date_granted: '',
    include_holidays_grant_day: false,
    include_weekends_grant_day: false,
    allow_weekend_grant_day: false,
    allow_holiday_grant_day: false,
});

const config_status = ref(false)
const save_configuration = async () => {

    const data = {
        notice_day: formData.notice_day,
        include_holidays_notice_day: formData.include_holidays_notice_day,
        include_weekends_notice_day: formData.include_weekends_notice_day,
        allow_weekend_end_notice_day: formData.allow_weekend_end_notice_day,
        allow_holiday_end_notice_day: formData.allow_holiday_end_notice_day,

        certificate_start: formData.certificate_start,
        include_holidays_certificate_start_day: formData.include_holidays_certificate_start_day,
        include_weekends_certificate_start_day: formData.include_weekends_certificate_start_day,
        allow_weekend_certificate_start_day: formData.allow_weekend_certificate_start_day,
        allow_holiday_certificate_start_day: formData.allow_holiday_certificate_start_day,

        certificate_end: formData.certificate_end,
        include_holidays_certificate_end_day: formData.include_holidays_certificate_end_day,
        include_weekends_certificate_end_day: formData.include_weekends_certificate_end_day,
        allow_weekend_certificate_end_day: formData.allow_weekend_certificate_end_day,
        allow_holiday_certificate_end_day: formData.allow_holiday_certificate_end_day,

        date_issued: formData.date_issued,
        include_holidays_issued_day: formData.include_holidays_issued_day,
        include_weekends_issued_day: formData.include_weekends_issued_day,
        allow_weekend_issued_day: formData.allow_weekend_issued_day,
        allow_holiday_issued_day: formData.allow_holiday_issued_day,

        date_granted: formData.date_granted,
        include_holidays_grant_day: formData.include_holidays_grant_day,
        include_weekends_grant_day: formData.include_weekends_grant_day,
        allow_weekend_grant_day: formData.allow_weekend_grant_day,
        allow_holiday_grant_day: formData.allow_holiday_grant_day,
    }
    const add = await date_config.create_date_rules(data)
    if (add) {
        config_status.value = true
    }

}
</script>
