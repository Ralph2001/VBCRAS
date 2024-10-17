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

            <div class="flex h-full justify-center items-center w-full pt-10 overflow-y-scroll">
                <div class="fixed flex flex-row right-0 left-0 bg-yellow-100 top-9 px-4 z-50">
                    <div class="flex flex-row items-center">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2" @click="change_page(1)"
                            :class="[page === 1 ? '' : 'text-gray-500']">Marriage
                            License</button>
                        <div class="block border border-gray-400 h-6"></div>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 " @click="change_page(2)"
                            :class="[page === 2 ? '' : 'text-gray-500']">Notice</button>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2">Save</button>
                        <!-- <button class="hover:bg-blue-300 font-medium text-sm p-2">Preview</button> -->
                    </div>
                </div>

                <div class="h-[calc(100vh-76px)] w-full flex p-10 overflow-y-scroll  justify-center">
                    <div :style="paperStyle" class="flex bg-gray-50 shadow-md flex-col scale-110"
                        :class="[page === 1 ? 'py-14 pl-12 pr-10 ' : 'p-20']">

                        <div v-if="page === 1" class="w-full h-full border-[3px] border-gray-700 flex flex-col">

                            <!-- First -->
                            <div class="border-b border-gray-500 flex flex-col relative p-1 w-full">
                                <div class="w-full flex flex-row">
                                    <p class="text-xs">Municipal Form. 90 (Form No. 2)</p>
                                    <p class="text-xs ml-auto">(To be accomplished in quadrupicate using black ink)</p>
                                </div>
                                <p class="text-xs">(Revised January 2007)</p>

                                <div class="absolute left-0 top-4 right-0 w-full items-cente justify-center flex">
                                    <p class="text-sm ">Republic
                                        of
                                        the
                                        Philippines</p>
                                </div>
                                <p class="text-sm text-center">OFFICE OF THE CIVIL REGISTRATION GENERAL</p>
                                <p class="text-2xl text-center font-bold text-gray-700">APPLICATION FOR MARRIAGE LICENSE
                                </p>

                            </div>
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
                                        <InputBottomBorderMarriage isBold v-model="formData.recieved_by" />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Date of Receipt:</p>
                                        <InputBottomBorderMarriage isBold v-model="formData.date_of_receipt" />
                                    </div>

                                </div>
                                <div class="flex flex-col  border-l border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Marriage License No.:</p>
                                        <InputBottomBorderMarriage isBold v-model="formData.marriage_license_number" />
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
                            <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
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
                                            v-model="formData.groom_contract_marriage_with" />
                                    </div>

                                    </p>
                                    <span class=" text-xs italic text-justify indent-[76.5%]"> and
                                        to this
                                        effect, being duly sworn, I hereby depose and say that I have all the necessary
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
                                            v-model="formData.bride_contract_marriage_with" />
                                    </div>

                                    </p>
                                    <span class=" text-xs italic text-justify indent-[76.5%]"> and
                                        to this
                                        effect, being duly sworn, I hereby depose and say that I have all the necessary
                                        qualifications and none of the legal disqualifications to contract the said
                                        marriage, and
                                        that the following data are true and correct to the best of my knowledge and
                                        information:</span>

                                </div>
                            </div>
                            <!-- 5 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div class="basis-[45%] flex flex-col  border-r border-gray-500 p-1">

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(First)</p>
                                        <InputBottomBorderMarriage v-model="formData.groom_first_name" isBold />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorderMarriage v-model="formData.groom_middle_name" isBold />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorderMarriage v-model="formData.groom_last_name" isBold />
                                    </div>

                                </div>

                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">1. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Name of Applicant
                                    </p>
                                </div>


                                <div class="basis-[45%] flex flex-col  border-l border-gray-500 p-1">
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(First)</p>
                                        <InputBottomBorderMarriage v-model="formData.bride_first_name" isBold />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorderMarriage v-model="formData.bride_middle_name" isBold />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorderMarriage v-model="formData.bride_last_name" isBold />
                                    </div>
                                </div>
                            </div>
                            <!-- 6 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div class="basis-[45%] grid grid-cols-4  items-center border-r border-gray-500  ">
                                    <InputBottomBorderMarriage isBold label="Day" top_label middle />
                                    <InputBottomBorderMarriage isBold label="Month" top_label middle />
                                    <InputBottomBorderMarriage isBold label="Year" top_label middle />
                                    <div class="border-l border-gray-500 h-full flex items-center">
                                        <InputBottomBorderMarriage v-model="formData.groom_age" isBold label="Age"
                                            middle top_label />
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
                                    <InputBottomBorderMarriage isBold label="Day" top_label middle />
                                    <InputBottomBorderMarriage isBold label="Month" top_label middle />
                                    <InputBottomBorderMarriage isBold label="Year" top_label middle />
                                    <div class="border-l border-gray-500 h-full flex items-center">
                                        <InputBottomBorderMarriage v-model="formData.bride_age" isBold label="Age"
                                            middle top_label />
                                    </div>
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_municipality" isBold
                                        label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_province" isBold label="Province"
                                        top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_country" isBold label="Country"
                                        top_label />

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
                                        label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_province" isBold label="Province"
                                        top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_country" isBold label="Country"
                                        top_label />

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
                                        <InputBottomBorderMarriage v-model="formData.groom_citizenship" middle isBold
                                            label="Citizenship" top_label />
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
                                        <InputBottomBorderMarriage v-model="formData.bride_citizenship" middle isBold
                                            label="Citizenship" top_label />
                                    </div>


                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_residence" middle isBold
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
                                    <InputBottomBorderMarriage v-model="formData.bride_residence" middle isBold
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />
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
                                        label="First" top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_father_middle_name" isBold
                                        label="Middle" top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_father_last_name" isBold
                                        label="Last" top_label />

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
                                        label="First" top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_father_middle_name" isBold
                                        label="Middle" top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_father_last_name" isBold
                                        label="Last" top_label />

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
                                    <InputBottomBorderMarriage v-model="formData.groom_father_residense" isBold middle
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
                                    <InputBottomBorderMarriage v-model="formData.bride_father_residense" isBold middle
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_mother_first_name" isBold
                                        label="First" top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_mother_middle_name" isBold
                                        label="Middle" top_label />
                                    <InputBottomBorderMarriage v-model="formData.groom_mother_last_name" isBold
                                        label="Last" top_label />

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
                                        label="First" top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_mother_middle_name" isBold
                                        label="Middle" top_label />
                                    <InputBottomBorderMarriage v-model="formData.bride_mother_last_name" isBold
                                        label="Last" top_label />

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
                                    <InputBottomBorderMarriage v-model="formData.groom_mother_residence" middle isBold
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
                                    <InputBottomBorderMarriage v-model="formData.bride_mother_residence" middle isBold
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_person_who_give_consent"
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
                                    <InputBottomBorderMarriage v-model="formData.bride_person_who_give_consent"
                                        isBold />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_relation" isBold />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">19. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Relationship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.bride_relation" isBold />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_citizenship" isBold />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">20. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.bride_citizenship" isBold />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage v-model="formData.groom_residence_consent" middle isBold
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
                                    <InputBottomBorderMarriage v-model="formData.bride_residence_consent" middle isBold
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />


                                </div>
                            </div>
                            <div class="grid grid-cols-2  w-full h-full relative">
                                <div
                                    class="absolute border px-3 flex items-center justify-center border-gray-500 z-50 top-[4.5rem] bg-gray-50 right-[23.5rem] w-[6.5rem] h-[9.5rem]">
                                    <p class="text-xs text-center leading-5">Excempt from documentary stamp tax</p>
                                </div>
                                <div class="border-r border-gray-500  flex flex-col items-center justify-center h-full">
                                    <div class="mt-3 mb-3 w-full">
                                        <InputBottomBorderMarriage isBold label="Signature of Applicant" middle />
                                    </div>
                                    <div class="flex flex-col gap-1 pr-14 pl-2 mt-auto mb-auto">
                                        <p class="italic text-xs tracking-widest font-serif indent-10"><span
                                                class="font-bold text-sm not-italic">SUBSCRIBE
                                                AND
                                                SWORN</span> to before me this
                                        </p>
                                        <div class="flex flex-row gap-1 ">
                                            <div class="w-[48%] ">
                                                <InputBottomBorderMarriage />
                                            </div>
                                            <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">, at</p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant who
                                            </p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                Community Tax
                                                Cert.</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <p class="font-serif  text-nowrap text-xs italic">on</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            <div class="w-[30%]">
                                                <InputBottomBorderMarriage middle />
                                            </div>
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                        </div>
                                        <div class="flex flex-row gap-1">
                                            <p class="font-serif  text-nowrap text-xs italic">at</p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                    </div>
                                    <div class="mt-auto">
                                        <InputBottomBorderMarriage isBold middle
                                            label="Signature Over Printed Name of the Civil Registrar" />
                                    </div>

                                </div>
                                <div class=" flex flex-col items-center justify-center h-full">
                                    <div class="mt-3 mb-3 w-full">
                                        <InputBottomBorderMarriage isBold label="Signature of Applicant" middle />
                                    </div>

                                    <div class="flex flex-col gap-1 pl-16 pr-2 mt-auto mb-auto">
                                        <p class="italic text-xs tracking-widest font-serif indent-10 text-nowrap"><span
                                                class="font-bold text-sm not-italic ">SUBSCRIBE
                                                AND
                                                SWORN</span> to before me this
                                        </p>
                                        <div class="flex flex-row gap-1 ">
                                            <div class="w-[48%] ">
                                                <InputBottomBorderMarriage />
                                            </div>
                                            <p class="font-serif  text-nowrap text-xs italic">day of</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">, at</p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">, Philippines, affiant who
                                            </p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <p class="font-serif  text-nowrap text-xs italic">exhibited to me his
                                                Community Tax
                                                Cert.</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">issued</p>
                                        </div>
                                        <div class="flex flex-row gap-1 ">
                                            <p class="font-serif  text-nowrap text-xs italic">on</p>
                                            <InputBottomBorderMarriage middle />
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                            <div class="w-[30%]">
                                                <InputBottomBorderMarriage middle />
                                            </div>
                                            <p class="font-serif  text-nowrap text-xs italic">,</p>
                                        </div>
                                        <div class="flex flex-row gap-1">
                                            <p class="font-serif  text-nowrap text-xs italic">at</p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                    </div>
                                    <div class="mt-auto">
                                        <InputBottomBorderMarriage isBold
                                            label="Signature Over Printed Name of the Civil Registrar" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="page === 2" class="w-full h-full flex flex-col">
                            <div class="justify-center flex  items-center flex-col gap-1">
                                <p>Republic of the Philippines</p>
                                <p>Province of Pangasinan</p>
                                <p>MUNICIPALITY OF BAYAMBANG</p>
                                <p>OFFICE OF THE MUNICIPAL CIVIL REGISTRAR</p>
                            </div>
                            <p>Municipal Form 90. 94 (Form 9)</p>


                            <div class="justify-center flex  items-center flex-col gap-1">
                                <p>NOTICE</p>
                                <p>APPLICANTS FOR MARRIAGE LICENSE</p>
                                <div class="w-[50%]">
                                    <InputBottomBorderMarriage middle />
                                </div>
                                <p>and</p>
                                <div class="w-[50%]">
                                    <InputBottomBorderMarriage middle />
                                </div>
                            </div>

                            <div class="justify-center flex  items-center flex-row gap-1">
                                <div class="basis-[30%] h-[10rem] w-[10rem] bg-gray-200 "></div>
                                <div class="flex flex-col grow ">
                                    <div class="flex flex-row w-full">
                                        <div class="flex flex-row grow">
                                            <p>Name: </p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                        <div class="flex flex-row basis-[30%]">
                                            <p>Age: </p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Birthplace: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Residence: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Father: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Mother: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                </div>

                            </div>
                            <p class="ml-auto">WISHES TO CONTRACT MARRIAGE WITH</p>
                            <div class="justify-center flex  items-center flex-row gap-1">
                                <div class="basis-[30%] h-[10rem] w-[10rem] bg-gray-200 "></div>
                                <div class="flex flex-col grow ">
                                    <div class="flex flex-row w-full">
                                        <div class="flex flex-row grow">
                                            <p>Name: </p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                        <div class="flex flex-row basis-[30%]">
                                            <p>Age: </p>
                                            <InputBottomBorderMarriage middle />
                                        </div>
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Birthplace: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Residence: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Father: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row">
                                        <p>Mother: </p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                </div>

                            </div>
                            <p class="indent-8 text-justify">Any person having knowledge of any legal impediment to such marriage will please report it to the undersigned within ten (10) days from this date.</p>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';


const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 14 : 13
})
const change_page = (value) => {
    page.value = value
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
};

const close_modal = () => {
    modal.value = false;
};


const initialForm = {
    header_province: '',
    header_municipality: '',
    registry_number: '',
    recieved_by: '',
    date_of_receipt: '',
    marriage_license_number: '',
    date_issuance_marriage_license: '',
    groom_contract_marriage_with: '',
    bride_contract_marriage_with: '',

    municipal_civil_registrar: '',

    // GROOM SIDE
    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',
    groom_date_of_birth: '',
    groom_age: '',
    groom_municipality: '',
    groom_province: '',
    groom_country: '',
    groom_sex: '',
    groom_residence: '',
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
    groom_father_residense: '',
    groom_mother_first_name: '',
    groom_mother_middle_name: '',
    groom_mother_last_name: '',
    groom_mother_citizenship: '',
    groom_mother_residence: '',
    groom_person_who_give_consent: '',
    groom_relation: '',
    groom_citizenship: '',
    groom_residence_consent: '',

    groom_signature: '',
    groom_ss_day: '',
    groom_ss_month: '',
    groom_ss_year: '',
    groom_ss_at: '',
    groom_community_tax_certificate: '',
    groom_community_tax_certificate_on: '',
    groom_community_tax_certificate_at: '',

    // BRIDE SIDE
    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',
    bride_date_of_birth: '',
    bride_age: '',
    bride_municipality: '',
    bride_province: '',
    bride_country: '',
    bride_sex: '',
    bride_residence: '',
    bride_religion: '',
    bride_civil_status: '',
    bride_previously_married_dissolved: '',
    bride_place_dissolved: '',
    bride_date_dissolved: '',
    bride_degree_relation: '',
    bride_father_first_name: '',
    bride_father_middle_name: '',
    bride_father_last_name: '',
    bride_father_citizenship: '',
    bride_father_residense: '',
    bride_mother_first_name: '',
    bride_mother_middle_name: '',
    bride_mother_last_name: '',
    bride_mother_citizenship: '',
    bride_mother_residence: '',
    bride_person_who_give_consent: '',
    bride_relation: '',
    bride_citizenship: '',
    bride_residence_consent: '',

    bride_signature: '',
    bride_ss_day: '',
    bride_ss_month: '',
    bride_ss_year: '',
    bride_ss_at: '',
    bride_community_tax_certificate: '',
    bride_community_tax_certificate_on: '',
    bride_community_tax_certificate_at: '',

}

const formData = reactive({ ...initialForm })
</script>
