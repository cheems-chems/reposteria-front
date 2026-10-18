import { BackgroundBubbles } from "@/components/layout/background-bubbles";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getStoreInfo } from "@/lib/api";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStoreInfo();

  return (
    <CartProvider whatsapp={store.whatsapp ?? null}>
      <div className="relative flex min-h-full flex-1 flex-col">
        <BackgroundBubbles />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
        </div>
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
