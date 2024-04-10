import { computed, ref, toValue, watchEffect } from 'vue'
import philippines from '../utils/philippines'

const address = philippines

export function useAddress(pro) {
    const region = ref('01')
    const petitioner_province = ref('')
    const petitioner_city = ref('')

    const fetchData = () => {
        petitioner_province.value = toValue(pro)[0]
        petitioner_city.value = toValue(pro)[1]
    }

    const provinces = computed(() => {
        return [
            ...new Set(address.map((data) => data[region.value].province_list)),
        ].sort((a, b) => a - b)
    })

    const municipality = computed(() => {
        const selectedProvince = petitioner_province.value
        if (!selectedProvince) {
            return []
        }
        return (
            [
                ...new Set(
                    address.map(
                        (data) =>
                            data[region.value].province_list[selectedProvince]
                                .municipality_list
                    )
                ),
            ].sort((a, b) => a - b) || []
        )
    })

    const barangay = computed(() => {
        const selectedProvince = petitioner_province.value
        const selectedMunicipality = petitioner_city.value
        if (!selectedProvince || !selectedMunicipality) {
            return []
        }
        return (
            [
                ...new Set(
                    address.map(
                        (data) =>
                            data[region.value].province_list[selectedProvince]
                                .municipality_list[selectedMunicipality]
                                .barangay_list
                    )
                ),
            ].sort((a, b) => a - b) || []
        )
    })

    //Province and Municipality only
    const at_province = computed(() => {
        return [
            ...new Set(address.map((data) => data[region.value].province_list)),
        ].sort((a, b) => a - b)
    })

    const at_city = computed(() => {
        const selectedProvince = petitioner_province.value
        if (!selectedProvince) {
            return []
        }
        return (
            [
                ...new Set(
                    address.map(
                        (data) =>
                            data[region.value].province_list[selectedProvince]
                                .municipality_list
                    )
                ),
            ].sort((a, b) => a - b) || []
        )
    })

    watchEffect(() => {
        fetchData()
    })
    return { provinces, municipality, barangay, at_province, at_city }
}
