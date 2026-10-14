import { test } from "../../../fixtures/base.fixture";

test(
  "[AE-CHECKOUT-004] order confirmation page displays a unique order ID after successful payment submission",
  { tag: ["@regression", "@P1", "@AE-CHECKOUT-004", "@e2e"] },
  async () => {
    // @quarantine CHECKOUT-004: order ID assertion merged into ae-checkout-003.spec.ts to avoid placing two real orders
    test.skip(true, "Order ID assertion covered in ae-checkout-003.spec.ts");
  },
);
