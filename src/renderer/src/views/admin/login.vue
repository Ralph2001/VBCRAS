<template>
    <div class="flex flex-row justify-center items-center h-screen bg-[#f9f4da]">
        <div class="flex flex-col justify-center items-center gap-10">

            <p class="text-2xl text-[#1b1d23] font-bold font-mono">Admin Panel</p>

            <div class="flex flex-col gap-2 w-[20rem]">
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text" id="first_name"
                        class="bg-white border border-gray-300 text-[#1b1d23] text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-[#1b1d23] dark:text-white">Password</label>
                    <input type="password" id="first_name"
                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="ml-auto mt-5">
                    <button type="button"
                        class="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { AuthStore } from '../../stores/auth';
import { useRouter } from "vue-router"
import { ConnectionMode } from "../../stores/connection";

</script>   