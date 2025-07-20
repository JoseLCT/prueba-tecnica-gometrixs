import { VentasScreen } from "../_components/ventas/ventas-screen";
import { VentasProvider } from "../_providers/ventas-provider";

export default function Page() {
    return (
        <VentasProvider>
            <VentasScreen />
        </VentasProvider>
    )
}