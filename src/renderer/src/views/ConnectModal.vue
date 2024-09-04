<template>
    <div tabindex="-1"
        class="fixed top-0 bottom-0 right-0 left-0 z-50 backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center">
        <div class="w-[40rem] h-[20rem] flex flex-col border bg-white rounded p-4 relative shadow-sm">
            <div class="flex flex-row  ">
                <p class="font-medium text-lg">Connect</p>
                <button class="right-4 top-2 ml-auto" title="close">X</button>
            </div>
            <div class="h-full flex flex-col mt-5 p-2  w-full items-center  ">
                <div class="w-full mb-5">
                    <ul class="list-disc list-inside">
                        <li class="text-sm text-gray-800">Please ensure you use the host address provided by the admin.
                        </li>
                        <li class="text-sm text-gray-800">Ensure you're on the same network as the admin.</li>
                    </ul>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="host" class="text-sm font-medium mb-2">Host Address <span
                            class="text-xs italic font-normal">Example: 192.168.1.1</span></label>
                    <input type="text" id="host" class="w-full border border-gray-300 rounded font-medium">
                </div>
            </div>
            <div class="mt-auto flex  w-full p-2 ">
                <button
                    class="w-max shadow-sm px-2.5 py-1 rounded ml-auto hover:bg-blue-600 font-medium bg-blue-500 text-white">Connect</button>
                <!--  -->
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import HandleButton from '../components/mode/HandleButton.vue';
import HostInput from '../components/mode/HostInput.vue';


const connectText = ref('Connect')
</script>

<style lang="scss" scoped></style>