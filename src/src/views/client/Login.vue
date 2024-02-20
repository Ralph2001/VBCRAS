<template>
    <div class="flex flex-row justify-center items-center h-[calc(100vh-20px)] bg-gray-100" s>
        <div class="flex flex-col justify-center items-center gap-2">
            <img src="../../assets/logo.png" class="h-20" alt="">
            <p class="text-2xl text-gray-900 font-medium mb-10">Civil Registry Archive
                System</p>
            <div v-if="Auth.error"
                class="p-4 text-sm w-full text-red-800 rounded-sm bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert">
                <span class="font-medium"> {{ Auth.error }}</span>
            </div>

            <div class="w-80">
                <label for="first_name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input type="text" autofocus v-model="formData.username"
                    :class="{ 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500': v$.username.$error }"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required>
                <span v-if="v$.username.$error" class=" mt-2 text-sm  dark:text-red-500 text-red-600">
                    This field is required
                </span>

            </div>
            <div class="w-80 ">
                <label for="first_name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" v-model="formData.password"
                    :class="{ 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500': v$.password.$error }"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required>
                <span v-if="v$.password.$error" class="mt-2 text-sm  dark:text-red-500 text-red-600">
                    This field is required
                </span>

            </div>
            <div class="ml-auto mt-3">
                <button type="submit" @click="submitForm()"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
            </div>

            <div class="flex flex-row justify-between items-center mt-5 w-full">
                <router-link to="/Signup"
                    class=" underline  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                    Create an Account
                </router-link>
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


const router = useRouter();
const Auth = AuthStore();
const connection = ConnectionMode()

onMounted(() => {
    connection.checkConnection()
    Auth.Profile()
})

const formData = reactive({
    username: "",
    password: "",
});

const rules = computed(() => {
    return {
        username: { required },
        password: { required },
    };
});

const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        return;
    }

    const username = formData.username;
    const password = formData.password;

    try {
        await Auth.login(username, password);
        router.push('/Start')
    } catch (error) {
        console.log(error)
    }


}
</script>   