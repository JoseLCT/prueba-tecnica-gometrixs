"use client";

import { Spin } from "antd";
import { Suspense } from "react";
import { ClienteFormScreen } from "~/app/_components/clientes/cliente-form-screen";

export default function Page() {
    return (
        <Suspense fallback={<Spin spinning={true} fullscreen />}>
            <ClienteFormScreen />
        </Suspense>
    );
}