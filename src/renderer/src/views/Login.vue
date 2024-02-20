<template>
    <div class="flex flex-col h-full justify-center items-center bg-gray-50">

        <div class="grid grid-rows-3 w-[20rem]  p-4 items-center">
            <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
                <input type="email" id="email"
                    class="bg-white border  border-gray-300  focus:border-blue-500 text-gray-900 text-sm rounded-md block w-full p-2.5 " />
            </div>
            <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                <input type="email" id="email"
                    class="bg-white border  border-gray-300  focus:border-blue-500 text-gray-900 text-sm rounded-md block w-full p-2.5 " />
            </div>
            <div class="ml-auto">
                <button type="button" @click="login()"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const login = () => {
    router.push('/server/dashboard')
}
</script>
