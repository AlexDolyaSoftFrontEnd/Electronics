import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, formatPriceUAH } from '../slices/productsSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.products.cart);
  
  // Стани для модального вікна та форми
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    delivery: 'nova-poshta',
    comment: ''
  });

  const totalItems = cart.reduce((s,i)=>s+i.quantity,0);
  const totalPrice = cart.reduce((s,i)=>s+i.price*i.quantity,0);

  const handleOpenCheckout = () => {
    setIsModalOpen(true);
    setOrderComplete(false);
  };

  const handleCloseModal = () => {
    if (!processing) {
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', delivery: 'nova-poshta', comment: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setProcessing(true);
    
    // Імітація запиту на сервер
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      dispatch(clearCart());
      
      // Закрити модальне вікно через 3 секунди після успіху
      setTimeout(() => {
        setIsModalOpen(false);
        setOrderComplete(false);
      }, 3000);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <aside className="cart-sidebar">
        <h2>🛒 Кошик</h2>
        <div className="empty">
          <span className="empty-icon">📦</span>
          <p>Ваш кошик порожній</p>
          <p className="hint">Додайте товари з каталогу</p>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="cart-sidebar">
        <header className="cart-header">
          <h2>🛒 Кошик <span className="count">({totalItems})</span></h2>
          <button className="clear-link" onClick={()=>dispatch(clearCart())}>Очистити</button>
        </header>

        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} onError={(e)=>{e.target.src='https://placehold.co/70x70/f5f5f7/1d1d1f?text=📦'}} />
              <div className="item-info">
                <div className="item-brand">{item.brand}</div>
                <h4 className="item-name">{item.name}</h4>
                <div className="item-price">{formatPriceUAH(item.price)}</div>
                <div className="qty-controls">
                  <button onClick={()=>dispatch(updateQuantity({id:item.id, quantity:Math.max(1,item.quantity-1)}))}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={()=>dispatch(updateQuantity({id:item.id, quantity:item.quantity+1}))}>+</button>
                </div>
              </div>
              <button className="remove-btn" onClick={()=>dispatch(removeFromCart(item.id))}>×</button>
              <div className="item-total">{formatPriceUAH(item.price*item.quantity)}</div>
            </div>
          ))}
        </div>

        <footer className="cart-footer">
          <div className="summary">
            <div className="row"><span>Товари:</span><span>{formatPriceUAH(totalPrice)}</span></div>
            <div className="row"><span>Доставка:</span><span className="free">Безкоштовно</span></div>
            <div className="divider" />
            <div className="row total"><span>До сплати:</span><span>{formatPriceUAH(totalPrice)}</span></div>
          </div>
          <button className="checkout-btn" onClick={handleOpenCheckout} disabled={processing}>
            Оформити замовлення
          </button>
          <p className="secure">🔐 Безпечне з'єднання</p>
        </footer>
      </aside>

      {/* Модальне вікно оформлення */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✕</button>
            
            {orderComplete ? (
              <div className="order-success">
                <div className="success-icon">✅</div>
                <h3>Замовлення успішно оформлено!</h3>
                <p>Дякуємо, {formData.name}. Ми зв'яжемося з вами за номером {formData.phone}.</p>
                <div className="success-amount">Сума: {formatPriceUAH(totalPrice)}</div>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>Оформлення замовлення</h3>
                  <p className="modal-subtitle">Сума до сплати: <strong>{formatPriceUAH(totalPrice)}</strong></p>
                </div>

                <form className="checkout-form" onSubmit={handleSubmitOrder}>
                  <div className="form-group">
                    <label>Ваше ім'я</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Іван Петренко" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Номер телефону</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+380 (99) 000-00-00" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Спосіб доставки</label>
                    <select name="delivery" value={formData.delivery} onChange={handleInputChange}>
                      <option value="nova-poshta">Нова Пошта (відділення)</option>
                      <option value="nova-poshta-courier">Нова Пошта (Кур'єр)</option>
                      <option value="ukrposhta">Укрпошта</option>
                      <option value="self">Самовивіз</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Коментар до замовлення</label>
                    <textarea 
                      name="comment" 
                      value={formData.comment} 
                      onChange={handleInputChange} 
                      placeholder="Побажання або номер відділення..." 
                      rows="3"
                    />
                  </div>

                  <button type="submit" className="submit-order-btn" disabled={processing}>
                    {processing ? 'Обробка...' : 'Підтвердити замовлення'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;