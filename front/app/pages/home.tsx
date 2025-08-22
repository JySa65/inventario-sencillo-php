import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inventario Secillo" },
  ];
}

export default function Home() {
  return (
     <nav>
        <Link to="/items">Items</Link> |{" "}
        <Link to="/stocks">Stocks</Link> |{" "}
        <Link to="/health">Health</Link> |{" "}
        <Link to="/warehouses">Warehouses</Link>
      </nav>
  )

}
