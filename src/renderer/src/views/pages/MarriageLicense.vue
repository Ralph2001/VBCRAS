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

            <div class="flex h-full border borer-red-700 justify-center items-center w-full pt-8">
                <div class="fixed flex flex-row right-0 left-0 bg-blue-400 top-9 px-4 z-50">
                    <div class="flex flex-row items-center">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2" @click="change_page(1)"
                            :class="[page === 1 ? '' : 'text-gray-600']">Marriage
                            License</button>
                        <div class="block border border-blue-600 h-6"></div>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 " @click="change_page(2)"
                            :class="[page === 2 ? '' : 'text-gray-600']">Notice</button>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 flex items-center gap-1">
                            <font-awesome-icon icon="fa-regular fa-floppy-disk" /> Save</button>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2  flex items-center gap-1"
                            @click="change_mode()">
                            <font-awesome-icon icon="fa-regular fa-eye" v-if="!preview" />
                            <font-awesome-icon icon="fa-solid fa-pen-to-square" v-else/>
                            {{ !preview ? 'Preview' : 'Edit' }}</button>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2  flex items-center gap-1"
                            @click="change_mode()">
                            <font-awesome-icon icon="fa-solid fa-print" />Print</button>
                    </div>
                </div>

                <div v-if="show_input" ref="pop_up_div"
                    class="fixed bottom-0 right-0 left-0 bg-yellow-100 h-20 z-[50] flex items-center justify-center transition-all">
                    <div class="flex flex-col gap-1 ">
                        <label for="" class="text-xs text-gray-800 font-medium "> Please enter groom date of birth <span
                                class="italic text-xs">(mm/dd/yyyy)</span></label>
                        <input type="text" ref="input_pop_up" v-model="input_pop_value"
                            class=" w-[25rem] py-1 font-medium border border-gray-400 outline-none ring-0">
                    </div>
                </div>

                <div class="h-full  w-full flex   justify-center relative">
                    <div v-if="!preview" class="h-full w-full flex  overflow-scroll justify-center  p-20">
                        <div v-if="!preview" :style="paperStyle" class="flex bg-gray-50 shadow-md flex-col scale-110"
                            :class="[page === 1 ? 'py-14 pl-12 pr-10 ' : 'px-20 py-10']">
                            <div v-if="page === 1" class="w-full h-full border-[3px] border-gray-700 flex flex-col">

                                <!-- First -->
                                <!-- <div class="border-b border-gray-500 flex flex-col relative p-1 w-full">
                                    <div class="w-full flex flex-row">
                                        <p class="text-xs">Municipal Form. 90 (Form No. 2)</p>
                                        <p class="text-xs ml-auto">(To be accomplished in quadrupicate using black ink)
                                        </p>
                                    </div>
                                    <p class="text-xs">(Revised January 2007)</p>

                                    <div class="absolute left-0 top-4 right-0 w-full items-cente justify-center flex">
                                        <p class="text-sm ">Republic
                                            of
                                            the
                                            Philippines</p>
                                    </div>
                                    <p class="text-sm text-center">OFFICE OF THE CIVIL REGISTRATION GENERAL</p>
                                    <p class="text-2xl text-center font-bold text-gray-700">APPLICATION FOR MARRIAGE
                                        LICENSE
                                    </p>

                                </div> -->
                                <!-- Second -->
                                <div class="border-b border-gray-500 flex flex-row relative  w-full">
                                    <div class="basis-[70%] flex flex-col  border-r border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Province</p>
                                            <InputBottomBorderMarriage isBold v-model="formData.header_province" />
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">City/Municipality</p>
                                            <InputBottomBorderMarriage isBold v-model="formData.header_municipality" />
                                        </div>
                                    </div>
                                    <div class="relative p-1 flex flex-row">
                                        <p class="text-sm text-nowrap"> Registry No.</p>
                                        <div class="items-center flex  justify-center">
                                            <InputBottomBorderMarriage isBold v-model="formData.registry_number" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Third -->
                                <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                    <div class="flex flex-col  border-r border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Received by:</p>
                                            <InputBottomBorderMarriage isBold v-model="formData.received_by" />
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Date of Receipt:</p>
                                            <InputBottomBorderMarriage isBold v-model="formData.date_of_receipt" />
                                        </div>

                                    </div>
                                    <div class="flex flex-col  border-l border-gray-500 p-1">
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Marriage License No.:</p>
                                            <InputBottomBorderMarriage isBold
                                                v-model="formData.marriage_license_number" />
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <p class="text-sm text-nowrap ">Date of Issuance of Marriage License:</p>
                                            <InputBottomBorderMarriage isBold
                                                v-model="formData.date_issuance_marriage_license" />
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
                                <!-- <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                    <div class="flex flex-col  border-r border-gray-500 px-5">
                                        <p class="text-sm font-bold ">The Civil Registrar</p>
                                        <p class="text-xs indent-5">Sir/Madam:</p>
                                        <p class="text-xs indent-12 italic  text-justify relative">May I
                                            apply for a
                                            license to
                                            contract
                                            marriage with
                                        <div class="absolute w-[76%]">
                                            <InputBottomBorderMarriage isBold
                                                v-model="formData.groom_contract_marriage_with" middle />
                                        </div>

                                        </p>
                                        <span class=" text-xs italic text-justify indent-[76.5%]"> and
                                            to this
                                            effect, being duly sworn, I hereby depose and say that I have all the
                                            necessary
                                            qualifications and none of the legal disqualifications to contract the said
                                            marriage, and
                                            that the following data are true and correct to the best of my knowledge and
                                            information:</span>


                                    </div>
                                    <div class="flex flex-col border-l border-gray-500 px-5">
                                        <p class="text-sm font-bold ">The Civil Registrar</p>
                                        <p class="text-xs indent-5">Sir/Madam:</p>
                                        <p class="text-xs indent-12 italic  text-justify relative">May I
                                            apply for a
                                            license to
                                            contract
                                            marriage with
                                        <div class="absolute w-[76%]">
                                            <InputBottomBorderMarriage isBold
                                                v-model="formData.bride_contract_marriage_with" middle />
                                        </div>

                                        </p>
                                        <span class=" text-xs italic text-justify indent-[76.5%]"> and
                                            to this
                                            effect, being duly sworn, I hereby depose and say that I have all the
                                            necessary
                                            qualifications and none of the legal disqualifications to contract the said
                                            marriage, and
                                            that the following data are true and correct to the best of my knowledge and
                                            information:</span>

                                    </div>
                                </div> -->
                                <!-- 5 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-col  border-r border-gray-500 p-1">

                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(First)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.groom_first_name" isBold />
                                        </div>

                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(Middle)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.groom_middle_name" isBold />
                                        </div>
                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(Last)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.groom_last_name" isBold />
                                        </div>

                                    </div>

                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">1. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Name of
                                            Applicant
                                        </p>
                                    </div>


                                    <div class="basis-[45%] flex flex-col  border-l border-gray-500 p-1">
                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(First)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.bride_first_name" isBold />
                                        </div>

                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(Middle)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.bride_middle_name" isBold />
                                        </div>
                                        <div class="flex flex-row gap-2 items-center">
                                            <p class="text-xs">(Last)</p>
                                            <InputBottomBorderMarriage @change="handleInputChange"
                                                v-model="formData.bride_last_name" isBold />
                                        </div>
                                    </div>
                                </div>
                                <!-- 6 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-row  items-center border-r border-gray-500  ">
                                        <div class="grow">
                                            <div class="flex flex-row justify-around">
                                                <label for=""
                                                    class="text-[10px] font-medium  text-zinc-800">(Day)</label>
                                                <label for=""
                                                    class="text-[10px] font-medium  text-zinc-800">(Month)</label>
                                                <label for=""
                                                    class="text-[10px] font-medium  text-zinc-800">(Year)</label>
                                            </div>
                                            <button @click="showDateInput" @focus="showDateInput"
                                                class="w-full bg-blue-50 h-4 ring-0 outline-none focus:bg-blue-100"
                                                tabindex="1"></button>
                                        </div>
                                        <div class="border-l border-gray-500 h-full flex items-center basis-[25%]">
                                            <InputBottomBorderMarriage v-model="formData.groom_age" isBold label="Age"
                                                @change="handleInputChange" middle top_label />
                                        </div>
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">2. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Date of Birth/
                                            Age
                                        </p>
                                    </div>

                                    <div class="basis-[45%] grid grid-cols-4  items-center border-l border-gray-500  ">

                                        <div class="border-l border-gray-500 h-full flex items-center">
                                            <InputBottomBorderMarriage v-model="formData.bride_age" isBold label="Age"
                                                @change="handleInputChange" middle top_label />
                                        </div>
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_municipality" isBold
                                            label="City/Municipality" top_label @change="handleInputChange" />
                                        <InputBottomBorderMarriage v-model="formData.groom_province"
                                            @change="handleInputChange" isBold label="Province" top_label />
                                        <InputBottomBorderMarriage v-model="formData.groom_country"
                                            @change="handleInputChange" isBold label="Country" top_label />

                                    </div>

                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">3. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Place of Birth
                                        </p>
                                    </div>


                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_municipality" isBold
                                            @change="handleInputChange" label="City/Municipality" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_province" isBold
                                            label="Province" @change="handleInputChange" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_country" isBold
                                            label="Country" @change="handleInputChange" top_label />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div class="basis-[45%] flex flex-rowitems-center border-r border-gray-500  ">
                                        <div class="basis-[30%] border-r border-gray-500">
                                            <InputBottomBorderMarriage v-model="formData.groom_sex" middle isBold
                                                label="Male/Female" top_label />
                                        </div>
                                        <div class="grow">
                                            <InputBottomBorderMarriage v-model="formData.groom_citizenship" middle
                                                isBold label="Citizenship" top_label />
                                        </div>


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">4. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Sex/
                                            Citizenship
                                        </p>
                                    </div>

                                    <div
                                        class="basis-[45%] flex flex-row gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <div class="basis-[30%]">
                                            <InputBottomBorderMarriage v-model="formData.bride_sex" middle isBold
                                                label="Male/Female" top_label />
                                        </div>
                                        <div class="grow">
                                            <InputBottomBorderMarriage v-model="formData.bride_citizenship" middle
                                                isBold label="Citizenship" top_label />
                                        </div>


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_residence"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">5. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_residence"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />
                                        <!-- <InputBottomBorderMarriage v-model="formData.bride_residence_country"
                                            @change="handleInputChange" middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label /> -->
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_religion" isBold />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">6. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Religion/
                                            Religous Sect
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_religion" isBold />


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_civil_status" isBold />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">7. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Civil Status
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_civil_status" isBold />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_previously_married_dissolved"
                                            isBold />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">8. </p>
                                        <p class="text-[9px] w-[80%]  h-full flex items-center text-start">IF PREVIOUSLY
                                            MARRIED: How was
                                            it dissolved?
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_previously_married_dissolved"
                                            isBold />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="City/Municipality" top_label />
                                        <InputBottomBorderMarriage isBold label="Province" top_label />
                                        <InputBottomBorderMarriage isBold label="Country" top_label />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">9. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Place where
                                            dissolved
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="City/Municipality" top_label />
                                        <InputBottomBorderMarriage isBold label="Province" top_label />
                                        <InputBottomBorderMarriage isBold label="Country" top_label />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="Day" top_label />
                                        <InputBottomBorderMarriage isBold label="Month" top_label />
                                        <InputBottomBorderMarriage isBold label="Year" top_label />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">10. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Date when
                                            dissolved
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage isBold label="Day" top_label />
                                        <InputBottomBorderMarriage isBold label="Month" top_label />
                                        <InputBottomBorderMarriage isBold label="Year" top_label />


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_degree_relation" isBold />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">11. </p>
                                        <p class="text-[9px] w-[80%]  h-full flex items-center text-start">Degree of
                                            relationship of
                                            contractng parties
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_degree_relation" isBold />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_father_first_name" isBold
                                            @change="handleInputChange" label="First" top_label />
                                        <InputBottomBorderMarriage v-model="formData.groom_father_middle_name" isBold
                                            @change="handleInputChange" label="Middle" top_label />
                                        <InputBottomBorderMarriage v-model="formData.groom_father_last_name" isBold
                                            @change="handleInputChange" label="Last" top_label />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">12. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Name of Father
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_father_first_name" isBold
                                            @change="handleInputChange" label="First" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_father_middle_name" isBold
                                            @change="handleInputChange" label="Middle" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_father_last_name" isBold
                                            @change="handleInputChange" label="Last" top_label />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_father_citizenship" isBold />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">13. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_father_citizenship" isBold />


                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_father_residence" isBold
                                            middle
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">14. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_father_residence" isBold
                                            middle
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_mother_first_name" isBold
                                            @change="handleInputChange" label="First" top_label />
                                        <InputBottomBorderMarriage v-model="formData.groom_mother_middle_name" isBold
                                            @change="handleInputChange" label="Middle" top_label />
                                        <InputBottomBorderMarriage v-model="formData.groom_mother_last_name" isBold
                                            @change="handleInputChange" label="Last" top_label />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">15. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Maiden Name of
                                            Mother
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_mother_first_name" isBold
                                            @change="handleInputChange" label="First" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_mother_middle_name" isBold
                                            @change="handleInputChange" label="Middle" top_label />
                                        <InputBottomBorderMarriage v-model="formData.bride_mother_last_name" isBold
                                            @change="handleInputChange" label="Last" top_label />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_mother_citizenship" isBold />
                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">16. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_mother_citizenship" isBold />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_mother_residence" middle
                                            isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">17. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_mother_residence" middle
                                            isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.groom_person_who_gave_consent"
                                            isBold />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">18. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Person who gave
                                            consent or
                                            advise
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage v-model="formData.bride_person_who_gave_consent"
                                            isBold />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage
                                            v-model="formData.groom_person_who_gave_consent_relation" isBold />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">19. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Relationship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage
                                            v-model="formData.bride_person_who_gave_consent_relation" isBold />

                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage
                                            v-model="formData.groom_person_who_gave_consent_citizenship" isBold />

                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">20. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage
                                            v-model="formData.bride_person_who_gave_consent_citizenship" isBold />
                                    </div>
                                </div>
                                <!-- 7 -->
                                <div class="flex flex-row border-b border-gray-500 w-full">
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                        <InputBottomBorderMarriage middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />


                                    </div>
                                    <div
                                        class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                        <p class="text-xs w-[20%] h-full flex items-center">21. </p>
                                        <p class="text-xs w-[80%]  h-full flex items-center text-start">Residence
                                        </p>
                                    </div>
                                    <div
                                        class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                        <InputBottomBorderMarriage middle isBold
                                            label="House No., St., Barangay, City/Municipality, Province, Country"
                                            top_label />


                                    </div>
                                </div>
                                <div class="grid grid-cols-2  w-full h-full relative">
                                    <div
                                        class="absolute border px-3 flex items-center justify-center border-gray-500 z-50 top-[4.5rem] bg-gray-50 right-[23.5rem] w-[6.5rem] h-[9.5rem]">
                                        <p class="text-xs text-center leading-5">Excempt from documentary stamp tax</p>
                                    </div>
                                    <div
                                        class="border-r border-gray-500  flex flex-col items-center justify-center h-full">
                                        <div class="mt-3 mb-3 w-full">
                                            <InputBottomBorderMarriage disabled isBold label="Signature of Applicant"
                                                middle />
                                        </div>
                                        <div class="flex flex-col gap-1 pr-14 pl-2 mt-auto mb-auto">
                                            <p class="italic text-xs tracking-widest font-serif indent-10"><span
                                                    class="font-bold text-sm not-italic">SUBSCRIBE
                                                    AND
                                                    SWORN</span> to before me this
                                            </p>
                                            <div class="flex flex-row gap-1 ">
                                                <div class="w-[48%] ">
                                                    <InputBottomBorderMarriage v-model="formData.groom_ss_day" isBold />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                                <InputBottomBorderMarriage middle v-model="formData.groom_ss_month"
                                                    isBold />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <InputBottomBorderMarriage middle v-model="formData.groom_ss_year" />
                                                <p class="font-serif  text-nowrap text-xs italic">, at</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <InputBottomBorderMarriage middle v-model="formData.groom_ss_at"
                                                    isBold />
                                                <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant
                                                    who
                                                </p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                    Community Tax
                                                    Cert.</p>
                                                <InputBottomBorderMarriage e v-model="formData.groom_ctc_number"
                                                    middle />
                                                <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">on</p>
                                                <InputBottomBorderMarriage v-model="formData.groom_ctc_on" middle />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <div class="w-[30%]">
                                                    <InputBottomBorderMarriage middle />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            </div>
                                            <div class="flex flex-row gap-1">
                                                <p class="font-serif  text-nowrap text-xs italic">at</p>
                                                <InputBottomBorderMarriage v-model="formData.groom_ctc_at" middle />
                                            </div>
                                        </div>
                                        <div class="mt-auto">
                                            <InputBottomBorderMarriage isBold middle
                                                label="Signature Over Printed Name of the Civil Registrar"
                                                v-model="formData.civil_registrar" />
                                        </div>

                                    </div>
                                    <div class=" flex flex-col items-center justify-center h-full">
                                        <div class="mt-3 mb-3 w-full">
                                            <InputBottomBorderMarriage disabled isBold label="Signature of Applicant"
                                                middle />
                                        </div>

                                        <div class="flex flex-col gap-1 pl-16 pr-2 mt-auto mb-auto">
                                            <p class="italic text-xs tracking-widest font-serif indent-10 text-nowrap">
                                                <span class="font-bold text-sm not-italic ">SUBSCRIBE
                                                    AND
                                                    SWORN</span> to before me this
                                            </p>
                                            <div class="flex flex-row gap-1 ">
                                                <div class="w-[48%] ">
                                                    <InputBottomBorderMarriage v-model="formData.bride_ss_day" isBold />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                                <InputBottomBorderMarriage middle v-model="formData.bride_ss_month"
                                                    isBold />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <InputBottomBorderMarriage middle v-model="formData.bride_ss_year" />
                                                <p class="font-serif  text-nowrap text-xs italic">, at</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <InputBottomBorderMarriage middle v-model="formData.bride_ss_at"
                                                    isBold />
                                                <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant
                                                    who
                                                </p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                    Community Tax
                                                    Cert.</p>
                                                <InputBottomBorderMarriage middle v-model="formData.bride_ctc_number" />
                                                <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                            </div>
                                            <div class="flex flex-row gap-1 ">
                                                <p class="font-serif  text-nowrap text-xs italic">on</p>
                                                <InputBottomBorderMarriage middle v-model="formData.bride_ctc_on" />
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                                <div class="w-[30%]">
                                                    <InputBottomBorderMarriage middle />
                                                </div>
                                                <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            </div>
                                            <div class="flex flex-row gap-1">
                                                <p class="font-serif  text-nowrap text-xs italic">at</p>
                                                <InputBottomBorderMarriage v-model="formData.bride_ctc_at" middle />
                                            </div>
                                        </div>
                                        <div class="mt-auto">
                                            <InputBottomBorderMarriage isBold
                                                label="Signature Over Printed Name of the Civil Registrar" middle
                                                v-model="formData.civil_registrar" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="page === 2" class="w-full h-full flex flex-col relative ">
                                <!-- <p class="text-xs text-gray-600 ">Note: Mockup only.</p> -->
                                <!-- <div class="justify-center flex  items-center flex-col">
                                <p class="text-sm font-sans">Republic of the Philippines</p>
                                <p class="text-sm font-sans">Province of Pangasinan</p>
                                <p class="text-sm font-sans">MUNICIPALITY OF BAYAMBANG</p>
                                <p class="text-lg font-bold font-serif mt-3">LOCAL CIVIL REGISTRY OFFICE</p>
                            </div>
                            <p class="text-sm">Municipal Form No. 94 (Form 9)</p> -->


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

                                <div class="justify-center flex  items-center flex-row gap-10 mb-4">
                                    <div class="basis-[30%] h-[10rem]">
                                        <Camera @capture="handle_groom_image" v-if="!groom_picture" />
                                        <div v-if="groom_picture"
                                            class="h-full w-full flex hover:border-blue-600 border-2 hover:cursor-pointer relative group">
                                            <button @click="groom_picture = ''"
                                                class="absolute -top-3 -right-2.5 z-50 bg-red-400 hover:bg-red-500 text-white rounded-full px-1.5 hidden group-hover:block">
                                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                            </button>
                                            <img :src="groom_picture" alt="Captured photo"
                                                class="object-cover w-full h-full" />
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




                                <div class="justify-center flex  items-center flex-row gap-10 mt-5">


                                    <div class="basis-[30%] h-[10rem]">
                                        <Camera @capture="handle_bride_image" v-if="!bride_picture" />
                                        <div v-if="bride_picture"
                                            class="h-full w-full flex hover:border-blue-600 border-2 hover:cursor-pointer relative group">
                                            <button @click="bride_picture = ''"
                                                class="absolute -top-3 -right-2.5 z-50 bg-red-400 hover:bg-red-500 text-white rounded-full px-1.5 hidden group-hover:block">
                                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                            </button>
                                            <img :src="bride_picture" alt="Captured photo"
                                                class="object-cover w-full h-full" />
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
                                <p class="indent-8 text-justify px-24 mt-3 mb-3">Any person having knowledge of any
                                    legal
                                    impediment to
                                    such
                                    marriage
                                    will please report it to the undersigned within ten (10) days from this date.</p>

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

                                <p class="text-justify font-sans px-24 mt-auto">

                                    <span class="font-medium">Note:</span>
                                    This notice shall be posted durign ten (10) consecutive days at the main door of the
                                    building where
                                    Local Civil Registrar has his office and once posted, it's location shall not be
                                    changed. (Rep. Act
                                    No. 386, Art. 63)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="h-full w-full flex items-center justify-center  relative" v-if="preview">
                        <div class="absolute w-full left-0 right-0 top-0 h-16 bg-[#525659]">
                        </div>

                        <div class="absolute  right-0 top-0 w-5 h-full bg-[#525659]">
                        </div>



                        <iframe v-if="preview && page === 1" :src="pdf_content" frameborder="0"
                            class="h-full w-full"></iframe>
                        <iframe v-if="preview && page === 2" :src="notice_pdf_content" frameborder="0"
                            class="h-full w-full"></iframe>

                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';
import { format } from 'date-fns';
import Camera from '../../components/Camera.vue';
import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import { onClickOutside } from '@vueuse/core'


const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 12 : 10
})
const change_page = (value) => {
    if (page.value === value) { return }
    page.value = value

    if (preview.value) {
        preview_document()
    }
}

const pop_up_div = ref(null)
const input_pop_up = ref()
const input_pop_value = ref()
const show_input = ref(false)

onClickOutside(pop_up_div, event => show_input.value = false)

const showDateInput = async () => {
    show_input.value = true
    // Use nextTick to wait for DOM to update
    await nextTick(() => {
        // Focus input after it's rendered
        if (input_pop_up.value) {
            input_pop_up.value.focus();
        }
    });
};

const preview = ref(false)
const pdf_content = ref()
const notice_pdf_content = ref()

const change_mode = () => {
    preview.value = !preview.value

    if (preview.value) {
        preview_document()
    }
}

const preview_document = async () => {
    if (preview.value) {
        const data = JSON.stringify({ ...formData })

        if (page.value === 1) {
            const previewData = await window.MarriageApi.previewMarriage(data);
            pdf_content.value = previewData.pdfbase64;
        }
        else if (page.value === 2) {
            const previewData = await window.MarriageApi.previewNotice(data);
            notice_pdf_content.value = previewData.pdfbase64;
        }
    }
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
    groom_previously_married_dissolved: '',
    groom_place_dissolved: '',
    groom_date_dissolved: '',
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
    groom_person_who_gave_consent_residence_country: '',

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
    bride_previously_married_dissolved: '',
    bride_place_dissolved: '', //
    bride_date_dissolved: '', //
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
    bride_person_who_gave_consent_residence_country: '', //

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

}


const formData = reactive({ ...initialForm })


// Centralized method to update all notice values
const updateNotices = () => {
    // GROOM NOTICE

    // formData.groom_father_last_name = formData.groom_last_name ? formData.groom_last_name : ''
    // formData.groom_mother_last_name = formData.groom_middle_name ? formData.groom_middle_name : ''


    // formData.groom_contract_marriage_with = formData.bride_first_name || formData.bride_last_name ? formData.bride_first_name + ' ' + formData.bride_middle_name + ' ' + formData.bride_last_name : '';
    // formData.bride_contract_marriage_with = formData.groom_first_name || formData.groom_last_name ? formData.groom_first_name + ' ' + formData.groom_middle_name + ' ' + formData.groom_last_name : '';

    // const groomInitialMiddleName = formData.groom_middle_name ? formData.groom_middle_name.charAt(0) : '';
    // const groomFatherInitialMiddleName = formData.groom_father_middle_name ? formData.groom_father_middle_name.charAt(0) : '';
    // const groomMotherInitialMiddleName = formData.groom_mother_middle_name ? formData.groom_mother_middle_name.charAt(0) : '';
    // const groomBirthPlace = formData.groom_municipality && formData.groom_province ? formData.groom_municipality + ', ' + formData.groom_province : ''

    // formData.groom_notice_name = `${formData.groom_first_name} ${groomInitialMiddleName}. ${formData.groom_last_name}`;
    // formData.groom_notice_age = formData.groom_age ? `${formData.groom_age} yrs. old` : '';

    // formData.groom_notice_father = formData.groom_father_first_name
    //     ? `${formData.groom_father_first_name} ${groomFatherInitialMiddleName}. ${formData.groom_father_last_name}`
    //     : '';

    // formData.groom_notice_mother = formData.groom_mother_first_name
    //     ? `${formData.groom_mother_first_name} ${groomMotherInitialMiddleName}. ${formData.groom_mother_last_name}`
    //     : '';
    // formData.groom_notice_birthplace = formData.groom_municipality
    //     ? capitalizeWords(groomBirthPlace)
    //     : '';
    // formData.groom_notice_residence = formData.groom_residence
    //     ? capitalizeWords(formData.groom_residence).replace(', PHILIPPINES', '')
    //     : '';


    // // BRIDE NOTICE

    // formData.bride_father_last_name = formData.bride_last_name ? formData.bride_last_name : ''
    // formData.bride_mother_last_name = formData.bride_middle_name ? formData.bride_middle_name : ''



    // const brideInitialMiddleName = formData.bride_middle_name ? formData.bride_middle_name.charAt(0) : '';
    // const brideFatherInitialMiddleName = formData.bride_father_middle_name ? formData.bride_father_middle_name.charAt(0) : '';
    // const brideMotherInitialMiddleName = formData.bride_mother_middle_name ? formData.bride_mother_middle_name.charAt(0) : '';
    // const brideBirthPlace = formData.bride_municipality && formData.bride_province ? formData.bride_municipality + ', ' + formData.bride_province : ''

    // formData.bride_notice_name = `${formData.bride_first_name} ${brideInitialMiddleName}. ${formData.bride_last_name}`;
    // formData.bride_notice_age = formData.bride_age ? `${formData.bride_age} yrs. old` : '';



    // formData.bride_notice_father = formData.bride_father_first_name
    //     ? `${formData.bride_father_first_name} ${brideFatherInitialMiddleName}. ${formData.bride_father_last_name}`
    //     : '';


    // formData.bride_notice_mother = formData.bride_mother_first_name
    //     ? `${formData.bride_mother_first_name} ${brideMotherInitialMiddleName}. ${formData.bride_mother_last_name}`
    //     : '';
    // formData.bride_notice_birthplace = formData.bride_municipality
    //     ? capitalizeWords(brideBirthPlace)
    //     : '';
    // formData.bride_notice_residence = formData.bride_residence
    //     ? capitalizeWords(formData.bride_residence).replace(', PHILIPPINES', '')
    //     : '';
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

</script>

<style scoped>
img {
    transform: scaleX(-1);

}
</style>