Vue.component('product-review', {
    template: `
<input>
`,
    data() {
        return {
            name: null
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `<div class="product">
                    <div class="product-image">
                        <img :src="image" :alt="altText"/>
                    </div>
                    <div class="product-info" >
                        <h1>{{ title }}</h1>
                        <p>{{ description }}</p>
                        <span v-show="onSale">{{ sale }}</span>
                        <p v-if="inventory > 10">In Stock</p>
                        <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                        <p v-else :class="{outOfStock: !inventory}">Out of Stock</p>
                           <product-details></product-details>
                        <b>Sizes</b>
                        <ul>
                            <li v-for="size in sizes">{{ size }}</li>
                        </ul>
                        <p>Shipping: {{ shipping }}</p>
                        <b>Variants</b>
                        <div class="color-box"
                             v-for="(variant, index) in variants"
                             :key="variant.variantId"
                             :style="{ backgroundColor:variant.variantColor }"
                             @mouseover="updateProduct(index)"
                        >
                        </div>
                        <button @click="addToCart"
                                :disabled="!inStock"
                                :class="{ disabledButton: !inStock }"
                        >
                            Add to cart
                        </button>
                        <button
                                @click="deleteFromCart" class="deleteFromCart"
                        >
                            <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button>
                        <br>
                        <a :href="link">More products like this</a>
                    </div>
                </div>
        </div>`,
    data() {
        return {
            product: "Socks",
            brand: "Nosocks",
            description: "A pair warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral',],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;

        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            return  'This ' + this.product + ' from ' + this.brand + ' is discounted';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }

})
Vue.component('product-details', {
    template: `
        <ul>
            <li v-for="detail in details" >{{ detail }}</li>
        </ul>
   `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral']
        }
    }
})
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart() {

            if (this.cart.length <= 0) {
                return this.cart.length;
            } else
                this.cart.splice(this.cart.length -1,1);
        }
    }
})