"use client";

import { Spin } from "antd";
import { Suspense } from "react";
import { VentaFormScreen } from "~/app/_components/ventas/venta-form-screen";

export default function Page() {
    return (
        <Suspense fallback={<Spin spinning={true} fullscreen />}>
            <VentaFormScreen />
        </Suspense>
    );
}