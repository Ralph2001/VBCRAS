<template>
    <div>
        <button type="button" title="Disconnect" @click="disconnect"
            class="absolute bottom-1 right-1 text-gray-900 hover:bg-red-400 hover:text-white border active:scale-90 border-gray-300 shadow focus:outline-none font-medium rounded-full text-sm px-4 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            <font-awesome-icon icon="fa-solid fa-power-off" />
        </button>
    </div>
</template>

<script setup>
import { useHostStore } from '../../stores/Connection';
import { useModeStore } from '../../stores/mode';
import { useServerStore } from '../../stores/ServerApp';

const connection = useHostStore()
const mode = useModeStore()
const server = useServerStore()


const props = defineProps({
    title: String,
})

const disconnect = async () => {
    try {
        if (!mode.mode) { return }

        if (mode.mode === 'client') {
            connection.removeConnection()
        }
        else if (mode.mode === 'server') {
            server.close_server()
        }

    } catch (error) {
        console.log(error)
    }

    return
}
</script>
