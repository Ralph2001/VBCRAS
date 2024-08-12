<template>
  <div class="flex flex-col relative justify-center w-full p-10 CCEMAIN">
    <Header label="FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME">
      <Button label="Create" isActive :class="`rounded`" @click="modalOpener" />
      <button class="text-gray-600"><font-awesome-icon icon="fa-solid fa-gear" /></button>
      <button class="text-gray-600" @click="openSample">Sample</button>
    </Header>

    <div class="h-[calc(100vh-250px)]">
      <PDFViewerCCE v-if="sample" :pdf_data="data_pdfs" @exit-btn="sample = false" />
      <Suspense>
        <template #default>
          <TableGrid :data="petitions.petitions" :dataColumns="colDefs" :suppressRowTransform="true" />
        </template>
        <template #fallback>
          <div class="flex h-full w-full justify-center items-center bg-gray-5/90 border rounded-md">
            <p class="text-md font-normal italic">Loading...</p>
          </div>
        </template>
      </Suspense>
    </div>

    <Modal large label="Create a new Document" footerBG="bg-slate-300" v-if="document"
      :doctype="formData.document_type">
      <template v-slot:header>
        <ModalCloseButton @click="closeModal" />
      </template>

      <div class="flex flex-col sm:px-4 md:lg:px-[20rem] h-max w-full gap-4 relative bg-slate-100" :style="bgTexture">
        <div class="flex items-center justify-center p-2" ref="isFormVisible">
          <Box title="Document" width="w-fit ">
            <div class="flex flex-row flex-wrap p-2 gap-3 items-center justify-center w-full" ref="documentChanger"
              tabindex="-1">
              <Select skip :options="RepublicAct" v-model="formData.ra" label="Republic Act" :error="v$.ra.$error" />
              <Select skip @change="getTheLatestPetitionNumber()" :options="Type" label="Type" :error="v$.type.$error"
                v-model="formData.type" />
              <Select skip :options="DocumentType" label="Document Type" v-model="formData.document_type"
                :error="v$.document_type.$error" />
            </div>
          </Box>
        </div>

        <div class="flex flex-col gap-5 overflow-y-scroll py-3 mt-5 px-10">
          <div class="w-full flex item-center justify-center p-1 mb-5 transition-all shadow-md bg-white">
            <p class="text-lg uppercase font-semibold tracking-wider text-pretty" v-if="formData.type === 'CCE'">
              PETITION FOR CORRECTION OF CLERICAL ERROR IN THE CERTIFICATE OF
              {{ documentTypeLabel }}
            </p>
            <p class="text-lg uppercase font-semibold tracking-widest" v-else>
              PETITION FOR CHANGE OF FIRST NAME
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <Box title="Petition Details" width="w-full">
              <div class="grid grid-cols-1 w-full gap-3">
                <div class="w-full flex flex-col">
                  <label class="basis-[100%] block mb-2 text-sm font-medium text-gray-900 dark:text-white">Petition
                    Number</label>
                  <!-- Petition Number Number -->
                  <!-- Refactor? -->
                  <MultiInput :type="formData.type" :isRa10172="formData.ra" :petition_number_value="petition_number"
                    @petition-number="change_petition_number" @year-input="change_year_value" />
                  <!-- {{ formData.petition_number }} -->
                </div>
                <Input label="Petitioner Name" :error="v$.petitioner_name.$error" v-model="formData.petitioner_name"
                  @input="formData.petitioner_name = $event.target.value.toUpperCase()" />
              </div>
            </Box>

            <Box title="Petitioner Nationality & Complete Address" width="w-full">
              <div class="grid grid-cols-3 w-full gap-2">
                <Input label="Nationality" :error="v$.nationality.$error" v-model="formData.nationality" skip />
                <div class=" col-span-2">
                  <AutoComplete label="Petitioner Address" v-model="formData.petitioner_address"
                    :error="v$.petitioner_address.$error" />
                </div>
              </div>
            </Box>
          </div>

          <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-4 items-stretch">
            <div class="basis-[35%]" v-if="
              formData.document_type === 'Birth' ||
              formData.document_type === 'Marriage' ||
              formData.document_type !== 'Death'
            ">
              <Box title="seeking for correction of the clerical error in: " width="w-full">
                <div class="grid grid-rows-2 gap-2 w-full">
                  <!-- {{formData.cce_in}} -->
                  <Radio :options="seeking_options" v-model="formData.cce_in" :error="v$.cce_in.$error" name="cce_in" />
                </div>
              </Box>
            </div>

            <div class="basis-[60%] grow">
              <Box title="Document Owner & Relationship to the Owner" width="w-full">
                <div class=" grid grid-cols-1 w-full gap-2">
                  <div class="w-full">
                    <Input :error="v$.name_owner.$error" :label="formData.document_type === 'Marriage' && formData.cce_in === 'my'
                      ? 'Complete Name of Spouse'
                      : 'Document Owner'
                      " v-model="formData.name_owner" :value="`Hi`" :readonly="formData.cce_in === 'my' && formData.document_type === 'Birth'
                        ? true
                        : false || formData.cce_in === ''
                        " :skip="formData.cce_in === 'my' && formData.document_type === 'Birth'
                          ? true
                          : false || formData.cce_in === ''
                          " @input="formData.name_owner = $event.target.value.toUpperCase()" />
                  </div>
                  <div v-if="
                    formData.document_type === 'Birth' ||
                    formData.document_type === 'Death' ||
                    (formData.document_type === 'Marriage' && formData.cce_in === 'the')
                  ">
                    <InputSuggestions :error="v$.relation_owner.$error" label="Relation of Owner" :readonly="formData.cce_in === 'my' && formData.document_type === 'Birth'
                      ? true
                      : false || formData.cce_in === ''
                      " :skip="formData.cce_in === 'my' && formData.document_type === 'Birth'
                        ? true
                        : false || formData.cce_in === ''
                        " v-model="formData.relation_owner" :items="RelationSuggestion" />
                  </div>
                </div>
              </Box>
            </div>
          </div>

          <div class="flex sm:flex-col md:lg:flex-row gap-5">
            <div class="basis-[30%]">
              <Box :title="IHeSheLabel" width="w-full">
                <div class="grid grid-cols-1 w-full gap-2">
                  <DateInput :label="date_of_label" v-model="formData.date_of" />
                  <!-- {{ formData.date_of }} -->
                </div>
              </Box>
            </div>

            <div class="basis-[45%]">
              <Box title=", at" width="w-full ">
                <div class="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-2">
                  <Input label="Country" v-model="formData.at_country" skip :error="v$.at_country.$error" />
                  <Input label="Province" v-model="formData.at_province" :error="v$.at_country.$error" />
                  <Input label="Municipalty" v-model="formData.at_city" :error="v$.at_country.$error" />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box :title="`The ${registry_label} was recorded under`" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2 sm:mt-5">
                  <Input label="Registry Number" v-model="formData.registry_number"
                    :error="v$.registry_number.$error" />
                </div>
              </Box>
            </div>
          </div>

          <div class="flex flex-row flex-wrap gap-5">
            <div class="grow" v-if="formData.type === 'CCE'">
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
                  <div class="flex flex-row w-full items-center gap-2" v-for="(item, index) in items" :key="index">
                    <div class="basis-[10%]">
                      <p class="text-sm text-center">
                        {{ index + 1 }}
                      </p>
                    </div>
                    <div class="grow">
                      <InputSuggestions @change="change_granted_text()" nolabel
                        v-model="formData.clerical_errors.description[index]" :items="DescriptionSuggestions"
                        @keyup.ctrl.space="addItem()" />
                    </div>
                    <div class="grow">
                      <Input nolabel @change="change_granted_text()" v-model="formData.clerical_errors.from[index]"
                        @input="
                          formData.clerical_errors.from[
                          index
                          ] = $event.target.value.toUpperCase()
                          " @keyup.ctrl.space="addItem()" />
                    </div>
                    <div class="grow">
                      <Input nolabel @change="change_granted_text()" v-model="formData.clerical_errors.to[index]"
                        @input="
                          formData.clerical_errors.to[
                          index
                          ] = $event.target.value.toUpperCase()
                          " @keyup.ctrl.space="addItem()" />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2 mt-3">

                    <button type="button" @click="removeItem()" v-if="items.length > 1"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Remove
                    </button>
                    <button type="button" @click="addItem()"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-green-400 hover:bg-green-500 hover:shadow-md rounded-sm tracking-wider transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Add
                    </button>
                  </div>
                </div>
              </Box>
            </div>
            <div class="basis-[60%]" v-if="
              formData.type === 'CFN' &&
              formData.document_type === 'Birth' &&
              formData.ra === '9048'
            ">
              <Box title="The first name to be change  " width="w-full">
                <div class="grid grid-cols-2 gap-2 w-full">
                  <Input label="From" @change="change_granted_text()"
                    @input="formData.from = $event.target.value.toUpperCase()" v-model="formData.from"
                    :error="v$.from.$error" />
                  <Input @change="change_granted_text()" @input="formData.to = $event.target.value.toUpperCase()"
                    label="To" v-model="formData.to" :error="v$.to.$error" />
                </div>
              </Box>
            </div>

            <div class="grow" v-if="
              formData.type === 'CFN' &&
              formData.document_type === 'Birth' &&
              formData.ra === '9048'
            ">
              <Box title="The grounds for filing this petition are the following  " width="w-full">
                <div class="flex flex-col gap-5 text-md font-base justify-center">
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">a)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.a" />
                    <div>
                      <label for="">The first name is extremely difficult to write or
                        pronounce;</label>
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">b)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.b" />

                    <div class="relative">
                      I have/He/She has habitually and continuously used
                      <div class="absolute -top-[1.2rem] left-[23rem]">
                        <Input nolabel :class="`flex text-center`" v-model="formData.ground_b"
                          :error="v$.ground_b.$error" :readonly="formData.grounds.b ? false : true"
                          :skip="formData.grounds.b ? false : true" />
                      </div>
                      _______________________________ &nbsp;and I/He/She is publicly known
                      in the community with that first name;
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">c)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.c" />
                    <div for="one">
                      <label for="one" class="cursor-pointer">
                        The first name is tainted with dishonor;</label>
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">d)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.d" />
                    <div>The first name is ridiculous;</div>
                  </div>
                  <div class="flex flex-row gap-2 items-center flex-wrap">
                    <p class="basis-[2%] font-serif">e)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.e" />
                    <div>The first name causes confusion;</div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">f)</p>
                    <CheckBox :error="v$.grounds.$error" v-model="formData.grounds.f" />
                    <div class="relative w-max">
                      Others: (Specify)
                      <div class="absolute -top-[1.2rem] left-[7.4rem] w-full">
                        <Input nolabel :error="v$.ground_f.$error" v-model="formData.ground_f"
                          :class="`flex text-center`" :readonly="formData.grounds.f ? false : true"
                          :skip="formData.grounds.f ? false : true" />
                      </div>
                      ________________________________________________________.
                    </div>
                  </div>
                </div>
              </Box>
            </div>

            <div class="basis-[100%]" v-if="formData.type !== 'CFN'">
              <Box title="The facts/reasons for filing this petition are the following. "
                :error="v$.reasons.$params.prop ? '* Reqiuired Fields' : ''" width="w-ful">
                <div class="flex flex-col w-full" v-if="
                  formData.type === 'CCE' &&
                  formData.document_type === 'Birth' &&
                  formData.ra === '10172'
                ">
                  <div class="flex flex-row w-full p-2 gap-2" v-for="(item, index) in items" :key="index">
                    <div class="basis-[20%] px-8 flex items-center">
                      <label :for="index" class="text-sm text-nowrap w-full font-semibold tracking-wide text-gray-900">
                        For error No. {{ index + 1 }}:
                      </label>
                    </div>
                    <div class="flex flex-col grow">
                      <!-- {{ formData.reasons }} -->
                      <textarea rows="3" :id="index" v-model="formData.reasons[index]" :class="{
                        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                          v$.reasons.$params.prop,
                        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                          .reasons.$params.prop,
                      }"
                        class="block py-3 tracking-wider px-6 text-justify font-semibold w-full text-md text-black bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 w-full gap-2" v-else>
                  <!-- text area here -->
                  <TextArea :rows="4" label="Facts/Reasons" :error="v$.reason.$error" v-model="formData.reason" />
                </div>
              </Box>
            </div>
          </div>

          <div class="flex sm:flex-col md:lg:flex-row flex-wrap gap-2">
            <div class="grow">
              <Box title=" documents to support this petition: " width="w-ful"
                :error="v$.SupportingDocuments.$error ? '* Required Fields' : ''">
                <div class="flex flex-col w-full gap-3 mt-5 relative">
                  <div class="absolute w-auto -top-9 right-4">
                    <p class="text-xs italic text-gray-400 font-normal">
                      <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1" />
                      <span class="font-medium">Crtl + Space</span> to add new column
                    </p>
                  </div>

                  <div class="flex flex-row w-full gap-2 items-center" v-for="(support, index) in SupportItems"
                    :key="index">
                    <p class="basis-[9%] text-sm text-center">
                      {{ indexToLetter(index) }})
                    </p>
                    <div class="basis-[90%]">
                      <InputSuggestions nolabel :error="v$.SupportingDocuments.$error"
                        v-model.trim="formData.SupportingDocuments[index]" :items="SupportingDocumentsSuggestions"
                        @keyup.ctrl.space="addSuppportItem()" @keydown.enter.prevent />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <!-- Make this component -->

                    <button type="button" @click="removeSupportItem()" v-if="SupportItems.length > 1"
                      class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      Remove
                    </button>
                    <button type="button" @click="addSuppportItem()"
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
                  <Input label="City/Municipality" skip v-model="formData.LCRO_city" :error="v$.LCRO_city.$error" />
                  <Input label="Province" skip v-model="formData.LCRO_province" :error="v$.LCRO_province.$error" />
                </div>
              </Box>
            </div>
          </div>

          <!-- //////////// -->
          <!-- Page 2 -->
          <!-- //////////// -->

          <div class="relative border-b-2 border-dashed flex items-center justify-center mt-10 mb-10">
            <p class="absolute bg-white px-2 font-semibold italic text-gray-600">
              PAGE 2
            </p>
          </div>

          <!-- //////////// -->
          <!-- Page 2 -->
          <!-- //////////// -->

          <div class="flex flex-wrap sm:flex-col md:lg:flex-row gap-4">
            <div class="basis-[50%]">
              <Box title="VERIFICATION" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input label="Petitioner Name" skip :error="v$.petitioner_name.$error"
                    v-model="formData.petitioner_name"
                    @input="formData.petitioner_name = $event.target.value.toUpperCase()" readonly />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="ADMINISTERING OFFICER" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input label="Name" skip :error="v$.administering_officer.$error"
                    v-model="formData.administering_officer" @input="
                      formData.administering_officer = $event.target.value.toUpperCase()
                      " />
                  <Input label="Position" :error="v$.administering_position.$error" skip
                    v-model="formData.administering_position" />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="SUBSCRIBE AND SWORN" width="w-ful">
                <div class="grid sm:grid-cold-1 md:lg:grid-cols-3 w-full gap-2">
                  <div></div>
                  <DateInput label="Date Sworn" v-model="formData.SwornDate" />

                  <Input label="City/Municipality" :error="v$.SwornCity.$error" skip v-model="formData.SwornCity" />
                  <Input label="Community Tax Certificate No." :error="v$.Ctc.$error" v-model="formData.Ctc" />
                  <Input label="Issued at" :error="v$.CtcIssuedAt.$error" v-model="formData.CtcIssuedAt" />

                  <DateInput label="Issued on" v-model="formData.CtcIssuedOn" />
                </div>
              </Box>
            </div>
          </div>

          <div class="flex flex-row gap-2">
            <div class="basis-[100%]" v-if="formData.ra !== '10172'">
              <Box title="ACTION TAKEN BY THE C/MCR" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2">
                  <div class="flex flex-row justify-evenly" v-if="formData.ra !== '10172'">
                    <Radio :error="v$.action.$error" :options="action_options" v-model="formData.action"
                      name="action" />
                  </div>
                  <div class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                    <textarea id="message" rows="6" v-model="formData.decision" :class="{
                      'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                        v$.decision.$error,
                      'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                        .decision.$error,
                    }"
                      class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4 px-14 lg:px-24 lg:gap-10">
                    <DateInput label="Date" v-model="formData.date_granted" />

                    <Input label="Municipal Civil Registrar" skip v-model="formData.mcr" :error="v$.mcr.$error"
                      @input="formData.mcr = $event.target.value.toUpperCase()" />
                  </div>
                </div>
              </Box>
            </div>

            <div class="basis-[100%]" v-if="formData.ra === '10172'">
              <Box title="ACTION TAKEN BY THE C/MCR" :error="v$.action_taken.action.$params.prop ||
                v$.action_taken.decision.$params.prop
                ? '* Reqiuired Fields'
                : ''
                " width="full">
                <div class="flex flex-col w-full gap-4">
                  <div class="flex flex-row w-full gap-6 h-full" v-for="(item, index) in items" :key="index">
                    <div class="flex p-2 items-center justify-center basis-[15%]">
                      <label :for="`action_taken` + index + 1" class="font-semibold text-sm text-gray-900">
                        For Error No. {{ index + 1 }}
                      </label>
                    </div>

                    <div class="flex flex-col w-full gap-6">
                      <div class="flex flex-row justify-evenly">
                        <Radio :options="action_options" :error="v$.action_taken.action.$params.prop"
                          :name="`action_taken${index}`" v-model="formData.action_taken.action[index]" />
                      </div>
                      <div class="grid grid-cols-1 w-full gap-2">
                        <textarea :id="`action_taken${index}`" v-model="formData.action_taken.decision[index]" :class="{
                          'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                            v$.action_taken.decision.$params.prop,
                          'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                            .action_taken.decision.$params.prop,
                        }" rows="4"
                          class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 px-24 gap-5">
                    <div class="flex flex-row justify-evenly" v-if="formData.ra !== '10172'">
                      <Radio :options="action_options" v-model="formData.action" :error="v$.action.$error"
                        name="action" />
                    </div>
                    <DateInput label="Date" v-model="formData.date_granted" />

                    <Input label="Municipal Civil Registrar" skip :error="v$.mcr.$error" v-model="formData.mcr"
                      @input="formData.mcr = $event.target.value.toUpperCase()" />
                  </div>
                </div>
              </Box>
            </div>
          </div>

          <div class="flex sm:flex-col md:lg:flex-row gap-2">
            <div class="basis-[35%]">
              <Box title="Payment of filing fee" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input label="O.R. No." type="text" v-model="formData.or_number" />
                  <InputCurrency label="Amount Paid" v-model="formData.amount_paid" />
                  <DateInput label="Date Paid" v-model="formData.DatePaid" />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="DATE PREVIEW" width="w-ful">
                <div class="flex flex-col w-full gap-2 items-start">
                  <div class="w-[50%]">
                    <!-- <DateInput /> -->
                    <DateInput label="Notice of Posting" v-model="formData.notice_posting" />
                  </div>

                  <div class="flex flex-col items-center w-full gap-2 bg-yellow-100/20 mt-3">
                    <div class="border border-dashed border-yellow-400 w-full mb-5"></div>
                    <p class="font-bold text-center uppercase">Certificate of Posting</p>
                    <div class="flex flex-row w-full justify-evenly relative">
                      <div>
                        <DateInput label="Start" v-model="formData.certificate_posting_start" />
                      </div>

                      <p class="absolute top-10 font-bold text-xs">TO</p>
                      <div>
                        <DateInput label="End" v-model="formData.certificate_posting_end" />
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="w-auto">
                        <DateInput label="Date Issued" v-model="formData.date_issued" />
                      </div>
                    </div>
                    <div class="border border-dashed border-yellow-400 w-full mt-5"></div>
                  </div>

                  <div class="flex flex-col justify-start gap-5 mt-3 items-start w-full">
                    <div class="w-[50%]">
                      <DateInput label="Date Granted " v-model="formData.date_granted" />
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>

      <template v-slot:footer>
        <div class="h-full flex items-center justify-end gap-2 w-full px-5 rounded-md font-medium ">
          <button type="button" class="bg-white px-3 py-1.5 hover:bg-blue-500 hover:text-white"
            @click="submitForm()">Submit</button>
          <!-- <Button @click="submitForm()" label="Submit" /> -->
        </div>
      </template>
    </Modal>

    <PetitionInfo v-if="processing" :petition_details="petition_details" :petition_owner="petition_owner"
      :folderpath="folderpath" :isLoading="isProcessInfoLoading" @close-modal="processing = false" />

    <ClericalSettings v-if="settings" @close-modal="closePreference" />
  </div>
</template>

<script setup>
import Radio from "../../components/essentials/inputs/Radio.vue";
import { usePetitions } from "../../stores/Petition/Petitions.js";
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import { ref, reactive, computed, onMounted, watch, defineAsyncComponent } from "vue";
import Select from "../../components/essentials/inputs/Select.vue";
import Input from "../../components/essentials/inputs/Input.vue";
import InputSuggestions from "../../components/essentials/inputs/InputSuggestions.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import {
  now_date,
  add_date_notice,
  add_date_certificate_start,
  add_date_certificate_end,
  add_date_issued,
  add_date_granted,
} from "../../utils/DayPosting.js";

import InputCurrency from "../../components/essentials/inputs/InputCurrency.vue";
import { useAddress } from "../../composables/Address.js";
import Header from "../../components/essentials/header.vue";
import MultiButton from "../../components/essentials/buttons/table/multiButton.vue";
import ViewBTn from "../../components/essentials/buttons/table/viewBTn.vue";
import CheckBox from "../../components/essentials/buttons/CheckBox.vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";
import toOOXML from "../../utils/toOOXML.js";
import PetitionInfo from "../../components/essentials/modal/PetitionInfo.vue";
import Box from "../../components/essentials/Box.vue";
import Modal from "../../components/client/modal/Modal.vue";

import { factReason } from "../../composables/FactsReasons.js";
import { grantedText } from "../../composables/GrantedText.js";
import MultiInput from "../../components/essentials/inputs/MultiInput.vue";
import DateInput from "../../components/essentials/inputs/DateInput.vue";
import Button from "../../components/essentials/buttons/Button.vue";
import { format } from "date-fns";
import TextArea from "../../components/essentials/inputs/TextArea.vue";
import PDFViewerCCE from "../../components/PDFViewerCCE.vue";



const TableGrid = defineAsyncComponent(() => import("../../components/TableGrid.vue"));
const ClericalSettings = defineAsyncComponent(() =>
  import("../../components/essentials/settings/ClericalSettings.vue")
);

const AutoComplete = defineAsyncComponent(() =>
  import("../../components/essentials/inputs/AutoComplete.vue")
);

const documentChanger = ref(null);
const isFormVisible = ref(null);

const document = ref(false); // Modal
const date = new Date();
const RepublicAct = ref(["9048", "10172"]);

const document_owner = ref("");
const ra10172 = ref("");
const petition_number = ref("0000");
const year = ref(date.getFullYear());


// 
// This is Sample only
// 
const sample = ref(false)
const data_pdfs = ref()

const openSample = async () => {

  const check = await window.ClericalApi.OpenClericalFiles();
  data_pdfs.value = check


  console.log(data_pdfs.value)
  sample.value = !sample.value
}
// 









const settings = ref(false);

// Letter List
function indexToLetter(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[index].toLowerCase();
}

const closePreference = (event, value) => {
  settings.value = false;
};

// Petition Data
const petitions = usePetitions();

onMounted(async () => {
  // petitions.getPetitions();
  // const latest = await petitions.getLatestPetition();
  // if (latest) {
  //   getTheLatestPetitionNumber();
  // }
});

// Get Latest Petition Number
// async function getTheLatestPetitionNumber() {
//   let latest_petition_number = petitions.latest.CCE.split("-");

//   if (formData.type === "CCE") {
//     latest_petition_number = petitions.latest.CCE.split("-");
//   } else if (formData.type === "CFN") {
//     latest_petition_number = petitions.latest.CFN.split("-");
//   }

//   const get_second_value = parseInt(latest_petition_number[1], 10);
//   const incrementedNumber = get_second_value + 1;
//   const paddedNumber = incrementedNumber.toString().padStart(4, "0");
//   petition_number.value = paddedNumber;
// }

// Petition Number

const change_petition_number = (e) => {
  petition_number.value = e;
};
const change_year_value = (e) => {
  year.value = e;
};

const petitioner_number = computed(() => {
  formData.ra === "10172" ? (ra10172.value = "R.A 10172") : (ra10172.value = "");
  let combined =
    formData.type +
    "-" +
    petition_number.value +
    "-" +
    year.value +
    " " +
    ra10172.value || "";
  return combined;
});

// Table List
const colDefs = ref([
  {
    field: "petition_number",
    headerName: "Petitioner Number",
    flex: 2,
    filter: true,
    pinned: "left",
    cellClass: "font-semibold tracking-wider w-full text-start ",
    lockPinned: true,
  },
  {
    field: "petitioner_name",
    headerName: "Petitioner Name",
    flex: 1,
    cellClass: "font-medium tracking-wider w-full text-gray-600",
    filter: true,
  },
  {
    field: "name_owner",
    cellClass: "font-medium tracking-wider w-full text-gray-900",
    headerName: "Document Owner",
    flex: 1,
    filter: true,
  },
  {
    field: "document_type",
    cellClass: "font-medium tracking-wider w-full text-gray-600 ",
    headerName: "Document Type",
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
    field: "DatePaid",
    headerName: "Date Filed",
    flex: 1,

    filter: true,
    cellClass: "font-medium tracking-wider w-full text-gray-600",
  },
  {
    headerName: "Status",
    flex: 1,
    pinned: "right",
    lockPinned: true,
    resizable: false,
    cellRenderer: MultiButton,
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
  },
]);

// Petition Info
const folderpath = ref("");
const processing = ref(false);
const isProcessInfoLoading = ref(false);
const petition_details = ref("");
const petition_owner = ref("");

const Type = ref(["CCE", "CFN"]);
const DocumentType = ref(["Birth", "Death", "Marriage"]);

const documentTypeLabel = computed(() => {
  switch (formData.document_type) {
    case "Birth":
      return "Live Birth";
    case "Death":
      return "Death";
    case "Marriage":
      return "Marriage";
    default:
      return "";
  }
});

const IHeSheLabel = computed(() => {
  switch (formData.document_type) {
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

const date_of_label = computed(() => {
  switch (formData.document_type) {
    case "Birth":
      return "Date of Birth";
    case "Death":
      return "Date of Death";
    case "Marriage":
      return "Date of Marriage";
    default:
      return "";
  }
});

const registry_label = computed(() => {
  switch (formData.document_type) {
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

const RelationSuggestion = ref(["Father", "Mother", "Brother", "Sister"]);

const SupportingDocumentsSuggestions = ref([
  "My Certificate of Live Birth",
  "My Baptismal Certificate",
  "My School Records",
  "My Postal ID",
  "My Voter's Certification",
  "My Community Tax Certificate",
]);

const DescriptionSuggestions = ref([
  "Child's first name",
  "Child's middle name",
  "Child's last name",
]);

const seeking_options = computed(() => {
  switch (formData.document_type) {
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

const action_options = ref({
  Granted: "Granted",
  Denied: "Denied (Provide the basis for denial)",
});

const RA = ref(["R.A. 9048", "R.A. 10172"]);

// const date_now = ref(now_date()); sira ito
const date_notice = ref(add_date_notice());
const date_certificate_start = ref(add_date_certificate_start());
const date_certificate_end = ref(add_date_certificate_end());
const date_of_issued = ref(add_date_issued());
const date_of_granted = ref(add_date_granted());

function add_petition_date() {
  formData.SwornDate = format(new Date(), "MMMM dd, yyyy");
  formData.DatePaid = format(new Date(), "MMMM dd, yyyy");
  formData.notice_posting = date_notice;
  formData.certificate_posting_start = date_certificate_start;
  formData.certificate_posting_end = date_certificate_end;
  formData.date_issued = date_of_issued;
  formData.date_granted = date_of_granted;
}

// v-model
const initialData = {
  ra: "9048",
  type: "CCE",
  document_type: "Birth",
  petition_number: petitioner_number,
  petitioner_name: "",
  nationality: "Filipino",

  petitioner_address: "",
  cce_in: "", //

  name_owner: "",
  relation_owner: "",
  date_of: "",

  at_city: "",
  at_province: "",
  at_country: "Philippines",

  registry_number: "",

  clerical_errors: {
    description: [],
    from: [],
    to: [],
  },


  from: "",
  to: "",
  grounds: {
    a: false,
    b: true,
    c: false,
    d: false,
    e: false,
    f: false,
  },
  ground_b: "",
  ground_f: "",

  reason: "",
  reasons: [],

  SupportingDocuments: [],
  LCRO_city: "Bayambang",
  LCRO_province: "Pangasinan",

  // Page 2

  administering_officer: "ISMAEL D. MALICDEM, JR.",
  administering_position: "Municipal Civil Registrar",

  SwornDate: "",
  SwornCity: "Bayambang, Pangasinan",

  Ctc: "",
  CtcIssuedOn: "",
  CtcIssuedAt: "Bayambang, Pangasinan",

  action: "",
  ActionDate: "",

  action_taken: {
    action: [],
    decision: [],
  },

  mcr: "ISMAEL D. MALICDEM, JR.",
  decision: "",

  or_number: "",
  amount_paid: "",
  DatePaid: "",

  notice_posting: "",
  certificate_posting_start: "",
  certificate_posting_end: "",

  date_issued: "",
  date_granted: "",
};

const formData = reactive({ ...initialData });

const fact_reasons_data = computed(() => {
  const data = ref({
    cce_in: formData.cce_in,
    type: formData.type,
    document_type: formData.document_type,
    relation_owner: formData.relation_owner,
  });
  return data;
});
const granted_text_data = computed(() => {
  const data = ref({
    from: formData.from,
    to: formData.to,
    document_type: formData.document_type,
    type: formData.type,
    clerical_errors: formData.clerical_errors,
  });
  return data;
});

function change_granted_text() {
  const granted = grantedText(granted_text_data.value);
  formData.decision = granted;
}

watch(
  () => [formData.cce_in, formData.relation_owner],
  (data) => {
    const reason = factReason(fact_reasons_data.value);
    formData.reason = reason;
  },
  { deep: true }
);

watch(
  () => formData.cce_in,
  (cce_in) => {
    cce_in === "my" && formData.document_type === "Birth"
      ? [(formData.name_owner = "N/A"), (formData.relation_owner = "N/A")]
      : cce_in === "my" && formData.document_type === "Marriage"
        ? [(formData.name_owner = ""), (formData.relation_owner = "Spouse")]
        : [(formData.name_owner = ""), (formData.relation_owner = "")];
  }
);

watch(
  () => formData.ra,
  (RA) => {
    if (RA === "9048") {
      Type.value = ["CCE", "CFN"];
      DocumentType.value = ["Birth", "Death", "Marriage"];
      v$.value.$reset();
    } else if (RA === "10172") {
      v$.value.$reset();
      Type.value = ["CCE"];
      DocumentType.value = ["Birth"];

      formData.cce_in = "";
      formData.document_type = "Birth";
      formData.name_owner = "";
      formData.relation_owner = "";
      formData.type = "CCE";
    }
  }
);

watch(
  () => formData.type,
  (type) => {
    if (type === "CFN") {
      v$.value.$reset();
      formData.document_type = "Birth";
      formData.cce_in = "";
      DocumentType.value = ["Birth"];
    } else if (formData.type === "CCE" && formData.ra !== "10172") {
      v$.value.$reset();
      formData.cce_in = "";
      DocumentType.value = ["Birth", "Death", "Marriage"];
    }
  }
);

watch(
  () => formData.document_type,
  (document_type) => {
    if (document_type === "Birth") {
      v$.value.$reset();
      formData.name_owner = "N/A";
      formData.relation_owner = "N/A";
      formData.cce_in = "";
    } else if (document_type === "Death") {
      v$.value.$reset();
      formData.cce_in = "the";
    } else {
      v$.value.$reset();
      formData.cce_in = "";
      formData.name_owner = "";
      formData.relation_owner = "";
    }
  }
);

const { provinces, municipality, barangay } = useAddress(() => [
  formData.petitioner_province,
  formData.petitioner_city,
]);

const { at_province, at_city } = useAddress(() => [formData.at_province]);

const RA9048 = ref(false);

const modalOpener = async () => {
  add_petition_date();
  // const latest = await petitions.getLatestPetition();
  // if (latest) {
  //   getTheLatestPetitionNumber();
  // }
  document.value = !document.value;
};

function closeModal() {
  document.value = false;
}

const items = ref([1]);
const addItem = () => {
  items.value.push("");
};
const removeItem = () => {
  if (items.value.length > 1) {
    const indexToRemove = items.value.length - 1;
    items.value.splice(indexToRemove, 1);
    formData.clerical_errors.description.splice(indexToRemove, 1);
    formData.clerical_errors.from.splice(indexToRemove, 1);
    formData.clerical_errors.to.splice(indexToRemove, 1);
  }
};

const SupportItems = ref([1]);
const addSuppportItem = () => {
  SupportItems.value.push("");
};
const removeSupportItem = () => {
  if (SupportItems.value.length > 1) {
    const indexToRemove = SupportItems.value.length - 1;
    SupportItems.value.splice(indexToRemove, 1);
    formData.SupportingDocuments.splice(indexToRemove, 1);
  }
};

const validate_grounds = computed(() => {
  if (!Object.values(formData.grounds).some((value) => value)) {
    return true;
  } else {
    return false;
  }
});


const validate_reasons = computed(() => {
  if (formData.ra !== "10172") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (i >= formData.reasons.length || formData.reasons[i] === "") {
      return true;
    }
  }

  return false;
});

const validate_action_taken_action = computed(() => {
  if (formData.ra !== "10172" && formData.type !== "CCE") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (
      i >= formData.action_taken.action ||
      formData.action_taken.action[i] === "" ||
      formData.action_taken.action[i] == null
    ) {
      return true;
    }
  }

  return false;
});

const validate_action_taken_decision = computed(() => {
  if (formData.ra !== "10172" && formData.type !== "CCE") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (
      i >= formData.action_taken.decision ||
      formData.action_taken.decision[i] === "" ||
      formData.action_taken.decision[i] == null
    ) {
      return true;
    }
  }

  return false;
});

const validate = computed(() => {
  return {
    ra: { required },
    type: { required },
    document_type: { required },
    petition_number: { required },
    petitioner_name: { required },
    nationality: { required },
    // petitioner_province: { required },
    // petitioner_city: { required },
    // petitioner_barangay: { required },
    petitioner_address: { required },
    cce_in: { required },

    name_owner: { required },
    relation_owner: { required },

    date_of: { required },
    at_city: { required },
    at_province: { required },
    at_country: { required },
    registry_number: { required },

    clerical_errors: {
      description: { required },
      from: { required },
      to: { required }
    },


    reasons: requiredIf(validate_reasons),
    action_taken: {
      action: requiredIf(validate_action_taken_action),
      decision: requiredIf(validate_action_taken_decision),
    },

    // required  if
    SupportingDocuments: { required },


    from: {
      requiredIf: requiredIf(() =>
        formData.type === "CFN" && formData.from === "" ? true : false
      ),
    },
    to: {
      requiredIf: requiredIf(() =>
        formData.type === "CFN" && formData.to === "" ? true : false
      ),

    },
    grounds: requiredIf(validate_grounds),
    ground_b: {
      requiredIf: requiredIf(() =>
        formData.type === "CFN" && formData.grounds.b && formData.ground_b === ""
          ? true
          : false
      ),
    },
    ground_f: {
      requiredIf: requiredIf(() =>
        formData.type === "CFN" && formData.grounds.f && formData.ground_f === ""
          ? true
          : false
      ),
    },

    reason: {
      requiredIf: requiredIf(() =>
        formData.type === "CFN" ? false : true
      ),
    },

    LCRO_city: { required },
    LCRO_province: { required },

    administering_officer: { required },
    administering_position: { required },
    SwornDate: { required },
    SwornCity: { required },
    Ctc: { required },
    CtcIssuedOn: { required },
    CtcIssuedAt: { required },
    action: { required },

    //

    mcr: { required },
    decision: { required },
    // or_number: { required },
    // amount_paid: { required },
    // DatePaid: { required },
    notice_posting: { required },
    certificate_posting_start: { required },
    certificate_posting_end: { required },
    date_issued: { required },
    date_granted: { required },
  };
});

const v$ = useVuelidate(validate, formData);

const submitForm = async () => {
  // Validate 
  // v$.value.$touch();

  // if (v$.value.$error) {
  //   console.log(v$.value);
  //   return;
  // }


  // Fix This

  const OOXML = toOOXML(formData.decision);

  // closeModal();
  const clerical_errors = ref({
    description: formData.clerical_errors.description,
    from: formData.clerical_errors.from,
    to: formData.clerical_errors.to,
  });

  // action_taken: {
  //   action: [],
  //   decision: [],
  // },
  const actions = ref({
    action: formData.action_taken.action,
    decision: formData.action_taken.decision,
  });

  const errors = JSON.stringify(clerical_errors.value);
  const supports = JSON.stringify(formData.SupportingDocuments);
  const reasons = JSON.stringify(formData.reasons);
  const actionsdata = JSON.stringify(actions.value);

  const grounds = ref({
    a: formData.grounds.a,
    b: formData.grounds.b,
    c: formData.grounds.c,
    d: formData.grounds.d,
    e: formData.grounds.e,
    f: formData.grounds.f,
  });

  const grounds_filing = JSON.stringify(grounds.value);

  if (formData.name_owner === "" && formData.relation_owner === "") {
    formData.name_owner = "N/A";
    formData.relation_owner = "N/A";
  }

  const decisionFormatted = "<w:p>" + OOXML + "</w:p>";

  // petitioner_province: formData.petitioner_province,
  // petitioner_city: formData.petitioner_city,
  // petitioner_barangay: formData.petitioner_barangay,

  const data = {
    ra: formData.ra,
    type: formData.type,
    document_type: formData.document_type,

    petition_number: formData.petition_number,
    petitioner_name: formData.petitioner_name,
    nationality: formData.nationality,

    petitioner_address: formData.petitioner_address,

    cce_in: formData.cce_in,
    name_owner: formData.name_owner,
    relation_owner: formData.relation_owner,
    date_of: formData.date_of,

    at_city: formData.at_city,
    at_province: formData.at_province,
    at_country: formData.at_country,

    registry_number: formData.registry_number,

    clerical_errors: errors,
    supportingDocuments: supports,

    // Change First Name
    grounds: grounds_filing,
    from: formData.from,
    to: formData.to,
    ground_b: formData.ground_b,
    ground_f: formData.ground_f,
    // Change First Name

    reason: formData.reason,
    LCRO_city: formData.LCRO_city,
    LCRO_province: formData.LCRO_province,

    administering_officer: formData.administering_officer,
    administering_position: formData.administering_position,

    SwornDate: formData.SwornDate,
    SwornCity: formData.SwornCity,

    Ctc: formData.Ctc,
    CtcIssuedOn: formData.CtcIssuedOn,
    CtcIssuedAt: formData.CtcIssuedAt,

    action: formData.action,
    ActionDate: formData.ActionDate,
    mcr: formData.mcr,
    decision: decisionFormatted,

    or_number: formData.or_number,
    amount_paid: formData.amount_paid,
    DatePaid: formData.DatePaid,

    notice_posting: formData.notice_posting,
    certificate_posting_start: formData.certificate_posting_start,
    certificate_posting_end: formData.certificate_posting_end,

    date_issued: formData.date_issued,
    date_granted: formData.date_granted,

    // CCE 10172
    reasons: reasons,
    action_taken: actionsdata,
  };

  const check = await window.ClericalApi.PrintLiveBirth(data);

  console.log(data)
  console.log(check)
  // processing.value = true;
  // isProcessInfoLoading.value = true;

  // if (check) {
  //   // const convert = await window.LocalCivilApi.ConvertFile()

  //   const database = {
  //     ra: formData.ra,
  //     type: formData.type,
  //     document_type: formData.document_type,
  //     petition_number: formData.petition_number,
  //     petitioner_name: formData.petitioner_name,
  //     nationality: formData.nationality,

  //     // petitioner_province: formData.petitioner_province,
  //     // petitioner_city: formData.petitioner_city,
  //     // petitioner_barangay: formData.petitioner_barangay,

  //     petitioner_address: formData.petitioner_address,
  //     cce_in: formData.cce_in,

  //     name_owner: formData.name_owner,
  //     relation_owner: formData.relation_owner,
  //     date_of: formData.date_of,

  //     at_city: formData.at_city,
  //     at_province: formData.at_province,
  //     at_country: formData.at_country,

  //     registry_number: formData.registry_number,

  //     clerical_errors: errors,
  //     supportingDocuments: supports,

  //     // Change First Name
  //     grounds: grounds_filing,
  //     from: formData.from,
  //     to: formData.to,
  //     ground_b: formData.ground_b,
  //     ground_f: formData.ground_f,
  //     // Change First Name

  //     reason: formData.reason,
  //     LCRO_city: formData.LCRO_city,
  //     LCRO_province: formData.LCRO_province,

  //     administering_officer: formData.administering_officer,
  //     administering_position: formData.administering_position,

  //     SwornDate: formData.SwornDate,
  //     SwornCity: formData.SwornCity,

  //     Ctc: formData.Ctc,
  //     CtcIssuedOn: formData.CtcIssuedOn,
  //     CtcIssuedAt: formData.CtcIssuedAt,

  //     action: formData.action,
  //     ActionDate: formData.ActionDate,
  //     mcr: formData.mcr,
  //     decision: formData.decision,

  //     or_number: formData.or_number,
  //     amount_paid: formData.amount_paid,
  //     DatePaid: formData.DatePaid,

  //     notice_posting: formData.notice_posting,
  //     certificate_posting_start: formData.certificate_posting_start,
  //     certificate_posting_end: formData.certificate_posting_end,

  //     date_issued: formData.date_issued,
  //     date_granted: formData.date_granted,

  //     // CCE 10172
  //     reasons: reasons,
  //     action_taken: actionsdata,
  //     filepath: check.filepath,
  //   };

  //   const add = await petitions.addPetition(database);
  //   if (add) {
  //     v$.value.$reset();

  //     const latest = await petitions.getLatestPetition();
  //     if (latest) {
  //       getTheLatestPetitionNumber();
  //     }
  //   }
  // }

  // isProcessInfoLoading.value = false;

  // folderpath.value = check.filepath;
  // let document_owner =
  //   formData.name_owner === "N/A" ? formData.petitioner_name : formData.name_owner;

  // if (check) {
  //   petition_details.value =
  //     "R.A " +
  //     formData.ra +
  //     " " +
  //     formData.type +
  //     " " +
  //     formData.document_type +
  //     ",  " +
  //     formData.petitioner_name;
  //   petition_owner.value = document_owner;
  // }
};

const bgTexture = ref(
  "background-image: url(data:image/png;base64,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)"
);
</script>
