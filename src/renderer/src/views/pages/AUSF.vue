<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="Affidavit to use the Surname of the Father">
            <Button label="Create" isActive :class="`rounded`" @click="open_ausf" />
        </Header>

        <div class="h-[calc(100vh-250px)]">
            <TableGrid :data="aufs_.ausf" :dataColumns="colDefs" :suppressRowTransform="true" />
        </div>

        <Modal v-if="ausf_modal" large label=" Affidavit to use the Surname of the Father" footerBG="bg-white">
            <template v-slot:header>
                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_ausf"> <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return</button>

                <!-- <ModalCloseButton  /> -->
            </template>

            <div
                class="flex flex-col  sm:px-2 md:lg:px-40 h-max bg-gray-100 py-2 gap-4 w-full items-center justify-center relative font-medium overflow-y-scroll ">
                <div :style="paperStyle"
                    class=" flex flex-col py-16 ease-in-out transition-transform duration-200 bg-white border rounded shadow-lg ">
                    <div
                        class="fixed flex flex-row items-center p-3 shadow-sm z-50 bg-white gap-2 top-[2.6rem] left-0 border-b border-e">
                        <input type="checkbox" id="assertation" class="border rounded border-gray-400"
                            v-model="formData.isWithAttestation" />
                        <label for="assertation" class="text-xs">Sworn Attestation</label>
                    </div>
                    <!-- <iframe v-if="previewUrl" class="h-full w-full " :src="previewUrl" frameborder="1"
                allowfullscreen=""></iframe> -->
                    <div class="h-full" v-if="previewUrl">
                        <PDFViewer :pdf="previewUrl" @cancel-btn="previewUrl = ''" @save-print="submit"
                            :status="document_status" @exit-btn="close_ausf()" />
                    </div>
                    <div class="flex flex-col h-full w-full  relative" v-if="!previewUrl">

                        <div class="grid grid-cols-2 w-full">
                            <div class="flex p-4"></div>
                            <div class="flex flex-col gap-1">
                                <p class="underline text-sm font-neutral font-serif">LEGAL INSTRUMENT</p>
                                <div class="flex flex-row gap-2">
                                    <label for="">Registry Number: </label>
                                    <InputButtomBorder v-model="formData.registry_number" :width="`14rem`" skip />
                                </div>
                                <div class="flex flex-row gap-2">
                                    <label for="">Date of Registration:</label>
                                    <InputButtomBorder v-model="formData.date_registration" :width="`14rem`" skip />
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex justify-center">
                            <p class="text-center border-b-2 border-gray-400 border-dashed h-fit font-medium w-fit">
                                AFFIDAVIT TO USE THE SURNAME OF THE FATHER
                            </p>
                        </div>

                        <div class="flex flex-col w-full h-full px-16 mt-5">
                            <div>
                                <div class="flex flex-row gap-2">
                                    <p class="indent-8">I,</p>
                                    <InputButtomBorder :error="v$.affiant_name.$error" v-model="formData.affiant_name"
                                        label="Affiant's name" isBold />,
                                    <InputButtomBorder :error="v$.citizenship.$error" v-model="formData.citizenship"
                                        label="Citizenship" :width="`5%`" skip />,
                                    <div class="flex flex-row">
                                        <InputButtomBorder v-model="age" :error="v$.age.$error" type="number"
                                            @change="change_age_full" label="Age" text-position="text-end"
                                            :width="`5rem`" />
                                        <InputButtomBorder :width="`6rem`" :error="v$.age.$error"
                                            @change="change_age_full" skip v-model="age_text" />
                                    </div>
                                </div>
                                <div class="flex flex-row w-full">
                                    <p class="text-nowrap">and a resident of</p>
                                    <AutoCompleteInputBottomBorder :error="v$.address.$error" v-model="formData.address"
                                        :suggestion_data="_all" label="Complete Address" :wait="true" />

                                    <p class="text-nowrap">after having been duly</p>
                                </div>
                                <p>sworn in accordance with law, do hereby declare that:</p>
                            </div>
                            <div class="flex flex-col gap-2 tracking-wide text-gray-800">
                                <div class="flex flex-col gap-2">
                                    <div class="flex flex-row">
                                        1. I am seeking the use of the surname
                                        <InputButtomBorder :error="v$.surname.$error" v-model="formData.surname"
                                            :width="'20rem'" isBold />
                                        in:
                                    </div>
                                    <div class="flex flex-row items-center gap-2">
                                        <input type="radio" value="my" name="in_my_the" checked id="my"
                                            v-model="formData.in_my_the" class="border-gray-200 rounded" />
                                        <label for="my">My Certificate of Live Birth/Report of Birth, pursuant to R.A.
                                            No.
                                            9255.</label>
                                    </div>
                                    <div class="flex flex-row items-center gap-2">
                                        <input type="radio" value="the" name="in_my_the" id="the"
                                            v-model="formData.in_my_the" class="border-gray-200 rounded" />
                                        <label for="the" class="text-nowrap">The Certificate of Live Birth/Report of
                                            Birth
                                            of</label>
                                        <InputButtomBorder :error="v$.child_name.$error"
                                            :disabled="isChildNameAndRelationDisabled" v-model="formData.child_name"
                                            isBold />
                                    </div>
                                    <div class="flex flex-row items-center">
                                        <p class="text-nowrap">who is my</p>
                                        <InputButtomBorder :error="v$.relation.$error"
                                            :disabled="isChildNameAndRelationDisabled" :width="'13rem'"
                                            v-model="formData.relation" />
                                        <p class="text-nowrap">pursuant to R.A. No. 9255.</p>
                                    </div>
                                </div>
                                <div class="flex flex-col w-full">
                                    <div class="flex flex-row text-nowrap gap-1">
                                        2. I/He/She was born on
                                        <InputButtomBorder :error="v$.date_birth.$error" v-model="formData.date_birth"
                                            :width="'30rem'" />
                                        at
                                        <InputButtomBorder :error="v$.at_municipality.$error"
                                            v-model="formData.at_municipality" :width="'6.2rem'" skip />,
                                        <InputButtomBorder :error="v$.at_province.$error" v-model="formData.at_province"
                                            :width="'6.1rem'" skip />,
                                        <InputButtomBorder :error="v$.at_country.$error" v-model="formData.at_country"
                                            :width="'6.2rem'" skip />.
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex flex-row text-nowrap gap-1">
                                        3. The birth was recorded under Registry No.
                                        <InputButtomBorder :width="'6.2rem'" v-model="formData.registry_number" skip />
                                        on
                                        <InputButtomBorder :width="'6.2rem'" v-model="formData.date_registration"
                                            skip />.
                                    </div>
                                </div>
                                <div class="flex flex-col w-full">
                                    <p class="text-nowrap">
                                        4. The Affidavit of Admission of Paternity or the Private Handwritten
                                        Instrument was recorded under
                                    </p>
                                    <div class="flex flex-row">
                                        <p class="text-nowrap">Registry No.</p>
                                        <InputButtomBorder :modelValue="`N/A`" skip />
                                        <p class="text-nowrap">on</p>
                                        <InputButtomBorder :modelValue="`N/A`" skip />
                                        <p class="text-nowrap">at the</p>
                                        <p class="text-nowrap">Local Civil Registry Office</p>
                                    </div>
                                    <div class="flex flex-row">
                                        <p class="text-nowrap">
                                            (LCRO)/Philippine Foreign Service Post (PFSP) of
                                        </p>
                                        <InputButtomBorder :modelValue="`N/A`" skip />
                                        <p class="text-nowrap">(if applicable).</p>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex flex-row text-nowrap">
                                        <p class="tracking-widest">
                                            5. I am filing this AUSF at the Local Civil Registrar’s Office of
                                        </p>
                                        <InputButtomBorder :error="v$.lcro_at.$error" v-model="formData.lcro_at" skip />
                                        <p>in</p>
                                    </div>
                                    <div>
                                        <p>
                                            accordance with R.A. No. 9255 and its Revised Implementing Rules and
                                            Regulations.
                                        </p>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex flex-row text-justify">
                                        6. I hereby certify that the statements made herein are true and
                                        correct to the best of my knowledge and belief.
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex flex-row text-justify">
                                        <p class="text-nowrap">
                                            7. In witness whereof, I have hereby affix my signature on this
                                        </p>
                                        <InputButtomBorder :error="v$.day_signature.$error"
                                            v-model="formData.day_signature" skip :width="'6.2rem'" />
                                        <p class="text-nowrap">day of</p>
                                        <InputButtomBorder :error="v$.month_signature.$error"
                                            v-model="formData.month_signature" skip :width="'6.2rem'" />.
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 flex flex-col w-[50%] self-end items-center">
                                <InputButtomBorder :error="v$.affiant_name.$error"
                                    v-model.capitalize="formData.affiant_name" skip isBold />
                                <p class="text-gray-700 text-md">
                                    Signature over printed name of Affiant
                                </p>
                            </div>

                            <div class="mt-10 px-10">
                                <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                                    <p class="indent-12 text-gray-700 text-md">
                                        SUBSCRIBED AND SWORN to before me this
                                    </p>
                                    <InputButtomBorder :error="v$.sworn_day.$error" v-model="formData.sworn_day" skip
                                        :width="'13rem'" />
                                    <p class="text-gray-700 text-md">day of</p>
                                    <InputButtomBorder :error="v$.sworn_month.$error" v-model="formData.sworn_month"
                                        skip />
                                    <p class="text-gray-700 text-md">in</p>
                                    <p class="text-gray-700 text-md">the</p>
                                </div>
                                <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                                    <p class="text-gray-700 text-md">city/municipality of</p>
                                    <InputButtomBorder :error="v$.sworn_at.$error" v-model="formData.sworn_at" skip />
                                    <p class="text-gray-700 text-md">, affiant exhibiting his/her</p>
                                </div>
                                <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                                    <InputButtomBorder v-model="formData.exhibiting" skip />
                                    <InputButtomBorder v-model="formData.exhibiting_number" :width="'50%'" />
                                    <p class="text-gray-700 text-md">issued at</p>

                                    <AutoCompleteInputBottomBorder v-model="formData.exhibiting_at" :wait="true"
                                        :suggestion_data="municipality_with_province" />

                                </div>
                                <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                                    <InputButtomBorder v-model="formData.exhibiting_on" />
                                    <p class="text-gray-700 text-md text-justify">
                                        . I certify that I personally examined the affiant and that he
                                        voluntarily executed
                                    </p>
                                </div>
                                <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                                    <p class="text-gray-700 text-md">
                                        the foregoing affidavit and understood the contents thereof.
                                    </p>
                                </div>
                            </div>

                            <!-- ///////////////////////// -->
                            <!-- ///////////////////////// -->
                            <!-- Sworn Attestation -->
                            <!-- ///////////////////////// -->
                            <!-- ///////////////////////// -->
                            <div class="flex flex-col gap-1 py-10  text-gray-800 font-semibold w-full "
                                v-if="formData.isWithAttestation">
                                <div class="w-full border-dashed border-gray-600 mb-10 border-2"></div>
                                <p class="text-gray-800 text-center font-bold tracking-widest">
                                    SWORN ATTESTATION
                                </p>

                                <div class="flex flex-row mt-5 gap-1 w-full">
                                    <p class="indent-12">I,</p>
                                    <InputButtomBorder v-model="formData.attestation_name"
                                        :error="v$.attestation_name.$error" />
                                    <p class="text-nowrap">
                                        Filipino citizen, of legal age, with address at
                                    </p>
                                </div>
                                <div class="flex flex-row gap-1">
                                    <InputButtomBorder v-model="formData.attestation_address"
                                        :error="v$.attestation_address.$error" />
                                    <p class="text-nowrap">after being sworn in accordance with law, do</p>
                                </div>
                                <div>
                                    <p class="text-nowrap w-full">
                                        hereby depose and state that I am the mother of the affiant in the
                                        Affidavit to Use the Surname of the
                                    </p>
                                </div>
                                <div class="flex flex-row gap-1">
                                    <p class="text-nowrap">Father (AUSF); that my</p>
                                    <InputButtomBorder :error="v$.attestation_relation.$error"
                                        v-model="formData.attestation_relation" :width="'6.2rem'" />
                                    <p class="text-nowrap">
                                        is fully aware of the consequences of the use of the surname of
                                    </p>
                                </div>
                                <div class="flex flex-row">
                                    <p class="text-nowrap">his father</p>
                                </div>

                                <div class="mt-2 flex flex-col">
                                    <div class="flex flex-row gap-1">
                                        <p class="text-nowrap indent-12">
                                            In witness whereof, I hereby affixed my signature on this
                                        </p>
                                        <p class="text-nowrap">
                                            <InputButtomBorder skip :error="v$.attestation_signature_day.$error"
                                                v-model="formData.attestation_signature_day" :width="'6.2rem'" />
                                        </p>
                                        <p class="text-nowrap">day of</p>
                                        <p class="text-nowrap">
                                            <InputButtomBorder skip :error="v$.attestation_signature_month.$error"
                                                v-model="formData.attestation_signature_month" :width="'6.2rem'" />
                                        </p>
                                        <p>at</p>
                                    </div>
                                    <div>
                                        <p>Bayambang, Pangasinan, Philippines.</p>
                                    </div>
                                </div>

                                <div class="mt-10 flex flex-col w-[50%] self-end items-center">
                                    <InputButtomBorder skip v-model="formData.attestation_signature"
                                        :error="v$.attestation_signature.$error" />
                                    <p class="text-gray-700 text-md">
                                        Signature over printed name of Affiant
                                    </p>
                                </div>
                                <div class="flex flex-col mt-10 gap-1">
                                    <div class="flex flex-row gap-1">
                                        <p class="text-nowrap indent-12">
                                            SUBSCRIBED AND SWORN to before me this
                                        </p>
                                        <InputButtomBorder skip v-model="formData.attestation_ss_day"
                                            :error="v$.attestation_ss_day.$error" />
                                        <p class="text-nowrap">day of</p>
                                        <InputButtomBorder skip v-model="formData.attestation_ss_month_year"
                                            :error="v$.attestation_ss_month_year.$error" />
                                        <p class="text-nowrap">in the</p>
                                    </div>
                                    <div class="flex flex-row gap-1">
                                        <p class="text-nowrap">
                                            city/municipality of Bayambang, Pangasinan affiant exhibiting her
                                        </p>
                                        <InputButtomBorder v-model="formData.attestation_exhibiting_her"
                                            :error="v$.attestation_exhibiting_her.$error" />
                                    </div>
                                    <div class="flex flex-row gap-1">
                                        <InputButtomBorder v-model="formData.attestation_exhibiting_number"
                                            :error="v$.attestation_exhibiting_number.$error" />
                                        <p class="text-nowrap">issued at</p>


                                        <InputButtomBorder v-model="formData.attestation_issued_at"
                                            :error="v$.attestation_issued_at.$error" />.

                                        <InputButtomBorder v-model="formData.attestation_issued_on"
                                            :error="v$.attestation_issued_on.$error" />.
                                    </div>
                                    <div class="mt-10">
                                        <p class="text-wrap indent-12">
                                            I certify that I personally examined the affiant and that she
                                            voluntarily executed the foregoing affidavit and understood the
                                            contents thereof.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template v-slot:footer>
                <div class="flex flex-row px-4">
                    <div class="items-center text-nowrap">
                        <p class="text-gray-800 font-normal text-xs" v-if="previewUrl">
                            This is a preview of the output
                        </p>
                    </div>
                    <div class="h-full flex items-center justify-end gap-2 w-full">
                        <!-- <button v-if="previewUrl" @click="previewUrl = ''">Edit</button> -->
                        <!-- <button type="button" v-if="!previewUrl"
                            class="bg-white px-2.5 py-1 ml-auto border text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300 hover:bg-blue-500 hover:text-white"
                            @click="check()">
                            Check
                        </button> -->
                        <button type="button"
                            class="bg-white ml-auto px-2.5 py-1  text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300 hover:bg-blue-500 hover:text-white"
                            @click="check()"><font-awesome-icon icon="fa-solid fa-right-to-bracket" />
                            Check</button>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import Modal from "../../components/client/modal/Modal.vue";
import Header from "../../components/essentials/header.vue";
import Button from "../../components/essentials/buttons/Button.vue";
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import InputforForm from "../../components/Form/InputforForm.vue";
import InputButtomBorder from "../../components/essentials/inputs/InputBottomBorder.vue";
import { format } from "date-fns";
import { useAusf } from "../../stores/Ausf";
import TableGrid from "../../components/TableGrid.vue";
import TableAction from "../../components/essentials/action/TableAction.vue";
import { AuthStore } from "../../stores/Authentication";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";
import PDFViewer from "../../components/PDFViewer.vue";
import AutoCompleteInputBottomBorder from "../../components/essentials/inputs/AutoCompleteInputBottomBorder.vue";
import { all_address, complete_municipality_with_province } from "../../utils/Address";


const municipality_with_province = computed(() => {
    return complete_municipality_with_province(formData.at_province)
})

const _all = ref(all_address())

const aufs_ = useAusf();
const auth = AuthStore();

onMounted(() => {
    aufs_.getAUSF();
    auth.isAuthenticated();
    calculatePPI();
});

const ppi = ref(0);

const calculatePPI = () => {
    const screenWidthPx = window.screen.width;
    const screenHeightPx = window.screen.height;

    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const dpi = isPortrait ? 96 : 113;

    const widthInches = screenWidthPx / dpi;
    const heightInches = screenHeightPx / dpi;

    const ppiValue = Math.sqrt((screenWidthPx ** 2) + (screenHeightPx ** 2)) / Math.sqrt((widthInches ** 2) + (heightInches ** 2));
    ppi.value = Math.round(ppiValue);
};

const paperDimensions = computed(() => ({
    width: 8.5 * ppi.value, // 8.5 inches in pixels
    height: 13 * ppi.value, // 14 inches in pixels
}));

const paperStyle = computed(() => ({
    height: `${paperDimensions.value.height}px`,
    width: `${paperDimensions.value.width}px`,
}));




const previewUrl = ref(); //PDF Base64
const printValue = ref();
const ausf_modal = ref(false);

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();

const age = ref();
const age_text = ref("yrs. old");

const colDefs = ref([
    {
        field: "affiant_name",
        headerName: "Affiant's Name",
        flex: 2,
        filter: true,
        pinned: "left",
        lockPinned: true,
    },
    {
        field: "surname",
        headerName: "Surname",
        flex: 2,
        cellClass: "font-medium tracking-wider w-full text-gray-800",
        filter: true,
    },
    {
        field: "child_name",
        headerName: "Child's Name",
        flex: 2,
        filter: true,
    },
    {
        field: "relation",
        headerName: "Relation",
        flex: 2,
        filter: true,
    },
    {
        field: "date_birth",
        headerName: "Date of Birth",
        flex: 2,
        filter: true,
    },
    {
        field: "sworn_month",
        headerName: "Date Filed",
        flex: 2,
        filter: true,
    },
    {
        field: "created_by_user.username",
        headerName: "Created by",
        flex: 2,
        filter: true,
    },
    {
        headerName: "",
        flex: 1,
        pinned: "right",
        lockPinned: true,
        resizable: false,
        cellRenderer: TableAction,
        cellStyle: { overflow: "visible", border: "none" },
        sortable: false,
    },
]);

const initalForm = {
    created_by: auth.user_id,
    registry_number: `${year} - `,
    date_registration: `${format(date, "MMMM")}      , ${year}`,
    affiant_name: "",
    citizenship: "Filipino",
    age: "",
    address: "",
    surname: "",
    in_my_the: "the",
    child_name: "",
    relation: "",
    date_birth: "",
    at_municipality: "Bayambang",
    at_province: "Pangasinan",
    at_country: "Philippines",
    lcro_at: "Bayambang, Pangasinan",
    day_signature: `${format(date, "do")}`,
    month_signature: `${format(date, "MMMM")} ${year}`,
    sworn_day: `${format(date, "do")}`,
    sworn_month: `${format(date, "MMMM")} ${year}`,
    sworn_at: "Bayambang, Pangasinan",
    exhibiting: "Community Tax Certificate No.",
    exhibiting_number: "",
    exhibiting_at: "Bayambang, Pangasinan",
    exhibiting_on: `${format(date, "MMMM dd, yyyy")}`,
    ap_phi_registry_number: "",
    ap_phi_date_registration: "",
    pfsp_of: "",
    isWithAttestation: false,
    attestation_name: "",
    attestation_address: "",
    attestation_relation: "",
    attestation_signature_day: "",
    attestation_signature_month: "",
    attestation_signature: "",
    attestation_ss_day: "",
    attestation_ss_month_year: "",
    attestation_exhibiting_her: "",
    attestation_exhibiting_number: "",
    attestation_issued_at: "",
    attestation_issued_on: "",
};
const formData = reactive({ ...initalForm });

const rules = computed(() => ({
    created_by: { required },
    date_registration: { required },
    affiant_name: { required },
    citizenship: { required },
    age: { required },
    address: { required },
    surname: { required },
    in_my_the: { required },
    child_name: { required: requiredIf(formData.in_my_the === "the") },
    relation: { required: requiredIf(formData.in_my_the === "the") },
    date_birth: { required },
    at_municipality: { required },
    at_province: { required },
    at_country: { required },
    lcro_at: { required },
    day_signature: { required },
    month_signature: { required },
    sworn_day: { required },
    sworn_month: { required },
    sworn_at: { required },
    day_signature: { required },
    month_signature: { required },

    attestation_name: { required: requiredIf(formData.isWithAttestation ? true : false) },
    attestation_address: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_relation: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_signature_day: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_signature_month: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_signature: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_ss_day: { required: requiredIf(formData.isWithAttestation ? true : false) },
    attestation_ss_month_year: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_exhibiting_her: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_exhibiting_number: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_issued_at: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
    attestation_issued_on: {
        required: requiredIf(formData.isWithAttestation ? true : false),
    },
}));

const v$ = useVuelidate(rules, formData);
const isChildNameAndRelationDisabled = ref(false);

watch(
    () => formData.in_my_the,
    (data) => {
        if (data === "my") {
            formData.child_name = "";
            formData.relation = "";
            isChildNameAndRelationDisabled.value = true;
        } else {
            formData.child_name = "";
            formData.relation = "";
            isChildNameAndRelationDisabled.value = false;
        }
    }
);
watch(
    () => formData.isWithAttestation,
    (data) => {
        if (data) {
            // Set Attestation Value
            formData.attestation_signature_day = `${format(date, "do")}`;
            formData.attestation_signature_month = `${format(date, "MMMM")} ${year}`;
            formData.attestation_ss_day = `${format(date, "do")}`;
            formData.attestation_ss_month_year = `${format(date, "MMMM")} ${year}`;
            formData.attestation_issued_at = "Bayambang, Pangasinan";
            formData.attestation_issued_on = `${format(date, "MMMM dd, yyyy")}`;
        } else {
            formData.attestation_signature_day = "";
            formData.attestation_signature_month = "";
            formData.attestation_ss_day = "";
            formData.attestation_ss_month_year = "";
            formData.attestation_issued_at = "";
            formData.attestation_issued_on = "";
        }
    }
);

function change_age_full() {
    formData.age = age.value + " " + age_text.value;
}

const open_ausf = () => {
    ausf_modal.value = true;
};
const document_status = ref(false);

const close_ausf = () => {
    ausf_modal.value = false;
    previewUrl.value = "";
    document_status.value = false;
    Object.assign(formData, initalForm);
    age.value = "";
    age_text.value = "yrs. old";
    v$.value.$reset();
};

const check = async () => {
    const isFormValid = await v$.value.$validate();
    console.log(v$.value);
    if (!isFormValid) {
        return;
    }
    const create = await window.AusfApi.createAUSF({ ...formData });

    previewUrl.value =
        "data:application/pdf;filename=generated.pdf;base64," + create.dataurl;
    printValue.value = create.dataurl;
};

const submit = async () => {
    const isFormValid = await v$.value.$validate();
    if (isFormValid && !document_status.value) {
        const add = aufs_.addAusf({ ...formData });
        if (add) {
            document_status.value = true;

            printPDF();
        }
        return;
    }
    printPDF();
};

const printPDF = async () => {
    // Add function that adds to logs
    const print = await window.LocalCivilApi.printPDFBase64(printValue.value);
};
</script>

<style lang="scss" scoped></style>
