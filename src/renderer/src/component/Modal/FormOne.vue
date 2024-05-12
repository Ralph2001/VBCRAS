<template>
    <Modal medium label="Create a new Document">
        <template v-slot:header>
            <ModalCloseButton @click="closeModal" />
        </template>
        <div class="flex flex-col  sm:px-6 md:px-4 h-max  w-full gap-4 relative bg-blue-50/50 font-medium"
            :style="noise">
            <div class="h-full flex flex-col px-10 py-4">
                <div
                    class="w-full grid grid-cols-3 mb-6  rounded items-center justify-evenly border shadow-sm font-medium">
                    <ButtonBorderless label="Form 1A" @click="toggleForm('1A')" :isActive="selectedForm === '1A'" />
                    <ButtonBorderless label="Form 1B" @click="toggleForm('1B')" :isActive="selectedForm === '1B'" />
                    <ButtonBorderless label="Form 1C" @click="toggleForm('1C')" :isActive="selectedForm === '1C'" />
                </div>

                <div class="flex items-center pl-10" v-if="selectedForm === '1A'">
                    <FormCheckbox label="With Authentication (Abroad)" />
                </div>
                <div class="flex items-center justify-end">
                    <InputforForm middle />
                </div>
                <p class="px-9 italic font-semibold font-serif">TO WHOM IT MAY CONCERN:</p>


                <div v-if="selectedForm === '1A'">
                    <div class="px-10 mt-5">
                        <p class=" relative text-pretty  tracking-widest indent-8 leading-8 text-gray-900">We
                            certify that
                            among
                            others,
                            the
                            following
                            facts of
                            birth appear in our
                            Register of Births on page
                            <InputforForm middle width="6rem" bold />
                            of book number
                            <InputforForm middle width="6rem" bold /> .
                        </p>
                    </div>

                    <div class="h-full flex flex-col sm:px-[2rem] md:lg:px-[5rem] mt-6 gap-2 ">
                        <InputLabel label="Registry Number">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Date of Registration">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Name of Child">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Sex">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Age">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Date of Birth">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Place of Birth">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Name of Mother">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Citizenship of Mother">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Name of Father">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Citizenship of Father">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Date of Marriage">
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Place of Marriage of Parents">
                            <InputforForm width="100%" />
                        </InputLabel>

                    </div>
                </div>

                <div v-if="selectedForm === '1B'">
                    <div class="mt-10 px-10">
                        <p class="indent-8 text-pretty leading-8 tracking-wider text-justify">We certify that this
                            office
                            has
                            no
                            record of birth of
                            <InputforForm width="15rem" middle /> who
                            is
                            alleged
                            to have born on
                            <InputforForm width="10rem" middle />. in this municipality. Hence, we cannot issue, as
                            requested, a true
                            copy of his/her Certificate of Live Birth or transcription from the Register of Births.
                        </p>
                    </div>

                    <div class="mt-10 px-10 ">
                        <p class="indent-8 text-pretty tracking-wider text-justify"> We also certify that the
                            records of
                            births for the year
                            <InputforForm width="6rem" middle /> are
                            still
                            intact in the
                            archives of
                            this office.
                        </p>
                    </div>
                </div>

                <div v-if="selectedForm === '1C'">
                    <div class="mt-10 px-10">
                        <p class="indent-8 text-pretty leading-8 tracking-wider text-justify"> We certify that the
                            records
                            of
                            births
                            filed in the archives of this office include those, which were registered from
                            <InputforForm width="6rem" /> to
                            present.
                            However, the records of births during period
                            <InputforForm width="6rem" /> to
                            <InputforForm width="6rem" /> were totally destroyed by
                            <InputforForm width="20rem" />
                            Hence, we cannot issue as requested, a true transcription from the Register of Births or
                            true
                            copy of the Certification of Live Birth of
                            <InputforForm width="15rem" /> who is alleged to have born on
                            <InputforForm width="10rem" /> in this municipality.
                        </p>
                    </div>

                    <div class="mt-10 px-10 flex flex-col gap-2 w-full opacity-50">
                        <div class="w-[calc(100%-50px)]  ml-auto h-[1rem] bg-gray-200 rounded-lg "></div>
                        <div class="w-full h-[1rem] bg-gray-200 rounded-lg "></div>
                        <div class="w-full h-[1rem] bg-gray-200 rounded-lg "></div>
                        <div class="w-[calc(100%-400px)]  h-[1rem] bg-gray-200 rounded-lg "></div>
                    </div>
                </div>

                <div class="flex items-center justify-center mt-10 relative text-nowrap">
                    This certification is issued to <div class="px-2">
                        <InputforForm width="15rem" middle />
                    </div> upon his/her request.
                </div>

                <div
                    class="flex sm:flex-col md:lg:flex-row justify-between items-start w-full  mt-20 relative text-nowrap gap-2  px-2">
                    <div class="flex flex-col items-start sm:gap-2 md:lg:gap-10">
                        <p class="italic">Verified by:</p>
                        <div class="sm:pl-0 md:lg:pl-20 flex flex-col items-center gap-[0.10rem]">
                            <InputforForm width="20rem" middle />
                            <InputforForm width="20rem" middle italic unbordered isTransparent />
                        </div>
                    </div>
                    <div class="flex flex-col items-center">
                        <InputforForm middle width="20rem" />
                        <p class="italic font-medium text-sm">Municipal Civil Registrar</p>
                    </div>
                </div>

                <div class="flex  flex-col px-2 gap-2 w-[20rem] mt-5">
                    <InputLabel label="Amount Paid">
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="O.R. Number">
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date Paid">
                        <InputforForm width="100%" />
                    </InputLabel>
                </div>

            </div>

        </div>
        <template v-slot:footer>
            <div class="h-full flex items-center justify-center w-full">
                <button type="button" @click="!isSubmitted ? submitForm() : openFile(filepath)"
                    :class="!isSubmitted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'"
                    class="py-2 px-4 tracking-wide ml-auto flex items-center text-sm font-medium text-white   rounded  active:scale-95 transition-all  shadow-sm hover:text-white focus:z-10 ">
                    <Loading v-if="isLoading" />

                    {{ !isSubmitted ? 'Submit' : 'Open File' }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup>

import { ref } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import ButtonBorderless from '../FormPageComponents/ButtonBorderless.vue';
import FormCheckbox from '../FormPageComponents/FormCheckbox.vue';
import InputLabel from '../FormPageComponents/InputLabel.vue';
import InputforForm from '../FormPageComponents/InputforForm.vue';


const selectedForm = ref('2A')

function toggleForm(formId) {
    selectedForm.value = (selectedForm.value === formId) ? selectedForm.value : formId;
}

const emit = defineEmits(['close', 'submit']);
const closeModal = () => {
    emit('close');
};

const noise = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAABKCAYAAAD0UHdaAAAAAXNSR0IArs4c6QAAG+hJREFUaENd209olen1B/D7h+u1Tl2InYXXxSQuLMzUVTILO4VJQCwMxkVrBFvaJpsEBttCKyO2C+OiFQcL/SMDySaZllZIbBdGBipCMtCpi0lWdgbqwmQWxsVUXNihvV7umx+f0+eE8LsgJjf3fd/nOc853/M933NufX5+fu/ExER/cHCwOTExUZuZmelPTU3VZmdna6urq82bN2/2Z2dnm7VarXf27NnaxYsXG8+fP2++9957vUePHjWuX7/e/Pzzz3vvvPNO69133+29/PLLrQ8//NB9erOzs425uTnXVEeOHGkfPHiwunr1atx/eHi4ub29Hff8/PPPW6urq72tra32P//5z+rKlSu1o0eP9l1rHWNjY61Op9MdGhpqnD9/vnn//n1ral25cqV68803ayMjI73R0dHW9evX+/WhoaF9T58+rS5dutQ4evRoNTo62ltcXKwtLS3V3nrrrdaLFy/69+7dq2zkyZMnrR/+8IfV7373u8apU6eqpaWl3r1799pzc3Pd+fn51sTERG94eLhRq9VaU1NTvampqWpzc7M1OTlZ+8EPflD7y1/+4rrezZs3m+fOnetfvXqVoWobGxu9Wq3WrtfrfvVza21trXf69OnWoUOHemtra5X7MswHH3zQevDgQX95ebnV7Xatt8aQ1ru4uNiyodatW7eaH3/8ce9LX/pSe2xszIaqP/zhD203czqbm5u1999/v3bq1Km+z9fr9e729najXq9XVjAzM9Pyf/m5t729XavX642NjY1mu91ufOc736lefvllD433nNLc3FxzamrK/9XKykrLwmZnZ92/dufOndio5+7Zs6fBOH7nGdZhQ0eOHKlsYHV1teYQhoaG2rOzs7364uJi8xvf+AYrV5cvX+67cHh4uDUzM1OzoeHh4WpgYKD1+uuv9/773/+2b9++3WX1wcHBOEnXTk9P1773ve91r1275uFu0XLa3NImvDExMdF0Svv3728MDQ1119fXG8PDw/H+t7/97cb6+nrFTTc2NmKRk5OTTsZnK2757rvvxvvCgyt2Op3Wn//852rPnj39Fy9eNL/44oveiRMnGvWpqanW8ePHmwMDA3ZaW15e5hZdPvn222/3nj17xtWaYsvJWbSH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'

</script>

<style lang="scss" scoped></style>