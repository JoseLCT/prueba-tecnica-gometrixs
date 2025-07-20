"use client";

import { Spin } from "antd";
import { Suspense } from "react";
import { ProductoFormScreen } from "~/app/_components/productos/producto-form-screen";

export default function Page() {
    return (
        <Suspense fallback={<Spin spinning={true} fullscreen />}>
            <ProductoFormScreen />
        </Suspense>
    );
}