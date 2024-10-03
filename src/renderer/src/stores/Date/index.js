import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'

export const useDate = defineStore('dates', {
    state: () => ({
        holidays: [],
        date_rules: [],
        notice: '',
        certificate_start: '',
        certificate_end: '',
        date_issued: '',
        date_granted: '',
    }),
    actions: {
        async create_date_rules(data) {
            try {

                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')

                const response = await axios.post(
                    `http://${hostAdd}:1216/create-date-rule`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokenStr}`
                        }
                    }
                )
                if (response.status === 201) {
                    this.get_date_rules()
                    return true
                }
                else { return false }
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async get_date_rules() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')

                const response = await axios.get(
                    `http://${hostAdd}:1216/get-date-rules`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.date_rules = response.data
                return response.data

            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },
        async update_date_rules() {
            try {
                const id = 1
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')

                const response = await axios.get(
                    `http://${hostAdd}:1216/update-date-rules/${id}`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.holidays = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },


        async get_holidays() {
            try {
                const hostAdd = localStorage.getItem('host')
                let tokenStr = localStorage.getItem('token')

                const response = await axios.get(
                    `http://${hostAdd}:1216/get-holidays`,
                    { headers: { Authorization: `Bearer ${tokenStr}` } }
                )
                this.holidays = response.data
            } catch (error) {
                console.error('Error fetching data:', error)
                this.router.push('/login')
            }
        },

        isHoliday(date) {
            const formattedDate = format(date, 'MM/dd'); // Adjust the format as needed
            return this.holidays.includes(formattedDate);
        },

        now() {
            const date = new Date()
            return format(date, 'yyyy-MM-dd')
        },

        getNextDate(date, days_to_add, exclude_holiday, exclude_weekend) {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days_to_add);

            if (exclude_weekend) {
                while (newDate.getDay() === 0 || newDate.getDay() === 6) {
                    newDate.setDate(newDate.getDate() + 1);
                }
            }
            // if (exclude_holiday && this.isHoliday(newDate)) {
            //     newDate.setDate(newDate.getDate() + 1); 

            //     while (exclude_holiday && this.isHoliday(newDate)) {
            //         newDate.setDate(newDate.getDate() + 1);
            //     }
            // }

            return format(newDate, 'yyyy-MM-dd');
        },

        async get_all_dates() {
            this.get_date_rules()
            this.get_date_notice()
            this.get_certificate_start()
            this.get_certificate_end()
            this.get_date_issued()
            this.get_date_granted()
        },


        async get_date_notice() {
            const days_to_add = 1
            const notice = this.getNextDate(this.now(), days_to_add, true, true);
            this.notice = notice
        },
        async get_certificate_start() {
            const days_to_add = 1
            const certificate_start = this.getNextDate(this.notice, days_to_add, true, true);
            this.certificate_start = certificate_start
        },
        async get_certificate_end() {
            const days_to_add = 10
            const certificate_end = this.getNextDate(this.certificate_start, days_to_add, true, true);
            this.certificate_end = certificate_end
        },
        async get_date_issued() {
            const days_to_add = 1
            const date_issued = this.getNextDate(this.certificate_end, days_to_add, true, true);
            this.date_issued = date_issued
        },
        async get_date_granted() {
            const days_to_add = 3
            const date_granted = this.getNextDate(this.date_issued, days_to_add, true, true);
            this.date_granted = date_granted
        },
    }
})
