---
name: features-in-app-purchase
description: Mac App Store in-app purchases; purchaseProduct, getProducts, transactions-updated, restore and finish.
---

# In-App Purchase (macOS)

The `inAppPurchase` module (main process) supports [StoreKit](https://developer.apple.com/documentation/storekit) in-app purchases when the app is distributed via the **Mac App Store**. Not available on Windows/Linux or when the app is distributed outside the MAS.

## Usage

Listen for `transactions-updated` **before** calling any purchase or restore API. Use the event to update UI and complete/finish transactions as required by StoreKit.

```js
const { inAppPurchase } = require('electron')

inAppPurchase.on('transactions-updated', (event, transactions) => {
  for (const tx of transactions) {
    // Handle paymentState, etc.; call finishTransactionByDate or finishAllTransactions when done
  }
})

// Check capability
if (inAppPurchase.canMakePayments()) {
  const products = await inAppPurchase.getProducts(['com.example.product1'])
  // Show products; then e.g. inAppPurchase.purchaseProduct('com.example.product1', { quantity: 1 })
}
```

## Methods

- **`purchaseProduct(productID[, opts])`** — Add product to payment queue. `opts` may include `quantity`, `username` (applicationUsername). Returns `Promise<boolean>`.
- **`getProducts(productIDs)`** — Resolves with array of Product objects (name, price, etc.).
- **`canMakePayments()`** — Returns whether the user can make payments.
- **`restoreCompletedTransactions()`** — Restore previous purchases (e.g. new device or reinstall).
- **`getReceiptURL()`** — Path to the receipt file.
- **`finishAllTransactions()`** / **`finishTransactionByDate(date)`** — Complete pending transactions (ISO date string for the latter).

## Key Points

- MAS-only; guard with `process.mas` or platform checks.
- Always subscribe to `transactions-updated` first; the queue delivers transaction updates there.
- Use Product/Transaction structures from the docs for full field definitions.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/in-app-purchase
-->
