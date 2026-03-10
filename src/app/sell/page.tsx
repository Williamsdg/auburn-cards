import SellForm from "@/components/SellForm";

export const metadata = {
  title: "Sell Your Pokemon & Sports Cards | Auburn Cards",
  description: "Submit your Pokemon cards, sports cards, or trading cards and get a fair offer. Fast response, no hassle, no fees.",
};

export default function SellPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Sell Your Cards</h1>
      <p className="text-gray-600 mb-8">
        Have Pokemon cards, sports cards, or other trading cards you want to sell?
        Fill out the form below and we&apos;ll review your submission and send you an offer.
      </p>
      <SellForm />
    </div>
  );
}
