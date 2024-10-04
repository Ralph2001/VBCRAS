<template>
    <div class="flex flex-col ml-64 p-4  items-center justify-center ">

        <div class="bg-gray-50 p-6 shadow-md gap-4 flex flex-col">
            <div class="flex flex-row items-center justify-center gap-2 w-full">
                <Input label="Date" v-model="holidayForm.holiday_date" />
                <Input label="description" v-model="holidayForm.description" />
                <button @click="add_holiday()"
                    class="border rounded-md p-2 mt-auto hover:bg-blue-500 hover:text-white bg-white">Add</button>
            </div>

            <div class="flex flex-col gap-2 border  overflow-y-scroll w-full">

                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            v-for="holiday in setup.holidays">
                            <th scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ holiday.holiday_date }}
                            </th>
                            <td class="px-6 py-4">
                                {{ holiday.description }}
                            </td>
                            <td class="px-6 py-4">
                                <button @click="removeHoliday(holiday.id)"
                                    class="border border-gray-300 rounded px-2 bg-red-400 text-white">Remove</button>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useSetup } from '../../../../stores/Setting/setup';
import Input from '../../../../components/essentials/inputs/Input.vue';

const setup = useSetup()

onMounted(async () => {

    await setup.getHolidays()
})


const holidayForm = reactive({
    holiday_date: '',
    description: ''
})

const add_holiday = async () => {
    if (holidayForm.holiday_date === '' || holidayForm.description === '') {
        return
    }

    const data = {
        holiday_date: holidayForm.holiday_date,
        description: holidayForm.description
    }

    const add = await setup.addHolidays(data)
    holidayForm.holiday_date = ''
    holidayForm.description = ''
}

const removeHoliday = async (id) => {
    const remove = await setup.removeHoliday(id)
}
</script>