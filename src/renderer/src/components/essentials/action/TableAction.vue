<template>
    <div class="flex flex-col items-center justify-center h-full relative">
        <button :class="[isClick ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800']" ref="button"
            class=" border px-4 h-8 flex items-center  transition-all font-medium rounded-sm"
            @click="showOptions">Action</button>

        <Teleport to="body" v-if="isDialogVisible">
            <Transition>
                <Dialog :data="data_information" @cancel-dialog="cancel_removal" @proceed-removal="proceed_removal" />
            </Transition>
        </Teleport>
        <Teleport to="body" v-if="isViewingPdf">
            <div
                class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">

                <div class="w-full bg-[#525659] flex  absolute  p-4 top-5 z-[99999]">
                    <div>
                        <p class="text-sm  text-white">AUSF {{ data.isWithAttestation ? ' WITH SWORN ATTESTATION' : ''
                            }} -
                            {{ data.child_name }}
                        </p>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide"
                            @click="printPDF">Print</button>
                        <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide"
                            @click="previewPDF">Close</button>
                    </div>
                </div>

                <div class="absolute sm:w-[1.5rem] md:lg:w-[2rem] right-0 bg-[#525659] z-[99998] mt-[7.5rem] h-full">
                </div>

                <!-- <div
                    class="absolute left-0 h-full w-[15rem] bg-[#525659]  flex-col items-center justify-between py-20 sm:hidden md:lg:flex">
                    <div class="h-[80%] w-[90%] flex flex-col gap-1 items-center font-medium text-sm text-gray-800">
                        <button
                            class="p-2 flex transition-all items-start w-full justify-start bg-blue-500 text-white rounded-sm shadow-md">
                            Petition
                        </button>
                        <button
                            class="p-2 flex hover:bg-gray-100 transition-all items-start w-full justify-start bg-white rounded-sm shadow-md">
                            Petition
                        </button>
                        <button
                            class="p-2 flex hover:bg-gray-100 transition-all items-start w-full justify-start bg-white rounded-sm shadow-md">
                            Endorsement Letter
                        </button>
                        <button
                            class="p-2 flex hover:bg-gray-100 transition-all items-start w-full justify-start bg-white rounded-sm shadow-md">
                            Notice of Posting
                        </button>
                        <button
                            class="p-2 flex hover:bg-gray-100 transition-all items-start w-full justify-start bg-white rounded-sm shadow-md">
                            Certificate of Posting
                        </button>
                    </div>

                </div> -->

                <div class="h-screen w-full">
                    <iframe v-if="previewUrl" ref="iframeRef" class="h-full w-full " :src="previewUrl" frameborder="1"
                        allowfullscreen=""></iframe>
                </div>
            </div>
        </Teleport>

        <div class=" absolute flex flex-col items-center  border shadow-sm h-auto bg-white top-[95%] z-[99999] w-[10rem]"
            v-if="isClick">
            <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium"
                @click="previewPDF">Open</button>
            <!-- <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium" @click="previewPDF">Info</button>
            <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium" @click="previewPDF">Flag</button> -->

            <button class="w-full hover:bg-red-300 flex items-center px-5 font-medium" v-if="auth_.user_role === 1"
                @click="removeItem">Remove</button>
        </div>
    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { useAusf } from '../../../stores/Ausf';
import { AuthStore } from '../../../stores/Authentication';
import { Modal } from 'flowbite';
import Dialog from '../../Dialog.vue';

const auth_ = AuthStore()
const aufs_ = useAusf()
const isViewingPdf = ref(false)
const previewUrl = ref()
const iframeRef = ref(null)

const isClick = ref(false)
const button = ref()
const isDialogVisible = ref(false)


const props = defineProps({
    data: {
        type: Object

    }
})



const data = props.params.data

const data_information = ref([
    { label: 'Type:', value: data.isWithAttestation ? 'AUSF WITH SWORN ATTESTATION' : 'AUSF' },
    { label: 'Document Owner:', value: data.child_name },
    { label: 'Affiant Name:', value: data.affiant_name },
    { label: 'Created at:', value: '' },
    { label: 'Prepared by:', value: data.created_by_user.username }
])


onClickOutside(button, (event) => (isClick.value = false));

const showOptions = () => {
    isClick.value = !isClick.value
}
const removeItem = () => {
    isDialogVisible.value = true
}
const cancel_removal = () => {
    isDialogVisible.value = false
}
const proceed_removal = () => {
    aufs_.removeAusf(data.id)
}


const value = reactive({
    created_by: data.created_by,
    registry_number: data.registry_number,
    date_registration: data.date_registration,
    affiant_name: data.affiant_name,
    citizenship: data.citizenship,
    age: data.age,
    address: data.address,
    surname: data.surname,
    in_my_the: data.in_my_the,
    child_name: data.child_name,
    relation: data.relation,
    date_birth: data.date_birth,
    at_municipality: data.at_municipality,
    at_province: data.at_province,
    at_country: data.at_country,
    lcro_at: data.lcro_at,
    day_signature: data.day_signature,
    month_signature: data.month_signature,
    sworn_day: data.sworn_day,
    sworn_month: data.sworn_month,
    sworn_at: data.sworn_at,
    exhibiting: data.exhibiting,
    exhibiting_number: data.exhibiting_number,
    exhibiting_at: data.exhibiting_at,
    exhibiting_on: data.exhibiting_on,
    ap_phi_registry_number: data.ap_phi_registry_number,
    ap_phi_date_registration: data.ap_phi_date_registration,
    pfsp_of: data.pfsp_of,

    isWithAttestation: data.isWithAttestation,

    attestation_ss_month_year: data.attestation_ss_month_year,
    attestation_ss_day: data.attestation_ss_day,
    attestation_signature_month: data.attestation_signature_month,
    attestation_signature_day: data.attestation_signature_day,
    attestation_signature: data.attestation_signature,
    attestation_relation: data.attestation_relation,
    attestation_name: data.attestation_name,
    attestation_issued_on: data.attestation_issued_on,
    attestation_issued_at: data.attestation_issued_at,
    attestation_exhibiting_number: data.attestation_exhibiting_number,
    attestation_exhibiting_her: data.attestation_exhibiting_her,
    attestation_address: data.attestation_address,
})


const previewPDF = async () => {
    isViewingPdf.value = !isViewingPdf.value

    const create = await window.AusfApi.createAUSF({ ...value })
    previewUrl.value = 'data:application/pdf;filename=generated.pdf;base64,' + create.dataurl

}

const printPDF = async () => {
    const create = await window.AusfApi.createAUSF({ ...value })

    if (create) {
        const base64Data = create.dataurl
        const open = await window.LocalCivilApi.printPDFBase64(base64Data)
    }
}


</script>
