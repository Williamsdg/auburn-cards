import Link from "next/link";

export const metadata = {
  title: "Submission Received | Auburn Cards",
};

export default function SellSuccess() {
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
      <h1 className="text-3xl font-bold mb-4">Submission Received!</h1>
      <p className="text-gray-600 mb-8">
        Thanks for submitting your card! We&apos;ll review it and get back to
        you with an offer via email. This usually takes 1-2 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/sell"
          className="inline-flex items-center justify-center px-6 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
        >
          Submit Another Card
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse Our Shop
        </Link>
      </div>
    </div>
  );
}
