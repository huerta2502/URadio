alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-bd-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";

window.addEventListener("load", load, false);

function load() {
    document.getElementById("signup").addEventListener("submit", function verify(event) {
        event.preventDefault();
        event.stopPropagation();
        let psswd = document.getElementById("floatingPassword");
        let rpsswd = document.getElementById("floatingPasswordv");
        if (psswd.value !== rpsswd.value) {
            rpsswd.classList.remove("is-valid");
            rpsswd.classList.add("is-invalid");
            alertify.alert('Aki', 'Las contraseñas no coinciden, intenta de nuevo', function() {
                alertify.error('Las contraseñas no coinciden');
            });
            return false;
        }
        rpsswd.classList.remove("is-invalid");
        rpsswd.classList.add("is-valid");
        let form = document.forms[0];
        let req = { mail: "", pswd: "" };
        let entry;
        for (let i = 0; i < form.length; i++) {
            entry = form[i];
            if ((entry.type == "password" || entry.type == "email") && entry.value != "") {
                if (entry.name == "mail") req.mail = entry.value;
                if (entry.name == "password") req.pswd = entry.value;
            } else if (entry.type == "password" || entry.type == "email") {
                alertify.alert('URadio', 'Introduce correctamente los datos solicitados', function() {
                    alertify.error('Introduce correctamente tus datos');
                });
                return false;
            }
        }
        fetch(`${form.action}`, {
                method: 'POST',
                headers: new Headers({
                    "Content-Type": `application/json`,
                }),
                body: JSON.stringify(req)
            })
            .then(response => {
                if (response.status < 400)
                    return response.json();
                else {
                    errora();
                    return null;
                }
            })
            .then(data => {
                if (data)
                    if (data.status == "Success") {
                        alertify.alert('URadio', `Bienvenido`, function() {
                            alertify.success('Ok');
                        }).set({
                            onshow: null,
                            onclose: () => {
                                sessionStorage.setItem('managerId', data.managerId);
                                window.location.href = "/home.html";
                            }
                        });;
                    } else alertify.alert('URadio', 'Ha ocurrido un error inesperado, intente de nuevo más tarde', function() {
                        alertify.error('Intente más tarde');
                    });
            })
            .catch(function(err) {
                console.error(err);
            });
        return false;
    });
}

function errora() {
    alertify.alert('URadio', 'Ocurrió un error, intente de nuevo más tarde', () => {
        alertify.error('Intente máss tarde');
    });
}