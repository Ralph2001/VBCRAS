<template>
    <div class="relative h-[calc(100vh-100px)] flex sm:flex-wrap  md:lg:flex-row w-full p-4 overflow-y-scroll">
        <div class="sm:grow md:lg:basis-[5%]  flex flex-col w-full h-full gap-3">
            <p class="text-4xl text-gray-800 tracking-wider font-medium mt-5">Approval</p>
            <div class="flex flex-col border p-4 gap-2 bg-white   items-center mt-5 ml-5">
                <p class="text-md text-gray-800 tracking-wider font-medium mb-5 self-start "> Summary:</p>
                <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 w-full h-full" v-for="(value, key) in userData"
                    :key="key">
                    <div class="text-sm font-normal">{{ key }}</div>
                    <div class="text-md font-medium text-wrap w-full overflow-hidden truncate ">{{ value }} </div>
                </div>
                <div
                    class="w-full flex items-center justify-end text-xs text-blue-500 hover:text-blue-600 hover:cursor-pointer">
                    [Full Details]</div>
            </div>
        </div>

        <div class="grow flex flex-col p-4 gap-2">
            <p class="text-2xl">Attachments</p>
            <div class="flex items-center">
                <input disabled checked id="disabled-checked-checkbox" type="checkbox" value=""
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="disabled-checked-checkbox"
                    class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">Finality</label>
            </div>
            <div class="flex items-center">
                <input disabled checked id="disabled-checked-checkbox" type="checkbox" value=""
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="disabled-checked-checkbox"
                    class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">Endorsement Letter</label>
            </div>


            <button class="w-fit px-2 rounded border bg-white" type="button">Select Form 102 (Certificate Of Live
                Birth)</button>
            <button class="w-fit px-2 rounded border bg-white" type="button">Add Annotations</button>

            <div class="mt-auto ml-auto bottom-0 right-10 gap-2 flex">
                <button @click="back"
                    class="border w-[10rem] rounded-sm bg-white text-sm py-2 hover:bg-red-400 text-gray-800 font-medium shadow-sm transition-all active:scale-95 hover:text-white">Cancel</button>
                <button type="button"
                    class="bg-blue-300 py-2 px-10 font-medium rounded-sm text-white cursor-not-allowed">Approve</button>
            </div>
        </div>

        <!-- <ul v-for="(value, key) in petition.petitionData" :key="key">
            <li>{{ key + ' : ' + value }}</li>
        </ul> -->


    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { usePetitions } from '../../../stores/Petition/Petitions';
import ExplorerView from '../../../components/client/ExplorerView.vue';

const petition = usePetitions()
const router = useRouter();
const route = useRoute();


const petitionData = ref()
const userData = ref({})

onMounted(async () => {
    const data = await petition.getPetition(route.params.id)
    if (data) {
        petitionData.value = data
        userData.value = {
            "Petitione Number": petitionData.value.petition_number,
            "Petitioner Name": petitionData.value.petitioner_name,
            "Document Owner": petitionData.value.name_owner === 'N/A' ? petitionData.value.petitioner_name : petitionData.value.name_owner,
            "Relation to Owner": petitionData.value.relation_owner === 'N/A' ? 'Owner' : petitionData.value.relation_owner,
            "Date Filed": petitionData.value.DatePaid,
            "Date Granted": petitionData.value.date_granted,
            "Document Type": petitionData.value.type + ' ' + petitionData.value.document_type,
        }
    }
})


const back = () => {
    router.push('/client/cce')
}



</script>

<style lang="scss" scoped></style>