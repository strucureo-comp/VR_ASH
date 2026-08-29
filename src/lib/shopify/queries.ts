/**
 * Every Storefront API document lives here, so a schema change means editing one
 * file rather than hunting through routes. Verified against API version 2026-07:
 * `product(handle:)` (not the deprecated `productByHandle`), connections expose
 * `nodes`, and `Cart.lines` is a `BaseCartLineConnection`.
 */

const MONEY = /* GraphQL */ `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const IMAGE = /* GraphQL */ `
  fragment Img on Image {
    url
    altText
    width
    height
  }
`;

const VARIANT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    availableForSale
    quantityAvailable
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
    image {
      ...Img
    }
    selectedOptions {
      name
      value
    }
  }
`;

const PRODUCT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    totalInventory
    seo {
      title
      description
    }
    featuredImage {
      ...Img
    }
    images(first: 10) {
      nodes {
        ...Img
      }
    }
    variants(first: 50) {
      nodes {
        ...VariantFields
      }
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
  }
`;

const PRODUCT_FRAGMENTS = [MONEY, IMAGE, VARIANT, PRODUCT].join("\n");

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENTS}
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENTS}
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
  ${PRODUCT_FRAGMENTS}
`;

const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...Money
          }
          amountPerQuantity {
            ...Money
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            image {
              ...Img
            }
            price {
              ...Money
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

const CART_FRAGMENTS = [MONEY, IMAGE, CART].join("\n");

const USER_ERRORS = /* GraphQL */ `
  userErrors {
    field
    message
    code
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query CartById($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${CART_FRAGMENTS}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        ...CartFields
      }
      ${USER_ERRORS}
    }
  }
  ${CART_FRAGMENTS}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      ${USER_ERRORS}
    }
  }
  ${CART_FRAGMENTS}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      ${USER_ERRORS}
    }
  }
  ${CART_FRAGMENTS}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      ${USER_ERRORS}
    }
  }
  ${CART_FRAGMENTS}
`;

export const CART_BUYER_IDENTITY_MUTATION = /* GraphQL */ `
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFields
      }
      ${USER_ERRORS}
    }
  }
  ${CART_FRAGMENTS}
`;
