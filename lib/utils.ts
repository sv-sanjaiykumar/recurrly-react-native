// export function formatCurrency(value: number, currency: string = "USD"): string {
//   const safeValue = Number.isFinite(value) ? value : 0;
//   const currencyCode = currency || "USD";

//   try {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currencyCode,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(safeValue);
//   } catch (error) {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(safeValue);
//   }
// }

// export default formatCurrency;


// export const formatCurrency = (value:
//     number, currency: string = "USD") => {
//     try {
//         return new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: currency,
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         }).format(value);
//     } catch (error) {
//         // Fallback if currency code is invalid or formatting fails (
//         const formattedValue = value.toFixed(2);
//         return `$${formattedValue}`;
//     }
// }

import dayjs from "dayjs";

export const formatCurrency = (
    value: number,
    currency: string = "USD"
): string => {
    const safeValue = Number.isFinite(value) ? value : 0;

    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(safeValue);
    } catch (error) {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(safeValue);
    }
};

export const fromCurrency = (
    amount: number,
    currency: string
): string => {
    return formatCurrency(amount, currency);
};

export const formatSubscriptionDateTime = (date: string): string => {
    return dayjs(date).format("MMM D, YYYY");
};

export const formatStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};