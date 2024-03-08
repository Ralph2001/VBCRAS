<template>
    <div class="flex items-center justify-center h-full gap-1 ">
        <button type="button" @click="handleClick(props.params)" title="Open File"
            class="py-1 px-3   text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-sm border border-gray-200 active:border-none hover:border-gray-300  hover:text-blue-700 focus:z-10 ring-0 focus:right-0 active:scale-95 transition-all  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Open
            File</button>


        <button @click="openPath(props.params)" title="Open Path" :disabled="openFolderLoader"
            :class="{ ' cursor-not-allowed': openFolderLoader }"
            class="text-gray-700 items-center flex  justify-center  hover:text-gray-800 h-8 active:scale-90 transition-all border px-[0.6rem] py-[0.5rem] rounded-md hover:border-gray-300 bg-white"
            type="button">

            <font-awesome-icon icon="fa-solid fa-right-from-bracket" v-if="!openFolderLoader" />
            <svg v-if="openFolderLoader" aria-hidden="true" role="status"
                class="inline w-4 h-4 text-gray-600 animate-spin" viewBox="0 0 100 101" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor" />
            </svg>
        </button>
        <!-- {{ props.data.id }} -->
        <button @click="deleteScanned(props.params.data.id)"
            class="text-gray-700 items-center flex justify-center hover:text-gray-800 h-10 active:scale-90 transition-all "
            type="button">
            <font-awesome-icon icon="fa-solid fa-trash"
                class=" border px-[0.6rem] py-[0.5rem] hover:text-red-400 rounded-md hover:border-gray-300 bg-white" />
        </button>

    </div>
</template>

<script setup>
import { useComputerStore } from '../stores/computer'
import { onMounted, ref } from 'vue';
const PCName = useComputerStore();
import { useScannedDocuments } from "../stores/scanned";
const Documents = useScannedDocuments();
import Swal from 'sweetalert2'
const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const openFolderLoader = ref(false)

onMounted(() => {
    PCName.getUserName();
});


const handleClick = async (params) => {
    const filename = params.data.name
    const filepath = params.data.filepath

    await openFile(filepath, filename)
}


const openFile = async (filepath, filename) => {
    try {
        const device = PCName.desktop_name
        const data = (
            [{
                name: filename,
                device_used: device,
                action: 'Opened'
            }
            ])

        const add_log = await Documents.add_log(data)

        if (add_log) {
            const check = await window.LocalCivilApi.checkFile(filepath);
            if (!check) {
                console.log('Cant Open')
                // visible.value = true
                console.log(check)
            }
        }

    } catch (error) {
        console.log(error)
        // console.log(error)
        // visible.value = true

    }
};

const openPath = async (params) => {


    try {

        const filename = params.data.name
        const filepath = params.data.filepath
        const device = PCName.desktop_name

        openFolderLoader.value = true


        const data = (
            [{
                name: filename,
                device_used: device,
                action: 'Opened Path'
            }
            ])

        const add_log = await Documents.add_log(data)
        if (add_log) {
            const check = await window.LocalCivilApi.openFilePath(filepath);

            // setTimeout(() => {
            //     openFolderLoader.value = false
            // }, 5000);
            openFolderLoader.value = false

        }

    } catch (error) {

    }
};


const deleteScanned = async (id) => {
    Swal
        .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                });

                const device = PCName.desktop_name
                removeRecord(id, device)
            }
        });
};


const removeRecord = async (id, device) => {
    const remove = await Documents.deleteRecord(id, device)

}


</script>
