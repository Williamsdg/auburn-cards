import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              <span className="text-auburn">Auburn</span>.cards
            </h3>
            <p className="text-sm">
              Your trusted source for Pokemon &amp; sports trading cards.
              Buy, sell, and collect with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/shop" className="block hover:text-auburn transition-colors">
                Shop Cards
              </Link>
              <Link href="/trending" className="block hover:text-auburn transition-colors">
                Trending
              </Link>
              <Link href="/deals" className="block hover:text-auburn transition-colors">
                Deals
              </Link>
              <Link href="/sell" className="block hover:text-auburn transition-colors">
                Sell Your Cards
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.instagram.com/auburn.cards"
                target="_blank"
                className="block hover:text-auburn transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://ebay.us/m/u3T5kW"
                target="_blank"
                className="block hover:text-auburn transition-colors"
              >
                eBay Store
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
          &copy; {new Date().getFullYear()} Auburn Cards. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
