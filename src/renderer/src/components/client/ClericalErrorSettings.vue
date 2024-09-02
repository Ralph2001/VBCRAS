<template>
    <div class="fixed top-5 bottom-0 left-0 right-0 z-50 backdrop-blur-sm backdrop-brightness-75 p-10">
        <div class="h-full w-full flex rounded-lg bg-gray-50 flex-col p-6">
            <div class="flex flex-row w-full items-center">
                <p class="text-2xl">Settings and Preferences</p>
                <button class="ml-auto" @click="close_setting">[close]</button>
            </div>

            <div class=" h-full grid grid-cols-4 gap-2">
                <div class="flex flex-col  py-10 gap-2  text-gray-800 font-medium text-md">
                    <button type=""
                        class="w-full  px-2 py-2.5 items-start flex  hover:bg-blue-500 hover:text-white rounded-sm  ">Automatic
                        Date Counts</button>
                    <button type=""
                        class="w-full  px-2 py-2.5 items-start flex  hover:bg-blue-500 hover:text-white rounded-sm  ">Templates</button>
                    <button type=""
                        class="w-full  px-2 py-2.5 items-start flex  hover:bg-blue-500 hover:text-white rounded-sm  ">Guide</button>
                </div>
                <div class="col-span-3 border border-gray-300 rounded-md p-4 h-auto overflow-y-scroll ">
                    <div class="flex flex-col h-full">
                        <p class="font-mono text-xs text-gray-800">Adjustments</p>
                        <p class="font-mono p-4  ">The Output will be: </p>
                        <div class="flex flex-row p-2 items-center justify-center">
                            <div class="flex flex-col p-2 w-[10rem] items-center" v-for="date in dates" :key="date">
                                <p class="font-medium text-sm text-gray-700">{{ date.name }}</p>
                                <div
                                    class="w-full bg-gray-100 border shadow-inner p-2 flex items-center justify-center">
                                    <p class="text-sm">{{ date.date }}</p>
                                </div>
                            </div>

                        </div>


                        <div class="flex flex-col">
                            <p class="underline">Notice of Posting</p>
                            <div class="flex flex-row items-center gap-4">
                                <p>Day/s to add after date filed</p>
                                <div class="flex flex-row items-center gap-1">
                                    <p>+</p>
                                    <input type="number" class="w-[4rem] py-1.5 border border-gray-200" name="" id="">
                                    <p>day/s</p>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Weekends in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Holidays in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                        </div>

                        <div class="flex flex-col mt-10">
                            <p class="underline">Certificate of Posting Start</p>
                            <div class="flex flex-row items-center gap-4">
                                <p>Day/s to add after date of posting</p>
                                <div class="flex flex-row items-center gap-1">
                                    <p>+</p>
                                    <input type="number" class="w-[4rem] py-1.5 border border-gray-200" name="" id="">
                                    <p>day/s</p>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Weekends in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Holidays in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                        </div>


                        <div class="flex flex-col mt-10">
                            <p class="underline">Certificate of Posting End</p>
                            <div class="flex flex-row items-center gap-4">
                                <p>Day/s to add after start of certificate of posting</p>
                                <div class="flex flex-row items-center gap-1">
                                    <p>+</p>
                                    <input type="number" class="w-[4rem] py-1.5 border border-gray-200" name="" id="">
                                    <p>day/s</p>
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Weekends in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Skip Holidays in count</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Result should not be in Weekends</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <p>Result should not be in Holidays</p>
                                <input type="checkbox" name="" id="" class="border-gray-400 rounded-sm">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const emit = defineEmits(['close-setting'])
import { ref } from 'vue';
import {
    now_date,
    add_date_notice,
    add_date_certificate_start,
    add_date_certificate_end,
    add_date_issued,
    add_date_granted,
} from '../../utils/DayPosting';


const date_now = ref(now_date())
const date_notice = ref(add_date_notice());
const date_certificate_start = ref(add_date_certificate_start());
const date_certificate_end = ref(add_date_certificate_end());
const date_of_issued = ref(add_date_issued());
const date_of_granted = ref(add_date_granted());


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


const close_setting = () => {
    emit('close-setting')
}
</script>

<style lang="scss" scoped></style>