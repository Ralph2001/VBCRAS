<template>
    <div class="flex flex-col relative justify-center w-full p-10 ">

        <Header label="LEGITIMATION">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <!-- <Button label="Create New" isActive :class="`rounded`" @click="open_modal()" /> -->

                <div class="relative">
                    <button type="button" @click="dropdown = !dropdown"
                        class="ml-auto text-white px-10 bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all duration-200 focus:ring-blue-300 font-medium rounded-sm shadow text-sm  tracking-wider py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Create New
                    </button>
                    <div v-if="dropdown" ref="option_drop"
                        class="absolute bg-white z-50 top-10 rounded py-2 border border-gray-300 px-2 w-64 shadow-md right-0">
                        <div v-for="(section, index) in option_legitimation" :key="index">
                            <!-- Title (Non-clickable) -->
                            <div class="bg-gray-200 px-2">
                                <p class="font-medium text-gray-600 uppercase text-sm">
                                    {{ section.title }}
                                </p>
                            </div>

                            <!-- Dropdown options (Clickable) -->
                            <ul class="py-2 text-sm text-gray-700 ">
                                <li @click="open_modal(option)" v-for="(option, optionIndex) in section.option"
                                    :key="optionIndex" :value="option">
                                    <a
                                        class="cursor-pointer block p-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        {{ option }}</a>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>

                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>

        <div class="h-[calc(100vh-200px)] rounded border border-gray-300">


        </div>

        <div v-if="legitimation_modal"
            class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50 p-4">
            <div class="max-w-screen-xl w-full h-full bg-white shadow rounded-xl flex overflow-hidden border">
                <!-- Left Section: Form Content -->
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <h2 class="text-lg font-bold text-center text-gray-800">{{ title }}</h2>

                    <!-- Legal Instrument -->
                    <SectionHeader title="Legal Instrument" />
                    <FormGrid>
                        <InputLabel label="Date of Registration">
                            <InputforForm width="100%" v-model="formData.date_registration" />
                        </InputLabel>
                        <InputLabel label="Registry Number">
                            <InputforForm width="100%" v-model="formData.registry_number" />
                        </InputLabel>
                    </FormGrid>

                    <!-- Parent Information -->
                    <SectionHeader title="Parents Information" />
                    <template v-if="formData.parent_is === '18 years old and Above'">
                        <FormGrid>
                            <InputLabel label="Father's Name">
                                <InputforForm width="100%" v-model="formData.name_father" isUpperCase />
                            </InputLabel>
                            <InputLabel label="Mother's Name">
                                <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                            </InputLabel>
                        </FormGrid>
                    </template>

                    <InputLabel label="Name" v-if="formData.parent_is === 'Surviving Spouse'">
                        <InputforForm width="100%" v-model="formData.name_father" isUpperCase />
                    </InputLabel>
                    <InputLabel label="Citizenship">
                        <InputforForm width="100%" v-model="formData.citizenship" />
                    </InputLabel>
                    <InputLabel label="Postal Address">
                        <InputforForm width="100%" v-model="formData.postal_address" />
                    </InputLabel>

                    <!-- Deceased Info -->
                    <template v-if="formData.parent_is === 'Surviving Spouse'">
                        <SectionHeader title="Deceased Parent Information" />
                        <FormGrid>
                            <InputLabel label="Name of Deceased Spouse">
                                <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                            </InputLabel>
                            <InputLabel label="Date of Death">
                                <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                            </InputLabel>
                            <InputLabel label="Place of Death">
                                <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                            </InputLabel>
                        </FormGrid>
                    </template>

                    <!-- Child Info -->
                    <SectionHeader title="Child Information" />
                    <FormGrid>
                        <InputLabel label="Name of Child">
                            <InputforForm width="100%" v-model="formData.child_name" isUpperCase />
                        </InputLabel>
                        <InputLabel label="Sex">
                            <InputforForm width="100%" v-model="formData.child_name" isUpperCase />
                        </InputLabel>
                        <InputLabel label="Date of Birth">
                            <InputforForm width="100%" v-model="formData.date_birth" />
                        </InputLabel>
                        <InputLabel label="Place of Birth">
                            <InputforForm width="100%" v-model="formData.place_birth" />
                        </InputLabel>
                    </FormGrid>

                    <!-- Marriage Info -->
                    <SectionHeader title="Marriage Information" />
                    <FormGrid>
                        <InputLabel label="Legally Married on">
                            <InputforForm width="100%" v-model="formData.date_marriage" />
                        </InputLabel>
                        <InputLabel label="Legally Married at">
                            <InputforForm width="100%" v-model="formData.place_marriage" />
                        </InputLabel>
                        <InputLabel label="Solemnized by">
                            <InputforForm width="100%" v-model="formData.before_by" />
                        </InputLabel>
                        <InputLabel label="Marriage Registered At">
                            <InputforForm width="100%" v-model="formData.registered_at" />
                        </InputLabel>
                        <InputLabel label="Marriage Duly Registered With">
                            <InputforForm width="100%" v-model="formData.registered_at" />
                        </InputLabel>
                    </FormGrid>
                </div>

                <!-- Right Sidebar -->
                <aside class="w-[20rem] bg-gray-50 border-l p-6 flex flex-col justify-between">
                    <div>
                        <label class="text-sm font-medium mb-2 block">Parent/s Is</label>
                        <select v-model="formData.parent_is" class="w-full border rounded p-2">
                            <option value="Minor">Minor</option>
                            <option value="18 years old and Above">18 years old and Above</option>
                            <option value="Surviving Spouse">Surviving Spouse</option>
                        </select>
                    </div>

                    <div class="mt-6">
                        <label class="text-sm font-medium mb-2 block">Filing Information</label>
                        <InputforForm skip unbordered width="100%" v-model="formData.date_filed" />
                        <InputforForm skip unbordered width="100%" v-model="formData.place_filed" />
                    </div>

                    <div class="mt-6 space-y-2">
                        <button @click="legitimation_modal = false"
                            class="w-full py-2 font-semibold border text-gray-700 hover:bg-red-500 hover:text-white">
                            Exit
                        </button>
                        <button @click="genereate_legitimation"
                            class="w-full py-2 font-semibold border text-gray-700 hover:bg-blue-600 hover:text-white">
                            Create
                        </button>
                    </div>
                </aside>
            </div>
        </div>


    </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Header from '../../components/essentials/header.vue';
import InputforForm from '../../components/Form/InputforForm.vue';
import Input from '../../components/essentials/inputs/Input.vue';
import InputLabel from '../../components/Form/InputLabel.vue'
import { onClickOutside } from '@vueuse/core';
import { format } from "date-fns"

const legitimation_modal = ref(false)
const dropdown = ref(false)
const option_drop = ref(null)
onClickOutside(option_drop, (event) => (dropdown.value = false))
const option_legitimation = [
    {
        title: "Legitimation",
        option: [
            "Minor",
            "18 years old and Above",
            "Surviving Spouse"
        ]
    }
    ,
    {
        title: "Acknowledgement",
        option: [
            "Acknowledgement and AUSF",
            "Acknowledgement and Legitimation",
        ]
    }
]

const title = computed(() => {
    const minor = "AFFIDAVIT FOR LEGITIMATION"
    const adult = "AFFIDAVIT OF LEGITIMATION BY SUBSEQUENT MARRIAGE OF PARENTS"
    const surviving = "AFFIDAVIT OF LEGITIMATION BY SUBSEQUENT MARRIAGE OF PARENTS BY SURVIVING SPOUSE"
    return formData.parent_is === "Minor" ? minor : formData.parent_is === "18 years old and Above" ? adult : formData.parent_is === "Surviving Spouse" ? surviving : ""
})

const open_modal = (data) => {
    legitimation_modal.value = true
    formData.parent_is = data
    dropdown.value = false
}

const initialForm = {
    parent_is: '',
    date_registration: '',
    registry_number: '',
    name_father: '',
    name_mother: '',
    citizenship: '',
    postal_address: '',
    child_name: '',
    date_birth: '',
    place_birth: '',
    date_marriage: '',
    place_marriage: '',
    before_by: '',
    registered_at: '',
    date_filed: format(new Date(), "MMMM dd, yyyy"),
    place_filed: 'Bayambang, Pangasinan, Philippines',
}

const formData = reactive({ ...initialForm })

const genereate_legitimation = async () => {
    const data = JSON.stringify(formData)
    const generate = await window.LegitimationApi.createLegitimationDocument(data)
    console.log(generate)
}

</script>