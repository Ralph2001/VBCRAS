<template>
  <div class="flex flex-col relative justify-center w-full p-10 CCEMAIN ">
    <Header label="FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME">
      <div class="w-full gap-2 flex flex-row items-center justify-center">
        <Button label="Create New Petition" isActive :class="`rounded`" @click="open_modal()" />
        <button @click="quick_settings = !quick_settings"
          class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
            icon="fa-solid fa-info" /></button>
      </div>
    </Header>

    <div v-if="quick_settings"
      class="fixed top-0 left-0 right-0 bottom-0 z-50 h-full w-full flex items-center justify-center  backdrop-blur-sm backdrop-brightness-95 p-2">
      <div class="h-[20rem] w-full  max-w-screen-md p-4 rounded-md bg-white shadow flex flex-col gap-2">
        <div class="flex flex-row items-center h-8 ">
          <p class="text-lg font-medium text-gray-800"><font-awesome-icon icon="fa-solid fa-info" /> </p>
          <button @click="quick_settings = false"
            class="border border-gray-300 rounded-full px-2.5 py-1 ml-auto hover:bg-red-400 hover:text-white">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="flex-1 p-1 gap-2 flex flex-col">
          <p class="font-medium text-xs text-gray-700">Default Filepath</p>
          <div class="p-4 bg-gray-100 shadow-inner rounded-md  ">
            <p class="text-wrap text-sm">{{ system_setting.defaults[0].petition_default_file_path }}</p>
          </div>
        </div>
      </div>
    </div>


    <AlertPath v-if="alertmodal" :title="alertmodal_title" :body="alertmodal_body" />
    <!-- v-if="is_validating" -->
    <ValidateClericalPopup v-if="is_validating" :path="last_saved_filepath" @cancel="cancel_validating_stage"
      @proceed="create_validated_document" />
    <!--  v-if="is_validating"  -->

    <div class="h-[calc(100vh-250px)] relative">
      <div class="w-full flex flex-row p-1 items-center justify-between">
        <div class="flex flex-col">
          <div class="flex flex-row gap-1 items-center justify-center">
            <div class="h-2 bg-[#4A90E2] block rounded-sm w-4"></div>
            <p class="text-xs font-medium">CCE</p>
          </div>
          <div class="flex flex-row gap-1 items-center justify-center">
            <div class="h-2 bg-[#2C7A7B] block rounded-sm w-4"></div>
            <p class="text-xs font-medium">CFN</p>
          </div>
        </div>
        <div class="w-[25rem]">
          <Input label="Search" v-model="search" />
        </div>
      </div>
      <!-- -->
      <PDFViewerCCE v-if="pdf_viewer" :pdf_data="data_pdfs" @exit-btn="close_generated()" />
      <TableGrid :data="filteredRowData" :dataColumns="colDefs" :suppressRowTransform="true" />



    </div>

    <!-- v-if="is_creating" -->
    <div role="dialog" aria-modal="true" v-if="is_creating"
      class="fixed top-0 bottom-0 left-0 right-0 h-full items-center justify-center flex p-4 z-50 backdrop-blur-sm backdrop-brightness-[0.7]"
      tabindex="-1">
      <div
        class="h-auto w-[25rem] gap-1 bg-white border rounded-md border-gray-300 shadow-sm flex flex-col p-4 items-center justify-center">
        <!-- <Loading /> -->

        <div
          class="relative h-[10rem] w-full bg-gray-100 rounded-lg brightness-95 hover:border-gray-300 border transition-all hover:brightness-100"
          title="wave">
          <Wave />
        </div>
        <p class="text-2xl text-gray-800 mt-5">{{ is_document_edit_mode ? "Updating" : is_document_regenerating ?
          "Regenerating" : "Creating" }} Document</p>
        <p class="text-xs text-gray-600">This process might take 30 seconds or longer.</p>
        <p class="text-xs text-gray-600">
          Please be patient...
        </p>
      </div>
    </div>


    <RegenerateMessage v-if="is_regen" @proceed="handleRegenerate" @cancel="is_regen = false" :data="regen_data" />


    <Modal large footerBG="bg-white  border-t  border-gray-300" v-if="petition_modal">
      <template v-slot:header>

        <button
          class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
          @click="close_modal"> <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return</button>
        <!-- <ModalCloseButton @click="close_modal()" /> -->
      </template>


      <div v-if="v$.$error"
        class="fixed top-16 bg-red-500 rounded shadow-2xl right-10 z-[9999] h-auto px-4 py-2.5 flex flex-col items-center justify-center">
        <p class="font-semibold tracking-wider text-white text-sm font-mono"> Required Field/s
        </p>
         <!-- <div class="h-20 overflow-y-scroll flex flex-col items-start  mt-4 border p-2 bg-gray-100 shadow-inner">
          <p v-for="error in v$.$errors" >
            {{ error.$propertyPath.replace('_', ' ') }}

          </p> 

       </div>  -->
      </div>

      <!-- Input Fields -->
      <div
        class="flex flex-col sm:px-4 md:lg:px-[5rem] h-max w-full  gap-4 relative items-center justify-center overflow-y-scroll  bg-gray-300 ">
        <div :class="[backround_per_event]" class="h-full flex flex-col py-4 gap-2 ">

          <!-- 1st  Document Selector-->
          <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 gap-2 items-start w-full justify-center p-2"
            ref="isFormVisible">
            <Box title="Document Type" width="w-full">
              <p class="text-sm text-gray-400" v-if="is_document_edit_mode">Fields cannot be changed while in Edit Mode.
              </p>
              <div class="grid grid-cols-2 flex-wrap p-2 gap-3 items-center justify-center w-full" ref="documentChanger"
                tabindex="-1">
                <!-- Select components with change handlers properly defined -->
                <Select :readonly="is_document_edit_mode" :error="v$.republic_act_number.$error" skip
                  :options="republic_act" v-model="formData.republic_act_number" label="Republic Act"
                  @change="PublicationSetter" />
                <Select :readonly="is_document_edit_mode" :error="v$.petition_type.$error" skip :options="petition_type"
                  v-model="formData.petition_type" label="Petition Type" @change="petition_by_type_retriever" />
                <Select :readonly="is_document_edit_mode" :error="v$.event_type.$error" skip :options="event_type"
                  v-model="formData.event_type" label="Document Type" @change="change_event_selected_error_in" />
                <div class="flex flex-row items-center gap-2 ml-4 mt-4">
                  <CheckBox :readonly="is_document_edit_mode" skip v-model="formData.is_migrant"
                    @change="change_migrant" />
                  <p class="text-sm font-medium text-gray-800 uppercase">Migrant</p>
                </div>
              </div>
            </Box>
            <!-- {{ petitioner_number }} -->
            <Box title="Document Header" width="w-full">
              <div class="flex flex-col gap-2 w-full">

                <InputAutoComplete label="Province" @change="formData.header_municipality = ''"
                  :error="v$.header_province.$error" v-model="formData.header_province" :suggestion_data="province" />
                <InputAutoComplete label="City/Municipality" :error="v$.header_municipality.$error" cap
                  v-model="formData.header_municipality" :suggestion_data="municipality_of" />

              </div>
            </Box>
          </div>
          <!-- 2nd Header-->
          <div class="flex flex-col gap-2 overflow-y-scroll py-3 mt-5 px-10">
            <HeaderCCE :petition_type="formData.petition_type" :type_label="document_type_label" />
          </div>
          <!-- 3rd Petition Details and Address-->
          <div class="grid grid-cols-1 gap-2">
            <Box title="Petition Details" width="w-full">
              <div class="grid grid-cols-1 w-full gap-2">
                <div class="w-full flex flex-col">
                  <label class="basis-[100%] block mb-2 text-sm font-medium text-gray-900 dark:text-white">Petition
                    Number</label>
                  <MultiInput @type-petition-number="change_petitioner_number" @type-year="change_petitioner_date" skip
                    :migrant="formData.is_migrant" :republic_act="is_default_republic_act"
                    :type="is_default_petition_type" :petition_number_value="is_default_petitioner_number" />
                </div>
                <Input :error="v$.petitioner_name.$error" label="Petitioner Name" v-model="formData.petitioner_name"
                  cap />
              </div>
            </Box>

            <Box title="Petitioner Nationality & Complete Address" width="w-full">
              <div class="grid grid-cols-3 w-full gap-2">
                <Input :error="v$.nationality.$error" label="Nationality" v-model="formData.nationality" skip />
                <div class=" col-span-2">
                  <InputAutoComplete :error="v$.petitioner_address.$error" label="Petitioner Address"
                    v-model="formData.petitioner_address" :wait="true" :suggestion_data="all_" />

                </div>
              </div>
            </Box>
          </div>
          <!-- 5th  Seeking and Document Owner and Relation-->
          <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-2 items-stretch">
            <div class="basis-[35%]" v-if="
              formData.event_type === 'Birth' ||
              formData.event_type === 'Marriage' ||
              formData.event_type !== 'Death'
            ">
              <Box title="seeking for correction of the clerical error in: " width="w-full">
                <div class="grid grid-rows-2 gap-2 w-full">


                  <Selector @change_="change_document_owner_relation()" :options="seeking_options"
                    v-model="formData.petitioner_error_in" />

                </div>
              </Box>
            </div>
            <div class="basis-[60%] grow">
              <Box title="Document Owner & Relationship to the Owner" width="w-full">
                <div class=" grid grid-cols-1 w-full gap-2">
                  <div class="w-full flex flex-col gap-2">
                    <p v-if="formData.petitioner_error_in === 'my'" class="text-xs text-gray-700"><span
                        class="font-medium">Note:</span> If the petitioner's name differs from the one on the birth
                      certificate, please enter the name exactly as it appears on the birth certificate in this field.
                      If the
                      names match, leave the box checked.</p>
                    <div v-if="formData.petitioner_error_in === 'my'" class="flex flex-row gap-2 items-center">
                      <CheckBox v-model="is_same_as_petitioner_name" @change="changes_document_owner" />
                      <p class="text-xs font-medium">Same as Petitioner Name</p>
                    </div>
                    <!-- 
                    {{ formData.petitioner_error_in }}
                    {{ formData.event_type }}
                    {{ is_same_as_petitioner_name }} -->
                    <Input v-if="formData.petitioner_error_in"
                      :readonly="(formData.petitioner_error_in === 'my' && formData.event_type === 'Birth' || formData.event_type === 'Marriage') && is_same_as_petitioner_name ? true : false"
                      :error="v$.document_owner.$error" label="Document Owner" v-model="formData.document_owner"
                      @input="formData.document_owner = $event.target.value.toUpperCase()" />
                    <p v-else class="text-sm italic text-gray-700">Please choose an option. </p>

                    <!-- If Marriage -->
                    <Input v-if="formData.petitioner_error_in === 'my' && formData.event_type === 'Marriage'"
                      label="Spouse Name" v-model="formData.spouse_name" :error="v$.spouse_name.$error"
                      @input="formData.spouse_name = $event.target.value.toUpperCase()" />



                  </div>
                  <div v-if="
                    formData.event_type === 'Birth' ||
                    formData.event_type === 'Death' ||
                    (formData.event_type === 'Marriage' && formData.petitioner_error_in === 'the')
                  ">
                    <InputAutoComplete v-if="formData.petitioner_error_in === 'the'" :error="v$.relation_owner.$error"
                      label="Relation" v-model="formData.relation_owner" :readonly="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                        ? true
                        : false || formData.petitioner_error_in === ''
                        " :skip="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
                          ? true
                          : false || formData.petitioner_error_in === ''
                          " />
                  </div>
                </div>
              </Box>
            </div>
          </div>
          <!-- 6th Event Date and Place-->
          <div class="flex sm:flex-col md:lg:flex-row gap-2">
            <div class="basis-[30%]">
              <Box :title="IHeSheLabel" width="w-full">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input :error="v$.event_date.$error" type="date" :label="event_date_label"
                    v-model="formData.event_date" />

                </div>
              </Box>
            </div>

            <div class="basis-[45%]">
              <Box title=", at" width="w-full ">
                <div class="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-2">
                  <InputAutoComplete skip :error="v$.event_country.$error" label="Country"
                    v-model="formData.event_country" :suggestion_data="countryList.countryList" />
                  <InputAutoComplete :error="v$.event_province.$error" label="Province"
                    @change="formData.event_municipality = ''" v-model="formData.event_province"
                    :suggestion_data="province" />
                  <InputAutoComplete :error="v$.event_municipality.$error" label="Municipality"
                    v-model="formData.event_municipality" :suggestion_data="municipality" />
                  <!-- <Input label="Country" v-model="formData.event_country" skip /> -->
                  <!-- <Input label="Province" v-model="formData.event_province" /> -->
                  <!-- <Input label="Municipalty" v-model="formData.event_municipality" /> -->
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box :title="`The ${registry_label} was recorded under`" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2 sm:mt-5">
                  <Input :error="v$.registry_number.$error" label="Registry Number"
                    v-model="formData.registry_number" />
                </div>
              </Box>
            </div>
          </div>
          <!-- 7th Clerical Errors And Facts and Reasons-->
          <div class="flex flex-row flex-wrap gap-2">
            <!-- Subpart 1: Shows when Petition Type is CCE -->
            <div class="grow" v-if="formData.petition_type === 'CCE'">
              <Box title="The clerical error(s) to be corrected is (are): " width="w-full">
                <div class="flex flex-col gap-2 w-full font-bold relative">
                  <div class="absolute w-auto -top-4 right-4">
                    <p class="text-xs italic text-gray-400 font-normal">
                      <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1 text-blue-600" />
                      <span class="font-medium text-blue-600">Crtl + Space</span> to add new column
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

                  <p class="text-xs text-gray-300"> {{ formData.clerical_errors.length }}</p>

                  <div class="flex flex-row w-full items-center gap-2" v-for="(value, index) in clerical_errors_items"
                    :key="index">
                    <div class="basis-[10%]">
                      <Input center type="number" @keydown="(event) => handleKeyClerical(event, 1)"
                        @change="generate_granted_text()" v-model="formData.clerical_errors[index].error_num" nolabel />
                    </div>

                    <div class="grow">
                      <InputAutoComplete @keydown="(event) => handleKeyClerical(event, 2)"
                        @change="generate_granted_text()" nolabel @keydown.ctrlKey="add_clerical_error()"
                        :suggestion_data="petitions.saved_clerical"
                        v-model="formData.clerical_errors[index].description" />
                    </div>
                    <div class="grow">
                      <Input nolabel @keydown="(event) => handleKeyClerical(event, 3)" @change="generate_granted_text()"
                        cap v-model="formData.clerical_errors[index].error_description_from" />
                    </div>
                    <div class="grow">
                      <Input nolabel @keydown="(event) => handleKeyClerical(event, 4)" @change="generate_granted_text()"
                        cap v-model="formData.clerical_errors[index].error_description_to" />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2 mt-3">
                    <button @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" type="button"
                      @click="remove_clerical_error()" v-if="clerical_errors_items.length > 1" tabindex="-1"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Remove
                    </button>
                    <button type="button" @click="add_clerical_error()" tabindex="-1" @keydown.down="focusNextInput"
                      @keydown.up="focusPreviousInput"
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
                  <Input :error="v$.first_name_from.$error" label="From" @change="generate_granted_text()"
                    @input="formData.first_name_from = $event.target.value.toUpperCase()"
                    v-model="formData.first_name_from" />
                  <Input :error="v$.first_name_to.$error" @change="generate_granted_text()"
                    @input="formData.first_name_to = $event.target.value.toUpperCase()" label="To"
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
                <div class="flex flex-col gap-6 text-md font-base justify-center">
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
                        <Input :error="v$.ground_b_data.$error" cap nolabel :class="`flex text-center`"
                          v-model="formData.ground_b_data" :readonly="formData.ground_b ? false : true"
                          :skip="formData.ground_b ? false : true" />
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
                        <Input :error="v$.ground_f_data.$error" nolabel v-model="formData.ground_f_data"
                          :class="`flex text-center`" :readonly="formData.ground_f ? false : true"
                          :skip="formData.ground_f ? false : true" />
                      </div>
                      ________________________________________________________.
                    </div>
                  </div>
                </div>
              </Box>
            </div>
            <!-- Subpart 3: Shows when Petition Type CCE -->
            <div class="basis-[100%]" v-if="formData.petition_type !== 'CFN'">
              <Box title="The facts/reasons for filing this petition are the following. " width="w-auto">
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
                      <textarea rows="3" :id="index" v-model="formData.reasons[index].reason"
                        class="block py-3 tracking-wider px-6 text-justify font-semibold w-full text-md text-black bg-gray-50 rounded-sm border border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 outline-none ring-0 focus:border-green-400"></textarea>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 w-full gap-2" v-else>
                  <TextArea :rows="4" label="Facts/Reasons" v-model="formData.reasons[0].reason" />
                </div>
              </Box>
            </div>
          </div>
          <!-- 8th Supporting Documents Note: Need to fix buttons and designs-->
          <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-2">
            <div class="grow">
              <Box title=" documents to support this petition: " width="w-auto">
                <div class="flex flex-col w-full gap-2 mt-5 relative">
                  <div class="absolute w-auto -top-9 right-4">
                    <p class="text-xs italic text-gray-400 font-normal">
                      <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1 text-blue-600" />
                      <span class="font-medium text-blue-600">Crtl + Space</span> to add new column
                    </p>
                  </div>
                  <div class="flex flex-row w-full gap-2 items-center" v-for="(value, index) in supporting_items"
                    :key="index">
                    <p class="basis-[9%] text-sm text-center">
                      {{ indexToLetter(index) }} )
                    </p>
                    <div class="basis-[90%]">

                      <InputAutoComplete :skip_next_count="true" @keydown="(event) => handleKeySupporting(event, 1)"
                        nolabel :suggestion_data="petitions.saved_supporting"
                        v-model="formData.supporting_documents[index].document_name" />


                      <!-- <Input v-model="formData.supporting_documents[index].document_name" /> -->
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <!-- Make this component -->
                    <button tabindex="-1" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" type="button"
                      @click="remove_supporting_documents()" v-if="supporting_items.length > 1"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Remove
                    </button>
                    <button tabindex="-1" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" type="button"
                      @click="add_supporting_documents()"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-green-400 hover:bg-green-500 hover:shadow-md rounded-sm tracking-wider transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Add
                    </button>
                  </div>
                </div>
              </Box>
            </div>
            <div class="basis-[40%] h-max">
              <Box title="filing this petition at the LCRO of " width="w-auto">
                <div class="grid sm:grid-cols-1 lg:grid-cols-1 justify-center gap-2 w-full">
                  <Input label="City/Municipality" :error="v$.filing_city_municipality.$error" skip
                    v-model="formData.filing_city_municipality" />
                  <Input label="Province " :error="v$.filing_province.$error" skip v-model="formData.filing_province" />
                </div>
              </Box>
            </div>
          </div>

          <!-- 9th  Page 2 Starts-->
          <div class="relative border-b-2 border-dashed border-yellow-400 flex items-center justify-center mt-10 mb-10">
            <p class="absolute bg-white px-2 font-semibold italic text-gray-800">
              PAGE 2
            </p>
          </div>
          <!-- 10th Verification, Administering and CTC-->
          <div class="flex flex-wrap sm:flex-col md:lg:flex-row gap-2">
            <div class="basis-[50%]">
              <Box title="VERIFICATION" width="w-auto">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input label="Petitioner Name" skip v-model="formData.petitioner_name"
                    @input="formData.petitioner_name = $event.target.value.toUpperCase()" />
                </div>
              </Box>
            </div>

            <div class="grow" v-if="!formData.is_migrant">
              <Box title="ADMINISTERING OFFICER" width="w-auto">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input skip label="Name" v-model="formData.administering_officer_name"
                    :error="v$.administering_officer_name.$error" cap />
                  <Input skip label="Position" v-model="formData.administering_officer_position" />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="SUBSCRIBE AND SWORN" width="w-auto">
                <div class="grid sm:grid-cold-1 md:lg:grid-cols-3 w-full gap-2">

                  <Input label="Date Sworn" type="date" skip v-model="formData.subscribe_sworn_date"
                    :error="v$.subscribe_sworn_date.$error" />
                  <Input label="City/Municipality" skip v-model="formData.subscribe_sworn_city_municipality"
                    :error="v$.subscribe_sworn_city_municipality.$error" />
                  <Input label="exhibiting his/her" v-model="formData.exhibiting_his_her"
                    :error="v$.exhibiting_his_her.$error" />
                  <Input :label="formData.exhibiting_his_her || `No.`" v-model="formData.exhibiting_number"
                    :error="v$.exhibiting_number.$error" />
                  <Input label="Issued at" v-model="formData.issued_at" :error="v$.issued_at.$error" />
                  <Input label="Issued on" type="date" v-model="formData.issued_on" :error="v$.issued_on.$error" />
                </div>
              </Box>
            </div>
          </div>
          <!-- 11th Action Taken-->
          <div class="flex flex-row gap-2">

            <div class="basis-[100%]">
              <Box title="ACTION TAKEN BY THE C/MCR" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2">
                  <!-- Subpart 1: Shows when republic act is 9048 -->
                  <div v-if="formData.republic_act_number === '9048'" class="flex flex-col">
                    <div class="flex flex-row justify-evenly gap-2">
                      <Selector :options="action_options" v-model="formData.petition_actions[0].action_decision" />

                      <!-- <Radio :options="action_options" :name="'action_' + 0"
                        v-model="formData.petition_actions[0].action_decision" /> -->
                    </div>
                    <!-- Migrant -->
                    <div v-if="!formData.is_migrant" class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                      <textarea tabindex="0" id="message" rows="6" v-model="formData.petition_actions[0].action_text"
                        class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 outline-none ring-0 focus:border-green-400"></textarea>
                    </div>
                  </div>
                  <!-- Migrant -->
                  <!-- Subpart 1: Shows when republic act is 10172 -->
                  <div v-if="formData.republic_act_number === '10172' && !formData.is_migrant" class="flex flex-col"
                    v-for="(value, index) in clerical_errors_items" :key="index">
                    <div class="flex flex-row justify-evenly">
                      <!-- <Radio :options="action_options" :name="'action_' + index"
                        v-model="formData.petition_actions[index].action_decision" /> -->

                      <Selector :options="action_options" v-model="formData.petition_actions[index].action_decision" />
                    </div>
                    <div class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                      <textarea tabindex="0" id="message" rows="6"
                        v-model="formData.petition_actions[index].action_text"
                        class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 outline-none ring-0 focus:border-green-400"></textarea>
                    </div>
                  </div>

                  <!-- Migrant -->
                  <div v-if="!formData.is_migrant" class="grid grid-cols-2 gap-4 px-14 lg:px-24 lg:gap-10">
                    <Input type="date" label="Date" skip v-model="formData.action_taken_date"
                      :error="v$.action_taken_date.$error" />
                    <Input label="Municipal Civil Registrar" v-if="formData.is_migrant" skip readonly />
                    <Input label="Municipal Civil Registrar" skip v-if="!formData.is_migrant"
                      v-model="formData.municipal_civil_registrar" cap :error="v$.municipal_civil_registrar.$error" />
                  </div>
                </div>
              </Box>
            </div>



          </div>
          <!-- 12th Payment and Date Preview-->
          <div class="flex sm:flex-col md:lg:flex-row gap-2">
            <div class=" flex flex-col  gap-2 basis-[35%]">
              <Box title="Payment of filing fee" width="w-auto  ">

                <div class="flex flex-col justify-between items-center w-full">
                  <div class="grid grid-cols-1 w-full gap-2">
                    <div class="flex flex-row gap-2 items-center p-4">
                      <CheckBox @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
                        v-model="formData.is_indigent" @change="is_indigent()" />
                      <label for="" class="font-medium text-sm">Indigent</label>
                    </div>
                    <Input :readonly="formData.is_indigent" :skip="formData.is_indigent" label="O.R. No." type="text"
                      v-model="formData.o_r_number" />
                    <Input :readonly="formData.is_indigent" :skip="formData.is_indigent" v-if="formData.is_indigent"
                      label="Amount Paid" v-model="formData.amount_paid" />
                    <Input :readonly="formData.is_indigent" v-if="formData.is_indigent" label="Date Paid" skip
                      v-model="formData.date_paid" />


                    <InputCurrency @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
                      v-if="!formData.is_indigent" label="Amount Paid" v-model="formData.amount_paid" />
                    <Input v-if="!formData.is_indigent" label="Date Paid" type="date" skip
                      v-model="formData.date_paid" />

                  </div>
                </div>

              </Box>

              <Box title="Publication Details" width="w-auto"
                v-if="formData.petition_type === 'CFN' || formData.republic_act_number === '10172'">
                <div class="grid grid-cols-1 mt-4 w-full h-full gap-2">

                  <!-- <p class="text-xs italic">Optional, notice for publication</p> -->
                  <Input label="Father Name" v-model="formData.name_father" />
                  <Input label="Mother Name" v-model="formData.name_mother" />

                  <Input label="Name of Newspaper" skip v-model="formData.publication_newspaper" />
                  <Input label="Place of Publication" skip v-model="formData.publication_place" />

                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="DATE Configuration" width="w-auto">
                <div class="flex flex-col w-full gap-2 items-start">
                  <div class="grid grid-cols-2 w-full gap-2">
                    <Input skip label="Date Filled" type="date" v-model="formData.date_filed"
                      :error="v$.date_filed.$error" />
                    <Input skip label="Notice of Posting" type="date" v-model="formData.notice_posting"
                      :error="v$.notice_posting.$error" />
                  </div>

                  <div class="flex flex-col items-center w-full gap-2 bg-yellow-100/20 mt-3">
                    <div class="border border-dashed border-yellow-400 w-full mb-5"></div>
                    <p class="font-bold text-center uppercase">Certificate of Posting</p>
                    <div class="flex flex-row w-full justify-evenly relative">
                      <div>
                        <Input skip label="Start" type="date" v-model="formData.certificate_posting_start"
                          :error="v$.certificate_posting_start.$error" />
                      </div>
                      <p class="absolute top-10 font-bold text-xs">TO</p>
                      <div>
                        <Input skip label="End" type="date" v-model="formData.certificate_posting_end"
                          :error="v$.certificate_posting_end.$error" />
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="w-auto">
                        <Input skip label="Date Issued" type="date" v-model="formData.petition_date_issued"
                          :error="v$.petition_date_issued.$error" />
                      </div>
                    </div>
                    <div class="border border-dashed border-yellow-400 w-full mt-5"></div>
                  </div>
                  <div class="grid grid-cols-2 w-full gap-4"
                    v-if="formData.petition_type === 'CFN' || formData.republic_act_number === '10172'">
                    <Input skip :error="v$.publication_start.$error" label="Publication Start" type="date"
                      v-model="formData.publication_start" />
                    <Input skip label="And" type="date" v-model="formData.publication_and" />
                    <Input skip :error="v$.publication_end.$error" label="Publication End" type="date"
                      v-model="formData.publication_end" />
                  </div>
                  <div class="flex flex-col justify-start gap-5 mt-3 items-start w-full">
                    <div class="w-[50%]">
                      <Input skip label="Date Granted" type="date" v-model="formData.petition_date_granted"
                        :error="v$.petition_date_granted.$error" />
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </div>


        </div>
      </div>

      <template v-slot:footer>
        <div class="h-full flex items-center justify-start gap-2 w-full px-5 rounded-md font-medium ">
          <div class="flex flex-row items-center gap-6">
            <div class="flex flex-row items-center gap-2">
              <CheckBox skip v-model="formData.is_to_validate" tabindex="-1" />
              <p class="text-sm font-medium text-gray-200">Validate Layout</p>
            </div>

          </div>
          <button type="button" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
            class="bg-white ml-auto px-2.5 py-1  text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300 hover:bg-blue-500 hover:text-white"
            @click="submitForm()"><font-awesome-icon icon="fa-solid fa-right-to-bracket" /> {{ !is_document_edit_mode ?
              'Submit' : 'Update' }}</button>
        </div>
      </template>
    </Modal>


  </div>
</template>

<script setup>

/**
 * 
 * 
 * 
 * 
 * 
 */

import { usePetitions } from "../../stores/Petition/petitions.js";
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import { ref, onMounted, reactive, computed, defineAsyncComponent, watch, nextTick } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Header from "../../components/essentials/header.vue";
import Modal from "../../components/client/modal/Modal.vue";
import Button from "../../components/essentials/buttons/Button.vue";
import Box from '../../components/essentials/Box.vue'
import Select from "../../components/essentials/inputs/Select.vue";
import HeaderCCE from "../../components/essentials/HeaderCCE.vue";
import Input from "../../components/essentials/inputs/Input.vue";
import MultiInput from "../../components/essentials/inputs/PetitionInputs.vue";
import Radio from "../../components/essentials/inputs/Radio.vue";
import InputCurrency from "../../components/essentials/inputs/InputCurrency.vue";
import { useSetup } from "../../stores/Setting/setup.js";
import CheckBox from "../../components/essentials/buttons/CheckBox.vue";
import TextArea from "../../components/essentials/inputs/TextArea.vue";
import ViewBTn from "../../components/essentials/buttons/table/viewBTn.vue";
import MultiButton from "../../components/essentials/buttons/table/multiButton.vue";
import InputAutoComplete from "../../components/InputAutoComplete.vue";
import countryList from '../../utils/Country.js'
import AlertPath from '../../components/Alert/AlertPath.vue'


import {
  now_date,
  add_date_notice,
  add_date_certificate_start,
  add_date_certificate_end,
  add_date_issued,
  add_date_granted,
  add_publication_start,
  add_publication_end,
  add_date_granted_with_publication,
  add_publication_and,
} from "../../utils/ClericalDateCount.js";

import { grantedText } from "../../utils/GrantedText.js";
import { factReason } from "../../utils/FactsReasons.js";
import ValidateClericalPopup from "../../components/ValidateClericalPopup.vue";
import PDFViewerCCE from "../../components/PDFViewerCCE.vue";
import Wave from "../../components/Wave.vue";


import { all_address, complete_municipality, complete_municipality_with_province_with_words, complete_province } from '../../utils/Address/index.js'

import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";
import PetitionNumberRenderer from "../../components/PetitionNumberRenderer.vue";

import { AuthStore } from "../../stores/Authentication.js";
import Selector from "../../components/Selector.vue";
import DocumentStatus from "../../components/essentials/buttons/table/DocumentStatus.vue";
import EditForm from "../../components/Correction/EditForm.vue";
import RegenerateMessage from "../../components/Correction/RegenerateMessage.vue";
// import { useRouter } from "vue-router";

// const router = useRouter();

const scrollToView = (event) => {

  nextTick(() => {
    event.target.scrollIntoView({
      behavior: "smooth",   // Smooth scrolling
      block: "center",      // Scroll to center of the screen
      inline: "nearest"     // Scroll inline if necessary
    });
  });
};

const tutorial = ref(false)
const quick_settings = ref(false)
const is_regen = ref(false)

const alertmodal = ref(false)
const alertmodal_title = ref()
const alertmodal_body = ref()
const auth = AuthStore()
/**
 * 
 * 
 * 
 * 
 * 
 */

const province = ref(complete_province())
const municipality_of = computed(() => {
  return complete_municipality_with_province_with_words(formData.header_province)
})


const municipality = computed(() => {
  return complete_municipality(formData.event_province)
})

const all_ = ref(all_address())

/**
 * 
 * System Default Settings
 * 
 */
const system_setting = useSetup()

const TableGrid = defineAsyncComponent(() => import("../../components/TableGrid.vue")); // Data Grid


const petitions = usePetitions();
const petition_modal = ref(false)
onMounted(async () => {
  system_setting.getSystemSetting()
  petitions.get_all_petitions()
  petitions.get_saved_supporting_documents()
  petitions.get_saved_clerical_errors()
  auth.isAuthenticated()

});

const is_same_as_petitioner_name = ref(true)

const changes_document_owner = () => {
  if (is_same_as_petitioner_name.value === false) {
    formData.document_owner = ''
  }
  else {
    formData.document_owner = 'N/A'
  }
}
// Validating Stage
const is_validating = ref(false)
const is_creating = ref(false)
const pdf_viewer = ref(false)
const data_pdfs = ref(null)


const open_modal = async () => {
  petition_modal.value = true


  if (is_document_edit_mode.value || is_document_regenerating.value) {
    return
  }
  const cce = await petitions.get_latest_cce()

  if (cce) {
    const latest = cce.data.petition_number.split('-')
    is_default_petitioner_number.value = (parseInt(latest[1], 10) + 1).toString().padStart(4, "0")
  }
  else {
    is_default_petitioner_number.value = '0001'
  }


  formData.notice_posting = add_date_notice().toString()
  formData.certificate_posting_start = add_date_certificate_start().toString()
  formData.certificate_posting_end = add_date_certificate_end().toString()
  formData.petition_date_issued = add_date_issued().toString()
  formData.petition_date_granted = add_date_granted().toString()
  formData.action_taken_date = add_date_granted().toString()


}

function publication_date_setter() {

}


// Optimized Publication Setter
function PublicationSetter() {
  const isCFNorRA10172 = formData.petition_type === 'CFN' || formData.republic_act_number === '10172';

  const publicationDefaults = {
    publication_start: isCFNorRA10172 ? add_publication_start().toString() : '',
    publication_and: isCFNorRA10172 ? add_publication_and().toString() : '',
    publication_end: isCFNorRA10172 ? add_publication_end().toString() : '',
    petition_date_granted: isCFNorRA10172 ? add_date_granted_with_publication().toString() : add_date_granted().toString(),
    publication_newspaper: isCFNorRA10172 ? 'GLOBAL SUNDAY CHRONICLE' : '',
    publication_place: isCFNorRA10172 ? 'PROVINCE OF PANGASINAN' : ''
  };

  // Update formData with publicationDefaults
  Object.assign(formData, publicationDefaults);
}

// Retrieve Latest Petitioner Number
const petition_by_type_retriever = async () => {
  let latestPetitionData;

  // Based on petition type, call appropriate API to retrieve the latest petition
  if (formData.petition_type === 'CCE') {
    latestPetitionData = await petitions.get_latest_cce();
  } else if (formData.petition_type === 'CFN') {
    latestPetitionData = await petitions.get_latest_cfn();
  }

  // Call PublicationSetter once, as it's common for both petition types
  PublicationSetter();

  // Process the retrieved petition data and set the default petitioner number
  if (latestPetitionData) {
    const latest = latestPetitionData.data.petition_number.split('-');
    is_default_petitioner_number.value = (parseInt(latest[1], 10) + 1).toString().padStart(4, "0");
  } else {
    is_default_petitioner_number.value = '0001';
  }
};



const close_modal = () => {
  is_document_edit_mode.value = false
  is_document_regenerating.value = false
  petition_modal.value = false
  supporting_items.value = [0];
  clerical_errors_items.value = [0];
  resetForm()
}
const supporting_items = ref([0])
const clerical_errors_items = ref([0])


const clerical_error_descriptions = ref(
  [
    "Child's first name",
    "Child's middle name",
    "Child's last name"
  ])


// Document Changer Value
const republic_act = ref(['9048', '10172'])
const petition_type = computed(() => {
  switch (formData.republic_act_number) {
    case "9048":
      return ['CCE', 'CFN']
    case "10172":
      formData.petition_type = 'CCE'
      return ['CCE']
    default:
      return []
  }
})
const event_type = computed(() => {
  if (formData.republic_act_number === '9048') {
    switch (formData.petition_type) {
      case "CCE":
        return ['Birth', 'Death', 'Marriage']
      case "CFN":
        formData.event_type = 'Birth'
        return ['Birth']

      default:
        return []
    }
  }
  else {
    formData.event_type = 'Birth'
    return ['Birth']
  }
})

// Petitioner Number Variables
const is_default_petition_type = computed(() => {
  return formData.petition_type === 'CCE' ? 'CCE' : 'CFN'
})
const is_default_petitioner_number = ref('')
const is_default_petitioner_year = ref(new Date().getFullYear())
const is_default_republic_act = computed(() => {
  return formData.republic_act_number === '9048' ? '9048' : '10172'
})

// Granted Text
// MAIN FUNCTION THAT GENERATES GRANTED TEXT
// NOTE: MAKE THIS WORK IN 10172
const granted_text_data = computed(() => {
  const data = ref({
    from: formData.first_name_from,
    to: formData.first_name_to,
    event_type: formData.event_type,
    petition_type: formData.petition_type,
    clerical_errors: formData.clerical_errors,
  });
  const granted = grantedText(data);
  return granted;
});

function generate_granted_text() {
  if (!formData.is_migrant) {
    formData.petition_actions[0].action_text = granted_text_data.value
  }
  return
}


// FACT AND REASON AUTO GENERATE FUNCTION
// MAIN FUNCTION THAT GENERATES FACT AND REASON
// NOTE: MAKE THIS WORK IN 10172
const fact_reason_data = computed(() => {
  const data = ref({
    petitioner_error_in: formData.petitioner_error_in,
    petition_type: formData.petition_type,
    event_type: formData.event_type,
    relation_owner: formData.relation_owner
  })

  const fact_reason = factReason(data)
  return fact_reason
})


// Petitiner Number Values
function change_petitioner_number(e) {
  is_default_petitioner_number.value = e
}
function change_petitioner_date(e) {
  is_default_petitioner_year.value = e
}

// Main Petitioner Number
const petitioner_number = computed(() => {
  const is_r_a_10172 = formData.republic_act_number === '10172' ? 'R.A. 10172' : ``
  const petition_check = formData.is_migrant ? 'MP' + formData.petition_type : formData.petition_type
  let combined = petition_check + "-" + is_default_petitioner_number.value + "-" + is_default_petitioner_year.value + ' ' + is_r_a_10172
  return combined
})



const backround_per_event = computed(() => {
  // return formData.event_type === 'Birth' ? 'bg-green-300' : formData.event_type === 'Death' ? 'bg-blue-300' : formData.event_type === 'Marriage' ? 'bg-red-300' : ''
})
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


function is_indigent() {
  if (!formData.is_indigent) {

    formData.o_r_number = ''
    formData.amount_paid = ''
    formData.date_paid = new Date().toISOString().split('T')[0]
    return
  }

  formData.o_r_number = 'Indigent'
  formData.amount_paid = 'Indigent'
  formData.date_paid = 'Indigent'

}



function indexToLetter(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[index].toLowerCase();
}


const handleKeyClerical = (event, index) => {
  if (event.ctrlKey && event.code === 'Space') {

    event.preventDefault();
    add_clerical_error()

    const to_add = index === 1 ? 4 : index === 2 ? 3 : index === 3 ? 2 : index === 4 ? 1 : ''

    setTimeout(() => {

      console.log('to add: ' + to_add)
      next_input(event, to_add)
    }, 100);

  }
};

const handleKeySupporting = (event, index) => {
  if (event.ctrlKey && event.code === 'Space') {
    event.preventDefault();
    add_supporting_documents()

    const to_add = index
    setTimeout(() => {
      next_input(event, to_add)
    }, 50);

  }

};

const next_input = (event, to_add) => {
  event.preventDefault();
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index > 0) {
    inputs[index + to_add].focus();
  }
}




// Function that adds clerical error field
function add_clerical_error() {
  clerical_errors_items.value.push('');
  console.log(clerical_errors_items.value)
  const newClericalError = {
    error_num: '',
    description: '',
    error_description_from: '',
    error_description_to: '',
  };

  formData.clerical_errors.push(newClericalError);

  if (formData.republic_act_number === '10172') {
    // Reason
    const newReason = {
      error_num: clerical_errors_items.value.length.toString(),
      reason: ''
    }
    formData.reasons.push(newReason)

    // Actions
    const newActions = {
      error_num: clerical_errors_items.value.length.toString(),
      action_decision: 'Granted',
      action_text: ''
    }
    formData.petition_actions.push(newActions);
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
  const newSupportingDocuments = {
    document_name: ''
  }
  formData.supporting_documents.push(newSupportingDocuments);
}
function remove_supporting_documents() {
  if (supporting_items.value.length > 1) {
    const indexToRemove = supporting_items.value.length - 1;
    supporting_items.value.splice(indexToRemove, 1);
    formData.supporting_documents.splice(indexToRemove, 1);
  }
}

// Document Changer Dynamically Change the Error in 
function change_event_selected_error_in() {
  changes_document_owner()
  formData.event_type === 'Birth' ? (formData.petitioner_error_in = 'my', formData.document_owner = 'N/A', formData.relation_owner = 'N/A') :
    formData.event_type === 'Death' ? (formData.petitioner_error_in = 'the', formData.document_owner = '', formData.relation_owner = '') :
      formData.event_type === 'Marriage' ? (formData.petitioner_error_in = 'my', formData.document_owner = '', formData.relation_owner = 'Spouse') : ''
}
function change_document_owner_relation() {
  if (formData.event_type === 'Marriage' && formData.petitioner_error_in === 'my') {
    formData.document_owner = ''
    formData.relation_owner = 'Spouse'
    return
  }
  if (formData.petitioner_error_in === 'my') {
    formData.document_owner = 'N/A'
    formData.relation_owner = 'N/A'
  }
  else if (formData.petitioner_error_in === 'the') {
    formData.document_owner = ''
    formData.relation_owner = ''
  }


}

// Migrant Changes 


function change_migrant() {
  if (formData.is_migrant) {
    formData.administering_officer_name = ''
    formData.administering_officer_position = ''
    formData.event_province = ''
    formData.event_municipality = ''

    formData.action_taken_date = ''
    formData.header_province = ''
    formData.header_municipality = ''


  }
  else {

    formData.administering_officer_name = system_setting.defaults[0].petition_default_administering_officer_name || ''
    formData.administering_officer_position = system_setting.defaults[0].petition_default_administering_officer_position || ''
    formData.event_province = system_setting.defaults[0].petition_default_filling_province || ''
    formData.event_municipality = system_setting.defaults[0].petition_default_filling_municipality || ''

    formData.action_taken_date = add_date_granted().toString()
    formData.header_province = system_setting.defaults[0].header_province || ''
    formData.header_municipality = system_setting.defaults[0].header_municipality || ''

  }
}


// Tabs


const focusPreviousInput = (event) => {
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index > 0) {
    inputs[index - 1].focus();
  }
}

const focusNextInput = (event) => {
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
}


const initialForm = {
  id: '', //For Update Only
  status: 'PENDING',
  created_by: auth.user_id,


  header_province: system_setting.defaults[0].header_province || '',
  header_municipality: system_setting.defaults[0].header_municipality || '',
  // header_ss: system_setting.defaults[0].header_ss || '',


  // Petition
  is_migrant: false,



  date_filed: new Date().toISOString().split('T')[0],
  republic_act_number: '9048',
  petition_type: 'CCE',
  event_type: 'Birth',

  petition_number: petitioner_number,

  petitioner_name: '', // TESTING
  nationality: 'Filipino',
  petitioner_address: '', // Testing 
  petitioner_error_in: '',

  document_owner: '',
  // For Marriage Only
  spouse_name: '',



  relation_owner: '',
  event_date: '',// Testing 
  event_country: 'Philippines',
  event_province: system_setting.defaults[0].petition_default_filling_province || '',// Testing 
  event_municipality: system_setting.defaults[0].petition_default_filling_municipality || '',// Testing 
  registry_number: '',// Testing 
  filing_city_municipality: system_setting.defaults[0].petition_default_filling_municipality || '',
  filing_province: system_setting.defaults[0].petition_default_filling_province || '',

  administering_officer_name: system_setting.defaults[0].municipal_civil_registrar || '', // Testing 
  administering_officer_position: 'Municipal Civil Registrar', // Testing
  subscribe_sworn_date: new Date().toISOString().split('T')[0],
  subscribe_sworn_city_municipality: system_setting.defaults[0].petition_default_subscribe_sworn_municipality || '',

  // Community Tax Certificate or Other ID
  exhibiting_his_her: 'Community Tax Certificate No.',
  exhibiting_number: '',


  // community_tax_certificate: '',// Testing
  issued_at: system_setting.defaults[0].petition_default_issued_at || '',

  issued_on: new Date().toISOString().split('T')[0],
  action_taken_date: '',// Testing
  municipal_civil_registrar: system_setting.defaults[0].municipal_civil_registrar || '',
  // Payment
  is_indigent: false,
  o_r_number: '',// Testing
  amount_paid: '',// Testing
  date_paid: new Date().toISOString().split('T')[0],

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

  // Publications
  name_father: '',
  name_mother: '',
  publication_start: '',
  publication_and: '',
  publication_end: '',
  publication_newspaper: '',
  publication_place: '',

  publication_newspaper: '',
  publication_place: '',

  // Actions, Checked

  petition_actions: [
    { error_num: '1', action_decision: 'Granted', action_text: '' }
  ],

  // Supporting Documents, Checked

  supporting_documents: [
    { document_name: '' }
  ],


  // Clerical Errors, 

  clerical_errors: [
    {
      error_num: '',
      description: '',
      error_description_from: '',
      error_description_to: '',
    }
  ],

  // Reasons 
  reasons: [
    { error_num: '1', reason: '' }
  ],

  // For Setting will not be added in database
  is_to_validate: true
}

const rules = computed(() => {
  return {


    header_province: { required },
    header_municipality: { required },



    status: { required },
    created_by: { required },

    date_filed: { required },
    republic_act_number: { required },
    petition_type: { required },
    event_type: { required },
    petition_number: { required },
    petitioner_name: { required },
    nationality: { required },
    petitioner_address: { required },
    petitioner_error_in: { required },


    document_owner: { required },
    spouse_name: {
      requiredIf: requiredIf(() =>
        formData.petitioner_error_in === 'my' && formData.event_type === 'Marriage'
      )
    },

    relation_owner: { required },
    event_date: { required },
    event_country: { required },
    event_province: { required },
    event_municipality: { required },
    registry_number: { required },
    filing_city_municipality: { required },
    filing_province: { required },



    // Administering Officer
    administering_officer_name: {
      requiredIf: requiredIf(() =>
        !formData.is_migrant ? true : false
      )
    },
    // administering_officer_position: { required },
    subscribe_sworn_date: { required },
    subscribe_sworn_city_municipality: { required },


    // community_tax_certificate: { required },
    exhibiting_his_her: { required },
    exhibiting_number: { required },

    issued_at: { required },
    issued_on: { required },


    action_taken_date: {
      requiredIf: requiredIf(() =>
        !formData.is_migrant ? true : false
      )
    },
    municipal_civil_registrar: {
      requiredIf: requiredIf(() =>
        !formData.is_migrant ? true : false
      )
    },

    /**
     * Change of First Name Fields
     */

    first_name_from: {
      requiredIf: requiredIf(() =>
        formData.petition_type === "CFN" && formData.first_name_from === "" ? true : false
      )
    },
    first_name_to: {
      requiredIf: requiredIf(() =>
        formData.petition_type === "CFN" && formData.first_name_to === "" ? true : false
      )
    },

    ground_b_data: {
      requiredIf: requiredIf(() =>
        formData.ground_b && formData.petition_type === "CFN" ? true : false
      )
    },
    ground_f_data: {
      requiredIf: requiredIf(() =>
        formData.ground_f && formData.petition_type === "CFN" ? true : false
      )
    },

    /**
     *  Required Dates
     */

    notice_posting: { required },
    certificate_posting_start: { required },
    certificate_posting_end: { required },
    petition_date_issued: { required },
    petition_date_granted: {
      requiredIf: requiredIf(() =>
        !formData.is_migrant ? true : false
      )
    },

    // name_father: {
    //   requiredIf: requiredIf(() =>
    //     formData.petition_type === "CFN" || formData.republic_act_number === '10172' ? true : false
    //   )
    // },

    // name_mother: {
    //   requiredIf: requiredIf(() =>
    //     formData.petition_type === "CFN" || formData.republic_act_number === '10172' ? true : false
    //   )
    // },

    publication_and: {
      requiredIf: requiredIf(() =>
        formData.petition_type === "CFN" || formData.republic_act_number === '10172' ? true : false
      )
    },

    publication_start: {
      requiredIf: requiredIf(() =>
        formData.petition_type === "CFN" || formData.republic_act_number === '10172' ? true : false
      )
    },
    publication_end: {
      requiredIf: requiredIf(() =>
        formData.petition_type === "CFN" || formData.republic_act_number === '10172' ? true : false
      )
    },

    /**
     *  Validation for Dynamically Changing List
     * 
     */


  };
});


const formData = reactive({ ...initialForm })

watch(
  () => [formData.petitioner_error_in, formData.petition_type, formData.event_type, formData.relation_owner],
  () => {
    formData.reasons[0].reason = fact_reason_data.value.message;
  }
);
watch(
  () => formData.petition_date_granted,
  (newValue) => {
    formData.action_taken_date = newValue;
  }
);

watch(
  () => formData.action_taken_date,
  (newValue) => {
    formData.petition_date_granted = newValue;
  }
);
const resetForm = () => {
  is_document_edit_mode.value = false

  supporting_items.value = [0];
  clerical_errors_items.value = [0];
  Object.assign(formData, { ...initialForm });
  v$.value.$reset();
};


const v$ = useVuelidate(rules, formData);




const submitForm = async () => {


  v$.value.$touch();

  if (v$.value.$error) {
    console.log(v$.value);
    return;
  }

  const data = {

    header_province: formData.header_province,
    header_municipality: formData.header_municipality,


    // Petition
    is_migrant: formData.is_migrant,



    status: formData.status,
    created_by: formData.created_by,

    date_filed: formData.date_filed,
    republic_act_number: formData.republic_act_number,
    petition_type: formData.petition_type,
    event_type: formData.event_type,
    petition_number: formData.petition_number,
    petitioner_name: formData.petitioner_name,
    nationality: formData.nationality,
    petitioner_address: formData.petitioner_address,
    petitioner_error_in: formData.petitioner_error_in,

    document_owner: formData.document_owner,
    // If marriage
    spouse_name: formData.spouse_name,

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

    exhibiting_his_her: formData.exhibiting_his_her,
    exhibiting_number: formData.exhibiting_number,
    // community_tax_certificate: formData.community_tax_certificate,

    issued_at: formData.issued_at,
    issued_on: formData.issued_on,
    action_taken_date: formData.action_taken_date,
    municipal_civil_registrar: formData.municipal_civil_registrar,
    o_r_number: formData.o_r_number,
    amount_paid: formData.amount_paid,
    date_paid: formData.date_paid,
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


    notice_posting: formData.notice_posting,
    certificate_posting_start: formData.certificate_posting_start,
    certificate_posting_end: formData.certificate_posting_end,
    petition_date_issued: formData.petition_date_issued,
    petition_date_granted: formData.petition_date_granted,

    // Publication CFN or 10172
    name_father: formData.name_father,
    name_mother: formData.name_mother,
    publication_start: formData.publication_start,
    publication_and: formData.publication_and,
    publication_end: formData.publication_end,
    publication_newspaper: formData.publication_newspaper,
    publication_place: formData.publication_place,



    petition_actions: formData.petition_actions,
    supporting_documents: formData.supporting_documents,
    clerical_errors: formData.clerical_errors,
    reasons: formData.reasons,

    //Is Indigent
    is_indigent: formData.is_indigent,


    // For Settings Only, will not be added in database
    is_to_validate: formData.is_to_validate

  }

  const petition_ = JSON.stringify(data);


  const generate_ = await window.ClericalApi.createPetitionDocument(petition_);
  last_saved_filepath.value = generate_.filepath


  if (!formData.is_to_validate) {
    create_validated_document()
    petition_modal.value = false
    return
  } else {
    is_validating.value = true
  }

  petition_modal.value = false
};

const last_saved_filepath = ref(null)

const create_validated_document = async () => {

  if (last_saved_filepath.value === null) {
    return
  }

  if (alertmodal.value) { return }
  const is_busy = await window.ClericalApi.IsFileBusy(last_saved_filepath.value + 'petition.docx')

  if (is_busy) {
    alertmodal.value = true
    alertmodal_body.value = 'The file is currently open. Please save and close the file before proceeding.'
    alertmodal_title.value = 'File Busy'
    setTimeout(() => {
      alertmodal.value = false
      alertmodal_body.value = ''
      alertmodal_title.value = ''
    }, 3000);
    return
  }

  is_validating.value = false
  is_creating.value = true

  const settings = {
    orignal_path: last_saved_filepath.value,
    petition_number: formData.petition_number,
    path_where_to_save: system_setting.defaults[0].petition_default_file_path,
    republic_act_number: formData.republic_act_number,
    petition_type: formData.petition_type,
    petitioner_name: formData.petitioner_name,
    document_owner: formData.document_owner,
    relation_owner: formData.relation_owner,
    prepared_by: auth.user,
    event_type: formData.event_type,
    date_filed: formData.date_filed
  }

  const check = await window.ClericalApi.proceedCreatePetition(JSON.stringify(settings));

  if (!check.status) {
    is_validating.value = true
    is_creating.value = false


    alertmodal.value = true
    alertmodal_title.value = 'Something went wrong... Please Try Again'
    alertmodal_body.value = check.message

    setTimeout(() => {
      alertmodal.value = false
      alertmodal_title.value = ''
      alertmodal_body.value = ''
    }, 3000);

    return
  }


  const petition_ = ref({

    header_province: formData.header_province,
    header_municipality: formData.header_municipality,


    is_migrant: formData.is_migrant,


    status: formData.status,
    created_by: formData.created_by,

    file_path: check.filepath,
    // filed_by_user: auth.user_id,
    //
    date_filed: formData.date_filed,
    republic_act_number: formData.republic_act_number,
    petition_type: formData.petition_type,
    event_type: formData.event_type,
    petition_number: formData.petition_number,
    petitioner_name: formData.petitioner_name,
    nationality: formData.nationality,
    petitioner_address: formData.petitioner_address,
    petitioner_error_in: formData.petitioner_error_in,

    document_owner: formData.document_owner,
    // If marriage
    spouse_name: formData.spouse_name,

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


    exhibiting_his_her: formData.exhibiting_his_her,
    exhibiting_number: formData.exhibiting_number,

    // community_tax_certificate: formData.community_tax_certificate,



    issued_at: formData.issued_at,
    issued_on: formData.issued_on,
    action_taken_date: formData.action_taken_date,
    municipal_civil_registrar: formData.municipal_civil_registrar,
    o_r_number: formData.o_r_number,
    amount_paid: formData.amount_paid,
    date_paid: formData.date_paid,
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


    notice_posting: formData.notice_posting,
    certificate_posting_start: formData.certificate_posting_start,
    certificate_posting_end: formData.certificate_posting_end,
    petition_date_issued: formData.petition_date_issued,
    petition_date_granted: formData.petition_date_granted,


    // Publication CFN or 10172
    name_father: formData.name_father,
    name_mother: formData.name_mother,
    publication_start: formData.publication_start,
    publication_and: formData.publication_and,
    publication_end: formData.publication_end,
    publication_newspaper: formData.publication_newspaper,
    publication_place: formData.publication_place,


    petition_actions: formData.petition_actions,
    supporting_documents: formData.supporting_documents,
    clerical_errors: formData.clerical_errors,
    reasons: formData.reasons,

    //Is Indigent
    is_indigent: formData.is_indigent
  })

  const submit_ = is_document_edit_mode.value || is_document_regenerating.value
    ? petitions.edit_petition(formData.id, petition_.value)
    :
    petitions.add_petition(petition_.value);

  resetForm();

  if (check.status) {
    is_creating.value = false;
    open_generated(check.filepath);
  }
}

const cancel_validating_stage = async () => {
  if (alertmodal.value) { return }

  const is_busy = await window.ClericalApi.IsFileBusy(last_saved_filepath.value + 'petition.docx')

  if (is_busy) {
    alertmodal.value = true
    alertmodal_body.value = 'The file is currently open. Please save and close the file before proceeding.'
    alertmodal_title.value = 'File Busy'

    setTimeout(() => {
      alertmodal.value = false
      alertmodal_body.value = ''
      alertmodal_title.value = ''
    }, 3000);
    return
  }

  is_validating.value = false
  petition_modal.value = true
  await window.ClericalApi.RemoveItem(last_saved_filepath.value)
}

const open_generated = async (path) => {
  const check = await window.ClericalApi.OpenClericalFiles(path);
  console.log(check)
  data_pdfs.value = check
  pdf_viewer.value = !pdf_viewer.value
}
const close_generated = () => {
  console.log('click this')
  pdf_viewer.value = false
  //  router.go(router.currentRoute())
}
// 


const bgTexture = ref(
  "background-image: url(data:image/png;base64,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)"
);






// This is Column Data in Datatable 


const search = ref()

const filteredRowData = computed(() => {
  if (!search.value) return petitions.petitions;
  return petitions.petitions.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const mapDataToForm = (data) => {

  console.log(data)
  const length = data.clerical_errors.length; // Clerical Errors
  const supporting_doc_length = data.supporting_documents.length // Supporting Documents


  // formData.reasons = data.reasons
  formData.id = data.id
  formData.created_by = data.created_by
  formData.action_taken_date = data.action_taken_date
  formData.administering_officer_name = data.administering_officer_name
  formData.administering_officer_position = data.administering_officer_position
  formData.amount_paid = data.amount_paid
  formData.certificate_posting_end = data.certificate_posting_end
  formData.certificate_posting_start = data.certificate_posting_start
  formData.petitioner_name = data.petitioner_name


  formData.clerical_errors = [...data.clerical_errors]
  formData.supporting_documents = [...data.supporting_documents]
  formData.reasons = [...data.reasons]
  formData.petition_actions = [...data.petition_actions]



  formData.date_filed = data.date_filed
  formData.date_paid = data.date_paid
  formData.document_owner = data.document_owner
  formData.event_country = data.event_country
  formData.event_date = data.event_date
  formData.event_municipality = data.event_municipality
  formData.event_province = data.event_province
  formData.event_type = data.event_type
  formData.exhibiting_his_her = data.exhibiting_his_her
  formData.exhibiting_number = data.exhibiting_number
  formData.filing_city_municipality = data.filing_city_municipality
  formData.filing_province = data.filing_province
  formData.first_name_from = data.first_name_from
  formData.first_name_to = data.first_name_to
  formData.ground_a = data.ground_a
  formData.ground_b = data.ground_b
  formData.ground_b_data = data.ground_b_data
  formData.ground_c = data.ground_c
  formData.ground_d = data.ground_d
  formData.ground_e = data.ground_e
  formData.ground_f = data.ground_f
  formData.ground_f_data = data.ground_f_data
  formData.header_municipality = data.header_municipality
  formData.header_province = data.header_province
  // formData.id= data.id
  formData.is_indigent = data.is_indigent
  formData.is_migrant = data.is_migrant
  formData.issued_at = data.issued_at
  formData.issued_on = data.issued_on
  formData.municipal_civil_registrar = data.municipal_civil_registrar
  formData.nationality = data.nationality
  formData.notice_posting = data.notice_posting
  formData.o_r_number = data.o_r_number
  formData.petition_date_granted = data.petition_date_granted
  formData.petition_date_issued = data.petition_date_issued
  // formData.petition_number = data.petition_number

  change_petitioner_number(data.petition_number.split('-')[1])
  formData.petition_type = data.petition_type
  formData.petitioner_address = data.petitioner_address
  formData.petitioner_error_in = data.petitioner_error_in



  formData.name_father = data.name_father,
    formData.name_mother = data.name_mother,

    formData.publication_end = data.publication_end
  formData.publication_newspaper = data.publication_newspaper
  formData.publication_place = data.publication_place
  formData.publication_start = data.publication_start
  formData.publication_and = data.publication_and,
    formData.registry_number = data.registry_number
  formData.relation_owner = data.relation_owner
  formData.remarks = data.remarks
  formData.republic_act_number = data.republic_act_number
  formData.spouse_name = data.spouse_name
  formData.status = data.status
  formData.subscribe_sworn_city_municipality = data.subscribe_sworn_city_municipality
  formData.subscribe_sworn_date = data.subscribe_sworn_date



  // Push blank values to clerical_errors based on its length
  // Add blank values to clerical_errors and supporting_documents based on the length
  if (length > 0) {
    // Loop through the length of clerical_errors and add the necessary empty entries
    for (let i = 1; i < length; i++) {
      clerical_errors_items.value.push(''); // Add an empty value for clerical_errors

    }
  }

  if (supporting_doc_length > 0) {
    // Loop through the length of supporting_documents and add the necessary empty entries
    for (let i = 1; i < supporting_doc_length; i++) {
      supporting_items.value.push(''); // Add an empty value for supporting_documents
    }
  }


};

const is_document_edit_mode = ref(false)
const handleEdit = (data) => {
  console.log(data.clerical_errors.length)
  resetForm()

  is_document_edit_mode.value = true
  mapDataToForm(data);
  petition_modal.value = true;
};
const regen_data = ref()
const openRegenerate = (data) => {
  is_regen.value = true;
  regen_data.value = data;
};

const is_document_regenerating = ref(false)
const handleRegenerate = async () => {
  resetForm()
  is_regen.value = false
  const main_data = regen_data.value
  mapDataToForm(main_data);
  is_document_regenerating.value = true
  submitForm()


  //is_validating.value = true
  // const petition_ = JSON.stringify(data);
  // console.log(petition_)
  // const generate_ = await window.ClericalApi.createPetitionDocument(petition_);
  // last_saved_filepath.value = generate_.filepath

  // console.log(generate_)

}









const colDefs = ref([
  {
    field: "petition_number",
    headerName: "Petitioner Number",
    flex: 2,
    filter: true,
    pinned: "left",
    lockPinned: true,
    cellStyle: { border: "none" },
    width: 240,
    cellRenderer: PetitionNumberRenderer,
  },
  {
    field: "petitioner_name",
    headerName: "Petitioner Name",
    flex: 1,
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    filter: true,
  },
  {
    field: "document_owner",
    cellClass: "font-medium tracking-wider w-full text-gray-900",
    headerName: "Document Owner",
    flex: 1,
    filter: true,
  },
  {
    field: "relation_owner",
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    headerName: "Relationship",
    flex: 1,
    filter: true,
  },
  {
    field: "petition_type",
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    headerName: "Petition Type",
    flex: 1,
    filter: true,
  },
  {
    field: "event_type",
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    headerName: "Document Type",
    flex: 1,
    filter: true,
  },
  {
    field: "date_filed",
    headerName: "Date Filed",
    flex: 1,
    filter: true,
    cellClass: "font-medium tracking-wider w-full text-gray-600",
  },
  {
    field: "created_by_user.username",
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    headerName: "Prepared by",
    flex: 1,
    filter: true,
  },
  {
    headerName: "Document Status",
    flex: 2,
    pinned: "right",
    lockPinned: true,
    resizable: false,
    cellRenderer: DocumentStatus,
    cellClass: "text-center",
    cellStyle: { overflow: "visible", border: "none" },
    sortable: false,
  },
  {
    headerName: "Action",
    cellStyle: { border: "none" },
    pinned: "right",
    width: 100,
    lockPinned: true,
    resizable: true,
    sortable: false,
    cellStyle: { overflow: "visible", border: "none" },
    cellRenderer: ViewBTn,
    cellRendererParams: {
      onClick: handleEdit,
      onRegenerate: openRegenerate,
    },
  },

]);




</script>