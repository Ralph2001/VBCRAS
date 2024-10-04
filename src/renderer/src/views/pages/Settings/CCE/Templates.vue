<template>
    <div class="flex flex-col ml-64 p-4 ">
        <div class="flex flex-col p-4">
            <div class="flex flex-col gap-2">
                <p class="p-2 font-medium text-2xl">Default File Save Path</p>
                <p class="text-sm indent-12 text-gray-800">All petitions will be saved to the specified
                    path. Please ensure that
                    this path is set to a shared drive so that other users can access and open the
                    petitions
                    as needed.</p>
            </div>
            <div class="flex h-full flex-col">
                <p class="p-2 font-medium text-2xl">Templates</p>
                <TabsWrapper>
                    <Tab title="Petition">
                        <TemplateSettings document_name="petition.docx" :tags="tags_petition"
                            :file_types="petition_types" />
                    </Tab>
                    <Tab title="Record Sheet">
                        <TemplateSettings document_name="Record Sheet.docx" :file_types="['Record Sheet']" />
                    </Tab>
                    <Tab title="Endorsement Letter">
                        <TemplateSettings document_name="Endorsement Letter.docx"
                            :file_types="['Endorsement Letter']" />
                    </Tab>
                    <Tab title="Notice of Posting and Certificate of Posting">
                        <TemplateSettings document_name="Notice of Posting and Certificate of Posting.docx"
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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TemplateSettings from '../../../../components/client/TemplateSettings.vue';
import Tab from '../../../../components/Tab/Tab.vue';
import TabsWrapper from '../../../../components/Tab/TabsWrapper.vue';


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


</script>