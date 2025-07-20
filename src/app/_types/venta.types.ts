export interface DetalleVentaFormValues {
    productoId: number;
    cantidad: number;
}

export interface VentaFormValues {
    clienteId: number;
    detalles: DetalleVentaFormValues[];
}