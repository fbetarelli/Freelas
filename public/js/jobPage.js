

const addMaterialDialog = document.getElementById('addMaterialDialog')
const addPaymentDialog = document.getElementById('addPaymentDialog')
const jobDialog = document.getElementById('jobDialog')
const deleteJobDialog = document.getElementById('deleteJobDialog')

const newMaterialBtn = document.getElementById('newMaterialBtn')
const submitAddMaterial = document.getElementById('submitAddMaterial')
const submitAddPayment = document.getElementById('submitAddPayment')
const newPaymentBtn = document.getElementById('newPaymentBtn')

const editJobBtn = document.getElementById('editJobBtn')
const deleteJobBtn = document.getElementById('deleteJobBtn')

const closeAddMaterial = document.getElementById('closeAddMaterial')
const closeAddPayment = document.getElementById('closeAddPayment')
const closeJob = document.getElementById('closeJob')



newMaterialBtn.addEventListener('click', () => {
    addMaterialDialog.showModal()
})
closeAddMaterial.addEventListener('click', () => {
    addMaterialDialog.close()
})
newPaymentBtn.addEventListener('click', () => {
    addPaymentDialog.showModal()
})
closeAddPayment.addEventListener('click', () => {
    addPaymentDialog.close()
})

editJobBtn.addEventListener('click', () => {
    jobDialog.showModal()
})
closeJob.addEventListener('click', () => {
    jobDialog.close()
})
deleteJobBtn.addEventListener('click', () => {
    deleteJobDialog.showModal()
})
closeDeleteJob.addEventListener('click', () => {
    deleteJobDialog.close()
})



function formatarParaFloat(valor) {
    //retira os pontos EX: 12,99 para 12.99
    const temp = valor.replace(/\./g, '')
    const final = temp.replace(/,/g, '.')
    return (final)
}

const materialsList = document.getElementById('materialsList')
if (materialsList) {
    materialsList.addEventListener('click', (e) => {
        let btn = e.target.closest('.editMaterialButton')
        if (!btn) return;

        toggleModals(btn, 'editMaterialDialog', 'showModal')

    })
    materialsList.addEventListener('click', (e) => {
        let btn = e.target.closest('.closeEditMaterial')
        if (!btn) return;

        toggleModals(btn, 'editMaterialDialog', 'close')

    })
}
const paymentsList = document.getElementById('paymentsList')
if (paymentsList) {
    paymentsList.addEventListener('click', (e) => {
        let btn = e.target.closest('.closeEditPayment')
        if (!btn) return;

        toggleModals(btn, 'editPaymentDialog', 'close')

    })
    paymentsList.addEventListener('click', (e) => {
        let btn = e.target.closest('.editPaymentButton')
        if (!btn) return;

        toggleModals(btn, 'editPaymentDialog', 'showModal')

    })

}

function toggleModals(btn, cssselector, action) {
    let id = btn.dataset.id
    let dialog = document.querySelector(`.${cssselector}[data-id="${id}"]`)
    dialog[action]()
}

document.addEventListener('DOMContentLoaded', (e) => {
    let buttons = document.querySelectorAll('.submitForm')
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let inputs = btn.closest('.actionForm').querySelectorAll('.valueInput')
            let errMsg = btn.closest('.actionForm').querySelector('.actionError')

            inputs.forEach(element => {
                let valor = formatarParaFloat(element.value)
                if (isNaN(valor) || valor <= 0) {
                    e.preventDefault();
                    errMsg.innerHTML = 'Insira um valor válido!'
                }
            });
        })
    });
})