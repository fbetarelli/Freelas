

const addMaterialDialog = document.getElementById('addMaterialDialog')
const addPaymentDialog = document.getElementById('addPaymentDialog')
const jobDialog = document.getElementById('jobDialog')
const deleteJobDialog = document.getElementById('deleteJobDialog')

const newMaterialBtn = document.getElementById('newMaterialBtn')
const submitAddMaterial = document.getElementById('submitAddMaterial')
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

unitaryVal = document.getElementById('addUnitaryVal');
const addMaterialError = document.getElementById('addMaterialError');
submitAddMaterial.addEventListener('click', (e) => {
    if (isNaN(formatarParaFloat(unitaryVal.value))) {
        e.preventDefault();
        addMaterialError.innerHTML = "Insira um valor unitário válido!"

    } else {
        addMaterialError.innerHTML = ""
    }
})
/*
paymentValue = document.getElementById('paymentValue');
const addPaymentError = document.getElementById('addPaymentError');
submitAddPayment.addEventListener('click', (e) => {
    if (isNaN(formatarParaFloat(paymentValue.value))) {
        e.preventDefault();
        addPaymentError.innerHTML = "Insira um valor válido!"

    } else {
        addPaymentError.innerHTML = ""
    }
})
*/
function formatarParaFloat(valor) {
    //retira os pontos EX: 12,99 para 12.99
    const temp = valor.replace(/\./g, '')
    const final = temp.replace(/,/g, '.')
    return (final)
}

const materialsList = document.getElementById('materialsList')
materialsList.addEventListener('click', (e) => {
    let btn = e.target.closest('.editMaterialButton')
    if (!btn) return;

    let id = btn.dataset.id
    dialog = document.querySelector(`.editMaterialDialog[data-id="${id}"]`)
    dialog.showModal()

})
materialsList.addEventListener('click', (e) => {
    let btn = e.target.closest('.closeEditMaterial')
    if (!btn) return;

    let id = btn.dataset.id
    dialog = document.querySelector(`.editMaterialDialog[data-id="${id}"]`)
    dialog.close()

})
const paymentsList = document.getElementById('paymentsList')
paymentsList.addEventListener('click', (e) => {
    let btn = e.target.closest('.closeEditPayment')
    if (!btn) return;

    let id = btn.dataset.id
    dialog = document.querySelector(`.editPaymentDialog[data-id="${id}"]`)
    dialog.close()

})
paymentsList.addEventListener('click', (e) => {
    let btn = e.target.closest('.editPaymentButton')
    if (!btn) return;

    let id = btn.dataset.id
    dialog = document.querySelector(`.editPaymentDialog[data-id="${id}"]`)
    dialog.showModal()

})