<template>
    <div class="flex h-screen justify-center items-center bg-gray-50 overflow-y-auto">
        <div class="w-full max-w-md ">
            <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6 uppercase">Create an Account</h1>

            <div v-if="auth.error" class="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 text-center">
                {{ auth.error }}
            </div>

            <div class="flex flex-col gap-4">
                <Input :error="v$.username.$error" v-model="formData.username" label="Username" />
                <Input :error="v$.password.$error" v-model="formData.password" label="Password" type="password" />
                <Input :error="v$.confirmPassword.$error" v-model="formData.confirmPassword" label="Confirm Password"
                    type="password" @keydown.enter="signup" />

                <button @click="signup"
                    class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition">
                    Sign Up
                </button>

                <router-link to="/login"
                    class="text-sm text-center text-gray-600 hover:text-blue-600 hover:underline transition">
                    Already have an account? Log in
                </router-link>
            </div>
        </div>

        <div class="fixed bottom-4 right-4 z-50">
            <KillSwitch @click="disconnect">
                <template #icon>
                    <font-awesome-icon icon="fa-solid fa-power-off" />
                </template>
            </KillSwitch>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { AuthStore } from '../stores/Authentication';
import { useHostStore } from '../stores/Connection';
import Input from '../components/essentials/inputs/Input.vue';
import KillSwitch from '../components/client/KillSwitch.vue';

const auth = AuthStore();
const con = useHostStore();
const router = useRouter();

const loader = ref(false);

const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',
});

const passwordValue = computed(() => formData.password);

const rules = computed(() => ({
    username: { required },
    password: { required },
    confirmPassword: {
        required,
        sameAsPassword: sameAs(passwordValue, 'Passwords must match'),
    },
}));

const v$ = useVuelidate(rules, formData);

onMounted(() => {
    auth.error = null;
});

const disconnect = () => {
    con.removeConnection();
};

const signup = async () => {
    v$.value.$touch();
    console.log(v$.value)
    if (v$.value.$error) return;

    loader.value = true;
    try {
        const result = await auth.signUp(formData.username, formData.password);
        loader.value = false;

        if (!result) {
            console.warn('Signup failed.');
        }
    } catch (error) {
        console.error('Signup error:', error);
    }
};
</script>
