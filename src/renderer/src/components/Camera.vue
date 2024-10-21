<template>
    <div class="h-full relative flex flex-col gap-1">
        <teleport to="body" v-if="isFullScreen">
            <div
                class="fixed top-0 bottom-0 left-0 right-0 h-full w-full backdrop-blur-sm z-[9999999999999999] bg-gray-800 justify-center items-center flex">
                <div class="h-full w-full relative flex items-center justify-center">

                    <!-- Countdown Timer -->
                    <div v-if="countdown > 0" class="absolute z-[999999999] text-white text-5xl">
                        {{ countdown }}
                    </div>

                    <div class="absolute top-0 p-2 gap-1 flex w-full">
                        <button @click="closeCamera" class="border p-2 bg-white text-xs rounded-sm font-medium">
                            Cancel Operation
                        </button>
                        <div class="w-14 flex ml-auto flex-col">
                            <p class="font-mono text-xs text-white">Timer:</p>
                            <input v-model="timer" type="number" class="rounded-sm border border-gray-300 py-1">
                        </div>
                        <select class=" text-sm rounded-sm" v-model="selectedDeviceId" @change="startCamera">
                            <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                                {{ device.label || `Camera ${device.deviceId}` }}
                            </option>
                        </select>
                    </div>

                    <div v-if="capturedImage === null" class="video h-[85%]">
                        <video class="h-full" ref="videoElement" autoplay playsinline></video>
                    </div>

                    <div v-if="capturedImage">
                        <img :src="capturedImage" alt="Captured photo" />
                    </div>

                    <div class="absolute bottom-0 p-10 w-full flex gap-2 justify-end">
                        <button @click="captureImage" v-if="!capturedImage"
                            class="text-white p-2 bg-green-400 text-sm rounded-sm">Capture</button>
                        <button @click="save_image" v-if="capturedImage"
                            class="text-white p-2 bg-green-400 text-sm rounded-sm">Save</button>
                        <button @click="removeImage" v-if="capturedImage"
                            class="text-white p-2 bg-red-400 text-sm rounded-sm">Remove</button>
                    </div>
                </div>
            </div>
        </teleport>

        <div class="h-[10rem] bg-gray-200 w-full flex items-center justify-center">
            <button @click="openCamera">
                <font-awesome-icon icon="fa-solid fa-camera" class="text-4xl text-gray-400 hover:text-gray-800" />
            </button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const emit = defineEmits(['capture'])


const videoElement = ref(null);
const capturedImage = ref(null);
const videoDevices = ref([]);
const selectedDeviceId = ref(null);
let mediaStream = null;
const isFullScreen = ref(false);
const countdown = ref(0); // Countdown variable
const timer = ref(3)


const save_image = () => {

    isFullScreen.value = false;
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
        mediaStream = null;
    }

    emit('capture', capturedImage.value)
}

// Open the camera and show full-screen mode
const openCamera = () => {
    isFullScreen.value = true;
    startCamera();
};

// Start the camera using the selected device
const startCamera = async () => {
    try {
        if (mediaStream) {
            // Stop existing streams if switching devices
            mediaStream.getTracks().forEach(track => track.stop());
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId.value ? { exact: selectedDeviceId.value } : undefined }
        });

        videoElement.value.srcObject = mediaStream;
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
};



// Capture the image after a countdown
const captureImage = () => {
    startCountdown(timer.value, () => {
        const video = videoElement.value;
        const canvas = document.createElement('canvas');
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        capturedImage.value = canvas.toDataURL('image/png');

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    });
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
        }
    } catch (error) {
        console.error('Error fetching cameras:', error);
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


<style scoped>
video {
    width: 100%;
    transform: scaleX(-1);
    /* Flip for mirrored effect */
}

img {
    transform: scaleX(-1);
    /* Flip the captured image to match video */
}

/* Countdown Timer Styling */
.countdown-timer {
    font-size: 5rem;
    font-weight: bold;
    color: white;
    animation: fadeInOut 1s ease-in-out infinite;
}

@keyframes fadeInOut {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
