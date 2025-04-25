<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="APPLICATION FOR MARRIAGE LICENSE">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <Button label="Create New Application" isActive :class="`rounded`" @click="open_model" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>

        <div class="h-[calc(100vh-200px)]">
            <TableGrid :data="apl.application_marriage_license" :dataColumns="colDefs" :suppressRowTransform="true" />
        </div>

        <transition name="fade-scale">
            <div v-if="modal"
                class="fixed top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-50 p-4"
                tabindex="-1">
                <div
                    class="w-full max-w-[1200px] h-[45rem] flex flex-col bg-white rounded-sm p-2 relative overflow-hidden">
                    <button @click="close_modal"
                        class="absolute right-0 top-0 rounded-bl-full w-10 h-10  bg-red-400 hover:bg-red-500 flex items-center justify-end px-2 text-white"><font-awesome-icon
                            icon="fa-solid fa-xmark" />
                    </button>
                    <div class="flex items-center justify-center mb-5  flex-col gap-0">
                        <h2 class="font-bold text-lg uppercase text-gray-800 leading-tight">Application for Marriage
                            License
                        </h2>
                        <h2 class="font-semibold text-xs  text-gray-800 ">Municipal Form No. 90 (Form No. 2)</h2>
                    </div>


                    <div class="flex flex-row gap-0 mb-4 px-2" v-if="form_mode === 0">
                        <div class="flex flex-col gap-0">
                            <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[currentStep] }}</p>
                            <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                steps[currentStep]
                                }}
                            </p>
                        </div>
                        <div class="flex flex-row gap-1 ml-auto">
                            <button
                                class="bg-green-300 text-xs w-8 h-8 px-2 font-medium  rounded-full text-white   py-1.5"
                                v-for="(step, index) in steps" :key="index" @click="currentStep = index"
                                :class="[currentStep >= index ? 'bg-green-500' : '']">
                                {{ index + 1 }}
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto py-2 h-full gap-6 flex flex-col ">
                        <div v-if="currentStep === 0 || form_mode === 1"
                            class="flex flex-col px-10  gap-2 justify-center">
                            <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[0] }}</p>
                                <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                    steps[0]
                                    }}
                                </p>
                            </div>
                            <div class="grid grid-cols-1 gap-2 mb-auto">

                                <div class="grid grid-cols-3 gap-2">
                                    <InputMarriage type="date" label="Date of Application/Reciept"
                                        v-model="formData.date_of_receipt" />
                                    <InputMarriage type="date" label="Date of Marriage"
                                        v-model="formData.date_of_marriage" />
                                    <InputMarriage type="date" label="Date of Issuance of Marriage License"
                                        v-model="formData.date_issuance_marriage_license" />
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                    <InputMarriage label="Marriage License No"
                                        v-model="formData.marriage_license_number" />
                                    <InputMarriage label="Registry Number" v-model="formData.registry_number" />
                                    <InputMarriage label="Place of Marriage" v-model="formData.place_of_marriage" />
                                </div>
                            </div>

                        </div>
                        <div v-if="currentStep === 1 || form_mode === 1" class="flex flex-col px-10 justify-center  ">
                            <div class="grid grid-cols-1 gap-2">

                                <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                    <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[1] }}</p>
                                    <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                        steps[1]
                                        }}
                                    </p>
                                </div>

                                <div class="grid grid-cols-3 gap-1 items-end">
                                    <InputMarriage cap label="Full Name" holder="First Name"
                                        v-model="formData.groom_first_name" :error="v$.groom_first_name.$error" />
                                    <InputMarriage cap holder="Middle Name" v-model="formData.groom_middle_name" />
                                    <InputMarriage cap holder="Last Name" v-model="formData.groom_last_name"
                                        :error="v$.groom_last_name.$error" />
                                </div>

                                <div class="flex flex-row items-center gap-2">

                                    <div class="w-full">
                                        <InputMarriage type="date" label="Date of Birth" holder="MMMM/DD/YYYY"
                                            v-model="formData.groom_date_birth" :error="v$.groom_date_birth.$error" />


                                    </div>
                                    <div class="w-[70%]">
                                        <InputMarriage label="Age" readonly skip v-model="formData.groom_age"
                                            :error="v$.groom_age.$error" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-1 items-end">
                                    <InputMarriageSuggestion cap label="Place of Birth" holder="City/Municipality"
                                        v-model="formData.groom_municipality" :error="v$.groom_municipality.$error"
                                        :suggestion_data="municipality_with_province" />
                                    <InputMarriageSuggestion skip cap holder="Province"
                                        v-model="formData.groom_province" :suggestion_data="province"
                                        :error="v$.groom_province.$error" />
                                    <InputMarriage cap holder="Country" skip v-model="formData.groom_country"
                                        :error="v$.groom_country.$error" />
                                </div>
                                <div class="flex flex-row gap-1 items-end">
                                    <div class="w-full">
                                        <ResidenceSuggestions cap label="Residence"
                                            holder="(House No., St., Barangay, City/Municipality, Province)"
                                            v-model="formData.groom_residence" :suggestion_data="groomSuggestions"
                                            :error="v$.groom_residence.$error" />

                                    </div>
                                    <div class="w-[50%]">
                                        <InputMarriage cap holder="Country" v-model="formData.groom_residence_country"
                                            :error="v$.groom_residence_country.$error" />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">

                                    <div class="w-full">
                                        <!-- <InputMarriage cap label="Sex" v-model="formData.groom_sex" /> -->
                                        <InputMarriageSuggestion cap label="Sex" v-model="formData.groom_sex"
                                            :suggestion_data="['MALE', 'FEMALE']" :error="v$.groom_sex.$error" />

                                    </div>
                                    <div class="w-full">
                                        <InputMarriageSuggestion cap label="Citizenship"
                                            v-model="formData.groom_citizenship" :suggestion_data="citizenshipOptions"
                                            :error="v$.groom_citizenship.$error" />

                                    </div>
                                    <div class="w-[70%]">
                                        <InputMarriageSuggestion cap label="Civil Status"
                                            v-model="formData.groom_civil_status" :suggestion_data="civil_status_type"
                                            :error="v$.groom_civil_status.$error" />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2"
                                    v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                                    <InputMarriage cap label="IF PREVIOUSLY MARRIED: How was it dissolved?"
                                        v-model="formData.groom_previously_married_dissolved" />
                                    <div class="w-[70%]">
                                        <InputMarriage cap type="date" label="Date when dissolved" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-2 items-end"
                                    v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                                    <InputMarriage cap label="Place where dissolved" holder="City/Municipality"
                                        v-model="formData.groom_place_dissolved_municipality" />
                                    <InputMarriage cap holder="Province"
                                        v-model="formData.groom_place_dissolved_province" />
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.groom_place_dissolved_country" />

                                </div>



                                <div class="grid grid-cols-2 gap-2">
                                    <InputMarriageSuggestion cap label="Religion" v-model="formData.groom_religion"
                                        :suggestion_data="religionOptions" :error="v$.groom_religion.$error" />
                                    <InputMarriage cap label="Degree of relationship of contradicting parties"
                                        v-model="formData.groom_degree_relation"
                                        :error="v$.groom_degree_relation.$error" />


                                </div>

                            </div>
                        </div>
                        <div v-if="currentStep === 2 || form_mode === 1"
                            class="flex flex-col gap-2 px-10 justify-center">


                            <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[2] }}</p>
                                <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                    steps[2]
                                    }}
                                </p>
                            </div>
                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Name of Father" holder="First Name"
                                    v-model="formData.groom_father_first_name"
                                    :error="v$.groom_father_first_name.$error" />
                                <InputMarriage cap holder="Middle Name" v-model="formData.groom_father_middle_name" />
                                <InputMarriageSuggestion cap holder="Last Name"
                                    v-model="formData.groom_father_last_name" :error="v$.groom_father_last_name.$error"
                                    :suggestion_data="[formData.groom_last_name]" />
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.groom_father_citizenship"
                                        :error="v$.groom_father_citizenship.$error"
                                        :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province)"
                                        v-model="formData.groom_father_residence"
                                        :error="v$.groom_father_residence.$error"
                                        :suggestion_data="groomfatherSuggestions" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.groom_father_residence_country"
                                        :error="v$.groom_father_residence_country.$error" />
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Maiden Name of Mother" holder="First Name"
                                    v-model="formData.groom_mother_first_name"
                                    :error="v$.groom_mother_first_name.$error" />
                                <InputMarriage cap holder="Middle Name" v-model="formData.groom_mother_middle_name" />
                                <InputMarriageSuggestion cap holder="Last Name"
                                    v-model="formData.groom_mother_last_name" :error="v$.groom_mother_last_name.$error"
                                    :suggestion_data="[formData.groom_middle_name]" />
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.groom_mother_citizenship"
                                        :error="v$.groom_mother_citizenship.$error"
                                        :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province)"
                                        v-model="formData.groom_mother_residence"
                                        :error="v$.groom_mother_residence.$error"
                                        :suggestion_data="groommotherSuggestions" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.groom_mother_residence_country"
                                        :error="v$.groom_mother_residence_country.$error" />
                                </div>
                            </div>

                            <div class="flex flex-row gap-1">
                                <div class="w-full">
                                    <InputMarriageSuggestion cap label="Person who gave consent or advince"
                                        v-model="formData.groom_person_who_gave_consent"
                                        :error="v$.groom_person_who_gave_consent.$error" :skip="skip_groom_consent"
                                        :suggestion_data="person_gave_consent_groom_suggestion" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Relationship"
                                        v-model="formData.groom_person_who_gave_consent_relation"
                                        :error="v$.groom_person_who_gave_consent_relation.$error"
                                        :skip="skip_groom_consent" :suggestion_data="consent_advised_relationship" />
                                </div>
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.groom_person_who_gave_consent_citizenship"
                                        :skip="skip_groom_consent"
                                        :error="v$.groom_person_who_gave_consent_citizenship.$error"
                                        :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                                        v-model="formData.groom_person_who_gave_consent_residence"
                                        :skip="skip_groom_consent"
                                        :error="v$.groom_person_who_gave_consent_residence.$error"
                                        :suggestion_data="groomconsentSuggestions" />
                                </div>

                            </div>

                        </div>

                        <!-- Bride Details -->

                        <div v-if="currentStep === 3 || form_mode === 1" class="flex flex-col px-10 justify-center">


                            <div class="grid grid-cols-1 gap-2">

                                <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                    <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[3] }}</p>
                                    <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                        steps[3]
                                        }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-3 gap-1 items-end">
                                    <InputMarriage cap label="Full Name" holder="First Name"
                                        v-model="formData.bride_first_name" :error="v$.bride_first_name.$error" />
                                    <InputMarriage cap holder="Middle Name" v-model="formData.bride_middle_name" />
                                    <InputMarriage cap holder="Last Name" v-model="formData.bride_last_name"
                                        :error="v$.bride_last_name.$error" />
                                </div>

                                <div class="flex flex-row items-center gap-2">

                                    <div class="w-full">
                                        <InputMarriage type="date" label="Date of Birth" holder="MMMM/DD/YYYY"
                                            v-model="formData.bride_date_birth" :error="v$.bride_date_birth.$error" />


                                    </div>
                                    <div class="w-[70%]">
                                        <InputMarriage label="Age" readonly skip v-model="formData.bride_age"
                                            :error="v$.bride_age.$error" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-1 items-end">
                                    <InputMarriageSuggestion cap label="Place of Birth" holder="City/Municipality"
                                        v-model="formData.bride_municipality" :error="v$.bride_municipality.$error"
                                        :suggestion_data="municipality_with_province" />
                                    <InputMarriageSuggestion cap holder="Province" skip
                                        v-model="formData.bride_province" :suggestion_data="province"
                                        :error="v$.bride_province.$error" />
                                    <InputMarriage cap holder="Country" skip v-model="formData.bride_country"
                                        :error="v$.bride_country.$error" />
                                </div>
                                <div class="flex flex-row gap-1 items-end">
                                    <div class="w-full">
                                        <ResidenceSuggestions cap label="Residence"
                                            holder="(House No., St., Barangay, City/Municipality, Province)"
                                            v-model="formData.bride_residence" :suggestion_data="brideSuggestions"
                                            :error="v$.bride_residence.$error" />

                                    </div>
                                    <div class="w-[50%]">
                                        <InputMarriage cap holder="Country" skip
                                            v-model="formData.bride_residence_country"
                                            :error="v$.bride_residence_country.$error" />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2">

                                    <div class="w-full">
                                        <!-- <InputMarriage cap label="Sex" v-model="formData.bride_sex" /> -->
                                        <InputMarriageSuggestion cap label="Sex" v-model="formData.bride_sex"
                                            :suggestion_data="['MALE', 'FEMALE']" :error="v$.bride_sex.$error" />

                                    </div>
                                    <div class="w-full">
                                        <InputMarriageSuggestion cap label="Citizenship"
                                            v-model="formData.bride_citizenship" :suggestion_data="citizenshipOptions"
                                            :error="v$.bride_citizenship.$error" />

                                    </div>
                                    <div class="w-[70%]">
                                        <InputMarriageSuggestion cap label="Civil Status"
                                            v-model="formData.bride_civil_status" :suggestion_data="civil_status_type"
                                            :error="v$.bride_civil_status.$error" />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-2"
                                    v-if="formData.bride_civil_status !== 'SINGLE' && formData.bride_civil_status !== ''">
                                    <InputMarriage cap label="IF PREVIOUSLY MARRIED: How was it dissolved?"
                                        v-model="formData.bride_previously_married_dissolved" />
                                    <div class="w-[70%]">
                                        <InputMarriage cap type="date" label="Date when dissolved" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-2 items-end"
                                    v-if="formData.bride_civil_status !== 'SINGLE' && formData.bride_civil_status !== ''">
                                    <InputMarriage cap label="Place where dissolved" holder="City/Municipality"
                                        v-model="formData.bride_place_dissolved_municipality" />
                                    <InputMarriage cap holder="Province"
                                        v-model="formData.bride_place_dissolved_province" />
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.bride_place_dissolved_country" />

                                </div>



                                <div class="grid grid-cols-2 gap-2">
                                    <InputMarriageSuggestion cap label="Religion" v-model="formData.bride_religion"
                                        :suggestion_data="religionOptions" :error="v$.bride_religion.$error" />
                                    <InputMarriage cap label="Degree of relationship of contradicting parties"
                                        v-model="formData.bride_degree_relation"
                                        :error="v$.bride_degree_relation.$error" />


                                </div>

                            </div>
                        </div>
                        <div v-if="currentStep === 4 || form_mode === 1"
                            class="flex flex-col gap-2 px-10 justify-center">

                            <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[4] }}</p>
                                <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                    steps[4]
                                    }}
                                </p>
                            </div>

                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Name of Father" holder="First Name"
                                    v-model="formData.bride_father_first_name"
                                    :error="v$.bride_father_first_name.$error" />
                                <InputMarriage cap holder="Middle Name" v-model="formData.bride_father_middle_name" />
                                <InputMarriageSuggestion cap holder="Last Name"
                                    v-model="formData.bride_father_last_name" :error="v$.bride_father_last_name.$error"
                                    :suggestion_data="[formData.bride_last_name]" />
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.bride_father_citizenship"
                                        :error="v$.bride_father_citizenship.$error"
                                        :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province)"
                                        v-model="formData.bride_father_residence"
                                        :error="v$.bride_father_residence.$error"
                                        :suggestion_data="bridefatherSuggestions" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.bride_father_residence_country"
                                        :error="v$.bride_father_residence_country.$error" />
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Maiden Name of Mother" holder="First Name"
                                    v-model="formData.bride_mother_first_name"
                                    :error="v$.bride_mother_first_name.$error" />
                                <InputMarriage cap holder="Middle Name" v-model="formData.bride_mother_middle_name" />
                                <InputMarriageSuggestion cap holder="Last Name"
                                    v-model="formData.bride_mother_last_name" :error="v$.bride_mother_last_name.$error"
                                    :suggestion_data="[formData.bride_middle_name]" />
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.bride_mother_citizenship"
                                        :error="v$.bride_mother_citizenship.$error"
                                        :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province)"
                                        v-model="formData.bride_mother_residence"
                                        :error="v$.bride_mother_residence.$error"
                                        :suggestion_data="bridemotherSuggestions" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.bride_mother_residence_country"
                                        :error="v$.bride_mother_residence_country.$error" />
                                </div>
                            </div>

                            <div class="flex flex-row gap-1">
                                <div class="w-full">
                                    <InputMarriageSuggestion cap label="Person who gave consent or advince"
                                        v-model="formData.bride_person_who_gave_consent"
                                        :error="v$.bride_person_who_gave_consent.$error" :skip="skip_bride_consent"
                                        :suggestion_data="person_gave_consent_bride_suggestion" />
                                </div>
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Relationship"
                                        v-model="formData.bride_person_who_gave_consent_relation"
                                        :error="v$.bride_person_who_gave_consent_relation.$error"
                                        :skip="skip_bride_consent" :suggestion_data="consent_advised_relationship" />
                                </div>
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <div class="w-[50%]">
                                    <InputMarriageSuggestion cap label="Citizenship"
                                        v-model="formData.bride_person_who_gave_consent_citizenship"
                                        :error="v$.bride_person_who_gave_consent_citizenship.$error"
                                        :skip="skip_bride_consent" :suggestion_data="citizenshipOptions" />
                                </div>
                                <div class="w-full">
                                    <ResidenceSuggestions cap label="Residence"
                                        holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                                        v-model="formData.bride_person_who_gave_consent_residence"
                                        :error="v$.bride_person_who_gave_consent_residence.$error"
                                        :skip="skip_bride_consent" :suggestion_data="brideconsentSuggestions" />
                                </div>

                            </div>

                        </div>
                        <div v-if="currentStep === 5 || form_mode === 1"
                            class="flex flex-col gap-2 px-10 justify-center">

                            <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[5] }}</p>
                                <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{
                                    steps[5]
                                    }}
                                </p>
                            </div>

                            <div class="grid grid-cols-2 gap-2 mt-4">
                                <InputMarriage cap label="Groom Community Tax Cert. Number"
                                    v-model="formData.groom_ctc_number" :error="v$.groom_ctc_number.$error" />
                                <InputMarriage cap label="Bride Community Tax Cert. Number"
                                    v-model="formData.bride_ctc_number" :error="v$.bride_ctc_number.$error" />
                                <InputMarriage type="date" holder="Date" cap label="on" v-model="formData.groom_ctc_on"
                                    :error="v$.groom_ctc_on.$error" />
                                <InputMarriage type="date" holder="Date" cap label="on" v-model="formData.bride_ctc_on"
                                    :error="v$.bride_ctc_on.$error" />
                                <InputMarriage holder="Place" cap label="at" v-model="formData.groom_ctc_at"
                                    :error="v$.groom_ctc_at.$error" />
                                <InputMarriage holder="Place" cap label="at" v-model="formData.bride_ctc_at"
                                    :error="v$.bride_ctc_at.$error" />
                            </div>



                        </div>
                        <div v-if="currentStep === 6 || form_mode === 1"
                            class="flex flex-col gap-2 px-10 justify-center mt-10">

                            <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                <p class="font-bold text-lg uppercase  text-black leading-3">{{ steps[6]
                                    }}
                                </p>
                                <p class=" text-xs text-gray-400 text-semibold uppercase mt-2">Please provide {{
                                    steps[6]
                                    }} Details
                                </p>
                            </div>
                            <div class="w-80 mt-8">
                                <InputMarriage label="Date of Posting" type="date"
                                    v-model="formData.notice_date_posting" :error="v$.notice_date_posting.$error" />
                            </div>
                            <div class="grid grid-cols-2 gap-4 mt-4">
                                <!-- Groom -->
                                <div class="flex flex-col gap-2 justify-center  items-center">
                                    <div class=" h-[166px] w-[170px] ">
                                        <Camera @capture="handle_groom_image" v-if="!groom_picture" />
                                        <div v-if="groom_picture"
                                            class="h-full w-full flex hover:border-blue-600 border-2 hover:cursor-pointer relative group">
                                            <button @click="groom_picture = ''"
                                                class="absolute -top-3 -right-2.5 z-50 bg-red-400 hover:bg-red-500 text-white rounded-full px-1.5 hidden group-hover:block">
                                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                            </button>
                                            <img :src="groom_picture" alt="Captured photo"
                                                class="w-full h-full object-contain " />
                                        </div>

                                    </div>
                                    <p class="font-medium text-sm italic text-gray-600">Groom:</p>
                                    <div class="flex flex-col grow gap-0 w-full">
                                        <div class="flex flex-row gap-1 items-center">
                                            <InputMarriage holder="Name" v-model="formData.notice_groom_name"
                                                :error="v$.notice_groom_name.$error" />
                                            <div class="w-[50%]">
                                                <InputMarriage holder="Age" v-model="formData.notice_groom_age"
                                                    :error="v$.notice_groom_age.$error" />
                                            </div>
                                        </div>
                                        <InputMarriage holder="Birth Place" v-model="formData.notice_groom_birthplace"
                                            :error="v$.notice_groom_birthplace.$error" />
                                        <InputMarriage holder="Residence" v-model="formData.notice_groom_residence"
                                            :error="v$.notice_groom_residence.$error" />
                                        <InputMarriage holder="Father" v-model="formData.notice_groom_father"
                                            :error="v$.notice_groom_father.$error" />
                                        <InputMarriage holder="Mother" v-model="formData.notice_groom_mother"
                                            :error="v$.notice_groom_mother.$error" />

                                    </div>
                                </div>
                                <!-- Bride -->
                                <div class="flex flex-col gap-2 justify-center  items-center">
                                    <div class=" h-[166px] w-[170px] ">
                                        <Camera @capture="handle_bride_image" v-if="!bride_picture" />
                                        <div v-if="bride_picture"
                                            class="h-full w-full flex hover:border-blue-600 border-2 hover:cursor-pointer relative group">
                                            <button @click="bride_picture = ''"
                                                class="absolute -top-3 -right-2.5 z-50 bg-red-400 hover:bg-red-500 text-white rounded-full px-1.5 hidden group-hover:block">
                                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                            </button>
                                            <img :src="bride_picture" alt="Captured photo"
                                                class="w-full h-full object-contain " />
                                        </div>
                                    </div>
                                    <p class="font-medium text-sm italic text-gray-600">Bride:</p>
                                    <div class="flex flex-col grow gap-0 w-full">
                                        <div class="flex flex-row gap-1 items-center">
                                            <InputMarriage holder="Name" v-model="formData.notice_bride_name"
                                                :error="v$.notice_bride_name.$error" />
                                            <div class="w-[50%]">
                                                <InputMarriage holder="Age" v-model="formData.notice_bride_age"
                                                    :error="v$.notice_bride_age.$error" />
                                            </div>
                                        </div>
                                        <InputMarriage holder="Birth Place" v-model="formData.notice_bride_birthplace"
                                            :error="v$.notice_bride_birthplace.$error" />
                                        <InputMarriage holder="Residence" v-model="formData.notice_bride_residence"
                                            :error="v$.notice_bride_residence.$error" />
                                        <InputMarriage holder="Father" v-model="formData.notice_bride_father"
                                            :error="v$.notice_bride_father.$error" />
                                        <InputMarriage holder="Mother" v-model="formData.notice_bride_mother"
                                            :error="v$.notice_bride_mother.$error" />

                                    </div>
                                </div>
                            </div>

                            <p class="italic mt-4 text-sm font-medium text-green-500">Copy Furnished:</p>
                            <div class="w-[40%] pl-4 flex flex-col gap-0">
                                <InputMarriage v-model="formData.notice_copy_furnished1" />
                                <InputMarriage v-model="formData.notice_copy_furnished2" />
                                <InputMarriage v-model="formData.notice_copy_furnished3" />
                                <InputMarriage v-model="formData.notice_copy_furnished4" />
                            </div>

                        </div>

                        <div v-if="currentStep === 7 || form_mode === 1"
                            class="px-4 h-full gap-2 flex flex-col pt-8 mb-2">
                            <div class="flex flex-col gap-1 ">
                                <div class="flex flex-col gap-0" v-if="form_mode === 1">
                                    <p class="font-bold text-lg uppercase  text-red-500 leading-3">{{ steps[7] }}</p>
                                    <p class=" text-xs text-gray-400 text-semibold uppercase">Please preview the
                                        document
                                        first before saving it to database
                                    </p>
                                </div>
                                <div class="flex flex-row gap-2 mt-2 items-center">
                                    <button @click="preview_document"
                                        class="bg-blue-100 hover:bg-blue-50 transition-colors duration-200 py-0.5 h-8 border border-blue-300 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2.5">
                                        <font-awesome-icon icon="fa-solid fa-file" /> Generate Preview
                                    </button>



                                    <button @click="printAFML()" title="Print Application for Marriage License"
                                        class="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 py-0.5 h-8 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2.5">
                                        <font-awesome-icon icon="fa-solid fa-print" /> Print AFML
                                    </button>
                                    <button @click="printNoticePosting()" title="Print Notice of Posting"
                                        class="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 py-0.5 h-8 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2.5">
                                        <font-awesome-icon icon="fa-solid fa-print" /> Print Notice of Posting
                                    </button>
                                    <div class="ml-auto">
                                        <div class="ml-auto">
                                            <select name="" id="" @change="change_page()" v-model="select_page"
                                                class="bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 cursor-pointer py-1 px-3 shadow-sm">

                                                <option :value="1" class="hover:bg-gray-100" selected>Application for
                                                    Marriage
                                                    License</option>
                                                <option :value="2" class="hover:bg-gray-100">Notice of Posting</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class=" bg-gray-50 h-[33rem] border border-gray-300 shadow-inner items-center flex justify-center">
                                    <!-- <p v-if="!pdf_content && isLoadingPrev === false" class="italic">Click Generate Preview</p> -->
                                    <p v-if="isLoadingPrev" class="italic">Loading...</p>
                                    <PDFViewerWorker :pdfBytes64="pdf_content" v-if="pdf_content" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="mt-auto flex flex-row gap-2 items-center justify-center py-0.5 ">

                        <div class="flex flex-row gap-2 ml-auto">
                            <!-- <button @click="currentStep--" v-if="currentStep !== 0 && form_mode === 0" tabindex="-1"
                            class="bg-blue-500 focus:bg-blue-600 hover:bg-blue-600 text-white py-1 w-20  rounded">Back</button>
                        <button @click="currentStep++" v-if="currentStep + 1 < steps.length && form_mode === 0"
                            class="bg-blue-600 focus:bg-blue-700 hover:bg-blue-700 font-medium text-white py-1.5 w-24  rounded">Next</button> -->
                            <button @click="submit()" v-if="currentStep + 1 === steps.length || form_mode === 1"
                                class="bg-green-500 hover:bg-green-600 text-white py-1.5 w-24  rounded">Save</button>

                        </div>
                    </div>

                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref, watch } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Header from '../../components/essentials/header.vue';
import Camera from '../../components/Camera.vue';
import { onClickOutside } from '@vueuse/core'
import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import TableGrid from '../../components/TableGrid.vue';
import { useApplicationMarriageLicense } from '../../stores/APL';
import ActionBtn from '../../components/Marriage/ActionBtn.vue';
import { AuthStore } from "../../stores/Authentication.js";
import { complete_province, municipalityProvinceAddress } from '../../utils/Address/index.js';
import InputMarriage from '../../components/Marriage/InputMarriage.vue';
import InputMarriageSuggestion from '../../components/Marriage/InputMarriageSuggestion.vue';
import { citizenshipOptions } from '../../utils/nationality.js'
import { religionOptions } from '../../utils/religion.js';
import { calculateAge, capitalizeName, CivilStatus, formatFullName, formatResidence, MarriageSteps } from '../../lib/marriage/index.js';
import useVuelidate from '@vuelidate/core';
import { MarriageRules } from '../../lib/marriage/rules.js';

import { useToast } from '../../lib/useToast.js';
import ResidenceSuggestions from '../../components/Marriage/ResidenceSuggestions.vue'
import { useBrideResidenceSuggestions, useGroomResidenceSuggestions } from '../../composables/marriage/useResidenceSuggestions.js';
import { useMarriageWatcher } from '../../composables/marriage/useMarriageWatcher';

const toast = useToast()
const province = ref(complete_province())
/**
 * Authentication
 * @IMPORTANT
 */

const currentStep = ref(0)

/**
 * Marriage Step Process
 */
const steps = MarriageSteps

const auth = AuthStore()

/**
 * Mode of Form
 * @mode_of_form
 * 
 */

const form_mode = ref(1)
const change_form_mode = () => {
    if (form_mode.value === 0) {
        form_mode.value = 1
    }
    else {
        form_mode.value = 0
    }
}

/**
 * @CIVIL_STATUS
 */
const civil_status_type = CivilStatus

/**
 * Print Options
 */

const printDialogBox = ref(false)
const openPrint = () => {
    printDialogBox.value = !printDialogBox.value
}


const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 13 : 8
})

const select_page = ref(1)
const change_page = () => {
    page.value = select_page.value
    preview_document()
}


const adjustment_div = ref(null)
onClickOutside(adjustment_div, event => adjustment_setting.value = false)
const preview = ref(false)
const pdf_content = ref(null)

const pdf_settings = reactive({
    x: 0,
    y: 0,
})


const apl = useApplicationMarriageLicense()

onMounted(() => {
    auth.isAuthenticated()
    apl.getApplicationMarriageLicense()
});

/**
 * Main Modal
 * @important
 */
const modal = ref(false);

const open_model = () => {
    modal.value = true;
};



const initialForm = {
    header_province: 'PANGASINAN',
    header_municipality: 'BAYAMBANG',
    registry_number: '',
    received_by: 'ISMAEL D. MALICDEM, JR.',
    date_of_marriage: '', //ADD
    date_of_receipt: new Date().toISOString().split('T')[0],

    marriage_license_number: '',
    date_issuance_marriage_license: '',
    groom_contract_marriage_with: '',
    bride_contract_marriage_with: '',

    place_of_marriage: '', // ADD
    // date_of_application: '', // ADD

    civil_registrar: 'ISMAEL D. MALICDEM, JR.',

    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',

    groom_date_birth: '', // ADD

    groom_age: '',

    groom_municipality: '',
    groom_province: '',
    groom_country: '',

    groom_sex: 'MALE',
    groom_citizenship: '',
    groom_residence: '',
    groom_residence_country: '', // 
    groom_religion: '',
    groom_civil_status: 'SINGLE',

    groom_degree_relation: 'NOT RELATED',

    groom_father_first_name: '',
    groom_father_middle_name: '',
    groom_father_last_name: '',
    groom_father_citizenship: '',
    groom_father_residence: '',
    groom_father_residence_country: '',

    groom_mother_first_name: '',
    groom_mother_middle_name: '',
    groom_mother_last_name: '',
    groom_mother_citizenship: '',
    groom_mother_residence: '',
    groom_mother_residence_country: '',
    groom_person_who_gave_consent: '',
    groom_person_who_gave_consent_relation: '',
    groom_person_who_gave_consent_citizenship: '',
    groom_person_who_gave_consent_residence: '',


    groom_ss_day: '',
    groom_ss_month: '',
    groom_ss_year: '',
    groom_ss_at: 'BAYAMBANG, PANGASINAN',
    groom_ctc_number: '',
    groom_ctc_on: '',
    groom_ctc_at: '',


    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',

    bride_date_birth: '', // ADD

    bride_age: '',
    bride_municipality: '',
    bride_province: '',
    bride_country: '',
    bride_sex: 'FEMALE',
    bride_citizenship: '',
    bride_residence: '',
    bride_residence_country: '', //
    bride_religion: '',
    bride_civil_status: 'SINGLE',



    bride_degree_relation: 'NOT RELATED',
    bride_father_first_name: '',
    bride_father_middle_name: '',
    bride_father_last_name: '',
    bride_father_citizenship: '',
    bride_father_residence: '', //
    bride_father_residence_country: '',//
    bride_mother_first_name: '',
    bride_mother_middle_name: '',
    bride_mother_last_name: '',
    bride_mother_citizenship: '',
    bride_mother_residence: '', //
    bride_mother_residence_country: '',//
    bride_person_who_gave_consent: '',
    bride_person_who_gave_consent_relation: '',
    bride_person_who_gave_consent_citizenship: '',
    bride_person_who_gave_consent_residence: '', //


    bride_ss_day: '',
    bride_ss_month: '',
    bride_ss_year: '',
    bride_ss_at: 'BAYAMBANG, PANGASINAN',
    bride_ctc_number: '',
    bride_ctc_on: '',
    bride_ctc_at: '',



    /**
     *  Notice Input Fields
     */


    notice_province: 'PANGASINAN',
    notice_municipality: 'BAYAMBANG',
    notice_office: 'LOCAL CIVIL REGISTRY OFFICE',

    notice_groom_name: '',
    notice_bride_name: '',

    notice_groom_age: '',
    notice_groom_birthplace: '',
    notice_groom_residence: '',
    notice_groom_father: '',
    notice_groom_mother: '',

    notice_bride_age: '',
    notice_bride_birthplace: '',
    notice_bride_residence: '',
    notice_bride_father: '',
    notice_bride_mother: '',

    notice_date_posting: '',
    notice_position: '',
    notice_copy_furnished1: '',
    notice_copy_furnished2: '',
    notice_copy_furnished3: '',
    notice_copy_furnished4: '',


    //  FOR DISSOLVED N/A

    groom_place_dissolved: '',
    groom_date_dissolved: '',

    bride_place_dissolved: '',
    bride_date_dissolved: '',

    //  FOR DISSOLVED WITH VALUE

    groom_previously_married_dissolved: '',
    bride_previously_married_dissolved: '',

    groom_place_dissolved_municipality: '',
    groom_place_dissolved_province: '',
    groom_place_dissolved_country: '',

    groom_date_dissolved_day: '',
    groom_date_dissolved_month: '',
    groom_date_dissolved_year: '',

    bride_place_dissolved_municipality: '',
    bride_place_dissolved_province: '',
    bride_place_dissolved_country: '',

    bride_date_dissolved_day: '',
    bride_date_dissolved_month: '',
    bride_date_dissolved_year: '',

}

const formData = reactive({ ...initialForm })


const v$ = useVuelidate(MarriageRules, formData);

const add_details_to_notice = () => {
    const formatPerson = (firstName, middleName, lastName) => formatFullName(firstName, middleName, lastName);

    formData.notice_groom_name = formatPerson(formData.groom_first_name, formData.groom_middle_name, formData.groom_last_name);
    formData.notice_bride_name = formatPerson(formData.bride_first_name, formData.bride_middle_name, formData.bride_last_name);

    formData.notice_groom_age = `${formData.groom_age} yrs. old`;
    formData.notice_groom_birthplace = `${capitalizeName(formData.groom_municipality)}, ${capitalizeName(formData.groom_province)}`;
    formData.notice_groom_residence = formatResidence(formData.groom_residence);
    formData.notice_groom_father = formatPerson(formData.groom_father_first_name, formData.groom_father_middle_name, formData.groom_father_last_name);
    formData.notice_groom_mother = formatPerson(formData.groom_mother_first_name, formData.groom_mother_middle_name, formData.groom_mother_last_name);

    formData.notice_bride_age = `${formData.bride_age} yrs. old`;
    formData.notice_bride_birthplace = `${capitalizeName(formData.bride_municipality)}, ${capitalizeName(formData.bride_province)}`;
    formData.notice_bride_residence = formatResidence(formData.bride_residence);
    formData.notice_bride_father = formatPerson(formData.bride_father_first_name, formData.bride_father_middle_name, formData.bride_father_last_name);
    formData.notice_bride_mother = formatPerson(formData.bride_mother_first_name, formData.bride_mother_middle_name, formData.bride_mother_last_name);
};

const consent_advised_relationship = [
    'PARENTS',
    'MOTHER',
    'FATHER',
    'N/A',
]

const person_gave_consent_groom_suggestion = computed(() => [
    `${formData.groom_mother_first_name} ${formData.groom_mother_last_name} ${formData.groom_father_last_name} and ${formData.groom_father_first_name} ${formData.groom_father_middle_name} ${formData.groom_father_last_name}`,
    `${formData.groom_mother_first_name} ${formData.groom_mother_last_name} ${formData.groom_father_last_name}`,
    `${formData.groom_father_first_name} ${formData.groom_father_middle_name} ${formData.groom_father_last_name}`,
])
const person_gave_consent_bride_suggestion = computed(() => [
    `${formData.bride_mother_first_name} ${formData.bride_mother_last_name} ${formData.bride_father_last_name} and ${formData.bride_father_first_name} ${formData.bride_father_middle_name} ${formData.bride_father_last_name}`,
    `${formData.bride_father_first_name} ${formData.bride_father_middle_name} ${formData.bride_father_last_name}`,
    `${formData.bride_mother_first_name} ${formData.bride_mother_last_name} ${formData.bride_father_last_name}`,

])



watch(() => formData.groom_date_birth, (val) => {
    formData.groom_age = calculateAge(val) || ''
})
const skip_groom_consent = ref(false)
watch(() => formData.groom_age, (val) => {
    if (!val) return;

    console.log(val > 25)
    if (val > 25) {
        formData.groom_person_who_gave_consent = "N/A"
        formData.groom_person_who_gave_consent_relation = "N/A"
        formData.groom_person_who_gave_consent_citizenship = "N/A"
        formData.groom_person_who_gave_consent_residence = "N/A"
        skip_groom_consent.value = true
    }
    else {
        formData.groom_person_who_gave_consent = ''
        formData.groom_person_who_gave_consent_relation = ''
        formData.groom_person_who_gave_consent_citizenship = ''
        formData.groom_person_who_gave_consent_residence = ''
        skip_groom_consent.value = false
    }

}, { deep: true })
watch(() => formData.bride_date_birth, (val) => {
    formData.bride_age = calculateAge(val) || ''
})
const skip_bride_consent = ref(false)

watch(() => formData.bride_age, (val) => {
    if (!val) return;

    if (val > 25) {
        formData.bride_person_who_gave_consent = "N/A"
        formData.bride_person_who_gave_consent_relation = "N/A"
        formData.bride_person_who_gave_consent_citizenship = "N/A"
        formData.bride_person_who_gave_consent_residence = "N/A"
        skip_bride_consent.value = true
    } else {
        formData.bride_person_who_gave_consent = ''
        formData.bride_person_who_gave_consent_relation = ''
        formData.bride_person_who_gave_consent_citizenship = ''
        formData.bride_person_who_gave_consent_residence = ''
        skip_bride_consent.value = false
    }

}, { deep: true })

watch(
    () => [
        formData.groom_first_name,
        formData.groom_middle_name,
        formData.groom_last_name,
        formData.bride_first_name,
        formData.bride_middle_name,
        formData.bride_last_name
    ],
    () => {
        const groomFullName = `${formData.groom_first_name} ${formData.groom_middle_name} ${formData.groom_last_name}`.trim();
        const brideFullName = `${formData.bride_first_name} ${formData.bride_middle_name} ${formData.bride_last_name}`.trim();

        if (groomFullName.trim()) {
            formData.bride_contract_marriage_with = groomFullName;
        }
        if (brideFullName.trim()) {
            formData.groom_contract_marriage_with = brideFullName;
        }
    }
)

watch(() => formData.groom_civil_status, (val) => {
    const isSingle = val === 'SINGLE'
    formData.groom_place_dissolved = isSingle ? 'N/A' : ''
    formData.groom_date_dissolved = isSingle ? 'N/A' : ''
    formData.groom_previously_married_dissolved = isSingle ? 'N/A' : ''
})

watch(() => formData.bride_civil_status, (val) => {
    const isSingle = val === 'SINGLE'
    formData.bride_place_dissolved = isSingle ? 'N/A' : ''
    formData.bride_date_dissolved = isSingle ? 'N/A' : ''
    formData.bride_previously_married_dissolved = isSingle ? 'N/A' : ''
})

watch(
    () => [formData.groom_religion, formData.bride_religion], // or others involved
    () => {
        add_details_to_notice()
    }
)


/**
 *  Both Groom and Bride Pictures 
 * @important
 */

const groom_picture = ref(null)
const handle_groom_image = (capturedImage) => {
    groom_picture.value = capturedImage
}
const bride_picture = ref(null)
const handle_bride_image = (capturedImage) => {
    bride_picture.value = capturedImage
}

/**
 * Helper to blank form
 */
const blank = () => {
    Object.assign(formData, { ...initialForm });
}
const close_modal = () => {
    modal.value = false;
    blank();
};

const isLoadingPrev = ref(false)
const municipality_with_province = ref(municipalityProvinceAddress())


/**
 * Marriage Wacther Here
 * @IMPORTANT
 */

useMarriageWatcher(formData)


/**
 * Groom Auto Suggestion
 * @autosuggestions
 */

const {
    groomSuggestions,
    groomfatherSuggestions,
    groommotherSuggestions,
    groomconsentSuggestions
} = useGroomResidenceSuggestions(formData);

/**
 * Bride Auto Suggestion
 * @autosuggestions
 */

const {
    brideSuggestions,
    bridefatherSuggestions,
    bridemotherSuggestions,
    brideconsentSuggestions
} = useBrideResidenceSuggestions(formData);


/**
 * Helper to validate form data
 */

const validateForm = async () => {
    const isValid = await v$.value.$validate()
    console.log(v$.value)
    if (!isValid) {
        toast.fire({
            icon: 'error',
            title: 'Please fill in all required fields to proceed.',
            duration: 5000,
        })
        return true
    }
    return true
}
const preview_document = async () => {
    if (!(await validateForm())) return

    isLoadingPrev.value = true
    pdf_content.value = null

    const data = JSON.stringify({ ...formData })

    try {
        let previewData

        if (page.value === 1) {
            previewData = await window.MarriageApi.previewMarriage(data)
        } else if (page.value === 2) {
            const images = JSON.stringify([
                bride_picture.value,
                groom_picture.value
            ])
            previewData = await window.MarriageApi.previewNotice(data, images)
        }

        pdf_content.value = previewData?.pdfbase64 || null
    } catch (err) {
        console.error('Preview failed:', err)
    } finally {
        isLoadingPrev.value = false
    }
}

const printAFML = async () => {
    if (!(await validateForm())) return

    const data = JSON.stringify({ ...formData })
    const settings = JSON.stringify({ ...pdf_settings })

    const previewData = await window.MarriageApi.printMarriage(data, settings)
}

const getBrideGroomImages = () => JSON.stringify([bride_picture.value, groom_picture.value])

const printNoticePosting = async () => {
    if (!(await validateForm())) return

    const data = JSON.stringify({ ...formData })

    const image_data = getBrideGroomImages

    const previewData = await window.MarriageApi.previewNotice(data, image_data)

    if (previewData?.pdfbase64) {
        const dataUri = removeBase64Prefix(previewData.pdfbase64)
        await window.MarriageApi.printNotice(dataUri)
    }
}

const submit = async () => {
    if (!(await validateForm())) return

    const images = getBrideGroomImages
    const main_data = JSON.stringify({ ...formData })

    const save_local = await window.MarriageApi.saveMarriageApplicationEntry(main_data, images)

    if (save_local?.status) {
        const dataToSave = {
            ...formData,
            file_path: save_local.filepath,
            created_by: auth.user_id
        }

        await apl.addApplicationMarriageLicense(dataToSave)
        close_modal()
    }
}

const colDefs = ref([
    {

        headerName: "Groom Name",
        cellClass: 'font-medium',
        flex: 2,
        filter: true,

        valueGetter: (params) => {
            const firstName = params.data.groom_first_name || '';
            const middleName = params.data.groom_middle_name || '';
            const lastName = params.data.groom_last_name || '';
            return `${firstName} ${middleName} ${lastName}`.trim();
        }
    },
    {

        headerName: "Bride Name",
        cellClass: 'font-medium',
        flex: 2,
        valueGetter: (params) => {
            const firstName = params.data.bride_first_name || '';
            const middleName = params.data.bride_middle_name || '';
            const lastName = params.data.bride_last_name || '';

            return `${firstName} ${middleName} ${lastName}`.trim();
        }

    },

    {
        field: "date_of_receipt",
        headerName: "Date Receipt",

        flex: 2,
        filter: true,

    },
    {
        field: "notice_date_posting",
        headerName: "Date Posting",
        flex: 2,
        filter: true,

    },
    {

        cellStyle: { border: "none" },
        pinned: "right",
        width: 100,
        lockPinned: true,
        resizable: true,
        sortable: false,
        cellStyle: { overflow: "visible", border: "none" },
        cellRenderer: ActionBtn,
    },

]);
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