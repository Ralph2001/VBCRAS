<template>
    <div class="flex h-screen w-full justify-center items-center bg-gray-100">
        <div class="w-full max-w-md ">
            <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6 uppercase">Login</h1>

            <div v-if="auth.error" class="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 text-center">
                {{ auth.error }}
            </div>

            <div class="flex flex-col gap-4">
                <Input :error="v$.username.$error" v-model="formData.username" label="Username" />
                <Input :error="v$.password.$error" v-model="formData.password" label="Password" type="password"
                    @keydown.enter="login" />

                <button @click="login"
                    class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition">
                    Login
                </button>

                <router-link to="/signup"
                    class="text-sm text-center text-gray-600 hover:text-blue-600 transition hover:underline">
                    Don’t have an account? Sign up
                </router-link>
            </div>

            <div class="fixed bottom-4 right-4 z-50">
                <KillSwitch @click="disconnect">
                    <template #icon>
                        <font-awesome-icon icon="fa-solid fa-power-off" />
                    </template>
                </KillSwitch>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { AuthStore } from "../stores/Authentication";
import Input from "../components/essentials/inputs/Input.vue";
import KillSwitch from "../components/client/KillSwitch.vue";

const auth = AuthStore();
const loader = ref(false);

const formData = reactive({
    username: "",
    password: "",
});

const rules = computed(() => ({
    username: { required },
    password: { required },
}));

const v$ = useVuelidate(rules, formData);

onMounted(() => {
    auth.error = null;
});

const login = async () => {
    v$.value.$touch();
    if (v$.value.$error) return;

    loader.value = true;

    try {
        const success = await auth.login(formData.username, formData.password);
        loader.value = false;
        if (!success) {
            console.warn("Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
    }
};
</script>
