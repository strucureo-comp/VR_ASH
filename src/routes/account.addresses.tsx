import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AccountShell, SignInPrompt } from "@/components/site/AccountLayout";
import { AddressForm } from "@/components/site/AddressForm";
import {
  accountAddressCreate,
  accountAddressDelete,
  accountAddressUpdate,
} from "@/lib/shopify/api";
import { addressesQuery } from "@/lib/shopify/queryOptions";
import type { AccountUserError, Address, AddressInput } from "@/lib/shopify/types";

/**
 * Saved addresses. Shopify still collects the delivery address at checkout, so
 * these are a convenience — which is why a failure here shows an inline message
 * rather than blocking anything.
 */
export const Route = createFileRoute("/account/addresses")({
  loader: async ({ context }) => ({
    addresses: await context.queryClient.ensureQueryData(addressesQuery()),
  }),
  head: () => ({
    meta: [
      { title: "Your addresses | Vallalaar Remedies" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Addresses,
});

function Addresses() {
  const { addresses } = Route.useLoaderData();
  const queryClient = useQueryClient();
  /** `"new"`, an address id being edited, or `null` for the plain list. */
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<AccountUserError[]>([]);

  const refresh = async () => {
    // The profile card shows the default address, so it goes stale too.
    await queryClient.invalidateQueries({ queryKey: ["shopify", "addresses"] });
    await queryClient.invalidateQueries({ queryKey: ["shopify", "account"] });
  };

  const save = useMutation({
    mutationFn: async (vars: { id: string | null; input: AddressInput; makeDefault: boolean }) =>
      vars.id === null
        ? accountAddressCreate({ data: { address: vars.input, makeDefault: vars.makeDefault } })
        : accountAddressUpdate({
            data: { id: vars.id, address: vars.input, makeDefault: vars.makeDefault },
          }),
    onSuccess: async (result) => {
      // `null` means the session went away mid-edit; a reload lands on sign-in.
      if (!result) return void window.location.reload();
      if (result.userErrors.length > 0) return setErrors(result.userErrors);
      setErrors([]);
      setEditing(null);
      await refresh();
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => accountAddressDelete({ data: { id } }),
    onSuccess: async (result) => {
      if (!result) return void window.location.reload();
      if (result.userErrors.length > 0) return setErrors(result.userErrors);
      setErrors([]);
      await refresh();
    },
  });

  if (!addresses) return <SignInPrompt returnTo="/account/addresses" />;

  const editingAddress = addresses.find((address) => address.id === editing) ?? null;

  return (
    <AccountShell heading="Addresses" intro="Saved for faster checkout.">
      {editing !== null ? (
        <AddressForm
          address={editingAddress}
          errors={errors}
          busy={save.isPending}
          submitLabel={editingAddress ? "Save address" : "Add address"}
          onSubmit={(input, makeDefault) => {
            save.mutate({ id: editingAddress?.id ?? null, input, makeDefault });
          }}
          onCancel={() => {
            setErrors([]);
            setEditing(null);
          }}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              You have not saved an address yet.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <li key={address.id}>
                  <AddressCard
                    address={address}
                    busy={remove.isPending}
                    onEdit={() => setEditing(address.id)}
                    onRemove={() => remove.mutate(address.id)}
                    onMakeDefault={() =>
                      save.mutate({ id: address.id, input: {}, makeDefault: true })
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {errors.length > 0 && (
            <ul role="alert" className="mt-6 space-y-1 text-sm text-[color:var(--burgundy)]">
              {errors.map((error, index) => (
                <li key={`${error.message}-${index}`}>{error.message}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => {
              setErrors([]);
              setEditing("new");
            }}
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors sm:hover:bg-[color:var(--botanical-deep)]"
          >
            Add an address
          </button>
        </>
      )}
    </AccountShell>
  );
}

function AddressCard({
  address,
  busy,
  onEdit,
  onRemove,
  onMakeDefault,
}: {
  address: Address;
  busy: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMakeDefault: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      {address.isDefault && (
        <span className="mb-3 self-start rounded-full bg-[color:var(--surface)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--gold)]">
          Default
        </span>
      )}
      <address className="flex-1 text-sm not-italic leading-relaxed text-foreground">
        {address.formatted.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <div className="mt-5 flex flex-wrap gap-2">
        <CardButton onClick={onEdit} disabled={busy}>
          Edit
        </CardButton>
        {!address.isDefault && (
          <CardButton onClick={onMakeDefault} disabled={busy}>
            Make default
          </CardButton>
        )}
        <CardButton onClick={onRemove} disabled={busy}>
          Remove
        </CardButton>
      </div>
    </div>
  );
}

function CardButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors disabled:opacity-60 sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
    >
      {children}
    </button>
  );
}
