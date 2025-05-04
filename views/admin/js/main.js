let currentUser = null;
// Función para manejar la visibilidad de las secciones
function updateVisibility(isLoggedIn, isAdmin = false) {
    document.getElementById('login').classList.toggle('hidden', isLoggedIn);
    document.getElementById('data').classList.toggle('hidden', !isLoggedIn);
    document.getElementById('adminPanel').classList.toggle('hidden', !isAdmin);
    document.getElementById('usuarios').classList.toggle('hidden', isAdmin || !isLoggedIn);
    // Muestra 'usuarios' solo si está logueado y NO es admin
}

// Limpiar sesión y ocultar secciones al cargar la página
function clearSession() {
    localStorage.removeItem('token');
    currentUser = null;
    updateVisibility(false);
}

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        clearSession();
    }
});

const loginForm = document.getElementById('loginForm');
const error = document.getElementById('error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const Username = document.getElementById('username').value;
    const Password = document.getElementById('password').value;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: Username, Password: Password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.usuario;
            updateVisibility(true, currentUser.Rol === 'ADMIN');
            if (currentUser.Rol === 'ADMIN') {
                cargarUsuarios();
            }
        } else {
            error.textContent = data.mensaje || 'Error en el login';
        }
    } catch (err) {
        error.textContent = 'Error en el servidor';
    }
});

const createUserForm = document.getElementById('createUserForm');
createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const Username = document.getElementById('newUsername').value;
    const Password = document.getElementById('newPassword').value;
    const Rol = document.getElementById('newRol').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ Username: Username, Password: Password, Rol: Rol })
        });
        const data = await response.json();
        alert(data.mensaje || 'Error');
        if (response.ok) {
            cargarUsuarios();
            createUserForm.reset();
        }
    } catch (err) {
        alert('Error en el servidor');
    }
});

async function cargarUsuarios() {
    try {
        const response = await fetch('/api/user/', {
            method: 'GET',
            headers: { 'Authorization': `${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        

        const usuarios = data.usuarios;
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.IdUsuario}</td>
                <td>${u.Username}</td>
                <td>${u.Rol}</td>
                <td>${u.Estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button onclick="editarUsuario(${u.IdUsuario}, '${u.Username}', '${u.Rol}', ${u.Estado})">Editar</button>
                    <button onclick="eliminarUsuario(${u.IdUsuario})">Eliminar</button>
                </td>
            `;
            userList.appendChild(tr);
        });
    } catch (err) {
        alert('Error al cargar usuarios');
    }
}

async function editarUsuario(IdUsuario, Username, Rol) {
    const newUsername = prompt('Nuevo nombre de usuario:', Username);
    const newPassword = prompt('Nueva contraseña (dejar en blanco para no cambiar):');
    const newRol = prompt('Nuevo rol (ADMIN/GUARDIA):', Rol);
    const newEstado = confirm('¿Usuario activo?');

    try {
        const response = await fetch(`/api/user/${IdUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                Username: newUsername,
                Password: newPassword || undefined,
                Rol: newRol,
                Estado: newEstado
            })
        });
        const data = await response.json();
        alert(data.mensaje || 'Error');
        if (response.ok) {
            cargarUsuarios();
        }
    } catch (err) {
        alert('Error en el servidor');
    }
}

async function eliminarUsuario(IdUsuario) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
        try {
            const response = await fetch(`/api/user/${IdUsuario}`, {
                method: 'DELETE',
                headers: { 'Authorization': `${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            alert(data.mensaje || 'Error');
            if (response.ok) {
                cargarUsuarios();
            }
        } catch (err) {
            console.log(err);
            alert('Error en el servidor');
        }
    }
}

async function consultar() {
    const IdPPL = document.getElementById('inputId').value;
    const token = localStorage.getItem('token');
    const resultado = document.getElementById('resultado');
    if (!IdPPL) {
        resultado.innerHTML = 'Por favor, ingrese un ID de PPL';
        return;
    }

    console.log(IdPPL);

    try {
        const response = await fetch(`/api/ppl/${IdPPL}`, {
            method: 'GET',
            headers: { 'Authorization': `${token}` }
        });
        const data = await response.json();
        console.log(data);
        if (data.ppl) {
            const ppl = data.ppl;
            resultado.innerHTML = `
                Nombre: ${ppl.Nombre1} <br>
                Apellido: ${ppl.Apellido1} <br>
                TD: ${ppl.TD} <br>
                Estado: ${ppl.Estado ? 'Activo' : 'Inactivo'}
            `;
        } else {
            resultado.innerHTML = 'No se encontró ningún PPL con ese ID.';
        }
    } catch (err) {
        console.error('Error:', err);
        resultado.innerHTML = 'Error al realizar la consulta';
    }
}

document.getElementById('btnCerrarSesion').addEventListener('click', clearSession);
document.getElementById('btnCerrarSesionAdmin').addEventListener('click', clearSession); 

