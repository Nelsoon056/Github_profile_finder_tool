// pa cambiar el tema claro y oscuro
const botonModo = document.getElementById('boton_modo');
const texto = document.getElementById('boton_texto');

if (localStorage.getItem('theme') === 'claro') {
    document.body.classList.add('modo_claro');
    texto.textContent = "Modo Oscuro";
}

botonModo.addEventListener('click', () => {
    document.body.classList.toggle('modo_claro');

    if (document.body.classList.contains('modo_claro')) {
        localStorage.setItem('theme', 'claro');
        texto.textContent = "Modo Oscuro";
    } else {
        localStorage.setItem('theme', 'oscuro');
        texto.textContent = "Modo Claro";
    }
});

// debounce
function debounce (callback, retraso) {
    let id;
    return function(...args) {
        clearTimeout(id);

        id = setTimeout(() => {
            callback(...args);
        }, retraso)
    }
}

const resultados = document.getElementById('resultados');
const loader = document.getElementById('loader');

const renderizar = (usuarios) => {
    resultados.innerHTML = '';

    if (usuarios.length === 0) {
        resultados.innerHTML = '<h3>No se encontraron perfiles.</h3>';
        return;
    }

    usuarios.forEach(perfil => {
        const nombreReal = perfil.name ? perfil.name : 'Sin nombre';
        const empresa = perfil.company ? perfil.company : 'Independiente';

        const tarjetaHTML = `
            <div class="tarjeta">
                <img src="${perfil.avatar_url}" alt="Foto de ${perfil.login}" class="avatar">
                <div class="info">
                    <h2>${nombreReal}</h2>
                    <p class="usuario-github">@${perfil.login}</p>
                    <p><strong>Empresa:</strong> ${empresa}</p>
                    <p><strong>Repositorios:</strong> ${perfil.public_repos}</p>
                    <a href="${perfil.html_url}" target="_blank" class="boton-perfil">Ver Perfil</a>
                </div>
            </div>
        `;
        resultados.innerHTML += tarjetaHTML;
    });
};

// hay que mostrar nombre, foto de perfil, usuario, empresa y cantidad de repositorios
// obtener los datos de la API
const buscar = document.getElementById("nombre");
const botonBuscar = document.getElementById("boton_buscar");

async function buscarPerfil (nombre) {
    nombre = nombre.trim();
    if (nombre.length === 0) {
        return;
    }

    try {
        loader.style.display = 'flex';
        resultados.innerHTML = '';

        const url = `https://api.github.com/search/users?q=${nombre}&per_page=3`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const usuariosRaw = datos.items;
        
        const usuariosCom = usuariosRaw.map(async (usuario) => {
            const res = await fetch(usuario.url);
            const perfil = await res.json();
            return perfil; 
        })

        const usuariosFin = await Promise.all(usuariosCom);

        loader.style.display = 'none';

        renderizar(usuariosFin);
    } catch (err) {
        console.error("Hubo un problema con la petición pibe")
    }
}

buscar.addEventListener("input", debounce((e) => {
    const usuario = e.target.value;
    buscarPerfil(usuario);
}, 500))



