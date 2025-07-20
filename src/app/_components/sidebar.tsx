"use client";

import { ProductFilled, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, type GetProp, type MenuProps } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = GetProp<MenuProps, 'items'>[number];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const selectedKey = pathname?.split("/")[1] ?? "productos";

    const menuItems: MenuItem[] = [
        {
            key: 'productos',
            label: 'Productos',
            icon: <ProductFilled />
        },
        {
            key: 'clientes',
            label: 'Clientes',
            icon: <UserOutlined />
        },
        {
            key: 'ventas',
            label: 'Ventas',
            icon: <ShoppingCartOutlined />
        },
    ];

    const handleMenuClick: MenuProps['onSelect'] = (info) => {
        router.push(`/${info.key}`);
    };

    return (
        <>
            <div className="w-80 h-20 absolute top-0 left-0 p-5">
                <Image
                    src="/logo-dark.svg"
                    alt="Logo"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                />
            </div>
            <Menu
                className="!w-80 !pt-20 !pb-5 !px-5"
                mode="inline"
                items={menuItems}
                onSelect={handleMenuClick}
                selectedKeys={[selectedKey]}
            />
        </>
    )
}