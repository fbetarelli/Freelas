const clientDialog = document.getElementById('clientDialog')
const clientList = document.getElementById('clientList')

const closeClient = document.getElementById('closeClient')
const closeJob = document.getElementById('closeJob')





ClientBtn.addEventListener('click', () => {
    clientDialog.showModal()
})


closeClient.addEventListener('click', () => {
    clientDialog.close()
})

clientList.addEventListener('click', (e) => {
    let btn = e.target.closest('.openJobDialog')
    if (!btn) return;

    toggleModals(btn, 'jobDialog', 'showModal')
})
clientList.addEventListener('click', (e) => {
    let btn = e.target.closest('.closeDialog')
    if (!btn) return;

    toggleModals(btn, 'jobDialog', 'close')
})


function toggleModals(btn, cssselector, action) {
    let id = btn.dataset.id
    let dialog = document.querySelector(`.${cssselector}[data-id="${id}"]`)
    dialog[action]()
}

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