import { useParams, Link } from 'react-router-dom';
import { getProducto } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { formatPrecio, precioConDescuento } from '../utils/format';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { data: producto, loading, error } = useFetch(() => getProducto(id), [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container"><ErrorMessage message={error} /></div>;
  if (!producto) return null;

  const precioFinal = precioConDescuento(producto.precio, producto.descuento);

  return (
    <div className="container">
      <Link to="/catalogo" className="detail-back">← Volver al catálogo</Link>
      <div className="detalle">
        <div className="detail-img">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="detail-info">
          <div className="detail-brand">{producto.marca?.nombre} · {producto.categoria?.nombre}</div>
          <h1>{producto.nombre}</h1>
          <p className="detail-desc">{producto.descripcion}</p>

          <div className="detail-price-row">
            {producto.descuento > 0 ? (
              <>
                <span className="detail-price discounted">{formatPrecio(precioFinal)}</span>
                <span className="detail-price-old">{formatPrecio(producto.precio)}</span>
                <span className="card-badge">-{producto.descuento}%</span>
              </>
            ) : (
              <span className="detail-price">{formatPrecio(producto.precio)}</span>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span className={'stock-chip ' + (producto.stock > 0 ? 'in' : 'out')}>
              {producto.stock > 0 ? `En stock — ${producto.stock} unidades` : 'Agotado'}
            </span>
          </div>

          {producto.promociones?.length > 0 && (
            <div className="promo-alert">
              <strong>🎉 Promociones vigentes</strong>
              <ul>
                {producto.promociones.map((pr) => (
                  <li key={pr.id}>• {pr.titulo} — <strong>{pr.descuento}% de descuento</strong></li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn btn-primary" onClick={() => addItem(producto)} disabled={producto.stock <= 0}>
            {producto.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
}