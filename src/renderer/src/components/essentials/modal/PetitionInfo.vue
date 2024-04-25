<template>
  <div>
    <Modal titleCard :first="petition_details" :second="petition_owner">
      <template v-slot:header>
        <ModalCloseButton @click="emit('close-modal', false)" />
      </template>
      <div class="flex flex-col w-full h-full justify-center gap-2 p-2">
        <div class="">
          <LoadingBlock
            :label="isLoading ? 'Creating Document Folder' : 'Document Folder'"
            isFolder
            isBold
            :isLoading="isLoading"
            :filepath="props.folderpath"
          >
            <font-awesome-icon
              icon="fa-solid fa-folder"
              class="text-yellow-300 shadow-sm"
            />
          </LoadingBlock>
        </div>

        <div class="flex flex-col justify-center gap-2 pl-5">
          <LoadingBlock
            :label="isLoading ? 'Creating Endorsement Letter' : 'Endorsement Letter'"
            :isLoading="isLoading"
            :filepath="endorsement_letter_filepath"
          />
          <LoadingBlock
            :label="isLoading ? 'Creating Petition' : 'Petition'"
            :isLoading="isLoading"
            :filepath="petition_filepath"
          />
          <LoadingBlock
            :label="isLoading ? 'Creating Record Sheet' : 'Record Sheet'"
            :isLoading="isLoading"
            :filepath="record_sheet_filepath"
          />
          <LoadingBlock
            :label="
              isLoading
                ? 'Creating Notice of Posting and Certificate of Posting'
                : 'Notice and Certificate of Posting'
            "
            :isLoading="isLoading"
            :filepath="notice_and_certificate_posting_filepath"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoadingBlock from "../block/LoadingBlock.vue";
import Modal from "../../client/modal/Modal.vue";
import ModalCloseButton from "../../client/modal/ModalCloseButton.vue";

const emit = defineEmits(["close-modal"]);

const props = defineProps({
  folderpath: {
    type: String,
    default: "",
  },
  isProccessing: {
    type: Boolean,
    default: false,
  },
  petition_details: {
    type: String,
    default: "",
  },
  petition_owner: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

let endorsement_letter_filepath = props.folderpath + "Endorsement Letter.docx";
let petition_filepath = props.folderpath + "Petition.docx";
let record_sheet_filepath = props.folderpath + "Record Sheet.docx";
let notice_and_certificate_posting_filepath =
  props.folderpath + "Cert. of Posting and Notice of Posting.docx";
</script>

<style lang="scss" scoped></style>
