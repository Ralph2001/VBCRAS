<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="APPLICATION FOR MARRIAGE LICENSE">
            <Button label="Create" isActive :class="`rounded`" @click="open_model" />
        </Header>

        <div class="h-[calc(100vh-250px)] relative">

            Soon :)
        </div>

        <Modal large footerBG="bg-white border-t border-gray-300" v-if="modal" :footer="false">
            <template v-slot:header>
                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_modal">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return
                </button>
            </template>

            <div class="flex h-full justify-center items-center w-full pt-10 overflow-y-scroll">
                <div class="fixed flex flex-row right-0 left-0 bg-yellow-100 top-9 px-4 z-50">
                    <div class="flex flex-row items-center">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2" @click="change_page(1)"
                            :class="[page === 1 ? '' : 'text-gray-500']">Marriage
                            License</button>
                        <div class="block border border-gray-400 h-6"></div>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 " @click="change_page(2)"
                            :class="[page === 2 ? '' : 'text-gray-500']">Notice</button>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2">Save</button>
                        <!-- <button class="hover:bg-blue-300 font-medium text-sm p-2">Preview</button> -->
                    </div>
                </div>

                <div class="h-[calc(100vh-76px)] w-full flex p-10 overflow-y-scroll  justify-center">



                    <div class="flex shadow-md flex-col " :style="paperStyle">
                        <img :src="MarriageLicenseImage" class="w-full h-full" />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';
import { format } from 'date-fns';
import Camera from '../../components/Camera.vue';
import MarriageLicenseImage from '../../assets/Marriage.jpg'



const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 14 : 10
})
const change_page = (value) => {
    page.value = value
}

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
    height: paper_size.value * ppi.value, // 14 inches in pixels
}));

const paperStyle = computed(() => ({
    height: `${paperDimensions.value.height}px`,
    width: `${paperDimensions.value.width}px`,
}));

onMounted(() => {
    calculatePPI();
});

const modal = ref(false);

const open_model = () => {
    modal.value = true;

    const date = new Date()

    formData.groom_ss_day = format(date, 'do').toUpperCase()
    formData.groom_ss_month = format(date, 'MMMM').toUpperCase()
    formData.groom_ss_year = format(date, 'yyyy')
    formData.groom_ss_at = 'BAYAMBANG, PANGASINAN'

    formData.bride_ss_day = format(date, 'do').toUpperCase()
    formData.bride_ss_month = format(date, 'MMMM').toUpperCase()
    formData.bride_ss_year = format(date, 'yyyy')
    formData.bride_ss_at = 'BAYAMBANG, PANGASINAN'
};

const close_modal = () => {
    modal.value = false;
};




const initialForm = {
    header_province: '',
    header_municipality: '',
    registry_number: '',
    recieved_by: '',
    date_of_receipt: '',
    marriage_license_number: '',
    date_issuance_marriage_license: '',

    groom_contract_marriage_with: '',
    bride_contract_marriage_with: '',

    municipal_civil_registrar: '',

    marriage_notice_date: '',
    marriage_notice_copy_furnished: 'FILE',

    // GROOM SIDE
    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',
    groom_date_of_birth: '',
    groom_age: '',
    groom_municipality: '',
    groom_province: '',
    groom_country: '',
    groom_sex: '',
    groom_residence: '',
    groom_religion: '',
    groom_civil_status: '',
    groom_previously_married_dissolved: '',
    groom_place_dissolved: '',
    groom_date_dissolved: '',
    groom_degree_relation: '',
    groom_father_first_name: '',
    groom_father_middle_name: '',
    groom_father_last_name: '',
    groom_father_citizenship: '',
    groom_father_residense: '',
    groom_mother_first_name: '',
    groom_mother_middle_name: '',
    groom_mother_last_name: '',
    groom_mother_citizenship: '',
    groom_mother_residence: '',
    groom_person_who_give_consent: '',
    groom_relation: '',
    groom_citizenship: '',
    groom_residence_consent: '',

    groom_signature: '',
    groom_ss_day: '',
    groom_ss_month: '',
    groom_ss_year: '',
    groom_ss_at: '',
    groom_community_tax_certificate: '',
    groom_community_tax_certificate_on: '',
    groom_community_tax_certificate_at: '',


    groom_notice_name: '',
    groom_notice_age: '',
    groom_notice_birthplace: '',
    groom_notice_residence: '',
    groom_notice_father: '',
    groom_notice_mother: '',

    // BRIDE SIDE
    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',
    bride_date_of_birth: '',
    bride_age: '',
    bride_municipality: '',
    bride_province: '',
    bride_country: '',
    bride_sex: '',
    bride_residence: '',
    bride_religion: '',
    bride_civil_status: '',
    bride_previously_married_dissolved: '',
    bride_place_dissolved: '',
    bride_date_dissolved: '',
    bride_degree_relation: '',
    bride_father_first_name: '',
    bride_father_middle_name: '',
    bride_father_last_name: '',
    bride_father_citizenship: '',
    bride_father_residense: '',
    bride_mother_first_name: '',
    bride_mother_middle_name: '',
    bride_mother_last_name: '',
    bride_mother_citizenship: '',
    bride_mother_residence: '',
    bride_person_who_give_consent: '',
    bride_relation: '',
    bride_citizenship: '',
    bride_residence_consent: '',

    bride_signature: '',
    bride_ss_day: '',
    bride_ss_month: '',
    bride_ss_year: '',
    bride_ss_at: '',
    bride_community_tax_certificate: '',
    bride_community_tax_certificate_on: '',
    bride_community_tax_certificate_at: '',



    bride_notice_name: '',
    bride_notice_age: '',
    bride_notice_birthplace: '',
    bride_notice_residence: '',
    bride_notice_father: '',
    bride_notice_mother: '',

}

const formData = reactive({ ...initialForm })


// Centralized method to update all notice values
const updateNotices = () => {
    // GROOM NOTICE

    formData.groom_father_last_name = formData.groom_last_name ? formData.groom_last_name : ''
    formData.groom_mother_last_name = formData.groom_middle_name ? formData.groom_middle_name : ''


    formData.groom_contract_marriage_with = formData.bride_first_name || formData.bride_last_name ? formData.bride_first_name + ' ' + formData.bride_middle_name + ' ' + formData.bride_last_name : '';
    formData.bride_contract_marriage_with = formData.groom_first_name || formData.groom_last_name ? formData.groom_first_name + ' ' + formData.groom_middle_name + ' ' + formData.groom_last_name : '';

    const groomInitialMiddleName = formData.groom_middle_name ? formData.groom_middle_name.charAt(0) : '';
    const groomFatherInitialMiddleName = formData.groom_father_middle_name ? formData.groom_father_middle_name.charAt(0) : '';
    const groomMotherInitialMiddleName = formData.groom_mother_middle_name ? formData.groom_mother_middle_name.charAt(0) : '';
    const groomBirthPlace = formData.groom_municipality && formData.groom_province ? formData.groom_municipality + ', ' + formData.groom_province : ''

    formData.groom_notice_name = `${formData.groom_first_name} ${groomInitialMiddleName}. ${formData.groom_last_name}`;
    formData.groom_notice_age = formData.groom_age ? `${formData.groom_age} yrs. old` : '';

    formData.groom_notice_father = formData.groom_father_first_name
        ? `${formData.groom_father_first_name} ${groomFatherInitialMiddleName}. ${formData.groom_father_last_name}`
        : '';

    formData.groom_notice_mother = formData.groom_mother_first_name
        ? `${formData.groom_mother_first_name} ${groomMotherInitialMiddleName}. ${formData.groom_mother_last_name}`
        : '';
    formData.groom_notice_birthplace = formData.groom_municipality
        ? capitalizeWords(groomBirthPlace)
        : '';
    formData.groom_notice_residence = formData.groom_residence
        ? capitalizeWords(formData.groom_residence).replace(', PHILIPPINES', '')
        : '';


    // BRIDE NOTICE

    formData.bride_father_last_name = formData.bride_last_name ? formData.bride_last_name : ''
    formData.bride_mother_last_name = formData.bride_middle_name ? formData.bride_middle_name : ''



    const brideInitialMiddleName = formData.bride_middle_name ? formData.bride_middle_name.charAt(0) : '';
    const brideFatherInitialMiddleName = formData.bride_father_middle_name ? formData.bride_father_middle_name.charAt(0) : '';
    const brideMotherInitialMiddleName = formData.bride_mother_middle_name ? formData.bride_mother_middle_name.charAt(0) : '';
    const brideBirthPlace = formData.bride_municipality && formData.bride_province ? formData.bride_municipality + ', ' + formData.bride_province : ''

    formData.bride_notice_name = `${formData.bride_first_name} ${brideInitialMiddleName}. ${formData.bride_last_name}`;
    formData.bride_notice_age = formData.bride_age ? `${formData.bride_age} yrs. old` : '';



    formData.bride_notice_father = formData.bride_father_first_name
        ? `${formData.bride_father_first_name} ${brideFatherInitialMiddleName}. ${formData.bride_father_last_name}`
        : '';


    formData.bride_notice_mother = formData.bride_mother_first_name
        ? `${formData.bride_mother_first_name} ${brideMotherInitialMiddleName}. ${formData.bride_mother_last_name}`
        : '';
    formData.bride_notice_birthplace = formData.bride_municipality
        ? capitalizeWords(brideBirthPlace)
        : '';
    formData.bride_notice_residence = formData.bride_residence
        ? capitalizeWords(formData.bride_residence).replace(', PHILIPPINES', '')
        : '';
};

const capitalizeWords = (sentence) => {
    return sentence
        .split(' ')
        .map(word => {
            if (!word) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};


const handleInputChange = () => {
    updateNotices();
};

const groom_picture = ref(null)
const handle_groom_image = (capturedImage) => {
    groom_picture.value = capturedImage
}
const bride_picture = ref(null)
const handle_bride_image = (capturedImage) => {
    bride_picture.value = capturedImage
}



// And similarly for bride's input fields...
</script>

