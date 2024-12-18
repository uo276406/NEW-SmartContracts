import { Link } from "react-router-dom";

export function App() {
  return (
    <div>
      <h1>App</h1>
      <Link to="/ejercicio1">Ejercicio 1</Link>
      <br />
      <Link to="/ejercicio2">Ejercicio 2</Link>
      <br />
      <Link to="/ejercicio3">Ejercicio 3</Link>
    </div>
  );
}
