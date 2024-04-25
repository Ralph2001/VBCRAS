<style scoped>
.animate__animated.animate__fadeIn,
.animate__animated.animate__fadeOut {
  --animate-duration: 0.2s;
}
</style>
<template>
  <div class="flex flex-col relative justify-center w-full">
    <Header label="FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME">
      <Button label="Create" isActive :class="`rounded-sm`" @click="modalOpener" />
      <ButtonIcon @click="settings = true">
        <font-awesome-icon icon="fa-solid fa-gear"
      /></ButtonIcon>
    </Header>

    <div class="h-[calc(100vh-190px)] px-5">
      <TableGrid
        :data="petitions.petitions"
        :dataColumns="colDefs"
        :suppressRowTransform="true"
      />
    </div>

    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <Modal large label="Create a new Document" v-if="document">
        <template v-slot:header>
          <ModalCloseButton @click="closeModal" />
        </template>

        <div class="p-2">
          <Box title="Document" width="w-fit">
            <div class="grid grid-cols-3 p-2 gap-3">
              <Select
                skip
                :options="RepublicAct"
                v-model="formData.ra"
                label="Republic Act"
                :error="v$.ra.$error"
              />
              <Select
                skip
                @change="getTheLatestPetitionNumber()"
                :options="Type"
                label="Type"
                :error="v$.type.$error"
                v-model="formData.type"
              />
              <Select
                skip
                :options="DocumentType"
                label="Document Type"
                v-model="formData.document_type"
                :error="v$.document_type.$error"
              />
            </div>
          </Box>
          <!-- 
          {{ formData.ra }}
          {{ formData.type }}
          {{ formData.document_type }} -->
        </div>

        <div class="flex flex-col gap-5 overflow-y-scroll py-3 mt-5 px-10">
          <div
            class="w-full flex item-center justify-center p-1 mb-5 transition-all bg-[#F3F4F6]"
          >
            <p
              class="text-lg uppercase font-semibold tracking-wider"
              v-if="formData.type === 'CCE'"
            >
              PETITION FOR CORRECTION OF CLERICAL ERROR IN THE CERTIFICATE OF
              {{ documentTypeLabel }}
            </p>
            <p class="text-lg uppercase font-semibold tracking-widest" v-else>
              PETITION FOR CHANGE OF FIRST NAME
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <Box title="Petition Details" width="w-full">
              <div class="grid grid-cols-1 w-full">
                <div class="w-full flex flex-col">
                  <label
                    class="basis-[100%] block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Petition Number</label
                  >
                  <div class="flex flex-row items-center gap-2 w-full">
                    <div class="flex flex-row gap-[4px] w-[50%] relative">
                      <div class="basis-[60%]">
                        <input
                          disabled
                          v-model="formData.type"
                          type="text"
                          class="bg-gray-50 border-s-gray-300 border-t-gray-300 border-b-gray-300 border-e-white font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                        />
                      </div>

                      <div class="basis-[50%]">
                        <input
                          v-model="petition_number"
                          v-maska
                          data-maska="####"
                          type="text"
                          class="bg-gray-50 border border-s-white border-e-white text-center border-gray-300 font-bold text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                        />
                      </div>

                      <div class="basis-[60%]">
                        <input
                          v-model="year"
                          type="text"
                          tabindex="-1"
                          :class="{
                            'border-e-gray-300': formData.ra === '9048',
                            'border-e-0': formData.ra === '10172',
                          }"
                          class="bg-gray-50 border-t-gray-300 border-b-gray-300 border-s-white font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div class="w-[7rem]">
                      <div class="basis-[20%]" v-if="formData.ra === '10172'">
                        <input
                          value="R.A 10172"
                          type="text"
                          disabled
                          tabindex="-1"
                          class="bg-gray-50 border-e-gray-300 text-center border-t-gray-300 border-b-gray-300 border-s-white font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Input
                  label="Petitioner Name"
                  :error="v$.petitioner_name.$error"
                  v-model="formData.petitioner_name"
                  @input="formData.petitioner_name = $event.target.value.toUpperCase()"
                />
              </div>
            </Box>

            <Box title="Petitioner Nationality & Complete Address" width="w-full">
              <div class="grid grid-cols-2 w-full gap-2">
                <Input
                  label="Nationality"
                  :error="v$.nationality.$error"
                  v-model="formData.nationality"
                  skip
                />

                <selectLocation
                  @change="formData.petitioner_city = ''"
                  :options="provinces[0]"
                  :error="v$.petitioner_province.$error"
                  id="province"
                  v-model="formData.petitioner_province"
                  Province
                />

                <selectLocation
                  :options="municipality[0]"
                  :error="v$.petitioner_city.$error"
                  v-model="formData.petitioner_city"
                  City
                  id="city"
                />
                <selectLocation
                  :options="barangay[0]"
                  :error="v$.petitioner_barangay.$error"
                  v-model="formData.petitioner_barangay"
                  Barangay
                  id="barangay"
                />
              </div>
            </Box>
          </div>
          <div class="flex flex-row flex-wrap gap-4 items-stretch">
            <div
              class="basis-[35%]"
              v-if="
                formData.document_type === 'Birth' ||
                formData.document_type === 'Marriage' ||
                formData.document_type !== 'Death'
              "
            >
              <Box
                title="seeking for correction of the clerical error in: "
                width="w-full"
              >
                <div class="grid grid-rows-2 gap-2 w-full">
                  <Radio
                    :options="seeking_options"
                    v-model="formData.cce_in"
                    :error="v$.cce_in.$error"
                    name="cce_in"
                  />
                </div>
              </Box>
            </div>

            <div class="basis-[60%] grow">
              <Box title="Document Owner & Relationship to the Owner" width="w-full">
                <div class="flex flex-row w-full gap-2">
                  <div
                    :class="{
                      grow:
                        (formData.document_type === 'Marriage' &&
                          formData.cce_in === 'my') ||
                        (formData.document_type === 'Marriage' && formData.cce_in === ''),
                    }"
                    class="basis-[70%]"
                  >
                    <Input
                      :error="v$.name_owner.$error"
                      :label="
                        formData.document_type === 'Marriage' && formData.cce_in === 'my'
                          ? 'Complete Name of Spouse'
                          : 'Document Owner'
                      "
                      v-model="formData.name_owner"
                      :value="`Hi`"
                      :readonly="
                        formData.cce_in === 'my' && formData.document_type === 'Birth'
                          ? true
                          : false || formData.cce_in === ''
                      "
                      :skip="
                        formData.cce_in === 'my' && formData.document_type === 'Birth'
                          ? true
                          : false || formData.cce_in === ''
                      "
                      @input="formData.name_owner = $event.target.value.toUpperCase()"
                    />
                  </div>
                  <div
                    class="grow"
                    v-if="
                      formData.document_type === 'Birth' ||
                      formData.document_type === 'Death' ||
                      (formData.document_type === 'Marriage' && formData.cce_in === 'the')
                    "
                  >
                    <InputSuggestions
                      :error="v$.relation_owner.$error"
                      label="Relation of Owner"
                      :readonly="
                        formData.cce_in === 'my' && formData.document_type === 'Birth'
                          ? true
                          : false || formData.cce_in === ''
                      "
                      :skip="
                        formData.cce_in === 'my' && formData.document_type === 'Birth'
                          ? true
                          : false || formData.cce_in === ''
                      "
                      v-model="formData.relation_owner"
                      :items="RelationSuggestion"
                    />
                  </div>
                </div>
              </Box>
            </div>
          </div>
          <div class="flex flex-row gap-5">
            <div class="basis-[30%]">
              <Box :title="IHeSheLabel" width="w-full">
                <div class="grid grid-cols-1 w-full gap-2">
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >{{ date_of_label }}</label
                    >
                    <VueDatePicker
                      :text-input="dateInputOptions"
                      v-model="formData.date_of"
                      auto-apply
                      :max-date="new Date()"
                      input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                      format="MMMM dd, yyyy"
                      model-type="MMMM dd, yyyy"
                      :month-change-on-scroll="false"
                      position="right"
                    />
                  </div>
                </div>
              </Box>
            </div>

            <div class="basis-[45%]">
              <Box title=", at" width="w-full ">
                <div class="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-2">
                  <Input
                    label="Country"
                    v-model="formData.at_country"
                    readonly
                    skip
                    :error="v$.at_country.$error"
                  />

                  <selectLocation
                    @change="formData.at_city = ''"
                    :options="at_province[0]"
                    id="at_province"
                    v-model="formData.at_province"
                    :error="v$.at_province.$error"
                    Province
                  />
                  <selectLocation
                    :options="at_city[0]"
                    v-model="formData.at_city"
                    :error="v$.at_city.$error"
                    City
                    id="at_city"
                  />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box :title="`The ${registry_label} was recorded under`" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2 sm:mt-5">
                  <Input
                    label="Registry Number"
                    v-model="formData.registry_number"
                    :error="v$.registry_number.$error"
                  />
                </div>
              </Box>
            </div>
          </div>

          <div class="flex flex-row flex-wrap gap-5">
            <div class="grow" v-if="formData.type === 'CCE'">
              <Box
                title="The clerical error(s) to be corrected is (are): "
                width="w-full"
              >
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

                <div class="flex flex-col gap-2 w-full mt-5">
                  <div
                    class="flex flex-row w-full items-center gap-2"
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <div class="basis-[10%]">
                      <p class="text-sm text-center">
                        {{ index + 1 }}
                      </p>
                    </div>
                    <div class="grow">
                      <InputSuggestions
                        nolabel
                        :error="v$.clerical_errors.description.$params.prop"
                        v-model="formData.clerical_errors.description[index]"
                        :items="DescriptionSuggestions"
                      />
                    </div>
                    <div class="grow">
                      <Input
                        nolabel
                        v-model="formData.clerical_errors.from[index]"
                        :error="v$.clerical_errors.from.$params.prop"
                        @input="
                          formData.clerical_errors.from[
                            index
                          ] = $event.target.value.toUpperCase()
                        "
                      />
                    </div>
                    <div class="grow">
                      <Input
                        nolabel
                        v-model="formData.clerical_errors.to[index]"
                        :error="v$.clerical_errors.to.$params.prop"
                        @input="
                          formData.clerical_errors.to[
                            index
                          ] = $event.target.value.toUpperCase()
                        "
                      />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="addItem()"
                      class="py-2 px-4 mb-2 text-sm font-medium text-white bg-green-400 rounded-full shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      @click="removeItem()"
                      v-if="items.length > 1"
                      class="py-2 px-4 mb-2 text-sm font-medium text-white bg-red-400 rounded-full shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Box>
            </div>
            <div
              class="basis-[60%]"
              v-if="
                formData.type === 'CFN' &&
                formData.document_type === 'Birth' &&
                formData.ra === '9048'
              "
            >
              <Box title="The first name to be change  " width="w-full">
                <div class="grid grid-cols-2 gap-2 w-full">
                  <Input
                    label="From"
                    @input="formData.from = $event.target.value.toUpperCase()"
                    v-model="formData.from"
                    :error="v$.from.$params.prop"
                  />
                  <Input
                    @input="formData.to = $event.target.value.toUpperCase()"
                    label="To"
                    v-model="formData.to"
                    :error="v$.to.$params.prop"
                  />
                </div>
              </Box>
            </div>

            <div
              class="grow"
              v-if="
                formData.type === 'CFN' &&
                formData.document_type === 'Birth' &&
                formData.ra === '9048'
              "
            >
              <Box
                title="The grounds for filing this petition are the following  "
                width="w-full"
              >
                <div class="flex flex-col gap-5 text-md font-base justify-center">
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">a)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.a"
                    />
                    <div>
                      <label for=""
                        >The first name is extremely difficult to write or
                        pronounce;</label
                      >
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">b)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.b"
                    />

                    <div class="relative">
                      I have/He/She has habitually and continuously used
                      <div class="absolute -top-[1.2rem] left-[23rem]">
                        <Input
                          nolabel
                          :class="`flex text-center`"
                          v-model="formData.ground_b"
                          :error="v$.ground_b.$params.prop"
                          :readonly="formData.grounds.b ? false : true"
                          :skip="formData.grounds.b ? false : true"
                        />
                      </div>
                      _______________________________ &nbsp;and I/He/She is publicly known
                      in the community with that first name;
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">c)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.c"
                    />
                    <div for="one">
                      <label for="one" class="cursor-pointer">
                        The first name is tainted with dishonor;</label
                      >
                    </div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">d)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.d"
                    />
                    <div>The first name is ridiculous;</div>
                  </div>
                  <div class="flex flex-row gap-2 items-center flex-wrap">
                    <p class="basis-[2%] font-serif">e)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.e"
                    />
                    <div>The first name causes confusion;</div>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">f)</p>
                    <CheckBox
                      :error="v$.grounds.$params.prop"
                      v-model="formData.grounds.f"
                    />
                    <div class="relative w-max">
                      Others: (Specify)
                      <div class="absolute -top-[1.2rem] left-[7.4rem] w-full">
                        <Input
                          nolabel
                          :error="v$.ground_f.$params.prop"
                          v-model="formData.ground_f"
                          :class="`flex text-center`"
                          :readonly="formData.grounds.f ? false : true"
                          :skip="formData.grounds.f ? false : true"
                        />
                      </div>
                      ________________________________________________________.
                    </div>
                  </div>
                </div>
              </Box>
            </div>

            <div class="basis-[100%]" v-if="formData.type !== 'CFN'">
              <Box
                title="The facts/reasons for filing this petition are the following. "
                width="w-ful"
              >
                <div
                  class="flex flex-col w-full"
                  v-if="
                    formData.type === 'CCE' &&
                    formData.document_type === 'Birth' &&
                    formData.ra === '10172'
                  "
                >
                  <div
                    class="flex flex-row w-full p-2 gap-2"
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <div class="basis-[20%] px-8 flex items-center">
                      <label
                        :for="index"
                        class="text-sm text-nowrap w-full font-semibold tracking-wide text-gray-900"
                      >
                        For error No. {{ index + 1 }}:
                      </label>
                    </div>
                    <div class="flex flex-col grow">
                      <textarea
                        rows="3"
                        :id="index"
                        v-model="formData.reasons[index]"
                        :class="{
                          'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                            v$.reasons.$params.prop,
                          'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                            .reasons.$params.prop,
                        }"
                        class="block py-3 tracking-wider px-6 text-justify font-semibold w-full text-md text-black bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 w-full gap-2" v-else>
                  <label
                    for="message"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Facts/Reasons</label
                  >
                  <textarea
                    id="message"
                    rows="4"
                    :class="{
                      'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                        v$.reason.$params.prop,
                      'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                        .reason.$params.prop,
                    }"
                    v-model="formData.reason"
                    class="block py-6 px-6 text-justify tracking-wider font-semibold w-full text-md text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>
              </Box>
            </div>
          </div>

          <div class="flex flex-row flex-wrap gap-2">
            <div class="grow">
              <Box title=" documents to support this petition: " width="w-ful">
                <div class="flex flex-col w-full gap-3">
                  <div
                    class="flex flex-row w-full gap-2 items-center"
                    v-for="(support, index) in SupportItems"
                    :key="index"
                  >
                    <p class="basis-[9%] text-sm text-center">{{ index + 1 }})</p>
                    <div class="basis-[90%]">
                      <InputSuggestions
                        nolabel
                        :error="v$.SupportingDocuments.$params.prop"
                        v-model="formData.SupportingDocuments[index]"
                        :items="SupportingDocumentsSuggestions"
                      />
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      @click="addSuppportItem()"
                      class="py-2 px-4 mb-2 text-sm font-medium text-white bg-green-400 rounded-full shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      @click="removeSupportItem()"
                      v-if="SupportItems.length > 1"
                      class="py-2 px-4 mb-2 text-sm font-medium text-white bg-red-400 rounded-full shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Box>
            </div>
            <div class="basis-[40%] h-max">
              <Box title="filing this petition at the LCRO of " width="w-ful">
                <div
                  class="grid sm:grid-cols-1 lg:grid-cols-1 justify-center gap-2 w-full"
                >
                  <Input
                    label="City/Municipality"
                    skip
                    v-model="formData.LCRO_city"
                    :error="v$.LCRO_city.$error"
                  />
                  <Input
                    label="Province"
                    skip
                    v-model="formData.LCRO_province"
                    :error="v$.LCRO_province.$error"
                  />
                </div>
              </Box>
            </div>
          </div>

          <!-- //////////// -->
          <!-- Page 2 -->
          <!-- //////////// -->

          <div
            class="relative border-b-2 border-dashed flex items-center justify-center mt-10 mb-10"
          >
            <p class="absolute bg-white px-2 font-semibold italic text-gray-600">
              PAGE 2
            </p>
          </div>

          <!-- //////////// -->
          <!-- Page 2 -->
          <!-- //////////// -->

          <div class="flex flex-wrap flex-row gap-4">
            <div class="basis-[50%]">
              <Box title="VERIFICATION" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input
                    label="Petitioner Name"
                    skip
                    :error="v$.petitioner_name.$error"
                    v-model="formData.petitioner_name"
                    @input="formData.petitioner_name = $event.target.value.toUpperCase()"
                    readonly
                  />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="ADMINISTERING OFFICER" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input
                    label="Name"
                    skip
                    :error="v$.administering_officer.$error"
                    v-model="formData.administering_officer"
                    @input="
                      formData.administering_officer = $event.target.value.toUpperCase()
                    "
                  />
                  <Input
                    label="Position"
                    :error="v$.administering_position.$error"
                    skip
                    v-model="formData.administering_position"
                  />
                </div>
              </Box>
            </div>

            <div class="grow">
              <Box title="SUBSCRIBE AND SWORN" width="w-ful">
                <div class="grid grid-cols-3 w-full gap-2">
                  <div></div>
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Date Sworn</label
                    >
                    <VueDatePicker
                      :text-input="dateInputOptions"
                      v-model="formData.SwornDate"
                      auto-apply
                      :max-date="new Date()"
                      input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                      format="MMMM dd, yyyy"
                      model-type="MMMM dd, yyyy"
                      :month-change-on-scroll="false"
                      position="right"
                    >
                    </VueDatePicker>
                  </div>
                  <Input
                    label="City/Municipality"
                    :error="v$.SwornCity.$error"
                    skip
                    v-model="formData.SwornCity"
                  />
                  <Input
                    label="Community Tax Certificate No."
                    :error="v$.Ctc.$error"
                    v-model="formData.Ctc"
                  />
                  <Input
                    label="Issued at"
                    :error="v$.CtcIssuedAt.$error"
                    v-model="formData.CtcIssuedAt"
                  />
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Issued on</label
                    >
                    <VueDatePicker
                      :text-input="dateInputOptions"
                      v-model="formData.CtcIssuedOn"
                      auto-apply
                      input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                      format="MMMM dd, yyyy"
                      model-type="MMMM dd, yyyy"
                      :month-change-on-scroll="false"
                      position="right"
                    >
                    </VueDatePicker>
                  </div>
                </div>
              </Box>
            </div>
          </div>

          <div class="flex flex-row gap-2">
            <div class="basis-[100%]" v-if="formData.ra !== '10172'">
              <Box title="ACTION TAKEN BY THE C/MCR" width="w-full ">
                <div class="grid grid-cols-1 w-full gap-2">
                  <div
                    class="flex flex-row justify-evenly"
                    v-if="formData.ra !== '10172'"
                  >
                    <Radio
                      :error="v$.action.$error"
                      :options="action_options"
                      v-model="formData.action"
                      name="action"
                    />
                  </div>
                  <div class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                    <textarea
                      id="message"
                      rows="6"
                      v-model="formData.decision"
                      :class="{
                        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                          v$.decision.$error,
                        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                          .decision.$error,
                      }"
                      class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4 px-14 lg:px-24 lg:gap-10">
                    <div>
                      <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Date</label
                      >
                      <VueDatePicker
                        :text-input="dateInputOptions"
                        v-model="formData.date_granted"
                        auto-apply
                        input-class-name="p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                        format="MMMM dd, yyyy"
                        model-type="MMMM dd, yyyy"
                        :month-change-on-scroll="false"
                        position="right"
                      >
                      </VueDatePicker>
                    </div>
                    <Input
                      label="Municipal Civil Registrar"
                      skip
                      v-model="formData.mcr"
                      :error="v$.mcr.$error"
                      @input="formData.mcr = $event.target.value.toUpperCase()"
                    />
                  </div>
                </div>
              </Box>
            </div>

            <div class="basis-[100%]" v-if="formData.ra === '10172'">
              <Box title="ACTION TAKEN BY THE C/MCR" width="full">
                <div class="flex flex-col w-full gap-4">
                  <div
                    class="flex flex-row w-full gap-6 h-full"
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <div class="flex p-2 items-center justify-center basis-[15%]">
                      <label
                        :for="`action_taken` + index + 1"
                        class="font-semibold text-sm text-gray-900"
                      >
                        For Error No. {{ index + 1 }}
                      </label>
                    </div>

                    <div class="flex flex-col w-full gap-6">
                      <div class="flex flex-row justify-evenly">
                        <Radio
                          :options="action_options"
                          :error="v$.action_taken.action.$params.prop"
                          :name="`action_taken${index}`"
                          v-model="formData.action_taken.action[index]"
                        />
                      </div>
                      <div class="grid grid-cols-1 w-full gap-2">
                        <textarea
                          :id="`action_taken${index}`"
                          v-model="formData.action_taken.decision[index]"
                          :class="{
                            'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                              v$.action_taken.decision.$params.prop,
                            'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                              .action_taken.decision.$params.prop,
                          }"
                          rows="4"
                          class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 px-24 gap-5">
                    <div
                      class="flex flex-row justify-evenly"
                      v-if="formData.ra !== '10172'"
                    >
                      <Radio
                        :options="action_options"
                        v-model="formData.action"
                        :error="v$.action.$error"
                        name="action"
                      />
                    </div>
                    <div>
                      <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Date</label
                      >
                      <VueDatePicker
                        :text-input="dateInputOptions"
                        v-model="formData.date_granted"
                        auto-apply
                        input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                        format="MMMM dd, yyyy"
                        model-type="MMMM dd, yyyy"
                        :month-change-on-scroll="false"
                        position="right"
                      >
                      </VueDatePicker>
                    </div>
                    <Input
                      label="Municipal Civil Registrar"
                      skip
                      :error="v$.mcr.$error"
                      v-model="formData.mcr"
                      @input="formData.mcr = $event.target.value.toUpperCase()"
                    />
                  </div>
                </div>
              </Box>

              <!-- <Box title="Decision" width="full" v-else>
              <div class="grid grid-cols-1 w-full gap-2">
                <textarea
                  id="message"
                  rows="6"
                  v-model="formData.decision"
                  :class="{
                    'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50':
                      v$.decision.$error,
                    'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !v$
                      .decision.$error,
                  }"
                  class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>
            </Box> -->
            </div>
          </div>

          <div class="flex flex-row gap-2">
            <div class="basis-[35%]">
              <Box title="Payment of filing fee" width="w-ful">
                <div class="grid grid-cols-1 w-full gap-2">
                  <Input
                    label="O.R. No."
                    :error="v$.or_number.$error"
                    type="number"
                    v-model="formData.or_number"
                  />
                  <InputCurrency
                    label="Amount Paid"
                    :error="v$.amount_paid.$error"
                    v-model="formData.amount_paid"
                  />

                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Date Paid</label
                    >
                    <VueDatePicker
                      :text-input="dateInputOptions"
                      v-model="formData.DatePaid"
                      auto-apply
                      input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                      format="MMMM dd, yyyy"
                      model-type="MMMM dd, yyyy"
                      :month-change-on-scroll="false"
                      position="right"
                    >
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
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Notice of Posting</label
                      >
                      <VueDatePicker
                        :text-input="dateInputOptions"
                        v-model="formData.notice_posting"
                        auto-apply
                        input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                        format="MMMM dd, yyyy"
                        model-type="MMMM dd, yyyy"
                        :month-change-on-scroll="false"
                        position="right"
                      >
                      </VueDatePicker>
                    </div>
                  </div>

                  <div
                    class="flex flex-col items-center w-full gap-2 bg-yellow-100/20 mt-3"
                  >
                    <div class="border border-dashed border-yellow-400 w-full mb-5"></div>
                    <p class="font-bold text-center uppercase">Certificate of Posting</p>
                    <div class="flex flex-row w-full justify-evenly relative">
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >Start</label
                        >
                        <VueDatePicker
                          :text-input="dateInputOptions"
                          v-model="formData.certificate_posting_start"
                          auto-apply
                          input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                          format="MMMM dd, yyyy"
                          model-type="MMMM dd, yyyy"
                          :month-change-on-scroll="false"
                          position="right"
                        >
                        </VueDatePicker>
                      </div>
                      <p class="absolute top-10 font-bold text-xs">TO</p>
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >End</label
                        >
                        <VueDatePicker
                          :text-input="dateInputOptions"
                          v-model="formData.certificate_posting_end"
                          auto-apply
                          input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                          format="MMMM dd, yyyy"
                          model-type="MMMM dd, yyyy"
                          :month-change-on-scroll="false"
                          position="right"
                        >
                        </VueDatePicker>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="w-auto">
                        <div>
                          <label
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Date Issued</label
                          >
                          <VueDatePicker
                            :text-input="dateInputOptions"
                            v-model="formData.date_issued"
                            auto-apply
                            input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                            format="MMMM dd, yyyy"
                            model-type="MMMM dd, yyyy"
                            :month-change-on-scroll="false"
                            position="right"
                          >
                          </VueDatePicker>
                        </div>
                      </div>
                    </div>
                    <div class="border border-dashed border-yellow-400 w-full mt-5"></div>
                  </div>

                  <div class="flex flex-col justify-start gap-5 mt-3 items-start w-full">
                    <div class="w-[50%]">
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Date Granted</label
                        >
                        <VueDatePicker
                          :text-input="dateInputOptions"
                          v-model="formData.date_granted"
                          auto-apply
                          input-class-name=" p-2.5 pl-8 rounded-sm bg-gray-50 text-sm font-bold border-gray-300 border focus:ring-green-500 focus:border-green-500 focus:bg-green-50"
                          format="MMMM dd, yyyy"
                          model-type="MMMM dd, yyyy"
                          :month-change-on-scroll="false"
                          position="right"
                        >
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
          <div class="h-full flex items-center justify-center w-full">
            <button
              type="button"
              @click="submitForm()"
              class="py-2 px-8 tracking-widest ml-auto text-sm font-medium text-white bg-blue-600 rounded active:scale-95 transition-all hover:bg-blue-700 shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Submit
            </button>
          </div>
        </template>
      </Modal>
    </Transition>

    <PetitionInfo
      v-if="processing"
      :petition_details="petition_details"
      :petition_owner="petition_owner"
      :folderpath="folderpath"
      :isLoading="isProcessInfoLoading"
      @close-modal="processing = false"
    />

    <ClericalSettings v-if="settings" @close-modal="closePreference" />
  </div>
</template>

<script setup>
import Radio from "../../components/essentials/inputs/Radio.vue";
import { usePetitions } from "../../stores/Petition/Petitions.js";
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import { ref, reactive, computed, onMounted, watch } from "vue";
import Modal from "../../components/client/modal/Modal.vue";

import Box from "../../components/essentials/Box.vue";
import Select from "../../components/essentials/inputs/Select.vue";
import Input from "../../components/essentials/inputs/Input.vue";
import philippines from "../../utils/philippines";
import selectLocation from "../../components/essentials/inputs/select/select-location.vue";
import InputSuggestions from "../../components/essentials/inputs/InputSuggestions.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import InputFormatted from "../../components/essentials/inputs/InputFormatted.vue";
import "@vuepic/vue-datepicker/dist/main.css";

const decision = ref("");

import {
  now_date,
  add_date_notice,
  add_date_certificate_start,
  add_date_certificate_end,
  add_date_issued,
  add_date_granted,
} from "../../utils/DayPosting.js";

import Loading from "../../components/essentials/others/Loading.vue";
import LoadingBlock from "../../components/essentials/block/LoadingBlock.vue";
import InputCurrency from "../../components/essentials/inputs/InputCurrency.vue";
import TextEditor from "../../components/essentials/inputs/TextEditor.vue";
import Editor from "primevue/editor";

import { useAddress } from "../../composables/Address.js";
import TableGrid from "../../components/TableGrid.vue";
import BtnDrop from "../../components/essentials/buttons/BtnDrop.vue";
import Header from "../../components/essentials/header.vue";
import ButtonIcon from "../../components/essentials/buttons/ButtonIcon.vue";
import ClericalSettings from "../../components/essentials/settings/ClericalSettings.vue";
import CombineInputs from "../../components/essentials/inputs/CombineInputs.vue";
import MultiButton from "../../components/essentials/buttons/table/multiButton.vue";
import ViewBTn from "../../components/essentials/buttons/table/viewBTn.vue";
import GroundBlock from "../../components/essentials/block/GroundBlock.vue";
import Button from "../../components/essentials/buttons/Button.vue";
import CheckBox from "../../components/essentials/buttons/CheckBox.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { vMaska } from "maska";
import toOOXML from "../../utils/toOOXML.js";
import PetitionInfo from "../../components/essentials/modal/PetitionInfo.vue";

const document = ref(false); // Modal
const date = new Date();
const RepublicAct = ref(["9048", "10172"]);

const document_owner = ref("");
const petition_number = ref("0000");
const year = ref(date.getFullYear());

const settings = ref(false);
const closePreference = (event, value) => {
  settings.value = false;
};

const petitions = usePetitions();
onMounted(async () => {
  petitions.getPetitions();
  const latest = await petitions.getLatestPetition();
  if (latest) {
    getTheLatestPetitionNumber();
  }
});

async function getTheLatestPetitionNumber() {
  let latest_petition_number = petitions.latest.CCE.split("-");

  if (formData.type === "CCE") {
    latest_petition_number = petitions.latest.CCE.split("-");
  } else if (formData.type === "CFN") {
    latest_petition_number = petitions.latest.CFN.split("-");
  }

  const get_second_value = parseInt(latest_petition_number[1], 10);
  const incrementedNumber = get_second_value + 1;
  const paddedNumber = incrementedNumber.toString().padStart(4, "0");
  petition_number.value = paddedNumber;
}

const petitioner_number = computed(() => {
  let combined = formData.type + "-" + petition_number.value + "-" + year.value + " ";

  return combined;
});
const notification = ref(false);

const colDefs = ref([
  {
    field: "petition_number",
    headerName: "Petitioner Number",
    flex: 2,
    filter: true,
    pinned: "left",
    cellClass: "font-semibold tracking-wider w-full text-center",
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
    field: "petitioner_name",
    cellClass: "font-medium tracking-wider w-full text-gray-900",

    headerName: "Document Owner",
    flex: 1,
    filter: true,
  },
  {
    field: "document_type",
    cellClass: "font-medium tracking-wider w-full text-gray-600",
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
    cellRenderer: ViewBTn,
  },
]);

// Petition Info
const folderpath = ref("");
const processing = ref(false);
const isProcessInfoLoading = ref(false);
const petition_details = ref("");
const petition_owner = ref("");

const dateInputOptions = ref({
  format: "PP",
});

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

const date_now = ref(now_date());
const date_notice = ref(add_date_notice());
const date_certificate_start = ref(add_date_certificate_start());
const date_certificate_end = ref(add_date_certificate_end());
const date_of_issued = ref(add_date_issued());
const date_of_granted = ref(add_date_granted());

const granted_TEXT = computed(() => {
  if (formData.type === "CFN" && formData.from !== "" && formData.to !== "")
    return `Finding the petition sufficient in form and substance, the same is hereby GRANTED, the child’s first name from "${formData.from}" to "${formData.to}" is hereby changed. `;
  else if (formData.type === "CCE") {
    const errorStrings = [];
    for (let i = 0; i < formData.clerical_errors.description.length; i++) {
      errorStrings.push(
        `the ${formData.clerical_errors.description[i].toLowerCase()} from "${
          formData.clerical_errors.from[i]
        }" to "${formData.clerical_errors.to[i]}"`
      );
    }

    const lastItem = errorStrings.pop();
    const formattedOutput =
      errorStrings.join("; ") + (errorStrings.length ? " and " : "") + lastItem;

    return `Finding the petition sufficient in form and substance, the same is hereby GRANTED, ${formattedOutput} is hereby changed.`;
  }
});

const formData = reactive({
  ra: "9048",
  type: "CCE",
  document_type: "Birth",
  petition_number: petitioner_number,
  petitioner_name: "",
  nationality: "Filipino",
  petitioner_province: "",
  petitioner_city: "",
  petitioner_barangay: "",
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

  reason: "To correct ",
  reasons: [],

  SupportingDocuments: [],
  LCRO_city: "Bayambang",
  LCRO_province: "Pangasinan",

  // Page 2

  administering_officer: "ISMAEL D. MALICDEM, JR.",
  administering_position: "Municipal Civil Registrar",

  SwornDate: date_now,
  SwornCity: "Bayambang, Pangasinan",

  Ctc: "",
  CtcIssuedOn: "Bayambang, Pangasinan",
  CtcIssuedAt: "",

  action: "",
  ActionDate: "",

  action_taken: {
    action: [],
    decision: [],
  },

  mcr: "ISMAEL D. MALICDEM, JR.",
  // decision:
  //   "Finding the petition sufficient in form and substance, the same is hereby GRANTED, ",
  decision: granted_TEXT,

  or_number: "",
  amount_paid: "",
  DatePaid: date_now,

  notice_posting: date_notice,
  certificate_posting_start: date_certificate_start,
  certificate_posting_end: date_certificate_end,

  date_issued: date_of_issued,
  date_granted: date_of_granted,
});

watch(
  () => formData.cce_in,
  (cce_in) => {
    if (cce_in === "my" && formData.document_type === "Birth") {
      formData.name_owner = "N/A";
      formData.relation_owner = "N/A";
    } else {
      formData.name_owner = "";
      formData.relation_owner = "";
    }
  }
);

watch(
  () => formData.ra,
  (RA) => {
    if (RA === "9048") {
      Type.value = ["CCE", "CFN"];
      DocumentType.value = ["Birth", "Death", "Marriage"];
    } else if (RA === "10172") {
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
      formData.document_type = "Birth";
      formData.cce_in = "";
      DocumentType.value = ["Birth"];
    } else if (formData.type === "CCE" && formData.ra !== "10172") {
      formData.cce_in = "";
      DocumentType.value = ["Birth", "Death", "Marriage"];
    }
  }
);

watch(
  () => formData.document_type,
  (document_type) => {
    if (document_type === "Birth") {
      formData.name_owner = "N/A";
      formData.relation_owner = "N/A";
      formData.cce_in = "";
    } else if (document_type === "Death") {
      formData.cce_in = "the";
    } else {
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
  const latest = await petitions.getLatestPetition();
  if (latest) {
    getTheLatestPetitionNumber();
  }

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
  if (formData.type === "CFN") {
    if (!Object.values(formData.grounds).some((value) => value)) {
      return true;
    } else {
      return false;
    }
  }
  return false;
});

const validate_ground_b = computed(() => {
  if (formData.type === "CFN") {
    if (formData.grounds.b) {
      if (formData.ground_b === "") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return false;
});

const validate_ground_f = computed(() => {
  if (formData.type === "CFN") {
    if (formData.grounds.f) {
      if (formData.ground_f === "") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return false;
});

const validate_from_and_to = computed(() => {
  if (formData.type === "CFN") {
    if (formData.from === "" || formData.to === "") {
      return true;
    } else {
      return false;
    }
  }
  return false;
});

const validate_supporting_documents = computed(() => {
  if (SupportItems.value.length !== formData.SupportingDocuments.length) {
    return true;
  } else {
    return false;
  }
});

const validate_clerical_description = computed(() => {
  if (formData.type !== "CCE") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (
      i >= formData.clerical_errors.description.length ||
      formData.clerical_errors.description[i] === ""
    ) {
      return true;
    }
  }

  return false;
});

const validate_clerical_from = computed(() => {
  if (formData.type !== "CCE") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (
      i >= formData.clerical_errors.from.length ||
      formData.clerical_errors.from[i] === ""
    ) {
      return true;
    }
  }

  return false;
});

const validate_clerical_to = computed(() => {
  if (formData.type !== "CCE") {
    return false;
  }

  for (let i = 0; i < items.value.length; i++) {
    if (
      i >= formData.clerical_errors.to.length ||
      formData.clerical_errors.to[i] === ""
    ) {
      return true;
    }
  }

  return false;
});

const validate_reasons = computed(() => {
  if (formData.ra !== "10172" && formData.type !== "CCE") {
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

const validate_reason = computed(() => {
  if (formData.type === "CFN") {
    return false;
  } else if (formData.type === "CFN" && formData.reason === "") {
    return true;
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
    petitioner_province: { required },
    petitioner_city: { required },
    petitioner_barangay: { required },
    cce_in: { required },

    name_owner: { required },
    relation_owner: { required },

    date_of: { required },
    at_city: { required },
    at_province: { required },
    at_country: { required },
    registry_number: { required },

    // required  if
    clerical_errors: {
      description: requiredIf(validate_clerical_description),
      from: requiredIf(validate_clerical_from),
      to: requiredIf(validate_clerical_to),
    },

    reasons: requiredIf(validate_reasons),
    action_taken: {
      action: requiredIf(validate_action_taken_action),
      decision: requiredIf(validate_action_taken_decision),
    },

    // required  if
    SupportingDocuments: requiredIf(validate_supporting_documents), // Array of Supporting Documents
    from: requiredIf(validate_from_and_to),
    to: requiredIf(validate_from_and_to),
    grounds: requiredIf(validate_grounds),
    ground_b: requiredIf(validate_ground_b),
    ground_f: requiredIf(validate_ground_f),

    reason: requiredIf(validate_reason),
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
    or_number: { required },
    amount_paid: { required },
    DatePaid: { required },
    notice_posting: { required },
    certificate_posting_start: { required },
    certificate_posting_end: { required },
    date_issued: { required },
    date_granted: { required },
  };
});

const v$ = useVuelidate(validate, formData);

const submitForm = async () => {
  // v$.value.$touch();
  // if (v$.value.$error) {
  //   console.log(v$.value);
  //   return;
  // }
  const OOXML = toOOXML(formData.decision);

  closeModal();
  const clerical_errors = ref({
    description: formData.clerical_errors.description,
    from: formData.clerical_errors.from,
    to: formData.clerical_errors.to,
  });

  const errors = JSON.stringify(clerical_errors.value);
  const supports = JSON.stringify(formData.SupportingDocuments);

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

  const data = {
    type: formData.type,
    document_type: formData.document_type,
    petition_number: formData.petition_number,
    petitioner_name: formData.petitioner_name,
    nationality: formData.nationality,
    petitioner_province: formData.petitioner_province,

    petitioner_city: formData.petitioner_city,
    petitioner_barangay: formData.petitioner_barangay,
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
  };

  processing.value = true;
  isProcessInfoLoading.value = true;

  const check = await window.ClericalApi.PrintLiveBirth(data);

  const add = await petitions.addPetition(data);
  if (add) {
    const latest = await petitions.getLatestPetition();
    if (latest) {
      getTheLatestPetitionNumber();
    }
  }
  isProcessInfoLoading.value = false;

  folderpath.value = check.filepath;
  let document_owner =
    formData.name_owner === "N/A" ? formData.petitioner_name : formData.name_owner;

  if (check) {
    petition_details.value =
      formData.type + " " + formData.document_type + ",  " + formData.petitioner_name;
    petition_owner.value = document_owner;
  }
};
</script>
