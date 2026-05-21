import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PincodeInfo {
  city: string;
  state: string;
  block?: string;
}

export async function fetchPincodeInfo(pincode: string): Promise<PincodeInfo | null> {
  if (!/^[0-9]{6}$/.test(pincode)) {
    return null;
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0 || data[0].Status !== "Success") {
      return null;
    }

    const office = data[0].PostOffice?.[0];
    if (!office) {
      return null;
    }

    return {
      city: office.District || office.Division || "",
      state: office.State || "",
      block: office.Block || "",
    };
  } catch (error) {
    return null;
  }
}
