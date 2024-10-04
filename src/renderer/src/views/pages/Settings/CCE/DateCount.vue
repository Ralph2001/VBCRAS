<template>
    <div class="flex flex-col ml-64 p-4 ">
        <p class=" font-semibold text-lg ">Output:</p>
        <div class="flex flex-row flex-wrap gap-2 items-center justify-center ">
            <div class="h-auto w-[12rem] py-1.5 bg-white border border-gray-300 rounded-md shadow-sm flex flex-col items-center justify-center"
                v-for="date in dates" :key="date">
                <p class="text-xs font-gray-500">{{ date.name }}</p>
                <p class="font-medium"> {{ format(date.date, 'MMMM dd, yyyy') }}</p>
                <p class="text-xs font-medium text-blue-600"> {{ format(date.date, 'eeee') }}</p>
            </div>
            <br>
        </div>
        <div class="flex flex-col py-6 gap-4">
            <p class="font-medium italic ">if CFN or 10172</p>
            <div class="flex flex-row gap-2 ">
                <div class="h-auto w-[12rem] py-1.5 bg-white border border-gray-300 rounded-md shadow-sm flex flex-col items-center justify-center"
                    v-for="date in dates_publication" :key="date">
                    <p class="text-xs font-gray-500">{{ date.name }}</p>
                    <p class="font-medium"> {{ format(date.date, 'MMMM dd, yyyy') }}</p>
                    <p class="text-xs font-medium text-blue-600"> {{ format(date.date, 'eeee') }}
                    </p>
                </div>
            </div>
        </div>
        <DateChangerClearical />
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { add_date_certificate_end, add_date_certificate_start, add_date_granted, add_date_granted_with_publication, add_date_issued, add_date_notice, add_publication_end, add_publication_start, now_date } from '../../../../utils/ClericalDateCount';
import { format } from 'date-fns';
import DateChangerClearical from '../../../../components/settings/DateChangerClearical.vue';


const date_now = ref(now_date())
const date_notice = ref(add_date_notice());
const date_certificate_start = ref(add_date_certificate_start());
const date_certificate_end = ref(add_date_certificate_end());
const date_of_issued = ref(add_date_issued());
const date_of_granted = ref(add_date_granted());
const publication_start = ref(add_publication_start())
const publication_end = ref(add_publication_end())
const date_granted_with_publication = ref(add_date_granted_with_publication())


const dates = ref
    (
        [
            { name: 'Date Filed', date: date_now },
            { name: 'Date Notice', date: date_notice },
            { name: 'Date Certificate Start', date: date_certificate_start },
            { name: 'Date Certificate End', date: date_certificate_end },
            { name: 'Date Issued', date: date_of_issued },
            { name: 'Date Granted', date: date_of_granted },
        ]
    )

const dates_publication = ref
    (
        [
            { name: 'Publication Start', date: publication_start },
            { name: 'Publication End', date: publication_end },
            { name: 'Date Granted', date: date_granted_with_publication },

        ]
    )

</script>