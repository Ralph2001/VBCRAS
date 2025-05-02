
import { computed, ref } from 'vue';
import { municipalityProvinceAddress } from '../../utils/Address';

const municipality_with_province = ref(municipalityProvinceAddress())

const preprocessedMunicipality = computed(() => {
    return municipality_with_province.value.map(entry => {
        const parts = entry.split('|').map(p => p.trim());
        return {
            original: entry,
            parts,
            partsUpper: parts.map(p => p.toUpperCase())
        };
    });
});


function filterMunicipalitySuggestions(searchTerm) {
    if (!searchTerm) return [];

    const inputParts = searchTerm.split(/,\s*/).map(part => part.trim().toUpperCase());
    const mergedSuggestions = new Set();

    for (const entry of preprocessedMunicipality.value) {
        let matchedIndex = -1;
        let matchedInputIndex = -1;

        for (let i = 0; i < inputParts.length; i++) {
            const index = entry.partsUpper.indexOf(inputParts[i]);
            if (index !== -1) {
                matchedIndex = index;
                matchedInputIndex = i;
                break;
            }
        }

        if (matchedIndex === -1) continue;

        const mergedParts = [
            ...inputParts.slice(0, matchedInputIndex + 1),
            ...entry.parts.slice(matchedIndex + 1)
        ];
        mergedSuggestions.add(mergedParts.join(' | '));
    }

    return Array.from(mergedSuggestions);
}

export function useGroomResidenceSuggestions(formData) {
    function formatCombinedResidence(residence, country) {
        if (!residence) return null;
        const formatted = residence.replace(/,\s*/g, ' | ');
        return `${formatted}`;
    }

    const groomSuggestions = computed(() => {
        return filterMunicipalitySuggestions(formData.groom_residence);
    });

    const groomfatherSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(formData.groom_father_residence);

        // Add groom's residence
        const groomCombined = formatCombinedResidence(
            formData.groom_residence
        );
        if (groomCombined) suggestions.push(groomCombined);

        return [...new Set(suggestions)];
    });

    const groommotherSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(formData.groom_mother_residence);

        // Add groom's residence
        const groomCombined = formatCombinedResidence(
            formData.groom_residence
        );
        if (groomCombined) suggestions.push(groomCombined);

        // Add father's residence
        const fatherCombined = formatCombinedResidence(
            formData.groom_father_residence
        );
        if (fatherCombined) suggestions.push(fatherCombined);

        return [...new Set(suggestions)];
    });

    const groomconsentSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(
            formData.groom_person_who_gave_consent_residence
        );

        // Add all relevant residences
        [formatCombinedResidence(formData.groom_residence),
        formatCombinedResidence(formData.groom_father_residence),
        formatCombinedResidence(formData.groom_mother_residence)
        ].forEach(combined => {
            if (combined) suggestions.push(combined);
        });

        return [...new Set(suggestions)];
    });

    return {
        groomSuggestions,
        groomfatherSuggestions,
        groommotherSuggestions,
        groomconsentSuggestions
    };
}


export function useBrideResidenceSuggestions(formData) {
    function formatCombinedResidence(residence, country) {
        if (!residence) return null;
        const formatted = residence.replace(/,\s*/g, ' | ');
        return `${formatted}`;
    }

    const brideSuggestions = computed(() => {
        return filterMunicipalitySuggestions(formData.bride_residence);
    });

    const bridefatherSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(formData.bride_father_residence);

        // Add bride's residence
        const brideCombined = formatCombinedResidence(
            formData.bride_residence
        );
        if (brideCombined) suggestions.push(brideCombined);

        return [...new Set(suggestions)];
    });

    const bridemotherSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(formData.bride_mother_residence);

        // Add bride's residence
        const brideCombined = formatCombinedResidence(
            formData.bride_residence
        );
        if (brideCombined) suggestions.push(brideCombined);

        // Add father's residence
        const fatherCombined = formatCombinedResidence(
            formData.bride_father_residence
        );
        if (fatherCombined) suggestions.push(fatherCombined);

        return [...new Set(suggestions)];
    });

    const brideconsentSuggestions = computed(() => {
        const suggestions = filterMunicipalitySuggestions(
            formData.bride_person_who_gave_consent_residence
        );

        // Add all relevant residences
        [formatCombinedResidence(formData.bride_residence),
        formatCombinedResidence(formData.bride_father_residence),
        formatCombinedResidence(formData.bride_mother_residence)
        ].forEach(combined => {
            if (combined) suggestions.push(combined);
        });

        return [...new Set(suggestions)];
    });

    return {
        brideSuggestions,
        bridefatherSuggestions,
        bridemotherSuggestions,
        brideconsentSuggestions
    };
}
