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
            class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full p-4 h-full flex items-center justify-center backdrop-blur-sm backdrop-brightness-50">
            <div class="max-w-screen-xl w-full bg-white border h-full shadow rounded p-4 flex flex-row gap-2">
                <div class="flex-1  flex flex-col gap-2 py-4 px-2 h-full overflow-y-auto">
                    <p class="text-center font-bold mb-auto text-lg">{{ title }}
                    </p>

                    <div class="w-full bg-blue-300 px-2">
                        <p class="font-semibold text-sm text-gray-900">LEGAL INSTRUMENT</p>
                    </div>
                    <div class="grid grid-cols-1 gap-2 ">
                        <InputLabel label="Date of Registration">
                            :
                            <InputforForm width="100%" v-model="formData.date_registration" />
                        </InputLabel>
                        <InputLabel label="Registry Number">
                            :
                            <InputforForm width="100%" v-model="formData.registry_number" />
                        </InputLabel>
                    </div>
                    <div class="w-full bg-blue-300 px-2">
                        <p class="font-semibold text-sm text-gray-900">PARENTS INFORMATION</p>
                    </div>
                    <div class="flex flex-col gap-2" v-if="formData.parent_is === '18 years old and Above'">
                        <InputLabel label="Father's Name">
                            :
                            <InputforForm width="100%" v-model="formData.name_father" isUpperCase />
                        </InputLabel>
                        <InputLabel label="Mother's Name">
                            :
                            <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                        </InputLabel>
                    </div>

                    <InputLabel label="Name" v-if="formData.parent_is === 'Surviving Spouse'">
                        :
                        <InputforForm width="100%" v-model="formData.name_father" isUpperCase />
                    </InputLabel>
                    <InputLabel label="Citizenship">
                        :
                        <InputforForm width="100%" v-model="formData.citizenship" />
                    </InputLabel>

                    <InputLabel label="Postal Address">
                        :
                        <InputforForm width="100%" v-model="formData.postal_address" />
                    </InputLabel>

                    <div class="w-full bg-blue-300 px-2" v-if="formData.parent_is === 'Surviving Spouse'">
                        <p class="font-semibold text-sm text-gray-900">DECEASED PARENT INFORMATION</p>
                    </div>
                    <div class="flex flex-col gap-2" v-if="formData.parent_is === 'Surviving Spouse'">


                        <InputLabel label="Name of deceased spouse">
                            :
                            <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                        </InputLabel>

                        <InputLabel label="Date of Death">
                            :
                            <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                        </InputLabel>
                        <InputLabel label="Place of Death">
                            :
                            <InputforForm width="100%" v-model="formData.name_mother" isUpperCase />
                        </InputLabel>

                    </div>
                    <div class="w-full bg-blue-300 px-2">
                        <p class="font-semibold text-sm text-gray-900">CHILD INFORMATION</p>
                    </div>
                    <InputLabel label="Name of Child">
                        :
                        <InputforForm width="100%" v-model="formData.child_name" isUpperCase />
                    </InputLabel>
                    <InputLabel label="Sex">
                        :
                        <InputforForm width="100%" v-model="formData.child_name" isUpperCase />
                    </InputLabel>
                    <InputLabel label="Date of Birth">
                        :
                        <InputforForm width="100%" v-model="formData.date_birth" />
                    </InputLabel>
                    <InputLabel label="Place of Birth">
                        :
                        <InputforForm width="100%" v-model="formData.place_birth" />
                    </InputLabel>

                    <div class="w-full bg-blue-300 px-2">
                        <p class="font-semibold text-sm text-gray-900">MARRIAGE INFORMATION </p>
                    </div>
                    <InputLabel label="Legally Married on">
                        :
                        <InputforForm width="100%" v-model="formData.date_marriage" />
                    </InputLabel>
                    <InputLabel label="Legally Married at">
                        :
                        <InputforForm width="100%" v-model="formData.place_marriage" />
                    </InputLabel>
                    <InputLabel label="Solemenized by">
                        :
                        <InputforForm width="100%" v-model="formData.before_by" />
                    </InputLabel>
                    <InputLabel label="Marriage was Registered at">
                        :
                        <InputforForm width="100%" v-model="formData.registered_at" />
                    </InputLabel>
                    <InputLabel label="Marriage had been duly registered with">
                        :
                        <InputforForm width="100%" v-model="formData.registered_at" />
                    </InputLabel>

                </div>
                <div class="w-[20rem] h-full flex-col bg-gray-100 p-4 border-l flex ">
                    <!-- <label for="" class="font-medium text-xs mb-2">Parent/s is</label> -->
                    <select v-model="formData.parent_is" class="border border-gray-300 rounded mb-10 font-medium">
                        <option value="Minor" class="font-medium">Minor</option>
                        <option value="18 years old and Above" class="font-medium">18 years old and above</option>
                        <option value="Surviving Spouse" class="font-medium">Surviving Spouse</option>
                    </select>
                    <div class="flex flex-col gap-2 w-full mt-auto">
                        <label for="" class="font-medium text-xs mb-2">Filling Informarion</label>
                        <InputforForm skip unbordered width="100%" v-model="formData.date_filed" />
                        <InputforForm skip unbordered width="100%" v-model="formData.place_filed" />
                    </div>
                    <div class=" mt-6 flex flex-col gap-1">
                        <button @click="legitimation_modal = false" tabindex="-1"
                            class="border w-full font-bold  py-1.5 px-2 border-gray-300  bg-white hover:bg-red-400 hover:text-white text-gray-800 ml-auto">
                            Exit
                        </button>
                        <button @click="genereate_legitimation"
                            class="border w-full font-bold  py-1.5 px-2 border-gray-300 bg-white text-gray-800 active:bg-blue-600 focus:bg-blue-600 hover:bg-blue-600 active:text-white focus:text-white hover:text-white ml-auto">
                            Create
                        </button>
                    </div>
                </div>
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