<template>
    <div class="flex flex-col h-full md:justify-center items-center  bg-gray-50 relative">


        <img src="../../assets/logo.png" class="h-20 mt-5 mb-5" alt="">
        <p class="text-lg text-gray-900 font-medium uppercase">Vital Bridge Civil Registry and Archive System</p>
        <div class="w-[15rem] mb-5 mt-5">
            <div v-if="auth.error"
                class="p-4 text-sm w-full text-red-800 rounded-sm bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert">
                <span class="font-medium"> {{ auth.error }}</span>
            </div>
        </div>

        <div class=" flex flex-col items-center">
            <InputField label="Username" type="text" v-model="formData.username" :error="v$.username.$error"
                @keyup.enter="login()">
                <p v-if="v$.username.$error" class="mt-2 text-sm text-red-600 dark:text-red-500"><span
                        class="font-medium">Error!</span> {{ v$.username.$errors[0].$message }}</p>
            </InputField>
            <InputField label="Password" type="password" v-model="formData.password" :error="v$.password.$error"
                @keyup.enter="login()">
                <p v-if="v$.password.$error" class="mt-2 text-sm text-red-600 dark:text-red-500"><span
                        class="font-medium">Error!</span> {{ v$.password.$errors[0].$message }}</p>
            </InputField>

            <div class="ml-auto flex items-end w-[20rem] justify-between">
                <router-link to="/client/signup" class="text-gray-900 border-black h-6 hover:border-b-2">
                    Create an Account
                </router-link>

                <button type="button" @click="login()"
                    class="text-white bg-blue-700 hover:bg-blue-800 flex items-center active:scale-95 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <svg v-if="loader" aria-hidden="true" role="status"
                        class="inline w-4 h-4 me-2 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor" />
                    </svg>
                    Login
                </button>

            </div>
        </div>
        <KillSwitch @click="disconnect()">
            <template #icon>
                <font-awesome-icon icon="fa-solid fa-power-off" />
            </template>
        </KillSwitch>

    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import InputField from '../../components/client/InputField.vue'
import { ref, reactive, computed, onMounted } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { AuthStore } from '../../stores/clientAuth'
import KillSwitch from "../../components/client/KillSwitch.vue";

const con = useHostStore();
const router = useRouter();
const loader = ref(false)

const auth = AuthStore()
onMounted(() => {
    auth.error = null
})



import { useHostStore } from '../../stores/connection'
import Alert from "../../components/Alert.vue";

const disconnect = () => {
    con.removeConnection()
}



const formData = reactive({
    username: '',
    password: '',
});

const rules = computed(() => {
    return {
        username: { required },
        password: { required },
    };
});

const v$ = useVuelidate(rules, formData);

const login = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        return;
    }

    const username = formData.username;
    const password = formData.password;

    try {
        const login = auth.login(username, password)
        if (login) {
        }
        else {
            console.log('error hays')
        }
    } catch (error) {
        console.log(error)
    }

}

</script>
