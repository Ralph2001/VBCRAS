<template>
  <div class="flex flex-col relative justify-center w-full p-10">
    <Header label="APPLICATION FOR MARRIAGE LICENSE">
      <div class="w-full gap-2 flex flex-row items-center justify-center">
        <Button label="Create New Application" isActive :class="`rounded`" @click="open_model" />
        <button @click="show_application_marriage"
          class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </button>

        <IsPathAccessible :filePath="system_setting.defaults.file_path"
          :subFolder="'\\VBCRAS\\Application for Marriage Licence\\'" />
      </div>
    </Header>


    <div class="h-[calc(100vh-200px)]">
      <TableGrid :data="sortedMarriageLicenses" :dataColumns="colDefs" :suppressRowTransform="true" />
    </div>

    <transition name="fade-scale">
      <div v-if="show_application_marriage_settings"
        class="fixed inset-0 w-full h-full flex justify-center items-center z-50 backdrop-blur-sm backdrop-brightness-50">
        <div class="max-w-screen-md w-full rounded border h-[34rem] bg-white p-6 flex flex-col">
          <div class="mb-4">
            <p class="font-semibold text-xl text-gray-800">Application for Marriage License - Settings</p>
            <p class="text-sm text-gray-600 mt-1">
              Configure the default values used when generating marriage license forms. These will be
              auto-filled on new applications.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <InputMarriage label="Header Province" v-model="userConfig.header_province" />
            <InputMarriage label="Header Municipality" v-model="userConfig.header_municipality" />
          </div>
          <div class="mt-4">
            <InputMarriage label="Civil Registrar" v-model="userConfig.civil_registrar" />
          </div>

          <!-- Optional: Default Filepath or Template Path -->
          <div class="mt-4">
            <InputMarriage readonly label="Default Filepath (AFML & Notice of Posting)" v-model="file_path"
              placeholder="/documents/marriage-licenses/" />
            <p class="text-xs text-gray-500 mt-1">This is where generated documents will be saved by
              default. <span class="text-blue-500 font-medium">(Only Admin can change this.)</span></p>
          </div>

          <!-- Optional: Tooltip or Hint -->
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              Tip: You can change these defaults anytime. They won’t affect already submitted
              applications.
            </p>
          </div>

          <!-- Footer Buttons -->
          <div class="mt-auto flex justify-end space-x-3">
            <button @click="hide_application_marriage"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition">
              Cancel
            </button>
            <button @click="resetConfig" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition">
              Reset
            </button>
            <button @click="saveUserConfig"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
              Save
            </button>
          </div>
        </div>
      </div>
    </transition>


    <!-- Delete Modal -->
    <transition name="fade-scale">
      <div v-if="isToRemove" class="fixed inset-0 flex items-center justify-center z-50 bg-black/40" aria-modal="true"
        role="dialog" tabindex="-1">
        <div class="bg-white rounded-lg shadow-xl border max-w-md w-full p-8 relative flex flex-col items-center">
          <!-- Warning Icon -->
          <div class="mb-4">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-red-600 mb-2 text-center">Delete Record?</h2>
          <p class="text-gray-700 text-center mb-2">
            This action <span class="font-semibold text-red-500">cannot be undone</span>.
          </p>
          <p class="text-gray-500 text-center mb-6">
            All data associated with this record will be permanently removed.
          </p>
          <div v-if="!showPasswordInput" class="flex justify-center gap-3 w-full mt-auto">
            <button @click="cancelRemove"
              class="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition" autofocus>
              Cancel
            </button>
            <button @click="showPasswordInput = true"
              class="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition">
              Yes, Delete
            </button>
          </div>
          <div v-else class="w-full flex  flex-col items-center mt-2">

            <input v-model="deletePassword" type="password" placeholder="Enter your password"
              class="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              @keyup.enter="confirmDeleteWithPassword" />
            <div class="flex justify-center gap-3 mt-4 w-full">
              <button @click="cancelRemove"
                class="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">
                Cancel
              </button>
              <button @click="confirmDeleteWithPassword"
                class="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                :disabled="!deletePassword">
                Confirm Delete
              </button>
            </div>
            <p v-if="deleteError" class="text-red-500 text-sm mt-2">{{ deleteError }}</p>
          </div>
        </div>
      </div>
    </transition>


    <!-- Add, Edit Modal -->
    <transition name="fade-scale">
      <div v-if="modal"
        class="fixed top-0 bottom-0 left-0 right-0 w-full h-full flex  bg-white items-center justify-center z-50  bg-black/20 "
        tabindex="-1">

        <div class="w-full  h-full max-h-screen flex flex-col justify-center items-center outline-none ring-0 bg-gradient-to-t from-gray-100 via-white to-white
 relative overflow-hidden">
          <div class="flex items-center h-14   flex-row gap-0 border py-2 px-4 w-full bg-white max-w-screen-2xl">
            <div class="flex flex-col ml-auto justify-center items-center">
              <h2 class="font-bold text-lg uppercase text-gray-700 leading-tight">Application for Marriage
                License
              </h2>
              <h2 class="font-semibold text-xs a text-gray-600 ">Municipal Form No. 90 (Form No. 2)</h2>

            </div>

            <button @click="close_modal"
              class="ml-auto border rounded w-16 hover:bg-red-600 bg-red-500 text-white"><font-awesome-icon
                icon="fa-solid fa-xmark" /></button>
          </div>

          <div
            class="flex-1 overflow-y-auto p-4 h-full flex-col gap-6 w-full max-w-screen-2xl py-8 bg-neutral-100 flex">

            <!-- Main Content -->
            <div class="flex flex-col gap-4 max-w-screen-xl mx-auto w-full">
              <div v-if="currentStep === 0 || form_mode === 1" class="flex flex-col px-10  gap-2 justify-center">
                <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                  <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[0] }}</p>
                  <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                    steps[0]
                    }}
                  </p>
                </div>
                <div class="grid grid-cols-1 gap-2 mb-auto">

                  <div class="grid grid-cols-3 gap-2">
                    <InputMarriage type="date" label="Date of Application/Reciept" v-model="formData.date_of_receipt" />

                    <InputMarriage label="Marriage License No" v-model="formData.marriage_license_number" />
                    <InputMarriage type="date" label="Date of Issuance of Marriage License"
                      v-model="formData.date_issuance_marriage_license" />

                  </div>
                  <div class="grid grid-cols-3 gap-2">

                    <InputMarriage label="Registry Number" v-model="formData.registry_number" />
                    <InputMarriage type="date" label="Date of Marriage" v-model="formData.date_of_marriage" />
                    <InputMarriage label="Place of Marriage" v-model="formData.place_of_marriage" />
                  </div>
                </div>

              </div>
              <div v-if="currentStep === 1 || form_mode === 1" class="flex flex-col px-10 justify-center  ">
                <div class="grid grid-cols-1 gap-2">

                  <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                    <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[1] }}
                    </p>
                    <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                      steps[1]
                      }}
                    </p>
                  </div>

                  <div class="grid grid-cols-3 gap-1 items-end">
                    <InputMarriage cap label="Full Name" holder="First Name" v-model="formData.groom_first_name"
                      :error="v$.groom_first_name.$error" />
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
                      <InputMarriage label="Age" skip v-model="formData.groom_age" :error="v$.groom_age.$error" />
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-1 items-end">
                    <InputMarriageSuggestion cap label="Place of Birth" holder="City/Municipality"
                      v-model="formData.groom_municipality" :error="v$.groom_municipality.$error"
                      :suggestion_data="municipality_with_province" />
                    <InputMarriageSuggestion cap holder="Province" v-model="formData.groom_province"
                      :suggestion_data="province" />
                    <InputMarriage cap holder="Country" v-model="formData.groom_country"
                      :error="v$.groom_country.$error" />
                  </div>
                  <div class="flex flex-row gap-1 items-end">
                    <div class="w-full">
                      <ResidenceSuggestions cap label="Residence"
                        holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                        v-model="formData.groom_residence" :suggestion_data="groomSuggestions"
                        :error="v$.groom_residence.$error" />

                    </div>
                    <!-- <div class="w-[50%]">
                                        <InputMarriage cap holder="Country" v-model="formData.groom_residence_country"
                                            :error="v$.groom_residence_country.$error" />
                                    </div> -->
                  </div>
                  <div class="flex flex-row items-center gap-2">

                    <div class="w-full">
                      <!-- <InputMarriage cap label="Sex" v-model="formData.groom_sex" /> -->
                      <InputMarriageSuggestion cap skip label="Sex" v-model="formData.groom_sex"
                        :suggestion_data="['MALE', 'FEMALE']" :error="v$.groom_sex.$error" />

                    </div>
                    <div class="w-full">
                      <InputMarriageSuggestion cap label="Citizenship" v-model="formData.groom_citizenship"
                        :suggestion_data="citizenshipOptions" :error="v$.groom_citizenship.$error" />

                    </div>
                    <div class="w-[70%]">
                      <InputMarriageSuggestion cap label="Civil Status" v-model="formData.groom_civil_status"
                        :suggestion_data="civil_status_type" :error="v$.groom_civil_status.$error" />
                    </div>
                  </div>
                  <div class="flex flex-row items-center gap-2"
                    v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                    <InputMarriage cap label="IF PREVIOUSLY MARRIED: How was it dissolved?"
                      v-model="formData.groom_previously_married_dissolved" />
                    <div class="w-[70%]">
                      <InputMarriage cap type="date" label="Date when dissolved"
                        v-model="formData.groom_date_dissolved" />

                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 items-end"
                    v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                    <InputMarriageSuggestion cap label="Place where dissolved" holder="City/Municipality"
                      v-model="formData.groom_place_dissolved_municipality"
                      :suggestion_data="municipality_with_province" />
                    <InputMarriage cap holder="Province" v-model="formData.groom_place_dissolved_province" />
                    <InputMarriage cap holder="Country" v-model="formData.groom_place_dissolved_country" />

                  </div>



                  <div class="grid grid-cols-2 gap-2">
                    <InputMarriageSuggestion cap label="Religion" v-model="formData.groom_religion"
                      :suggestion_data="religionOptions" :error="v$.groom_religion.$error" />
                    <InputMarriage cap label="Degree of relationship of contradicting parties"
                      v-model="formData.groom_degree_relation" :error="v$.groom_degree_relation.$error" />


                  </div>

                </div>
              </div>
              <div v-if="currentStep === 2 || form_mode === 1" class="flex flex-col gap-2 px-10 justify-center">


                <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                  <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[2] }}</p>
                  <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                    steps[2]
                    }}
                  </p>
                </div>
                <div class="grid grid-cols-3 gap-1 items-end">
                  <InputMarriage cap label="Name of Father" holder="First Name"
                    v-model="formData.groom_father_first_name" :error="v$.groom_father_first_name.$error" />
                  <InputMarriage cap holder="Middle Name" v-model="formData.groom_father_middle_name" />
                  <InputMarriageSuggestion cap holder="Last Name" v-model="formData.groom_father_last_name"
                    :error="v$.groom_father_last_name.$error" :suggestion_data="[formData.groom_last_name]" />
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship" v-model="formData.groom_father_citizenship"
                      :error="v$.groom_father_citizenship.$error" :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.groom_father_residence" :error="v$.groom_father_residence.$error"
                      :suggestion_data="groomfatherSuggestions" />
                  </div>
                  <!-- <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.groom_father_residence_country"
                                        :error="v$.groom_father_residence_country.$error" />
                                </div> -->
                </div>
                <div class="grid grid-cols-3 gap-1 items-end">
                  <InputMarriage cap label="Maiden Name of Mother" holder="First Name"
                    v-model="formData.groom_mother_first_name" :error="v$.groom_mother_first_name.$error" />
                  <InputMarriage cap holder="Middle Name" v-model="formData.groom_mother_middle_name" />
                  <InputMarriageSuggestion cap holder="Last Name" v-model="formData.groom_mother_last_name"
                    :error="v$.groom_mother_last_name.$error" :suggestion_data="[formData.groom_middle_name]" />
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship" v-model="formData.groom_mother_citizenship"
                      :error="v$.groom_mother_citizenship.$error" :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.groom_mother_residence" :error="v$.groom_mother_residence.$error"
                      :suggestion_data="groommotherSuggestions" />
                  </div>
                  <!-- <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.groom_mother_residence_country"
                                        :error="v$.groom_mother_residence_country.$error" />
                                </div> -->
                </div>

                <div class="flex flex-row gap-1">
                  <div class="w-full">
                    <InputMarriageSuggestion cap label="Person who gave consent or advince"
                      v-model="formData.groom_person_who_gave_consent" :error="v$.groom_person_who_gave_consent.$error"
                      :skip="skip_groom_consent" :suggestion_data="person_gave_consent_groom_suggestion" />
                  </div>
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Relationship"
                      v-model="formData.groom_person_who_gave_consent_relation"
                      :error="v$.groom_person_who_gave_consent_relation.$error" :skip="skip_groom_consent"
                      :suggestion_data="consent_advised_relationship" />
                  </div>
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship"
                      v-model="formData.groom_person_who_gave_consent_citizenship" :skip="skip_groom_consent"
                      :error="v$.groom_person_who_gave_consent_citizenship.$error"
                      :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.groom_person_who_gave_consent_residence" :skip="skip_groom_consent"
                      :error="v$.groom_person_who_gave_consent_residence.$error"
                      :suggestion_data="groomconsentSuggestions" />
                  </div>

                </div>

              </div>

              <!-- Bride Details -->

              <div v-if="currentStep === 3 || form_mode === 1" class="flex flex-col px-10 justify-center">


                <div class="grid grid-cols-1 gap-2">

                  <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                    <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[3] }}
                    </p>
                    <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                      steps[3]
                      }}
                    </p>
                  </div>
                  <div class="grid grid-cols-3 gap-1 items-end">
                    <InputMarriage cap label="Full Name" holder="First Name" v-model="formData.bride_first_name"
                      :error="v$.bride_first_name.$error" />
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
                      <InputMarriage label="Age" skip v-model="formData.bride_age" :error="v$.bride_age.$error" />
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-1 items-end">
                    <InputMarriageSuggestion cap label="Place of Birth" holder="City/Municipality"
                      v-model="formData.bride_municipality" :error="v$.bride_municipality.$error"
                      :suggestion_data="municipality_with_province" />
                    <InputMarriageSuggestion cap holder="Province" v-model="formData.bride_province"
                      :suggestion_data="province" />
                    <InputMarriage cap holder="Country" v-model="formData.bride_country"
                      :error="v$.bride_country.$error" />
                  </div>
                  <div class="flex flex-row gap-1 items-end">
                    <div class="w-full">
                      <ResidenceSuggestions cap label="Residence"
                        holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                        v-model="formData.bride_residence" :suggestion_data="brideSuggestions"
                        :error="v$.bride_residence.$error" />

                    </div>
                    <!-- <div class="w-[50%]">
                                        <InputMarriage cap holder="Country" skip
                                            v-model="formData.bride_residence_country"
                                            :error="v$.bride_residence_country.$error" />
                                    </div> -->
                  </div>
                  <div class="flex flex-row items-center gap-2">

                    <div class="w-full">
                      <!-- <InputMarriage cap label="Sex" v-model="formData.bride_sex" /> -->
                      <InputMarriageSuggestion skip cap label="Sex" v-model="formData.bride_sex"
                        :suggestion_data="['MALE', 'FEMALE']" :error="v$.bride_sex.$error" />

                    </div>
                    <div class="w-full">
                      <InputMarriageSuggestion cap label="Citizenship" v-model="formData.bride_citizenship"
                        :suggestion_data="citizenshipOptions" :error="v$.bride_citizenship.$error" />

                    </div>
                    <div class="w-[70%]">
                      <InputMarriageSuggestion cap label="Civil Status" v-model="formData.bride_civil_status"
                        :suggestion_data="civil_status_type" :error="v$.bride_civil_status.$error" />
                    </div>
                  </div>
                  <div class="flex flex-row items-center gap-2"
                    v-if="formData.bride_civil_status !== 'SINGLE' && formData.bride_civil_status !== ''">
                    <InputMarriage cap label="IF PREVIOUSLY MARRIED: How was it dissolved?"
                      v-model="formData.bride_previously_married_dissolved" />
                    <div class="w-[70%]">
                      <InputMarriage cap type="date" v-model="formData.bride_date_dissolved"
                        label="Date when dissolved" />
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 items-end"
                    v-if="formData.bride_civil_status !== 'SINGLE' && formData.bride_civil_status !== ''">
                    <InputMarriageSuggestion cap label="Place where dissolved" holder="City/Municipality"
                      v-model="formData.bride_place_dissolved_municipality"
                      :suggestion_data="municipality_with_province" />
                    <InputMarriage cap holder="Province" v-model="formData.bride_place_dissolved_province" />
                    <InputMarriage cap holder="Country" v-model="formData.bride_place_dissolved_country" />

                  </div>



                  <div class="grid grid-cols-2 gap-2">
                    <InputMarriageSuggestion cap label="Religion" v-model="formData.bride_religion"
                      :suggestion_data="religionOptions" :error="v$.bride_religion.$error" />
                    <InputMarriage cap label="Degree of relationship of contradicting parties"
                      v-model="formData.bride_degree_relation" :error="v$.bride_degree_relation.$error" />


                  </div>

                </div>
              </div>
              <div v-if="currentStep === 4 || form_mode === 1" class="flex flex-col gap-2 px-10 justify-center">

                <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                  <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[4] }}</p>
                  <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                    steps[4]
                    }}
                  </p>
                </div>

                <div class="grid grid-cols-3 gap-1 items-end">
                  <InputMarriage cap label="Name of Father" holder="First Name"
                    v-model="formData.bride_father_first_name" :error="v$.bride_father_first_name.$error" />
                  <InputMarriage cap holder="Middle Name" v-model="formData.bride_father_middle_name" />
                  <InputMarriageSuggestion cap holder="Last Name" v-model="formData.bride_father_last_name"
                    :error="v$.bride_father_last_name.$error" :suggestion_data="[formData.bride_last_name]" />
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship" v-model="formData.bride_father_citizenship"
                      :error="v$.bride_father_citizenship.$error" :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.bride_father_residence" :error="v$.bride_father_residence.$error"
                      :suggestion_data="bridefatherSuggestions" />
                  </div>
                  <!-- <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.bride_father_residence_country"
                                        :error="v$.bride_father_residence_country.$error" />
                                </div> -->
                </div>
                <div class="grid grid-cols-3 gap-1 items-end">
                  <InputMarriage cap label="Maiden Name of Mother" holder="First Name"
                    v-model="formData.bride_mother_first_name" :error="v$.bride_mother_first_name.$error" />
                  <InputMarriage cap holder="Middle Name" v-model="formData.bride_mother_middle_name" />
                  <InputMarriageSuggestion cap holder="Last Name" v-model="formData.bride_mother_last_name"
                    :error="v$.bride_mother_last_name.$error" :suggestion_data="[formData.bride_middle_name]" />
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship" v-model="formData.bride_mother_citizenship"
                      :error="v$.bride_mother_citizenship.$error" :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.bride_mother_residence" :error="v$.bride_mother_residence.$error"
                      :suggestion_data="bridemotherSuggestions" />
                  </div>
                  <!-- <div class="w-[50%]">
                                    <InputMarriage cap holder="Country"
                                        v-model="formData.bride_mother_residence_country"
                                        :error="v$.bride_mother_residence_country.$error" />
                                </div> -->
                </div>

                <div class="flex flex-row gap-1">
                  <div class="w-full">
                    <InputMarriageSuggestion cap label="Person who gave consent or advince"
                      v-model="formData.bride_person_who_gave_consent" :error="v$.bride_person_who_gave_consent.$error"
                      :skip="skip_bride_consent" :suggestion_data="person_gave_consent_bride_suggestion" />
                  </div>
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Relationship"
                      v-model="formData.bride_person_who_gave_consent_relation"
                      :error="v$.bride_person_who_gave_consent_relation.$error" :skip="skip_bride_consent"
                      :suggestion_data="consent_advised_relationship" />
                  </div>
                </div>
                <div class="flex flex-row gap-1 items-end">
                  <div class="w-[50%]">
                    <InputMarriageSuggestion cap label="Citizenship"
                      v-model="formData.bride_person_who_gave_consent_citizenship"
                      :error="v$.bride_person_who_gave_consent_citizenship.$error" :skip="skip_bride_consent"
                      :suggestion_data="citizenshipOptions" />
                  </div>
                  <div class="w-full">
                    <ResidenceSuggestions cap label="Residence"
                      holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                      v-model="formData.bride_person_who_gave_consent_residence"
                      :error="v$.bride_person_who_gave_consent_residence.$error" :skip="skip_bride_consent"
                      :suggestion_data="brideconsentSuggestions" />
                  </div>

                </div>

              </div>
              <div v-if="currentStep === 5 || form_mode === 1" class="flex flex-col gap-2 px-10 justify-center">

                <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                  <p class="font-bold text-lg uppercase  text-blue-600 leading-3">{{ steps[5] }}</p>
                  <p class=" text-xs text-gray-600 text-semibold uppercase">Please provide {{
                    steps[5]
                    }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-4">
                  <InputMarriage cap label="Groom Community Tax Cert. Number" v-model="formData.groom_ctc_number"
                    :error="v$.groom_ctc_number.$error" />
                  <InputMarriage cap label="Bride Community Tax Cert. Number" v-model="formData.bride_ctc_number"
                    :error="v$.bride_ctc_number.$error" />
                  <InputMarriage type="date" holder="Date" cap label="on" v-model="formData.groom_ctc_on"
                    :error="v$.groom_ctc_on.$error" />
                  <InputMarriage type="date" holder="Date" cap label="on" v-model="formData.bride_ctc_on"
                    :error="v$.bride_ctc_on.$error" />
                  <InputMarriageSuggestion :suggestion_data="municipality" holder="Place" cap label="at"
                    v-model="formData.groom_ctc_at" :error="v$.groom_ctc_at.$error" />
                  <InputMarriageSuggestion :suggestion_data="municipality" holder="Place" cap label="at"
                    v-model="formData.bride_ctc_at" :error="v$.bride_ctc_at.$error" />
                </div>



              </div>
              <div v-if="currentStep === 6 || form_mode === 1" class="flex flex-col gap-2 px-10 justify-center mt-10">

                <div class="flex flex-col gap-1 bg-blue-100 justify-center       p-2" v-if="form_mode === 1">
                  <p class="font-bold text-lg uppercase  text-black leading-3">{{ steps[6]
                    }}
                  </p>
                  <p class=" text-xs text-gray-600 text-semibold uppercase mt-2">Please provide {{
                    steps[6]
                    }} Details
                  </p>
                </div>
                <div class="w-80 mt-8">
                  <InputMarriage label="Date of Posting" type="date" v-model="formData.notice_date_posting"
                    :error="v$.notice_date_posting.$error" />
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
                        <img :src="groom_picture" alt="Captured photo" class="w-full h-full object-contain " />
                      </div>

                    </div>
                    <p class="font-medium text-sm italic text-gray-600">Groom:</p>
                    <div class="flex flex-col grow gap-0 w-full">
                      <div class="flex flex-row gap-1 items-center">
                        <InputMarriage skip holder="Name" v-model="formData.notice_groom_name"
                          :error="v$.notice_groom_name.$error" />
                        <div class="w-[50%]">
                          <InputMarriage skip holder="Age" v-model="formData.notice_groom_age"
                            :error="v$.notice_groom_age.$error" />
                        </div>
                      </div>
                      <InputMarriage skip holder="Birth Place" v-model="formData.notice_groom_birthplace"
                        :error="v$.notice_groom_birthplace.$error" />
                      <InputMarriage skip holder="Residence" v-model="formData.notice_groom_residence"
                        :error="v$.notice_groom_residence.$error" />
                      <InputMarriage skip holder="Father" v-model="formData.notice_groom_father"
                        :error="v$.notice_groom_father.$error" />
                      <InputMarriage skip holder="Mother" v-model="formData.notice_groom_mother"
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
                        <img :src="bride_picture" alt="Captured photo" class="w-full h-full object-contain " />
                      </div>
                    </div>
                    <p class="font-medium text-sm italic text-gray-600">Bride:</p>
                    <div class="flex flex-col grow gap-0 w-full">
                      <div class="flex flex-row gap-1 items-center">
                        <InputMarriage skip holder="Name" v-model="formData.notice_bride_name"
                          :error="v$.notice_bride_name.$error" />
                        <div class="w-[50%]">
                          <InputMarriage skip holder="Age" v-model="formData.notice_bride_age"
                            :error="v$.notice_bride_age.$error" />
                        </div>
                      </div>
                      <InputMarriage skip holder="Birth Place" v-model="formData.notice_bride_birthplace"
                        :error="v$.notice_bride_birthplace.$error" />
                      <InputMarriage skip holder="Residence" v-model="formData.notice_bride_residence"
                        :error="v$.notice_bride_residence.$error" />
                      <InputMarriage skip holder="Father" v-model="formData.notice_bride_father"
                        :error="v$.notice_bride_father.$error" />
                      <InputMarriage skip holder="Mother" v-model="formData.notice_bride_mother"
                        :error="v$.notice_bride_mother.$error" />

                    </div>
                  </div>
                </div>

                <p class="italic mt-4 text-sm font-medium text-green-500">Copy Furnished:</p>
                <div class="w-[40%] pl-4 flex flex-col gap-1">
                  <InputMarriage v-model="formData.notice_copy_furnished1" />
                  <InputMarriage v-model="formData.notice_copy_furnished2" />
                  <InputMarriage v-model="formData.notice_copy_furnished3" />
                  <InputMarriage v-model="formData.notice_copy_furnished4" />
                </div>

              </div>

              <div v-if="currentStep === 7 || form_mode === 1" class="px-6 h-full flex flex-col gap-6 mt-6 mb-2">

                <!-- Section Header -->
                <div v-if="form_mode === 1">
                  <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ steps[7] }}</h2>
                </div>

                <!-- Step 1: Select Document -->
                <div>
                  <label class="text-gray-700 font-medium flex items-center gap-1">
                    <span>1. Select a document to preview and print</span>
                    <font-awesome-icon icon="fa-solid fa-circle-question" class="text-gray-400 cursor-pointer"
                      title="Select the document you want to preview and print." />
                  </label>

                  <div class="flex flex-wrap gap-2 mt-3">
                    <button
                      :class="['px-4 py-2 rounded-lg border font-medium transition', select_page === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100']"
                      @click="select_page = 1; change_page()">
                      Application for Marriage License
                    </button>
                    <button
                      :class="['px-4 py-2 rounded-lg border font-medium transition', select_page === 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100']"
                      @click="select_page = 2; change_page()">
                      Notice of Posting
                    </button>
                  </div>
                </div>

                <!-- Step 2: Print Options -->
                <div>
                  <label class="text-gray-700 font-medium">2. Print Options</label>

                  <div class="flex flex-wrap items-center justify-end gap-2 mt-2">
                    <PrintManager :active_pdf_link="base64forPrinting" :active_pdf="''" :count="1" />

                    <button v-if="page === 1" @click="openAFMLSetting()"
                      class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition">
                      <font-awesome-icon icon="fa-solid fa-gear" />
                      Adjust
                    </button>
                  </div>

                  <!-- Position Adjustment Popup -->
                  <div v-if="afml_setting" class="absolute right-0 top-20 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <h3 class="text-center font-semibold text-gray-700 mb-3">Adjust Print Position
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-center gap-4">
                        <font-awesome-icon icon="fa-solid fa-x" class="w-5 text-gray-500" />
                        <InputMarriage v-model="pdf_settings.x" type="number" step="0.1" />
                      </div>
                      <div class="flex items-center gap-4">
                        <font-awesome-icon icon="fa-solid fa-y" class="w-5 text-gray-500" />
                        <InputMarriage v-model="pdf_settings.y" type="number" step="0.1" />
                      </div>
                      <button class="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        @click="saveAFMLSetting()">
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Document Preview -->
                <div>
                  <label class="text-gray-700 font-medium">3. Document Preview</label>
                  <div ref="pdfContainer"
                    class="mt-3 relative h-[30rem] bg-white rounded-lg border border-gray-200 shadow-inner flex items-center justify-center">

                    <button
                      class="absolute top-2 right-4 z-10 px-3 py-1 text-sm rounded bg-white border shadow hover:bg-gray-100 transition"
                      @click="toggleFullScreen">
                      {{ isFullScreen ? 'Exit Full Screen' : 'Full Screen' }}
                    </button>

                    <p v-if="isLoadingPrev" class="italic text-gray-500">Loading preview...</p>
                    <PDFViewerWorker v-if="pdf_content" :pdfBytes64="pdf_content" />
                    <p v-if="!pdf_content && !isLoadingPrev" class="italic text-gray-400">
                      Select a document above to see a preview.
                    </p>
                  </div>
                </div>
              </div>


            </div>

          </div>


          <div
            class="h-16 flex flex-row gap-4 p-4 border-t items-center bg-gradient-to-t from-gray-50 via-white to-white shadow-inner justify-center w-full max-w-screen-2xl">
            <div class="flex flex-row flex-wrap gap-4 ml-auto">
              <button @click="submit()" v-if="(currentStep + 1 === steps.length || form_mode === 1) && !isUpdating"
                class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-1.5 w-56 rounded-lg shadow-md ring-1 ring-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150 text-lg tracking-wide">
                Save Record
              </button>

              <button @click="updateRecord()" v-if="(currentStep + 1 === steps.length || form_mode === 1) && isUpdating"
                class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-1.5 w-56 rounded-lg shadow-md ring-1 ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 text-lg tracking-wide">
                Update Record
              </button>
            </div>
          </div>



        </div>
      </div>
    </transition>


    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Discard Changes?</h2>
        <p class="text-sm text-gray-600 mb-6">
          You have unsaved changes in this form. If you close it now, your input will be lost. Do you want to
          continue?
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showConfirm = false"
            class="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            Stay on Form
          </button>
          <button @click="confirmClose"
            class="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
            Discard & Exit
          </button>
        </div>
      </div>
    </div>



    <!-- Full Page PDF Preview Modal -->
    <div v-if="isPreview" class="fixed inset-0 bg-white z-50 flex flex-col h-screen">

      <!-- Header / Toolbar -->
      <div class="p-4 border-b flex items-center justify-between bg-gray-100 shadow-sm">
        <h2 class="font-bold text-lg text-gray-800">
          {{ previewPage === 1 ? 'Application for Marriage License' : 'Notice of Posting' }}
        </h2>
        <button @click="closePreviewModal()" class="text-gray-500 hover:text-gray-700">
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
        </button>
      </div>

      <!-- Controls Section -->
      <div class="flex items-center gap-4 px-4 py-3 bg-gray-100 border-b shadow">
        <label class="font-semibold">Document:</label>
        <select v-model="previewPage" class="bg-white border border-gray-300 rounded px-3 py-2">
          <option :value="1">Application for Marriage License</option>
          <option :value="2">Notice of Posting</option>
        </select>


        <!-- Print Buttons -->
        <div class="flex items-center gap-2 ml-auto">
          <PrintManager :active_pdf_link="previewPdfContent" :active_pdf="''" :count="1" />
          <button @click="openAFMLSetting()"
            class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-gear" />
            Adjust Position
          </button>
        </div>

        <!-- <button @click="handlePreviewPrint()" class="bg-green-500 text-white px-4 py-2 rounded ml-auto">
                    <font-awesome-icon icon="fa-solid fa-print" class="mr-1" />
                    Print Notice
                </button> -->
      </div>

      <!-- Settings Panel -->
      <div v-if="afml_setting" class="absolute right-4 top-20 bg-white border shadow-xl rounded-md p-4 w-64 z-[90]">
        <h3 class="text-center font-semibold mb-2">Print Position Adjustment</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="w-fit text-nowrap text-gray-500 text-sm">X Offset</span>
            <InputMarriage v-model="pdf_settings.x" type="number" step="0.1" class="w-12" />
          </div>
          <div class="flex items-center gap-4">
            <span class="w-fit text-nowrap text-gray-500 text-sm">Y Offset</span>
            <InputMarriage v-model="pdf_settings.y" type="number" step="0.1" class="w-12" />
          </div>
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition"
            @click="saveAFMLSetting()">
            Save
          </button>
        </div>
      </div>

      <!-- PDF Preview -->
      <div class="flex-1 overflow-auto bg-gray-50 flex items-center justify-center relative">
        <p v-if="!isDocReady" class="italic text-gray-600">Loading preview...</p>
        <PDFViewerWorker :pdfBytes64="previewPdfContent" v-if="previewPdfContent" />

      </div>
    </div>

  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Header from '../../components/essentials/header.vue';
import Camera from '../../components/Camera.vue';
import { onClickOutside } from '@vueuse/core'
import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import TableGrid from '../../components/TableGrid.vue';
import { useApplicationMarriageLicense } from '../../stores/APL';
import ActionBtn from '../../components/Marriage/ActionBtn.vue';
import { AuthStore } from "../../stores/Authentication.js";
import { complete_municipality, complete_municipality_with_province, complete_province, municipalityProvinceAddress } from '../../utils/Address/index.js';
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
import { addDays, format, isFriday, isValid, nextMonday, parseISO } from 'date-fns';
import { useSetup } from '../../stores/Setting/setup.js';
import IsPathAccessible from '../../components/IsPathAccessible.vue';
import { useComputerStore } from '../../stores/computer.js';
import PrintManager from '../../components/PrintManager.vue';
import isEqual from 'lodash/isEqual'

const computer = useComputerStore()

const system_setting = useSetup()
const file_path = ref(null)





onMounted(async () => {
  system_setting.getSystemSetting()
  computer.getUserName()

  const now = new Date()
  const current_year = now.getFullYear()
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const current_month = monthNames[now.getMonth()]
  file_path.value = system_setting.defaults.file_path + '\\VBCRAS\\Application for Marriage Licence\\' + current_year + '\\' + current_month
})


const getUserConfigFromStorage = () => {
  const saved = localStorage.getItem('marriage_user_config')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {

    }
  }
  return {
    header_province: system_setting.defaults.province.toUpperCase(),
    header_municipality: system_setting.defaults.municipality.toUpperCase(),
    civil_registrar: system_setting.defaults.civil_registrar.toUpperCase(),
  }
}

const userConfig = reactive(getUserConfigFromStorage())

const saveUserConfig = () => {
  localStorage.setItem('marriage_user_config', JSON.stringify({
    header_province: userConfig.header_province,
    header_municipality: userConfig.header_municipality,
    civil_registrar: userConfig.civil_registrar,
  }))
  hide_application_marriage()
  toast.fire({
    icon: 'success',
    title: 'Settings saved successfully.',
    duration: 5000,
  })
}

const resetConfig = () => {
  userConfig.header_province = system_setting.defaults.province.toUpperCase()
  userConfig.header_municipality = system_setting.defaults.municipality.toUpperCase()
  userConfig.civil_registrar = system_setting.defaults.civil_registrar.toUpperCase()
  localStorage.setItem('marriage_user_config', JSON.stringify({
    header_province: userConfig.header_province,
    header_municipality: userConfig.header_municipality,
    civil_registrar: userConfig.civil_registrar,
  }))
  hide_application_marriage()
  toast.fire({
    icon: 'success',
    title: 'Settings reset to default.',
    duration: 5000,
  })
}

const show_application_marriage_settings = ref(false)

const show_application_marriage = () => {
  show_application_marriage_settings.value = true
}
const hide_application_marriage = () => {
  show_application_marriage_settings.value = false
}

const pdfContainer = ref(null)
const isFullScreen = ref(false)
function toggleFullScreen() {
  const el = pdfContainer.value

  if (!el) return

  if (!document.fullscreenElement) {
    el.requestFullscreen().then(() => {
      isFullScreen.value = true
    }).catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
    isFullScreen.value = false
  } else {
    isFullScreen.value = false
    document.exitFullscreen();
  }
}

/**
 * Toast hehe
 */
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


const page = ref(0)
const paper_size = computed(() => {
  return page.value === 1 ? 13 : 8
})

const select_page = ref(0)
const change_page = async () => {
  // if (!(await validateForm())) {

  //     page.value = 0
  //     select_page.value = 0
  //     return
  // }

  page.value = select_page.value
  preview_document()
}


const adjustment_div = ref(null)
onClickOutside(adjustment_div, event => adjustment_setting.value = false)
const preview = ref(false)
const pdf_content = ref(null)

const pdf_settings = reactive({
  x: 1,
  y: 0.8,
})
onMounted(() => {
  const saved = localStorage.getItem('afml_pdf_settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      pdf_settings.x = parsed.x ?? 0
      pdf_settings.y = parsed.y ?? 0
    } catch (e) {
      console.error('Invalid saved settings in localStorage')
    }
  }
})



const apl = useApplicationMarriageLicense()

const sortedMarriageLicenses = computed(() => {
  return [...apl.application_marriage_license].sort((a, b) => {
    const regA = a.registry_number
    const regB = b.registry_number

    // Case 1: both have registry_number
    if (regA && regB) {
      const [yearA, numA] = regA.split('-').map(Number)
      const [yearB, numB] = regB.split('-').map(Number)
      if (yearA !== yearB) return yearB - yearA
      return numB - numA
    }

    // Case 2: one or both are blank — fallback to created_at
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return dateB - dateA // newest first
  })
})


onMounted(() => {
  auth.isAuthenticated()
  apl.getApplicationMarriageLicense()
});

watch(() => pdf_settings.x, (newX, oldX) => {
  console.log(`X changed from ${oldX} to ${newX}`)
  // Call your function here
  preview_document()
})

// Watch `y` changes
watch(() => pdf_settings.y, (newY, oldY) => {
  console.log(`Y changed from ${oldY} to ${newY}`)
  // Call your function here
  preview_document()
})



/**
 * Main Modal
 * @important
 */
const modal = ref(false);

const open_model = () => {
  formData.notice_date_posting = calculateNoticeDate(formData.date_of_receipt)
  modal.value = true;
};


const initialForm = {

  header_province: system_setting.defaults.province.toUpperCase() || '',
  header_municipality: system_setting.defaults.municipality.toUpperCase() || '',
  registry_number: '',
  received_by: system_setting.defaults.civil_registrar || '',
  date_of_marriage: '', //ADD
  date_of_receipt: new Date().toISOString().split('T')[0],

  marriage_license_number: '',
  date_issuance_marriage_license: '',
  groom_contract_marriage_with: '',
  bride_contract_marriage_with: '',

  place_of_marriage: '', // ADD

  civil_registrar: system_setting.defaults.civil_registrar || '',

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
  groom_ss_at: system_setting.defaults.municipality.toUpperCase() + ', ' + system_setting.defaults.province.toUpperCase() || '',
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
  bride_ss_at: system_setting.defaults.municipality.toUpperCase() + ', ' + system_setting.defaults.province.toUpperCase() || '',
  bride_ctc_number: '',
  bride_ctc_on: '',
  bride_ctc_at: '',



  /**
   *  Notice Input Fields
   */


  notice_province: system_setting.defaults.province.toUpperCase() || '',
  notice_municipality: system_setting.defaults.municipality.toUpperCase() || '',
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

  groom_previously_married_dissolved: 'N/A',
  bride_previously_married_dissolved: 'N/A',

  groom_date_dissolved: 'N/A',
  bride_date_dissolved: 'N/A',


  groom_place_dissolved_municipality: 'N/A',
  groom_place_dissolved_province: 'N/A',
  groom_place_dissolved_country: 'N/A',

  bride_place_dissolved_municipality: 'N/A',
  bride_place_dissolved_province: 'N/A',
  bride_place_dissolved_country: 'N/A',

}

const formData = reactive({ ...initialForm })


const originalForm = JSON.parse(JSON.stringify(initialForm))


const isFormDirty = computed(() => {
  return !isEqual(formData, originalForm)
})





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
  `MR. & MRS. ${formData.groom_mother_first_name} ${formData.groom_mother_last_name} ${formData.groom_father_last_name}`,
  `MR. & MRS. ${formData.groom_father_first_name} ${formData.groom_father_middle_name} ${formData.groom_father_last_name}`,
  `${formData.groom_mother_first_name} ${formData.groom_mother_last_name} ${formData.groom_father_last_name} and ${formData.groom_father_first_name} ${formData.groom_father_middle_name} ${formData.groom_father_last_name}`,
])
const person_gave_consent_bride_suggestion = computed(() => [
  `MR. & MRS. ${formData.bride_father_first_name} ${formData.bride_father_middle_name} ${formData.bride_father_last_name}`,
  `MR. & MRS. ${formData.bride_mother_first_name} ${formData.bride_mother_last_name} ${formData.bride_father_last_name}`,
  `${formData.bride_mother_first_name} ${formData.bride_mother_last_name} ${formData.bride_father_last_name} and ${formData.bride_father_first_name} ${formData.bride_father_middle_name} ${formData.bride_father_last_name}`,

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
  formData.groom_previously_married_dissolved = isSingle ? 'N/A' : ''
  formData.groom_date_dissolved = isSingle ? 'N/A' : ''
  formData.groom_place_dissolved_municipality = isSingle ? 'N/A' : ''
  formData.groom_place_dissolved_province = isSingle ? 'N/A' : ''
  formData.groom_place_dissolved_country = isSingle ? 'N/A' : ''
})

watch(() => formData.bride_civil_status, (val) => {
  const isSingle = val === 'SINGLE'
  formData.bride_previously_married_dissolved = isSingle ? 'N/A' : ''
  formData.bride_date_dissolved = isSingle ? 'N/A' : ''
  formData.bride_place_dissolved_municipality = isSingle ? 'N/A' : ''
  formData.bride_place_dissolved_province = isSingle ? 'N/A' : ''
  formData.bride_place_dissolved_country = isSingle ? 'N/A' : ''
})

watch(
  () => [
    formData.groom_first_name,
    formData.groom_middle_name,
    formData.groom_last_name,
    formData.bride_first_name,
    formData.bride_middle_name,
    formData.bride_last_name,
    formData.groom_age,
    formData.groom_municipality,
    formData.groom_province,
    formData.groom_residence,
    formData.groom_father_first_name,
    formData.groom_father_middle_name,
    formData.groom_father_last_name,
    formData.groom_mother_first_name,
    formData.groom_mother_middle_name,
    formData.groom_mother_last_name,
    formData.bride_age,
    formData.bride_municipality,
    formData.bride_province,
    formData.bride_residence,
    formData.bride_father_first_name,
    formData.bride_father_middle_name,
    formData.bride_father_last_name,
    formData.bride_mother_first_name,
    formData.bride_mother_middle_name,
    formData.bride_mother_last_name,
  ],
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

const showConfirm = ref(false)

// const onTryClose = () => {
//   if (isFormDirty.value) {
//     showConfirm.value = true
//   } else {
//     closeForm()
//   }
// }

const resetForm = () => {
  Object.assign(formData, JSON.parse(JSON.stringify(initialForm)))
}

const confirmClose = async () => {
  resetForm()
  showConfirm.value = false

  // Reset PDF content and pagination
  pdf_content.value = null
  page.value = 0
  select_page.value = 0

  // Close modal
  modal.value = false

  await nextTick()

  // Reset validation
  v$.value.$reset()

  // Reset edit state
  if (isUpdating.value) {
    isUpdating.value = false
    idToEdit.value = null
  }

  // Reset delete state
  if (isToRemove.value) {
    isToRemove.value = false
    idToRemove.value = null
  }
}

const close_modal = () => {
  if (isFormDirty.value) {
    showConfirm.value = true
  } else {
    confirmClose()
  }
}

const isLoadingPrev = ref(false)
const municipality_with_province = ref(municipalityProvinceAddress())
const municipality = ref(complete_municipality_with_province('Pangasinan'))

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
 * Helper to calculate date of notice
 * Calculates the notice date from the given date of receipt.
 * @param {string} receiptDateStr - ISO format string e.g. '2025-05-02'
 * @returns {string} - formatted date (e.g. 'May 12, 2025')
 */
function calculateNoticeDate(receiptDateStr) {
  const receiptDate = parseISO(receiptDateStr);

  // If Friday, add 3 days to skip to Monday
  const noticeDate = isFriday(receiptDate)
    ? addDays(receiptDate, 3)
    : addDays(receiptDate, 1);

  return format(noticeDate, 'yyyy-MM-dd');
}

watch(() => formData.date_of_receipt, (newVal) => {
  if (!newVal) return;

  formData.notice_date_posting = calculateNoticeDate(formData.date_of_receipt)
})


/**
 * Helper to validate form data
 */

const validateForm = async () => {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    toast.fire({
      icon: 'error',
      title: 'Please fill in all required fields to proceed.',
      duration: 5000,
    })
    return false // change this in prod
  }
  return true
}

const base64forPrinting = ref(null)
const preview_document = async () => {
  // if (!(await validateForm())) return

  isLoadingPrev.value = true
  pdf_content.value = null
  base64forPrinting.value = null

  const data = JSON.stringify({ ...formData })

  try {
    let previewData

    if (page.value === 1) {
      base64forPrinting.value = null

      previewData = await window.MarriageApi.previewMarriage(data)
      const base64forPrint = await printAFML()
      base64forPrinting.value = base64forPrint || null


    } else if (page.value === 2) {
      base64forPrinting.value = null

      const images = JSON.stringify([
        bride_picture.value,
        groom_picture.value
      ])
      previewData = await window.MarriageApi.previewNotice(data, images)
      base64forPrinting.value = previewData.pdfbase64?.replace('data:application/pdf;base64,', '')


    }
    pdf_content.value = previewData?.pdfbase64 || null


  } catch (err) {
    console.error('Preview failed:', err)
  } finally {
    isLoadingPrev.value = false
  }
}

const afml_setting = ref(false)
const openAFMLSetting = () => {
  afml_setting.value = true
}

const saveAFMLSetting = () => {
  afml_setting.value = false
  localStorage.setItem('afml_pdf_settings', JSON.stringify({
    x: pdf_settings.x,
    y: pdf_settings.y
  }))

}

const printAFML = async () => {
  const data = JSON.stringify({ ...formData })
  const settings = JSON.stringify({ ...pdf_settings })

  const previewData = await window.MarriageApi.printMarriage(data, settings)

  if (previewData.status) {
    return previewData.pdfbase64
  }
  return false
}

const getBrideGroomImages = () => JSON.stringify([bride_picture.value, groom_picture.value])


const submit = async () => {
  if (!(await validateForm())) return

  const images = getBrideGroomImages();
  const main_data = JSON.stringify({ ...formData, file_path: file_path.value, })


  const save_local = await window.MarriageApi.saveMarriageApplicationEntry(main_data, images)
  if (save_local && save_local.filepath) {
    const dataToSave = {
      ...formData,
      file_path: save_local.filepath,
      created_by: auth.user_id
    }
    await apl.addApplicationMarriageLicense(dataToSave)
    confirmClose()
    toast.fire({
      icon: 'success',
      title: 'Marriage license application has been successfully added.',
      duration: 5000,
    })
  } else {
    toast.fire({
      icon: 'error',
      title: 'Failed to save application. Please check the file path or try again.',
      duration: 5000,
    })
  }
}


const dataMapper = (data) => {
  if (!data || typeof data !== 'object') return;
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      formData[key] = data[key];
    }
  }
}



/**
 * Handle Update
 */

const isUpdating = ref(false)
const idToEdit = ref(null)
const handleEdit = (data) => {
  modal.value = true
  console.log(data)
  isUpdating.value = true
  idToEdit.value = data.id
  dataMapper(data)

}
const updateRecord = async () => {
  if (!idToEdit.value) return;
  try {
    const update_record = await apl.UpdateRecord(idToEdit.value, formData);
    if (update_record) {
      isUpdating.value = false
      idToEdit.value = null
      close_modal()

      toast.fire({
        icon: 'success',
        title: 'Record Successfully Updated.',
        duration: 5000,
      })
    }
    else {
      isUpdating.value = false
      idToEdit.value = null
      close_modal()

      toast.fire({
        icon: 'error',
        title: 'Something went wrong. Pleas try again',
        duration: 5000,
      })
    }
  } catch (error) {
    console.error("Failed to update:", error);
  }
}


/**
 * Handle Remove
 */

const isToRemove = ref(false)
const showPasswordInput = ref(false)
const deletePassword = ref('')
const deleteError = ref('')

const handleDelete = (data) => {
  isToRemove.value = true
  idToRemove.value = data.id
  console.log(idToRemove.value)
}
const cancelRemove = () => {
  isToRemove.value = false
  idToRemove.value = null
  showPasswordInput.value = false
  deletePassword.value = ''
  deleteError.value = ''
}

const confirmDeleteWithPassword = async () => {
  deleteError.value = ''

  try {
    const isValid = await auth.validatePassword(deletePassword.value)
    if (!isValid) {
      deleteError.value = 'Incorrect password. Please try again.'
      return
    }
  } catch (e) {
    deleteError.value = 'Could not validate password. Please try again later.'
  }


  await proceedRemoveRecord(idToRemove.value)
  showPasswordInput.value = false
  deletePassword.value = ''
  deleteError.value = ''
}

const idToRemove = ref(null)
const proceedRemoveRecord = async (id) => {

  if (!id) {
    console.log('No ID')
    return

  }
  try {
    const removed = await apl.removeApplicationMarriageLicense(id);

    toast.fire({
      icon: 'success',
      title: 'Record removed.',
      duration: 5000,
    })


    if (removed) {
      isToRemove.value = false;
      idToRemove.value = null;
    }
  } catch (error) {
    console.error("Failed to remove record:", error);
  }
}


/**
 * Handle Preview
 */

const isPreview = ref(false)
const previewPage = ref(1)
const previewPdfContent = ref(null)
const isDocReady = ref(false)
const selectedRecord = ref(null)
const selectedPreviewPage = ref(1)

const handlePreviewModal = () => {
  isPreview.value = true
}

const closePreviewModal = () => {
  isPreview.value = false
  previewPdfContent.value = null
  selectedRecord.value = null
  isDocReady.value = false
}

const loadPreviewPrintBase64 = ref(null)
const loadPreview = async () => {
  if (!selectedRecord.value?.id) return;


  loadPreviewPrintBase64.value = null
  isDocReady.value = false;
  previewPdfContent.value = null;

  try {
    const { data } = await apl.getApplicationMarriageLicenseById(selectedRecord.value.id);
    if (!data || !data.file_path) {
      throw new Error('No file path found for the selected record.');
    }

    let fileName = '';
    if (previewPage.value === 1) {
      fileName = 'Application for Marriage License.pdf';
    } else if (previewPage.value === 2) {
      fileName = 'Notice.pdf';
    } else {
      throw new Error('Invalid preview page selection.');
    }

    const filePath = `${data.file_path}\\${fileName}`;
    const readFileAsPdf = await window.LocalCivilApi.readPdfFile(filePath);

    if (readFileAsPdf?.fileUrl) {
      previewPdfContent.value = readFileAsPdf.fileUrl;
      isDocReady.value = true;
    } else {
      throw new Error('Failed to load PDF file.');
    }
  } catch (error) {
    isDocReady.value = false;
    previewPdfContent.value = null;
    console.error('Preview Error:', error);
    toast.fire({
      icon: 'error',
      title: 'Failed to load document preview.',
      duration: 5000,
    });
  }
};

const handlePreview = async (record_data) => {
  selectedRecord.value = record_data

  handlePreviewModal()
  await loadPreview()
}

watch(previewPage, () => {
  loadPreview()
})


// const handlePreviewPrint = async () => {
//     if (!selectedRecord.value?.id) {
//         console.warn("No record selected for printing.");
//         return;
//     }
//     try {
//         const { data } = await apl.getApplicationMarriageLicenseById(selectedRecord.value.id);
//         if (!data) {
//             toast.fire({
//                 icon: 'error',
//                 title: 'Unable to retrieve record details.',
//                 duration: 5000,
//             });
//             return;
//         }

//         if (previewPage.value === 1) {
//             // Print Application for Marriage License
//             const mainData = JSON.stringify({ ...data });
//             const settings = JSON.stringify({ ...pdf_settings });
//             await window.MarriageApi.printMarriage(mainData, settings);
//         } else if (previewPage.value === 2) {
//             // Print Notice of Posting
//             const fileName = 'Notice.pdf';
//             const filePath = `${data.file_path}\\${fileName}`;
//             const pdfResult = await window.LocalCivilApi.readPdfFile(filePath);
//             if (pdfResult?.fileUrl) {
//                 await window.LocalCivilApi.printPDFBase64(pdfResult.fileUrl);
//             } else {
//                 toast.fire({
//                     icon: 'error',
//                     title: 'Failed to load Notice of Posting for printing.',
//                     duration: 5000,
//                 });
//             }
//         }
//     } catch (error) {
//         console.error("Print error:", error);
//         toast.fire({
//             icon: 'error',
//             title: 'An error occurred while printing the document.',
//             duration: 5000,
//         });
//     }
// };




/**
 * Define Column
 */

const colDefs = ref([
  {

    headerName: "Groom Name",
    cellClass: 'font-bold text-gray-800',

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
    cellClass: 'font-bold text-gray-800',

    valueGetter: (params) => {
      const firstName = params.data.bride_first_name || '';
      const middleName = params.data.bride_middle_name || '';
      const lastName = params.data.bride_last_name || '';

      return `${firstName} ${middleName} ${lastName}`.trim();
    }

  },

  {
    field: "registry_number",
    headerName: "Registry Number",
    filter: true,
  },
  {
    field: "marriage_license_number",
    headerName: "Marriage License No.",
    filter: true,
  },
  {
    field: "date_of_receipt",
    headerName: "Date Receipt",

    filter: true,
    valueGetter: (params) => {
      const rawDate = params.data.date_of_receipt;

      const parsedDate = parseISO(rawDate);


      if (!isValid(parsedDate)) return '';

      return format(parsedDate, 'MMMM dd, yyyy');
    }

  },
  {
    field: "notice_date_posting",
    headerName: "Date Posting",

    filter: true,
    valueGetter: (params) => {
      const rawDate = params.data.notice_date_posting;

      const parsedDate = parseISO(rawDate);


      if (!isValid(parsedDate)) return '';


      return format(parsedDate, 'MMMM dd, yyyy');
    }


  },
  {
    field: "created_at",
    headerName: "Created At",
    hide: true, // hides the column from the UI
    sort: "desc", // initial sort order
    comparator: (a, b) => new Date(a) - new Date(b),
  },

  {

    cellStyle: { border: "none" },
    pinned: "right",
    width: 200,
    lockPinned: true,
    resizable: true,
    sortable: false,
    cellStyle: { overflow: "visible", border: "none" },
    cellRenderer: ActionBtn,
    cellRendererParams: {
      onPreview: handlePreview,
      onRemove: handleDelete,
      onEdit: handleEdit,
    },
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
