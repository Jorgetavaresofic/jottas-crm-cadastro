let clientesPorPagina = 5;
let paginaAtual = 1;

function gerarCliente() {
    const nome = document.getElementById('nome').value.trim();
    const contato = document.getElementById('contato').value.trim();

    if (nome && contato) {
        if (!validarContato(contato)) {
            alert("O contato deve está no formato (00)00000-0000.");
            return;
        }
        
        const codigoCliente = `CLI${Date.now()}`;
        const cliente = { codigo: codigoCliente, nome, contato};

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes.push(cliente);

        localStorage.setItem("clientes", JSON.stringify(clientes));

        alert(`Cliente cadastrado com sucesso!\nCódigo: ${codigoCliente}`);
        document.getElementById('nome').value = '';
        document.getElementById('contato').value = '';

        listarClientes();
    } else {
        alert("Por favor, preencha todos os campos!");
    }
}

function listarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const lista = document.getElementById('listaClientes');
    lista.innerHTML = '';

    const inicio = (paginaAtual - 1) * clientesPorPagina;
    const fim = inicio + clientesPorPagina;
    const clientesPagina = clientes.slice(inicio, fim);

    if (clientesPagina.length === 0) {
        lista.innerHTML = '<li>Nenhum cliente cadastrado!</li>';
        return;
    }
    clientesPagina.forEach(cliente => {
        const item = document.createElement('li');
        item.textContent = `${cliente.codigo} - ${cliente.nome} - ${cliente.contato}`;

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.style.marginLeft = '10px';
        botaoRemover.onclick = () => removerCliente(cliente.codigo);

        item.appendChild(botaoRemover);
        lista.appendChild(item);
    });

    document.getElementById("paginaAtual").textContent = `Página ${paginaAtual}`;
    document.getElementById("botaoAnterior").disabled = paginaAtual === 1;
    document.getElementById("botaoProximo").disabled = fim >= clientes.length;
}

function navegarPagina(direcao) {
    paginaAtual += direcao;
    listarClientes();
}

function validarContato(contato) {
    const regex = /^\(\d{2}\)\d{5}-\d{4}$/;
    return regex.test(contato);
}

function formatarContato(input) {
    let contato = input.value.replace(/\D/g, "");
    if (contato.length > 2) {
        contato = `(${contato.slice(0, 2)})${contato.slice(2)}`;
    }
    if (contato.length > 8) {
        contato = `${contato.slice(0, 9)}-${contato.slice(9, 13)}`;
    }
    input.value = contato;
}

function filtrarClientes() {
    const filtro = document.getElementById("filtroBusca").value.toLowerCase();
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const clientesFiltrados = clientes.filter(cliente => {
        return cliente.nome.toLowerCase().includes(filtro) || cliente.contato.includes(filtro);
    });    
    listarClientesFiltrados(clientesFiltrados);
}

function listarClientesFiltrados(clientesFiltrados) {
    const listaElement = document.getElementById("listaClientes");
    listaElement.innerHTML = "";

    clientesFiltrados.forEach(cliente => {
        const li = document.createElement("li");
        li.textContent = `Código: ${cliente.codigo} | Nome: ${cliente.nome} | Contato: ${cliente.contato}`;
        listaElement.appendChild(li);
    });
}

function exportarParaCSV() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (clientes.length === 0) {
        alert("Não há clientes para exportar!");
        return;
    }
    let csvContent = "data:text/csv;charset=uf-8,Codigo,Nome,Contato\n";
    clientes.forEach(cliente => {
        csvContent += `${cliente.codigo},${cliente.nome},${cliente.contato}\n`;
    });

    const encondedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encondedUri);
    link.setAttribute("download", "clientes.csv");
    document.body.appendChild(link);

    link.click();
    document.body.appendChild(link);
}

function removerCliente(codigo) {
    if (confirm("Tem certeza que deseja remover os dados desse cliente?")) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes = clientes.filter(cliente => cliente.codigo !== codigo);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        alert("Cliente removido com sucesso!");
        listarClientes();
    } else {
        alert("Ação cancelada!")
    }
}

window.onload = function() {
    listaClientes();
}