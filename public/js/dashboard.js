const clientDialog = document.getElementById('clientDialog')
const jobDialog = document.getElementById('jobDialog')

const newClientBtn = document.getElementById('newClientBtn')
const newJobBtn = document.getElementById('newJobBtn')

const closeClient = document.getElementById('closeClient')
const closeJob = document.getElementById('closeJob')

newClientBtn.addEventListener('click', () => {

    setTimeout(clientDialog.showModal(), 1000)
})
newJobBtn.addEventListener('click', () => {
    setTimeout(jobDialog.showModal(), 1000)
})

closeClient.addEventListener('click', () => {
    clientDialog.close()
})

closeJob.addEventListener('click', () => {
    jobDialog.close()
})