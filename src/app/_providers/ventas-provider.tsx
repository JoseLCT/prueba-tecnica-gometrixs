"use client";

import { createContext, useContext, useMemo, useState } from "react";

type FiltrosVenta = {
    clientesIds?: number[];
    productosIds?: number[];
};

type VentasContextType = {
    filtros: FiltrosVenta;
    setFiltros: (filtros: FiltrosVenta) => void;
    resetFiltros: () => void;
};

const VentasContext = createContext<VentasContextType | undefined>(undefined);

export const VentasProvider = ({ children }: { children: React.ReactNode }) => {
    const [filtros, setFiltros] = useState<FiltrosVenta>({});

    const resetFiltros = () => {
        setFiltros({});
    };

    const contextValue = useMemo(
        () => ({ filtros, setFiltros, resetFiltros }),
        [filtros]
    );

    return (
        <VentasContext.Provider value={contextValue}>
            {children}
        </VentasContext.Provider>
    );
};

export const useVentas = () => {
    const context = useContext(VentasContext);
    if (!context) {
        throw new Error("useVentas debe usarse dentro de un VentasProvider");
    }
    return context;
};
