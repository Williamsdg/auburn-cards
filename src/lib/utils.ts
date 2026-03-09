export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const conditionLabels: Record<string, string> = {
  MINT: "Mint",
  NEAR_MINT: "Near Mint",
  EXCELLENT: "Excellent",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWING: "bg-yellow-100 text-yellow-800",
  OFFER_SENT: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
  COUNTERED: "bg-orange-100 text-orange-800",
  AVAILABLE: "bg-green-100 text-green-800",
  SOLD: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-gray-100 text-gray-800",
};
