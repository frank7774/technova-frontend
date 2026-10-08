import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductos, getCategorias, getMarcas } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Catalogo() {
  const [params] = useSearchParams();
  const [filtros, setFiltros] = useState({
    search: '', categoria: params.get('categoria') || '', marca: '',
    min: '', max: '', sort: 'nombre', page: 1
  });
  const { data: categorias } = useFetch(() => getCategorias(), []);
  const { data: marcas } = useFetch(() => getMarcas(), []);
  const { data, loading, error } = useFetch(() => getProductos(filtros), [JSON.stringify(filtros)]);
  const cambiar = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value, page: 1 });

  return (
    <div className="container">
      <h1>Catálogo</h1>
      <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Explora toda nuestra colección de productos</p>

      <div className="filters-card">
        <div className="search-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input className="search-input" name="search" placeholder="Buscar productos..." value={filtros.search} onChange={cambiar} />
        </div>
        <div className="filters-row">
          <select name="categoria" value={filtros.categoria} onChange={cambiar}>
            <option value="">Todas las categorías</option>
            {categorias?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select name="marca" value={filtros.marca} onChange={cambiar}>
            <option value="">Todas las marcas</option>
            {marcas?.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <input name="min" type="number" placeholder="Precio mín." value={filtros.min} onChange={cambiar} />
          <input name="max" type="number" placeholder="Precio máx." value={filtros.max} onChange={cambiar} />
          <select name="sort" value={filtros.sort} onChange={cambiar}>
            <option value="nombre">Ordenar por nombre</option>
            <option value="precio">Menor precio</option>
            <option value="-precio">Mayor precio</option>
          </select>
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && data?.productos?.length === 0 && <EmptyState message="No se encontraron productos" />}
      {!loading && !error && data?.productos?.length > 0 && (
        <>
          <div className="results-count">
            <span>Mostrando <strong>{data.productos.length}</strong> de <strong>{data.total}</strong> productos</span>
            <span>Página {data.page} de {data.totalPages}</span>
          </div>
          <div className="grid">
            {data.productos.map((p) => <ProductCard key={p.id} producto={p} />)}
          </div>
          <div className="paginacion">
            <button disabled={filtros.page <= 1} onClick={() => setFiltros({ ...filtros, page: filtros.page - 1 })}>← Anterior</button>
            <span>Página {data.page} / {data.totalPages}</span>
            <button disabled={filtros.page >= data.totalPages} onClick={() => setFiltros({ ...filtros, page: filtros.page + 1 })}>Siguiente →</button>
          </div>
        </>
      )}
    </div>
  );
}