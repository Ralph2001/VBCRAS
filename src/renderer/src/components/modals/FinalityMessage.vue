<template>
  <div class="">
    <Transition enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div
        class="flex flex-col absolute rounded-xl h-[auto] top-[5rem] right-[2rem] border bg-white z-50 w-[30rem] p-4 shadow-xl">
        <div class="relative flex flex-row items-center  ">
          <p class="text-md font-semibold tracking-widest p-2 ">
            <span class="text-green-700">Approved</span> <span class="font-normal text-xs italic text-gray-900">on April
              19, 2024</span>
          </p>
          <div class="absolute right-0 -top-4">
            <div class="success-checkmark scale-75">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-full flex flex-col justify-center items-start py-2 px-3">
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Petition Number:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">{{ props.data.data.petition_number }}</p>
          </div>
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Petitioner Name:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">
              {{ props.data.data.petitioner_name }}
            </p>
          </div>
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Document Owner:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">
              {{ props.data.data.name_owner === 'N/A' ? props.data.data.petitioner_name : props.data.data.name_owner }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 flex-row justify-end mt-5">
          <button type="button" @click="openfolder(props.data.data.filepath)"
            class="px-3 py-2 text-xs tracking-widest font-medium text-center text-white bg-green-500 rounded-sm hover:bg-green-800 active:scale-95  focus:outline-none focus:ring-green-300 shadow-md">
            Open Petition Folder
          </button>
          <button type="button" @click="open(props.data.data.filepath)"
            class="px-3 py-2 text-xs tracking-widest font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 active:scale-95  focus:outline-none focus:ring-blue-300 shadow-md">
            Open Finality
          </button>
          <button type="button" @click="emit('close-modal', false)"
            class="px-3 py-2 text-xs tracking-widest font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-sm active:scale-95  hover:bg-red-500 hover:text-white shadow-md">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  data: {
    type: Object

  }
})
const emit = defineEmits(["close-modal"]);

const openfolder = async (filepath) => {
  const open = await window.ClericalApi.OpenClerical(filepath)
  if (open) {

  }
}


const open = async (filepath) => {
  const filelocation = filepath + 'Finality/Certificate of Finality.docx'
  console.log(filelocation)
  const open = await window.ClericalApi.OpenClerical(filelocation)
  if (open) {

  }
}

</script>

<style lang="scss" scoped>
.success-checkmark {
  width: 80px;
  height: 115px;
  margin: 0 auto;

  .check-icon {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #4CAF50;

    &::before {
      top: 3px;
      left: -2px;
      width: 30px;
      transform-origin: 100% 50%;
      border-radius: 100px 0 0 100px;
    }

    &::after {
      top: 0;
      left: 30px;
      width: 60px;
      transform-origin: 0 50%;
      border-radius: 0 100px 100px 0;
      animation: rotate-circle 4.25s ease-in;
    }

    &::before,
    &::after {
      content: '';
      height: 100px;
      position: absolute;
      background: #FFFFFF;
      transform: rotate(-45deg);
    }

    .icon-line {
      height: 5px;
      background-color: #4CAF50;
      display: block;
      border-radius: 2px;
      position: absolute;
      z-index: 10;

      &.line-tip {
        top: 46px;
        left: 14px;
        width: 25px;
        transform: rotate(45deg);
        animation: icon-line-tip 0.75s;
      }

      &.line-long {
        top: 38px;
        right: 8px;
        width: 47px;
        transform: rotate(-45deg);
        animation: icon-line-long 0.75s;
      }
    }

    .icon-circle {
      top: -4px;
      left: -4px;
      z-index: 10;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: absolute;
      box-sizing: content-box;
      border: 4px solid rgba(76, 175, 80, .5);
    }

    .icon-fix {
      top: 8px;
      width: 5px;
      left: 26px;
      z-index: 1;
      height: 85px;
      position: absolute;
      transform: rotate(-45deg);
      background-color: #FFFFFF;
    }
  }
}

@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }

  5% {
    transform: rotate(-45deg);
  }

  12% {
    transform: rotate(-405deg);
  }

  100% {
    transform: rotate(-405deg);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }

  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }

  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }

  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }

  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }

  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }

  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }

  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
</style>
