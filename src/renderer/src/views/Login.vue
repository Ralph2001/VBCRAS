<template>
    <div class="flex flex-col h-screen w-full justify-center items-center  bg-gray-50 relative">
        <div class=" flex flex-col items-center  w-[40rem] h-auto p-4 rounded-md ">
            <p class="text-4xl text-gray-800 font-mono font-bold uppercase">LOGIN</p>

            <div class="h-16 flex items-center">
                <div v-if="auth.error"
                    class="p-4 text-sm w-full flex items-center justify-center h-10 text-red-800 rounded-sm bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert">
                    <span class="font-medium"> {{ auth.error }}</span>
                </div>
            </div>

            <div class="h-full flex  w-full flex-col gap-2   px-20">
                <Input :error="v$.username.$error" v-model="formData.username" label="Username" />
                <Input :error="v$.username.$error" v-model="formData.password" label="Password" type="password" skipnext
                    @keydown.enter="login()" />

                <div class="w-full flex flex-col gap2">
                    <button
                        class="border py-2 w-full bg-blue-500 rounded-md hover:bg-blue-600 font-medium text-white mt-2"
                        @click="login()">
                        Login</button>
                    <router-link to="/signup"
                        class="text-gray-600 hover:underline mt-2 w-fit font-medium px-2 border-black h-6 hover:text-blue-500">
                        Create an Account
                    </router-link>
                </div>

            </div>
        </div>
        <KillSwitch title="Disconnect" @click="disconnect()">
            <template #icon>
                <font-awesome-icon icon="fa-solid fa-power-off" />
            </template>
        </KillSwitch>

    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, computed, onMounted } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { AuthStore } from '../stores/Authentication'
import Input from "../components/essentials/inputs/Input.vue";

const con = useHostStore();
const router = useRouter();
const loader = ref(false)

const auth = AuthStore()
onMounted(() => {
    auth.error = null
})

import { useHostStore } from '../stores/Connection'
import InputField from "../components/client/InputField.vue";
import KillSwitch from "../components/client/KillSwitch.vue";

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
    loader.value = true
    const username = formData.username;
    const password = formData.password;

    try {
        const login = auth.login(username, password)
        if (login) {
            loader.value = false
        }
        else {
            console.log('error hays')
        }
    } catch (error) {
        console.log(error)
    }

}

</script>
