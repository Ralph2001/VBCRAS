// src/composables/useResidenceWatchers.js
import { watch } from 'vue';

export function useMarriageWatcher(formData) {


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

    watch(() => formData.groom_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.groom_residence = parts.slice(0, -1).join(', ');
            formData.groom_residence_country = parts[parts.length - 1];
        }
    });

    watch(() => formData.groom_father_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.groom_father_residence = parts.slice(0, -1).join(', ');
            formData.groom_father_residence_country = parts[parts.length - 1];
        }
    });

    watch(() => formData.groom_mother_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.groom_mother_residence = parts.slice(0, -1).join(', ');
            formData.groom_mother_residence_country = parts[parts.length - 1];
        }
    });

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

    watch(() => formData.bride_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.bride_residence = parts.slice(0, -1).join(', ');
            formData.bride_residence_country = parts[parts.length - 1];
        }
    });

    watch(() => formData.bride_father_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.bride_father_residence = parts.slice(0, -1).join(', ');
            formData.bride_father_residence_country = parts[parts.length - 1];
        }
    });

    watch(() => formData.bride_mother_residence, (newVal) => {
        if (!newVal) return;
        const parts = newVal.split('|').map(p => p.trim());
        if (parts.length >= 3) {
            formData.bride_mother_residence = parts.slice(0, -1).join(', ');
            formData.bride_mother_residence_country = parts[parts.length - 1];
        }
    });

    watch(() => formData.bride_person_who_gave_consent_residence, (newVal) => {
        if (!newVal) return;


        if (newVal.includes('|')) {
            const parts = newVal.split('|').map(p => p.trim());
            formData.bride_person_who_gave_consent_residence = parts.join(', ');
        }
    });
}
