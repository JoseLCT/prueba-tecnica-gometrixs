import axios from "axios";
import { useEffect, useState } from "react";

export interface Country {
  label: string;
  value: string;
  flag?: string;
  alt?: string;
}

interface RestCountry {
  name: { common: string };
  cca2: string;
  flags: {
    svg?: string;
    alt?: string;
  };
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    void fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<RestCountry[]>(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
      );
      const data = response.data
        .filter((c) => c.cca2 && c.name?.common)
        .map((c) => ({
          label: c.name.common,
          value: c.cca2 ? c.cca2.toUpperCase() : "",
          flag: c.flags.svg,
          alt: c.flags.alt,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setCountries(data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError(err);
      setCountries([{ label: "Bolivia", value: "BO" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { countries, isLoading, error };
}
