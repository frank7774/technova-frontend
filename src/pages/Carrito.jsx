import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrecio, precioConDescuento } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Carrito() {
  const { cart, removeItem, updateCantidad, total, clearCart } = useCart();
  const subtotal = cart.reduce((a, i) => a + i.precio * i.cantidad, 0);
  const ahorro = subtotal - total;

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Tu carrito</h1>
        <EmptyState message="Tu carrito está vacío" />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Tu carrito</h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>{cart.length} producto(s) en tu carrito</p>
      <div className="cart-layout">
        <div>
          {cart.map((item) => {
            const precioFinal = precioConDescuento(item.precio, item.descuento);
            return (
              <div key={item.id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <strong>{item.nombre}</strong>
                  <span className="cart-item-price">{formatPrecio(precioFinal)}</span>
                  {item.descuento > 0 && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      <span style={{ textDecoration: 'line-through' }}>{formatPrecio(item.precio)}</span> · -{item.descuento}%
                    </div>
                  )}
                </div>
                <input className="qty-input" type="number" min="1" value={item.cantidad} onChange={(e) => updateCantidad(item.id, e.target.value)} />
                <button className="btn btn-danger-ghost" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            );
          })}
          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={clearCart}>Vaciar carrito</button>
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Resumen del pedido</h3>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
          {ahorro > 0 && (
            <div className="summary-row" style={{ color: '#059669' }}>
              <span>Ahorro</span><span>- {formatPrecio(ahorro)}</span>
            </div>
          )}
          <div className="summary-row"><span>Envío</span><span>Gratis</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrecio(total)}</span></div>
          <Link to="/checkout" className="btn btn-primary">Finalizar compra</Link>
        </aside>
      </div>
    </div>
  );
}