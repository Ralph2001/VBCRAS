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

        <Modal large footerBG="bg-white border-t border-gray-300" v-if="modal" :footer="false">
            <template v-slot:header>
                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_modal">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return
                </button>
            </template>

            <div class="flex h-full   justify-center items-center w-full pt-8">
                <div class="fixed flex flex-row right-0 left-0 bg-blue-400 top-9 px-4 z-50">
                    <div class="flex flex-row items-center">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 transition" @click="change_page(1)"
                            :class="[page === 1 ? 'bg-blue-200' : 'text-gray-900']">Application for Marriage
                            License</button>
                        <div class="block border border-blue-600 h-6"></div>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 transition " @click="change_page(2)"
                            :class="[page === 2 ? 'bg-blue-200' : 'text-gray-900']">Notice of Posting</button>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button @click="submit()"
                            class="hover:bg-blue-300 font-medium text-sm p-2 flex items-center gap-1">
                            <font-awesome-icon icon="fa-regular fa-floppy-disk" /> Save</button>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2  flex items-center gap-1"
                            @click="change_mode()">
                            <font-awesome-icon icon="fa-regular fa-eye" v-if="!preview" />
                            <font-awesome-icon icon="fa-solid fa-pen-to-square" v-else />
                            {{ !preview ? 'Preview' : 'Edit' }}</button>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2  flex items-center gap-1"
                            @click="print()">
                            <font-awesome-icon icon="fa-solid fa-print" />Print</button>
                    </div>
                </div>



                <!-- ??? -->
                <div class="fixed bottom-0 z-50 left-0  right-0 bg-yellow-100  flex items-center justify-center w-full  py-2 px-4 "
                    v-if="page === 1 && is_form_input_active && !preview">
                    <div class="flex flex-col w-[30rem] gap-2 h-full justify-center">
                        <label for="" class="text-xs uppercase font-medium text-nowrap">Please enter {{
                            active_document_form
                            }}:</label>
                        <input type="text" v-model="input_form_value" ref="input_form_field" tabindex="-1"
                            @keydown="handleTabNavigation"
                            @keydown.enter="submit_input_data($event, active_input_field)"
                            class="border font-medium uppercase rounded-sm w-full border-gray-300 py-1 text-md">

                    </div>
                </div>


                <div class="h-full  w-full flex   justify-center relative ">
                    <div v-if="!preview" class="h-full w-full flex  overflow-scroll justify-center  p-20 pt-24 pb-44">
                        <div v-if="!preview" :style="paperStyle"
                            class="flex bg-gray-50 shadow-md flex-col scale-110 relative"
                            :class="[page === 1 ? 'py-14 pl-12 pr-10 ' : 'px-20 py-10']">
                            <button v-if="page === 1"
                                class="absolute top-0 font-medium -right-26 hover:text-green-400 hover:underline py-3.5 text-gray-800 text-sm px-2 "
                                @click="blank()">BLANK PAGE</button>
                            <div v-if="page === 1"
                                class="w-full h-full border-[3px] border-gray-700 flex flex-col relative">



                                <!-- Second -->

                                <div class="border-b border-gray-500 flex flex-row relative  w-full">
                                    <div class="basis-[70%] flex flex-col  border-r border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Province</p>
                                            <FocusableButton isAddress :documentName="'Header Province'"
                                                :field="'header_province'" :tabIndex="1" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                            <!-- <InputBottomBorderMarriage isBold v-model="formData.header_province" /> -->
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">City/Municipality</p>
                                            <!-- <InputBottomBorderMarriage isBold v-model="formData.header_municipality" /> -->
                                            <FocusableButton isAddress :documentName="'City/Municipality'"
                                                :field="'header_municipality'" :tabIndex="2" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>
                                    </div>
                                    <div class="grow  p-1 flex flex-row ">
                                        <p class="text-sm text-nowrap"> Registry No.</p>
                                        <div class="items-center flex  justify-center w-full ">
                                            <FocusableButton  isLarge :documentName="'Registry No.'"
                                                :field="'registry_number'" :tabIndex="3" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Third -->
                                <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                    <div class="flex flex-col  border-r border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Received by:</p>
                                            <!-- <InputBottomBorderMarriage isBold v-model="formData.received_by" /> -->
                                            <FocusableButton :documentName="'Received By'" :field="'received_by'"
                                                :tabIndex="4" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Date of Receipt:</p>
                                            <!-- <InputBottomBorderMarriage isBold v-model="formData.date_of_receipt" /> -->

                                            <FocusableButton isDate :documentName="'Date of Receipt (mm/dd/yyyy)'"
                                                :field="'date_of_receipt'" :tabIndex="5" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>

                                    </div>
                                    <div class="flex flex-col  border-l border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Marriage License No.:</p>
                                            <!-- <InputBottomBorderMarriage isBold
                                                v-model="formData.marriage_license_number" /> -->
                                            <FocusableButton :documentName="'Marriage License No. '"
                                                :field="'marriage_license_number'" :tabIndex="6" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Date of Issuance of Marriage License:</p>
                                            <!-- <InputBottomBorderMarriage isBold
                                                v-model="formData.date_issuance_marriage_license" /> -->

                                            <FocusableButton isDate
                                                :documentName="'Date of Issuance of Marriage License (mm/dd/yyyy)'"
                                                :field="'date_issuance_marriage_license'" :tabIndex="7"
                                                :formData="formData" :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Fourth -->
                                <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                    <div class="flex items-center justify-center border-r border-gray-500">
                                        <p class="text-sm font-bold ">GROOM</p>
                                    </div>
                                    <div class="flex items-center justify-center border-l border-gray-500">
                                        <p class="text-sm font-bold ">BRIDE</p>
                                    </div>
                                </div>

                                <!-- 5 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-col  border-r border-gray-500 p-1">

                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(First)</p>

                                            <FocusableButton isDashedBorder :documentName="'Groom First Name'"
                                                :field="'groom_first_name'" :tabIndex="8" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                        <div class="flex flex-row  gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(Middle)</p>

                                            <FocusableButton isDashedBorder :documentName="'Groom Middle Name'"
                                                :field="'groom_middle_name'" :tabIndex="9" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                        <div class="flex flex-row  gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(Last)</p>

                                            <FocusableButton isDashedBorder :documentName="'Groom Last Name'"
                                                :field="'groom_last_name'" :tabIndex="10" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>

                                    </div>

                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">1. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Name of
                                            Applicant
                                        </p>
                                    </div>


                                    <div class="basis-[45%] flex flex-col  border-l border-gray-500 p-1">
                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(First)</p>
                                            <FocusableButton isDashedBorder :documentName="'Bride First Name'"
                                                :field="'bride_first_name'" :tabIndex="11" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>

                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(Middle)</p>
                                            <FocusableButton isDashedBorder :documentName="'Bride Middle Name'"
                                                :field="'bride_middle_name'" :tabIndex="12" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs  basis-[15%]">(Last)</p>
                                            <FocusableButton isDashedBorder :documentName="'Bride Last Name'"
                                                :field="'bride_last_name'" :tabIndex="13" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                </div>
                                <!-- 6 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-row items-center border-r border-gray-500  ">
                                        <div class="flex flex-col justify-center items-center w-full h-full  pb-1.5">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium  ">
                                                <p>(Day)</p>
                                                <p>(Month)</p>
                                                <p>(Year)</p>
                                            </div>
                                            <div class="h-[40%] w-full">
                                                <FocusableButton isDate isSeparated
                                                    :documentName="'Groom Date of Birth (mm/dd/yyyy)'"
                                                    :field="'groom_date_birth'" :tabIndex="14"
                                                    :formData="temporary_form" :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>
                                        </div>

                                        <div class="border-l border-gray-500 h-full w-[8rem] flex items-center">
                                            <!-- <InputBottomBorderMarriage v-model="formData.groom_age" isBold label="Age"
                                                @change="handleInputChange" middle top_label /> -->
                                            <div class="w-full h-full flex flex-col pt-1">
                                                <div
                                                    class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                    <p>(Age)</p>
                                                </div>
                                                <div class="h-[40%] w-full">
                                                    <FocusableButton isCenter :documentName="'Groom Age'"
                                                        :field="'groom_age'" :tabIndex="15" :formData="formData"
                                                        :activeInputField="active_input_field"
                                                        :openFormInput="open_form_input" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">2. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Date of Birth/
                                            Age
                                        </p>
                                    </div>

                                    <div class="basis-[45%] flex flex-row items-center border-l border-gray-500  ">
                                        <div class="flex flex-col justify-center items-center w-full h-full  pb-1.5">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                <p>(Day)</p>
                                                <p>(Month)</p>
                                                <p>(Year)</p>
                                            </div>
                                            <div class="h-[40%] w-full">
                                                <FocusableButton isDate isSeparated
                                                    :documentName="'Bride Date of Birth (mm/dd/yyyy)'"
                                                    :field="'bride_date_birth'" :tabIndex="16"
                                                    :formData="temporary_form" :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>
                                        </div>

                                        <div class="border-l border-gray-500 h-full w-[8rem] flex items-center">
                                            <!-- <InputBottomBorderMarriage v-model="formData.bride_age" isBold label="Age"
                                                @change="handleInputChange" middle top_label /> -->
                                            <div class="w-full h-full flex flex-col pt-1">
                                                <div
                                                    class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                    <p>(Age)</p>
                                                </div>
                                                <div class="h-[40%] w-full">
                                                    <FocusableButton isCenter :documentName="'Bride Age'"
                                                        :field="'bride_age'" :tabIndex="17" :formData="formData"
                                                        :activeInputField="active_input_field"
                                                        :openFormInput="open_form_input" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] flex flex-col items-center border-r border-gray-500  py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(City/Municipality)</p>
                                            <p>(Province)</p>
                                            <p>(Country)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter isAddress
                                                :documentName="'Groom Place of Birth City/Municipality'"
                                                :field="'groom_municipality'" :tabIndex="18" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Place of Birth Province'"
                                                :field="'groom_province'" :tabIndex="19" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Place of Birth Country'"
                                                :field="'groom_country'" :tabIndex="20" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                    </div>

                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">3. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Place of Birth
                                        </p>
                                    </div>


                                    <div
                                        class="basis-[45%] flex flex-col items-center border-l border-gray-500  py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(City/Municipality)</p>
                                            <p>(Province)</p>
                                            <p>(Country)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter isAddress
                                                :documentName="'Bride Place of Birth City/Municipality'"
                                                :field="'bride_municipality'" :tabIndex="21" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Place of Birth Province'"
                                                :field="'bride_province'" :tabIndex="22" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Place of Birth Country'"
                                                :field="'bride_country'" :tabIndex="23" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-rowitems-center border-r border-gray-500  ">
                                        <div class="basis-[30%] border-r flex flex-col border-gray-500">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                <p>(Male/Female)</p>
                                            </div>

                                            <div class="flex w-full">
                                                <FocusableButton isCenter :documentName="'Groom Gender'"
                                                    :field="'groom_sex'" :tabIndex="24" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>

                                        </div>
                                        <div class="grow flex flex-col">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                <p>(Citizenship)</p>
                                            </div>

                                            <div class="flex w-full">
                                                <FocusableButton isCenter isAddress :documentName="'Groom Citizenship'"
                                                    :field="'groom_citizenship'" :tabIndex="25" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>

                                            <!-- <InputBottomBorderMarriage v-model="formData.groom_citizenship" middle
                                                isBold label="Citizenship" top_label /> -->
                                        </div>


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">4. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Sex/
                                            Citizenship
                                        </p>
                                    </div>

                                    <div
                                        class="basis-[45%] flex flex-row  items-center border-l border-gray-500 py-0.5 ">
                                        <div class="basis-[30%] border-r  flex flex-col border-gray-500 w-full h-full">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                <p>(Male/Female)</p>
                                            </div>

                                            <div class="flex w-full">
                                                <FocusableButton isCenter :documentName="'Bride Gender'"
                                                    :field="'bride_sex'" :tabIndex="26" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>

                                        </div>
                                        <div class="grow flex flex-col h-full ">
                                            <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                <p>(Citizenship)</p>
                                            </div>

                                            <div class="flex w-full">
                                                <FocusableButton isCenter isAddress :documentName="'Bride Citizenship'"
                                                    :field="'bride_citizenship'" :tabIndex="27" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>

                                            <!-- <InputBottomBorderMarriage v-model="formData.groom_citizenship" middle
                                                isBold label="Citizenship" top_label /> -->
                                        </div>


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] flex flex-col items-center border-r border-gray-500  py-0.5 ">
                                        <!-- <InputBottomBorderMarriage v-model="formData.groom_residence"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label /> -->

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>
                                        </div>

                                        <div class="flex w-full">
                                            <FocusableButton isCenter isAddress
                                                :documentName="'Groom Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'groom_residence'" :tabIndex="28" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>

                                        <!-- <SuggestionInputBottomBorderMarriage /> -->

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">5. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] flex flex-col items-center border-l border-gray-500 py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>
                                        </div>

                                        <div class="flex w-full">
                                            <FocusableButton isCenter isAddress
                                                :documentName="'Bride Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'bride_residence'" :tabIndex="29" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>


                                        <!-- <InputBottomBorderMarriage v-model="formData.bride_residence"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label /> -->
                                        <!-- <InputBottomBorderMarriage v-model="formData.bride_residence_country"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label /> -->
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center h-full justify-center border-r border-gray-500   ">
                                        <FocusableButton isAddress :documentName="'Groom Religion'"
                                            :field="'groom_religion'" :tabIndex="30" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">6. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Religion/
                                            Religous Sect
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500  ">
                                        <FocusableButton isAddress :documentName="'Bride Religion'"
                                            :field="'bride_religion'" :tabIndex="31" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <!-- <SelectBottomBorderMarriage @change="is_with_dissolved" :options="[
                                            { value: 'SINGLE', label: 'SINGLE' },
                                            { value: 'ANNULLED', label: 'ANNULLED' },
                                            { value: 'WIDOW', label: 'WIDOW' },
                                            { value: 'WIDOWER', label: 'WIDOWER' },
                                            { value: 'DIVORCED', label: 'DIVORCED' },
                                            { value: 'MARRIED', label: 'MARRIED' },
                                            { value: 'NOT STATED', label: 'NOT STATED' },
                                            { value: 'NOT APPLICABLE', label: 'NOT APPLICABLE' },

                                        ]" v-model="formData.groom_civil_status" isBold /> -->

                                        <FocusableButton :documentName="'Groom Civil Status'"
                                            :field="'groom_civil_status'" :tabIndex="32" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">7. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Civil Status
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <!-- <SelectBottomBorderMarriage @change="is_with_dissolved" :options="[
                                            { value: 'SINGLE', label: 'SINGLE' },
                                            { value: 'ANNULLED', label: 'ANNULLED' },
                                            { value: 'WIDOW', label: 'WIDOW' },
                                            { value: 'WIDOWER', label: 'WIDOWER' },
                                            { value: 'DIVORCED', label: 'DIVORCED' },
                                            { value: 'MARRIED', label: 'MARRIED' },
                                            { value: 'NOT STATED', label: 'NOT STATED' },
                                            { value: 'NOT APPLICABLE', label: 'NOT APPLICABLE' },

                                        ]" v-model="formData.bride_civil_status" isBold /> -->

                                        <FocusableButton :documentName="'Bride Civil Status'"
                                            :field="'bride_civil_status'" :tabIndex="33" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />


                                    </div>
                                </div>
                                <!-- 8 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1  gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_previously_married_dissolved"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" isBold />
                                        <!-- <InputBottomBorderMarriage v-else
                                            v-model="formData.groom_previously_married_dissolved" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Groom if previously married: how was it dissolved?'" v-else
                                            :field="'groom_previously_married_dissolved'" :tabIndex="34"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">8. </p>
                                        <p class="text-[9px] w-[80%]  h-full flex items-center text-start">IF PREVIOUSLY
                                            MARRIED: How was
                                            it dissolved?
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_previously_married_dissolved"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" isBold />
                                        <!-- <InputBottomBorderMarriage v-else
                                            v-model="formData.bride_previously_married_dissolved" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Bride if previously married: how was it dissolved?'" v-else
                                            :field="'bride_previously_married_dissolved'" :tabIndex="35"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />

                                    </div>
                                </div>
                                <!-- 9 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div :class="[formData.groom_civil_status === 'SINGLE' ? 'grid grid-cols-1' : 'grid grid-cols-3']"
                                        class="basis-[45%] w-full  gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="City/Municipality" top_label
                                            v-model="formData.groom_place_dissolved_municipality"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Province" top_label
                                            v-model="formData.groom_place_dissolved_province"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Country" top_label
                                            v-model="formData.groom_place_dissolved_country"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <!-- <p v-else class="font-medium px-4 text-xs">N/A</p> -->

                                        <!-- <InputBottomBorderMarriage v-else v-model="formData.groom_place_dissolved"
                                            isBold /> -->

                                        <FocusableButton :documentName="'Groom Place where dissolved'" v-else
                                            :field="'groom_place_dissolved'" :tabIndex="36" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />

                                    </div>

                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">9. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Place where
                                            dissolved
                                        </p>
                                    </div>
                                    <div :class="[formData.bride_civil_status === 'SINGLE' ? 'grid grid-cols-1' : 'grid grid-cols-3']"
                                        class="basis-[45%] gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="City/Municipality" top_label
                                            v-model="formData.bride_place_dissolved_municipality"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Province" top_label
                                            v-model="formData.bride_place_dissolved_province"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Country" top_label
                                            v-model="formData.bride_place_dissolved_country"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <!-- <p v-else class="font-medium px-4 text-xs">N/A</p> -->
                                        <!-- <InputBottomBorderMarriage v-else v-model="formData.bride_place_dissolved"
                                            isBold /> -->

                                        <FocusableButton :documentName="'Bride Place where dissolved'" v-else
                                            :field="'bride_place_dissolved'" :tabIndex="37" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                </div>
                                <!-- 10 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div :class="[formData.groom_civil_status === 'SINGLE' ? 'grid grid-cols-1' : 'grid grid-cols-3']"
                                        class="basis-[45%]  gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="Day" top_label
                                            v-model="formData.groom_date_dissolved_day"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Month" top_label
                                            v-model="formData.groom_date_dissolved_month"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Year" top_label
                                            v-model="formData.groom_date_dissolved_year"
                                            v-if="formData.groom_civil_status !== 'SINGLE'" />
                                        <!-- <InputBottomBorderMarriage v-else v-model="formData.groom_date_dissolved"
                                            isBold /> -->

                                        <FocusableButton :documentName="'Groom  Date when dissolved'" v-else
                                            :field="'groom_date_dissolved'" :tabIndex="38" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">10. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Date when
                                            dissolved
                                        </p>
                                    </div>
                                    <div :class="[formData.bride_civil_status === 'SINGLE' ? 'grid grid-cols-1' : 'grid grid-cols-3']"
                                        class="basis-[45%] gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="Day" top_label
                                            v-model="formData.bride_date_dissolved_day"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Month" top_label
                                            v-model="formData.bride_date_dissolved_month"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <InputBottomBorderMarriage isBold label="Year" top_label
                                            v-model="formData.bride_date_dissolved_year"
                                            v-if="formData.bride_civil_status !== 'SINGLE'" />
                                        <!-- <InputBottomBorderMarriage v-else v-model="formData.bride_date_dissolved"
                                            isBold /> -->

                                        <FocusableButton :documentName="'Bride Date when dissolved'" v-else
                                            :field="'bride_date_dissolved'" :tabIndex="39" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <!-- <InputBottomBorderMarriage v-model="formData.groom_degree_relation" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Groom Degree of relationship of contractng parties'"
                                            :field="'groom_degree_relation'" :tabIndex="40" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">11. </p>
                                        <p class="text-[9px] w-[80%]  h-full flex items-center text-start">Degree of
                                            relationship of
                                            contractng parties
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <!-- <InputBottomBorderMarriage v-model="formData.bride_degree_relation" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Bride  Degree of relationship of contractng parties'"
                                            :field="'bride_degree_relation'" :tabIndex="41" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] flex flex-col items-center border-r border-gray-500  py-0.5 ">

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(First)</p>
                                            <p>(Middle)</p>
                                            <p>(Last)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter :documentName="'Groom Father First Name'"
                                                :field="'groom_father_first_name'" :tabIndex="42" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Father Middle Name'"
                                                :field="'groom_father_middle_name'" :tabIndex="43" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Father Last Name'"
                                                :field="'groom_father_last_name'" :tabIndex="44" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">12. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Name of Father
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] flex flex-col items-center border-l border-gray-500  py-0.5 ">

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(First)</p>
                                            <p>(Middle)</p>
                                            <p>(Last)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter :documentName="'Bride Father First Name'"
                                                :field="'bride_father_first_name'" :tabIndex="45" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Father Middle Name'"
                                                :field="'bride_father_middle_name'" :tabIndex="46" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Father Last Name'"
                                                :field="'bride_father_last_name'" :tabIndex="47" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <!-- <InputBottomBorderMarriage v-model="formData.groom_father_citizenship" isBold /> -->
                                        <FocusableButton isAddress :documentName="'Groom Father Citizenship'"
                                            :field="'groom_father_citizenship'" :tabIndex="48" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">13. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <!-- <InputBottomBorderMarriage v-model="formData.bride_father_citizenship" isBold /> -->
                                        <FocusableButton isAddress :documentName="'Bride Father Citizenship'"
                                            :field="'bride_father_citizenship'" :tabIndex="49" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] flex flex-col w-full items-center border-r border-gray-500  py-0.5 ">


                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Groom Father Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'groom_father_residence'" :tabIndex="50" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />


                                        </div>
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">14. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] flex flex-col w-full items-center border-l border-gray-500  py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Bride Father Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'bride_father_residence'" :tabIndex="51" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] flex flex-col justify-center items-center border-r border-gray-500  py-0.5 ">

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(First)</p>
                                            <p>(Middle)</p>
                                            <p>(Last)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter :documentName="'Groom Mother First Name'"
                                                :field="'groom_mother_first_name'" :tabIndex="52" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Mother Middle Name'"
                                                :field="'groom_mother_middle_name'" :tabIndex="53" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Groom Mother Last Name'"
                                                :field="'groom_mother_last_name'" :tabIndex="54" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">15. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Maiden Name of
                                            Mother
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] flex justify-center flex-col items-center border-l border-gray-500 py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(First)</p>
                                            <p>(Middle)</p>
                                            <p>(Last)</p>
                                        </div>

                                        <div class="grid grid-cols-3 w-full">
                                            <FocusableButton isCenter :documentName="'Bride Mother First Name'"
                                                :field="'bride_mother_first_name'" :tabIndex="55" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Mother Middle Name'"
                                                :field="'bride_mother_middle_name'" :tabIndex="56" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                            <FocusableButton isCenter :documentName="'Bride Mother Last Name'"
                                                :field="'bride_mother_last_name'" :tabIndex="57" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />

                                        </div>

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">

                                        <FocusableButton isAddress :documentName="'Groom Mother Citizenship'"
                                            :field="'groom_mother_citizenship'" :tabIndex="58" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">16. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">

                                        <FocusableButton isAddress :documentName="'Bride Mother Citizenship'"
                                            :field="'bride_mother_citizenship'" :tabIndex="59" :formData="formData"
                                            :activeInputField="active_input_field" :openFormInput="open_form_input" />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Groom Mother Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'groom_mother_residence'" :tabIndex="60" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">17. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Bride Mother Residence (House No., St., Barangay, City/Municipality, Province, Country)'"
                                                :field="'bride_mother_residence'" :tabIndex="61" :formData="formData"
                                                :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">


                                        <div class="h-[2rem] w-full">
                                            <FocusableButton :documentName="'Groom person who gave consent or advice'"
                                                :field="'groom_person_who_gave_consent'" :tabIndex="62"
                                                :formData="formData" :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">18. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Person who gave
                                            consent or
                                            advise
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">

                                        <div class="h-[2rem] w-full">

                                            <FocusableButton :documentName="'Bride person who gave consent or advice'"
                                                :field="'bride_person_who_gave_consent'" :tabIndex="63"
                                                :formData="formData" :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <!-- <InputBottomBorderMarriage
                                            v-model="formData.groom_person_who_gave_consent_relation" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Groom person who gave consent or advice Relationship'"
                                            :field="'groom_person_who_gave_consent_relation'" :tabIndex="64"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">19. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Relationship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <!-- <InputBottomBorderMarriage
                                            v-model="formData.bride_person_who_gave_consent_relation" isBold /> -->
                                        <FocusableButton
                                            :documentName="'Bride person who gave consent or advice Relationship'"
                                            :field="'bride_person_who_gave_consent_relation'" :tabIndex="65"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">

                                        <FocusableButton isAddress
                                            :documentName="'Groom person who gave consent or advice Citizenship'"
                                            :field="'groom_person_who_gave_consent_citizenship'" :tabIndex="66"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">20. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">

                                        <FocusableButton isAddress
                                            :documentName="'Bride person who gave consent or advice Citizenship'"
                                            :field="'bride_person_who_gave_consent_citizenship'" :tabIndex="67"
                                            :formData="formData" :activeInputField="active_input_field"
                                            :openFormInput="open_form_input" />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">

                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Groom  person who gave consent or advicer Residence '"
                                                :field="'groom_person_who_gave_consent_residence'" :tabIndex="68"
                                                :formData="formData" :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center font-semi">21. </p>
                                        <p
                                            class="text-xs w-[80%]  h-full flex items-center text-start font-medium text-gray-800">
                                            Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">


                                        <div class="flex flex-row justify-around w-full text-[10px] font-medium">
                                            <p>(House No., St., Barangay, City/Municipality, Province, Country)</p>

                                        </div>

                                        <div class="grid w-full">
                                            <FocusableButton isCenter
                                                :documentName="'Bride  person who gave consent or advicer Residence '"
                                                :field="'bride_person_who_gave_consent_residence'" :tabIndex="69"
                                                :formData="formData" :activeInputField="active_input_field"
                                                :openFormInput="open_form_input" />
                                        </div>


                                    </div>
                                </div>
                                <div class="grid grid-cols-2  w-full h-full relative">
                                    <div
                                        class="border-r border-gray-500  flex flex-col items-center justify-center h-full">
                                        <div class="mt-auto"></div>
                                        <div class="flex flex-col gap-1  px-3 mt-auto mb-auto">
                                            <p class="italic text-xs tracking-widest font-serif indent-10"><span
                                                    class="font-bold text-sm not-italic">SUBSCRIBE
                                                    AND
                                                    SWORN</span> to before me this
                                            </p>
                                            <div class="flex flex-row gap-1 ">
                                                <div class="w-[48%] ">
                                                    <!-- <InputBottomBorderMarriage v-model="formData.groom_ss_day" isBold /> -->

                                                    <FocusableButton isCenter
                                                        :documentName="'Groom  Subscribe and sworn day'"
                                                        :field="'groom_ss_day'" :tabIndex="70" isDate
                                                        :formData="formData" :activeInputField="active_input_field"
                                                        :openFormInput="open_form_input" />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.groom_ss_month"
                                                    isBold /> -->
                                                <FocusableButton isCenter
                                                    :documentName="'Groom  Subscribe and sworn month'"
                                                    :field="'groom_ss_month'" :tabIndex="71" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.groom_ss_year" /> -->
                                                <FocusableButton isCenter
                                                    :documentName="'Groom  Subscribe and sworn year'"
                                                    :field="'groom_ss_year'" :tabIndex="72" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">, at</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.groom_ss_at"
                                                    isBold /> -->
                                                <FocusableButton isCenter
                                                    :documentName="'Groom  Subscribe and sworn at'"
                                                    :field="'groom_ss_at'" :tabIndex="76" :formData="formData"
                                                    :activeInputField="active_input_field" isAddress
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant
                                                    who
                                                </p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                    Community Tax
                                                    Cert.</p>
                                                <!-- <InputBottomBorderMarriage e v-model="formData.groom_ctc_number"
                                                    middle /> -->

                                                <FocusableButton isCenter :documentName="'Groom CTC Number'"
                                                    :field="'groom_ctc_number'" :tabIndex="78" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />

                                                <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">on</p>
                                                <!-- <InputBottomBorderMarriage v-model="formData.groom_ctc_on" middle /> -->

                                                <FocusableButton isCenter :documentName="'Groom CTC Issued on'"
                                                    :field="'groom_ctc_on'" :tabIndex="80" :formData="formData" isDate
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />




                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            </div>
                                            <div class="flex flex-row gap-1">
                                                <p class="font-serif  text-nowrap text-xs italic">at</p>
                                                <!-- <InputBottomBorderMarriage v-model="formData.groom_ctc_at" middle /> -->

                                                <FocusableButton isCenter :documentName="'Groom CTC Issued At'"
                                                    :field="'groom_ctc_at'" isAddress :tabIndex="84"
                                                    :formData="formData" :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>
                                        </div>
                                        <div class="mt-auto w-full">
                                            <div class="w-full h-full flex flex-col">
                                                <FocusableButton isCenter class="px-2"
                                                    :documentName="'Signature Over Printed Name of the Civil Registrar'"
                                                    :field="'civil_registrar'" :tabIndex="87" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <div
                                                    class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                    <p>(Signature Over printed name of the civil registrar)</p>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" flex flex-col items-center justify-center h-full">
                                        <div class="mt-auto">

                                        </div>

                                        <div class="flex flex-col gap-1 px-3 mt-auto mb-auto">
                                            <p class="italic text-xs tracking-widest font-serif indent-10 text-nowrap">
                                                <span class="font-bold text-sm not-italic ">SUBSCRIBE
                                                    AND
                                                    SWORN</span> to before me this
                                            </p>
                                            <div class="flex flex-row gap-1 ">
                                                <div class="w-[48%] ">
                                                    <!-- <InputBottomBorderMarriage v-model="formData.bride_ss_day" isBold /> -->
                                                    <FocusableButton isCenter
                                                        :documentName="'Bride  Subscribe and sworn day'" isDate
                                                        :field="'bride_ss_day'" :tabIndex="73" :formData="formData"
                                                        :activeInputField="active_input_field"
                                                        :openFormInput="open_form_input" />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.bride_ss_month"
                                                    isBold /> -->
                                                <FocusableButton isCenter
                                                    :documentName="'Bride  Subscribe and sworn month'"
                                                    :field="'bride_ss_month'" :tabIndex="74" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.bride_ss_year" />  -->
                                                <FocusableButton isCenter
                                                    :documentName="'Bride  Subscribe and sworn year'"
                                                    :field="'bride_ss_year'" :tabIndex="75" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">at</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.bride_ss_at"
                                                    isBold /> -->

                                                <FocusableButton isCenter
                                                    :documentName="'Bride  Subscribe and sworn at'"
                                                    :field="'bride_ss_at'" :tabIndex="77" :formData="formData" isAddress
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant
                                                    who
                                                </p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                    Community Tax
                                                    Cert.</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.bride_ctc_number" /> -->

                                                <FocusableButton isCenter :documentName="'Bride CTC Number'"
                                                    :field="'bride_ctc_number'" :tabIndex="79" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />

                                                <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">on</p>
                                                <!-- <InputBottomBorderMarriage middle v-model="formData.bride_ctc_on" /> -->

                                                <FocusableButton isCenter :documentName="'Bride CTC Issued on'"
                                                    :field="'bride_ctc_on'" :tabIndex="82" :formData="formData" isDate
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />


                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            </div>
                                            <div class="flex flex-row gap-1">
                                                <p class="font-serif  text-nowrap text-xs italic">at</p>
                                                <FocusableButton isAddress isCenter
                                                    :documentName="'Bride CTC Issued At'" :field="'bride_ctc_at'"
                                                    :tabIndex="85" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                            </div>
                                        </div>
                                        <div class="mt-auto w-full">
                                            <div class="w-full h-full flex flex-col">
                                                <FocusableButton isCenter class="px-2"
                                                    :documentName="'Signature Over Printed Name of the Civil Registrar'"
                                                    :field="'civil_registrar'" :tabIndex="87" :formData="formData"
                                                    :activeInputField="active_input_field"
                                                    :openFormInput="open_form_input" />
                                                <div
                                                    class="flex flex-row justify-around w-full text-[10px] font-medium">
                                                    <p>(Signature Over printed name of the civil registrar)</p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="page === 2" class="w-full h-full flex flex-col relative ">

                                <div class="justify-center flex  items-center flex-col gap-1 mb-10">
                                    <p class="font-bold text-4xl font-sans tracking-widest">NOTICE</p>
                                    <p class="font-bold text-2xl mt-5 font-sans">APPLICANTS FOR MARRIAGE LICENSE</p>
                                    <div class="w-[50%] mt-2">
                                        <InputBottomBorderMarriage page_2 text="text-sm" middle isBold
                                            v-model="formData.notice_groom_name" />
                                    </div>
                                    <p>and</p>
                                    <div class="w-[50%] mt-2">
                                        <InputBottomBorderMarriage isBold page_2 middle
                                            v-model="formData.notice_bride_name" />
                                    </div>
                                </div>

                                <div class="justify-center flex  items-center flex-row gap-10 px-10 mb-4">
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


                                    <div class="flex flex-col grow gap-2">
                                        <div class="flex flex-row w-full">
                                            <div class="flex flex-row grow items-center ">
                                                <p>Name: </p>
                                                <InputBottomBorderMarriage page_2 middle
                                                    v-model="formData.notice_groom_name" isBold />
                                            </div>
                                            <div class="flex flex-row basis-[30%]  items-center">
                                                <p>Age: </p>
                                                <InputBottomBorderMarriage page_2 middle
                                                    v-model="formData.notice_groom_age" />
                                            </div>
                                        </div>
                                        <div class="flex flex-row  items-center">
                                            <p>Birthplace: </p>
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_groom_birthplace" />
                                        </div>
                                        <div class="flex flex-row  items-center">
                                            <p>Residence: </p>
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_groom_residence" />
                                        </div>
                                        <div class="flex flex-row  items-center">
                                            <p>Father: </p>
                                            <InputBottomBorderMarriage page_2 v-model="formData.notice_groom_father" />
                                        </div>
                                        <div class="flex flex-row  items-center">
                                            <p>Mother: </p>
                                            <InputBottomBorderMarriage page_2 v-model="formData.notice_groom_mother" />
                                        </div>
                                    </div>

                                </div>




                                <div class="justify-center flex  items-center flex-row gap-10 mt-5 px-10">


                                    <div class="  h-[166px] w-[170px] ">
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

                                    <div class="flex flex-col grow gap-2 relative">
                                        <p class="font-bold absolute -top-8 left-24">WISHES TO CONTRACT MARRIAGE WITH
                                        </p>
                                        <div class="flex flex-row w-full">
                                            <div class="flex flex-row grow items-center">
                                                <p>Name: </p>
                                                <InputBottomBorderMarriage page_2 middle isBold
                                                    v-model="formData.notice_bride_name" />
                                            </div>
                                            <div class="flex flex-row basis-[30%] items-center">
                                                <p>Age: </p>
                                                <InputBottomBorderMarriage page_2 middle
                                                    v-model="formData.notice_bride_age" />
                                            </div>
                                        </div>
                                        <div class="flex flex-row ">
                                            <p>Birthplace: </p>
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_bride_birthplace" />
                                        </div>
                                        <div class="flex flex-row ">
                                            <p>Residence: </p>
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_bride_residence" />
                                        </div>
                                        <div class="flex flex-row ">
                                            <p>Father: </p>
                                            <InputBottomBorderMarriage page_2 v-model="formData.notice_bride_father" />
                                        </div>
                                        <div class="flex flex-row ">
                                            <p>Mother: </p>
                                            <InputBottomBorderMarriage page_2 v-model="formData.notice_bride_mother" />
                                        </div>
                                    </div>

                                </div>


                                <div class="flex flex-col  justify-center items-center mt-3">
                                    <div class="w-[30%]">
                                        <InputBottomBorderMarriage page_2 middle
                                            v-model="formData.notice_date_posting" />
                                    </div>

                                    <p>Date</p>
                                </div>
                                <div class="flex flex-row justify-between px-20 mt-5">

                                    <div class="flex flex-col">
                                        <p class="font-bold italic">Copy Furnished:</p>
                                        <div class="w-[20rem] flex flex-col gap-1">
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_copy_furnished1" />
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_copy_furnished2" />
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_copy_furnished3" />
                                            <InputBottomBorderMarriage page_2
                                                v-model="formData.notice_copy_furnished4" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <div class="w-[18rem]">
                                            <InputBottomBorderMarriage middle isBold page_2
                                                v-model="formData.civil_registrar" />
                                        </div>
                                        <p class="italic">Municipal Civil Registrar</p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div class="h-full w-full flex items-center justify-center  relative" v-if="preview">
                        <PDFViewerWorker :pdfBytes64="pdf_content" v-if="preview && page === 1" />
                        <PDFViewerWorker :pdfBytes64="notice_pdf_content" v-if="preview && page === 2" />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref, nextTick, watch } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';
import Camera from '../../components/Camera.vue';
import { onClickOutside } from '@vueuse/core'
import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import TableGrid from '../../components/TableGrid.vue';
import { useApplicationMarriageLicense } from '../../stores/APL';
import FocusableButton from '../../components/Marriage/FocusableButton.vue';
import ActionBtn from '../../components/Marriage/ActionBtn.vue';
import { AuthStore } from "../../stores/Authentication.js";

/**
 * Authentication
 * @IMPORTANT
 */
const auth = AuthStore()

const temporary_form = reactive({
    groom_date_birth: '',
    bride_date_birth: '',
})

const is_form_input_active = ref(false)
const input_form_value = ref()
const active_document_form = ref()
const active_input_field = ref()
const input_form_field = ref(null)
const current_tab = ref()


const open_form_input = (name, field, tabIndex, isDate, is_address) => {
    is_form_input_active.value = true;
    active_document_form.value = name;
    active_input_field.value = field;
    input_form_field.value.focus()
    current_tab.value = tabIndex

    input_form_value.value = (field !== active_input_field.value || formData[field]) ? formData[field] : '';

    setTimeout(() => {
        input_form_field.value.focus();


        if (input_form_value.value?.length) {
            input_form_field.value.select();
        }
    }, 50);
};


const submit_input_data = (event, field) => {
    const data = input_form_value.value;
    formData[field] = data ? data.toUpperCase() : data;

    focusNextInput(event);

};

const focusNextInput = (event) => {
    event.preventDefault();

    current_tab.value += 1;

    const nextButton = Array.from(document.querySelectorAll('button[tabindex]:not([tabindex="-1"])'))
        .find(button => button.tabIndex === current_tab.value);

    if (nextButton) {
        nextButton.focus();
    }
};



const add_age = (birth_date, field) => {

};

const date_birth_spreader = (date, field) => {

}

const add_details_to_notice = (field) => {

};

const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 13 : 8
})
const change_page = (value) => {
    if (page.value === value) { return }
    page.value = value

    if (preview.value) {
        preview_document()
    }
}


const adjustment_div = ref(null)
onClickOutside(adjustment_div, event => adjustment_setting.value = false)


const preview = ref(false)
const pdf_content = ref()
const notice_pdf_content = ref()

const change_mode = () => {
    preview.value = !preview.value

    if (preview.value) {
        preview_document()
    }
}

const pdf_settings = reactive({
    x: 0,
    y: 0,
})



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

const apl = useApplicationMarriageLicense()

onMounted(() => {
    calculatePPI();
    auth.isAuthenticated()
    apl.getApplicationMarriageLicense()
});

const modal = ref(false);

const open_model = () => {
    modal.value = true;

    const date = new Date()

    formData.groom_civil_status = 'SINGLE'
    formData.bride_civil_status = 'SINGLE'

    formData.civil_registrar = 'ISMAEL D. MALICDEM, JR.'
    formData.received_by = 'ISMAEL D. MALICDEM, JR.'
    formData.groom_sex = "MALE"
    formData.bride_sex = "FEMALE"
    formData.header_province = "PANGASINAN"
    formData.header_municipality = "BAYAMBANG"

    formData.date_of_receipt = format(date, 'MMMM dd, yyyy').toUpperCase()
    formData.registry_number = format(date, 'yyyy') + '-'

};



const initialForm = {
    header_province: '',
    header_municipality: '',
    registry_number: '',
    received_by: '',
    date_of_receipt: '',
    marriage_license_number: '',
    date_issuance_marriage_license: '',
    groom_contract_marriage_with: '',
    bride_contract_marriage_with: '',

    civil_registrar: '',

    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',

    groom_day: '',
    groom_month: '',
    groom_year: '',

    groom_age: '',

    groom_municipality: '',
    groom_province: '',
    groom_country: '',

    groom_sex: '',
    groom_citizenship: '',
    groom_residence: '',
    groom_residence_country: '', // 
    groom_religion: '',
    groom_civil_status: '',

    groom_degree_relation: '',
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
    groom_ss_at: '',
    groom_ctc_number: '',
    groom_ctc_on: '',
    groom_ctc_at: '',


    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',

    bride_day: '',
    bride_month: '',
    bride_year: '',


    bride_age: '',
    bride_municipality: '',
    bride_province: '',
    bride_country: '',
    bride_sex: '',
    bride_citizenship: '',
    bride_residence: '',
    bride_residence_country: '', //
    bride_religion: '',
    bride_civil_status: '',



    bride_degree_relation: '',
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
    bride_ss_at: '',
    bride_ctc_number: '',
    bride_ctc_on: '',
    bride_ctc_at: '',



    /**
     *  Notice Input Fields
     */


    notice_province: '',
    notice_municipality: '',
    notice_office: '',

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

watch(formData, (newValue, oldValue) => {

    const groomFullName = formData.groom_first_name || formData.groom_middle_name && formData.groom_last_name
        ? `${formData.groom_first_name} ${formData.groom_middle_name} ${formData.groom_last_name}`
        : '';

    const brideFullName = formData.bride_first_name || formData.bride_middle_name && formData.bride_last_name
        ? `${formData.bride_first_name} ${formData.bride_middle_name} ${formData.bride_last_name}`
        : '';

    if (groomFullName) {
        formData.bride_contract_marriage_with = groomFullName;
    }

    if (brideFullName) {
        formData.groom_contract_marriage_with = brideFullName;
    }


    if (formData.groom_civil_status === 'SINGLE') {
        formData.groom_place_dissolved = 'N/A'
        formData.groom_date_dissolved = 'N/A'
        formData.groom_previously_married_dissolved = 'N/A'

    } else {
        formData.groom_place_dissolved = ''
        formData.groom_date_dissolved = ''
        formData.groom_previously_married_dissolved = ''
    }
    if (formData.bride_civil_status === 'SINGLE') {
        formData.bride_place_dissolved = 'N/A'
        formData.bride_date_dissolved = 'N/A'
        formData.bride_previously_married_dissolved = 'N/A'
    } else {
        formData.bride_place_dissolved = ''
        formData.bride_date_dissolved = ''
        formData.bride_previously_married_dissolved = ''
    }
});


// Pictures
const groom_picture = ref(null)
const handle_groom_image = (capturedImage) => {
    groom_picture.value = capturedImage
}
const bride_picture = ref(null)
const handle_bride_image = (capturedImage) => {
    bride_picture.value = capturedImage
}

// Make form blank
const blank = () => {
    Object.assign(formData, { ...initialForm });
}
// Close Form Editor
const close_modal = () => {
    Object.assign(formData, { ...initialForm });
    groom_picture.value = null;
    bride_picture.value = null;
    modal.value = false;
    page.value = 1
    preview.value = false
};


const preview_document = async () => {
    if (preview.value) {
        const data = JSON.stringify({ ...formData })

        if (page.value === 1) {
            const previewData = await window.MarriageApi.previewMarriage(data);
            pdf_content.value = previewData.pdfbase64;
        }
        else if (page.value === 2) {

            const bride = bride_picture.value
            const groom = groom_picture.value

            const images = [
                bride, groom
            ]

            const image_data = JSON.stringify(images)
            const previewData = await window.MarriageApi.previewNotice(data, image_data);
            notice_pdf_content.value = previewData.pdfbase64;
        }
    }
}

function removeBase64Prefix(base64String) {
    return base64String.replace(/^data:application\/pdf;base64,/, '');
}

const print = async () => {
    const data = JSON.stringify({ ...formData })
    if (page.value === 1) {
        const settings = JSON.stringify({ ...pdf_settings })
        const previewData = await window.MarriageApi.printMarriage(data, settings);
        console.log(previewData)
    }
    if (page.value === 2) {

        const bride = bride_picture.value
        const groom = groom_picture.value

        const images = [
            bride, groom
        ]

        const image_data = JSON.stringify(images)

        const previewData = await window.MarriageApi.previewNotice(data, image_data);

        const dataUri = removeBase64Prefix(previewData.pdfbase64)


        if (previewData) {
            const print_after_preview_without_gui = await window.MarriageApi.printNotice(dataUri);
        }
    }
}
const submit = async () => {
    const bride = bride_picture.value
    const groom = groom_picture.value

    const images = [
        bride, groom
    ]

    const image_data = JSON.stringify(images)
    const main_data = JSON.stringify({ ...formData })

    const save_local = await window.MarriageApi.saveMarriageApplicationEntry(main_data, image_data)

    if (save_local.status === true) {
        const data = {
            header_province: formData.header_province,
            header_municipality: formData.header_municipality,
            registry_number: formData.registry_number,
            received_by: formData.received_by,
            date_of_receipt: formData.date_of_receipt,
            marriage_license_number: formData.marriage_license_number,
            date_issuance_marriage_license: formData.date_issuance_marriage_license,
            groom_contract_marriage_with: formData.groom_contract_marriage_with,
            bride_contract_marriage_with: formData.bride_contract_marriage_with,

            civil_registrar: formData.civil_registrar,

            groom_first_name: formData.groom_first_name,
            groom_middle_name: formData.groom_middle_name,
            groom_last_name: formData.groom_last_name,

            groom_day: formData.groom_day,
            groom_month: formData.groom_month,
            groom_year: formData.groom_year,

            groom_age: formData.groom_age,

            groom_municipality: formData.groom_municipality,
            groom_province: formData.groom_province,
            groom_country: formData.groom_country,

            groom_sex: formData.groom_sex,
            groom_citizenship: formData.groom_citizenship,
            groom_residence: formData.groom_residence,
            groom_residence_country: formData.groom_residence_country,
            groom_religion: formData.groom_religion,
            groom_civil_status: formData.groom_civil_status,
            groom_previously_married_dissolved: formData.groom_previously_married_dissolved,
            groom_place_dissolved: formData.groom_place_dissolved,
            groom_date_dissolved: formData.groom_date_dissolved,
            groom_degree_relation: formData.groom_degree_relation,
            groom_father_first_name: formData.groom_father_first_name,
            groom_father_middle_name: formData.groom_father_middle_name,
            groom_father_last_name: formData.groom_father_last_name,
            groom_father_citizenship: formData.groom_father_citizenship,
            groom_father_residence: formData.groom_father_residence,
            groom_father_residence_country: formData.groom_father_residence_country,
            groom_mother_first_name: formData.groom_mother_first_name,
            groom_mother_middle_name: formData.groom_mother_middle_name,
            groom_mother_last_name: formData.groom_mother_last_name,
            groom_mother_citizenship: formData.groom_mother_citizenship,
            groom_mother_residence: formData.groom_mother_residence,
            groom_mother_residence_country: formData.groom_mother_residence_country,
            groom_person_who_gave_consent: formData.groom_person_who_gave_consent,
            groom_person_who_gave_consent_relation: formData.groom_person_who_gave_consent_relation,
            groom_person_who_gave_consent_citizenship: formData.groom_person_who_gave_consent_citizenship,
            groom_person_who_gave_consent_residence: formData.groom_person_who_gave_consent_residence,


            groom_ss_day: formData.groom_ss_day,
            groom_ss_month: formData.groom_ss_month,
            groom_ss_year: formData.groom_ss_year,
            groom_ss_at: formData.groom_ss_at,
            groom_ctc_number: formData.groom_ctc_number,
            groom_ctc_on: formData.groom_ctc_on,
            groom_ctc_at: formData.groom_ctc_at,


            bride_first_name: formData.bride_first_name,
            bride_middle_name: formData.bride_middle_name,
            bride_last_name: formData.bride_last_name,

            bride_day: formData.bride_day,
            bride_month: formData.bride_month,
            bride_year: formData.bride_year,

            bride_age: formData.bride_age,
            bride_municipality: formData.bride_municipality,
            bride_province: formData.bride_province,
            bride_country: formData.bride_country,
            bride_sex: formData.bride_sex,
            bride_citizenship: formData.bride_citizenship,
            bride_residence: formData.bride_residence,
            bride_residence_country: formData.bride_residence_country,
            bride_religion: formData.bride_religion,
            bride_civil_status: formData.bride_civil_status,
            bride_previously_married_dissolved: formData.bride_previously_married_dissolved,
            bride_place_dissolved: formData.bride_place_dissolved,
            bride_date_dissolved: formData.bride_date_dissolved,
            bride_degree_relation: formData.bride_degree_relation,
            bride_father_first_name: formData.bride_father_first_name,
            bride_father_middle_name: formData.bride_father_middle_name,
            bride_father_last_name: formData.bride_father_last_name,
            bride_father_citizenship: formData.bride_father_citizenship,
            bride_father_residence: formData.bride_father_residence,
            bride_father_residence_country: formData.bride_father_residence_country,
            bride_mother_first_name: formData.bride_mother_first_name,
            bride_mother_middle_name: formData.bride_mother_middle_name,
            bride_mother_last_name: formData.bride_mother_last_name,
            bride_mother_citizenship: formData.bride_mother_citizenship,
            bride_mother_residence: formData.bride_mother_residence,
            bride_mother_residence_country: formData.bride_mother_residence_country,
            bride_person_who_gave_consent: formData.bride_person_who_gave_consent,
            bride_person_who_gave_consent_relation: formData.bride_person_who_gave_consent_relation,
            bride_person_who_gave_consent_citizenship: formData.bride_person_who_gave_consent_citizenship,
            bride_person_who_gave_consent_residence: formData.bride_person_who_gave_consent_residence,


            bride_ss_day: formData.bride_ss_day,
            bride_ss_month: formData.bride_ss_month,
            bride_ss_year: formData.bride_ss_year,
            bride_ss_at: formData.bride_ss_at,
            bride_ctc_number: formData.bride_ctc_number,
            bride_ctc_on: formData.bride_ctc_on,
            bride_ctc_at: formData.bride_ctc_at,

            notice_province: formData.notice_province,
            notice_municipality: formData.notice_municipality,
            notice_office: formData.notice_office,

            notice_groom_name: formData.notice_groom_name,
            notice_bride_name: formData.notice_bride_name,

            notice_groom_age: formData.notice_groom_age,
            notice_groom_birthplace: formData.notice_groom_birthplace,
            notice_groom_residence: formData.notice_groom_residence,
            notice_groom_father: formData.notice_groom_father,
            notice_groom_mother: formData.notice_groom_mother,

            notice_bride_age: formData.notice_bride_age,
            notice_bride_birthplace: formData.notice_bride_birthplace,
            notice_bride_residence: formData.notice_bride_residence,
            notice_bride_father: formData.notice_bride_father,
            notice_bride_mother: formData.notice_bride_mother,

            notice_date_posting: formData.notice_date_posting,
            notice_position: formData.notice_position,
            notice_copy_furnished1: formData.notice_copy_furnished1,
            notice_copy_furnished2: formData.notice_copy_furnished2,
            notice_copy_furnished3: formData.notice_copy_furnished3,
            notice_copy_furnished4: formData.notice_copy_furnished4,

            file_path: save_local.filepath,
            created_by: auth.user_id

            // FOR DISSOLVED
        }


        const save_to_database = await apl.addApplicationMarriageLicense(data)

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
            // Combine first, middle, and last names
            const firstName = params.data.groom_first_name || '';
            const middleName = params.data.groom_middle_name || '';
            const lastName = params.data.groom_last_name || '';

            // You can adjust the formatting here (e.g., adding a space between names)
            return `${firstName} ${middleName} ${lastName}`.trim();
        }
    },
    {

        headerName: "Bride Name",
        cellClass: 'font-medium',
        flex: 2,
        valueGetter: (params) => {
            // Combine first, middle, and last names
            const firstName = params.data.bride_first_name || '';
            const middleName = params.data.bride_middle_name || '';
            const lastName = params.data.bride_last_name || '';

            // You can adjust the formatting here (e.g., adding a space between names)
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