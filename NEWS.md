User-visible changes in ERTP:

## Release v0.1.7 (10/15/2019)

* Added configurable endowments in contract evaluation for `Zoe` and the
  `contractHost`.

## Release v0.1.6 (10/14/2019)

* [Renamed many aspects of ERTP](https://github.com/Agoric/ERTP/commit/a34dad171eb8693b807a7fd959b14e938fedf42a):
    1. `amount`, the description of an asset (e.g. 3 bucks), is now
       `assetDesc`, short for 'asset description'.
    2. `quantity`, the measure of "how much" is in an asset (the '3'
       of '3 bucks') is now `extent`. We did this so that we
       can reference the extent of non-fungible assets as easily as
       fungible assets.
    3. `assay`, the operations for manipulating labeled
       extents/quantities, is now `descOps`. `DescOps` are the set
       operations on asset descriptions. This change makes it clear
       that the `descOps` are not an institution in the same sense as
       the mint and are merely operations.
    4. `strategy`, the operations for manipulating unlabeled extents,
       is now `extentOps`. This change makes it clear that it is the
       operations on extents, and it acts on extents in the same way
       that `descOps` acts on descriptions.
    5. Purses and payments are now together called `assetHolders`.
       Assets are the intangible (i.e. there is no asset object) erights held by purses and payments.
    6. `issuer` has been renamed to `assay`. `assay` and `mint` are
       two facets of the same institution. The `mint` has the
       authority to create new assets. The `assay` is the
       public-facing facet that is often widely known and can be used
       to claim exclusive access to a payment or make an empty purse,
       among other things. 
* Added [support for uploading contracts](https://github.com/Agoric/cosmic-swingset/blob/master/lib/ag-solo/contracts/README-contract.md) at the start of the Agoric testnet. 
* Added an [initial version of Zoe](https://github.com/Agoric/ERTP/commit/a32426aab307d31bd0fe1b6e1241d4a270964e31), our offer-safety enforcement layer.
  More on this to come.

## Release v0.1.5 (10/4/2019)

* Updated to `@agoric/swingset-vat` v0.0.26. Also updated a number of
  other packages.

* Fixed two bugs: `issuer.split` was trying to `vouch` for the amounts
  that were passed into the `split` function. When these amounts were
  created in a different vat, `vouch` failed. We realized that
  `assay.vouch` was unnecessary and `assay.coerce` could be used
  instead. The second bug fix was to replace `E.resolve` (deprecated)
  with `Promise.resolve` when we did the update of
  `@agoric/swingset-vat`.

## Release v0.1.4 (9/3/2019)

Core ERTP:
* Created a "list strategy" for assays. The list strategy allows
  non-fungible assets to have set operations. For instance, for the
  pixelList assay, each pixel is defined by the x and y coordinates,
  but there can be multiple pixels in a purse or payment. These
  multiple pixels can be combined together because they are put in a
  list. Similarly, we can remove pixels from a purse or payment by
  removing them from the list.
* Updated to `@agoric/swingset-vat` v0.0.20 and `ses` v0.6.0

## Release v0.1.3 (8/27/2019)

Core ERTP:
* Extracted assay set operations/arithmetic into "strategies". We had
  several different assays that described various types of fungible
  and non-fungible digital assets. A lot of the code was reused, but
  what differed was the custom logic for the arithmetic or set
  operations. For instance, a fungible token just adds or substracts
  natural numbers, but a non-fungible token might put something in or
  take something out of a list. We extracted that logic such that we
  could reuse `assay.js` for many different types of assets.
* Added an 'import manager' that maps strings to imported code. The
  import manager allows code such as configuration functions to be
  imported rather than passed as parameters.

## Release v0.1.2 (8/20/2019)

Core ERTP:
* Enforced "payment linearity". Whenever a payment is deposited,
  burned, or claimed, the entire payment must be used up ("killed").
  When a payment is killed, it is removed from the ledger entirely,
  not just reduced to an empty amount, as was previously the case. Two
  new methods to support payment linearity are added to `issuer`:
  `combine(paymentArray)` and `split(payment, amountsArray,
  namesArray)`. The methods for depositing are now
  `depositExactly(amount, payment)`, which checks that the `amount` is
  equal to the `payment` balance, and `depositAll(payment)`. The
  methods for burning are now `burnExactly` and `burnAll`, and the
  methods for claiming are now `claimExactly` and `claimAll`. 

## Release v0.1.1 (8/15/2019)

Core ERTP:
* Made the `makeMint` config act in a more "trait-like" manner.
  Instead of creating custom purses and payments by calling a function
  that returns the custom purse or payment, the "trait-like" style
  combines the core methods of a purse or payment with the custom
  methods, overriding any custom methods with the core methods if
  there is any overlap. 

Pixel Demo:
* Fixed a bug in which `tapFaucet` did not return newly minted
  `pixelPayments` but instead returned previously created ones.

## Release v0.1.0 (8/14/2019)

Core ERTP:
* Refactored contracts to make it easier for users to check the terms of
  a contract
* Added an IDL to describe the user-facing ERTP interface for mints,
  issuers, purses, payments, assays, and the contractHost.
* Renamed `getExclusive` and `getExclusiveAll` to `claim` and
  `claimAll`
* Added `equals` as an assay method

Pixel Demo:
* Created a new representation of hierarchical rights for the pixel
  demo, which allows holders of higher-level rights to revoke rights
  held further down. This follows the pattern of owner, tenant, and
  subtenant relationships in real property. 
* Made the gallery in the pixel demo use a long-lived contract host
  rather than creating a new contract host for each contract

## Release v0.0.9 (7/29/2019)

* Moved ERTP from the SwingSet repository
* Added pixel demo and handoff table to push ERTP design forward to
  non-fungible tokens with real uses