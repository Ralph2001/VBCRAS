<template>
    <div class="flex flex-col relative justify-center w-full p-10 ">


        <Header label="LOCAL CIVIL REGISTRY FORMS">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <BtnDrop label="Create New Form" :options="options" @open-modal="OpenForms" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-gear" /></button>
                <IsPathAccessible :filePath="system_setting.defaults.file_path" :subFolder="'\\VBCRAS\\Forms\\'" />


            </div>
        </Header>


        <!-- <PrinterDialog v-if="print" :pdfBase64="pdfBase64Value" @close="print = false"
            :defaultPageSize="defaultPageSize" :maxPageRanges="maxPageRange" /> -->




        <!-- For Viewing -->
        <FormModal :title="`View Document - ${documentOwner}`" v-if="isViewLocalOpen"
            @exit-modal="handleCloseViewLocal">
            <template v-slot:control>
                <div class="flex flex-row items-center w-full gap-3 p-2 rounded-md shadow-sm">
                    <div class="ml-auto">
                        <PrintManager :active_pdf_link="localPdf" :active_pdf="''" :count="1" />
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <div class="w-full h-full">
                    <PDFViewerWorker :scale="1.5" :pdfBytes64="localPdf" @update:pdfBytes64="previewUrl = $event" />
                </div>
            </template>
        </FormModal>

        <!-- Main Content -->
        <div class="h-[calc(100vh-200px)] flex flex-col gap-4">
            <div class="flex flex-row items-center">
                <div class="relative w-60">
                    <!-- Header label -->
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                        Change Document DataTable
                    </label>

                    <!-- Dropdown -->
                    <div @click="openMenu"
                        class="flex items-center justify-between border border-gray-300 rounded-md p-2 bg-white shadow-sm hover:bg-gray-100 cursor-pointer transition-colors">
                        <p class="font-medium text-sm">{{ menu }}</p>
                        <font-awesome-icon icon="chevron-down" class="text-sm" />
                    </div>

                    <!-- Dropdown items -->
                    <div v-if="isMenuOpen" ref="MenuBox"
                        class="absolute top-full mt-1 w-full max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        <ul>
                            <li v-for="(category, index) in menuItems" :key="index"
                                class="px-3 py-2 border-b last:border-b-0">
                                <div class="text-xs text-gray-500 mb-1">{{ category.label }}</div>
                                <ul>
                                    <li v-for="(item, i) in category.items" :key="i" @click="changeMenu(item)" :class="[
                                        'flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors',
                                        menu === item ? 'bg-gray-200' : 'hover:bg-gray-100'
                                    ]">
                                        <font-awesome-icon icon="info-circle" class="text-xs text-gray-600" />
                                        <span class="text-sm">{{ item }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="ml-auto w-80">
                    <Input label="Search" v-model="search" />
                </div>
            </div>


            <div class="h-full">
                <TableGrid :data="filteredRowData" :dataColumns="colDefs" :suppressRowTransform="true" />
            </div>

        </div>


        <!-- Main Modal, Creating, Copying, Updating Document -->
        <FormModal :title="`Create New Form ${selectedType}`" v-if="isFormOpen" @exit-modal="closeModal()">
            <!-- Control -->
            <template v-slot:control>
                <div class="flex flex-row items-center w-full gap-3 p-2 rounded-md shadow-sm"
                    v-if="!isPreview && !isOnEdit && formID === null && !isUpdateHook">
                    <label class="font-semibold text-sm text-gray-700">Document:</label>

                    <div class="flex flex-row gap-2">
                        <button v-for="type in FormTypes" :key="type" @click="toggleForm(`${type}`)" :class="[
                            selectedType === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200',
                            'h-8 px-4 text-sm rounded-md shadow-sm font-medium transition duration-150 ease-in-out flex items-center justify-center'
                        ]">
                            Form {{ type }}
                        </button>
                    </div>

                    <div class="ml-auto text-sm text-gray-500 italic"></div>
                </div>

                <div v-if="isPreview && !isUpdateHook"
                    class="flex flex-row items-center gap-3 p-2 rounded-md shadow-sm w-full">
                    <button @click="isPreview = false"
                        class="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-edit" class="mr-2 text-base" />
                        Edit Form
                    </button>

                    <div class="ml-auto flex gap-2">
                        <button @click="setSettingsState(true)"
                            class="h-8 px-4 bg-white border border-gray-300 hover:bg-gray-300 text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-gear" class="mr-2 text-base" />
                            Configuration
                        </button>

                        <PrintManager :active_pdf_link="previewUrl" :active_pdf="''" :count="1" />


                        <button @click="saveForm"
                            class="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-save" class="mr-2 text-base" />
                            Save
                        </button>
                    </div>
                </div>
            </template>

            <!-- Content -->
            <template v-slot:content>
                <div v-if="!isPreview" class="flex flex-col w-full overflow-y-auto  h-full items-center">

                    <div class="w-full  grid grid-cols-1 max-w-screen-lg  py-1.5 bg-white ">

                        <div v-if="unsavedDataMessage"
                            class="fixed top-0 flex items-center justify-center bottom-0 left-0 right-0 backdrop-blur-sm z-50 backdrop-brightness-75">
                            <div class="w-[40rem]  bg-white rounded flex flex-col  p-4">
                                <p class="font-bold text-red-400  text-lg">Are you sure you want to close the form?</p>
                                <p class="text-justify text-pretty mt-4">It looks like you have unsaved changes in the
                                    form.
                                    If
                                    you
                                    close this
                                    window now, any data
                                    you've entered
                                    <span class="font-medium"> will be lost</span>. If you'd
                                    like to keep
                                    your information, please save before closing.
                                </p>

                                <div class="mt-6 ml-auto gap-2 flex">

                                    <button
                                        class="py-1 w-24 rounded border px-2 hover:bg-red-400 hover:text-white transition-colors">Exit</button>
                                    <button @click="unsavedDataMessage = false"
                                        class="py-1 w-24 rounded border px-2 hover:bg-gray-200">Cancel</button>
                                </div>
                            </div>
                        </div>


                        <!-- Page 1, Main Page -->
                        <div class="flex flex-col gap-1 px-4 py-4">
                            <div class="flex items-center justify-end">
                                <div class="w-[15rem]">
                                    <InputforForm middle width="full" v-model="transactions.date_filed" />
                                </div>

                            </div>
                            <p class="px-9 italic font-semibold font-serif text-sm">TO WHOM IT MAY CONCERN: </p>

                            <div class="flex flex-col gap-1 h-full " v-if="selectedType.includes('A')">

                                <div class="text-sm w-full  my-auto  mb-6 flex justify-center">
                                    <p
                                        class=" relative text-pretty  tracking-widest indent-8 leading-8 text-neutral-900">
                                        We
                                        certify that among others, the following facts of {{ fact_of }} appear in our
                                        Register

                                        of <br>{{
                                            register_of }} on page
                                        <InputforForm middle width="6rem" bold v-model="available.page_number" />
                                        of book number
                                        <InputforForm middle width="6rem" bold v-model="available.book_number" />
                                        .
                                    </p>
                                </div>
                                <!-- For Form 3A -->

                                <div v-if="selectedType === '3A'" class="flex flex-col mt-4 gap-2 w-full">
                                    <InputLabel label="Name" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_name" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_name" />
                                    </InputLabel>
                                    <InputLabel label="Age" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_age" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_age" />
                                    </InputLabel>

                                    <InputLabel label="Citizenship" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_citizenship" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_citizenship" />
                                    </InputLabel>

                                    <InputLabel label="Civil Status" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_civil_status" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_civil_status" />
                                    </InputLabel>
                                    <InputLabel label="Mother" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_mother" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_mother" />
                                    </InputLabel>

                                    <InputLabel label="Father" twoInput>
                                        :
                                        <InputforForm width="100%" v-model="Form3A.groom_father" />
                                        :
                                        <InputforForm width="100%" v-model="Form3A.bride_father" />
                                    </InputLabel>
                                </div>

                                <div class="flex flex-col  gap-2">
                                    <InputLabel label="Registry Number">
                                        :
                                        <InputforForm width="100%" v-model="available.registry_number" />
                                    </InputLabel>

                                    <InputLabel label="Date of Registration">
                                        :
                                        <InputforForm width="100%" v-model="available.date_registration" />
                                    </InputLabel>


                                </div>
                                <!-- Required for Available Form -->

                                <div v-if="selectedType === '3A'" class="flex flex-col  gap-2 mb-auto">
                                    <InputLabel label="Date of Marriage">
                                        :
                                        <InputforForm width="100%" v-model="Form3A.date_marriage" />

                                    </InputLabel>
                                    <InputLabel label="Place of Marriage">
                                        :
                                        <InputforForm width="100%" v-model="Form3A.place_marriage" />

                                    </InputLabel>

                                </div>

                                <!-- For Form 1A -->
                                <div v-if="selectedType === '1A'" class="flex flex-col mb-auto gap-2">
                                    <InputLabel label="Name of Child">
                                        :
                                        <InputforForm isUpperCase width="100%" bold v-model="Form1A.name_child" />
                                    </InputLabel>
                                    <InputLabel label="Sex">
                                        :
                                        <!-- <InputforForm width="100%" v-model="Form1A.sex" /> -->
                                        <InputforFormSuggestions width="100%" v-model="Form1A.sex"
                                            :options="['Male', 'Female']" />
                                        <!-- <InputforFormSuggestions width="100%" v-model="Form1A.sex" /> -->
                                    </InputLabel>
                                    <InputLabel label="Date of birth">
                                        :
                                        <InputforForm width="100%" v-model="Form1A.date_birth" isDate />
                                    </InputLabel>
                                    <InputLabel label="Place of birth">
                                        :

                                        <InputforFormSuggestions width="100%" v-model="Form1A.place_birth" isPlace />
                                    </InputLabel>
                                    <InputLabel label="Name of Mother">
                                        :
                                        <InputforForm width="100%" v-model="Form1A.name_mother" />
                                    </InputLabel>
                                    <InputLabel label="Citizenship of Mother">
                                        :
                                        <InputforFormSuggestions width="100%" v-model="Form1A.citizenship_mother"
                                            :options="citizenshipOptions" />

                                    </InputLabel>
                                    <InputLabel label="Name of Father">
                                        :
                                        <InputforForm width="100%" v-model="Form1A.name_father" />
                                    </InputLabel>
                                    <InputLabel label="Citizenship of Father">
                                        :

                                        <InputforFormSuggestions width="100%" v-model="Form1A.citizenship_father"
                                            :options="citizenshipOptions" />
                                    </InputLabel>
                                    <InputLabel label="Date of Marriage">
                                        :
                                        <InputforForm width="100%" v-model="Form1A.date_marriage_parents" />
                                    </InputLabel>
                                    <InputLabel label="Place of Marriage of parents">
                                        :
                                        <InputforFormSuggestions width="100%" v-model="Form1A.place_marriage_parents"
                                            isPlace />
                                        <!-- <InputforForm width="100%" v-model="Form1A.place_marriage_parents" /> -->
                                    </InputLabel>
                                </div>


                                <!-- For Form 2A -->
                                <div v-if="selectedType === '2A'" class="flex flex-col gap-2 mb-auto">
                                    <InputLabel label="Name of deceased">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.name_deceased" />
                                    </InputLabel>
                                    <InputLabel label="Sex">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.sex" />
                                    </InputLabel>
                                    <InputLabel label="Age">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.deceased_age" />
                                    </InputLabel>
                                    <InputLabel label="Civil Status">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.deceased_civil_status" />
                                    </InputLabel>
                                    <InputLabel label="Citizenship">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.deceased_citizenship" />
                                    </InputLabel>
                                    <InputLabel label="Date of Death">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.date_of_death" />
                                    </InputLabel>

                                    <InputLabel label="Place of Death">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.place_of_death" />
                                    </InputLabel>
                                    <InputLabel label="Cause of Death">
                                        :
                                        <InputforForm width="100%" v-model="Form2A.cause_of_death" />
                                    </InputLabel>
                                </div>



                            </div>

                            <!-- Forms with `B` -->
                            <div class="flex flex-col gap-2 mt-auto mb-auto" v-if="selectedType.includes('B')">

                                <div class="mt-10 px-10">
                                    <p class="indent-8 text-pretty leading-10 tracking-wider text-justify">We certify
                                        that
                                        this
                                        office
                                        has
                                        no
                                        record of {{ selectedType === '1B' ? 'birth' : selectedType === '2B' ? 'death' :
                                            'marriage' }} of
                                        <InputforForm isUpperCase width="20rem" bold middle
                                            v-model="intact_name_field" />

                                        <span v-if="selectedType === '3B'" class="w-full"> and
                                        </span>
                                        <InputforForm isUpperCase v-if="selectedType === '3B'" width="20rem" bold middle
                                            v-model="Form3B.married_with" />
                                        who
                                        is
                                        alleged
                                        to have {{ selectedType === '1B' ? 'been born' : selectedType === '2B' ? 'died'
                                            : 'been married' }} on
                                        <InputforForm width="10rem" bold middle v-model="intact_date_field" /> in this
                                        municipality,

                                        <!-- If Form 1B -->
                                        <span v-if="selectedType === '1B'"> of parents
                                            <InputforForm width="18rem" bold middle v-model="Form1B.father_name"
                                                v-if="selectedType === '1B'" /> and
                                            <InputforForm width="18rem" bold v-model="Form1B.mother_name"
                                                v-if="selectedType === '1B'" middle />.
                                        </span>

                                        Hence, we cannot issue,
                                        as
                                        requested, a true
                                        copy of his/her Certificate of {{ selectedType === '1B' ? 'Live Birth' :
                                            selectedType === '2B' ? 'Death' : 'Marriage' }} or transcription from the
                                        Register
                                        of
                                        {{ selectedType === '1B' ? 'Births' : selectedType === '2B' ? 'Deaths' :
                                            'Marriages' }}.
                                    </p>
                                </div>

                                <div class="mt-10 px-10 ">
                                    <p class="indent-8 text-pretty tracking-wider text-justify"> We also certify that
                                        the
                                        records of
                                        {{ records_of }} for the year
                                        <InputforForm width="6rem" bold middle v-model="intact_year_field" /> are
                                        still
                                        intact in the
                                        archives of
                                        this office.
                                    </p>
                                </div>

                            </div>



                            <!-- Forms with `C` -->
                            <div class="flex flex-col gap-2 mt-auto mb-auto" v-if="selectedType.includes('C')">

                                <p class="indent-8 text-pretty leading-10 tracking-wider text-justify"> We certify that
                                    the
                                    records
                                    of
                                    {{ records_of }}
                                    filed in the archives of this office include those, which were registered from
                                    <InputforForm width="6rem" middle v-model="destroyed.registered_from" /> to
                                    present.
                                    However, the records of {{ records_of }} during period
                                    <InputforForm middle width="6rem" v-model="destroyed.from_year" />
                                    to
                                    <InputforForm middle width="6rem" v-model="destroyed.to_year" />
                                    were totally destroyed by
                                    <InputforForm middle width="20rem" v-model="destroyed.destroyed_by" />
                                    Hence, we cannot issue as requested, a true transcription from the Register of
                                    {{ register_of }} or
                                    true
                                    copy of the Certification of {{ register_of }} of
                                    <InputforForm middle width="25rem"
                                        v-if="selectedType === '1C' || selectedType === '2C'"
                                        v-model="destroyed_name_field" />
                                    <span v-if="selectedType === '3C'">
                                        <InputforForm middle width="25rem" v-model="Form3C.groom_name" /> and
                                        <InputforForm middle width="25rem" v-model="Form3C.bride_name" />
                                    </span> who
                                    is alleged
                                    to have {{ alleged_to }} on
                                    <InputforForm middle width="10rem" v-model="destroyed_date_field" /> in
                                    this
                                    municipality <span v-if="selectedType === '1C'">of parents
                                        <InputforForm middle width="25rem" v-model="Form1C.father_name" /> and
                                        <InputforForm middle width="25rem" v-model="Form1C.mother_name" />
                                    </span>.
                                </p>

                            </div>
                        </div>

                        <!-- Page 2,  Other Side -->
                        <!-- This is Required for all Forms -->
                        <!-- DONT TOUCH THIS AREA -->



                        <div class="flex flex-col gap-2 px-4 py-4">
                            <div
                                class="flex items-center justify-center relative text-sm font-sans flex-row text-nowrap lg:text-wrap  py-6">
                                This certification is issued to <div class="px-2">
                                    <InputforForm width="30rem" middle bold
                                        v-model="transactions.certification_issued_to" />
                                </div> upon his/her request.
                            </div>



                            <div class="flex flex-col gap-2 " v-if="is_with_remarks">
                                <div class="flex flex-row gap-2 items-center">
                                    <input type="checkbox" v-model="available.is_reconstructed"
                                        class="border rounded-sm border-gray-400" id="is_reconstructed">
                                    <label class="text-md font-medium text-neutral-800 text-sm"
                                        for="is_reconstructed">Reconstructed
                                        Copy</label>
                                </div>

                                <div class="flex flex-row gap-2 items-center">
                                    <input type="checkbox" v-model="available.is_other_remarks"
                                        class="border rounded-sm border-gray-400" id="is_other_remarks">
                                    <label class="text-md font-medium text-neutral-800 text-sm"
                                        for="is_other_remarks">Other
                                        Remarks</label>
                                </div>
                                <!-- <p class="font-medium text-xs">Add Remarks</p> -->

                                <div class="flex flex-col py-2 w-full gap-2" v-show="available.is_other_remarks">
                                    <div class="w-full flex flex-col gap-1 bg-white">
                                        <QuillEditor @ready="handleEditorReady" theme="snow"
                                            :toolbar="['bold', 'italic']" v-model:content="available.remarks"
                                            contentType="delta" content="delta" />
                                        <!-- {{ available.remarks }} -->

                                    </div>
                                </div>

                                <!-- {{ available.remarks }} -->
                            </div>
                            <div class="mt-auto grid grid-cols-2  gap-4 mb-4 h-44 items-center  ">

                                <div class="flex flex-col ">
                                    <p class="italic mb-10">Verified by:</p>
                                    <div class="pl-0 flex flex-col items-center gap-[0.10rem]">
                                        <InputforForm skip width="100%" bold middle v-model="transactions.verified_by"
                                            isUpperCase />
                                        <InputforForm skip width="100%" middle italic unbordered isTransparent
                                            v-model="transactions.verifier_position" />
                                    </div>
                                </div>
                                <transition name="fade-scale">
                                    <div class="flex flex-col items-center gap-[0.10rem]">
                                        <p v-if="transactions.for_and_in_the_absence"
                                            class="italic font-medium text-sm">For
                                            and
                                            in
                                            the absence
                                            of:</p>
                                        <InputforForm skip middle width="100%" bold
                                            v-model="transactions.civil_registrar" isUpperCase />
                                        <InputforForm skip width="100%" middle italic unbordered isTransparent
                                            v-model="transactions.civil_registrar_position" />
                                        <div v-if="transactions.for_and_in_the_absence"
                                            class="mt-4 flex flex-col items-center gap-[0.10rem] ">
                                            <InputforForm skip width="20rem" bold middle
                                                v-model="transactions.absence_verified_by"
                                                @input="transactions.absence_verified_by = $event.target.value.toUpperCase()" />
                                            <InputforForm skip width="20rem" middle italic unbordered isTransparent
                                                v-model="transactions.absence_verifier_position" />
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <div class="flex flex-col gap-2  w-[60%]">
                                <InputLabel label="Amount Paid ">
                                    <InputforForm width="100%" v-model="transactions.amount_paid" skip />
                                </InputLabel>

                                <InputLabel label="O.R. Number">
                                    <InputforForm width="100%" v-model="transactions.or_number" />
                                </InputLabel>
                                <InputLabel label="Date Paid">
                                    <InputforForm width="100%" v-model="transactions.date_paid" />
                                </InputLabel>
                            </div>


                        </div>
                    </div>

                    <div class=" w-full flex mt-10  items-center justify-center bg-gray-100 ">

                        <div class="max-w-screen-lg flex flex-row gap-2 p-4 w-full   ">
                            <div class="flex flex-col gap-1">
                                <div class="flex flex-row gap-2 items-center">
                                    <input type="checkbox" v-model="transactions.is_with_authentication" name=""
                                        id="with_authentication" class="border rounded border-gray-400">
                                    <label for="with_authentication" class="text-md font-medium text-neutral-800">With
                                        Authentication</label>
                                </div>
                                <div class="flex flex-row gap-2 items-center">
                                    <input v-model="transactions.for_and_in_the_absence" type="checkbox"
                                        id="for_and_in_the_absence" class="border rounded border-gray-400">
                                    <label for="for_and_in_the_absence" class="text-md font-medium text-neutral-800">For
                                        and
                                        in
                                        the absence
                                        of</label>
                                </div>

                            </div>


                            <div class="ml-auto flex items-center justify-center gap-2">

                                <button v-if="!isUpdateHook"
                                    class="bg-blue-600 hover:bg-blue-700 text-white border focus:ring-2 focus:ring-blue-700 focus:bg-blue-700 focus:border-2 outline-none px-10 font-medium  py-2.5 rounded-md "
                                    @click="previewForm">Next</button>

                                <button v-if="isUpdateHook"
                                    class="bg-blue-600 hover:bg-blue-700 text-white border focus:ring-2 focus:ring-blue-700 focus:bg-blue-700 focus:border-2 outline-none px-10 font-medium  py-2.5 rounded-md "
                                    @click="handleUpdate">Update Information</button>


                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="h-full w-full bg-gray-50 flex">
                    <div class="flex-1 overflow-auto flex items-center justify-center">
                        <PDFViewerWorker :pdfBytes64="previewUrl" />
                    </div>

                    <div v-if="settings"
                        class="w-[30rem] bg-gray-100  shadow-md border border-gray-200 flex flex-col z-50">
                        <!-- Preferences Section -->
                        <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
                            <div v-for="(section, sectionKey) in preference" :key="sectionKey" class="p-4">
                                <h3 class="text-sm font-medium text-gray-700 mb-3 capitalize">
                                    {{ formatKey(sectionKey) }}
                                </h3>
                                <div class="grid grid-cols-2 gap-3">
                                    <div v-for="(value, key) in section" :key="key" class="flex flex-col gap-1">
                                        <label class="text-xs text-gray-500 capitalize">
                                            {{ formatKey(key) }}
                                        </label>
                                        <InputforForm type="number" step="0.01" class="w-full"
                                            v-model="preference[sectionKey][key]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Button -->
                        <div class="border-t border-gray-100 px-4 py-3">
                            <button @click="setSettingsState(false)"
                                class="w-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 rounded-md transition">
                                <font-awesome-icon icon="fa-solid fa-gear" class="mr-2" />
                                Close Configuration
                            </button>
                        </div>
                    </div>

                </div>
            </template>
        </FormModal>




    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref, toRaw, watch } from 'vue'
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue'
import Header from '../../components/essentials/header.vue'
import InputforForm from '../../components/Form/InputforForm.vue'
import InputLabel from '../../components/Form/InputLabel.vue'
import { format } from 'date-fns'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { citizenshipOptions } from '../../utils/nationality.js';

import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import { useForms } from '../../stores/forms.js'
import { QuillEditor } from '@vueup/vue-quill'
import { useAvailableForm, useForm1A, useForm1B, useForm1C, useForm2A, useForm2B, useForm2C, useForm3A, useForm3B, useForm3C, useRegisteredPeriod, useTransactionDetails } from '../../lib/FormProps.js'
import ManageBtn from '../../components/Form/ManageBtn.vue'
import InputforFormSuggestions from '../../components/Form/InputforFormSuggestions.vue'
import Input from '../../components/essentials/inputs/Input.vue'
import { onClickOutside } from '@vueuse/core'
import FormModal from '../../components/Form/FormModal.vue'
import { useToast } from '../../lib/useToast.js'
import { useActivityLog } from '../../stores/logs.js'
import IsPathAccessible from '../../components/IsPathAccessible.vue'
import { useSetup } from '../../stores/Setting/setup.js'
import PrinterDialog from '../../components/PrinterDialog.vue'
import PrintManager from '../../components/PrintManager.vue'

const TableGrid = defineAsyncComponent(() => import("../../components/TableGrid.vue")); // Data Grid
const search = ref(null)
const print = ref(false)
const pdfBase64Value = ref(null)

const system_setting = useSetup()

onMounted(() => {
    system_setting.getSystemSetting()
})
/**
 * For Logging
 */
const activityLog = useActivityLog()


// Toast Here
const toast = useToast()


// Helper

// Helper Settings
function formatKey(key) {
    return key.replace(/_/g, ' ')
}

const register_of = computed(() => {
    if (selectedType.value) {
        if (selectedType.value.includes('1')) return 'Births';
        if (selectedType.value.includes('2')) return 'Deaths';
        if (selectedType.value.includes('3')) return 'Marriages';
    }
})

const records_of = computed(() => {
    if (selectedType.value) {
        if (selectedType.value.includes('1')) return 'Births';
        if (selectedType.value.includes('2')) return 'Deaths';
        if (selectedType.value.includes('3')) return 'Marriages';
    }
})

const alleged_to = computed(() => {
    if (selectedType.value) {
        if (selectedType.value.includes('1')) return 'been born';
        if (selectedType.value.includes('2')) return 'died';
        if (selectedType.value.includes('3')) return 'been married';
    }
})


const formToRender = computed(() => {
    let render
    switch (menu.value) {
        case 'Birth Available':
            render = "form1a"
            break
        case 'Birth Intact':
            render = "form1b"
            break
        case 'Birth Destroyed':
            render = "form1c"
            break
        case 'Death Available':
            render = "form2a"
            break
        case 'Death Intact':
            render = "form2b"
            break
        case 'Death Destroyed':
            render = "form2c"
            break
        case 'Marriage Available':
            render = "form3a"
            break
        case 'Marriage Intact':
            render = "form3b"
            break
        case 'Marriage Destroyed':
            render = "form3c"
            break
        default:
            console.warn('Unknown form type:', menu.value)
            return null
    }

    return render
})



const filteredRowData = computed(() => {
    if (!search.value) return formsStore[formToRender.value]; // Use formToRender.value here
    return formsStore[formToRender.value].filter(row =>
        Object.values(row).some(value =>
            String(value).toLowerCase().includes(search.value.toLowerCase())
        )
    );
});


/**
 * @description 
 * Menu 
 */

const menu = ref("Birth Available")

const isMenuOpen = ref(false)
const MenuBox = ref(null)

onClickOutside(isMenuOpen, event => isMenuOpen.value = false)
const openMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const menuItems = ref([
    {
        label: 'Birth',
        items: ['Birth Available', 'Birth Intact', 'Birth Destroyed'],
    },
    {
        label: 'Death',
        items: ['Death Available', 'Death Intact', 'Death Destroyed'],
    },
    {
        label: 'Marriage',
        items: ['Marriage Available', 'Marriage Intact', 'Marriage Destroyed'],
    }
])

const changeMenu = (item) => {

    console.log(item)
    menu.value = item;
    isMenuOpen.value = false;
    Object.assign(preference, initialPref);
    fetchFormData(item);
};




let transactions = reactive({ ...useTransactionDetails });
let available = reactive({ ...useAvailableForm });
let destroyed = reactive({ ...useRegisteredPeriod })


/**
 * Settings State
 */

const settings = ref(false)
const setSettingsState = (state) => {
    if (typeof state !== "boolean") {
        console.error("Invalid state: must be a boolean");
        return;
    }
    settings.value = state;
};


/**
 * All Forms FormData
 * @satisfies
 */


// Form A's
let Form1A = reactive({ ...useForm1A });

let Form2A = reactive({ ...useForm2A })
let Form3A = reactive({ ...useForm3A })

// Form B's
let Form1B = reactive({ ...useForm1B })
let Form2B = reactive({ ...useForm2B })
let Form3B = reactive({ ...useForm3B })

// Form C's
let Form1C = reactive({ ...useForm1C })
let Form2C = reactive({ ...useForm2C })
let Form3C = reactive({ ...useForm3C })




const intact_name_field = computed({
    get() {
        if (selectedType.value === '1B') return Form1B.no_record_birth_of;
        if (selectedType.value === '2B') return Form2B.no_record_death_of;
        return Form3B.no_record_marriage_of;
    },
    set(value) {
        if (selectedType.value === '1B') Form1B.no_record_birth_of = value;
        else if (selectedType.value === '2B') Form2B.no_record_death_of = value;
        else Form3B.no_record_marriage_of = value;
    }
});

const intact_date_field = computed({
    get() {
        if (selectedType.value === '1B') return Form1B.born_on;
        if (selectedType.value === '2B') return Form2B.died_on;
        return Form3B.married_on;
    },
    set(value) {
        if (selectedType.value === '1B') Form1B.born_on = value;
        else if (selectedType.value === '2B') Form2B.died_on = value;
        else Form3B.married_on = value;
    }
});

const intact_year_field = computed({
    get() {
        if (selectedType.value === '1B') return Form1B.intact_birth_year;
        if (selectedType.value === '2B') return Form2B.intact_death_year;
        return Form3B.intact_marriage_year;
    },
    set(value) {
        if (selectedType.value === '1B') Form1B.intact_birth_year = value;
        else if (selectedType.value === '2B') Form2B.intact_death_year = value;
        else Form3B.intact_marriage_year = value;
    }
});



const destroyed_name_field = computed({
    get() {
        if (selectedType.value === '1C') return Form1C.birth_name;
        if (selectedType.value === '2C') return Form2C.death_name;
        return;
    },
    set(value) {
        if (selectedType.value === '1C') Form1C.birth_name = value;
        else if (selectedType.value === '2C') Form2C.death_name = value;
        else return;
    }
});
const destroyed_date_field = computed({
    get() {
        if (selectedType.value === '1C') return Form1C.born_on;
        if (selectedType.value === '2C') return Form2C.died_on;
        return Form3C.married_on;
    },
    set(value) {
        if (selectedType.value === '1C') Form1C.born_on = value;
        else if (selectedType.value === '2C') Form2C.died_on = value;
        else Form3C.married_on = value;
    }
});


/**
 * States
 */
const selectedType = ref(null)
const isPreview = ref(false)
const previewUrl = ref('')
const unsavedDataMessage = ref(false)
const fact_of = ref('')

/**
 * Preferences
 */

const initialPref = {
    logo: {
        left_scale: 0.35,
        right_scale: 0.35,
        left_x: 420,
        left_y: 790,
        right_x: 110,
        right_y: 790
    },
    header: {
        x: 0,
        y: 6.5
    },
    concern: {
        x: 72,
        y: 135
    },
    page_book_number: {
        x: 125,
        y: 163
    },
    body_data: {
        x: 110,
        y: 205
    },
    issued_to: {
        x: 0,
        y: 300
    },
    verifier: {
        x: 72,
        y: 185
    },
    c_mcr: {
        x: 360,
        y: 216
    },
    billing_info: {
        x: 76,
        y: 118
    },
    authentication: {
        x: 0,
        y: 300
    },
    remarks_config: {
        x: 80,
        y: 260,
        font: 12,
        width: 480,
    }
}
const preference = reactive({
    ...initialPref
})


watch(selectedType, (newVal) => {
    if (newVal?.includes('A')) {
        preference.authentication.y = 280
        preference.logo.right_y = 797.75
        preference.logo.left_y = 797.75
    } else {
        if (newVal?.includes('B')) {
            preference.body_data.y = 500
            preference.concern.y = 200
        } else if (newVal?.includes('C')) {
            preference.body_data.y = 570
            preference.concern.y = 160
        } else {
            preference.body_data.y = 205
            preference.concern.y = 135
        }
        preference.authentication.y = 250
        preference.logo.right_y = 703.75
        preference.logo.left_y = 703.75
    }
})




watch(preference, () => {
    if (isPreview.value) {
        previewForm()
    }
}, { deep: true })


watch(() => transactions.is_other_remarks, (newValue) => {
    if (newValue) {
        preference.c_mcr.y = 180
    } else {
        available.remarks = ''
        preference.c_mcr.y = 216
    }
})




const remarksNotDelta = ref()

function handleEditorReady(editor) {
    editor.on('text-change', () => {
        // remarksNotDelta.value = editor.getText()
        remarksNotDelta.value = JSON.stringify(available.remarks)
    });
}



// Hooks for Updates
const formID = ref(null)
const isUpdateHook = ref(false)


const saveForm = async () => {
    const form_type = selectedType.value;
    const formAvailableMapping = {
        '1A': Form1A, '2A': Form2A, '3A': Form3A,
        '1B': Form1B, '2B': Form2B, '3B': Form3B,
        '1C': Form1C, '2C': Form2C, '3C': Form3C,
    };

    const formFunctions = {
        '1A': formsStore.add_form1a, '1B': formsStore.add_form1b, '1C': formsStore.add_form1c,
        '2A': formsStore.add_form2a, '2B': formsStore.add_form2b, '2C': formsStore.add_form2c,
        '3A': formsStore.add_form3a, '3B': formsStore.add_form3b, '3C': formsStore.add_form3c,
    };

    const formDataRef = formAvailableMapping[form_type];
    if (!formDataRef) return console.error('Invalid form type selected');

    available.remarks = remarksNotDelta.value;

    const documentOwner = (() => {
        switch (form_type) {
            case '1A': return Form1A.name_child;
            case '1B': return Form1B.no_record_birth_of;
            case '2A': return Form2A.name_deceased;
            case '2B': return Form2B.no_record_death_of;
            case '3A': return `${Form3A.groom_name} & ${Form3A.bride_name}`;
            case '3B': return `${Form3B.no_record_marriage_of} & ${Form3B.married_with}`;
            case '1C': return Form1C.birth_name;
            case '2C': return Form2C.death_name;
            case '3C': return `${Form3C.groom_name} & ${Form3C.bride_name}`;
            default: return '';
        }
    })();

    const baseData = {
        form_type,
        ...toRaw(preference),
        ...toRaw(transactions),
        ...(form_type.endsWith('C') ? toRaw(destroyed) : {}),
        ...(form_type.endsWith('A') ? toRaw(available) : {}),
        ...formDataRef
    };

    let filePath = null;

    if (system_setting?.defaults?.file_path?.trim()) {
        const saveResult = await window.FormApi.SaveFormPDF({
            data: JSON.stringify(baseData),
            form_type,
            documentOwner,
            basePath: system_setting.defaults.file_path
        });

        if (saveResult.result.status) {
            filePath = saveResult.result.filePath;

            if (saveResult.result.usedFallback) {
                toast.fire({
                    icon: 'warning',
                    title: 'Base path was not accessible. PDF saved to backup location.',
                    text: saveResult.result.filePath,
                    duration: 8000,
                });
            }
        } else {
            toast.fire({
                icon: 'error',
                title: 'Failed to save PDF',
                text: saveResult.result.error,
            });
            return;
        }
    }

    // Include file path in the final form data
    const formData = reactive({
        form_type,
        file_path: filePath,
        ...transactions,
        ...(form_type.endsWith('A') ? available : {}),
        ...(form_type.endsWith('C') ? destroyed : {}),
        ...formDataRef,
    });

    // Save or update
    if (formID.value && isUpdateHook.value) {
        await formsStore[`edit_form${form_type.toLowerCase()}`](formID.value, formData);
    } else {
        const saveFunc = formFunctions[form_type];
        if (saveFunc) {
            const response = await saveFunc(formData);
            if (response.status) {
                formID.value = response.id;
                isUpdateHook.value = true;
            }
        }
    }

    closeModal();
    toast.fire({
        icon: 'success',
        title: `Form ${form_type} has been successfully added.`,
        duration: 5000,
    });
};


const previewForm = async () => {
    const form_type = selectedType.value;

    const formAvailableMapping = {
        // For Form A's
        '1A': Form1A,
        '2A': Form2A,
        '3A': Form3A,

        // For Form B's
        '1B': Form1B,
        '2B': Form2B,
        '3B': Form3B,

        // For Form C's
        '1C': Form1C,
        '2C': Form2C,
        '3C': Form3C,
    };

    if (formAvailableMapping[form_type]) {
        const main_data = reactive({
            form_type,
            ...preference,
            ...transactions,
            ...destroyed,
            ...(form_type.endsWith('A') ? available : {}),
            ...formAvailableMapping[form_type],
        });
        const preview = await window.FormApi.PreviewFormPDF(JSON.stringify(main_data));
        previewUrl.value = preview.result.pdfbase64;
        isPreview.value = true

    } else {
        console.log('Invalid form type selected');
    }
};


const is_with_remarks = computed(() => {
    return formData.form_type.includes('A') ? true : false
})


onMounted(() => {
    formsStore.get_all_form1a()
});



const selectedForm = ref(null)
const formsStore = useForms()

const fetchFormData = async (item) => {
    let fetchAction
    const selectedItem = item

    const itemMap = {
        'Birth Available': formsStore.get_all_form1a,
        'Birth Intact': formsStore.get_all_form1b,
        'Birth Destroyed': formsStore.get_all_form1c,
        'Death Available': formsStore.get_all_form2a,
        'Death Intact': formsStore.get_all_form2b,
        'Death Destroyed': formsStore.get_all_form2c,
        'Marriage Available': formsStore.get_all_form3a,
        'Marriage Intact': formsStore.get_all_form3b,
        'Marriage Destroyed': formsStore.get_all_form3c,
    }

    fetchAction = itemMap[selectedItem]

    if (!fetchAction) {
        console.log('Unknown form type:', selectedItem)
        return
    }

    try {
        const data = await fetchAction()
        console.log('Data fetched successfully:', data)
    } catch (error) {
        console.log('Error fetching data:', error)
    }
}


const options = ref(
    [
        'Form 1 (Birth)',
        'Form 2 (Death)',
        'Form 3 (Marriage)'
    ]
)


const FormTypes = ref([])
const isFormOpen = ref(false)


const initialFormData = {

    is_with_authentication: '',
    date_filed: format(new Date(), "MMMM dd, yyyy"),
    page_number: '',
    book_number: '',


    registry_number: '',
    date_registration: '',

    name_child: '',
    sex: '',
    date_birth: '',
    place_birth: '',
    name_mother: '',
    citizenship_mother: '',
    name_father: '',
    citizenship_father: '',
    date_marriage_parents: '',
    place_marriage_parents: '',

    certification_issued_to: '',
    remarks: '',
    verified_by: 'ERIKA JOYCE B. PARAGAS',
    verifier_position: 'Registration Officer I',
    civil_registrar: 'ISMAEL D. MALICDEM, JR.',
    civil_registrar_position: 'Municipal Civil Registrar',
    created_by: 1,

    amount_paid: 'Php 130.00',
    or_number: '',
    date_paid: format(new Date(), "MMMM dd, yyyy"),

}

const formData = reactive({ ...initialFormData })

function resetFormData() {

    Object.assign(formData, initialFormData);
    Object.assign(preference, initialPref)

    Object.assign(transactions, useTransactionDetails);
    Object.assign(available, useAvailableForm);
    Object.assign(Form1A, useForm1A);
    Object.assign(Form2A, useForm2A);
    Object.assign(Form3A, useForm3A);

    formID.value = null
    isUpdateHook.value = false
}


const OpenForms = (e) => {
    switch (e) {
        case 'Form 1 (Birth)':
            FormTypes.value = ['1A', '1B', '1C']
            selectedType.value = '1A'
            formData.form_type = '1A'
            break
        case 'Form 2 (Death)':
            FormTypes.value = ['2A', '2B', '2C']
            selectedType.value = '2A'
            formData.form_type = '2A'
            break
        case 'Form 3 (Marriage)':
            FormTypes.value = ['3A', '3B', '3C']
            selectedType.value = '3A'
            formData.form_type = '3A'
            break
    }

    isFormOpen.value = true
    selectedForm.value = e
}

const closeModal = () => {
    resetFormData()
    isFormOpen.value = false
    isPreview.value = false

}
const toggleForm = (val) => {
    resetFormData()
    selectedType.value = val
    formData.form_type = val
}



const EditMap = (data) => {
    transactions.date_filed = data.date_filed
    transactions.certification_issued_to = data.certification_issued_to
    transactions.verified_by = data.verified_by
    transactions.verifier_position = data.verifier_position
    transactions.civil_registrar = data.civil_registrar
    transactions.civil_registrar_position = data.civil_registrar_position
    transactions.created_by = data.created_by
    transactions.amount_paid = data.amount_paid
    transactions.or_number = data.or_number
    transactions.date_paid = data.date_paid
    transactions.is_with_authentication = data.is_with_authentication
    transactions.for_and_in_the_absence = data.for_and_in_the_absence
    transactions.absence_verified_by = data.absence_verified_by
    transactions.absence_verifier_position = data.absence_verifier_position
    available.is_reconstructed = data.is_reconstructed
    available.is_other_remarks = data.is_other_remarks

    available.date_registration = data.date_registration
    available.page_number = data.page_number
    available.book_number = data.book_number
    available.registry_number = data.registry_number

    // available.remarks = {
    //     ops: [{ insert: (data.remarks || '') + '\n' }]
    // };
    available.remarks = data.remarks ? JSON.parse(data.remarks) : '';



    Form1A.name_child = data.name_child
    Form1A.sex = data.sex
    Form1A.date_birth = data.date_birth
    Form1A.place_birth = data.place_birth
    Form1A.name_mother = data.name_mother
    Form1A.citizenship_mother = data.citizenship_mother
    Form1A.name_father = data.name_father
    Form1A.citizenship_father = data.citizenship_father
    Form1A.date_marriage_parents = data.date_marriage_parents
    Form1A.place_marriage_parents = data.place_marriage_parents
}

const isViewLocalOpen = ref(false)
const isOnEdit = ref(false)

const localPdf = ref(null)
const documentOwner = ref(null)

const handleViewLocal = async (data) => {
    try {
        if (typeof data !== 'object' || data === null) {
            console.warn('Invalid data: expected a non-null object');
            return;
        }

        //Set Document Owner in Viewer
        documentOwner.value = data.name_child ||
            data.name_deceased ||
            data.groom_name ||
            data.bride_name ||
            data.no_record_birth_of ||
            data.no_record_death_of ||
            data.no_record_marriage_of ||
            data.birth_name ||
            data.death_name ||
            '';


        const main_data = {
            ...preference,
            ...data,
        };


        const preview = await window.FormApi.PreviewFormPDF(JSON.stringify(main_data));
        if (preview.result.status) {

            isViewLocalOpen.value = true;
            localPdf.value = preview.result.pdfbase64;
        }

    } catch (error) {
        localPdf.value = null;
        console.error('Failed to generate PDF preview:', error);
    }
};


const handleCloseViewLocal = () => {
    isViewLocalOpen.value = false;
    localPdf.value = null;
};


const handleRemove = async (data) => {
    const { form_type, id } = data || {};

    if (!id) {
        console.warn('No ID provided for deletion');
        return;
    }

    if (!form_type || typeof form_type !== 'string') {
        console.warn('Invalid form_type');
        return;
    }

    const removeMapping = {
        // For Form A's
        '1A': formsStore.delete_form1a,
        '2A': formsStore.delete_form2a,
        '3A': formsStore.delete_form3a,

        // For Form B's
        '1B': formsStore.delete_form1b,
        '2B': formsStore.delete_form2b,
        '3B': formsStore.delete_form3b,

        // For Form C's
        '1C': formsStore.delete_form1c,
        '2C': formsStore.delete_form2c,
        '3C': formsStore.delete_form3c,
    };

    const removeAction = removeMapping[form_type];

    if (typeof removeAction !== 'function') {
        console.error(`No delete function found for form_type: ${form_type}`);
        return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (!confirmDelete) {
        return;
    }

    try {
        await removeAction(id);
        console.log(`Record with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error('Error removing record:', error);
    }
};




const handleEdit = async (data) => {
    formID.value = data.id
    isUpdateHook.value = true
    EditMap(data)
    isFormOpen.value = true
    selectedForm.value = 'Form 1A'
    selectedType.value = "1A"
    formData.form_type = '1A'
    isPreview.value = false
}
const handleUpdate = async () => {

}

const handleCopy = async (data) => {
    EditMap(data)

    transactions.date_filed = format(new Date(), "MMMM dd, yyyy"),
        transactions.or_number = '',
        transactions.date_paid = format(new Date(), "MMMM dd, yyyy"),


        transactions.for_and_in_the_absence = false
    transactions.absence_verified_by = ''
    transactions.absence_verifier_position = ''
    isFormOpen.value = true
    selectedForm.value = 'Form 1A'
    selectedType.value = "1A"
    formData.form_type = '1A'
    isPreview.value = false
}


const defaultPageSize = computed(() =>
    selectedType.value.includes('A') ? 'Long Coupon' : 'Letter'
)
const maxPageRange = computed(() => {
    return transactions.is_with_authentication ? 2 : 1
})


// Define your base action column
const actionColumn = {
    headerName: "Action",
    pinned: "right",
    flex: 2,
    width: 150,
    lockPinned: true,
    resizable: true,
    sortable: false,
    cellStyle: { overflow: "visible", border: "none" },
    cellRenderer: ManageBtn,
    cellRendererParams: {
        onViewLocal: handleViewLocal,
        onRemove: handleRemove,
        onEdit: handleEdit,
        onCopy: handleCopy
    }
}

// Dynamic column definitions
const colDefs = ref([])

// Column presets
const columnPresets = {
    // -------------------- Available --------------------
    'Birth Available': [
        { field: "name_child", headerName: "Child Name", flex: 1, filter: true, cellClass: 'font-medium' },
        // { field: "sex", headerName: "Sex" },
        { field: "date_birth", headerName: "Date of Birth" },
        { field: "place_birth", headerName: "Place of Birth" },
        // { field: "name_mother", headerName: "Mother's Name" },
        // { field: "name_father", headerName: "Father's Name" },
        // { field: "date_marriage_parents", headerName: "Parents' Marriage Date" },
        { field: "registry_number", headerName: "Registry Number", flex: 1 },
        { field: "date_registration", headerName: "Date of Registration" },
        // { field: "remarks", headerName: "Remarks" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Death Available': [
        { field: "name_deceased", headerName: "Deceased Name", flex: 1, pinned: 'left' },
        // { field: "sex", headerName: "Sex" },
        // { field: "deceased_age", headerName: "Age" },
        // { field: "deceased_civil_status", headerName: "Civil Status" },
        // { field: "deceased_citizenship", headerName: "Citizenship" },
        { field: "date_of_death", headerName: "Date of Death" },
        { field: "place_of_death", headerName: "Place of Death" },
        // { field: "cause_of_death", headerName: "Cause of Death" },
        { field: "registry_number", headerName: "Registry Number" },
        // { field: "date_registration", headerName: "Date of Registration" },
        // { field: "remarks", headerName: "Remarks" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Marriage Available': [
        { field: "groom_name", headerName: "Groom Name", flex: 1 },
        { field: "bride_name", headerName: "Bride Name", flex: 1 },
        { field: "date_marriage", headerName: "Marriage Date" },
        { field: "place_marriage", headerName: "Place of Marriage" },
        { field: "registry_number", headerName: "Registry Number" },
        { field: "date_registration", headerName: "Date of Registration" },
        // { field: "remarks", headerName: "Remarks" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],

    // -------------------- Intact --------------------
    'Birth Intact': [
        { field: "no_record_birth_of", headerName: "No Record Birth Of", flex: 2 },
        { field: "born_on", headerName: "Born On" },
        { field: "mother_name", headerName: "Mother's Name" },
        { field: "father_name", headerName: "Father's Name" },
        { field: "intact_birth_year", headerName: "Intact Year" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Death Intact': [
        { field: "no_record_death_of", headerName: "No Record Death Of", flex: 1, pinned: 'left' },
        { field: "died_on", headerName: "Died On" },
        { field: "intact_death_year", headerName: "Intact Year" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Marriage Intact': [
        { field: "no_record_marriage_of", headerName: "No Record Marriage Of", flex: 1, pinned: 'left' },
        { field: "married_on", headerName: "Married On" },
        { field: "intact_marriage_year", headerName: "Intact Year" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],

    // -------------------- Destroyed --------------------
    'Birth Destroyed': [
        { field: "birth_name", headerName: "Birth Name", flex: 1, pinned: 'left' },
        { field: "born_on", headerName: "Born On" },
        { field: "registered_from", headerName: "Registered From" },
        { field: "from_year", headerName: "From Year" },
        { field: "to_year", headerName: "To Year" },
        // { field: "destroyed_by", headerName: "Destroyed By" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Death Destroyed': [
        { field: "death_name", headerName: "Death Name", flex: 1, pinned: 'left' },
        { field: "died_on", headerName: "Died On" },
        { field: "registered_from", headerName: "Registered From" },
        { field: "from_year", headerName: "From Year" },
        { field: "to_year", headerName: "To Year" },
        // { field: "destroyed_by", headerName: "Destroyed By" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
    'Marriage Destroyed': [
        { field: "groom_name", headerName: "Groom Name", flex: 1 },
        { field: "bride_name", headerName: "Bride Name", flex: 1 },
        { field: "married_on", headerName: "Married On" },
        { field: "registered_from", headerName: "Registered From" },
        { field: "from_year", headerName: "From Year" },
        { field: "to_year", headerName: "To Year" },
        // { field: "destroyed_by", headerName: "Destroyed By" },
        // { field: "amount_paid", headerName: "Amount Paid" },
        // { field: "or_number", headerName: "OR Number" },
        { field: "date_paid", headerName: "Date Paid" },
    ],
};


// Watch for menu change
watch(menu, (newVal) => {
    if (columnPresets[newVal]) {
        colDefs.value = [
            ...columnPresets[newVal].map(col => ({
                filter: true,
                resizable: true,
                sortable: true,
                cellStyle: { border: "none" },
                ...col
            })),
            actionColumn
        ]
    }
}, { immediate: true })




</script>
<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s ease;
}

.fade-scale-enter-from {
    opacity: 0;

}

.fade-scale-enter-to {
    opacity: 1;

}

.fade-scale-leave-from {
    opacity: 1;

}

.fade-scale-leave-to {
    opacity: 0;

}
</style>