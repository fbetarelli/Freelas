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