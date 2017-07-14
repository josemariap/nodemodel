function modificarTextoHTML(identificador, texto) {
    document.getElementById(identificador).innerHTML = texto;
}

function usuarioDentroDelCampoBusqueda()
{
    $("#ticket").hide();
    const data = 
                    { 
                      mostrar: false,
                    };

   templatingHBS("ticket", "ticketInfo", data);
}

function usuarioFueraDelCampoBusqueda()
{
    return true;
}

function intervaloDeCaracteres(inicio, longitud) {
    return Array.from({ length: longitud }, (v, i) => String.fromCharCode(inicio + i));
}

function reemplazarTodasLasOcurrencias(texto, caracter_buscado, reemplazo) {
    while (texto.toString().indexOf(caracter_buscado) != -1)
        texto = texto.toString().replace(caracter_buscado, reemplazo);
    return texto;
}

function actualizarPaginaWeb() {
    location.reload();
}

function digitosDelNumero(rut) {
    var digitos = [];
    var digito;
    while (rut > 0) {
        digito = rut % 10;
        digitos.push(parseInt(digito));
        rut = parseInt(rut / 10);
    }
    return digitos.reverse();
}


// La siguiente función es más eficiente que la utilizada actualmente.
// function digitosDelNumero(rut) {
//    var digitos = [];
//    while (rut > 0) {
//        digitos = [rut % 10].concat(digitos);
//        rut = (rut / 10);
//    } 
//    return digitos;
//}

// function digitosDelNumero(rut) {
//    if (rut == 0) { return [] }
//    else { return [rut % 10].concat(digitosDelNumero(rut / 10))}

//} 
//}

function digitoVerificador(digitos) {

    // Si permitimos que se ingresen números correlativos de longitud nueve (estamos en el orden de los cientos de millones), 
    // podemos concatenar al vector denominado numeros el número siete.

    var secuencia = [3, 2, 7, 6, 5, 4, 3, 2];
    var cantidad_de_digitos = digitos.length;

    if (cantidad_de_digitos == 9) {
        secuencia = secuencia.concat([7]);
    }

    var cantidad_de_ceros = secuencia.length - cantidad_de_digitos;

    var ceros = Array.from({ length: cantidad_de_ceros }, x => 0);
    var multiplicados = [];
    var sumatoria = 0;
    var resultado = 0;
    var resto = 0;

    digitos = ceros.concat(digitos);
    cantidad_de_digitos = digitos.length;

    for (i = 0; i < cantidad_de_digitos; i++) {

        multiplicados[i] = digitos[i] * secuencia[i];
    }

    // sumatoria = sumatoria.reduce((a, b) => a + b);
    for (i = 0; i < cantidad_de_digitos; i++) {
        sumatoria = sumatoria + multiplicados[i];
    }

    resto = sumatoria % 11;
    resultado = 11 - resto;

    if (resultado == 11) {
        resultado = resto;
    }
    else {
        if (resultado == 10) {
            resultado = 'K';
        }
    }

    return resultado;
}

//-----------------------------------------------------------------------------------------------------------------------

; (function ($) {
    var defaults = {
        validateOn: 'blur',
        formatOn: 'blur',
        ignoreControlKeys: true,
        useThousandsSeparator: true,
        minimumLength: 2
    };

    //private methods
    function clearFormat(value) {

        //return value.replace(/[\.\-]/g, "");

       // const letras_anteriores = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
       // const letras_siguientes = [108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];

       //const letras_anteriores = Array.from({ length: 10 }, (v, i) => String.fromCharCode(97 + i));
       //const letras_siguientes = Array.from({ length: 15 }, (v, i) => String.fromCharCode(108 + i));
       //var letras = letras_anteriores.concat(letras_siguientes);

       //letras = letras.concat(letras.map(letra => letra.toUpperCase()));

        entrada = value.replace(/[\.\-]/g, "");
        entrada = entrada.replace(/[" "]/g, "");

        //entrada = entrada.replace(/[\letras]/g, "");

        return entrada.replace("k", "K");
    }

    function format(value, useThousandsSeparator) {
        var rutAndDv = splitRutAndDv(value);
        var cRut = rutAndDv[0]; var cDv = rutAndDv[1];         

        if (!(cRut && cDv)) { return cRut || value; }
        var rutF = "";
        var thousandsSeparator = useThousandsSeparator ? "." : "";
        while (cRut.length > 3) {
            rutF = thousandsSeparator + cRut.substr(cRut.length - 3) + rutF;
            cRut = cRut.substring(0, cRut.length - 3);
        }

        return cRut + rutF + "-" + cDv;
    }

    function isControlKey(e) {
        return e.type && e.type.match(/^key(up|down|press)/) &&
            (
                e.keyCode === 8 || // del
                e.keyCode === 16 || // shift
                e.keyCode === 17 || // ctrl
                e.keyCode === 18 || // alt
                e.keyCode === 20 || // caps lock
                e.keyCode === 27 || // esc
                e.keyCode === 37 || // arrow
                e.keyCode === 38 || // arrow
                e.keyCode === 39 || // arrow
                e.keyCode === 40 || // arrow
                e.keyCode === 91    // command
            );
    }

    function isValidRut(rut, options) {
        if (typeof (rut) !== 'string') { return false; }
        var cRut = clearFormat(rut);
        // validar por largo mínimo, sin guiones ni puntos:
        // x.xxx.xxx-x
        if (typeof options.minimumLength === 'boolean') {
            if (options.minimumLength && cRut.length < defaults.minimumLength) {
                return false;
            }
        } else {
            var minLength = parseInt(options.minimumLength, 10);
            if (cRut.length < minLength) {
                return false;
            }
        }
        var cDv = cRut.charAt(cRut.length - 1).toUpperCase();
        var nRut = parseInt(cRut.substr(0, cRut.length - 1));
        if (isNaN(nRut)) { return false; }
        return computeDv(nRut).toString().toUpperCase() === cDv;
    }

    function computeDv(rut) {
        var suma = 0;
        var mul = 2;
        if (typeof (rut) !== 'number') { return; }
        rut = rut.toString();
        for (var i = rut.length - 1; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul;
            mul = (mul + 1) % 8 || 2;
        }
        switch (suma % 11) {
            case 1: return 'k';
            case 0: return 0;
            default: return 11 - (suma % 11);
        }
    }

    function formatInput($input, useThousandsSeparator) {
        $input.val(format($input.val(), useThousandsSeparator));
    }

    function validateInput($input) {
        if (isValidRut($input.val(), $input.opts)) {
            $input.trigger('rutValido', splitRutAndDv($input.val()));
        } else {
            $input.trigger('rutInvalido');
        }
    }

    function splitRutAndDv(rut) {
        var cValue = clearFormat(rut);
        if (cValue.length === 0) { return [null, null]; }
        if (cValue.length === 1) { return [cValue, null]; }
        var cDv = cValue.charAt(cValue.length - 1);
        var cRut = cValue.substring(0, cValue.length - 1);
        return [cRut, cDv];
    }

    // public methods
    var methods = {
        init: function (options) {
            if (this.length > 1) {
                /* Valida multiples objetos a la vez */
                for (var i = 0; i < this.length; i++) {
                    console.log(this[i]);
                    $(this[i]).rut(options);
                }
            } else {
                var that = this;
                that.opts = $.extend({}, defaults, options);
                that.opts.formatOn && that.on(that.opts.formatOn, function (e) {
                    if (that.opts.ignoreControlKeys && isControlKey(e)) { return; }
                    formatInput(that, that.opts.useThousandsSeparator);
                });
                that.opts.validateOn && that.on(that.opts.validateOn, function () {
                    validateInput(that);
                });
            }
            return this;
        }
    };

    $.fn.rut = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("El método " + methodOrOptions + " no existe en jQuery.rut");
        }
    };

    $.formatRut = function (rut, useThousandsSeparator) {
        if (useThousandsSeparator === undefined) { useThousandsSeparator = true; }
        return format(rut, useThousandsSeparator);
    };

    $.computeDv = function (rut) {
        var cleanRut = clearFormat(rut);
        return computeDv(parseInt(cleanRut, 10));
    };

    $.validateRut = function (rut, fn, options) {
        options = options || {};
        if (isValidRut(rut, options)) {
            var rd = splitRutAndDv(rut);
            $.isFunction(fn) && fn(rd[0], rd[1]);
            return true;
        } else {
            return false;
        }
    };
})(jQuery);

//------------------------------------------------------------------------------------------------------------------------

$(function () { // Función principal.
    const client = ZAFClient.init();
    configuracion(client, function (config) {
        
        client.invoke('resize', { width: '310px', height: '750px' });
        templateHide();
        mostrarFormularioPrincipal(client, config);
        
    });
});

// ------------------------------------------------------------------------------------------------------------------

function RUTValido(numero_correlativo, digito_verificador) {

    const digitos = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    var digito_verificador_calculado = digitoVerificador(digitosDelNumero(parseInt(numero_correlativo)));

    if (digitos.includes(digito_verificador)) { // En caso contrario el dígito verificador debe ser una k.
        digito_verificador = parseInt(digito_verificador);
    }

    //else if (digito_verificador == "k") { // La convertimos en un k mayúscula.
    //    digito_verificador = digito_verificador.toUpperCase();
  //  }

    return (digito_verificador_calculado == digito_verificador)
}

function mostrarFormularioPrincipal(client, config) {

    usuarioDentroDelCampoBusqueda(); // Eliminamos la visualización del ticket del usuario anterior.

    $("#dni").rut({ formatOn: 'keyup' }); // Formateamos el campo RUT: xx.xxx.xxx-y

    $("#add-btn").on("click", function (event) { // El código que sigue se ejecuta al presionar el botón Buscar.
        event.preventDefault();
        templateHide();

        const dni = $("#dni").val(); // En dni tenemos todos los caracteres que podemos ver en el input.

        const cantidad_de_caracteres = $("#dni").val().length;

        if (cantidad_de_caracteres == 0) { // El campo RUT se encuentra vacío.
            client.invoke('notify', 'Ingrese un RUT', 'error');
        }

        else {  // Iniciamos la validación RUT.

            const campo_de_busqueda = dni.split("-"); // Un RUT consta de dos secciones separadas por un -.

            var numero_correlativo = reemplazarTodasLasOcurrencias(campo_de_busqueda[0], ".", "");

            //var numero_correlativo = campo_de_busqueda[0].replace(/["."]/g, "");

            var digito_verificador = campo_de_busqueda[1];

            
            if ((!isNaN(numero_correlativo) && (numero_correlativo != ""))) { // En caso cotrario se ha introducido al menos 
                // un caracter inválido.

                if ((typeof digito_verificador != "undefined") && (digito_verificador.length != 0)) { // El usuario ha 
                    // ingresado un dígito verificador.

                    if (RUTValido(numero_correlativo, digito_verificador)) {

                        busquedaPorDni(numero_correlativo.concat(digito_verificador), dni, client, config);
                    }
                    else { 
                           client.invoke('notify', 'El RUT ingresado no es válido', 'error');
                           $("#dni").val("");
                        }
                }
                else { 
                       client.invoke('notify', '¡Ingrese un dígito verificador!', 'error');
                       $("#dni").val("");
                    }

            } 
            else { 
                  client.invoke('notify', '¡número correlativo inválido o vacío!', 'error'); 
                  $("#dni").val("");
                }
        }
    });

    $("#botonEliminar").off("click").on("click", function () {actualizarPaginaWeb()});
}

// -----------------------------------------------------------------------------------------------------------------------

function busquedaPorDni(dni, stringDNI, client, config) {

    client.invoke('notify', 'Enviando petición de búsqueda.');
    inicioSessionZendesk(client, function (token) {

        const settings2 = {
            //url: config.url + '/api/v2/users/search.json?query=dni:' + dni + '',
            url: config.url + '/api/v2/users/search.json?query=dni:' + stringDNI + '',
            type: 'GET',
            headers: { "X-CSRF-Token": token },
        };

        client.invoke('notify', 'Buscando usuario... por favor espere');
        client.request(settings2).then(function (response) { // response es la respuesta a nuestra petición.


            // Mediante el array users, incluido en response, podemos determinar la existencia o no de un usuario.

            if (response.users.length != 0) { // El usuario exite en Zendesk.

                usuarioEncontradoZendesk(response, client, config, token);
            } else {  // El usuario no se encuentra en Zendesk, 
                // debemos utilizar la API proporcionada por CBRS o cargar sus datos personales desde nuestra interfaz.

                buscarUsuarioRest(dni, stringDNI, config, client, token);
            }
        }
        );

    });
   
}

function inicioSessionZendesk(client, callback) {
    configuracion(client, function (config) {

        const settings = {
            url: config.url + '/api/v2/users/me.json',
            type: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(config.username + ':' + config.password),
                'Content-Type': 'application/json'
            }
        };
        client.request(settings).then(function (data) {

            const token = data.user.authenticity_token;

            callback(token)
        })
    })
}

function usuarioEncontradoZendesk(response, client, config, token) {

    client.invoke('notify', 'Usuario encontrado en Zendesk.');

    const data = {
        titulo: "¡USUARIO REGISTRADO!",
        name: response.users[0].name,
        email: response.users[0].email,
        dni: response.users[0].user_fields.dni,
        apellido_paterno: response.users[0].user_fields.apellido_paterno,
        apellido_materno: response.users[0].user_fields.apellido_materno,
        direccion: response.users[0].user_fields.direccion,
        telefono: response.users[0].user_fields.telefono

    };

    //data.name = data.name.concat(" ").concat(data.apellido_paterno);

    templatingHBS("user", "userInfo", data);
    $("#user").show();

    const userId = response.users[0].id;
    client.invoke('routeTo', 'user', userId ); // Vista del usuario actual, con su historial de tickets.
    crearNuevoTicket(client, userId, config, token);
}

function buscarUsuarioRest(dni, stringDNI, config, client, token) {

    const settings3 = { // Configuración para el acceso a la API de CBRS.
        //url: config.urlApi + dni + '',
        url: "https://api.conservador.cl/core/v1/requirentes/" + dni + '',
        type: 'GET',
        cors: true,
        headers: {
            "Accept": "application/json",
            "user_key": "377e00363a334fa17be929a237f0402a"

        }
    };

    client.request(settings3).then(function (response) {

        // Fijarse si response tiene algo cuando es un usuario que no está en CBRS.

        crearUsuarioZendesk(response, client, config, token, stringDNI, function (usuario) {

            const userId = usuario.user.id;
            const data = {
                titulo: "¡USUARIO IMPORTADO!",
                name: usuario.user.name,
                email: usuario.user.email,
                dni: usuario.user.user_fields.dni,
                apellido_paterno: usuario.user.user_fields.apellido_paterno,
                apellido_materno: usuario.user.user_fields.apellido_materno,
                direccion: usuario.user.user_fields.direccion,
                telefono: usuario.user.user_fields.telefono
            };

            client.invoke('notify', 'Usuario encontrado en CBRS y creado en Zendesk');

            //data.name = data.name.concat(" ").concat(data.apellido_paterno);

            templatingHBS("user", "userInfo", data);
            $("#user").show();
            crearNuevoTicket(client, userId, config, token);
        });

        // Debemos crear un usuario nuevo desde nuestra interfaz.        

    }).catch(function (error) { // Se maneja la excepción, puesto que fue imposible importar un usuario.

        client.invoke('notify', 'El usuario no existe', 'error');
        $("#userForm").show();
        $("#createTicket").hide();
        $("#btn1").off("click").on("click", function () { // Las siguientes instrucciones serán ejecutadas si el usuario
            // presiona el botón "Crear usuario"

            $("#userForm").hide();
            const name = $("#name").val();
            const email = $("#email").val();
            const apellido_paterno = $("#apellido_paterno").val();
            const apellido_materno = $("#apellido_materno").val();
            const direccion = $("#direccion").val();
            const telefono = $("#telefono").val();

            vaciarCampos();

            if (validarEmail(email) && esUnNombreValido(name) && esUnNombreValido(apellido_paterno)) {

                
                const user =
                 {
                     nombres: name,
                     email: email,
                     //rutRequirente: dni,
                     rutRequirente: stringDNI,
                     apePaterno: apellido_paterno,
                     apeMaterno: apellido_materno,
                     direccion: direccion,
                     telefono: telefono,
                 };

                crearUsuarioZendesk(user, client, config, token, stringDNI, function (usuario) {


                    client.invoke('notify', 'Aguarde, usuario creandose.');

                    const userId = usuario.user.id;
                    const data =
                        {
                            titulo: "¡USUARIO CREADO!",
                            name: usuario.user.name,
                            email: usuario.user.email,
                            dni: usuario.user.user_fields.dni,
                            apellido_paterno: usuario.user.user_fields.apellido_paterno,
                            apellido_materno: usuario.user.user_fields.apellido_materno,
                            direccion: usuario.user.user_fields.direccion,
                            telefono: usuario.user.user_fields.telefono
                        };


                    client.invoke('notify', 'Usuario creado con éxito.');
                    vaciarCampos();
                    $("#dni").val(stringDNI); // Escribimos en el campo RUT del usuario actual.

                    //data.name = data.name.concat(" ").concat(data.apellido_paterno);

                    templatingHBS("user", "userInfo", data);
                    $("#user").show();
                    crearNuevoTicket(client, userId, config, token);
                })

            } else {

                client.invoke('notify', '¡Al menos un campo obligatorio no se ha completado correctamente!', 'error');
                $("#userForm").show();

            }

        });

    })
}


function datosDelUsuario(usuario) {

    var nombre = usuario.nombres.concat(" ").concat(usuario.apePaterno);
    nombre = nombre.concat(" ").concat(usuario.apeMaterno);

    const datos =
            {
                user: {
                    name: nombre,
                    email: usuario.email,
                    user_fields:
                    {
                        
                        dni: usuario.rutRequirente,
                        //dni:"Se cambió",
                        apellido_paterno: usuario.apePaterno,
                        apellido_materno: usuario.apeMaterno,
                        direccion: usuario.direccion,
                        telefono: usuario.telefono,
                    },
                    tags: [usuario.rutRequirente]
                }
            }
 

    return datos;

}

function crearUsuarioZendesk(usuario, client, config, token, stringRUT, callback) { // usuario es la respuesta obtenida desde 
    // CBRS o contiene la información ingresada desde nuestra interfaz de creación. 

    usuario.rutRequirente = stringRUT;
    usuario.dni = stringRUT;
    
    const settings4 = 
    {
      url: config.url + '/api/v2/users.json',
      type: 'POST',
      headers: { "X-CSRF-Token": token },
      data: datosDelUsuario(usuario),
    };

    client.request(settings4).then(function (response) {


        callback(response);

        //----------------------------------------------------------------------------------------------------------------        

    }).catch(function (response) {

        $('#userError').show();

        const error = JSON.parse(response.responseText);
        const resultado = analizarErrorNuevoUsuarioZendesk(error);

        //-----------------------------------------------------------------------------------------------------------------


        templatingHBS("userError", "userErrorInfo", resultado);

        client.invoke('notify', 'error de zendesk', 'error');

        //$("#userForm").show();

    });
}

function crearNuevoTicket(client, usuarioId, config, token) {

    client.get('currentUser').then(function (userData) {
        $("#ticketForm").show();
        $('#userError').hide();


        $("#botonTicket").off("click").on("click", function () {

            templateHide();

            const subject = $("#subject").val();
            const desc = $("#desc").val();

            if (subject != "" && desc != "") {

                const datos = {
                    ticket: {
                        subject: subject,
                        comment: desc,
                        requester_id: usuarioId,
                        assignee_id: userData.currentUser.id
                    }
                };

                const peticion = {
                    url: config.url + '/api/v2/tickets.json',
                    type: 'POST',
                    headers: {
                        "X-CSRF-Token": token
                    },
                    data: datos
                };

                client.request(peticion).then(function (response) {

                    $("#ticket").show();
                    $("#user").hide();


                    client.invoke('notify', 'Ticket numero: ' + response.ticket.id);

                    const data = 
                    { 
                        id: response.ticket.id,
                        mostrar: usuarioFueraDelCampoBusqueda(),
                    };

                    templatingHBS("ticket", "ticketInfo", data);

                    client.invoke('routeTo', 'ticket', data.id);

                    vaciarCampos();
                });

            } else {
                client.invoke('notify', 'Los campos del ticket no deben estar vacios', 'error');
                $("#ticketForm").show();

            }

        });

        //$("#botonBorrar").off("click").on("click", function () {actualizarPaginaWeb()});


    });
}

function templateHide() {
    $("#user").hide();
    $("#userForm").hide();
    $("#ticketForm").hide();
    $("#ticket").hide();
    $('#userError').hide();

}

function vaciarCampos() {
    $("#dni").val("");
    $("#subject").val("");
    $("#desc").val("");
    $("#name").val("");
    $("#email").val("");
    $("#apellido_paterno").val("");
    $("#apellido_materno").val("");
    $("#telefono").val("");
    $("#direccion").val("");
}

function validarEmail(emailAddress) {

    const patron = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    var es_valido = true;
    if (typeof digito_verificador != "undefined") {
    //const pattern = new RegExp(/^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/);
        es_valido = patron.test(emailAddress);
    }

    return es_valido;
}

function esUnNombreValido(nombre) {
    const patron = new RegExp(/^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/);
    return patron.test(nombre);
}

function templatingHBS(contenedor, script, data) {
    const scrip = "#" + script;
    const source = $(scrip).html();
    const template = Handlebars.compile(source);
    const cont = "#" + contenedor;
    $(cont).html(template(data));
}

function configuracion(client, callback) {

    client.context().then(function (context) {
        const subdomain = context.account.subdomain;

        client.metadata().then(function (metadata) { // metadata contiene información definida en manifest.json

            const config = {
                url: 'https://' + subdomain + '.zendesk.com',
                urlApi: metadata.settings.urlRest,
                username: metadata.settings.userName,
                password: metadata.settings.password
            };

            callback(config);
        });
    });
}

function analizarErrorNuevoUsuarioZendesk(error) {

    if (error.details.name) {
        const resultado = {
            description: error.details.name[0].description,
            error: error.details.name[0].error
        };

        return resultado;
    }

    if (error.details.email) {
        
        const resultado = {
            description: error.details.email[0].description,
            error: error.details.email[0].error
        };

        return resultado;
    }
    // dni no soportado por Zendesk.
    if (error.details["custom_field_values.base"]) {
        const resultado = {
            description: error.details["custom_field_values.base"][0].description,
            error: "Error de zendesk"
        };
        return resultado;
    }

    const resultado = {
        description: "Error no detallado, por favor contacte a su proveedor de la app",
        error: "Error interno de zendesk"
    };

    return resultado;

}