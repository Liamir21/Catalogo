document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const content = document.querySelector('.content');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const modalImage = document.getElementById('modalImage');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const header = document.querySelector('header');

    // Mostrar el contenido cuando la página esté cargada al 90%
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            content.classList.remove('hidden');
            content.classList.add('fade-in-up');
        }, 1000); // Simulación de carga al 90%
    });

    // Obtener el código del gestor desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const managerCode = urlParams.get('manager') || '*'; // Por defecto '*' si no hay código de gestor

    // Función para cargar productos desde el archivo JSON
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            renderProducts(products);

            // Filtrar productos cuando se escribe en el campo de búsqueda
            searchInput.addEventListener('input', () => {
                filterProducts(products);
            });

            // Filtrar productos cuando se selecciona una categoría
            categorySelect.addEventListener('change', () => {
                filterProducts(products);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    function filterProducts(products) {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(query) ||
                                  product.price.toLowerCase().includes(query);
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        renderProducts(filteredProducts);
    }

    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('col-md-4', 'mb-4', 'fade-in-up-element');
    
            let productImages = '';
            if (Array.isArray(product.image)) {
                productImages += `
                    <div id="carousel-${product.name.replace(/\s+/g, '-')}" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                `;
                product.image.forEach((img, index) => {
                    productImages += `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" class="d-block w-100" alt="${product.name}">
                            </div>
                        `;
                });
    
                productImages += `
                        </div>
                        <a class="carousel-control-prev" href="#carousel-${product.name.replace(/\s+/g, '-')}" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carousel-${product.name.replace(/\s+/g, '-')}" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                `;
            } else {
                productImages = `<img src="${product.image}" class="card-img-top" alt="${product.name}" onclick="showImageModal('${product.image}')">`;
            }

            productItem.innerHTML = `
                <div class="card h-100">
                    <div class="overflow-hidden border border-bottom">
                        ${productImages}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                    </div>
                    <div class="card-footer mt-auto">
                        <span class="text-left">Precio: ${product.price}</span>
                        <a href="#" onclick="sendWhatsAppMessage('${product.name}', '${product.price}', '${managerCode}')" class="btn btn-success">Pedir</a>
                    </div>
                </div>
            `;
            productList.appendChild(productItem);
        });

        observeProducts();
    }

    function observeProducts() {
        const products = document.querySelectorAll('.fade-in-up-element');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        });

        products.forEach(product => {
            observer.observe(product);
        });
    }

    window.showImageModal = function(imageSrc) {
        modalImage.src = imageSrc;
        $('#imageModal').modal('show');
    };

    window.sendWhatsAppMessage = function(productName, price, managerCode) {
        const message = `Hola, estoy interesad@ en este artículo:
    - Producto: ${productName}
    - Precio: ${price}
    Ticket: ${managerCode}
    Muchas gracias por su atención.
    `;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/54597905?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    // Cambiar entre modo claro y oscuro
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        header.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.textContent = 'light_mode'; // Icono de sol para modo oscuro
        } else {
            themeIcon.textContent = 'dark_mode'; // Icono de luna para modo claro
        }
    });
});
