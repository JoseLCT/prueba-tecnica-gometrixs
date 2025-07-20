import { Space } from "antd";
import Image from "next/image";
import type { Country } from "~/app/_hooks/useCountries";

interface Props {
    country: Country;
}

export function ClienteCountryItem({ country }: Readonly<Props>) {
    return (
        <Space>
            {country.flag && (
                <Image
                    src={country.flag ?? ""}
                    alt={country.alt ?? "Flag"}
                    width={20}
                    height={15}
                />
            )}
            {country.label}
        </Space>
    );
}