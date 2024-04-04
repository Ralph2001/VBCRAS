import { format } from 'date-fns';
import { useDateFormat, useNow } from '@vueuse/core';

export function now_date() {
    return useDateFormat(useNow(), 'MMMM DD, YYYY');
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
        return format(newDate, 'MMMM dd, yyyy');
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
        return format(newDate, 'MMMM dd, yyyy');
    };
    return getNextDate(add_date_notice());
}

// The end date can fall on Saturday or Sunday.
export function add_date_certificate_end() {
    const getNextDate = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 10);
        return format(newDate, 'MMMM dd, yyyy');
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
        return format(newDate, 'MMMM dd, yyyy');
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
        return format(newDate, 'MMMM dd, yyyy');
    };
    return getNextDate(add_date_issued());
}
