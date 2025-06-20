<template>
    <div class="h-full relative flex flex-col gap-1">
        <teleport to="body" v-if="isFullScreen">
            <div
                class="fixed top-0 bottom-0 left-0 right-0 h-full w-full backdrop-blur-sm z-[9999999999999999] bg-gray-800 justify-center items-center flex">
                <div class="h-full w-full  gap-2 flex-col relative flex items-center justify-center">

                    <!-- Countdown Timer -->
                    <div v-if="countdown > 0" class="absolute z-[999999999] text-white text-5xl">
                        {{ countdown }}
                    </div>

                    <div class="h-16 p-2 gap-1  flex w-full items-center bg-black/20 ">
                        <button @click="closeCamera"
                            class=" p-2 ] flex flex-row gap-2 items-center bg-red-600 hover:bg-red-500  text-white outline-none text-xs rounded-sm font-medium">
                            <font-awesome-icon icon="fa-solid fa-arrow-left" />
                            Cancel Operation
                        </button>
                        <div class="w-14 flex ml-auto flex-col gap-1">
                            <p class="font-mono text-xs text-white">Timer:</p>
                            <input v-model="timer" type="number"
                                class="rounded-xl border text-center font-medium bg-gray-200 border-gray-300 py-1">
                        </div>
                        <div class="flex flex-col gap-1 ">
                            <p class="font-mono text-xs text-white">Camera:</p>
                            <select
                                class=" text-sm rounded-xl font-medium w-[12rem] h-[2.2rem] bg-gray-200 outline-none ring-0"
                                v-model="selectedDeviceId" @change="startCamera">
                                <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                                    {{ device.label || `Camera ${device.deviceId}` }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="flex-1 h-full  w-full  flex justify-center items-center">
                        <div v-if="capturedImage === null" class="video h-full relative">
                            <!-- <video class="h-full" ref="videoElement" autoplay playsinline></video> -->
                            <video class="h-full transform -scale-x-100" ref="videoElement" autoplay
                                playsinline></video>

                            <div class="overlay absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="border border-gray-100   h-44 w-44"></div>
                            </div>
                        </div>

                        <div v-if="capturedImage" class="flex flex-col items-center">
                            <img :src="capturedImage" alt="Captured photo" class="max-w-full max-h-full mb-4"
                                ref="capturedImageElement" />
                            <div class="flex flex-row gap-2 items-center justify-center ">
                                <label for="brightness" class="text-white text-xs font-medium">Brightness:</label>
                                <input id="brightness" type="range" min="0" max="200" @change="applyBrightness()"
                                    v-model="brightness" class="w-40">
                                <div class="w-10 h-10">
                                    <button @click="resetBrightness" v-if="brightness !== 100"
                                        class="text-white  bg-red-500 hover:bg-red-600 text-sm flex items-center justify-center rounded-full w-8 h-8">
                                        <font-awesome-icon icon="fa-solid fa-xmark" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="h-20 p-2   w-full flex gap-2 justify-end px-4 ">
                        <button @click="captureImage" v-if="!capturedImage"
                            class="text-white  p-2 w-14 h-14 bg-green-500 outline-none shadow-lg hover:bg-green-600 rounded-full transition-all duration-300  text-sm flex flex-row gap-2 items-center justify-center active:scale-95 font-medium"><font-awesome-icon
                                icon="fa-solid fa-camera" /> </button>
                        <button @click="save_image" v-if="capturedImage"
                            class="text-white h-12 p-2 w-24 bg-green-500 hover:bg-green-600 transition-all duration-300 text-sm rounded-sm flex flex-row gap-2 items-center justify-center active:scale-95 font-medium"><font-awesome-icon
                                icon="fa-solid fa-share" /> Save</button>
                        <button @click="removeImage" v-if="capturedImage"
                            class="text-white h-12 p-2 w-24 bg-red-500 hover:bg-red-600 transition-all duration-300 text-sm rounded-sm flex flex-row gap-2 items-center justify-center active:scale-95 font-medium"><font-awesome-icon
                                icon="fa-solid fa-trash" /> Reset</button>
                    </div>
                </div>
            </div>
        </teleport>

        <div @click="openCamera" tabindex="0"
            class="w-[170px] h-[166px] bg-gray-200 active:ring-2 focus:ring-2 outline-1 hover:bg-gray-300 transition-all duration-300 cursor-pointer  flex items-center justify-center">
            <button @click="openCamera" tabindex="-1">
                <font-awesome-icon icon="fa-solid fa-camera" class="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
            <!-- <p v-else class="text-xs text-gray-700 font-mono">No Camera Detected</p> -->
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';


const emit = defineEmits(['capture']);



const videoElement = ref(null);
const capturedImage = ref(null);
const videoDevices = ref([]);
const selectedDeviceId = ref(null);
let mediaStream = null;
const isFullScreen = ref(false);
const countdown = ref(0); // Countdown variable
const timer = ref(3);
const no_camera = ref(false)
const brightness = ref(100)




const save_image = () => {
    isFullScreen.value = false;
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
        mediaStream = null;
    }

    emit('capture', capturedImage.value);

    capturedImage.value = null
};

// Open the camera and show full-screen mode
const openCamera = () => {
    isFullScreen.value = true;
    startCamera();
};

// Start the camera using the selected device
const startCamera = async () => {
    try {
        no_camera.value = false
        if (mediaStream) {
            // Stop existing streams if switching devices
            mediaStream.getTracks().forEach(track => track.stop());
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId.value ? { exact: selectedDeviceId.value } : undefined }
        });

        videoElement.value.srcObject = mediaStream;
    } catch (error) {
        no_camera.value = true
        console.error('Error accessing the camera: ', error);
        // toast.error("No camera detected. Please connect a camera to continue.");
    }
};

// Capture the image after a countdown
const originalImage = ref(null); // Store the original captured image

const captureImage = () => {
    startCountdown(timer.value, () => {
        const video = videoElement.value;
        const canvas = document.createElement('canvas');
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');

        const zoom = 1.2; // 🔍 zoom factor (1.0 = no zoom)

        // Calculate zoomed area
        const zoomWidth = videoWidth / zoom;
        const zoomHeight = videoHeight / zoom;
        const offsetX = (videoWidth - zoomWidth) / 2;
        const offsetY = (videoHeight - zoomHeight) / 2;

        // ✅ Mirror and zoom the image
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(
            video,
            offsetX, offsetY,        // source x, y (start from cropped area)
            zoomWidth, zoomHeight,   // source width, height
            0, 0,                     // destination x, y
            videoWidth, videoHeight  // destination width, height (fills full canvas)
        );

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        capturedImage.value = dataUrl;
        originalImage.value = dataUrl;

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    });
};


const resetBrightness = () => {
    brightness.value = 100
    capturedImage.value = originalImage.value;

}

const applyBrightness = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = originalImage.value; // Always use the original image

    img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Apply brightness filter
        ctx.filter = `brightness(${brightness.value}%)`;

        // Redraw the image with the filter
        ctx.drawImage(img, 0, 0);

        // Update the captured image with the new data
        capturedImage.value = canvas.toDataURL('image/png');
    };
};

// Start countdown and call callback when it ends
const startCountdown = (duration, callback) => {
    countdown.value = duration;
    const countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(countdownInterval);
            callback(); // Capture image after countdown
        }
    }, 1000); // 1 second interval for countdown
};

// Remove captured image and reset video stream
const removeImage = () => {
    capturedImage.value = null;
    startCamera();
};

// Close the camera and stop the media stream
const closeCamera = () => {
    isFullScreen.value = false;
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
        mediaStream = null;
    }
    capturedImage.value = null; // Clear captured image
};

// Fetch available camera devices
const getCameras = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices.value = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.value.length > 0) {
            selectedDeviceId.value = videoDevices.value[0].deviceId; // Select first camera by default
        } else {
            // Show toast if no cameras are found
            console.log('No Camera')
            // toast.error("No camera devices detected.");
        }
    } catch (error) {
        console.error('Error fetching cameras:', error);
        // toast.error("Error accessing the camera devices.");
    }
};

// Lifecycle hooks
onMounted(() => {
    getCameras(); // Fetch camera devices on component mount
});

onBeforeUnmount(() => {
    closeCamera(); // Ensure camera is closed when component is destroyed
});
</script>
