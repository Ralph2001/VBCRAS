// src/composables/usePrint.js
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

export function usePrint(active_pdf_link, active_pdf, count) {
    const print = ref(false)
    const isselectPage = ref(false)
    const printBase64 = ref(null)
    const isSelectPrintMethodOpen = ref(false)
    const selectedPrintMethod = ref(null)
    const target = ref(null)

    const localStorageKey = 'selectedPrintMethod'

    const printMethods = [
        {
            id: 'method1',
            name: 'Most Accurate Printing',
            description: 'Time consuming, ideal for precise layouts.',
            icon: 'fa-solid fa-print'
        },
        {
            id: 'method2',
            name: 'Accurate',
            description: 'Sometimes multi-page documents are not selectable.',
            icon: 'fa-solid fa-print'
        },
        {
            id: 'method3',
            name: 'Easy to Use',
            description: 'Some printers have inaccurate page sizes.',
            icon: 'fa-solid fa-print'
        }
    ]

    onClickOutside(target, () => {
        isSelectPrintMethodOpen.value = false
    })

    const managePrinterMethod = () => {
        console.log('Managing printer method')
        console.log(isSelectPrintMethodOpen.value)

        isSelectPrintMethodOpen.value = !isSelectPrintMethodOpen.value
        console.log(isSelectPrintMethodOpen.value)
    }

    const selectPrintMethod = (method) => {
        console.log(`Selected print method: ${method.name}`)
        isSelectPrintMethodOpen.value = false
        selectedPrintMethod.value = method.id
    }

    const maxPageRange = computed(() => {
        if (active_pdf.value === 'Petition' || active_pdf.value === 'Posting') {
            return 2
        }
        return 1
    })

    const printPDF = async () => {
        printBase64.value = active_pdf_link.value
        console.log(selectedPrintMethod.value)
        if (!selectedPrintMethod.value) return

        if (selectedPrintMethod.value === 'method1') {
            console.log(`Using ${selectedPrintMethod.value} printing method`)
            try {
                await window.LocalCivilApi.printPDF(
                    printBase64.value,
                    '',
                    '',
                    selectedPrintMethod.value
                )
            } catch (error) {
                console.error('Printing failed:', error)
            }
        } else if (selectedPrintMethod.value === 'method2') {
            console.log('[DEBUG] Count Number', count.value)
            if (count.value > 1) {
                isselectPage.value = true

                console.log('Using Accurate but needed selected page.')
                return
            }
            try {
                await window.LocalCivilApi.printPDF(
                    printBase64.value,
                    '',
                    '',
                    selectedPrintMethod.value
                )
            } catch (error) {
                console.error('Printing failed:', error)
            }
        } else if (selectedPrintMethod.value === 'method3') {
            print.value = true
            console.log('Using Easy to Use printing method')
        }
    }

    const handleKeydown = (event) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault()
            printPDF()
        }
    }

    onMounted(() => {
        const storedMethod = localStorage.getItem(localStorageKey)
        selectedPrintMethod.value = storedMethod || 'method2'
        window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown)
    })

    watch(selectedPrintMethod, (newValue) => {
        if (newValue) {
            localStorage.setItem(localStorageKey, newValue)
        } else {
            localStorage.removeItem(localStorageKey)
        }
    })

    return {
        print,
        isselectPage,
        printBase64,
        isSelectPrintMethodOpen,
        selectedPrintMethod,
        target,
        printMethods,
        maxPageRange,
        managePrinterMethod,
        selectPrintMethod,
        printPDF
    }
}
