"use client";

import { Breadcrumb } from "antd";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CustomBreadcrumb() {
    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);

    const breadcrumbItems = pathParts.map((part, index) => {
        const href = "/" + pathParts.slice(0, index + 1).join("/");
        return {
            title: part.charAt(0).toUpperCase() + part.slice(1),
            href,
        };
    });

    function itemRender(route: ItemType, _: unknown, routes: ItemType[], __: string[]) {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
            <span>{route.title}</span>
        ) : (
            <Link href={route.href ?? "/"}>{route.title}</Link>
        );
    }

    return (
        <Breadcrumb
            itemRender={itemRender}
            items={breadcrumbItems}
        />
    );
}