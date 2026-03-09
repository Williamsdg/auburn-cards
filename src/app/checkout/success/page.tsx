import Link from "next/link";

export const metadata = {
  title: "Order Confirmed | Auburn Cards",
};

export default function CheckoutSuccess() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thanks for your purchase! You&apos;ll receive a confirmation email
        shortly with your order details. We&apos;ll send tracking information
        once your card ships.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center px-8 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
