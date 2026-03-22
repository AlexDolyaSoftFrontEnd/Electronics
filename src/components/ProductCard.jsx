import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, formatPriceUAH } from '../slices/productsSlice';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="product-card" style={{animationDelay:`${index*50}ms`}}>
      {product.isNew && <span className="badge new">Новинка</span>}
      {product.discount && <span className="badge sale">−{product.discount}%</span>}

      <div className="product-image">
        {!loaded && <div className="skeleton" />}
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          onLoad={()=>setLoaded(true)}
          onError={(e)=>{e.target.src='https://placehold.co/400x400/f5f5f7/1d1d1f?text=📦'; setLoaded(true);}}
        />
      </div>

      <div className="product-info">
        <div className="brand">{product.brand}</div>
        <h3 className="name">{product.name}</h3>
        <p className="desc">{product.description}</p>
        
        {product.specs && (
          <div className="specs">
            {product.specs.slice(0,2).map((s,i)=><span key={i} className="spec">{s}</span>)}
          </div>
        )}

        <div className="actions">
          <div className="price-block">
            <span className="price">{formatPriceUAH(product.price)}</span>
            {product.originalPrice && <span className="old-price">{formatPriceUAH(product.originalPrice)}</span>}
          </div>
          <button className="buy-btn" onClick={()=>dispatch(addToCart(product))}>
            Купити →
          </button>
        </div>

        <div className={`stock ${product.inStock?'in':'out'}`}>
          <span className="dot" /> {product.inStock ? 'В наявності' : 'Немає в наявності'}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;