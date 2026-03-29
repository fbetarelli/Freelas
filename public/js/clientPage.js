const clientDialog = document.getElementById('clientDialog')
const jobDialog = document.getElementById('jobDialog')

const ClientBtn = document.getElementById('ClientBtn')
const newJobBtn = document.getElementById('newJobBtn')

const closeClient = document.getElementById('closeClient')
const closeJob = document.getElementById('closeJob')

ClientBtn.addEventListener('click', () => {
    clientDialog.showModal()
})
newJobBtn.addEventListener('click', () => {
    jobDialog.showModal()
})

closeClient.addEventListener('click', () => {
    clientDialog.close()
})

closeJob.addEventListener('click', () => {
    jobDialog.close()
})

document.addEventListener('DOMContentLoaded', (e) => {
    let buttons = document.querySelectorAll('.submitForm')
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let input = btn.closest('.actionForm').querySelector('.valueInput')
            let errMsg = btn.closest('.actionForm').querySelector('.actionError')
            let valor = formatarParaFloat(input.value)

            if (isNaN(valor) || valor <= 0) {
                e.preventDefault();
                errMsg.innerHTML = 'Insira um valor válido!'
            } else {
                errMsg.innerHTML = ''
            }
        })
    });
})

function formatarParaFloat(valor) {
    //retira os pontos EX: 12,99 para 12.99
    const temp = valor.replace(/\./g, '')
    const final = temp.replace(/,/g, '.')
    return (final)
}