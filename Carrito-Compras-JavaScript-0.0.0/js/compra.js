const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');


cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => {
        compra.eliminarProducto(e)
    });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => {
        compra.obtenerEvento(e)
    });
    carrito.addEventListener('keyup', (e) => {
        compra.obtenerEvento(e)
    });


}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 3000
        }).then(function () {
            window.location = "index.html";
        })
    } else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 3000
        })
    } else {

        //aqui se coloca el user id generado en el emailJS
        (function () {
            emailjs.init("D0RY4vXbCf4lcebI0");
        })();

        const btn = document.getElementById('procesar-compra');

        document.getElementById('procesar-pago').addEventListener('submit', function (event) {
            event.preventDefault();

            const serviceID = 'default_service';
            const templateID = 'template_kqhdeon';

            const cargandoGif = document.querySelector('#cargando');
            cargandoGif.style.display = 'block';

            const enviado = document.createElement('img');
            enviado.src = 'img/mail.gif';
            enviado.style.display = 'block';
            enviado.width = '150';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    cargandoGif.style.display = 'none';
                    document.querySelector('#loaders').appendChild(enviado);

                    Swal.fire({
                        type: 'success',
                        text: 'Compra realizada, le enviamos al mail los detalles',
                        showConfirmButton: false,
                        timer: 4000
                    })

                    setTimeout(() => {
                        compra.vaciarLocalStorage();
                        enviado.remove();
                        window.location = "index.html";
                    }, 4500);



                }, (err) => {
                    btn.value = 'Send Email';
                    alert(JSON.stringify(err));
                });
            return false;
        });
    }
}