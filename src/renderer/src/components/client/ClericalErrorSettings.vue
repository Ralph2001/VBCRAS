<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 z-50 backdrop-blur-sm backdrop-brightness-75 p-10">
        <div class="h-full w-full flex rounded-lg bg-gray-50 flex-col p-6 relative">
            <button @click="emit('close-setting')"
                class="absolute right-10 border px-2 rounded outline-none bg-red-500 font-medium text-white">Exit</button>
            <p class="font-medium p-4">Preferences</p>
            <TabsWrapper>
                <Tab title="File Path And Templates">
                    <div class="flex flex-col p-4">
                        <div class="flex flex-col gap-2">
                            <p class="p-2 font-medium text-2xl">Default File Save Path</p>
                            <p class="text-sm">All petitions will be saved to the specified path. Please ensure that
                                this path is set to a shared drive so that other users can access and open the petitions
                                as needed.</p>
                            <!-- <Input label="Selected File Path" @click="open" v-model="file_path" readonly /> -->
                            <div class="w-full flex flex-col mt-5">
                                <label for="path" class="font-medium mb-2 text-sm">Selected File Path</label>
                                <input id="path" readonly type="text"
                                    class="w-full border border-gray-300 rounded shadow-sm font-semibold text-gray-800 text-sm"
                                    @click="open" v-model="file_path">
                            </div>
                            <Button label="Save" class="w-max border ml-auto" />
                        </div>
                        <div class="flex h-full flex-col">
                            <p class="p-2 font-medium text-2xl">Templates</p>
                            <TabsWrapper>
                                <Tab title="Petition">
                                    <div class="w-full flex flex-col gap-4 ">
                                        <div class="flex flex-row gap-2 items-center justify-center">
                                            <div v-for="type in petition_types" :key="type"
                                                class="h-[8rem] border border-gray-200 w-[8rem]  rounded-md bg-green-50 flex flex-col items-center  justify-center shadow-sm">
                                                <p class="text-center font-semibold text-sm mt-auto">{{ type }}</p>
                                                <button
                                                    class="w-full mt-auto text-xs py-1.5 bg-gray-50 border border-gray-300">Open</button>
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center">
                                            <div class="flex flex-col gap-2 items-center justify-center">
                                                <p class="text-2xl font-medium">How to?</p>
                                                <p class="text-justify text-md tracking-wide">
                                                    To customize the template, start by clicking "Open" and paste your
                                                    custom template into the designated folder or editing the document,
                                                    ensuring that the file
                                                    is named petition.docx. It is important that this file is saved in
                                                    the specified path, not in any other location, to ensure proper
                                                    functionality. Within your template, you can insert tags such as
                                                    <span class="font-bold">`{tag_name}`</span> at specific locations
                                                    where you want the
                                                    system to
                                                    automatically insert data. These tags correspond to specific fields
                                                    and will be replaced with the appropriate information provided by
                                                    the system during processing. By doing this, you can ensure that
                                                    your document is accurately populated with all necessary details,
                                                    maintaining consistency and correctness throughout the generated
                                                    petitions.
                                                </p>
                                            </div>
                                            <p class="text-2xl font-medium">Tags</p>
                                            <div class="flex flex-row gap-4 flex-wrap mt-5 items-center justify-center">
                                                <div v-for="tag in tags_petition" :key="tag.tag"
                                                    class="w-[15rem] bg-white h-auto py-4 flex flex-col px-10 items-center justify-center gap-2 border border-gray-300 rounded-md">
                                                    <p class="font-medium text-md">{{ tag.tag }}</p>
                                                    <p class="text-sm  text-gray-700 text-justify">{{ tag.details }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab title="Record Sheet">
                                </Tab>
                                <Tab title="Endorsement Letter">
                                </Tab>
                                <Tab title="Notice of Posting and Certificate of Posting">
                                </Tab>
                                <Tab title="Finality">
                                </Tab>
                                <Tab title="Finality Endorsement Letter">
                                </Tab>
                            </TabsWrapper>
                        </div>
                    </div>
                </Tab>
                <Tab title="Dates">
                </Tab>
                <Tab title="Values">
                </Tab>

            </TabsWrapper>

        </div>
    </div>
</template>

<script setup>
import TabsWrapper from '../../component/DataRecordComponents/TabsWrapper.vue'
import Tab from '../../component/DataRecordComponents/Tab.vue'

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
    { tag: '{description}', details: 'This is belogs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
    { tag: '{error_description_from}', details: 'This is belogs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
    { tag: '{error_description_to}', details: 'This is belogs to clerical tag. Put it inside, for example in table put it in with clerical tag' },
    { tag: '{petition_number}', details: '' },
    { tag: '{petition_number}', details: '' },
    { tag: '{petition_number}', details: '' },
    { tag: '{petition_number}', details: '' },
])

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
import Input from '../essentials/inputs/Input.vue';
import Button from '../essentials/buttons/Button.vue';

const file_path = ref()
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