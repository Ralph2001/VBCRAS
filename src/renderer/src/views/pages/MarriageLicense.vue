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
                        <button class="hover:bg-blue-300 font-medium text-sm p-2">Page 1</button>
                        <div class="block border border-gray-400 h-6"></div>
                        <button class="hover:bg-blue-300 font-medium text-sm p-2 text-gray-500">Page 2</button>
                    </div>
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class="hover:bg-blue-300 font-medium text-sm p-2">Save</button>
                        <!-- <button class="hover:bg-blue-300 font-medium text-sm p-2">Preview</button> -->
                    </div>
                </div>

                <div class="h-[calc(100vh-76px)] w-full flex p-10 overflow-y-scroll  justify-center">
                    <div :style="paperStyle" class="flex bg-gray-50 shadow-md py-14 pl-12 pr-10 flex-col scale-110">

                        <div class="w-full h-full border-[3px] border-gray-700 flex flex-col">

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
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">City/Municipality</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                </div>
                                <div class="relative p-1 flex flex-row">
                                    <p class="text-sm text-nowrap"> Registry No.</p>
                                    <div class="items-center flex  justify-center">
                                        <InputBottomBorderMarriage />
                                    </div>
                                </div>
                            </div>
                            <!-- Third -->
                            <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                <div class="flex flex-col  border-r border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Received by:</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Date of Receipt:</p>
                                        <InputBottomBorderMarriage />
                                    </div>

                                </div>
                                <div class="flex flex-col  border-l border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Marriage License No.:</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Date of Issuance of Marriage License:</p>
                                        <InputBottomBorderMarriage />
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
                                        <InputBottomBorderMarriage />
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
                                        <InputBottomBorderMarriage />
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
                                        <InputBottomBorderMarriage />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorderMarriage />
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
                                        <InputBottomBorderMarriage />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorderMarriage />
                                    </div>
                                </div>
                            </div>
                            <!-- 6 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div class="basis-[45%] grid grid-cols-4  items-center border-r border-gray-500  ">
                                    <InputBottomBorderMarriage label="Day" top_label />
                                    <InputBottomBorderMarriage label="Month" top_label />
                                    <InputBottomBorderMarriage label="Year" top_label />
                                    <div class="border-l border-gray-500 h-full flex items-center">
                                        <InputBottomBorderMarriage label="Age" top_label />
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
                                    <InputBottomBorderMarriage label="Day" top_label />
                                    <InputBottomBorderMarriage label="Month" top_label />
                                    <InputBottomBorderMarriage label="Year" top_label />
                                    <div class="border-l border-gray-500 h-full flex items-center">
                                        <InputBottomBorderMarriage label="Age" top_label />
                                    </div>
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage label="Province" top_label />
                                    <InputBottomBorderMarriage label="Country" top_label />

                                </div>

                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">3. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Place of Birth
                                    </p>
                                </div>


                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage label="Province" top_label />
                                    <InputBottomBorderMarriage label="Country" top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div class="basis-[45%] flex flex-rowitems-center border-r border-gray-500  ">
                                    <div class="basis-[30%] border-r border-gray-500">
                                        <InputBottomBorderMarriage label="Male/Female" top_label />
                                    </div>
                                    <div class="grow">
                                        <InputBottomBorderMarriage label="Citizenship" top_label />
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
                                        <InputBottomBorderMarriage label="Male/Female" top_label />
                                    </div>
                                    <div class="grow">
                                        <InputBottomBorderMarriage label="Citizenship" top_label />
                                    </div>


                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage
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
                                    <InputBottomBorderMarriage
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />


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
                                    <InputBottomBorderMarriage />


                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">7. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Civil Status
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />
                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">8. </p>
                                    <p class="text-[10px] w-[80%]  h-full flex items-center text-start">IF PREVIOUSLY
                                        MARRIED: How was
                                        it dissolved?
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage label="Province" top_label />
                                    <InputBottomBorderMarriage label="Country" top_label />

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
                                    <InputBottomBorderMarriage label="City/Municipality" top_label />
                                    <InputBottomBorderMarriage label="Province" top_label />
                                    <InputBottomBorderMarriage label="Country" top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage label="Day" top_label />
                                    <InputBottomBorderMarriage label="Month" top_label />
                                    <InputBottomBorderMarriage label="Year" top_label />

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
                                    <InputBottomBorderMarriage label="Day" top_label />
                                    <InputBottomBorderMarriage label="Month" top_label />
                                    <InputBottomBorderMarriage label="Year" top_label />


                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">11. </p>
                                    <p class="text-[10px] w-[80%]  h-full flex items-center text-start">Degree of
                                        relationship of
                                        contractng parties
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage label="First" top_label />
                                    <InputBottomBorderMarriage label="Middle" top_label />
                                    <InputBottomBorderMarriage label="Last" top_label />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">12. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Name of Father
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage label="First" top_label />
                                    <InputBottomBorderMarriage label="Middle" top_label />
                                    <InputBottomBorderMarriage label="Last" top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">13. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />


                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage
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
                                    <InputBottomBorderMarriage
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-3 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage label="First" top_label />
                                    <InputBottomBorderMarriage label="Middle" top_label />
                                    <InputBottomBorderMarriage label="Last" top_label />

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
                                    <InputBottomBorderMarriage label="First" top_label />
                                    <InputBottomBorderMarriage label="Middle" top_label />
                                    <InputBottomBorderMarriage label="Last" top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />
                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">16. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage
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
                                    <InputBottomBorderMarriage
                                        label="House No., St., Barangay, City/Municipality, Province, Country"
                                        top_label />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />


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
                                    <InputBottomBorderMarriage />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">19. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Relationship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage />

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-row items-center justify-center w-full  text-center py-1.5">
                                    <p class="text-xs w-[20%] h-full flex items-center">20. </p>
                                    <p class="text-xs w-[80%]  h-full flex items-center text-start">Citizenship
                                    </p>
                                </div>
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-l border-gray-500 py-0.5 ">
                                    <InputBottomBorderMarriage />
                                </div>
                            </div>
                            <!-- 7 -->
                            <div class="flex flex-row border-b border-gray-500 w-full">
                                <div
                                    class="basis-[45%] grid grid-cols-1 gap-2 items-center border-r border-gray-500  py-0.5 ">
                                    <InputBottomBorderMarriage
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
                                    <InputBottomBorderMarriage
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
                                        <InputBottomBorderMarriage label="Signature of Applicant" />
                                    </div>
                                    <p class="text-xs indent-14 tracking-widest pr-16 pl-4 relative"><span
                                            class="font-bold">SUBSCRIBED AND
                                            SWORN</span> <span class="italic">to
                                            be for me
                                            this
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div> day of
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>,
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, at
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, Philippines, affiant who exhibited to me his
                                            Community
                                            Tax Cert.
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div> issued on
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>,
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, at
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>

                                        </span></p>
                                    <div class="mt-auto">
                                        <InputBottomBorderMarriage
                                            label="Signature Over Printed Name of the Civil Registrar" />
                                    </div>

                                </div>
                                <div class=" flex flex-col items-center justify-center h-full">
                                    <div class="mt-3 mb-3 w-full">
                                        <InputBottomBorderMarriage label="Signature of Applicant" />
                                    </div>
                                    <p class="text-xs indent-12 pl-16 pr-2 tracking-widest "><span
                                            class="font-bold">SUBSCRIBED AND
                                            SWORN</span> <span class="italic">to
                                            be for me
                                            this
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div> day of
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>,
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, at
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, Philippines, affiant who exhibited to me his
                                            Community
                                            Tax Cert.
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div> issued on
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>,
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>, at
                                            <div class="absolute w-[10%]">
                                                <InputBottomBorderMarriage />
                                            </div>

                                        </span></p>
                                    <div class="mt-auto">
                                        <InputBottomBorderMarriage
                                            label="Signature Over Printed Name of the Civil Registrar" />
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';

import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';

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
    height: 14 * ppi.value, // 14 inches in pixels
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
</script>
