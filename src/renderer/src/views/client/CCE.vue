<template>

    <!-- jalbertrosky@hotmail.com:Superc0c0 -->
    <div class="flex flex-col relative justify-center w-full">
        <div class="flex flex-row items-center p-3 px-5 mb-2">
            <p class="text-md font-semibold tracking-tight">FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME

            </p>
            <div class="relative ml-auto">
                <button type="button" @click="dropdown = !dropdown"
                    class=" ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all focus:ring-blue-300 font-medium rounded shadow text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>

                <div v-if="dropdown"
                    class="z-50 right-0 absolute border bg-white shadow-lg divide-y divide-gray-100 rounded-lg  w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li v-for="RA in RA" :key="RA">
                            <a @click="modalOpener(RA)"
                                class=" cursor-pointer block px-4 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                {{ RA }}</a>
                        </li>

                    </ul>
                </div>

            </div>
        </div>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <!-- <TableGrid :data="data" :dataColumns="colDefs" /> -->
        </div>


            <Modal large label="Create Document" v-if="RA9048">
                <template v-slot:header>
                    <ModalCloseButton @click="closeModal" />
                </template>

                <div>
                    <Box title="Document" width="w-fit">
                        <div class="grid grid-cols-2 p-2 gap-3">
                            <Select skip :options="Type" label="Type" v-model="formData.type" />
                            <Select skip :options="DocumentType" label="Document Type"
                                v-model="formData.document_type" />
                        </div>
                    </Box>
                </div>

                <div class="flex flex-col gap-5 overflow-y-scroll py-3 mt-10">
                    <div class="w-full flex item-center justify-center mb-2">
                        <p class="text-lg uppercase font-semibold">PETITION FOR CORRECTION OF CLERICAL ERROR IN THE
                            CERTIFICATE OF LIVE BIRTH
                        </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">

                        <Box title="Petition Details" width="w-full">
                            <div class="grid grid-cols-1 gap-2 w-full">
                                <InputFormatted label="Petition Number"
                                    :docType="formData.type === 'CCE' ? 'CCE' : 'CFN'"
                                    v-model="formData.petition_number" />
                                <Input label="Petitioner Name" v-model="formData.petitioner_name"
                                    @input="formData.petitioner_name = $event.target.value.toUpperCase()" />
                            </div>
                        </Box>

                        <Box title="Petitioner Nationality & Complete Address" width="w-full">
                            <div class="grid grid-cols-2 w-full gap-2 ">

                                <Input label="Nationality" v-model="formData.nationality" skip />
                               

                                <selectLocation @change="formData.petitioner_city = ''" :options="provinces[0]"
                                    id="province" v-model="formData.petitioner_province" Province />
                                <selectLocation :options="municipality[0]" v-model="formData.petitioner_city" City
                                    id="city" />
                                <selectLocation :options="barangay[0]" v-model="formData.petitioner_barangay" Barangay
                                    id="barangay" />

                            </div>
                        </Box>

                    </div>
                    <div class="flex flex-row flex-wrap gap-4 items-stretch">
                        <div class="basis-[35%]" v-if="formData.document_type === 'Birth'">
                            <Box title="seeking for correction of the clerical error in: " width="w-full">
                                <div class="grid grid-rows-2 gap-2 w-full">
                                    <Radio :options="seeking_options" v-model="formData.cce_in" name="cce_in" />
                                </div>
                            </Box>
                        </div>

                        <div class="basis-[60%] grow">
                            <Box title="Document Owner & Relationship to the Owner" width="w-full">
                                <div class="flex flex-row w-full gap-2 ">
                                    <div class="basis-[70%]">
                                        <Input label="Name of Owner" :modelValue="formData.cce_in === 'my' ? 'N/A' : ''"
                                            :readonly="formData.cce_in === 'my' ? true : false"
                                            :skip="formData.cce_in === 'my' ? true : false"
                                            v-model="formData.name_owner"
                                            @input="formData.name_owner = $event.target.value.toUpperCase()" />

                            
                                    </div>
                                    <div class="grow">
                                        <InputSuggestions label="Relation of Owner"
                                            :modelValue="formData.cce_in === 'my' ? 'N/A' : ''"
                                            :readonly="formData.cce_in === 'my' ? true : false"
                                            :skip="formData.cce_in === 'my' ? true : false"
                                            v-model="formData.relation_owner" :items="RelationSuggestion" />
                                    </div>
                                </div>
                            </Box>
                        </div>

                        <div class="basis-[23%]" v-if="formData.document_type === 'Birth'">
                            <Box title="I/ He / She was born on " width="w-full">
                                <div class="grid grid-cols-1 w-full gap-2 ">

                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date
                                            of
                                            Birth</label>
                                        <VueDatePicker :text-input="dateInputOptions" v-model="formData.date_of_birth"
                                            auto-apply :max-date="new Date()"
                                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                            format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                            :month-change-on-scroll="false" position="right" </VueDatePicker>


                                    </div>
                                </div>
                            </Box>
                        </div>


                        <div class="basis-[47%]">
                            <Box title=", at" width="w-ful">
                                <div class="grid grid-cols-2  w-full gap-2 ">
                                    <Input label="Country" v-model="formData.at_country" readonly skip />

                                    <selectLocation @change="formData.at_city = ''" :options="at_province[0]"
                                        id="at_province" v-model="formData.at_province" Province />
                                    <selectLocation :options="at_city[0]" v-model="formData.at_city" City
                                        id="at_city" />

                                </div>
                            </Box>
                        </div>
                        <div class="grow">
                            <Box title="The birth was recorded under " width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <Input label="Registry Number" v-model="formData.registry_number" />

                                </div>
                            </Box>
                        </div>

                    </div>
                    <div class="flex flex-col flex-wrap gap-2">
                        <div class="grow">
                            <Box title="The clerical error(s) to be corrected is (are): " width="w-ful">

                                <div class="flex flex-col gap-2 w-full font-bold">
                                    <div class="flex flex-row w-full items-center justify-center gap-2">
                                        <div class="basis-[10%]">
                                            <p class="text-sm text-center">Item No.</p>
                                        </div>
                                        <div class="grow">
                                            <p class="text-sm text-center">Description</p>

                                        </div>
                                        <div class="grow">
                                            <p class="text-sm text-center">From</p>

                                        </div>
                                        <div class="grow">
                                            <p class="text-sm text-center">To</p>

                                        </div>
                                    </div>

                                </div>

                                <div class="flex flex-col gap-2 w-full">

                                    <!-- <div class="flex flex-row w-full items-center gap-2"
                                        v-for="(   item, index   ) in    items   " :key="index">
                                        <div class="basis-[10%]">
                                            <p class="text-sm text-center">{{ index + 1 }}</p>
                                        </div>
                                        <div class="grow">
                                            <InputSuggestions v-model="formData.description[index]"
                                                :items="DescriptionSuggestions" />

                                        </div>
                                        <div class="grow">
                                            <Input v-model="formData.from[index]"
                                                @input="formData.from[index] = $event.target.value.toUpperCase()" />
                                        </div>
                                        <div class="grow">
                                            <Input v-model="formData.to[index]"
                                                @input="formData.to[index] = $event.target.value.toUpperCase()" />
                                        </div>


                                    </div> -->

                                    <div class="flex flex-row w-full items-center gap-2"
                                        v-for="(   item, index   ) in    items   " :key="index">
                                        <div class="basis-[10%]">
                                            <p class="text-sm text-center">{{ index + 1 }}</p>
                                        </div>
                                        <div class="grow">
                                            <InputSuggestions v-model="formData.clerical_errors.description[index]"
                                                :items="DescriptionSuggestions" />

                                        </div>
                                        <div class="grow">
                                            <Input v-model="formData.clerical_errors.from[index]" />
                                        </div>
                                        <div class="grow">
                                            <Input v-model="formData.clerical_errors.to[index]" />
                                        </div>


                                    </div>
                                    <div class="flex justify-end gap-2">
                                        <button type="button" @click="addItem()"
                                            class="py-2 px-4  mb-2 text-sm font-medium text-white bg-green-400 rounded-full  shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Add
                                        </button>
                                        <button type="button" @click="removeItem()" v-if="items.length > 1"
                                            class="py-2 px-4  mb-2 text-sm font-medium text-white bg-red-400 rounded-full shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Remove
                                        </button>
                                    </div>
                                </div>


                            </Box>
                        </div>
                        <div class="grow">
                            <Box title="The facts/reasons for filing this petition are the following. " width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <label for="message"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facts/Reasons</label>
                                    <textarea id="message" rows="4" v-model="formData.reason"
                                        class="block py-6 px-6  text-justify font-bold w-full text-md text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                </div>
                            </Box>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2">
                        <div class="grow">
                            <Box title=" documents to support this petition: " width="w-ful">
                                <div class="flex flex-col w-full gap-3">
                                    <div class="flex flex-row  w-full gap-2 items-center"
                                        v-for="(support, index) in SupportItems" :key="index">
                                        <p class="basis-[9%] text-sm text-center">{{ index + 1 }})</p>
                                        <div class="basis-[90%]">
                                            <InputSuggestions v-model="formData.SupportingDocuments[index]"
                                                :items="SupportingDocumentsSuggestions" />
                                        </div>
                                    </div>
                                    <div class="flex justify-end gap-2">
                                        <button type="button" @click="addSuppportItem()"
                                            class="py-2 px-4  mb-2 text-sm font-medium text-white bg-green-400 rounded-full  shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Add
                                        </button>
                                        <button type="button" @click="removeSupportItem()"
                                            v-if="SupportItems.length > 1"
                                            class="py-2 px-4  mb-2 text-sm font-medium text-white bg-red-400 rounded-full shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            </Box>
                        </div>
                        <div class="basis-[40%] h-max">
                            <Box title="filing this petition at the LCRO of " width="w-ful">
                                <div class="flex flex-row justify-center gap-2 w-full">
                                    <Input label="City/Municipality" skip v-model="formData.LCRO_city" />
                                    <Input label="Province" skip v-model="formData.LCRO_province" />
                                </div>
                            </Box>
                        </div>
                    </div>

                    <!-- //////////// -->
                    <!-- Page 2 -->
                    <!-- //////////// -->

                    <div class="relative border-b-2 border-dashed flex items-center justify-center mt-10 mb-10">
                        <p class="absolute bg-white px-2 font-semibold italic text-gray-600"> PAGE 2</p>
                    </div>

                    <!-- //////////// -->
                    <!-- Page 2 -->
                    <!-- //////////// -->

                    <div class="flex flex-wrap flex-row gap-4">
                        <div class="basis-[50%]">
                            <Box title="VERIFICATION" width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <Input label="Petitioner Name" skip v-model="formData.petitioner_name"
                                        @input="formData.petitioner_name = $event.target.value.toUpperCase()"
                                        readonly />

                                </div>
                            </Box>
                        </div>
                        <div class="grow">
                            <Box title="ADMINISTERING OFFICER" width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <Input label="Name" skip v-model="formData.administering_officer"
                                        @input="formData.administering_officer = $event.target.value.toUpperCase()" />
                                    <Input label="Position" skip v-model="formData.administering_position" />

                                </div>
                            </Box>
                        </div>
                        <div class="grow">
                            <Box title="SUBSCRIBE AND SWORN" width="w-ful">
                                <div class="grid grid-cols-3  w-full gap-2 ">
                                    <div>
                                    </div>
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date
                                            Sworn</label>
                                        <VueDatePicker :text-input="dateInputOptions" v-model="formData.SwornDate"
                                            auto-apply :max-date="new Date()"
                                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                            format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                            :month-change-on-scroll="false" position="right">
                                        </VueDatePicker>

                         
                                    </div>
                                    <Input label="City/Municipality" skip v-model="formData.SwornCity" />
                                    <Input label="Community Tax Certificate No." v-model="formData.Ctc" />
                                    <Input label="Issued at" v-model="formData.CtcIssuedAt" />
                                    <div>
                                        <label
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Issued
                                            on</label>
                                        <VueDatePicker :text-input="dateInputOptions" v-model="formData.CtcIssuedOn"
                                            auto-apply
                                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                            format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                            :month-change-on-scroll="false" position="right">
                                        </VueDatePicker>

                                    </div>
                                </div>
                            </Box>
                        </div>

                    </div>


                    <div class="flex flex-row gap-2">
                        <div class="basis-[40%]">
                            <Box title="ACTION TAKEN BY THE C/MCR" width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <div class="flex flex-row justify-evenly ">

                                        <Radio :options="action_options" v-model="formData.action" name="action" />
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                        <VueDatePicker :text-input="dateInputOptions" v-model="formData.ActionDate"
                                            auto-apply
                                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                            format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                            :month-change-on-scroll="false" position="right">
                                        </VueDatePicker>
                                    </div>
                                    <Input label="Municipal Civil Registrar" skip v-model="formData.mcr"
                                        @input="formData.mcr = $event.target.value.toUpperCase()" />
                                </div>
                            </Box>
                        </div>
                        <div class="grow">
                            <Box title="Decision" width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">

                                    <textarea id="message" rows="6" v-model="formData.decision"
                                        class="block p-2.5 text-justify font-semibold px-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>

                                </div>
                            </Box>
                        </div>
                    </div>

                    <div class="flex flex-row gap-2">
                        <div class="basis-[35%]">
                            <Box title="Payment of filing fee" width="w-ful">
                                <div class="grid grid-cols-1  w-full gap-2 ">
                                    <Input label="O.R. No." type="number" v-model="formData.or_number" />
                                    <Input label="Amount Paid" v-model="formData.amount_paid" />
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date
                                            Paid</label>
                                        <VueDatePicker :text-input="dateInputOptions" v-model="formData.DatePaid"
                                            auto-apply
                                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                            format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                            :month-change-on-scroll="false" position="right">
                                        </VueDatePicker>
                                    </div>

                                </div>
                            </Box>
                        </div>


                        <div class="grow">
                            <Box title="DATE PREVIEW" width="w-ful">
                                <div class="flex flex-col w-full gap-2 items-start">
                                    <div class="w-[50%]">
                                        <div>
                                            <label
                                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notice
                                                of
                                                Posting</label>
                                            <VueDatePicker :text-input="dateInputOptions"
                                                v-model="formData.notice_posting" auto-apply
                                                input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                                format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                                :month-change-on-scroll="false" position="right">
                                            </VueDatePicker>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-center w-full ">
                                        <p class=" font-bold text-center uppercase"> Certificate of Posting</p>
                                        <div class="flex flex-row w-full justify-evenly relative">
                                            <div>
                                                <label
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start</label>
                                                <VueDatePicker :text-input="dateInputOptions"
                                                    v-model="formData.certificate_posting_start" auto-apply
                                                    input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                                    format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                                    :month-change-on-scroll="false" position="right">
                                                </VueDatePicker>
                                            </div>
                                            <p class="absolute top-10 font-bold text-xs ">TO</p>
                                            <div>
                                                <label
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End</label>
                                                <VueDatePicker :text-input="dateInputOptions"
                                                    v-model="formData.certificate_posting_end" auto-apply
                                                    input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                                    format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                                    :month-change-on-scroll="false" position="right">
                                                </VueDatePicker>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-col justify-start  gap-5 mt-10 items-start w-full ">
                                        <div class="w-[50%]">
                                            <div>
                                                <label
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Date Issued</label>
                                                <VueDatePicker :text-input="dateInputOptions"
                                                    v-model="formData.date_issued" auto-apply
                                                    input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                                    format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                                    :month-change-on-scroll="false" position="right">
                                                </VueDatePicker>
                                            </div>
                                        </div>
                                        <div class="w-[50%]">
                                            <div>
                                                <label
                                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Date Granted</label>
                                                <VueDatePicker :text-input="dateInputOptions"
                                                    v-model="formData.date_granted" auto-apply
                                                    input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                                                    format="MMMM dd, yyyy" model-type="MMMM dd, yyyy"
                                                    :month-change-on-scroll="false" position="right">
                                                </VueDatePicker>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </div>

                </div>
                <template v-slot:footer>
                    <button type="button" @click="submitForm()"
                        class="py-2 px-4  mb-2 text-sm font-medium text-white bg-green-400  rounded-sm shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Submit
                    </button>

                </template>
            </Modal>
       



<Modal small v-if="processing">

    <template v-slot:footer>
                    <button type="button" @click="processing = false"
                        class="py-2 px-4  mb-2 text-sm font-medium text-white bg-green-400  rounded-sm shadow-sm  hover:text-white  focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Close
                    </button>

    </template>
</Modal>




    </div>



</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'
import { FwbRadio } from 'flowbite-vue';
import TableGrid from '../../components/TableGrid.vue';
import Radio from '../../components/essentials/inputs/Radio.vue';


import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import { ref, reactive, computed, onMounted, toRaw } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import { onClickOutside } from '@vueuse/core'
import Box from '../../components/essentials/Box.vue';
import Select from '../../components/essentials/inputs/Select.vue';
import Input from '../../components/essentials/inputs/Input.vue';
import philippines from '../../utils/philippines'
import selectLocation from '../../components/essentials/inputs/select/select-location.vue';
import InputSuggestions from '../../components/essentials/inputs/InputSuggestions.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import InputFormatted from '../../components/essentials/inputs/InputFormatted.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useDateFormat, useNow } from '@vueuse/core'
import { 
    now_date, 
    add_date_notice, 
    add_date_certificate_start, 
    add_date_certificate_end,
    add_date_issued,
    add_date_granted
} from '../../utils/DayPosting.js'


const processing = ref(false)
const dateInputOptions = ref({
    format: 'PP'
})


const RelationSuggestion = ref([
    'Father',
    'Mother',
    'Brother',
    'Sister',
])

const SupportingDocumentsSuggestions = ref([
    'My Certificate of Live Birth',
    'My Baptismal Certificate',
    'My School Records',
    'My Postal ID',
    'My Voter\'s Certification',
    'My Community Tax Certificate',
])

const DescriptionSuggestions = ref([
    'Child\'s first name',
    'Child\'s middle name',
    'Child\'s last name',
])

const address = philippines
const region = ref("01")


const RA9048 = ref(false)

const regions = computed(() => {
    return [...new Set(address.map(data => data))].sort((a, b) => a - b);
});


const provinces = computed(() => {
    return [...new Set(address.map(data => data[region.value].province_list))].sort((a, b) => a - b);
});

const municipality = computed(() => {
    const selectedProvince = formData.petitioner_province;
    if (!selectedProvince) {
        return [];
    }
    return [...new Set(address.map(data => data[region.value].province_list[selectedProvince].municipality_list))].sort((a, b) => a - b) || [];
});

const barangay = computed(() => {
    const selectedProvince = formData.petitioner_province;
    const selectedMunicipality = formData.petitioner_city;
    if (!selectedProvince || !selectedMunicipality) {
        return [];
    }
    return [...new Set(address.map(data => data[region.value].province_list[selectedProvince].municipality_list[selectedMunicipality].barangay_list))].sort((a, b) => a - b) || [];
});


const at_province = computed(() => {
    return [...new Set(address.map(data => data[region.value].province_list))].sort((a, b) => a - b);
});

const at_city = computed(() => {
    const selectedProvince = formData.at_province;
    if (!selectedProvince) {
        return [];
    }
    return [...new Set(address.map(data => data[region.value].province_list[selectedProvince].municipality_list))].sort((a, b) => a - b);
});


const modalOpener = (RA) => {
    if (RA === 'R.A. 9048') {
        RA9048.value = !RA9048.value
    }
    else {
        console.log('is it')
    }
}

function closeModal() {
    RA9048.value = false
}


const dropdown = ref(false)
onClickOutside(dropdown, event => dropdown.value = false)

const items = ref([1])

const addItem = () => {
    items.value.push('');
}
const removeItem = () => {
    if (items.value.length > 1) {
        const indexToRemove = items.value.length - 1;
        items.value.splice(indexToRemove, 1);
        formData.clerical_errors.description.splice(indexToRemove, 1)
        formData.clerical_errors.from.splice(indexToRemove, 1)
        formData.clerical_errors.to.splice(indexToRemove, 1)
    }

};


const SupportItems = ref([1])

const addSuppportItem = () => {
    SupportItems.value.push('');
}
const removeSupportItem = () => {
    if (SupportItems.value.length > 1) {
        const indexToRemove = SupportItems.value.length - 1;
        SupportItems.value.splice(indexToRemove, 1);
        formData.SupportingDocuments.splice(indexToRemove, 1)
    }
};

const seeking_options = ref({
    'my': 'my Certificate of Live Birth',
    'the': 'the Certificate of Live Birth of',
})
const action_options = ref({
    'Granted': 'Granted',
    'Denied': 'Denied (Provide the basis for denial)',
})



const RA = ref([
    "R.A. 9048",
    "R.A. 10172"
])

const Type = ref(
    ["CCE",
        "CFN"]
)
const DocumentType = ref(
    ["Birth",
        "Death", "Marriage"]
)

const colDefs = ref([
    { field: "name", headerName: "Petitioner Number", flex: 2, filter: true, pinned: 'left', lockPinned: true, },
    { field: "name", headerName: "Petitioner Name", flex: 1, filter: true },
    { field: "name", headerName: "Document Owner", flex: 1, filter: true },
    { field: "name", headerName: "Relationship", flex: 1, filter: true },
    { field: "name", headerName: "Date Filed", flex: 1, filter: true },
    { field: "name", headerName: "Status", flex: 1, filter: true },
    { field: "name", headerName: "Date Forwarded to CRG", flex: 1, filter: true },
    { headerName: "Action", flex: 1, pinned: 'right', lockPinned: true, resizable: false, sortable: false },

]);

const date_now = ref(now_date())

const date_notice = ref(add_date_notice())
const date_certificate_start = ref(add_date_certificate_start())
const date_certificate_end = ref(add_date_certificate_end())
const date_of_issued = ref(add_date_issued())
const date_of_granted = ref(add_date_granted())



const formData = reactive({
    type: 'CCE',
    document_type: 'Birth',
    petition_number: '',
    petitioner_name: '',
    nationality: 'Filipino',
    petitioner_province: '',
    petitioner_city: '',
    petitioner_barangay: '',
    cce_in: 'my', // 

    name_owner: '',
    relation_owner: '',
    date_of_birth: '',
    at_city: '',
    at_province: '',
    at_country: 'Philippines',
    registry_number: '',

    clerical_errors: {
        description: [],
        from: [],
        to: []
    },

    description: [],
    from: [],
    to: [],

    reason: 'To correct',
    SupportingDocuments: [],
    LCRO_city: 'Bayambang',
    LCRO_province: 'Pangasinan',

    // Page 2


    administering_officer: 'ISMAEL D. MALICDEM, JR.',
    administering_position: 'Municipal Civil Registrar',


    SwornDate: date_now,
    SwornCity: 'Bayambang, Pangasinan',

    Ctc: '',
    CtcIssuedOn: 'Bayambang, Pangasinan',
    CtcIssuedAt: '',


    action: '',
    ActionDate: '',
    mcr: 'ISMAEL D. MALICDEM, JR.',
    decision: '',


    or_number: '',
    amount_paid: '',
    DatePaid: date_now,



    notice_posting: date_notice,
    certificate_posting_start: date_certificate_start,
    certificate_posting_end: date_certificate_end,


    date_issued: date_of_issued,
    date_granted: date_of_granted

});



const submitForm = async () => {
    
    closeModal()

    processing.value = true
    // const data = {

    // type: formData.type,
    // document_type: formData.document_type,
    // petition_number: formData.petition_number,
    // petitioner_name: formData.petitioner_name,
    // nationality: formData.nationality,
    // petitioner_province: formData.petitioner_province,

    // petitioner_city: formData.petitioner_city,
    // petitioner_barangay: formData.petitioner_barangay,
    // cce_in: formData.cce_in, 

    // name_owner: formData.name_owner,
    // relation_owner: formData.relation_owner,
    // date_of_birth: formData.date_of_birth,
    // at_city: formData.at_city,
    // at_province: formData.at_province,
    // at_country: formData.at_country,
    // registry_number: formData.registry_number,


    // // clerical_errors: clerical, // Not Working


    // reason: formData.reason,
    // LCRO_city: formData.LCRO_city,
    // LCRO_province: formData.LCRO_province,

    // administering_officer: formData.administering_officer,
    // administering_position: formData.administering_position,


    // SwornDate: formData.SwornDate,
    // SwornCity: formData.SwornCity,

    // Ctc: formData.Ctc,
    // CtcIssuedOn: formData.CtcIssuedOn,
    // CtcIssuedAt: formData.CtcIssuedAt,


    // action: formData.action,
    // ActionDate: formData.ActionDate,
    // mcr: formData.mcr,
    // decision: formData.decision,


    // or_number: formData.or_number,
    // amount_paid: formData.amount_paid,
    // DatePaid: formData.DatePaid,



    // notice_posting: formData.notice_posting,
    // certificate_posting_start: formData.certificate_posting_start,
    // certificate_posting_end: formData.certificate_posting_end,


    // date_issued: formData.date_issued,
    // date_granted: formData.date_granted

    // }
    // const check = await window.ClericalApi.PrintLiveBirth(data);
}

</script>
