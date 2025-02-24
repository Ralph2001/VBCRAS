<template>
    <Modal large footerBG="bg-white  border-t  border-gray-300">
        <template v-slot:header>

            <button
                class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700">
                <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return</button>

        </template>


        <div
            class="flex flex-col sm:px-4 md:lg:px-[5rem] h-max w-full  gap-4 relative items-center justify-center bg-gray-300 ">
            <div :class="[backround_per_event]" class="h-full flex flex-col px-10 py-10   ">


                <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 gap-2 items-start w-full justify-center p-2"
                    ref="isFormVisible">

                    <!-- {{ petitioner_number }} -->
                    <Box title="Header" width="w-full">
                        <div class="flex flex-col gap-2 w-full">

                            <InputAutoComplete label="Province" @change="formData.header_municipality = ''"
                                :error="v$.header_province.$error" v-model="formData.header_province"
                                :suggestion_data="province" />
                            <InputAutoComplete label="City/Municipality" :error="v$.header_municipality.$error" cap
                                v-model="formData.header_municipality" :suggestion_data="municipality_of" />




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
                                <label
                                    class="basis-[100%] block mb-2 text-sm font-medium text-gray-900 dark:text-white">Petition
                                    Number</label>
                                <MultiInput @type-petition-number="change_petitioner_number"
                                    @type-year="change_petitioner_date" skip :migrant="formData.is_migrant"
                                    :republic_act="is_default_republic_act" :type="is_default_petition_type"
                                    :petition_number_value="is_default_petitioner_number" />
                            </div>
                            <Input :error="v$.petitioner_name.$error" label="Petitioner Name"
                                v-model="formData.petitioner_name" cap />
                        </div>
                    </Box>

                    <Box title="Petitioner Nationality & Complete Address" width="w-full">
                        <div class="grid grid-cols-3 w-full gap-2">
                            <Input :error="v$.nationality.$error" label="Nationality" v-model="formData.nationality"
                                skip />
                            <div class=" col-span-2">
                                <InputAutoComplete :error="v$.petitioner_address.$error" label="Petitioner Address"
                                    v-model="formData.petitioner_address" :wait="true" :suggestion_data="all_" />

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
                                            class="font-medium">Note:</span> If the petitioner's
                                        name
                                        differs from the one on the birth certificate, please provide the name exactly
                                        as it
                                        appears on
                                        the
                                        birth certificate in this field. If the names match, leave the box checked. </p>
                                    <div v-if="formData.petitioner_error_in === 'my'"
                                        class="flex flex-row gap-2 items-center">
                                        <CheckBox v-model="is_same_as_petitioner_name"
                                            @change="changes_document_owner" />
                                        <p class="text-xs font-medium">Same as Petitioner Name</p>
                                    </div>

                                    <Input v-if="formData.petitioner_error_in"
                                        :readonly="(formData.petitioner_error_in === 'my' && formData.event_type === 'Birth' || formData.event_type === 'Marriage') && is_same_as_petitioner_name ? true : false"
                                        :error="v$.document_owner.$error" label="Document Owner"
                                        v-model="formData.document_owner"
                                        @input="formData.document_owner = $event.target.value.toUpperCase()" />
                                    <p v-else class="text-sm italic text-gray-700">Please choose an option. </p>

                                    <!-- If Marriage -->
                                    <Input
                                        v-if="formData.petitioner_error_in === 'my' && formData.event_type === 'Marriage'"
                                        label="Spouse Name" v-model="formData.spouse_name"
                                        :error="v$.spouse_name.$error"
                                        @input="formData.spouse_name = $event.target.value.toUpperCase()" />



                                </div>
                                <div v-if="
                                    formData.event_type === 'Birth' ||
                                    formData.event_type === 'Death' ||
                                    (formData.event_type === 'Marriage' && formData.petitioner_error_in === 'the')
                                ">
                                    <InputAutoComplete v-if="formData.petitioner_error_in === 'the'"
                                        :error="v$.relation_owner.$error" label="Relation"
                                        v-model="formData.relation_owner" :readonly="formData.petitioner_error_in === 'my' && formData.event_type === 'Birth'
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
                <div class="flex sm:flex-col md:lg:flex-row gap-5">
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
                <div class="flex flex-row flex-wrap gap-5">
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
                                <div class="flex flex-row w-full items-center gap-2"
                                    v-for="(value, index) in clerical_errors_items" :key="index">
                                    <div class="basis-[10%]">
                                        <Input center type="number" @keydown="(event) => handleKeyClerical(event, 1)"
                                            @change="generate_granted_text()"
                                            v-model="formData.clerical_errors[index].error_num" nolabel />
                                    </div>

                                    <div class="grow">
                                        <InputAutoComplete @keydown="(event) => handleKeyClerical(event, 2)"
                                            @change="generate_granted_text()" nolabel
                                            @keydown.ctrlKey="add_clerical_error()"
                                            :suggestion_data="petitions.saved_clerical"
                                            v-model="formData.clerical_errors[index].description" />
                                    </div>
                                    <div class="grow">
                                        <Input nolabel @keydown="(event) => handleKeyClerical(event, 3)"
                                            @change="generate_granted_text()" cap
                                            v-model="formData.clerical_errors[index].error_description_from" />
                                    </div>
                                    <div class="grow">
                                        <Input nolabel @keydown="(event) => handleKeyClerical(event, 4)"
                                            @change="generate_granted_text()" cap
                                            v-model="formData.clerical_errors[index].error_description_to" />
                                    </div>
                                </div>
                                <div class="flex justify-end gap-2 mt-3">
                                    <button @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
                                        type="button" @click="remove_clerical_error()"
                                        v-if="clerical_errors_items.length > 1" tabindex="-1"
                                        class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Remove
                                    </button>
                                    <button type="button" @click="add_clerical_error()" tabindex="-1"
                                        @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
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
                                            <Input :error="v$.ground_b_data.$error" cap nolabel
                                                :class="`flex text-center`" v-model="formData.ground_b_data"
                                                :readonly="formData.ground_b ? false : true"
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
                                            <Input :error="v$.ground_f_data.$error" nolabel
                                                v-model="formData.ground_f_data" :class="`flex text-center`"
                                                :readonly="formData.ground_f ? false : true"
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
                                <div class="flex flex-row w-full p-2 gap-2"
                                    v-for="(value, index) in clerical_errors_items" :key="index">
                                    <div class="basis-[20%] px-8 flex items-center">
                                        <label :for="index"
                                            class="text-sm text-nowrap w-full font-semibold tracking-wide text-gray-900">
                                            For error No. {{ index + 1 }}:
                                        </label>
                                    </div>
                                    <div class="flex flex-col grow">
                                        <textarea rows="3" :id="index" v-model="formData.reasons[index].reason"
                                            class="block py-3 tracking-wider px-6 text-justify font-semibold w-full text-md text-black bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
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
                            <div class="flex flex-col w-full gap-3 mt-5 relative">
                                <div class="absolute w-auto -top-9 right-4">
                                    <p class="text-xs italic text-gray-400 font-normal">
                                        <font-awesome-icon icon="fa-solid fa-circle-info" class="me-1 text-blue-600" />
                                        <span class="font-medium text-blue-600">Crtl + Space</span> to add new column
                                    </p>
                                </div>
                                <div class="flex flex-row w-full gap-2 items-center"
                                    v-for="(value, index) in supporting_items" :key="index">
                                    <p class="basis-[9%] text-sm text-center">
                                        {{ indexToLetter(index) }} )
                                    </p>
                                    <div class="basis-[90%]">

                                        <InputAutoComplete :skip_next_count="true"
                                            @keydown="(event) => handleKeySupporting(event, 1)" nolabel
                                            :suggestion_data="petitions.saved_supporting"
                                            v-model="formData.supporting_documents[index].document_name" />


                                        <!-- <Input v-model="formData.supporting_documents[index].document_name" /> -->
                                    </div>
                                </div>
                                <div class="flex justify-end gap-2">
                                    <!-- Make this component -->
                                    <button tabindex="-1" @keydown.down="focusNextInput"
                                        @keydown.up="focusPreviousInput" type="button"
                                        @click="remove_supporting_documents()" v-if="supporting_items.length > 1"
                                        class="py-1 px-3 font-mono text-sm font-medium text-white bg-red-400 rounded-sm tracking-wider hover:bg-red-500 hover:shadow-md transition-all shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Remove
                                    </button>
                                    <button tabindex="-1" @keydown.down="focusNextInput"
                                        @keydown.up="focusPreviousInput" type="button"
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
                                <Input label="Province " :error="v$.filing_province.$error" skip
                                    v-model="formData.filing_province" />
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
                        <Box title="VERIFICATION" width="w-auto">
                            <div class="grid grid-cols-1 w-full gap-2">
                                <Input label="Petitioner Name" skip v-model="formData.petitioner_name"
                                    @input="formData.petitioner_name = $event.target.value.toUpperCase()" readonly />
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
                                <Input label="City/Municipality" skip
                                    v-model="formData.subscribe_sworn_city_municipality"
                                    :error="v$.subscribe_sworn_city_municipality.$error" />
                                <Input label="exhibiting his/her" v-model="formData.exhibiting_his_her"
                                    :error="v$.exhibiting_his_her.$error" />
                                <Input :label="formData.exhibiting_his_her || `No.`"
                                    v-model="formData.exhibiting_number" :error="v$.exhibiting_number.$error" />
                                <Input label="Issued at" skip v-model="formData.issued_at"
                                    :error="v$.issued_at.$error" />
                                <Input label="Issued on" skip type="date" v-model="formData.issued_on"
                                    :error="v$.issued_on.$error" />
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
                                    <div class="flex flex-row justify-evenly gap-4">
                                        <Selector :options="action_options"
                                            v-model="formData.petition_actions[0].action_decision" />

                                        <!-- <Radio :options="action_options" :name="'action_' + 0"
                        v-model="formData.petition_actions[0].action_decision" /> -->
                                    </div>
                                    <!-- Migrant -->
                                    <div v-if="!formData.is_migrant"
                                        class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                                        <textarea tabindex="0" id="message" rows="6"
                                            v-model="formData.petition_actions[0].action_text"
                                            class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                    </div>
                                </div>
                                <!-- Migrant -->
                                <!-- Subpart 1: Shows when republic act is 10172 -->
                                <div v-if="formData.republic_act_number === '10172' && !formData.is_migrant"
                                    class="flex flex-col" v-for="(value, index) in clerical_errors_items" :key="index">
                                    <div class="flex flex-row justify-evenly">
                                        <!-- <Radio :options="action_options" :name="'action_' + index"
                        v-model="formData.petition_actions[index].action_decision" /> -->

                                        <Selector :options="action_options"
                                            v-model="formData.petition_actions[index].action_decision" />
                                    </div>
                                    <div class="grid grid-cols-1 w-full gap-2 px-10 mt-5 mb-5">
                                        <textarea tabindex="0" id="message" rows="6"
                                            v-model="formData.petition_actions[index].action_text"
                                            class="block p-2.5 text-justify font-semibold px-5 tracking-wider w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                    </div>
                                </div>

                                <!-- Migrant -->
                                <div v-if="!formData.is_migrant"
                                    class="grid grid-cols-2 gap-4 px-14 lg:px-24 lg:gap-10">
                                    <Input type="date" label="Date" skip v-model="formData.action_taken_date"
                                        :error="v$.action_taken_date.$error" />
                                    <Input label="Municipal Civil Registrar" v-if="formData.is_migrant" skip readonly />
                                    <Input label="Municipal Civil Registrar" skip v-if="!formData.is_migrant"
                                        v-model="formData.municipal_civil_registrar" cap
                                        :error="v$.municipal_civil_registrar.$error" />
                                </div>
                            </div>
                        </Box>
                    </div>



                </div>
                <!-- 12th Payment and Date Preview-->
                <div class="flex sm:flex-col md:lg:flex-row gap-2">
                    <div class="basis-[35%]">
                        <Box title="Payment of filing fee" width="w-auto">

                            <div class="grid grid-cols-1 w-full gap-2">
                                <div class="flex flex-row gap-2 items-center p-4">
                                    <CheckBox @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
                                        v-model="formData.is_indigent" @change="is_indigent()" />
                                    <label for="" class="font-medium text-sm">Indigent</label>
                                </div>
                                <Input :readonly="formData.is_indigent" :skip="formData.is_indigent" label="O.R. No."
                                    type="text" v-model="formData.o_r_number" />
                                <Input :readonly="formData.is_indigent" :skip="formData.is_indigent" readonly
                                    v-if="formData.is_indigent" label="Amount Paid" v-model="formData.amount_paid" />
                                <Input :readonly="formData.is_indigent" readonly v-if="formData.is_indigent"
                                    label="Date Paid" skip v-model="formData.date_paid" />


                                <InputCurrency @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
                                    v-if="!formData.is_indigent" label="Amount Paid" v-model="formData.amount_paid" />
                                <Input v-if="!formData.is_indigent" label="Date Paid" type="date" skip
                                    v-model="formData.date_paid" />

                            </div>
                        </Box>
                    </div>

                    <div class="grow">
                        <Box title="DATES" width="w-auto">
                            <div class="flex flex-col w-full gap-2 items-start">
                                <div class="grid grid-cols-2 w-full gap-4">
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
                                            <Input skip label="Start" type="date"
                                                v-model="formData.certificate_posting_start"
                                                :error="v$.certificate_posting_start.$error" />
                                        </div>
                                        <p class="absolute top-10 font-bold text-xs">TO</p>
                                        <div>
                                            <Input skip label="End" type="date"
                                                v-model="formData.certificate_posting_end"
                                                :error="v$.certificate_posting_end.$error" />
                                        </div>
                                    </div>

                                    <div class="flex items-center">
                                        <div class="w-auto">
                                            <Input skip label="Date Issued" type="date"
                                                v-model="formData.petition_date_issued"
                                                :error="v$.petition_date_issued.$error" />
                                        </div>
                                    </div>
                                    <div class="border border-dashed border-yellow-400 w-full mt-5"></div>
                                </div>
                                <div class="grid grid-cols-2 w-full gap-4"
                                    v-if="formData.petition_type === 'CFN' || formData.republic_act_number === '10172'">
                                    <Input skip :error="v$.publication_start.$error" label="Publication Start"
                                        type="date" v-model="formData.publication_start" />
                                    <Input skip :error="v$.publication_end.$error" label="Publication End" type="date"
                                        v-model="formData.publication_end" />
                                </div>
                                <div class="flex flex-col justify-start gap-5 mt-3 items-start w-full">
                                    <div class="w-[50%]">
                                        <Input skip label="Date Granted" type="date"
                                            v-model="formData.petition_date_granted"
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
                    @click="submitForm()"><font-awesome-icon icon="fa-solid fa-right-to-bracket" /> Submit</button>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '../client/modal/Modal.vue';
import Box from '../essentials/Box.vue';
import HeaderCCE from '../essentials/HeaderCCE.vue';
import Input from '../essentials/inputs/Input.vue';
import Select from '../essentials/inputs/Select.vue';
import InputAutoComplete from '../InputAutoComplete.vue';
import Selector from '../Selector.vue';


</script>

<style lang="scss" scoped></style>