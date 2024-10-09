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
                    <div :style="paperStyle" class="flex bg-gray-50 shadow-md py-14 pl-12 pr-10 flex-col">

                        <div class="w-full h-full border-2 border-gray-500 flex flex-col">

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
                                <p class="text-sm text-center">OFFICE OF THE CIVIL REGISTRARION GENERAL</p>
                                <p class="text-2xl text-center font-bold text-gray-700">APPLICATION FOR MARRIAGE LICENSE
                                </p>

                            </div>
                            <!-- Second -->
                            <div class="border-b border-gray-500 flex flex-row relative  w-full">
                                <div class="basis-[70%] flex flex-col  border-r border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Province</p>
                                        <InputBottomBorder />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">City/Municipality</p>
                                        <InputBottomBorder />
                                    </div>
                                </div>
                                <div class="relative p-1">
                                    <p class="text-sm text-nowrap "> Registry No.</p>
                                </div>
                            </div>
                            <!-- Third -->
                            <div class="border-b border-gray-500 grid grid-cols-2 relative  w-full">
                                <div class="flex flex-col  border-r border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Received by:</p>
                                        <InputBottomBorder />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Date of Receipt:</p>
                                        <InputBottomBorder />
                                    </div>

                                </div>
                                <div class="flex flex-col  border-l border-gray-500 p-1">
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Marriage License No.:</p>
                                        <InputBottomBorder />
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <p class="text-sm text-nowrap ">Date of Issuance of Marriage License:</p>
                                        <InputBottomBorder />
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
                                        <p class="text-xs">(First)</p>
                                        <InputBottomBorder />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorder />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorder />
                                    </div>

                                </div>
                                <div
                                    class="basis-[13%] px-2  flex flex-col items-center justify-center  p-1 text-center ">
                                    <p class="text-xs">1. Name of Applicant</p>
                                </div>
                                <div class="basis-[45%] flex flex-col  border-l border-gray-500 p-1">
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(First)</p>
                                        <InputBottomBorder />
                                    </div>

                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Middle)</p>
                                        <InputBottomBorder />
                                    </div>
                                    <div class="flex flex-row gap-2 items-center">
                                        <p class="text-xs">(Last)</p>
                                        <InputBottomBorder />
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
import InputBottomBorder from '../../components/essentials/inputs/InputBottomBorder.vue';

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
