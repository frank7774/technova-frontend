import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { crearCliente, crearPedido } from '../services/api';
import { formatPrecio } from '../utils/format';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '', metodoPago: 'tarjeta' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true); setError(null);
    try {
      const cliente = await crearCliente({ nombre: form.nombre, email: form.email, telefono: form.telefono, direccion: form.direccion });
      const pedido = await crearPedido({
        clienteId: cliente.id,
        metodoPago: form.metodoPago,
        items: cart.map((i) => ({ productoId: i.id, cantidad: i.cantidad }))
      });
      setExito(pedido); clearCart();
    } catch (err) { setError(err.message); } finally { setEnviando(false); }
  };

  if (exito) {
    return (
      <div className="container">
        <div className="form-box success-box">
          <div className="success-icon">✓</div>
          <h2>¡Pedido registrado!</h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Gracias por tu compra. Hemos recibido tu pedido.</p>
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>NÚMERO DE PEDIDO</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-600)' }}>#{String(exito.id).padStart(6, '0')}</div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>TOTAL PAGADO</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>{formatPrecio(exito.total)}</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="form-box success-box">
          <h2>Tu carrito está vacío</h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Agrega productos para continuar</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalogo')} style={{ marginTop: '1rem' }}>Ir al catálogo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Finalizar compra</h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Completa tus datos para procesar el pedido</p>

      <form className="form-box" onSubmit={enviar}>
        <div className="form-field">
          <label>Nombre completo</label>
          <input name="nombre" placeholder="Ej. Andrea Torres" required value={form.nombre} onChange={cambiar} />
        </div>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input name="email" type="email" placeholder="tu@correo.com" required value={form.email} onChange={cambiar} />
        </div>
        <div className="form-field">
          <label>Teléfono</label>
          <input name="telefono" placeholder="999 888 777" value={form.telefono} onChange={cambiar} />
        </div>
        <div className="form-field">
          <label>Dirección de envío</label>
          <input name="direccion" placeholder="Av. Ejemplo 123, Lima" value={form.direccion} onChange={cambiar} />
        </div>
        <div className="form-field">
          <label>Método de pago</label>
          <select name="metodoPago" value={form.metodoPago} onChange={cambiar}>
            <option value="tarjeta">💳 Tarjeta de crédito/débito</option>
            <option value="efectivo">💵 Efectivo contra entrega</option>
            <option value="transferencia">🏦 Transferencia bancaria</option>
          </select>
        </div>

        <div className="order-summary-box">
          <strong>Total a pagar</strong>
          <span>{formatPrecio(total)}</span>
        </div>

        {error && <div className="error-box" style={{ padding: '1rem', margin: 0 }}>{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={enviando} style={{ padding: '0.9rem' }}>
          {enviando ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
}