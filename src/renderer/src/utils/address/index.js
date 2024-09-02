
import philippines from "../philippines";


export function complete_province(country) {
    const selected_country = country || 'Philippines';

    if (selected_country !== 'Philippines') {
        console.log('Country is not Phippines so it won\'t return any value')
        return [];
    }

    let province_set = [];
    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                province_set.push(provinceName.toLowerCase());
            });
        });
    });

    return province_set
        .sort((a, b) => a.localeCompare(b))
        .map(province => province.charAt(0).toUpperCase() + province.slice(1));
}

export function complete_municipality(province) {
    const selectedProvince = province || ''

    if (selectedProvince === '') {
        console.log('No Selected Province')
        return [];
    }

    let municipalityList = [];

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName, municipality]) => {
                    if (provinceName.toLowerCase() === selectedProvince.toLowerCase()) {
                        municipalityList.push(municipalityName.toLowerCase());
                    }
                });
            });
        });
    });

    return municipalityList
        .sort((a, b) => a.localeCompare(b))
        .map(municipality => municipality.charAt(0).toUpperCase() + municipality.slice(1));
}

export function all_address() {
    let address = []
    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName, municipality]) => {
                    Object.entries(municipality.barangay_list).forEach(([index, barangay]) => {
                        address.push(`${barangay}, ${municipalityName}, ${provinceName}`.toLowerCase());
                    });
                });
            });
        });
    });

    return address
        .sort((a, b) => a.localeCompare(b))
        .map(address => address.split(', ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(', '));

}