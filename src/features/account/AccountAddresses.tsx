import React, { useState } from 'react';
import { AddressInput } from '../../services/account/contracts';
import { errorMessage, FieldErrors, validateAddress } from '../../services/account/validation';
import { useAddresses } from './hooks';
import { AccountError, AccountField, AccountSkeleton, buttonClass, FormMessage, panelClass, secondaryClass } from './AccountUi';

const blankAddress: AddressInput = { fullName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false };
export const AccountAddresses: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const query = useAddresses();
  const [editing, setEditing] = useState<string | null>(null), [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>({ ...blankAddress }), [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState({ error: '', success: '' });
  const Heading = embedded ? 'h2' : 'h1';
  const Subheading = embedded ? 'h3' : 'h2';
  const action = async (operation: () => Promise<unknown>, success: string) => { setMessage({ error: '', success: '' }); try { await operation(); setMessage({ error: '', success }); } catch (failure) { setMessage({ error: errorMessage(failure), success: '' }); } };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); const next = validateAddress(form); setErrors(next); if (Object.keys(next).length) return;
    await action(async () => { if (editing) await query.update(editing, form); else await query.add(form); setShowForm(false); setEditing(null); setForm({ ...blankAddress }); }, 'Address saved.');
  };
  if (query.loading) return <AccountSkeleton label="Loading addresses" />;
  if (query.error) return <AccountError message={query.error} retry={query.reload} />;
  return <section aria-label="Addresses" className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><Heading className={`${embedded ? 'text-xl' : 'text-2xl'} font-bold`}>Addresses</Heading><button type="button" disabled={query.busy} onClick={() => { setForm({ ...blankAddress }); setEditing(null); setErrors({}); setShowForm(true); }} className={buttonClass}>Add address</button></div><FormMessage {...message} />
    {showForm && <form noValidate onSubmit={save} className={`${panelClass} space-y-4`}><Subheading className="font-semibold">{editing ? 'Edit address' : 'New address'}</Subheading><div className="grid gap-4 sm:grid-cols-2">{([{ key: 'fullName', label: 'Full name', autoComplete: 'name' }, { key: 'phone', label: 'Phone number', autoComplete: 'tel' }, { key: 'street', label: 'Street address', autoComplete: 'street-address' }, { key: 'city', label: 'City', autoComplete: 'address-level2' }, { key: 'state', label: 'State / region', autoComplete: 'address-level1' }, { key: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' }] as const).map(field => <AccountField key={field.key} label={field.label} required autoComplete={field.autoComplete} value={form[field.key]} onChange={value => setForm(current => ({ ...current, [field.key]: value }))} error={errors[field.key]} />)}</div><label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={event => setForm(current => ({ ...current, isDefault: event.target.checked }))} />Use as default address</label><div className="flex flex-wrap gap-2"><button type="submit" disabled={query.busy} className={buttonClass}>{query.busy ? 'Saving…' : 'Save address'}</button><button type="button" onClick={() => setShowForm(false)} className={secondaryClass}>Cancel</button></div></form>}
    {!query.data?.length && !showForm && <div className={panelClass}><Subheading className="font-semibold">No addresses saved</Subheading><p className="mt-2 text-sm text-muted dark:text-muted">Use Add address to save your first address.</p></div>}
    {query.data?.map(address => <article key={address.id} className={panelClass}><div className="flex flex-wrap justify-between gap-2"><Subheading className="font-semibold">{address.fullName}</Subheading>{address.isDefault && <span className="text-xs font-semibold text-accent dark:text-accent">Default</span>}</div><p className="mt-2 text-sm text-muted dark:text-main">{address.street}<br />{address.city}, {address.state} {address.postalCode}<br />{address.phone}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={query.busy} className={secondaryClass} onClick={() => { setEditing(address.id); setForm({ fullName: address.fullName, street: address.street, city: address.city, state: address.state, postalCode: address.postalCode, phone: address.phone, isDefault: address.isDefault }); setErrors({}); setShowForm(true); }}>Edit</button>{!address.isDefault && <button type="button" disabled={query.busy} className={secondaryClass} onClick={() => action(() => query.setDefault(address.id), 'Default address updated.')}>Set default</button>}<button type="button" disabled={query.busy} className={secondaryClass} onClick={() => action(() => query.remove(address.id), 'Address deleted.')}>Delete</button></div></article>)}
  </section>;
};
