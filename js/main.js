

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
<div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info" >
                        <h1>{{ title }}</h1>
                        <span v-show="onSale">{{ sale }}</span>
                        <p v-if="inStock > 10">In Stock</p>
                        <p v-else-if="inStock <= 10 && inStock > 0">Almost sold out!</p>
                        <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
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
                                 @click="decreaseCart" class="deleteFromCart"
                        >
                            <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button>
                        <br>
                        <a :href="link">More products like this</a>
                    </div>
                            <product-tabs :reviews="reviews"></product-tabs>
                </div>

`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: 'sale',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'lime',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10

                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);
            },
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        decreaseCart() {
            this.$emit('delete-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product + ' ' + this.onSale;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
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
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
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

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul><li v-for="error in errors">{{ error }}</li></ul>
    <p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
         <label for="rating">Rating:</label>
         <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
         </select>
      </p>
             <label for="recommend" >Would you recommend this product?</label><br>
             <input type="radio" id="yes" name="recommend" value="yes">
             <label for="yes" >Yes</label><br>
             <input type="radio" id="no" name="recommend" value="no">
             <label for="no" >No</label><br>
      <p>
        <input type="submit" value="Submit">
      </p>
</form>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommended: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend !== null) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if (this.recommend === null) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    template: `
    <div>
      <ul>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab">{{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Отзывы'">
        <p v-if="!reviews.length">Отзывов пока нет.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Оценка: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
      <div v-show="selectedTab === 'Оставить отзыв'">
        <product-review @review-submitted="addReview"></product-review>
      </div>
      <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }} Free</p>
      </div>
      <div v-show="selectedTab === 'Details'">
             <ul>
                <product-details></product-details>
            </ul>
      </div>
    </div>
  `,
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tabs: ['Отзывы', 'Оставить отзыв', 'Shipping', 'Details'],
            selectedTab: 'Отзывы'
        };
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    }
});



let app = new Vue({

    el: '#app',
    data: {
        premium: true,
        cart: []
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

