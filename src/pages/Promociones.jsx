import { Link } from 'react-router-dom';
import { getPromociones } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { formatPrecio } from '../utils/format';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Promociones() {
  const { data, loading, error } = useFetch(() => getPromociones(), []);
  if (loading) return <Loader />;
  if (error) return <div className="container"><ErrorMessage message={error} /></div>;

  return (
    <div className="container">
      <h1>Promociones</h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Aprovecha nuestros descuentos exclusivos</p>
      {!data?.length ? (
        <EmptyState message="No hay promociones activas" />
      ) : (
        <div className="grid" style={{ marginTop: '2.5rem' }}>
          {data.map((p) => (
            <article key={p.id} className="promo-card-exclusive">
              {p.producto && (
                <Link to={`/producto/${p.producto.id}`} className="promo-card-img">
                  <img src={p.producto.imagen} alt={p.titulo} loading="lazy" />
                  <span className="promo-card-discount">-{p.descuento}% OFF</span>
                </Link>
              )}
              <div className="promo-card-content">
                <span className="promo-card-label">Oferta limitada</span>
                <h3>{p.titulo}</h3>
                <p>{p.descripcion}</p>
                {p.producto && (
                  <div className="promo-card-price">
                    <span className="promo-card-price-new">
                      {formatPrecio(p.producto.precio * (1 - p.descuento / 100))}
                    </span>
                    <span className="promo-card-price-old">{formatPrecio(p.producto.precio)}</span>
                  </div>
                )}
                <div className="promo-card-footer">
                  <span className="promo-card-ends">
                    Termina {new Date(p.fechaFin).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                  </span>
                  {p.producto && (
                    <Link to={`/producto/${p.producto.id}`} className="promo-card-btn">
                      Ver producto
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}