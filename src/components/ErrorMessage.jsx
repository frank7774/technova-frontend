export default function ErrorMessage({ message }) {
  return (
    <div className="error-box">
      <div className="error-icon">⚠️</div>
      <h3>Algo salió mal</h3>
      <p>{message}</p>
    </div>
  );
}