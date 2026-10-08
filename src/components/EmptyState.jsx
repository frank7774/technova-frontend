export default function EmptyState({ message = 'No hay información disponible' }) {
  return (
    <div className="empty-box">
      <div className="empty-icon">📦</div>
      <h3>{message}</h3>
      <p>Intenta ajustar tus filtros o vuelve más tarde</p>
    </div>
  );
}