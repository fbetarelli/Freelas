const clientList = document.getElementById('clientList')

//função que busca clientes por fetch
async function getClients() {
    try {
        const dados = await fetch('/getClients');
        const result = await dados.json()


        if (result.success) {
            console.log(result.clients)
            return result.clients;
        }
        return []
    } catch (error) {
        console.error('erro no JS getClients: ' + error)
        return []
    }

}

//função que lista clientes e cria cards
async function listClients() {
    const clientsArray = await getClients();
    clientsArray.forEach(client => {
        let card = createCard(client);
        clientList.appendChild(card);

    });

}

function createCard(client) {
    const div = document.createElement('div')
    div.className = ('');
    div.innerHTML = (`
        <h3>${client.name}</h3>
        <p>${client.contact}</p>
        <p>${client.address}</p>
        <a class="listServicesByClientBtn" href="/getServices?client=${client.id}">Ver serviços</a> </br>
        
        `)
    return div;
}


document.addEventListener('DOMContentLoaded', () => {
    listClients();
})