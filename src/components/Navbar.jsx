import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((a, i) => a + i.cantidad, 0);
  const linkCls = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-logo">N</span>
        <span className="brand-name">TechNova</span>
      </Link>
      <div className="navbar-links">
        <NavLink to="/" end className={linkCls}>Inicio</NavLink>
        <NavLink to="/catalogo" className={linkCls}>Catálogo</NavLink>
        <NavLink to="/promociones" className={linkCls}>Promos</NavLink>
        <Link to="/carrito" className="cart-btn">
          <span>Carrito</span>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
      </div>
    </nav>
  );
}