const submit = document.getElementById('submit')
const input1 = document.getElementById('password')
const input2 = document.getElementById('confirmpassword')
const errMsg = document.getElementById('error')

submit.addEventListener('click', (e) => {
    if (input1.value != input2.value) {
        e.preventDefault()
        errMsg.innerHTML = 'As duas senhas estão diferentes!'
    }
})