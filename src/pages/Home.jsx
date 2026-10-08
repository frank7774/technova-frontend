import { Link } from 'react-router-dom';
import { getProductos, getCategorias, getPromociones } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { formatPrecio } from '../utils/format';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const { data: destacados, loading, error } = useFetch(() => getProductos({ destacado: true, limit: 4 }), []);
  const { data: categorias } = useFetch(() => getCategorias(), []);
  const { data: promos } = useFetch(() => getPromociones(), []);

  return (
    <>
      <section className="hero-video">
        <video className="hero-video-bg" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600">
          <source src="https://videos.pexels.com/video-files/3141210/3141210-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />

        <div className="hero-inner">
          <div className="hero-meta">
            <span className="hero-meta-line" />
            <span className="hero-meta-text">Colección 2026 · Edición Limitada</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Tecnología</span>
            <span className="hero-title-line hero-title-accent">
              <em>premium</em>
            </span>
            <span className="hero-title-line hero-title-small">al alcance de un clic</span>
          </h1>

          <p className="hero-lede">
            Curaduría de dispositivos de alta gama. Productos originales,
            garantía oficial y entrega express a todo el país.
          </p>

          <div className="hero-actions">
            <Link to="/catalogo" className="btn btn-white">Explorar catálogo →</Link>
            <Link to="/promociones" className="btn btn-ghost">Ver promociones</Link>
          </div>
        </div>

        <div className="hero-video-caption">
          <span>Showroom 2026</span>
          <span className="hero-caption-dot" />
          <span>Lima · Perú</span>
        </div>
      </section>

      <div className="container">
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <>
            <section className="section">
              <div className="section-head">
                <h2>Categorías</h2>
                <Link to="/catalogo" className="section-link">Ver todas →</Link>
              </div>
              <div className="grid">
                {categorias?.map((c) => (
                  <Link to={`/catalogo?categoria=${c.id}`} key={c.id} className="cat-card">
                    <img src={c.imagen} alt={c.nombre} loading="lazy" />
                    <div className="cat-card-body">
                      <h3>{c.nombre}</h3>
                      <p>{c.descripcion}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <h2>Productos destacados</h2>
                <Link to="/catalogo" className="section-link">Ver más →</Link>
              </div>
              {!destacados?.productos?.length ? (
                <EmptyState message="Aún no hay productos destacados" />
              ) : (
                <div className="grid">
                  {destacados.productos.map((p) => <ProductCard key={p.id} producto={p} />)}
                </div>
              )}
            </section>

            <section className="section">
              <div className="section-head">
                <h2>Promociones vigentes</h2>
              </div>
              {!promos?.length ? (
                <EmptyState message="No hay promociones activas" />
              ) : (
                <div className="grid">
                  {promos.map((p) => (
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
            </section>
          </>
        )}
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <span className="navbar-brand-logo">N</span>
              TechNova
            </div>
            <p>Curaduría de tecnología de alta gama. Productos originales, garantía oficial y envío a todo el país.</p>
          </div>
          <div>
            <h4>Tienda</h4>
            <ul>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/promociones">Promociones</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a>ventas@technova.pe</a></li>
              <li><a>+51 999 888 777</a></li>
              <li><a>Lima, Perú</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 TechNova Store — Todos los derechos reservados</div>
      </footer>
    </>
  );
}