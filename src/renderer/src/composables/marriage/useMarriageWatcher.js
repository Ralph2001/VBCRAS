// src/composables/useResidenceWatchers.js
import { useDebounceFn } from '@vueuse/core';
import { watch } from 'vue';

export function useMarriageWatcher(formData) {

    // Watch Middle Name and Last Name 

    watch(() => formData.groom_last_name, (newVal) => {
        if (!newVal) return;
        formData.groom_father_last_name = newVal
    });
    watch(() => formData.groom_middle_name, (newVal) => {
        if (!newVal) return;
        formData.groom_mother_last_name = newVal
    });

    watch(() => formData.bride_last_name, (newVal) => {
        if (!newVal) return;
        formData.bride_father_last_name = newVal
    });
    watch(() => formData.bride_middle_name, (newVal) => {
        if (!newVal) return;
        formData.bride_mother_last_name = newVal
    });



    // If dissolved

    watch(() => formData.groom_place_dissolved_municipality, (newVal) => {
        if (!newVal) return;

        const parts = newVal.split('|').map(p => p.trim());

        if (parts.length === 3) {
            formData.groom_place_dissolved_municipality = parts[0];
            formData.groom_place_dissolved_province = parts[1];
            formData.groom_place_dissolved_country = parts[2];
        }
    });

    watch(() => formData.bride_place_dissolved_municipality, (newVal) => {
        if (!newVal) return;

        const parts = newVal.split('|').map(p => p.trim());

        if (parts.length === 3) {
            formData.bride_place_dissolved_municipality = parts[0];
            formData.bride_place_dissolved_province = parts[1];
            formData.bride_place_dissolved_country = parts[2];
        }
    });


    /**
     * Groom Residence Wathcer
     */

    watch(() => formData.groom_municipality, (newVal) => {
        if (!newVal) return;

        const parts = newVal.split('|').map(p => p.trim());

        if (parts.length === 3) {
            formData.groom_municipality = parts[0];
            formData.groom_province = parts[1];
            formData.groom_country = parts[2];
        }
    });


    const formatResidence = useDebounceFn((key) => {
        const val = formData[key];
        if (!val.includes('|')) return; // Only transform if there's a pipe
        formData[key] = val.split('|').map(p => p.trim()).join(', ');
    }, 50); // waits 500ms after user stops typing

    watch(() => formData.groom_residence, () => formatResidence('groom_residence'));
    watch(() => formData.groom_father_residence, () => formatResidence('groom_father_residence'));
    watch(() => formData.groom_mother_residence, () => formatResidence('groom_mother_residence'));


    watch(() => formData.groom_person_who_gave_consent_residence, (newVal) => {
        if (!newVal) return;


        if (newVal.includes('|')) {
            const parts = newVal.split('|').map(p => p.trim());
            formData.groom_person_who_gave_consent_residence = parts.join(', ');
        }
    });

    /**
     * Bride Residence Wathcer
     */

    watch(() => formData.bride_municipality, (newVal) => {
        if (!newVal) return;

        const parts = newVal.split('|').map(p => p.trim());

        if (parts.length === 3) {
            formData.bride_municipality = parts[0];
            formData.bride_province = parts[1];
            formData.bride_country = parts[2];
        }
    });

    const formatBrideResidence = useDebounceFn((key) => {
        const val = formData[key];
        if (!val.includes('|')) return; // Only transform if there's a pipe
        formData[key] = val.split('|').map(p => p.trim()).join(', ');
    }, 50); // waits 500ms after user stops typing

    watch(() => formData.bride_residence, () => formatBrideResidence('bride_residence'));
    watch(() => formData.bride_father_residence, () => formatBrideResidence('bride_father_residence'));
    watch(() => formData.bride_mother_residence, () => formatBrideResidence('bride_mother_residence'));



    watch(() => formData.bride_person_who_gave_consent_residence, (newVal) => {
        if (!newVal) return;


        if (newVal.includes('|')) {
            const parts = newVal.split('|').map(p => p.trim());
            formData.bride_person_who_gave_consent_residence = parts.join(', ');
        }
    });
}
