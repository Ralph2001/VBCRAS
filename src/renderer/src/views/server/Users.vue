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

            </div>
            <div class="flex flex-row items-center justify-end px-10 gap-2 p-2">
                <button type="button"
                    class="bg-blue-500 px-3 rounded-full text-xs font-semibold leading-6 text-white font-mono">
                    All Users
                </button>
            </div>
        </div>

        <div class="grid sm:grid-cols-2 md:lg:grid-cols-4 gap-4 items-center ">
            <div v-for="user in data.users" :key="user.id"
                class="flex flex-row justify-between border rounded-md h-32 items-center p-2 hover:shadow-md transition-all cursor-pointer"
                @click="userCheck(user.id)">
                <div class="grid grid-flow-col w-full  h-full">
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



const userCheck = (id) => {

    router.push(`/server/users/profile/${id}`)
}
</script>
