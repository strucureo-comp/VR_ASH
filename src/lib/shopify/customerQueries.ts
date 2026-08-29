/**
 * Customer Account API documents. Kept apart from `queries.ts` because that file
 * targets the Storefront API — a different schema with different names for the
 * same ideas, and mixing the two is how you end up sending `subtotalPrice` to an
 * API that only has `subtotal`.
 *
 * Verified against the 2026-07 reference. The traps worth knowing:
 * - `customer` takes no arguments; the token identifies the shopper.
 * - Email and phone are nested objects, not scalars.
 * - `Order` has `name`/`number` (no `orderNumber`) and `statusPageUrl` (no
 *   `statusUrl`), `subtotal` (no `subtotalPrice`), and no `totalDiscounts`.
 * - `LineItem` has no nested `variant` or `product` — that data is flattened
 *   into `variantTitle`, `variantId`, `productId`, `sku`.
 * - `CustomerAddress` has no `isDefault`; the default is whichever id matches
 *   `customer.defaultAddress`, which is why both are fetched together.
 */

const MONEY = /* GraphQL */ `
  fragment CMoney on MoneyV2 {
    amount
    currencyCode
  }
`;

/** `formatted` is Shopify's own locale-aware rendering — the UI prints those
 * lines rather than assembling an address from the parts, which gets the field
 * order wrong outside the country it was written for. */
const ADDRESS = /* GraphQL */ `
  fragment CAddress on CustomerAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    zoneCode
    territoryCode
    zip
    phoneNumber
    formatted(withName: true, withCompany: true)
  }
`;

export const CUSTOMER_PROFILE_QUERY = /* GraphQL */ `
  ${ADDRESS}
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        ...CAddress
      }
    }
  }
`;

export const CUSTOMER_ADDRESSES_QUERY = /* GraphQL */ `
  ${ADDRESS}
  query CustomerAddresses($first: Int!) {
    customer {
      defaultAddress {
        id
      }
      addresses(first: $first) {
        nodes {
          ...CAddress
        }
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = /* GraphQL */ `
  ${MONEY}
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          statusPageUrl
          totalPrice {
            ...CMoney
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ORDER_QUERY = /* GraphQL */ `
  ${MONEY}
  ${ADDRESS}
  query CustomerOrder($id: ID!, $lines: Int!) {
    order(id: $id) {
      id
      name
      processedAt
      financialStatus
      fulfillmentStatus
      statusPageUrl
      totalPrice {
        ...CMoney
      }
      subtotal {
        ...CMoney
      }
      totalShipping {
        ...CMoney
      }
      totalTax {
        ...CMoney
      }
      shippingAddress {
        ...CAddress
      }
      lineItems(first: $lines) {
        nodes {
          name
          variantTitle
          quantity
          totalPrice {
            ...CMoney
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

/* ----------------------------- address writes ----------------------------- */
/**
 * `customerDefaultAddressUpdate` does not exist in this API — promoting an
 * address to default is `customerAddressUpdate` with `defaultAddress: true`.
 * The errors field is `userErrors`, not `customerUserErrors`.
 */

const ADDRESS_ERRORS = /* GraphQL */ `
  fragment CAddressErrors on UserErrorsCustomerAddressUserErrors {
    field
    message
    code
  }
`;

export const ADDRESS_CREATE_MUTATION = /* GraphQL */ `
  ${ADDRESS}
  ${ADDRESS_ERRORS}
  mutation CustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean!) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        ...CAddress
      }
      userErrors {
        ...CAddressErrors
      }
    }
  }
`;

export const ADDRESS_UPDATE_MUTATION = /* GraphQL */ `
  ${ADDRESS}
  ${ADDRESS_ERRORS}
  mutation CustomerAddressUpdate(
    $addressId: ID!
    $address: CustomerAddressInput!
    $defaultAddress: Boolean!
  ) {
    customerAddressUpdate(
      addressId: $addressId
      address: $address
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        ...CAddress
      }
      userErrors {
        ...CAddressErrors
      }
    }
  }
`;

export const ADDRESS_DELETE_MUTATION = /* GraphQL */ `
  ${ADDRESS_ERRORS}
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        ...CAddressErrors
      }
    }
  }
`;
