import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrecio, precioConDescuento } from '../utils/format';
export default function ProductCard({ producto }) {
  const { addItem } = useCart();
  const precioFinal = precioConDescuento(producto.precio, producto.descuento);
  return (
    <article className="card">
      <Link to={`/producto/${producto.id}`} className="card-img-wrap">
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        {producto.descuento > 0 && <span className="card-badge">-{producto.descuento}%</span>}
        {producto.descuento === 0 && producto.destacado && <span className="card-badge top">★ Top</span>}
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span>{producto.marca?.nombre}</span>
          <span className="dot" />
          <span>{producto.categoria?.nombre}</span>
        </div>
        <Link to={`/producto/${producto.id}`} className="card-title">{producto.nombre}</Link>
        <div className="card-price-row">
          {producto.descuento > 0 ? (
            <>
              <span className="card-price discounted">{formatPrecio(precioFinal)}</span>
              <span className="card-old">{formatPrecio(producto.precio)}</span>
            </>
          ) : (
            <span className="card-price">{formatPrecio(producto.precio)}</span>
          )}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={() => addItem(producto)}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}