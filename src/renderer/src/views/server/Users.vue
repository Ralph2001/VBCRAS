<template>

    <div class="p-4 py-10 sm:ml-64 flex flex-col">
        <div class="grid grid-cols-2 w-full items-center ">
            <div>
                <p class="text-2xl font-semibold text-gray-700">
                    Users
                </p>
            </div>
        </div>
        <div class="grid grid-cols-2 w-full items-center mt-10">
            <div class="">
                <!-- <input type="text"
                    class="border rounded-md border-gray-300 py-2 px-3 w-[15rem] font-semibold placeholder:text-xs text-gray-800"
                    placeholder="Search"> -->
            </div>
            <div class="flex flex-row items-center justify-end px-10 gap-2 p-2">
                <button type="button"
                    class="bg-blue-500 px-3 rounded-full text-xs font-semibold leading-6 text-white font-mono">
                    All Users
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 w-full  mt-20 items-center">
            <div v-for="user in data.users" :key="user.id"
                class="flex flex-row justify-between border active:scale-90 rounded-md h-32 items-center p-2 hover:scale-95 transition-all cursor-pointer hover:shadow-sm">
                <div class="grid grid-flow-col w-full  h-full" @click="userCheck(user.id)">
                    <div class="flex items-center justify-center w-[80%]  ">
                        <img src="../../assets/logo.png" class="h-16 rounded-full" alt="">
                    </div>
                    <div class="flex w-[100%]  flex-col justify-center items-start px-1 overflow-hidden truncate ">
                        <p class="text-md text-gray-700 font-bold  truncate">
                            {{ user.name }}
                        </p>
                        <p class="text-xs italic text-gray-700 font-semibold truncate">
                            {{ user.position }}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
import { useServerDataStore } from '../../stores/serverData'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()
const data = useServerDataStore()

onMounted(() => {
    data.getAllUser()
})


const userCheck = () => {
    router.push(`/server/users/profile`)
}
</script>
