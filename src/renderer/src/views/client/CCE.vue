<template>
  <div class="flex flex-col relative justify-center w-full p-10 CCEMAIN ">
    <Header label="FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME">
      <Button label="Create" isActive :class="`rounded`" @click="open_modal()" />
      <!-- <button class="text-gray-600 " @click="settings = true"><font-awesome-icon icon="fa-solid fa-gear" /></button> -->
    </Header>

    <!-- <ClericalErrorSettings v-if="settings" @close-setting="settings = false" /> -->
    <!-- <ValidateClericalPopup @proceed="create_validated_document" v-if="is_validating" /> -->

    <div class="h-[calc(100vh-250px)] relative">

    </div>

    <Modal large label="Create a new Document" footerBG="bg-white shadow-md border-t-2" v-if="petition_modal">
      <template v-slot:header>
        <ModalCloseButton @click="close_modal()" />
      </template>

      <!-- Input Fields -->
      <div class="flex flex-col sm:px-4 md:lg:px-[20rem] overflow-y-scroll h-max w-full gap-4 relative bg-slate-100"
        :style="bgTexture">
        <div class="absolute right-10 top-10 flex flex-col w-[25rem]">
          <p v-for="(value, key) in formData" class="text-red-500">"{{ key }}" - <span class="text-gray-800 font-medium">{{ value }}</span></p>
        </div>
        <!-- 1st  Document Selector-->
        <div class="flex items-center justify-center p-2" ref="isFormVisible">
          <Box title="Document" width="w-fit ">
            <div class="flex flex-row flex-wrap p-2 gap-3 items-center justify-center w-full" ref="documentChanger"
              tabindex="-1">
              <Select skip :options="republic_act" v-model="formData.republic_act_number" label="Republic Act" />
              <Select skip :options="petition_type" v-model="formData.petition_type" label="Petition Type" />
              <Select skip :options="event_type" v-model="formData.event_type" label="Document Type" />
            </div>
          </Box>
        </div>
        <!-- 2nd Header-->
        <div class="flex flex-col gap-5 overflow-y-scroll py-3 mt-5 px-10">
          <HeaderCCE :petition_type="formData.petition_type" :type_label="document_type_label" />
        </div>
        <!-- 3rd Petition Details and Address-->
        <div class="grid grid-cols-1 gap-4">
          <Box title="Petition Details" width="w-full">
            <div class="grid grid-cols-1 w-full gap-3">
              <div class="w-full flex flex-col">
                <label class="basis-[100%] block mb-2 text-sm font-medium text-gray-900 dark:text-white">Petition
                  Number</label>
                <MultiInput />
              </div>
              <Input label="Petitioner Name" v-model="formData.petitioner_name"
                @input="formData.petitioner_name = $event.target.value.toUpperCase()" />
            </div>
          </Box>

          <Box title="Petitioner Nationality & Complete Address" width="w-full">
            <div class="grid grid-cols-3 w-full gap-2">
              <Input label="Nationality" v-model="formData.nationality" skip />
              <div class=" col-span-2">
                <Input label="Petitioner Address" v-model="formData.petitioner_address" />
              </div>
            </div>
          </Box>
        </div>
        <!-- 5th  Seeking and Document Owner and Relation-->
        <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-4 items-stretch">
          <div class="basis-[35%]" v-if="
            formData.event_type === 'Birth' ||
            formData.event_type === 'Marriage' ||
            formData.event_type !== 'Death'
          ">
            <Box title="seeking for correction of the clerical error in: " width="w-full">
              <div class="grid grid-rows-2 gap-2 w-full">
                <Radio :options="seeking_options" v-model="formData.petitioner_error_in" name="cce_in" />
              </div>
            </Box>
          </div>
          <div class="basis-[60%] grow">
            <Box title="Document Owner & Relationship to the Owner" width="w-full">
              <div class=" grid grid-cols-1 w-full gap-2">
                <div class="w-full">
                  <Input :label="formData.event_type === 'Marriage' && formData.petitioner_error_in === 'my'
                    ? 'Complete Name of Spouse'
                    : 'Document Owner'
                    " v-model="formData.document_owner" :readonly="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                      ? true
                      : false || formData.petitioner_error_in === ''
                      " :skip="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                        ? true
                        : false || formData.petitioner_error_in === ''
                        " @input="formData.document_owner = $event.target.value.toUpperCase()" />
                </div>
                <div v-if="
                  formData.event_type === 'Birth' ||
                  formData.event_type === 'Death' ||
                  (formData.event_type === 'Marriage' && formData.petitioner_error_in === 'the')
                ">
                  <Input label="Relation" v-model="formData.relation_owner" :readonly="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                    ? true
                    : false || formData.petitioner_error_in === ''
                    " :skip="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                      ? true
                      : false || formData.petitioner_error_in === ''
                      " @input="formData.document_owner = $event.target.value.toUpperCase()" />
                </div>
              </div>
            </Box>
          </div>
        </div>
        <!-- 6th Event Date and Place-->
        <div class="flex sm:flex-col md:lg:flex-row gap-5">
          <div class="basis-[30%]">
            <Box :title="IHeSheLabel" width="w-full">
              <div class="grid grid-cols-1 w-full gap-2">
                <Input :label="event_date_label" v-model="formData.event_date" skip />
              </div>
            </Box>
          </div>

          <div class="basis-[45%]">
            <Box title=", at" width="w-full ">
              <div class="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-2">
                <Input label="Country" v-model="formData.event_country" skip />
                <Input label="Province" v-model="formData.event_province" />
                <Input label="Municipalty" v-model="formData.event_municipality" />
              </div>
            </Box>
          </div>

          <div class="grow">
            <Box :title="`The ${registry_label} was recorded under`" width="w-full ">
              <div class="grid grid-cols-1 w-full gap-2 sm:mt-5">
                <Input label="Registry Number" v-model="formData.registry_number" />
              </div>
            </Box>
          </div>
        </div>
        <!-- 7th Clerical Errors And Facts and Reasons-->
        <div class="flex flex-row flex-wrap gap-5">
          <!-- Subpart 1: Shows when Petition Type is CCE -->
          <div class="grow" v-if="formData.petition_type === 'CCE'">
            <Box title="The clerical error(s) to be corrected is (are): " width="w-full">
              <div class="flex flex-col gap-2 w-full font-bold relative">
                <div class="absolute w-auto -top-4 right-4">
                  <p class="text-xs italic text-gray-400 font-normal">
                    <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1" />
                    <span class="font-medium">Crtl + Space</span> to add new column
                  </p>
                </div>
                <div class="flex flex-row w-full items-center justify-center gap-2 mt-4">
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

              <div class="flex flex-col gap-2 w-full mt-5">
                <div class="flex flex-row w-full items-center gap-2" v-for="(value, index) in clerical_errors_items"
                  :key="index">
                  <div class="basis-[10%]">
                    <p class="text-sm text-center">
                      {{ index + 1 }}
                    </p>
                  </div>

                  <div class="grow">
                    <Input nolabel v-model="formData.clerical_errors[index].description" />
                  </div>
                  <div class="grow">
                    <Input nolabel v-model="formData.clerical_errors[index].error_description_from" />
                  </div>
                  <div class="grow">
                    <Input nolabel v-model="formData.clerical_errors[index].error_description_to" />
                  </div>
                </div>
                <div class="flex justify-end gap-2 mt-3">
                  <button type="button" @click="remove_clerical_error()" v-if="clerical_errors_items.length > 1"
                    class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Remove
                  </button>
                  <button type="button" @click="add_clerical_error()"
                    class="py-1 px-3 font-mono text-sm font-medium text-white bg-green-400 hover:bg-green-500 hover:shadow-md rounded-sm tracking-wider transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Add
                  </button>
                </div>
              </div>
            </Box>
          </div>
          <!-- Subpart 2: Shows when Petition Type is CFN -->
          <div class="basis-[60%]" v-if="
            formData.petition_type === 'CFN' &&
            formData.event_type === 'Birth' &&
            formData.republic_act_number === '9048'
          ">
            <Box title="The first name to be change  " width="w-full">
              <div class="grid grid-cols-2 gap-2 w-full">
                <Input label="From" @input="formData.first_name_from = $event.target.value.toUpperCase()"
                  v-model="formData.first_name_from" />
                <Input @input="formData.first_name_to = $event.target.value.toUpperCase()" label="To"
                  v-model="formData.first_name_to" />
              </div>
            </Box>
          </div>
          <!-- Subpart 2.2: Shows when Petition Type is CFN -->
          <div class="grow" v-if="
            formData.petition_type === 'CFN' &&
            formData.event_type === 'Birth' &&
            formData.republic_act_number === '9048'
          ">
            <Box title="The grounds for filing this petition are the following  " width="w-full">
              <div class="flex flex-col gap-5 text-md font-base justify-center">
                <div class="flex flex-row gap-2 items-center">
                  <p class="basis-[2%] font-serif">a)</p>
                  <CheckBox v-model="formData.ground_a" />
                  <div>
                    <label for="">The first name is extremely difficult to write or
                      pronounce;</label>
                  </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                  <p class="basis-[2%] font-serif">b)</p>
                  <CheckBox v-model="formData.ground_b" />

                  <div class="relative">
                    I have/He/She has habitually and continuously used
                    <div class="absolute -top-[1.2rem] left-[23rem]">
                      <Input nolabel :class="`flex text-center`" v-model="formData.ground_b_data"
                        :readonly="formData.ground_b ? false : true" :skip="formData.ground_b ? false : true" />
                    </div>
                    _______________________________ &nbsp;and I/He/She is publicly known
                    in the community with that first name;
                  </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                  <p class="basis-[2%] font-serif">c)</p>
                  <CheckBox v-model="formData.ground_c" />
                  <div for="one">
                    <label for="one" class="cursor-pointer">
                      The first name is tainted with dishonor;</label>
                  </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                  <p class="basis-[2%] font-serif">d)</p>
                  <CheckBox v-model="formData.ground_d" />
                  <div>The first name is ridiculous;</div>
                </div>
                <div class="flex flex-row gap-2 items-center flex-wrap">
                  <p class="basis-[2%] font-serif">e)</p>
                  <CheckBox v-model="formData.ground_e" />
                  <div>The first name causes confusion;</div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                  <p class="basis-[2%] font-serif">f)</p>
                  <CheckBox v-model="formData.ground_f" />
                  <div class="relative w-max">
                    Others: (Specify)
                    <div class="absolute -top-[1.2rem] left-[7.4rem] w-full">
                      <Input nolabel v-model="formData.ground_f_data" :class="`flex text-center`"
                        :readonly="formData.ground_f ? false : true" :skip="formData.ground_f ? false : true" />
                    </div>
                    ________________________________________________________.
                  </div>
                </div>
              </div>
            </Box>
          </div>
          <!-- Subpart 3: Shows when Petition Type CCE -->
          <div class="basis-[100%]" v-if="formData.petition_type !== 'CFN'">
            <Box title="The facts/reasons for filing this petition are the following. " width="w-ful">
              <div class="flex flex-col w-full" v-if="
                formData.petition_type === 'CCE' &&
                formData.event_type === 'Birth' &&
                formData.republic_act_number === '10172'
              ">
                <div class="flex flex-row w-full p-2 gap-2" v-for="(value, index) in clerical_errors_items"
                  :key="index">
                  <div class="basis-[20%] px-8 flex items-center">
                    <label :for="index" class="text-sm text-nowrap w-full font-semibold tracking-wide text-gray-900">
                      For error No. {{ index + 1 }}:
                    </label>
                  </div>
                  <div class="flex flex-col grow">
                    <textarea rows="3" :id="index" v-model="formData.reasons[index]"
                      class="block py-3 tracking-wider px-6 text-justify font-semibold w-full text-md text-black bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 w-full gap-2" v-else>
                <TextArea :rows="4" label="Facts/Reasons" v-model="formData.reasons[0]" />
              </div>
            </Box>
          </div>
        </div>
        <!-- 8th Supporting Documents Note: Need to fix buttons and designs-->
        <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-2">
          <div class="grow">
            <Box title=" documents to support this petition: " width="w-ful">
              <div class="flex flex-col w-full gap-3 mt-5 relative">
                <div class="absolute w-auto -top-9 right-4">
                  <p class="text-xs italic text-gray-400 font-normal">
                    <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1" />
                    <span class="font-medium">Crtl + Space</span> to add new column
                  </p>
                </div>
                <div class="flex flex-row w-full gap-2 items-center" v-for="(value, index) in supporting_items"
                  :key="index">
                  <p class="basis-[9%] text-sm text-center">
                    {{ indexToLetter(index) }} )
                  </p>
                  <div class="basis-[90%]">
                    <Input skip v-model="formData.supporting_documents[index]" />
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <!-- Make this component -->
                  <button type="button" @click="remove_supporting_documents()" v-if="supporting_items.length > 1"
                    class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Remove
                  </button>
                  <button type="button" @click="add_supporting_documents()"
                    class="py-1 px-3 font-mono text-sm font-medium text-white bg-green-400 hover:bg-green-500 hover:shadow-md rounded-sm tracking-wider transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Add
                  </button>
                </div>
              </div>
            </Box>
          </div>
          <div class="basis-[40%] h-max">
            <Box title="filing this petition at the LCRO of " width="w-ful">
              <div class="grid sm:grid-cols-1 lg:grid-cols-1 justify-center gap-2 w-full">
                <Input label="City/Municipality" skip v-model="formData.filing_city_municipality" />
                <Input label="Province" skip v-model="formData.filing_province" />
              </div>
            </Box>
          </div>
        </div>

        <!-- 9th  Page 2 Starts-->
        <div class="relative border-b-2 border-dashed flex items-center justify-center mt-10 mb-10">
          <p class="absolute bg-yellow-100 px-2 font-semibold italic text-gray-600">
            PAGE 2
          </p>
        </div>
        <!-- 10th Verification, Administering and CTC-->
        <div class="flex flex-wrap sm:flex-col md:lg:flex-row gap-4">
          <div class="basis-[50%]">
            <Box title="VERIFICATION" width="w-ful">
              <div class="grid grid-cols-1 w-full gap-2">
                <Input label="Petitioner Name" skip v-model="formData.petitioner_name"
                  @input="formData.petitioner_name = $event.target.value.toUpperCase()" readonly />
              </div>
            </Box>
          </div>

          <div class="grow">
            <Box title="ADMINISTERING OFFICER" width="w-ful">
              <div class="grid grid-cols-1 w-full gap-2">
                <Input label="Name" skip v-model="formData.administering_officer_name"
                  @input="formData.administering_officer_name = $event.target.value.toUpperCase()" />
                <Input label="Position" skip v-model="formData.administering_officer_position" />
              </div>
            </Box>
          </div>

          <div class="grow">
            <Box title="SUBSCRIBE AND SWORN" width="w-ful">
              <div class="grid sm:grid-cold-1 md:lg:grid-cols-3 w-full gap-2">
                <div></div>
                <Input label="Date Sworn" skip v-model="formData.subscribe_sworn_date" />
                <Input label="City/Municipality" skip v-model="formData.subscribe_sworn_city_municipality" />
                <Input label="Community Tax Certificate No." v-model="formData.community_tax_certificate" />
                <Input label="Issued at" skip v-model="formData.issued_at" />
                <Input label="Issued on" skip v-model="formData.issued_on" />
              </div>
            </Box>
          </div>
        </div>
        <!-- 11th Action Taken-->
        <div class="flex flex-row gap-2">

          <div class="basis-[100%]">
            <Box title="ACTION TAKEN BY THE C/MCR" width="w-full ">
              <div class="grid grid-cols-1 w-full gap-2">
                <!-- Subpart 1: Shows when republic act is 10172 -->
                <div class="flex flex-col" v-for="(value, index) in clerical_errors_items" :key="index">
                  <div class="flex flex-row justify-evenly">
                    <Radio :options="action_options"  :name="'action_'+index "
                      v-model="formData.actions[index].action" />
                  </div>
                  <div class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                    <textarea id="message" rows="6" v-model="formData.actions[index].decision"
                      class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                  </div>
                </div>


                <div class="grid grid-cols-2 gap-4 px-14 lg:px-24 lg:gap-10">
                  <Input type="date" label="Date" skip v-model="formData.action_taken_date" />
                  <Input label="Municipal Civil Registrar" skip v-model="formData.municipal_civil_registrar"
                    @input="formData.municipal_civil_registrar = $event.target.value.toUpperCase()" />
                </div>
              </div>
            </Box>
          </div>



        </div>
        <!-- 12th Payment and Date Preview-->
        <div class="flex sm:flex-col md:lg:flex-row gap-2">
          <div class="basis-[35%]">
            <Box title="Payment of filing fee" width="w-ful">
              <div class="grid grid-cols-1 w-full gap-2">
                <Input label="O.R. No." type="text" v-model="formData.o_r_number" />
                <InputCurrency label="Amount Paid" v-model="formData.amount_paid" />
                <Input label="Date Paid" type="date" v-model="formData.date_paid" />

              </div>
            </Box>
          </div>

          <div class="grow">
            <Box title="DATE PREVIEW" width="w-ful">
              <div class="flex flex-col w-full gap-2 items-start">
                <div class="grid grid-cols-2 w-full gap-4">
                  <Input label="Date Filled" type="date" v-model="formData.notice_posting" />
                  <Input label="Notice of Posting" type="date" v-model="formData.notice_posting" />
                </div>

                <div class="flex flex-col items-center w-full gap-2 bg-yellow-100/20 mt-3">
                  <div class="border border-dashed border-yellow-400 w-full mb-5"></div>
                  <p class="font-bold text-center uppercase">Certificate of Posting</p>
                  <div class="flex flex-row w-full justify-evenly relative">
                    <div>
                      <Input label="Start" type="date" v-model="formData.certificate_posting_start" />
                    </div>
                    <p class="absolute top-10 font-bold text-xs">TO</p>
                    <div>
                      <Input label="End" type="date" v-model="formData.certificate_posting_end" />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div class="w-auto">
                      <Input label="Date Issued" type="date" v-model="formData.petition_date_issued" />
                    </div>
                  </div>
                  <div class="border border-dashed border-yellow-400 w-full mt-5"></div>
                </div>

                <div class="flex flex-col justify-start gap-5 mt-3 items-start w-full">
                  <div class="w-[50%]">
                    <Input label="Date Granted" type="date" v-model="formData.petition_date_granted" />
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>

      <template v-slot:footer>
        <div class="h-full flex items-center justify-end gap-2 w-full px-5 rounded-md font-medium ">
          <button type="button"
            class="bg-white px-3 py-1.5 border rounded transition-all border-gray-300 hover:bg-blue-500 hover:text-white"
            @click="submitForm()">Submit</button>
        </div>
      </template>
    </Modal>


  </div>
</template>

<script setup>

import { usePetitions } from "../../stores/Petition/Petitions.js";
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import { ref, onMounted, reactive, computed, defineAsyncComponent } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Header from "../../components/essentials/header.vue";
import Modal from "../../components/client/modal/Modal.vue";
import Button from "../../components/essentials/buttons/Button.vue";
import Box from '../../components/essentials/Box.vue'
import Select from "../../components/essentials/inputs/Select.vue";
import HeaderCCE from "../../components/essentials/HeaderCCE.vue";
import Input from "../../components/essentials/inputs/Input.vue";
import MultiInput from "../../components/essentials/inputs/MultiInput.vue";
import Radio from "../../components/essentials/inputs/Radio.vue";
import InputCurrency from "../../components/essentials/inputs/InputCurrency.vue";
import { useSetup } from "../../stores/Setting/setup.js";
import CheckBox from "../../components/essentials/buttons/CheckBox.vue";
import TextArea from "../../components/essentials/inputs/TextArea.vue";


const system_setting = useSetup() // System Settings, Default Values
const AutoComplete = defineAsyncComponent(() =>
  import("../../components/essentials/inputs/AutoComplete.vue")
);


const petitions = usePetitions();
const petition_modal = ref(false)
onMounted(async () => {
  system_setting.getSystemSetting()
});

const open_modal = () => {
  petition_modal.value = true
}
const close_modal = () => {
  petition_modal.value = false
}
const supporting_items = ref([0])
const clerical_errors_items = ref([0])

const republic_act = ref(['9048', '10172'])
const petition_type = ref(["CCE", "CFN"])
const event_type = ref(['Birth', 'Death', 'Marriage'])

const seeking_options = computed(() => {
  switch (formData.event_type) {
    case "Birth":
      return {
        my: "my Certificate of Live Birth",
        the: "the Certificate of Live Birth of",
      };
    case "Death":
      return null;
    case "Marriage":
      return {
        my: "my Certificate of Marriage entered into with",
        the: "the Certificate of Marriage of",
      };
    default:
      return "";
  }
});
const document_type_label = computed(() => {
  return formData.event_type === 'Birth' ? 'Live Birth' : formData.event_type === 'Death' ? 'Death' : formData.event_type === 'Marriage' ? 'Marriage' : ''
});
const event_date_label = computed(() => {
  return formData.event_type === 'Birth' ? 'Date of Birth' : formData.event_type === 'Death' ? 'Date of Death' : formData.event_type === 'Marriage' ? 'Date of Marriage' : ''
});
const registry_label = computed(() => {
  switch (formData.event_type) {
    case "Birth":
      return "birth";
    case "Death":
      return "death";
    case "Marriage":
      return "marriage";
    default:
      return "";
  }
});
const IHeSheLabel = computed(() => {
  switch (formData.event_type) {
    case "Birth":
      return "I/He/She was born on";
    case "Death":
      return "He/She was died on";
    case "Marriage":
      return "I/He/She contracted marriage on";
    default:
      return "";
  }
});
const action_options = ref({
  Granted: "Granted",
  Denied: "Denied (Provide the basis for denial)",
});
function indexToLetter(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[index].toLowerCase();
}

function add_clerical_error() {
  clerical_errors_items.value.push('');
  const newClericalError = {
    description: '',
    error_description_from: '',
    error_description_to: '',
  };

  formData.clerical_errors.push(newClericalError);

  if (formData.republic_act_number === '10172') {
    formData.reasons.push('')
    const newActions = {
      action: '',
      description: ''
    }
    formData.actions.push(newActions);
  }
}
function remove_clerical_error() {
  if (clerical_errors_items.value.length > 1) {
    const indexToRemove = clerical_errors_items.value.length - 1;
    clerical_errors_items.value.splice(indexToRemove, 1);
    formData.clerical_errors.splice(indexToRemove, 1);
    if (formData.republic_act_number === '10172') {
      formData.reasons.splice(indexToRemove, 1);
    }
  }
}

function add_supporting_documents() {
  supporting_items.value.push('');
  formData.supporting_documents.push('');
}
function remove_supporting_documents() {
  if (supporting_items.value.length > 1) {
    const indexToRemove = supporting_items.value.length - 1;
    supporting_items.value.splice(indexToRemove, 1);
    formData.supporting_documents.splice(indexToRemove, 1);
  }
}

const initialForm = {
  date_filed: new Date,
  republic_act_number: '9048',
  petition_type: 'CCE',
  event_type: 'Birth',
  petition_number: '',
  petitioner_name: '',
  nationality: 'Filipino',
  petitioner_address: '',
  petitioner_error_in: '',
  document_owner: '',
  relation_owner: '',
  event_date: '',
  event_country: '',
  event_province: '',
  event_municipality: '',
  registry_number: '',
  filing_city_municipality: '',
  filing_province: '',
  administering_officer_name: '',
  administering_officer_position: '',
  subscribe_sworn_date: '',
  subscribe_sworn_city_municipality: '',
  community_tax_certificate: '',
  issued_at: '',
  issued_on: '',
  action_taken_date: '',
  municipal_civil_registrar: system_setting.municipal_civil_registrar,
  // Payment
  o_r_number: '',
  amount_paid: '',
  date_paid: '',

  // Change of First Name. Nullable Data
  first_name_from: '',
  first_name_to: '',
  ground_a: false,
  ground_b: false,
  ground_c: false,
  ground_d: false,
  ground_e: false,
  ground_f: false,
  ground_b_data: '',
  ground_f_data: '',

  notice_posting: '',
  certificate_posting_start: '',
  certificate_posting_end: '',
  petition_date_issued: '',
  petition_date_granted: '',

  // Actions 

  actions: [
    {
      action: '',
      decision: ''
    }
  ],

  // Supporting Documents

  supporting_documents: [''],

  // Actions 

  clerical_errors: [
    {
      description: '',
      error_description_from: '',
      error_description_to: '',
    }
  ],

  // Reasons 

  reasons: [''],
}

const formData = reactive({ ...initialForm })

const submitForm = async () => {

  const date_now = new Date()

  const petition_ = {
    date_filed: date_now,
    republic_act_number: formData.ra,
    document_type: formData.document_type,
    event_type: formData.event_type,
    petition_number: formData.petition_number,
    petitioner_name: formData.petitioner_name,
    nationality: formData.nationality,
    petitioner_address: formData.petitioner_address,
    petitioner_error_in: formData.petitioner_error_in,
    document_owner: formData.document_owner,
    relation_owner: formData.relation_owner,
    event_date: formData.event_date,
    event_country: formData.event_country,
    event_province: formData.event_province,
    event_municipality: formData.event_municipality,
    registry_number: formData.registry_number,
    filing_city_municipality: formData.filing_city_municipality,
    filing_province: formData.filing_province,
    administering_officer_name: formData.administering_officer_name,
    administering_officer_position: formData.administering_officer_position,
    subscribe_sworn_date: formData.subscribe_sworn_date,
    subscribe_sworn_city_municipality: formData.subscribe_sworn_city_municipality,
    community_tax_certificate: formData.community_tax_certificate,
    issued_at: formData.issued_at,
    issued_on: formData.issued_on,
    action_taken_date: formData.action_taken_date,
    municipal_civil_registrar: formData.municipal_civil_registrar,
    o_r_number: formData.o_r_number,
    amount_paid: formData.amount_paid,
    date_paid: formData.date_paid,

    // Change of First Name. Nullable Data
    first_name_from: formData.first_name_from,
    first_name_to: formData.first_name_to,
    ground_a: formData.ground_a,
    ground_b: formData.ground_b,
    ground_c: formData.ground_c,
    ground_d: formData.ground_d,
    ground_e: formData.ground_e,
    ground_f: formData.ground_f,
    ground_b_data: formData.ground_b_data,
    ground_f_data: formData.ground_f_data,
  }

  const submit_ = petitions.addPetition(petition_)
};

const bgTexture = ref(
  "background-image: url(data:image/png;base64,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)"
);

</script>
