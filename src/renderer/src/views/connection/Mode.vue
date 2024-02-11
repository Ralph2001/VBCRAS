<template>
    <div class="flex flex-col w-full bg-slate-100 h-screen justify-center p-4 items-center">
        <p class="text-md uppercase text-gray-800 font-bold mb-10 font-mono antialiased">Connection Mode</p>
        <div class="">
            <div class="flex flex-row p-3 gap-5">
                <ButtonMode title="Server" value="Server" @pressed="choose" />
                <ButtonMode title="Client" value="Client" @pressed="choose" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ConnectionMode } from '../../stores/connection';
import ButtonMode from '../../components/connection/ButtonMode.vue';
const Connect = ConnectionMode();

const mode = ref('')

const choose = async (chose) => {
    mode.value = chose
    await Connect.changeMode(mode.value)
};

onMounted(() => {
    Connect.checkConnection()
    Connect.checkMode()
})
</script>
  