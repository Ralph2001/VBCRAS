    <template>
        <div class="fixed top-0 bottom-0 left-0 right-0 z-50 backdrop-blur-sm backdrop-brightness-75 ">
            <div class="h-full w-full flex rounded-lg bg-gray-50 flex-col p-2 relative">
                <div class="flex flex-row items-center px-4">
                    <p class="font-medium p-4">Settings</p>
                    <button @click="emit('close-setting')"
                        class=" text-sm ml-auto border px-10 h-10 rounded w-fit outline-none bg-red-500 hover:bg-red-600 font-medium text-white">Exit</button>
                </div>

                <!-- <Tab title="Default Values">
                <div class="flex flex-col h-full">
                    <p class="p-2 font-medium text-2xl">You can still change this value in the form maker.</p>
                    <div class="grid grid-cols-2 gap-10 px-20 mt-10">
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Petitioner Address</p>

                            <Input label="Nationality" v-model="formData.nationality" />
                            <Input label="Country" v-model="formData.country" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Filling This petition at</p>
                            <InputAutoComplete label="Province" v-model="formData.filing_province"
                                :suggestion_data="province" />
                            <InputAutoComplete label="City/Municipality" v-model="formData.filing_municipality"
                                :suggestion_data="municipality" />

                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Administering Officer</p>
                            <Input label="Name" v-model="formData.administering_officer_name" />
                            <Input label="Position" v-model="formData.administering_officer_position" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Subscribe and Sworn</p>
                            <InputAutoComplete label="City/Municipality"
                                v-model="formData.subscribe_sworn_city_municipality"
                                :suggestion_data="municipality_province" />
                            <InputAutoComplete label="Issued At" v-model="formData.issued_at"
                                :suggestion_data="municipality_province" />

                        </div>
                        <div class="flex flex-col gap-4">
                            <Input label="Municipal Civil Registrar *" class="mt-5"
                                v-model="formData.municipal_civil_registrar" />
                            <div class="flex flex-row items-center gap-3">
                                <CheckBox />
                                <label for="" class="font-medium text-xs">Always Select "Granted"</label>
                            </div>

                        </div>


                    </div>

                </div>
            </Tab> -->
                <TabsWrapper>
                    <Tab title="Petition Date">
                        <div class="flex flex-col h-full ">
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

                            <div class="flex flex-col p-6 gap-4">
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

                            <div class="grid sm:grid-cols-1 md:lg:grid-cols-3 h-full w-full  gap-2">

                                <div class="flex flex-col border border-gray-300 gap-2 p-6 h-fit bg-white shadow-sm">
                                    <p class="font-medium text-2xl">Holidays</p>


                                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                                        <Input label="Date" v-model="holidayForm.holiday_date" />
                                        <Input label="description" v-model="holidayForm.description" />
                                        <button @click="add_holiday()"
                                            class="border rounded-md p-2 mt-auto hover:bg-blue-500 hover:text-white">Add</button>
                                    </div>


                                    <div class="flex flex-col gap-2 border  overflow-y-scroll">
                                        <div class="relative overflow-x-auto flex justify-center">
                                            <table
                                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead
                                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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

                                <div
                                    class="flex flex-col col-span-2 border-gray-300 border p-4 h-max   overflow-y-scroll  bg-white shadow-sm">
                                  

                                    <div class="flex flex-col gap-4 p-4">
                                        <div class="flex flex-col">
                                            <p class="font-medium">Date Notice</p>
                                            <div class="flex flex-col indent-8">
                                                <div class="grid grid-cols-6 items-center">
                                                    <p class="text-sm col-span-5">How many days after the current date
                                                        should the notice be issued?</p>
                                                    <div class="flex items-center justify-center">
                                                        <Input class="w-20" center
                                                            v-model="date_rules_data.notice_days" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        weekends?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_weekends_notice" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_holidays_notice" />
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the end date be allowed to fall
                                                        on
                                                        a weekend ?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_weekend_end" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the end date be allowed to fall
                                                        on
                                                        a holiday?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_holiday_end" />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="font-medium">Certificate Start</p>
                                            <div class="flex flex-col indent-8">
                                                <div class="grid grid-cols-6 items-center">
                                                    <p class="text-sm col-span-5">How many days after the notice date
                                                        should
                                                        the certificate start?</p>
                                                    <div class="flex items-center justify-center">
                                                        <Input class="w-20"
                                                            v-model="date_rules_data.certificate_start_days" center />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_holidays_start"
                                                            center />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        weekends?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_weekends_start"
                                                            center />
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the start date be allowed to
                                                        fall
                                                        on a weekend ?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_weekend_start" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the start date be allowed to
                                                        fall
                                                        on a holiday?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_holiday_start" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="font-medium">Certificate End</p>
                                            <div class="flex flex-col indent-8">
                                                <div class="grid grid-cols-6 items-center">
                                                    <p class="text-sm col-span-5">How many days after the certificate
                                                        start
                                                        should the certificate end?</p>
                                                    <div class="flex items-center justify-center">
                                                        <Input v-model="date_rules_data.certificate_end_days"
                                                            class="w-20" center />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_holidays_end" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        weekends?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_weekends_end"
                                                            center />
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the end date be allowed to fall
                                                        on
                                                        a weekend ?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_weekend_end_cert" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the end date be allowed to fall
                                                        on
                                                        a holiday?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_holiday_end_cert" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="font-medium">Date Issued</p>
                                            <div class="flex flex-col indent-8">
                                                <div class="grid grid-cols-6 items-center">
                                                    <p class="text-sm col-span-5">How many days after the certificate
                                                        end
                                                        should the issued date be?</p>
                                                    <div class="flex items-center justify-center">
                                                        <Input v-model="date_rules_data.issued_days" class="w-20"
                                                            center />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_holidays_issued" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_weekends_issued" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the issued date be allowed to
                                                        fall
                                                        on a weekend ?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_weekend_issued" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the issued date be allowed to
                                                        fall
                                                        on a holiday?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_holiday_issued" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="font-medium">Grant Date</p>
                                            <div class="flex flex-col indent-8">
                                                <div class="grid grid-cols-6 items-center">
                                                    <p class="text-sm col-span-5">How many days after the issued date
                                                        should
                                                        the grant date be set?</p>
                                                    <div class="flex items-center justify-center">
                                                        <Input class="w-20" v-model="date_rules_data.grant_days"
                                                            center />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        holidays?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_holidays_grant" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the count of added days exclude
                                                        weekends?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.exclude_weekends_grant" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the grant date be allowed to
                                                        fall
                                                        on a weekend ?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_weekend_grant" />
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-6 items-center h-10">
                                                    <p class="text-sm col-span-5">Should the grant date be allowed to
                                                        fall
                                                        on a holiday?</p>
                                                    <div class="flex items-center justify-center">
                                                        <CheckBox v-model="date_rules_data.allow_holiday_grant" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab title="Reports">
                        <div class="flex flex-col h-full gap-6 overflow-y-scroll ">
                            <p class="p-2 font-medium text-2xl">Generate Reports</p>
                            <div class="flex flex-row items-center justify-center gap-4 ">
                                <div class="flex flex-col gap-2  w-[20rem]">
                                    <label for="" class="text-sm font-medium">Petition Type</label>
                                    <select class="border border-gray-300 rounded-md w-full font-medium"
                                        v-model="selected_petition_type">
                                        <option class="font-medium" v-for="type in petition_type" :key="type"
                                            :value="type">
                                            {{ type }}
                                        </option>
                                    </select>


                                </div>
                            </div>
                            <div
                                class="grid sm:grid-rows-1 md:lg:grid-cols-2 gap-10 lg:flex-row sm:px-10 md:lg:px-20 items-center justify-center h-auto  ">



                                <div class="flex flex-col  gap-3 border rounded-md p-5 shadow-sm bg-white">
                                    <p class="font-medium  text-md tracking-wider text-gray-800 uppercase">Generate
                                        list by
                                        month
                                        & year</p>
                                    <div class="flex sm:md:flex-col lg:flex-row gap-2 w-full md:lg:px-10">
                                        <div class="flex flex-col gap-2  w-full">
                                            <label for="" class="text-sm font-medium">Select Month</label>
                                            <select class="border border-gray-300 rounded-md w-full font-medium"
                                                v-model="selected_month">
                                                <option class="font-medium" :value="key + 1"
                                                    :selected="selected_month === key" v-for="( value, key) in months"
                                                    :key="key">
                                                    {{ value }}
                                                </option>
                                            </select>


                                        </div>
                                        <div class="flex flex-col gap-2  w-full">
                                            <label for="" class="text-sm font-medium">Select Year</label>
                                            <select class="border border-gray-300 rounded-md w-full font-medium"
                                                v-model="selected_year">
                                                <option class="font-medium" :value="value"
                                                    :selected="selected_year === value" v-for="( value, key) in years"
                                                    :key="key">
                                                    {{ value }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="w-full flex  px-2 items-center">
                                        <p class="font-medium text-md text-gray-700">Total: <span
                                                class=" text-gray-900">{{
                                                    month_year_record.length }}</span></p>
                                        <button type="button" @click="generate_month_year"
                                            class="font-medium w-max ml-auto border rounded  bg-blue-500 text-white px-2 py-1.5">Generate</button>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3  border rounded-md p-5 shadow-sm bg-white">
                                    <p class="font-medium  text-md tracking-wider text-gray-800 uppercase">Generate
                                        Master
                                        List
                                        for the year</p>
                                    <div class="md:lg:px-10 justify-center flex items-center   ">
                                        <div class="flex flex-col gap-2  w-[15rem]">
                                            <label for="" class="text-sm font-medium">Select Year</label>
                                            <select class="border border-gray-300 rounded-md w-full">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="w-full flex  px-2 items-center">
                                        <p class="font-medium text-md text-gray-700">Total: <span
                                                class=" text-gray-900">No
                                                Selected</span></p>
                                        <button type="button"
                                            class="font-medium w-max ml-auto border rounded  bg-blue-500 text-white px-2 py-1.5">Generate</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Tab>


                    <Tab title="File Paths and Templates">
                        <div class="flex flex-col p-4">
                            <div class="flex flex-col gap-2">
                                <p class="p-2 font-medium text-2xl">Default File Save Path</p>
                                <p class="text-sm indent-12 text-gray-800">All petitions will be saved to the specified
                                    path. Please ensure that
                                    this path is set to a shared drive so that other users can access and open the
                                    petitions
                                    as needed.</p>

                                <!-- <Input label="Selected File Path" @click="open" v-model="file_path" readonly /> -->
                                <!-- <div class="w-full flex flex-col mt-5">
                                <label for="path" class="font-medium mb-2 text-sm">Selected File Path</label>
                                <input id="path" readonly type="text"
                                    class="w-full border border-gray-300 rounded shadow-sm font-semibold text-gray-800 text-sm"
                                    @click="open" v-model="file_path">
                            </div>
                            <Button label="Save" class="w-max border ml-auto" /> -->
                            </div>
                            <div class="flex h-full flex-col">
                                <p class="p-2 font-medium text-2xl">Templates</p>
                                <TabsWrapper>
                                    <Tab title="Petition">
                                        <TemplateSettings document_name="petition.docx" :tags="tags_petition"
                                            :file_types="petition_types" />
                                    </Tab>
                                    <Tab title="Record Sheet">
                                        <TemplateSettings document_name="Record Sheet.docx"
                                            :file_types="['Record Sheet']" />
                                    </Tab>
                                    <Tab title="Endorsement Letter">
                                        <TemplateSettings document_name="Endorsement Letter.docx"
                                            :file_types="['Endorsement Letter']" />
                                    </Tab>
                                    <Tab title="Notice of Posting and Certificate of Posting">
                                        <TemplateSettings
                                            document_name="Notice of Posting and Certificate of Posting.docx"
                                            :file_types="['Notice of Posting and Certificate of Posting']" />
                                    </Tab>
                                    <Tab title="Finality">
                                        <TemplateSettings document_name="Finality.docx" :file_types="['Finality']" />
                                    </Tab>
                                    <Tab title="Finality Endorsement Letter">
                                        <TemplateSettings document_name="Finality Endorsement Letter.docx"
                                            :file_types="['Finality Endorsement Letter']" />
                                    </Tab>
                                </TabsWrapper>
                            </div>
                        </div>
                    </Tab>
                </TabsWrapper>

            </div>
        </div>
    </template>

<script setup>
import TabsWrapper from '../Tab/TabsWrapper.vue'
import Tab from '../Tab/Tab.vue'
import { computed, onMounted, reactive, ref } from 'vue';
import {
    now_date,
    add_date_notice,
    add_date_certificate_start,
    add_date_certificate_end,
    add_date_issued,
    add_date_granted,
    add_publication_start,
    add_publication_end,
    add_date_granted_with_publication,
} from '../../utils/ClericalDateCount.js';
import Input from '../essentials/inputs/Input.vue';
import Button from '../essentials/buttons/Button.vue';
import TemplateSettings from './TemplateSettings.vue';
import CheckBox from '../essentials/buttons/CheckBox.vue';
import InputAutoComplete from '../InputAutoComplete.vue';
import { complete_municipality, complete_province, complete_municipality_with_province } from '../../utils/Address';
import { useSetup } from '../../stores/Setting/setup';
import { usePetitions } from '../../stores/Petition/petitions.js'
import { format } from 'date-fns';
import { useDate } from '../../stores/Date/index.js';


const date = useDate()



const petitions = usePetitions()
const setup = useSetup()

onMounted(async () => {
    await setup.getSystemSetting()
    await setup.getHolidays()
    await date.get_all_dates()
})



const province = ref(complete_province())
const municipality = computed(() => {
    return complete_municipality(formData.filing_province)
})
const municipality_province = computed(() => {
    return complete_municipality_with_province(formData.filing_province)
})


const petition_types = ref([
    '9048 CCE BIRTH',
    '9048 CCE DEATH',
    '9048 CCE MARRIAGE',
    '9048 CFN BIRTH',
    '10172 CCE BIRTH',
])

const tags_petition = ref([
    { tag: '{petition_number}', details: 'Petition Number field' },
    { tag: '{petitioner_name}', details: 'Full name of petitioner' },
    { tag: '{nationality}', details: 'Nationality of petitioner' },
    { tag: '{petitioner_address}', details: 'Full address of petitioner' },
    { tag: '{#my}x{/my}', details: 'if the petitioner\'s document' },
    { tag: '{#the}x{/the}', details: 'if the petition does not belong to the petitioner' },
    { tag: '{document_owner}', details: 'Full name of Document Owner. N/A if my is selected' },
    { tag: '{spouse}', details: 'Spouse name for CCE Marriage' },
    { tag: '{relation_owner}', details: 'Relation to the owner field' },
    { tag: '{event_date}', details: 'Date of Birth, Death, Marriage ' },
    { tag: '{event_country}', details: 'Place of Birth, Death, Marriage Country' },
    { tag: '{event_province}', details: 'Place of Birth, Death, Marriage Province' },
    { tag: '{event_municipality}', details: 'Place of Birth, Death, Marriage Municipality' },
    { tag: '{registry_number}', details: 'Registry Number field' },
    { tag: '{#clerical}  {/}', details: 'Clerical Errors. Put it in Table' },
    { tag: '{description}', details: 'This is belongs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
    { tag: '{error_description_from}', details: 'This is belongs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
    { tag: '{error_description_to}', details: 'This is belongs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
])


const formData = reactive({
    nationality: setup.defaults[0].petition_default_nationality,
    country: setup.defaults[0].petition_default_country,
    filing_province: setup.defaults[0].petition_default_filling_province,
    filing_municipality: setup.defaults[0].petition_default_filling_municipality,
    administering_officer_name: setup.defaults[0].petition_default_administering_officer_name,
    administering_officer_position: setup.defaults[0].petition_default_administering_officer_position,
    subscribe_sworn_city_municipality: setup.defaults[0].petition_default_subscribe_sworn_municipality,
    issued_at: setup.defaults[0].petition_default_issued_at,
    municipal_civil_registrar: setup.defaults[0].municipal_civil_registrar,
})

const emit = defineEmits(['close-setting'])
const file_path = ref(setup.defaults[0].petition_default_file_path)
const open = async () => {
    const folder = await window.LocalCivilApi.selectFolder()
    file_path.value = folder
}


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
            { name: 'Date Granted', date:date_granted_with_publication },

        ]
    )

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

const months = ref([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
])

const years = ref([
    2024
])

/**
 * 
 * Report 
 * 
 */
const petition_type = ref([
    'CCE',
    'CFN',
])

const selected_petition_type = ref('CCE')

// Get the current date details
const now = new Date();
const today = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // 'YYYY-MM'
const currentYear = now.getFullYear(); // YYYY




const selected_month = ref(now.getMonth() + 1);
const selected_year = ref(currentYear);

const month_year_record = computed(() => {
    return petitions.petitions.filter(petition => {
        const petitionDate = new Date(petition.created_at);
        const petitionMonth = petitionDate.getMonth() + 1;
        const petitionYear = petitionDate.getFullYear();
        return petition.petition_type === selected_petition_type.value &&
            petitionMonth === selected_month.value &&
            petitionYear === selected_year.value;
    });
})


const generate_month_year = async () => {

    const formData = {
        data: month_year_record.value,
        petition_type: selected_petition_type.value,
        month: months.value[selected_month.value - 1],
        year: selected_year.value
    }

    const main_data = JSON.stringify(formData)
    const generate = await window.ClericalApi.GenerateReportByMonthYear(main_data)
}

const initialFormData = {
    notice_days: '1',
    exclude_holidays_notice: '',
    exclude_weekends_notice: '',
    allow_weekend_end: '',
    allow_holiday_end: '',


    certificate_start_days: '1',
    exclude_holidays_start: '',
    exclude_weekends_start: '',
    allow_weekend_start: '',
    allow_holiday_start: '',

    certificate_end_days: '10',
    exclude_holidays_end: '',
    exclude_weekends_end: '',
    allow_weekend_end_cert: '',
    allow_holiday_end_cert: '',


    issued_days: '1',
    exclude_holidays_issued: '',
    exclude_weekends_issued: '',
    allow_weekend_issued: '',
    allow_holiday_issued: '',


    grant_days: '3',
    exclude_holidays_grant: '',
    exclude_weekends_grant: '',
    allow_weekend_grant: '',
    allow_holiday_grant: '',
}

const date_rules_data = reactive({ ...initialFormData })

const create_date_rule = async () => {

    const data = {
        notice_days: date_rules_data.notice_days,
        exclude_holidays_notice: date_rules_data.exclude_holidays_notice,
        exclude_weekends_notice: date_rules_data.exclude_weekends_notice,
        allow_weekend_end: date_rules_data.allow_weekend_end,
        allow_holiday_end: date_rules_data.allow_holiday_end,


        certificate_start_days: date_rules_data.certificate_start_days,
        exclude_holidays_start: date_rules_data.exclude_holidays_start,
        exclude_weekends_start: date_rules_data.exclude_weekends_start,
        allow_weekend_start: date_rules_data.allow_weekend_start,
        allow_holiday_start: date_rules_data.allow_holiday_start,

        certificate_end_days: date_rules_data.certificate_end_days,
        exclude_holidays_end: date_rules_data.exclude_holidays_end,
        exclude_weekends_end: date_rules_data.exclude_weekends_end,
        allow_weekend_end_cert: date_rules_data.allow_weekend_end_cert,
        allow_holiday_end_cert: date_rules_data.allow_holiday_end_cert,

        issued_days: date_rules_data.issued_days,
        exclude_holidays_issued: date_rules_data.exclude_holidays_issued,
        exclude_weekends_issued: date_rules_data.exclude_weekends_issued,
        allow_weekend_issued: date_rules_data.allow_weekend_issued,
        allow_holiday_issued: date_rules_data.allow_holiday_issued,

        grant_days: date_rules_data.grant_days,
        exclude_holidays_grant: date_rules_data.exclude_holidays_grant,
        exclude_weekends_grant: date_rules_data.exclude_weekends_grant,
        allow_weekend_grant: date_rules_data.allow_weekend_grant,
        allow_holiday_grant: date_rules_data.allow_holiday_grant,
    }

    const add = await date.create_date_rules(data)
    console.log(add)
}

</script>

<style lang="scss" scoped></style>