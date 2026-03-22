import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🇺🇦 Локальні дані товарів
const localProducts = [
  {
    id: 1,
    name: 'Смартфон Samsung Galaxy A54',
    brand: 'Samsung',
    category: 'phones',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    isNew: true,
    image: '/images/samsung-a54.png',
    description: 'Сучасний смартфон з потрійною камерою 50 Мп',
    specs: ['128 ГБ', '6 ГБ RAM', '5000 мАг'],
    rating: 4.7,
    reviews: 342,
    inStock: true,
    delivery: '1-2 дні'
  },
  {
    id: 2,
    name: 'Навушники Xiaomi Redmi Buds 4',
    brand: 'Xiaomi',
    category: 'audio',
    price: 1299,
    image: '/images/redmi-buds.png',
    description: 'Бездротові навушники з активним шумозаглушенням',
    specs: ['ANC', '30 год', 'IPX4'],
    rating: 4.5,
    reviews: 189,
    inStock: true,
    delivery: '1-2 дні'
  },
  {
    id: 3,
    name: 'Розумний годинник Amazfit GTS 4',
    brand: 'Amazfit',
    category: 'wearables',
    price: 4999,
    image: '/images/amazfit-gts4.png',
    description: 'Стильний смарт-годинник з AMOLED-екраном',
    specs: ['1.75"', 'GPS', '14 днів'],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    delivery: '2-3 дні'
  },
  {
    id: 4,
    name: 'Ноутбук ASUS Vivobook 15',
    brand: 'ASUS',
    category: 'computers',
    price: 24999,
    originalPrice: 27999,
    discount: 11,
    image: '/images/asus-vivobook.png',
    description: 'Надійний ноутбук для роботи та навчання',
    specs: ['i5', '8 ГБ', '512 ГБ SSD'],
    rating: 4.4,
    reviews: 98,
    inStock: true,
    delivery: '3-5 днів'
  },
  {
    id: 5,
    name: 'Планшет Samsung Galaxy Tab A9',
    brand: 'Samsung',
    category: 'tablets',
    price: 7499,
    image: '/images/galaxy-tab-a9.png',
    description: 'Компактний планшет для розваг',
    specs: ['10.9"', '64 ГБ', '4 ГБ RAM'],
    rating: 4.3,
    reviews: 67,
    inStock: false,
    delivery: 'Очікується'
  },
  {
    id: 6,
    name: 'Екшн-камера GoPro HERO11',
    brand: 'GoPro',
    category: 'cameras',
    price: 14999,
    image: '/images/gopro-hero11.png',
    description: 'Професійна екшн-камера 5.3K',
    specs: ['5.3K', 'Waterproof', 'HyperSmooth'],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    delivery: '1-2 дні'
  }
];

// 🇺🇦 Форматування ціни в гривнях
export const formatPriceUAH = (price) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0
  }).format(price);
};

// 🇺🇦 Категорії
export const categoriesUA = [
  { id: 'all', name: 'Усе', icon: '🏪' },
  { id: 'phones', name: 'Смартфони', icon: '📱' },
  { id: 'audio', name: 'Аудіо', icon: '🎧' },
  { id: 'wearables', name: 'Годинники', icon: '⌚' },
  { id: 'computers', name: 'Ноутбуки', icon: '💻' },
  { id: 'tablets', name: 'Планшети', icon: '📟' },
  { id: 'cameras', name: 'Камери', icon: '📷' },
  { id: 'accessories', name: 'Аксесуари', icon: '🔌' }
];

// 🇺🇦 Async thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return localProducts;
  }
);

// 🇺🇦 Початковий стан
const initialState = {
  items: [],
  cart: [],
  favorites: [],
  status: 'idle',
  error: null,
  filter: '',
  category: 'all',
  sortBy: 'popular',
  priceRange: { min: 0, max: 100000 },
  viewMode: 'grid'
};

// 🇺🇦 Create Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1, addedAt: Date.now() });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item && quantity >= 1) item.quantity = quantity;
    },
    clearCart: (state) => { state.cart = []; },
    toggleFavorite: (state, action) => {
      const idx = state.favorites.indexOf(action.payload);
      if (idx === -1) state.favorites.push(action.payload);
      else state.favorites.splice(idx, 1);
    },
    setFilter: (state, action) => { state.filter = action.payload; },
    setCategory: (state, action) => { state.category = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setPriceRange: (state, action) => {
      state.priceRange = { ...state.priceRange, ...action.payload };
    },
    setViewMode: (state, action) => { state.viewMode = action.payload; },
    resetFilters: (state) => {
      state.filter = '';
      state.category = 'all';
      state.sortBy = 'popular';
      state.priceRange = { min: 0, max: 100000 };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Помилка';
      });
  }
});

export const {
  addToCart, removeFromCart, updateQuantity, clearCart,
  toggleFavorite, setFilter, setCategory, setSortBy,
  setPriceRange, setViewMode, resetFilters
} = productsSlice.actions;

export default productsSlice.reducer;