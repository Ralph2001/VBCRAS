<template>
    <div class="flex flex-row justify-center items-center h-screen bg-gray-100">
        <div class="flex flex-col justify-center items-center gap-10">
            <p class="text-2xl text-[#1b1d23] font-bold font-mono">Admin Panel</p>
            <div class="flex flex-col gap-2 w-[20rem]">
                <InputForm label="Username" type="text" />
                <InputForm label="Password" type="password"  />

                <div class="ml-auto mt-5">
                    <button type="button" @click="Login()"
                        class="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { AuthStore } from '../../stores/auth';
import { useRouter } from "vue-router"
import InputForm from "../../components/admin/InputForm.vue";

const router = useRouter();
const Auth = AuthStore();

const formData = reactive({
    username: "Admin",
    password: "Admin",
});

const rules = computed(() => {
    return {
        username: { required },
        password: { required },
    };
});

const v$ = useVuelidate(rules, formData);

const Login = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$)
        return;
    }

    const username = formData.username;
    const password = formData.password;

    try {
        await Auth.login(username, password);
        console.log('Welcome Admin')
    } catch (error) {
        console.log(error)
    }


}
</script>   