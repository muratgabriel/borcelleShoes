//Base de datos simulada aca se carga productos de ecommerce
class BaseDeDatos {
    constructor() {
        //Array con los productos
        this.productos = [];

        // //Vamos a cargar los productos que tengamos comentamos porque usamos JSON
        // this.agregarRegistro(1, "Nike Ben and Jerry", 200, "Exclusivo", "NikeBenAndJerry.png");
        // this.agregarRegistro(2, "Nike Nyjah Huston", 80, "Skateboarding", "NikeNhu.png");
        // this.agregarRegistro(3, "Nike Jordan Dior", 500, "Exclusivo", "JordaDior.png");
        // this.agregarRegistro(4, "Adidas Forum", 150, "Urban", "AdidasForum.png");
        // this.agregarRegistro(5, "Adidas Samba", 130, "Urban", "AdidasSamba.png");
        // this.agregarRegistro(6, "Adidas Ozweego", 160, "Urban", "AdidasOzwe.png");
        // this.agregarRegistro(7, "Vans Slip On", 50, "Skateboarding", "VansSlipOn.png");
        // this.agregarRegistro(8, "Vans X Imran", 200, "Urban", "VansImran.png");    

        // this.agregarRegistro(9, "Vans Old Skool Flame", 150, "Skateboarding", "VansOwhiteFlame.png");
    }

    //Metodo agregar producto comentamos por el JSON
    // agregarRegistro(id, nombre, precio, categoria, imagen) {
    //     const producto = new Producto(id, nombre, precio, categoria, imagen);
    //     this.productos.push(producto);
    // }

    //Metodo traer productos te devuelve todos los productos q tengo en la base de datos (return)
    async traerRegistros() {
        const response = await fetch('../json/shoes.json');
        this.productos = await response.json();
        return this.productos;
    }

    //Seguimiento por ID
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }

    //Para el buscador: registro por nombre
    registroPorNombre(nombre) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(nombre));//Se fija en todos los productos y si tienen la palabra que ingresamos.
    }
    //Registro por categoria 
    registroPorCategoria(categoria) {
        return this.productos.filter((producto) => producto.categoria == categoria);
    }
}

// Clase carrito
class Carrito {
    constructor() {
        //Storage
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0; //Suma del precio total de los productos que agreguemos o quitemos del carrito.
        this.totalProductos = 0; //Cantidad de productos que agreguemos al carrito.
        this.listar();//Apenas cargue la pagina que me liste y me muestre los productos
    }

    //Metodos del carrito

    //Lo que hay en el carrito.
    estaEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id); //Si encuentra dentro del carrito un producto con el mismo id, suma la cantidad enves de agregar otro.
    }

    //Agregar
    agregar(producto) {
        let productoEnCarrito = this.estaEnCarrito(producto);
        if (productoEnCarrito) {
            //Si esta en carrito suma la canitdad
            productoEnCarrito.cantidad++;
        } else {
            //Si no esta lo agrega 
            this.carrito.push({ ...producto, cantidad: 1 }); //Me pasa el objeto producto y agrega el parametro cantidad 

        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));//Lo guardamos cada vez que actualizamos el array, cuando quitamos o agregamos.

        this.listar(); //Llamamos a la funcion listar luego de agregar

        // Toastify
        Toastify({
            text: `¡${producto.nombre}, Agregado al carrito!`,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "linear-gradient(to right, #967E76, #7A3E3E)",
            }
        }).showToast();
    }

    //Quitar
    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id); //Buscamos el indice dentro del array para poder usar el splice y quitarlo.
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }//Si la cantidad de producto es mayor a 1 lo resto sino lo borro (quitar del carrito cuando la cantidad es 2 o mas)
        localStorage.setItem("carrito", JSON.stringify(this.carrito));//Storage
        this.listar(); //Para que me vuelva a actualizar la lista 
    }
    // Vaciar carrito
    vaciar() {
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar();
    }

    //Listar : Siempre se llama cuando actualizamos el carrito .
    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divcarrito.innerHTML = ""; //Primero vaciamos el carrito.
        for (const producto of this.carrito) {
            divcarrito.innerHTML += `
            <div class="carrito">
            <div class="shoesEnCarrito">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <img src="assets/img/shoesImg/${producto.imagen}"/>
            <p>${producto.cantidad}</p>
            <p><a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a></p>
            </div>
            </div>
            `;
            //Calculamos el total de los productos
            this.total += (producto.precio * producto.cantidad);
            this.totalProductos += producto.cantidad;
        }
        // sweetalert si hay productos el boton aparece si se realiza la compra se oculta 
        if (this.totalProductos > 0) {
            botonComprar.className = "btnCom";
        } else {
            botonComprar.className = "oculto";
        }
        //Botones de quitar
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) { //Recorremos boton por boton
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            };
        }
        //Actualizamos variables carrito
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

// Clase molde de los productos
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

//Instanciamos Base de datos
const bd = new BaseDeDatos();

//Elementos HTML
const divProductos = document.querySelector("#productos");
const divcarrito = document.querySelector("#carrito");
//vinculamos los span
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
//vinculamos el elemento para buscar
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
//elementos carrito
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#btnComprar");
//botones de flitrado por categoria 
const botonesCategoria = document.querySelectorAll(".btnCategoria");

botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const registroPorCategoria = bd.registroPorCategoria(boton.innerText);
        cargarProductos(registroPorCategoria);
    })
});

document.querySelector("#btnTodas").addEventListener("click", (event) => {
    event.preventDefault();
    cargarProductos(bd.productos);
});

//Ejecutamos los productos(llamamos a la función)
bd.traerRegistros().then(
    (productos) => cargarProductos(productos));
//Cargar productos al HTML con DOM, los trae de la base de datos.
//Usamos plantilla ``, ${} llamamos al divProductos y insertamos lo que querramos h2, parrafo, precio, boton y imagen.
function cargarProductos(productos) {
    //vaciar el div productos
    divProductos.innerHTML = "";
    //div productos HTML
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="productos">
        <h2>${producto.nombre}</h2>
        <img src="assets/img/shoesImg/${producto.imagen}"/>
        <p>$${producto.precio}</p>
        <p><a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a></p> 
        </div>
        `;
        //data-id: para saber que producto puntualmente estamos selccionando.
    }

    //Botones de agregar al carrito (crear eventos)
    const botonesAgregar = document.querySelectorAll(".btnAgregar"); //selecciona todos los botones que haya.
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto); //vinculamos el metodo agregar a los botones .
        })
    }
}
//Evento buscador
//formBuscar.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const palabra = inputBuscar.value;
//     cargarProductos(bd.registroPorNombre(palabra.toLowerCase()));
// }); //buscador directo al escribir toda la palabra
inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registroPorNombre(palabra.toLowerCase()));
});//keyup me filtra cuando voy escribiendo 

// Evento comprar sweetalert
botonComprar.addEventListener("click", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su comprar ha sido realizada con éxito',
        confirmButtonText: 'Aceptar',
    });
    carrito.vaciar();
});

//Objeto carrito instaciado, siempre al final de todo.
const carrito = new Carrito();

