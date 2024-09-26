import { format } from 'date-fns';
import { useDateFormat, useNow } from '@vueuse/core';

export function now_date() {
    const newDate = new Date();
    return format(newDate, 'yyyy-MM-dd');

}

// The end date cannot fall on Saturday or Sunday.
export function add_date_notice() {
    const today = useNow();
    //    Tue Apr 02 2024 11:21:39 GMT+0800 (Taipei Standard Time)

    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        while (newDate.getDay() === 0 || newDate.getDay() === 6) {
            newDate.setDate(newDate.getDate() + 1);
        }
        return format(newDate, 'yyyy-MM-dd');
    };
    return getNextDate(today.value);
}

// The end date cannot fall on Saturday or Sunday.
export function add_date_certificate_start() {
    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        while (newDate.getDay() === 0 || newDate.getDay() === 6) {
            newDate.setDate(newDate.getDate() + 1);
        }
        return format(newDate, 'yyyy-MM-dd');
    };
    return getNextDate(add_date_notice());
}

// The end date can fall on Saturday or Sunday.
export function add_date_certificate_end() {
    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 10);
        return format(newDate, 'yyyy-MM-dd');
    };
    return getNextDate(add_date_certificate_start());
}

// The end date cannot fall on Saturday or Sunday.
export function add_date_issued() {
    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        while (newDate.getDay() === 0 || newDate.getDay() === 6) {
            newDate.setDate(newDate.getDate() + 1);
        }
        return format(newDate, 'yyyy-MM-dd');
    };
    return getNextDate(add_date_certificate_end());
}

// The end date cannot fall on Saturday or Sunday.
export function add_date_granted() {
    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 3);
        while (newDate.getDay() === 0 || newDate.getDay() === 6) {
            newDate.setDate(newDate.getDate() + 1);
        }
        return format(newDate, 'yyyy-MM-dd');
    };
    return getNextDate(add_date_issued());
}


// Function to calculate publication start date
export function add_publication_start() {
    const today = useNow();
    const newDate = new Date(today.value);
    const publicationStart = new Date();

    const dayOfWeek = newDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday to Thursday
        // Start the publication from next Sunday
        const daysUntilNextSunday = (7 - dayOfWeek) % 7;
        publicationStart.setDate(newDate.getDate() + daysUntilNextSunday);
    } else if (dayOfWeek === 5) { // Friday
        publicationStart.setDate(newDate.getDate() + 1); // Next Saturday
    } else if (dayOfWeek === 6) { // Saturday
        publicationStart.setDate(newDate.getDate() + 1); // Next Sunday
    }

    return format(publicationStart, 'yyyy-MM-dd');
}

// Function to calculate publication end date
export function add_publication_end() {
    const publicationStart = add_publication_start();
    const startDate = new Date(publicationStart);
    const publicationEnd = new Date(startDate);
    publicationEnd.setDate(startDate.getDate() + 13); // 2 weeks later

    return format(publicationEnd, 'yyyy-MM-dd');
}