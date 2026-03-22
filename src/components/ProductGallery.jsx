import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProducts, setFilter, setCategory, setSortBy,
  setPriceRange, setViewMode, resetFilters,
  formatPriceUAH, categoriesUA
} from '../slices/productsSlice';
import ProductCard from './ProductCard';
import Cart from './Cart';
import './ProductGallery.css';

const ProductGallery = () => {
  const dispatch = useDispatch();
  const { items, cart, status, error, filter, category, sortBy, priceRange, viewMode } = 
    useSelector(state => state.products);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  const filteredProducts = useMemo(() => {
    let result = [...items];
    
    if (filter) {
      const s = filter.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s)
      );
    }
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    switch (sortBy) {
      case 'price-asc': result.sort((a,b) => a.price - b.price); break;
      case 'price-desc': result.sort((a,b) => b.price - a.price); break;
      case 'rating': result.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
      case 'newest': result.sort((a,b) => (b.isNew?1:0) - (a.isNew?1:0)); break;
      default: result.sort((a,b) => (b.reviews||0) - (a.reviews||0));
    }
    return result;
  }, [items, filter, category, priceRange, sortBy]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const availableCats = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return categoriesUA.filter(c => c.id === 'all' || cats.has(c.id));
  }, [items]);

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Завантаження товарів...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="error-container">
        <span className="error-icon">⚠️</span>
        <h2>Помилка завантаження</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProducts())}>🔄 Спробувати знову</button>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Мобільна кнопка кошика */}
      <button 
        className={`mobile-cart-btn ${cartCount > 0 ? 'has-items' : ''}`}
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {/* Заголовок */}
      <header className="gallery-header">
        <div className="header-top">
          <div className="title-section">
            <h1>Електроніка</h1>
          </div>
          <div className="view-toggle">
            <button className={viewMode==='grid'?'active':''} onClick={()=>dispatch(setViewMode('grid'))}>⊞</button>
            <button className={viewMode==='list'?'active':''} onClick={()=>dispatch(setViewMode('list'))}>☰</button>
          </div>
        </div>

        {/* Пошук */}
        <div className="search-bar">
          <span>🔍</span>
          <input 
            type="search" 
            placeholder="Пошук товарів..." 
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          {filter && <button className="clear-search" onClick={()=>dispatch(setFilter(''))}>✕</button>}
        </div>

        {/* Фільтри */}
        <div className="filters-section">
          <button className="mobile-filter-toggle" onClick={()=>setShowFilters(!showFilters)}>
            ⚙️ Фільтри
          </button>
          <div className={`category-scroll ${showFilters?'show':''}`}>
            {availableCats.map(cat => (
              <button 
                key={cat.id}
                className={`category-btn ${category===cat.id?'active':''}`}
                onClick={() => dispatch(setCategory(cat.id))}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <div className="controls">
            <select value={sortBy} onChange={(e)=>dispatch(setSortBy(e.target.value))}>
              <option value="popular">За популярністю</option>
              <option value="newest">Новинки</option>
              <option value="price-asc">Ціна: низька → висока</option>
              <option value="price-desc">Ціна: висока → низька</option>
              <option value="rating">За рейтингом</option>
            </select>
            <span>Знайдено: <strong>{filteredProducts.length}</strong></span>
            {(filter || category!=='all') && (
              <button className="reset-btn" onClick={()=>dispatch(resetFilters())}>🔄 Скинути</button>
            )}
          </div>
        </div>
      </header>

      {/* Контент */}
      <div className="gallery-content">
        <main className={`products-section ${viewMode}`}>
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <span className="no-icon">🔍</span>
              <h3>Товари не знайдено</h3>
              <p>Спробуйте змінити параметри пошуку</p>
              <button onClick={()=>dispatch(resetFilters())}>🔄 Скинути фільтри</button>
            </div>
          ) : (
            <div className={`products-grid ${viewMode}`}>
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </main>
        
        <aside className={`cart-section ${isCartOpen?'open':''}`}>
          <div className="cart-header-mobile">
            <h2>🛒 Кошик</h2>
            <button onClick={()=>setIsCartOpen(false)}>✕</button>
          </div>
          <Cart />
        </aside>
        {isCartOpen && <div className="cart-overlay" onClick={()=>setIsCartOpen(false)} />}
      </div>

      {/* Футер */}
      <footer className="gallery-footer">
        <p className="copyright">Електроніка</p>
      </footer>
    </div>
  );
};

export default ProductGallery;
