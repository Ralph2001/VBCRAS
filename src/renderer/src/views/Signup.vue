<template>
    <div class="flex flex-col h-full justify-center items-center bg-[#FFFFFF] relative overflow-y-scroll">


        <div class=" flex flex-col items-center  w-[40rem] h-auto p-4 rounded-md">
            <p class="text-4xl text-gray-800 font-mono font-bold uppercase">CREATE AN ACCOUNT</p>

            <div class="h-16 flex items-center">
                <div v-if="auth.error"
                    class="p-4 text-sm w-full flex items-center justify-center h-10 text-red-800 rounded-sm bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert">
                    <span class="font-medium"> {{ auth.error }}</span>
                </div>
            </div>
            <div class="h-full flex  w-full flex-col gap-2   px-20">
                <Input :error="v$.username.$error" v-model="formData.username" label="Username" />
                <Input :error="v$.username.$error" v-model="formData.password" label="Password" type="password" />
                <Input :error="v$.confirmPassword.$error" v-model="formData.confirmPassword" label="Confirm Password" skipnext
                    type="password" @keydown.enter="signup()" />

                <div class="w-full flex flex-col gap2">
                    <button class="border py-2 w-full bg-blue-500 hover:bg-blue-600 rounded-md font-medium text-white mt-2"
                        @click="signup()">Signup</button>
                    <router-link to="/login"
                        class="text-gray-600 hover:underline mt-2 w-fit font-medium px-2 border-black h-6 hover:text-blue-500">
                        Already have an Account
                    </router-link>
                </div>

            </div>
        </div>
        <div class="fixed bottom-0 right-0 bg-blue-200 z-50 border">
            <KillSwitch @click="disconnect()">
                <template #icon>
                    <font-awesome-icon icon="fa-solid fa-power-off" />
                </template>
            </KillSwitch>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { ref, reactive, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { AuthStore } from '../stores/Authentication';
import InputField from '../components/client/InputField.vue';
import KillSwitch from '../components/client/KillSwitch.vue';
import { useHostStore } from '../stores/Connection';
import Input from '../components/essentials/inputs/Input.vue';
const con = useHostStore();
const router = useRouter();
const loader = ref(false);


const disconnect = () => {
    con.removeConnection();
};

const auth = AuthStore();
onMounted(() => {
    auth.error = null;
});

const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',

});

const rules = computed(() => {
    return {
        username: { required },
        password: { required },
        confirmPassword: { required, sameAsPassword: sameAs(formData.password) }
    };
});

const v$ = useVuelidate(rules, formData);

const signup = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        return;
    }
    const username = formData.username;
    const password = formData.password;

    loader.value = true;
    try {
        const signUp = auth.signUp(username, password);
        if (signUp) {
            loader.value = false;
        } else {
            console.log('error hays');
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
