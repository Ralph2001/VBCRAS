<template>
    <div class="flex flex-col relative justify-center w-full p-10 ">


        <Header label="LOCAL CIVIL REGISTRY FORMS">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <BtnDrop label="Create New Form" :options="options" @open-modal="OpenForms" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>

        <div v-if="isViewLocalOpen"
            class="fixed top-0 bottom-0 left-0 right-0 w-full h-full flex items-center p-10                  justify-center z-50 backdrop-blur-sm backdrop-brightness-50">
            <div class=" bg-white rounded h-full w-full ">
                <PDFViewerWorker :scale="1.5" :pdfBytes64="previewUrl" @update:pdfBytes64="previewUrl = $event" />
            </div>
        </div>

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
            <!-- <p class="italic font-thin text-sm  font-mono">Table Here</p> -->

            <div class="h-full">
                <TableGrid :data="filteredRowData" :dataColumns="colDefs" :suppressRowTransform="true" />
            </div>

        </div>



        <FormModal title="Create New Form" v-if="isFormOpen" @exit-modal="closeModal()">
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

                <div v-else class="flex flex-row items-center gap-3 p-2 rounded-md shadow-sm w-full">
                    <button @click="isPreview = false"
                        class="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-edit" class="mr-2 text-base" />
                        Edit Form
                    </button>

                    <div class="ml-auto flex gap-2">
                        <button @click="previewForm"
                            class="h-8 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-print" class="mr-2 text-base" />
                            Print Document
                        </button>

                        <button @click="saveForm"
                            class="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition duration-150 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-save" class="mr-2 text-base" />
                            Save
                        </button>
                    </div>
                </div>
            </template>


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
                                        <InputforForm isUpperCase width="10rem" bold middle
                                            v-model="intact_date_field" /> in this
                                        municipality,

                                        <!-- If Form 1B -->
                                        <span v-if="selectedType === '1B'"> of parents
                                            <InputforForm isUpperCase width="18rem" bold middle
                                                v-model="Form1B.father_name" v-if="selectedType === '1B'" /> and
                                            <InputforForm isUpperCase width="18rem" bold v-model="Form1B.mother_name"
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
                                        <InputforForm isUpperCase width="6rem" bold middle
                                            v-model="intact_year_field" /> are
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
                                    <InputforForm width="6rem" v-model="destroyed.from_year" />
                                    to
                                    <InputforForm width="6rem" v-model="destroyed.to_year" />
                                    were totally destroyed by
                                    <InputforForm width="20rem" v-model="destroyed.destroyed_by" />
                                    Hence, we cannot issue as requested, a true transcription from the Register of
                                    {{ register_of }} or
                                    true
                                    copy of the Certification of {{ register_of }} of
                                    <InputforForm width="25rem" v-if="selectedType === '1C' && selectedType === '2C'"
                                        v-model="destroyed_name_field" /> <span v-if="selectedType === '3C'">
                                        <InputforForm width="25rem" v-model="Form3C.groom_name" /> and
                                        <InputforForm width="25rem" v-model="Form3C.bride_name" />
                                    </span> who
                                    is alleged
                                    to have {{ alleged_to }} on
                                    <InputforForm width="10rem" v-model="destroyed_date_field" /> in
                                    this
                                    municipality <span v-if="selectedType === '1C'">of parents
                                        <InputforForm width="25rem" v-model="Form1C.father_name" /> and
                                        <InputforForm width="25rem" v-model="Form1C.mother_name" />
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

                                <button
                                    class="bg-blue-600 hover:bg-blue-700 text-white border focus:ring-2 focus:ring-blue-700 focus:bg-blue-700 focus:border-2 outline-none px-10 font-medium  py-2.5 rounded-md "
                                    @click="previewForm">Next</button>


                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="h-full w-full relative bg-gray-50">
                    <div class="flex-1 overflow-auto bg-gray-50 flex items-center justify-center relative">

                        <PDFViewerWorker :pdfBytes64="previewUrl" />

                    </div>
                </div>
            </template>
        </FormModal>


        <Modal footerBG="bg-white" v-if="null" :footer="false">
            <template v-slot:header>
                <div class="flex flex-row w-full">


                    <div class="flex items-center flex-row gap-2 ml-auto"
                        v-if="!isPreview && !isOnEdit && formID === null && !isUpdateHook">
                        <button @click="toggleForm(`${type}`)" v-for="type in FormTypes" :key="type"
                            :class="[selectedType === type ? 'text-white bg-green-500 ' : '']"
                            class="p-2 h-7 w-fit    hover:bg-green-600 transition-all duration-100 flex items-center text-xs justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                            Form {{ type }}
                        </button>
                    </div>
                    <div v-else-if="isPreview" class="ml-auto px-2">
                        <button class="text-white hover:underline" @click="settings = !settings">Settings</button>
                    </div>
                </div>
            </template>

            <div v-if="!isPreview"
                class="w-full h-full grid grid-cols-1 lg:grid-cols-[55%_45%]  py-1.5 bg-white overflow-y-auto">


                <div v-if="unsavedDataMessage"
                    class="fixed top-0 flex items-center justify-center bottom-0 left-0 right-0 backdrop-blur-sm z-50 backdrop-brightness-75">
                    <div class="w-[40rem]  bg-white rounded flex flex-col  p-4">
                        <p class="font-bold text-red-400  text-lg">Are you sure you want to close the form?</p>
                        <p class="text-justify text-pretty mt-4">It looks like you have unsaved changes in the form. If
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

                        <div class="text-sm w-full px-10 my-auto flex justify-center">
                            <p class=" relative text-pretty  tracking-widest indent-8 leading-8 text-neutral-900">We
                                certify that among others, the following facts of {{ fact_of }} appear in our Register

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
                                <InputforFormSuggestions width="100%" v-model="Form1A.place_marriage_parents" isPlace />
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
                            <p class="indent-8 text-pretty leading-10 tracking-wider text-justify">We certify that
                                this
                                office
                                has
                                no
                                record of {{ records_of }} of
                                <InputforForm width="30rem" bold isUpperCase middle v-model="formData.name_of" /> who
                                is
                                alleged
                                to have {{ alleged_to }} on
                                <InputforForm width="10rem" bold middle v-model="formData.date_of" /> in this
                                municipality, <span v-if="selectedType === '1B'"> of parents
                                    <InputforForm width="18rem" bold middle v-if="selectedType === '1B'" /> and
                                    <InputforForm width="18rem" bold v-if="selectedType === '1B'" middle />.
                                </span> Hence, we cannot issue,
                                as
                                requested, a true
                                copy of his/her Certificate of {{ register_of }} or transcription from the Register
                                of
                                {{ transcription_register_of }}.
                            </p>
                        </div>

                        <div class="mt-10 px-10 ">
                            <p class="indent-8 text-pretty tracking-wider text-justify"> We also certify that the
                                records of
                                {{ records_of }} for the year
                                <InputforForm width="6rem" bold middle v-model="formData.records_of_year" /> are
                                still
                                intact in the
                                archives of
                                this office.
                            </p>
                        </div>

                    </div>

                    <!-- Forms with `C` -->
                    <div class="flex flex-col gap-2 mt-auto mb-auto" v-if="selectedType.includes('C')">

                        <p class="indent-8 text-pretty leading-10 tracking-wider text-justify"> We certify that the
                            records
                            of
                            {{ records_of }}
                            filed in the archives of this office include those, which were registered from
                            <InputforForm width="6rem" middle v-model="formData.registered_from" /> to
                            present.
                            However, the records of {{ records_of }} during period
                            <InputforForm width="6rem" v-model="formData.period_from" />
                            to
                            <InputforForm width="6rem" v-model="formData.period_to" />
                            were totally destroyed by
                            <InputforForm width="20rem" v-model="formData.destroyed_by" />
                            Hence, we cannot issue as requested, a true transcription from the Register of
                            {{ register_of }} or
                            true
                            copy of the Certification of {{ register_of }} of
                            <InputforForm width="15rem" v-model="formData.name_of" /> who
                            is alleged
                            to have {{ alleged_to }} on
                            <InputforForm width="10rem" v-model="formData.date_of" /> in
                            this
                            municipality.
                        </p>

                    </div>
                </div>

                <!-- Page 2,  Other Side -->
                <!-- This is Required for all Forms -->
                <div class="flex flex-col gap-2 px-4 py-4">
                    <div
                        class="flex items-center justify-center relative text-sm font-sans flex-row text-nowrap lg:text-wrap lg:flex-col">
                        This certification is issued to <div class="px-2">
                            <InputforForm width="30rem" middle bold v-model="transactions.certification_issued_to" />
                        </div> upon his/her request.
                    </div>



                    <div class="flex flex-col gap-2 " v-if="is_with_remarks">
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" v-model="transactions.is_reconstructed"
                                class="border rounded-sm border-gray-400" id="is_reconstructed">
                            <label class="text-md font-medium text-neutral-800 text-sm"
                                for="is_reconstructed">Reconstructed
                                Copy</label>
                        </div>

                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" v-model="transactions.is_other_remarks"
                                class="border rounded-sm border-gray-400" id="is_other_remarks">
                            <label class="text-md font-medium text-neutral-800 text-sm" for="is_other_remarks">Other
                                Remarks</label>
                        </div>
                        <!-- <p class="font-medium text-xs">Add Remarks</p> -->

                        <div class="flex flex-col py-2 w-full gap-2" v-show="transactions.is_other_remarks">
                            <div class="w-full flex flex-col gap-1 bg-white">
                                <QuillEditor @ready="handleEditorReady" theme="snow" :toolbar="['bold', 'italic']"
                                    v-model:content="available.remarks" contentType="delta" content="delta" />
                            </div>
                        </div>

                        <!-- {{ available.remarks }} -->
                    </div>
                    <div class="mt-auto grid grid-cols-2   mb-4">
                        <!-- <div class="absolute -right-[15rem]">
                            <button class="text-xs text-blue-500 border rounded-sm p-2 hover:bg-white">
                                <p>
                                    ADD <span class="italic">"For and in the
                                        absence:"</span>
                                </p>
                            </button>
                        </div> -->
                        <div class="flex flex-col ">
                            <p class="italic mb-10">Verified by:</p>
                            <div class="pl-0 flex flex-col items-center gap-[0.10rem]">
                                <InputforForm skip width="100%" bold middle v-model="transactions.verified_by"
                                    isUpperCase />
                                <InputforForm skip width="100%" middle italic unbordered isTransparent
                                    v-model="transactions.verifier_position" />
                            </div>
                        </div>
                        <div class="flex flex-col items-center gap-[0.10rem]">
                            <p v-if="transactions.for_and_in_the_absence" class="italic font-medium text-sm">For and in
                                the absence
                                of:</p>
                            <InputforForm skip middle width="100%" bold v-model="transactions.civil_registrar"
                                isUpperCase />
                            <InputforForm skip width="100%" middle italic unbordered isTransparent
                                v-model="transactions.civil_registrar_position" />
                            <div v-if="transactions.for_and_in_the_absence"
                                class="mt-4 flex flex-col items-center gap-[0.10rem] ">
                                <InputforForm skip width="20rem" bold middle v-model="transactions.absence_verified_by"
                                    @input="transactions.absence_verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm skip width="20rem" middle italic unbordered isTransparent
                                    v-model="transactions.absence_verifier_position" />
                            </div>
                        </div>
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
                    <div class="flex flex-row gap-2 p-4   items-center justify-center bg-gray-100 ">

                        <div class="flex flex-col gap-1">
                            <div class="flex flex-row gap-2 items-center">
                                <input type="checkbox" v-model="transactions.is_with_authentication" name=""
                                    id="with_authentication" class="border rounded-sm border-gray-600">
                                <label for="with_authentication" class="text-md font-medium text-neutral-800">With
                                    Authentication</label>
                            </div>
                            <div class="flex flex-row gap-2 items-center">
                                <input v-model="transactions.for_and_in_the_absence" type="checkbox"
                                    id="for_and_in_the_absence" class="border rounded-sm border-gray-600">
                                <label for="for_and_in_the_absence" class="text-md font-medium text-neutral-800">For and
                                    in
                                    the absence
                                    of</label>
                            </div>

                        </div>


                        <div class="ml-auto flex items-center justify-center gap-2">
                            <button tabindex="-1"
                                class="border bg-white hover:bg-red-500 focus:bg-red-500 active:bg-red-500 hover:text-white px-10 font-medium  py-2.5 rounded-md "
                                @click="closeModal">Exit</button>
                            <button
                                class="bg-blue-600 hover:bg-blue-700 text-white border focus:ring-2 focus:ring-blue-700 focus:bg-blue-700 focus:border-2 outline-none px-10 font-medium  py-2.5 rounded-md "
                                @click="previewForm">Next</button>


                            <!-- <button @click="saveForm()"
                                class="bg-blue-500 hover:bg-blue-600 text-white px-4 font-medium  py-3.5 rounded-md ">Create</button> -->

                        </div>
                    </div>

                </div>
            </div>


            <div v-else class="h-full w-full relative bg-gray-50">
                <!-- PDF Viewer -->
                <div class="flex h-full w-full ">
                    <PDFViewerWorker :scale="1.5" :pdfBytes64="previewUrl" />

                </div>
                <!-- Action Buttons -->
                <div
                    class="fixed bottom-0 bg-gradient-to-r from-blue-900 to-blue-700 h-16 gap-4 w-full shadow-xl z-40 flex items-center justify-between px-6">

                    <!-- Edit Form Button -->
                    <button @click="isPreview = false"
                        class="bg-gray-800 hover:bg-gray-600 text-white shadow-md rounded-md outline-none font-semibold px-5 py-2 tracking-wide flex items-center">
                        <font-awesome-icon icon="fa-solid fa-edit" class="mr-2 text-lg" />
                        Edit Form
                    </button>

                    <!-- Print Document Button -->
                    <button @click="saveForm()"
                        class="text-white hover:text-white hover:bg-green-600 gap-3 text-sm bg-green-500 shadow-md rounded-md outline-none font-semibold px-5 py-3 tracking-wide flex items-center">
                        <font-awesome-icon icon="fa-solid fa-print" class="mr-2 text-lg" />
                        <div class="flex flex-col items-start">
                            <p>Print Document</p>
                        </div>
                    </button>

                    <!-- Exit Button (Conditional) -->
                    <button @click="closeModal" v-if="formID !== null && isUpdateHook"
                        class="bg-red-500 hover:bg-red-400 text-white shadow-md rounded-md outline-none font-semibold px-5 py-2 tracking-wide flex items-center">
                        <font-awesome-icon icon="fa-solid fa-times" class="mr-2 text-lg" />
                        Exit
                    </button>
                </div>
            </div>


        </Modal>

    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue'
import Header from '../../components/essentials/header.vue'
import InputforForm from '../../components/Form/InputforForm.vue'
import InputLabel from '../../components/Form/InputLabel.vue'
import { format } from 'date-fns'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { citizenshipOptions } from '../../utils/nationality.js';

import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import { useForms } from '../../stores/forms.js'
import ControlButton from '../../components/ControlButton.vue'
import { QuillEditor } from '@vueup/vue-quill'
import { useAvailableForm, useForm1A, useForm1B, useForm1C, useForm2A, useForm2B, useForm2C, useForm3A, useForm3B, useForm3C, useRegisteredPeriod, useTransactionDetails } from '../../lib/FormProps.js'
import { dumb_maker } from '../../lib/lala.js'
import ManageBtn from '../../components/Form/ManageBtn.vue'
import InputforFormSuggestions from '../../components/Form/InputforFormSuggestions.vue'
import { formMunicipalityProvinceAddress, municipalityProvinceAddress } from '../../utils/Address/index.js'
import Input from '../../components/essentials/inputs/Input.vue'
import { onClickOutside } from '@vueuse/core'
import FormModal from '../../components/Form/FormModal.vue'
import { useToast } from '../../lib/useToast.js'

const TableGrid = defineAsyncComponent(() => import("../../components/TableGrid.vue")); // Data Grid

const search = ref(null)



const toast = useToast()







const formToRender = computed(() => {
    let render
    switch (menu.value) {
        case 'Birth Available':
            render = "form1a"
            break
        case 'Birth Not Available':
            render = "form1b"
            break
        case 'Birth Destroyed':
            render = "form1c"
            break
        case 'Death Available':
            render = "form2a"
            break
        case 'Death Not Available':
            render = "form2b"
            break
        case 'Death Destroyed':
            render = "form2c"
            break
        case 'Marriage Available':
            render = "form3a"
            break
        case 'Marriage Not Available':
            render = "form3b"
            break
        default:
            console.log('Unknown form type:', item)
            return
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
        items: ['Birth Available', 'Birth Not Available', 'Birth Destroyed'],
    },
    {
        label: 'Death',
        items: ['Death Available', 'Death Not Available', 'Death Destroyed'],
    },
    {
        label: 'Marriage',
        items: ['Marriage Available', 'Marriage Not Available', 'Marriage Destroyed'],
    }
])
const changeMenu = (item) => {
    menu.value = item;
    isMenuOpen.value = false;


    Object.assign(preference, initialPref);  // Resetting preference to initial defaults


    fetchFormData(item);
};

const settings = ref(false)
let transactions = reactive({ ...useTransactionDetails });
let available = reactive({ ...useAvailableForm });
let destroyed = reactive({ ...useRegisteredPeriod })

/**
 * All Forms FormData
 * @satisfies
 */


// Form A's
let Form1A = reactive({ ...useForm1A });

let Form2A = reactive(useForm2A)
let Form3A = reactive(useForm3A)

// Form B's
let Form1B = reactive(useForm1B)
let Form2B = reactive(useForm2B)
let Form3B = reactive(useForm3B)

// Form C's
let Form1C = reactive(useForm1C)
let Form2C = reactive(useForm2C)
let Form3C = reactive(useForm3C)




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



const selectedType = ref(null)
const isPreview = ref(false)
const previewUrl = ref('')
const for_and_in_the_absence = ref(false)
const unsavedDataMessage = ref(false)
const hasValue = computed(() => {
    return Object.values(Form1A).some(value => value !== '');
})

const fact_of = ref('')

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
        y: 280
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


watch(isPreview, () => {
    if (selectedType.value.includes('A')) {
        preference.authentication.y = 280
        preference.logo.right_y = 797.75
        preference.logo.left_y = 797.75
    } else {
        if (selectedType.value.includes('B')) {
            preference.body_data.y = 500
            preference.concern.y = 200
        } else if (selectedType.value.includes('C')) {
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
        remarksNotDelta.value = editor.getText()
    });
}

// Hooks for Updates
const formID = ref(null)
const isUpdateHook = ref(false)




const saveForm = async () => {
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
            ...(form_type.endsWith('A') ? available : {}),
            ...(form_type.endsWith('C') ? destroyed : {}),
            ...formAvailableMapping[form_type],
        });

        available.remarks = ''
        available.remarks = remarksNotDelta.value


        const formData = reactive({
            ...transactions,
            ...(form_type.endsWith('A') ? available : {}),
            ...formAvailableMapping[form_type],
        });

        if (formID.value !== null && isUpdateHook.value) {
            await formsStore.edit_form1a(formID.value, formData)
        }
        else {
            const formFunctions = {
                "1A": formsStore.add_form1a,
                "1B": formsStore.add_form1b,
                "1C": formsStore.add_form1c,

                "2A": formsStore.add_form2a,
                "2B": formsStore.add_form2b,
                "2C": formsStore.add_form2c,

                "3A": formsStore.add_form3a,
                "3B": formsStore.add_form3b,
                "3C": formsStore.add_form3c,
            };
            // Save it to databse
            const add = formFunctions[selectedType.value] ? formFunctions[selectedType.value](formData) : "";
            if (add.status) {
                formID.value = add.id
                isUpdateHook.value = true
            }
        }

        // Save PDF locally 
        // const save = await window.FormApi.SaveFormPDF(JSON.stringify(main_data));

        closeModal()
        toast.fire({
            icon: 'success',
            title: `Form ${form_type} has been successfully added.`,
            duration: 5000,
        })
    } else {
        console.log('Invalid form type selected');
    }
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

const is_remarks_check = ref(false)


onMounted(() => {
    formsStore.get_all_form1a()
});


const available_forms = ref(['Form 1A', 'Form 2A', 'Form 3A'])
const no_record_forms = ref(['Form 1B', 'Form 2B', 'Form 3B'])
const destroyed_forms = ref(['Form 1C', 'Form 2C', 'Form 3C'])

const selectedForm = ref(null)
const selectedFormData = ref(null)
const formsStore = useForms()

const fetchFormData = async (item) => {
    let fetchAction

    switch (item) {
        case 'Birth Available':
            fetchAction = formsStore.get_all_form1a
            break
        case 'Birth Not Available':
            fetchAction = formsStore.get_all_form2a
            break
        case 'Birth Destroyed':
            fetchAction = formsStore.get_all_form3a
            break
        case 'Death Available':
            fetchAction = formsStore.get_all_form1b
            break
        case 'Death Not Available':
            fetchAction = formsStore.get_all_form2b
            break
        case 'Death Destroyed':
            fetchAction = formsStore.get_all_form3b
            break
        case 'Marriage Available':
            fetchAction = formsStore.get_all_form1c
            break
        case 'Marriage Not Available':
            fetchAction = formsStore.get_all_form2c
            break
        default:
            console.log('Unknown form type:', item)
            return
    }

    try {
        const data = await fetchAction()

    } catch (error) {
        console.log(' fetching data:', error)
    }
}





const Modal = defineAsyncComponent(() =>
    import("../../components/client/modal/Modal.vue")
)
const options = ref(
    [
        'Form 1 (Birth)',
        'Form 2 (Death)',
        'Form 3 (Marriage)'
    ]
)



const FormTypes = ref([])
const isFormOpen = ref(false)

const transcription_register_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'Births' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'Deaths' :
            selected === "3A" || selected === "3B" || selected === "3C" ? 'Marriages' : ''
})
const records_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'births' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'deaths' :
            selected === "3A" || selected === "3B" || selected === "3C" ? 'marriages' : ''
})
const register_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'Live Birth' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'Death' : selected === "3A" || selected === "3B" || selected === "3C" ? 'Marriage' : ''
})
const alleged_to = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'born' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'died' : selected === "3A" || selected === "3B" || selected === "3C" ? 'married' : ''
})




const initialFormData = {

    is_with_authentication: '', // Is Abroad??

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
    Object.assign(preference, initialPref);

    formID.value = null
    isUpdateHook.value = false
}


const OpenForms = (e) => {
    e === 'Form 1 (Birth)' ? [FormTypes.value = ['1A', '1B', '1C'], selectedType.value = "1A", formData.form_type = "1A"] : e === 'Form 2 (Death)' ? [FormTypes.value = ['2A', '2B', '2C'], selectedType.value = "2A", formData.form_type = "2A"] : e === 'Form 3 (Marriage)' ? [FormTypes.value = ['3A', '3B', '3C'], selectedType.value = "3A", formData.form_type = "3A"] : null
    isFormOpen.value = true
    selectedForm.value = e

}
const closeModal = () => {
    isFormOpen.value = false
    resetFormData()
    isPreview.value = false

}
const toggleForm = (val) => {
    resetFormData()
    selectedType.value = val
    formData.form_type = val
    nodateforparentsmarriage.value = false

}




const nodateforparentsmarriage = ref(false)


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
    available.remarks = data.remarks

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
const handleViewLocal = (data) => {
    isViewLocalOpen.value = true
}
const handleRemove = async (id) => {
    try {
        await formsStore.delete_form1a(id)
    } catch (error) {
        console.log('Error removing record:', error)
    }
}
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
const handleCopy = async (data) => {
    EditMap(data)

    transactions.date_filed = format(new Date(), "MMMM dd, yyyy"),
        transactions.or_number = '',
        transactions.date_paid = format(new Date(), "MMMM dd, yyyy"),

        // Optional Value per event
        transactions.for_and_in_the_absence = false
    transactions.absence_verified_by = ''
    transactions.absence_verifier_position = ''
    isFormOpen.value = true
    selectedForm.value = 'Form 1A'
    selectedType.value = "1A"
    formData.form_type = '1A'
    isPreview.value = false
}



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
        { field: "name_child", headerName: "Child Name", flex: 1, pinned: 'left', filter: true },
        // { field: "sex", headerName: "Sex" },
        { field: "date_birth", headerName: "Date of Birth" },
        { field: "place_birth", headerName: "Place of Birth" },
        // { field: "name_mother", headerName: "Mother's Name" },
        // { field: "name_father", headerName: "Father's Name" },
        // { field: "date_marriage_parents", headerName: "Parents' Marriage Date" },
        { field: "registry_number", headerName: "Registry Number" },
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
        { field: "no_record_birth_of", headerName: "No Record Birth Of", flex: 1, pinned: 'left' },
        { field: "born_on", headerName: "Born On" },
        // { field: "mother_name", headerName: "Mother's Name" },
        // { field: "father_name", headerName: "Father's Name" },
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