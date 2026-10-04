const products = [

    {
        id: 1,
        name: "iPhone Pro",
        category: "mobile",
        categoryName: "موبایل",
        description: "گوشی قدرتمند با دوربین حرفه‌ای",
        price: 65000,
        icon: "📱"
    },

    {
        id: 2,
        name: "Samsung Galaxy",
        category: "mobile",
        categoryName: "موبایل",
        description: "صفحه نمایش فوق‌العاده و باتری قدرتمند",
        price: 42000,
        icon: "📱"
    },

    {
        id: 3,
        name: "MacBook Pro",
        category: "laptop",
        categoryName: "لپ‌تاپ",
        description: "لپ‌تاپ حرفه‌ای برای کار و طراحی",
        price: 95000,
        icon: "💻"
    },

    {
        id: 4,
        name: "Gaming Laptop",
        category: "laptop",
        categoryName: "لپ‌تاپ",
        description: "لپ‌تاپ قدرتمند مخصوص بازی",
        price: 78000,
        icon: "🎮"
    },

    {
        id: 5,
        name: "AirPods Pro",
        category: "audio",
        categoryName: "صوتی",
        description: "هدفون بی‌سیم با صدای فوق‌العاده",
        price: 12000,
        icon: "🎧"
    },

    {
        id: 6,
        name: "Headphone Max",
        category: "audio",
        categoryName: "صوتی",
        description: "هدفون حرفه‌ای با حذف نویز",
        price: 8500,
        icon: "🎧"
    },

    {
        id: 7,
        name: "Smart Watch",
        category: "accessory",
        categoryName: "لوازم جانبی",
        description: "ساعت هوشمند با امکانات کامل",
        price: 6500,
        icon: "⌚"
    },

    {
        id: 8,
        name: "Power Bank",
        category: "accessory",
        categoryName: "لوازم جانبی",
        description: "پاوربانک قدرتمند و سریع",
        price: 2500,
        icon: "🔋"
    }

];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


const productsContainer =
    document.getElementById("products-container");


/* نمایش محصولات */

function displayProducts(list) {

    productsContainer.innerHTML = "";

    if (list.length === 0) {

        productsContainer.innerHTML = `
            <div style="
                grid-column: 1/-1;
                text-align:center;
                padding:50px;
                color:#777;
            ">
                😔
                <h3>محصولی پیدا نشد</h3>
            </div>
        `;

        return;
    }


    list.forEach(product => {

        const isFavorite =
            favorites.includes(product.id);


        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                ${product.icon}

                <button
                    class="favorite ${isFavorite ? "active" : ""}"
                    onclick="toggleFavorite(${product.id})"
                >
                    ${isFavorite ? "❤️" : "🤍"}
                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.categoryName}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                        افغانی
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        + سبد
                    </button>

                </div>

            </div>
        `;


        productsContainer.appendChild(card);

    });

}


/* جستجو و فیلتر */

function filterProducts() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase()
            .trim();


    const category =
        document.getElementById("category").value;


    const sort =
        document.getElementById("sort").value;


    let result = products.filter(product => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search);


        const matchesCategory =
            category === "all" ||
            product.category === category;


        return matchesSearch && matchesCategory;

    });


    if (sort === "low") {

        result.sort((a,b) =>
            a.price - b.price
        );

    }


    if (sort === "high") {

        result.sort((a,b) =>
            b.price - a.price
        );

    }


    displayProducts(result);
}


/* افزودن به سبد */

function addToCart(id) {

    const product =
        products.find(p => p.id === id);


    if (!product) return;


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            icon: product.icon,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    showToast(
        "محصول به سبد خرید اضافه شد 🛒"
    );

}


/* ذخیره سبد */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* بروزرسانی سبد */

function updateCart() {

    const cartCount =
        document.getElementById("cart-count");


    const cartItems =
        document.getElementById("cart-items");


    const cartTotal =
        document.getElementById("cart-total");


    const totalQuantity =
        cart.reduce(
            (sum,item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                🛒

                <p>
                    سبد خرید شما خالی است
                </p>

            </div>
        `;

        cartTotal.textContent = "0";

        return;
    }


    let total = 0;


    cartItems.innerHTML = "";


    cart.forEach(item => {

        total +=
            item.price * item.quantity;


        const div =
            document.createElement("div");


        div.className =
            "cart-item";


        div.innerHTML = `

            <div class="cart-item-icon">
                ${item.icon}
            </div>


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                    افغانی
                </div>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            -1
                        )"
                    >
                        -
                    </button>

                </div>

            </div>


            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})"
            >
                🗑️
            </button>

        `;


        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        formatPrice(total);

}


/* تغییر تعداد */

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveCart();

    updateCart();

}


/* حذف */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    updateCart();

    showToast(
        "محصول از سبد حذف شد"
    );

}


/* باز کردن سبد */

function openCart() {

    document
        .getElementById("cart-sidebar")
        .classList
        .add("active");


    document
        .getElementById("cart-overlay")
        .classList
        .add("active");

}


/* بستن سبد */

function closeCart() {

    document
        .getElementById("cart-sidebar")
        .classList
        .remove("active");


    document
        .getElementById("cart-overlay")
        .classList
        .remove("active");

}


/* علاقه‌مندی */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

        showToast(
            "از علاقه‌مندی‌ها حذف شد"
        );

    } else {

        favorites.push(id);

        showToast(
            "به علاقه‌مندی‌ها اضافه شد ❤️"
        );

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    filterProducts();

}


/* حالت تاریک */

function toggleDarkMode() {

    document
        .body
        .classList
        .toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "darkMode",
        dark
    );

}


/* اعلان */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* پرداخت */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "سبد خرید شما خالی است"
        );

        return;
    }


    showToast(
        "صفحه پرداخت به‌زودی آماده می‌شود 💳"
    );

}


/* قیمت */

function formatPrice(price) {

    return price.toLocaleString("en-US");

}


/* حالت تاریک ذخیره شده */

if (
    localStorage.getItem("darkMode")
    === "true"
) {

    document.body.classList.add("dark");

}


/* اجرای اولیه */

displayProducts(products);

updateCart();
