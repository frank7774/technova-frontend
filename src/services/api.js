const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || 'Error al conectar con la API'); }
  return res.json();
}
export const getProductos = (params = {}) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)).toString();
  return request(`/productos?${query}`);
};
export const getProducto = (id) => request(`/productos/${id}`);
export const getCategorias = () => request('/categorias');
export const getMarcas = () => request('/marcas');
export const getPromociones = () => request('/promociones');
export const getClientes = () => request('/clientes');
export const getPedidos = (clienteId) => request(`/pedidos${clienteId ? `?clienteId=${clienteId}` : ''}`);
export const crearCliente = (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) });
export const crearPedido = (data) => request('/pedidos', { method: 'POST', body: JSON.stringify(data) });