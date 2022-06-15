"use strict";
const formulario = document.querySelector("#formulario-cadastro");
let inputCodigo = document.querySelector('#input-codigo');
let inputDescricao = document.querySelector('#input-descricao');
let inputDetalhamento = document.querySelector('#input-detalhamento');
let tabelaRecados = document.querySelector('#container-registros');
const myModal = new bootstrap.Modal('#transaction-modal');
const btnSair = document.querySelector('#button-logout');
let usuarioLogado = sessionStorage.getItem('usuarioLogado');
btnSair.addEventListener('click', sair);
document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado) {
        alert("Precisa estar logado para acessar essa página!");
        window.location.href = "login.html";
        return;
    }
    carregarRecadosUsuario();
});
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    adicionarNovoRecado();
});
function adicionarNovoRecado() {
    let codigo = Number(inputCodigo.value);
    let descricao = inputDescricao.value;
    let detalhamento = inputDetalhamento.value;
    let recado = {
        codigo: codigo,
        descricao: descricao,
        detalhamento: detalhamento
    };
    let listaRecados = buscarRecadosNoStorage();
    let existe = listaRecados.some((recado) => recado.codigo === codigo);
    if (existe) {
        alert("Este código já foi cadastrado para outro recado!");
        inputCodigo.value = '';
        inputCodigo.focus();
        return;
    }
    listaRecados.push(recado);
    preencherTabela(recado);
    formulario.reset();
    salvarNoStorage(listaRecados);
    myModal.hide();
}
function preencherTabela(recado) {
    let novaLinha = document.createElement('tr');
    let colunaCodigo = document.createElement('td');
    let colunaDescricao = document.createElement('td');
    let colunaDetalhamento = document.createElement('td');
    let colunaAcoes = document.createElement('td');
    let botaoEditar = document.createElement('button');
    let botaoApagar = document.createElement('button');
    novaLinha.setAttribute('id', `${recado.codigo}`);
    novaLinha.setAttribute('class', 'row registros');
    colunaCodigo.setAttribute('class', 'col-2 d-flex align-items-center justify-content-center');
    colunaDescricao.setAttribute('class', 'col-3 d-flex align-items-center');
    colunaDetalhamento.setAttribute('class', 'col-4');
    colunaAcoes.setAttribute('class', 'col-2 offset-1 d-flex align-items-center');
    botaoEditar.setAttribute('class', 'btn btn-success me-2');
    botaoEditar.setAttribute('type', 'button');
    botaoEditar.addEventListener('click', () => {
        editarRecado(recado.codigo);
    });
    botaoApagar.setAttribute('class', 'btn btn-danger');
    botaoApagar.setAttribute('type', 'button');
    botaoApagar.addEventListener('click', () => {
        apagarRecado(recado.codigo);
    });
    colunaCodigo.innerHTML = `<h3 class="fs-2 text-center">${recado.codigo}</h3>`;
    colunaDescricao.innerHTML = `<p class="fs-3">${recado.descricao}</p>`;
    colunaDetalhamento.innerHTML = `<p class="fs-5">${recado.detalhamento}`;
    botaoEditar.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30"
                                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            `;
    botaoApagar.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30"
                                    fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                </svg>
                            `;
    colunaAcoes.appendChild(botaoEditar);
    colunaAcoes.appendChild(botaoApagar);
    novaLinha.appendChild(colunaCodigo);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaDetalhamento);
    novaLinha.appendChild(colunaAcoes);
    tabelaRecados.appendChild(novaLinha);
}
function salvarNoStorage(listaRecados) {
    let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return usuario.login === usuarioLogado;
    });
    listaUsuarios[indiceUsuarioLogado].recados = listaRecados;
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
}
function carregarRecadosUsuario() {
    let listaStorage = buscarRecadosNoStorage();
    if (listaStorage) {
        for (const recado of listaStorage) {
            preencherTabela(recado);
        }
    }
    return;
}
function apagarRecado(codigo) {
    let listaRecados = buscarRecadosNoStorage();
    let indiceEncontrado = listaRecados.findIndex((recado) => recado.codigo === codigo);
    let confirma = confirm(`Tem certeza que deseja excluir o recado ${codigo}?`);
    if (confirma) {
        let linhasTabela = document.querySelectorAll('.registros');
        for (let linha of linhasTabela) {
            if (Number(linha.id) == codigo) {
                console.log(linha);
                tabelaRecados.removeChild(linha);
                listaRecados.splice(indiceEncontrado, 1);
                alert("Registro removido!");
            }
        }
        salvarNoStorage(listaRecados);
    }
    return;
}
function buscarRecadosNoStorage() {
    let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    let dadosUsuarioLogado = listaUsuarios.find((usuario) => {
        return usuario.login === usuarioLogado;
    });
    return dadosUsuarioLogado.recados;
}
function editarRecado(codigo) {
    alert(`Editar recado ${codigo}?`);
}
function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}
