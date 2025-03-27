import philippines from "../Philippines";

export function complete_province(country) {
    const selected_country = country || 'Philippines';

    if (selected_country !== 'Philippines') {
        console.log('Country is not Philippines so it won\'t return any value');
        return [];
    }

    let province_set = [];
    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName]) => {
                province_set.push(provinceName.toLowerCase());
            });
        });
    });

    return province_set
        .sort((a, b) => a.localeCompare(b))
        .map(province =>
            province.replace(/([A-Za-z]+)(?:\s*|\s*\(\s*)([A-Za-z\s]*)(\))?/g, (match, p1, p2, p3) => {
                const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                return `${capitalizeWords(p1)}${p2 ? ` ${capitalizeWords(p2)}` : ''}`;
            })
        );
}

export function complete_municipality(province) {
    const selectedProvince = province || '';

    if (selectedProvince === '') {
        console.log('No Selected Province');
        return [];
    }

    let municipalityList = [];

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    if (provinceName.toLowerCase() === selectedProvince.toLowerCase()) {
                        municipalityList.push(municipalityName.toLowerCase());
                    }
                });
            });
        });
    });

    return municipalityList
        .sort((a, b) => a.localeCompare(b))
        .map(municipality =>
            municipality.replace(/([A-Za-z]+)(?:\s*|\s*\(\s*)([A-Za-z\s]*)(\))?/g, (match, p1, p2) => {
                const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                return `${capitalizeWords(p1)}${p2 ? ` ${capitalizeWords(p2)}` : ''}`;
            })
        );
}

export function complete_municipality_with_province(province) {
    const selectedProvince = province || '';

    if (selectedProvince === '') {
        console.log('No Selected Province');
        return [];
    }

    let municipalitywithProvinceList = [];

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    if (provinceName.toLowerCase() === selectedProvince.toLowerCase()) {
                        municipalitywithProvinceList.push(`${municipalityName}, ${provinceName}`.toLowerCase());
                    }
                });
            });
        });
    });

    return municipalitywithProvinceList
        .sort((a, b) => a.localeCompare(b))
        .map(item =>
            item.split(', ').map(part =>
                part.replace(/([A-Za-z]+)(?:\s*|\s*\(\s*)([A-Za-z\s]*)(\))?/g, (match, p1, p2) => {
                    const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    return `${capitalizeWords(p1)}${p2 ? ` (${capitalizeWords(p2)})` : ''}`;
                })
            ).join(', ')
        );
}

export function complete_municipality_with_province_with_words(province) {
    const selectedProvince = province || '';

    if (selectedProvince === '') {
        console.log('No Selected Province');
        return [];
    }

    let municipalityWithProvinceList = [];

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    if (provinceName.toLowerCase() === selectedProvince.toLowerCase()) {
                        municipalityWithProvinceList.push(`MUNICIPALITY OF ${municipalityName}`);
                    }
                });
            });
        });
    });

    return municipalityWithProvinceList
        .sort((a, b) => a.localeCompare(b))

}



export function all_address() {
    let address = [];
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
        .map(addr =>
            addr.split(', ').map(part =>
                part.replace(/([A-Za-z]+)(?:\s*|\s*\(\s*)([A-Za-z\s]*)(\))?/g, (match, p1, p2) => {
                    const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    return `${capitalizeWords(p1)}${p2 ? ` ${capitalizeWords(p2)}` : ''}`;
                })
            ).join(', ')
        );
}

// Roman numeral validation helper
function isRomanNumeral(str) {
    return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str);
}

export function formMunicipalityProvinceAddress() {
    let address = [];

    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    address.push(`${municipalityName}, ${provinceName}`);
                });
            });
        });
    });

    address.sort((a, b) => a.localeCompare(b));

    return address.map(addr => {
        return addr.split(/,\s*/).map(part => {
            return part.trim()
                      .split(' ')
                      .map(word => {
                          const upperWord = word.toUpperCase();
                          return isRomanNumeral(upperWord) 
                              ? upperWord 
                              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                      })
                      .join(' ');
        }).join(', ');
    });
}

export function municipalityProvinceAddress() {
    let address = [];

    // Collect municipality and province names without unnecessary transformations
    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    // Push formatted data without unnecessary transformations
                    address.push(`${municipalityName}|${provinceName}|PHILIPPINES`);
                });
            });
        });
    });

    // Sort the list alphabetically
    address.sort((a, b) => a.localeCompare(b));

    // Capitalize and clean up the names
    return address.map(addr => {
        return addr.split('|').map(part => {
            // Capitalize each part of the string and join them
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join(' | ');
    });
}

export function mun_prov() {
    let address = [];

    // Collect municipality and province names without unnecessary transformations
    philippines.forEach(regions => {
        Object.values(regions).forEach(region => {
            Object.entries(region.province_list).forEach(([provinceName, province]) => {
                Object.entries(province.municipality_list).forEach(([municipalityName]) => {
                    // Push formatted data without unnecessary transformations
                    address.push(`${municipalityName}|${provinceName}`);
                });
            });
        });
    });

    // Sort the list alphabetically
    address.sort((a, b) => a.localeCompare(b));

    // Capitalize and clean up the names
    return address.map(addr => {
        return addr.split('|').map(part => {
            // Capitalize each part of the string and join them
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join(' | ');
    });
}
