<template>
  <button @click="handleShow()"
    class="rounded-md border border-gray-300 h-8 flex items-center justify-center gap-1 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"
    aria-label="How to use this feature">

    <!-- <font-awesome-icon icon="fa-solid fa-gear" /> -->
    <font-awesome-icon
    icon="fa-solid fa-info" />
    <span class="text-xs font-medium">How To?</span>
  </button>

  <div v-if="show"
    class="fixed inset-0 backdrop-blur-sm backdrop-brightness-50  z-50 flex items-center justify-center overflow-y-auto">

    <div class="bg-white w-full max-w-screen-lg h-[calc(100vh-50px)] flex flex-col rounded overflow-hidden ">
      <!-- Header -->
      <div class="flex justify-between items-center mb-2 h-16 p-2 border-b shadow-sm  relative">
        <h1 class="text-2xl font-bold text-gray-800 truncate">📘 Step-by-Step Guide: Filing a Clerical Error Petition
        </h1>
        <button @click="handleHide()" aria-label="Close tutorial"
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Instructions -->
      <div class="space-y-10 text-gray-800 text-base leading-relaxed  p-8 flex-1 overflow-y-auto ">
        <div v-for="(step, index) in steps" :key="index" class="space-y-4">
          <h2 class="text-xl font-semibold">Step {{ index + 1 }}: {{ step.title }}</h2>
          <img :src="step.image" alt="Step Image" class="w-full rounded " />
          <p v-html="step.description"></p>
        </div>

        <div class="text-center mt-10">
          <strong class="text-green-700 text-lg">🎉 You’ve reached the end of the guide!</strong><br>
          Make sure to double-check everything before printing or submitting.
        </div>

      </div>
      <div class="h-12 w-full border-t shadow-2xl flex items-center justify-center">
        <button @click="handleHide()"
          class="font-medium text-sm w-full hover:bg-red-400 hover:text-white cursor-pointer h-full transition-all duration-300">Exit
          Tutorial</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false)

const handleShow = () => {
  show.value = true
}
const handleHide = () => {
  show.value = false
}

// Add your own images in place of `/images/stepX.png`
const steps = [
  {
    title: "Start a New Petition",
    image: "../../../../assets/images/how_to/correction/image.png",
    description: `Click the <strong>"Create New Petition"</strong> button on your dashboard to begin.`
  },
  {
    title: "Select the Document Details",
    image: "/images/step2.png",
    description: `
        In the <strong>Document Type</strong> section:
        <ul class="list-disc ml-6 mt-2">
          <li>Select the appropriate <strong>Republic Act</strong>.</li>
          <li>Choose the <strong>Petition Type</strong> and <strong>Document Type</strong>.</li>
          <li>If the petitioner is a Migrant, check the box labeled <strong>"Migrant"</strong>.</li>
        </ul>
      `
  },
  {
    title: "Choose the Location",
    image: "/images/step3.png",
    description: `Pick the <strong>Province</strong> and <strong>Municipality</strong> where the petition will be filed.`
  },
  {
    title: "Input the Petition Number",
    image: "/images/step4.png",
    description: `
        Enter the <strong>Petition Number</strong>. This is usually auto-generated based on your choices.<br>
        Example format: <code class="bg-gray-100 px-1 rounded">CCE-0001-2025</code>
      `
  },
  {
    title: "Enter Petitioner's Details",
    image: "/images/step5.png",
    description: `Add the <strong>Nationality</strong> and <strong>Address</strong> of the petitioner.`
  },
  {
    title: "Choose Document Owner",
    image: "/images/step6.png",
    description: `
        Select whose certificate needs correction:
        <ul class="list-disc ml-6 mt-2">
          <li><strong>My Certificate</strong> – if it's the petitioner's document.</li>
          <li><strong>The Certificate</strong> – if it belongs to someone else.</li>
        </ul>
      `
  },
  {
    title: "If 'The Certificate' is selected",
    image: "/images/step7.png",
    description: `
        Fill in:
        <ul class="list-disc ml-6 mt-2">
          <li><strong>Document Owner's Name</strong></li>
          <li><strong>Relationship</strong> to the document owner</li>
        </ul>
      `
  },
  {
    title: "Provide Certificate Details",
    image: "/images/step8.png",
    description: `Add basic information from the document (birth, death, or marriage details).`
  },
  {
    title: "Enter the Errors to be Corrected",
    image: "/images/step9.png",
    description: `
        Specify each correction clearly:
        <ul class="list-disc ml-6 mt-2">
          <li><strong>Item Number</strong> (as seen in the document)</li>
          <li><strong>Description</strong> of the field</li>
          <li><strong>From</strong> (incorrect value) and <strong>To</strong> (correct value)</li>
        </ul>
      `
  },
  {
    title: "Explain the Reason",
    image: "/images/step10.png",
    description: `State clearly why you're requesting the correction. Include facts and evidence.`
  },
  {
    title: "Add Supporting Documents",
    image: "/images/step11.png",
    description: `Upload scanned copies or type a list of all necessary supporting documents.`
  },
  {
    title: "Fill Certification & Origin Details",
    image: "/images/step12.png",
    description: `
        Add:
        <ul class="list-disc ml-6 mt-2">
          <li><strong>LCRO Municipality and Province</strong></li>
          <li><strong>Administering Officer</strong></li>
          <li><strong>Subscribed and sworn info</strong></li>
          <li><strong>Exhibit Number, Issued At and On</strong></li>
        </ul>
      `
  },
  {
    title: "Registrar Decision",
    image: "/images/step13.png",
    description: `
        Fill in:
        <ul class="list-disc ml-6 mt-2">
          <li>Decision: <strong>Granted or Denied</strong></li>
          <li><strong>Date</strong> of decision and <strong>Name of Civil Registrar</strong></li>
        </ul>
      `
  },
  {
    title: "Add Payment Information",
    image: "/images/step14.png",
    description: `
        Input:
        <ul class="list-disc ml-6 mt-2">
          <li><strong>O.R. Number</strong></li>
          <li><strong>Amount Paid</strong></li>
          <li><strong>Date Paid</strong></li>
        </ul>
      `
  },
  {
    title: "Submit and Open in MS Word",
    image: "/images/step15.png",
    description: `
    After filling out all fields and double-checking your entries, click the <strong>Submit</strong> button.<br><br>
    This will automatically open the petition document in <strong>MS Word</strong> for formatting or layout adjustments.<br><br>
    <span class="text-blue-700 font-semibold">Note:</span> If the document doesn't open, check your MS Word installation or ask for help from staff.
  `
  },
  {
    title: "Layout and Design in MS Word",
    image: "/images/step16.png",
    description: `
    In MS Word, you can now fix the <strong>layout, spacing, and design</strong> of the document. You may bold text, adjust alignment, or add line breaks.<br><br>

    <span class="text-red-600 font-semibold">⚠ Do NOT change any data</span> such as names, dates, or details inside the document. Any corrections must be made back in the system.<br><br>

    When finished, press <code class="bg-gray-100 px-1 rounded">Ctrl + S</code> to save the document (not Save As), then close MS Word.
  `
  }
  ,

  {
    title: "Print and Generate Attachments",
    image: "/images/step16.png",
    description: `
    Once you're done with layout and formatting in MS Word, <strong>you must save the document</strong>—even if no changes were made.<br><br>

    <strong>Recommended Steps:</strong><br>
    <ol class="list-decimal ml-6 mt-2 space-y-1">
      <li>Press <code class="bg-gray-100 px-1 rounded">Ctrl + S</code> to save the Word document. <span class="text-red-600 font-semibold">Do not use "Save As".</span></li>
      <li>Close the Word document.</li>
      <li>Return to the system and click <strong>"Proceed"</strong> to fully generate all required attachments.</li>
      <li>You will then see the generated documents ready for review and printing.</li>
    </ol><br>

    <strong>Alternative (for rush cases):</strong><br>
    You may directly print the document from MS Word before saving. However, <strong>you still need to save the document afterwards</strong>, then close it and click <strong>"Proceed"</strong> to generate the attachments.<br><br>

    The system will generate the following files:
    <ul class="list-disc ml-6 mt-2">
      <li><code>record sheet.pdf</code></li>
      <li><code>endorsement.pdf</code></li>
      <li><code>notice and certificate of posting.pdf</code></li>
    </ul>
  `
  }


];
</script>