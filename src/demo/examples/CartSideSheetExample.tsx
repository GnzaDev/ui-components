import { useState } from "react";
import { SideSheet } from "../../SideSheet";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  imageBg: string;
}

export function CartSideSheetExample() {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Minimalist Mechanical Keyboard",
      subtitle: "Wireless 75% / Hot-swap / Linear switches",
      price: 189,
      quantity: 1,
      imageBg: "from-zinc-800 to-zinc-950",
    },
    {
      id: "2",
      name: "Ergonomic Desk Mat (Wool Felt)",
      subtitle: "Large 900x400mm / Charcoal Heather",
      price: 49,
      quantity: 1,
      imageBg: "from-stone-700 to-stone-900",
    },
    {
      id: "3",
      name: "Anodized Aluminum Cable Organizer",
      subtitle: "Magnetic base / Matte Space Gray",
      price: 28,
      quantity: 2,
      imageBg: "from-slate-700 to-slate-900",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.15 : 0;
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal - discount + shipping;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <ShoppingCart size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          E-Commerce Drawer
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Spacious floating slide-over sheet with item counters, discount codes, and order summary.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {totalQuantity} items
          </span>
          <span>•</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          <ShoppingCart size={14} />
          <span>Open Cart Drawer</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <SideSheet
        open={open}
        onClose={() => setOpen(false)}
        title={`Your Cart (${totalQuantity} items)`}
        maxWidth="max-w-xl"
      >
        <div className="flex h-full flex-col justify-between space-y-6">
          {/* Cart Items List */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart size={36} className="mx-auto text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">
                  Your cart is empty
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Add some products to see them here!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-800/40"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.imageBg} text-white shadow-xs`}
                  >
                    <ShoppingCart size={18} className="opacity-60" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-semibold text-zinc-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {item.subtitle}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Coupon input */}
          <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-zinc-400" />
              <input
                type="text"
                value={coupon}
                placeholder="PROMOCODE: 'GENTLE15'"
                onChange={(e) => setCoupon(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-xs font-mono uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (coupon.toUpperCase() === "GENTLE15") {
                    setCouponApplied(true);
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 cursor-pointer"
              >
                {couponApplied ? "Applied!" : "Apply"}
              </button>
            </div>
            {couponApplied && (
              <span className="mt-1 block text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                15% discount applied successfully!
              </span>
            )}
          </div>

          {/* Pricing breakdown and checkout */}
          <div className="space-y-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Promo Discount (15%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free Shipping" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-zinc-200/80 pt-2 flex justify-between font-bold text-zinc-950 dark:border-zinc-700 dark:text-white text-sm">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400">
              <ShieldCheck size={12} />
              <span>Encrypted 256-bit SSL checkout</span>
            </div>
          </div>
        </div>
      </SideSheet>
    </div>
  );
}
