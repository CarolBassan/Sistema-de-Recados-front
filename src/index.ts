const signUpButton = document.getElementById("signUp") as HTMLButtonElement;
const signInButton = document.getElementById("signIn") as HTMLButtonElement;
const container = document.getElementById("container") as HTMLDivElement;

signUpButton.addEventListener("click", () => {
    container.classList.add("painel-direito-ativo");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("painel-direito-ativo");
});


let inputNome = document.getElementById("input-cadastro-nome") as HTMLInputElement;
let inputEmail = document.getElementById("input-cadastro-email") as HTMLInputElement;
let inputSenha = document.getElementById("input-cadastro-senha") as HTMLInputElement;
let formularioCadastro = document.getElementById("formulario-cadastro") as HTMLFormElement;

interface Usuario {
    nome: string;
    login: string;
    senha: string;
    recados: Array<any>
}

formularioCadastro.addEventListener('submit', (event) => {
    event.preventDefault();

    verificarCampos();
});


function verificarCampos(): void {
    if (inputNome.value === '' || inputNome.value.length < 3) {
        inputNome.focus();
        inputNome.value = '';
        inputNome.setAttribute('style', 'outline: thin solid red;');

    } else

        if (inputEmail.value === '' || inputEmail.value.length < 10) {
            inputEmail.focus();
            inputEmail.value = '';
            inputEmail.setAttribute('style', 'outline: thin solid red;');

        } else

            if (inputSenha.value === '' || inputSenha.value.length < 8) {
                inputSenha.focus();
                inputSenha.value = '';
                inputSenha.setAttribute('style', 'outline: thin solid red;');

            } else {
                inputNome.removeAttribute('style');
                inputEmail.removeAttribute('style');
                inputSenha.removeAttribute('style');

                let novoUsuario: Usuario = {
                    nome: inputNome.value,
                    login: inputEmail.value,
                    senha: inputSenha.value,
                    recados: []
                }

                formularioCadastro.reset();
                cadastrarUsuario(novoUsuario);
            }


}


function cadastrarUsuario(novoUsuario: Usuario): void {

    let usuarios: Array<Usuario> = buscarUsuariosStorage();

    let existe: boolean = usuarios.some((usuario) => {
        return usuario.login === novoUsuario.login
    });

    if (existe) {
        let confirma = confirm("Esse e-mail já está sendo utilizado em outra conta cadastrada. Deseja ir para página de login?");
        if (confirma) {
            container.classList.remove("painel-direito-ativo");
        }

        return
    }

    usuarios.push(novoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Conta criada com sucesso!");

    setTimeout(() => {
        container.classList.remove("painel-direito-ativo");
    }, 1000);
}

function buscarUsuariosStorage(): Array<Usuario> {

    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}


let inputLoginEmail = document.getElementById('input-login-email') as HTMLInputElement;
let inputLoginSenha = document.getElementById('input-login-senha') as HTMLInputElement;
let formularioLogin = document.getElementById('formulario-login') as HTMLFormElement;

formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    logarNoSistema();
});

function logarNoSistema(): void {
    let usuarios: Array<Usuario> = buscarUsuariosStorage();

    let existe: boolean = usuarios.some((usuario) => {
        return usuario.login === inputLoginEmail.value && usuario.senha === inputLoginSenha.value
    });

    if (!existe) {
        alert("E-mail ou senha inválidos.");
        return
    }

    sessionStorage.setItem('usuarioLogado', inputLoginEmail.value);
    window.location.href = 'home.html';
}
