import { useState } from "react";

import type { AccountUserError, Address, AddressInput } from "@/lib/shopify/types";

/**
 * Add / edit form for a saved address.
 *
 * Deliberately not validated field-by-field here: which fields a country
 * requires is Shopify's rule, not ours, and it answers with `userErrors` naming
 * the offending field. Only `address1` is required client-side, because an
 * address with no street line is never worth a round trip.
 */

const FIELDS = [
  { name: "firstName", label: "First name", autoComplete: "given-name", half: true },
  { name: "lastName", label: "Last name", autoComplete: "family-name", half: true },
  { name: "company", label: "Company (optional)", autoComplete: "organization", half: false },
  { name: "address1", label: "Address", autoComplete: "address-line1", half: false },
  {
    name: "address2",
    label: "Apartment, suite (optional)",
    autoComplete: "address-line2",
    half: false,
  },
  { name: "city", label: "City", autoComplete: "address-level2", half: true },
  { name: "zoneCode", label: "State code (e.g. TN)", autoComplete: "address-level1", half: true },
  { name: "zip", label: "PIN code", autoComplete: "postal-code", half: true },
  { name: "territoryCode", label: "Country code (e.g. IN)", autoComplete: "country", half: true },
  { name: "phoneNumber", label: "Phone", autoComplete: "tel", half: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];
type FormState = Record<FieldName, string>;

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  zoneCode: "",
  zip: "",
  territoryCode: "IN",
  phoneNumber: "",
};

function initialState(address: Address | null): FormState {
  if (!address) return EMPTY;
  return {
    firstName: address.firstName ?? "",
    lastName: address.lastName ?? "",
    company: address.company ?? "",
    address1: address.address1 ?? "",
    address2: address.address2 ?? "",
    city: address.city ?? "",
    zoneCode: address.zoneCode ?? "",
    zip: address.zip ?? "",
    territoryCode: address.territoryCode ?? "IN",
    phoneNumber: address.phone ?? "",
  };
}

/** Blank fields are dropped rather than sent as `""`, which Shopify stores. */
function toInput(state: FormState): AddressInput {
  const input: AddressInput = {};
  for (const [key, value] of Object.entries(state)) {
    const trimmed = value.trim();
    if (trimmed) input[key as FieldName] = trimmed;
  }
  return input;
}

export function AddressForm({
  address = null,
  errors = [],
  busy = false,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  address?: Address | null;
  errors?: AccountUserError[];
  busy?: boolean;
  submitLabel: string;
  onSubmit: (input: AddressInput, makeDefault: boolean) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState<FormState>(() => initialState(address));
  const [makeDefault, setMakeDefault] = useState(address?.isDefault ?? false);

  return (
    <form
      className="rounded-xl border border-border bg-card p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(toInput(state), makeDefault);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.name} className={field.half ? "" : "sm:col-span-2"}>
            <span className="eyebrow text-muted-foreground">{field.label}</span>
            <input
              name={field.name}
              value={state[field.name]}
              autoComplete={field.autoComplete}
              required={field.name === "address1"}
              onChange={(event) =>
                setState((previous) => ({ ...previous, [field.name]: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-[15px] text-foreground outline-none focus:border-[color:var(--gold)]"
            />
          </label>
        ))}
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={makeDefault}
          onChange={(event) => setMakeDefault(event.target.checked)}
          className="h-4 w-4"
        />
        Use as my default address
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="mt-5 space-y-1 text-sm text-[color:var(--burgundy)]">
          {errors.map((error, index) => (
            <li key={`${error.message}-${index}`}>{error.message}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-60 sm:hover:bg-[color:var(--botanical-deep)]"
        >
          {busy ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm text-muted-foreground transition-colors sm:hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
