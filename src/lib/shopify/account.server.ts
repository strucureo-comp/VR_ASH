import { customerFetch } from "./customer.server";
import {
  ADDRESS_CREATE_MUTATION,
  ADDRESS_DELETE_MUTATION,
  ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESSES_QUERY,
  CUSTOMER_ORDER_QUERY,
  CUSTOMER_ORDERS_QUERY,
  CUSTOMER_PROFILE_QUERY,
} from "./customerQueries";
import type {
  AccountProfile,
  AccountUserError,
  Address,
  AddressInput,
  AddressResult,
  Money,
  OrderDetail,
  OrderLine,
  OrderSummary,
} from "./types";

/**
 * Customer Account API reads and writes, mapped to the view models in
 * `types.ts`. Every function takes an access token rather than reaching for a
 * session, so nothing here imports the framework and the Next.js port reuses the
 * file unchanged — the same split as `catalog.server.ts` and `cart.server.ts`.
 */

/** Shopify sends money amounts as decimal strings. */
type RawMoney = { amount: string; currencyCode: string };

function money(raw: RawMoney | null): Money | null {
  if (!raw) return null;
  return { amount: Number(raw.amount), currencyCode: raw.currencyCode };
}

/** For the fields Shopify types as non-null, so the UI is not littered with
 * fallbacks for a value that cannot be missing. */
function requiredMoney(raw: RawMoney): Money {
  return { amount: Number(raw.amount), currencyCode: raw.currencyCode };
}

type RawAddress = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zoneCode: string | null;
  territoryCode: string | null;
  zip: string | null;
  phoneNumber: string | null;
  formatted: string[];
};

function toAddress(raw: RawAddress, defaultId: string | null): Address {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    company: raw.company,
    address1: raw.address1,
    address2: raw.address2,
    city: raw.city,
    zoneCode: raw.zoneCode,
    territoryCode: raw.territoryCode,
    zip: raw.zip,
    phone: raw.phoneNumber,
    formatted: raw.formatted,
    // `CustomerAddress` has no `isDefault`, so it is derived by comparing ids.
    isDefault: raw.id === defaultId,
  };
}

/* -------------------------------- profile --------------------------------- */

export async function getAccountProfile(accessToken: string): Promise<AccountProfile> {
  const data = await customerFetch<{
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      displayName: string;
      emailAddress: { emailAddress: string | null } | null;
      phoneNumber: { phoneNumber: string } | null;
      defaultAddress: RawAddress | null;
    };
  }>(CUSTOMER_PROFILE_QUERY, {}, accessToken);

  const customer = data.customer;
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    displayName: customer.displayName,
    // Both are nested objects in this API, and either can be absent — a shopper
    // who signed in by email has no phone on file.
    email: customer.emailAddress?.emailAddress ?? null,
    phone: customer.phoneNumber?.phoneNumber ?? null,
    defaultAddress: customer.defaultAddress
      ? toAddress(customer.defaultAddress, customer.defaultAddress.id)
      : null,
  };
}

/* ------------------------------- addresses -------------------------------- */

export async function getAccountAddresses(accessToken: string, first = 20): Promise<Address[]> {
  const data = await customerFetch<{
    customer: {
      defaultAddress: { id: string } | null;
      addresses: { nodes: RawAddress[] };
    };
  }>(CUSTOMER_ADDRESSES_QUERY, { first }, accessToken);

  const defaultId = data.customer.defaultAddress?.id ?? null;
  return data.customer.addresses.nodes.map((node) => toAddress(node, defaultId));
}

type RawAddressPayload = {
  customerAddress: RawAddress | null;
  userErrors: AccountUserError[];
};

export async function createAccountAddress(
  accessToken: string,
  address: AddressInput,
  makeDefault: boolean,
): Promise<AddressResult> {
  const data = await customerFetch<{ customerAddressCreate: RawAddressPayload | null }>(
    ADDRESS_CREATE_MUTATION,
    { address, defaultAddress: makeDefault },
    accessToken,
  );
  return toAddressResult(data.customerAddressCreate, makeDefault);
}

export async function updateAccountAddress(
  accessToken: string,
  addressId: string,
  address: AddressInput,
  makeDefault: boolean,
): Promise<AddressResult> {
  const data = await customerFetch<{ customerAddressUpdate: RawAddressPayload | null }>(
    ADDRESS_UPDATE_MUTATION,
    { addressId, address, defaultAddress: makeDefault },
    accessToken,
  );
  return toAddressResult(data.customerAddressUpdate, makeDefault);
}

export async function deleteAccountAddress(
  accessToken: string,
  addressId: string,
): Promise<AddressResult> {
  const data = await customerFetch<{
    customerAddressDelete: {
      deletedAddressId: string | null;
      userErrors: AccountUserError[];
    } | null;
  }>(ADDRESS_DELETE_MUTATION, { addressId }, accessToken);

  return { address: null, userErrors: data.customerAddressDelete?.userErrors ?? [] };
}

/**
 * A null payload with no `userErrors` means the mutation was refused outright —
 * usually a missing `customer_write_customers` permission on the Headless
 * channel. Saying so beats a silent no-op the shopper cannot interpret.
 */
function toAddressResult(payload: RawAddressPayload | null, makeDefault: boolean): AddressResult {
  if (!payload) {
    return {
      address: null,
      userErrors: [{ field: null, message: "We could not save that address.", code: null }],
    };
  }
  const address = payload.customerAddress;
  return {
    address: address ? toAddress(address, makeDefault ? address.id : null) : null,
    userErrors: payload.userErrors,
  };
}

/* --------------------------------- orders --------------------------------- */

type RawOrderSummary = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  statusPageUrl: string | null;
  totalPrice: RawMoney;
};

function toOrderSummary(raw: RawOrderSummary): OrderSummary {
  return {
    id: raw.id,
    name: raw.name,
    processedAt: raw.processedAt,
    financialStatus: raw.financialStatus,
    fulfillmentStatus: raw.fulfillmentStatus,
    total: requiredMoney(raw.totalPrice),
    statusPageUrl: raw.statusPageUrl,
  };
}

export async function getAccountOrders(accessToken: string, first = 20): Promise<OrderSummary[]> {
  const data = await customerFetch<{
    customer: { orders: { nodes: RawOrderSummary[] } };
  }>(CUSTOMER_ORDERS_QUERY, { first }, accessToken);
  return data.customer.orders.nodes.map(toOrderSummary);
}

type RawOrderDetail = RawOrderSummary & {
  subtotal: RawMoney | null;
  totalShipping: RawMoney | null;
  totalTax: RawMoney | null;
  shippingAddress: RawAddress | null;
  lineItems: {
    nodes: Array<{
      name: string;
      variantTitle: string | null;
      quantity: number;
      totalPrice: RawMoney | null;
      image: { url: string; altText: string | null } | null;
    }>;
  };
};

/**
 * `null` when the id is not this customer's order — the API answers with a null
 * `order` rather than an error, which is the right behaviour: it does not confirm
 * that someone else's order exists.
 */
export async function getAccountOrder(
  accessToken: string,
  id: string,
  lines = 50,
): Promise<OrderDetail | null> {
  const data = await customerFetch<{ order: RawOrderDetail | null }>(
    CUSTOMER_ORDER_QUERY,
    { id, lines },
    accessToken,
  );

  const order = data.order;
  if (!order) return null;

  const items: OrderLine[] = order.lineItems.nodes.map((node) => ({
    title: node.name,
    variantTitle: node.variantTitle,
    quantity: node.quantity,
    total: money(node.totalPrice),
    image: node.image
      ? { url: node.image.url, altText: node.image.altText, width: null, height: null }
      : null,
  }));

  return {
    ...toOrderSummary(order),
    subtotal: money(order.subtotal),
    shipping: money(order.totalShipping),
    tax: money(order.totalTax),
    lines: items,
    shippingAddress: order.shippingAddress ? toAddress(order.shippingAddress, null) : null,
  };
}
