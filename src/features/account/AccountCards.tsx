import React, { useId, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { accountConfig } from '../../config/account';
import { CardDetailsInput } from '../../services/account/contracts';
import { errorMessage, FieldErrors, validateCardDetails } from '../../services/account/validation';
import { useCardDetails } from './hooks';
import { AccountError, AccountField, AccountSkeleton, buttonClass, FormMessage, panelClass, secondaryClass } from './AccountUi';

const blankCard: CardDetailsInput = { cardholder: '', network: '', last4: '', expiry: '', isDefault: false };

export const AccountCards: React.FC = () => {
  const query = useCardDetails(), networkId = useId();
  const [editing, setEditing] = useState<string | null>(null), [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CardDetailsInput>({ ...blankCard }), [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState({ error: '', success: '' });
  const action = async (operation: () => Promise<unknown>, success: string) => {
    setMessage({ error: '', success: '' });
    try { await operation(); setMessage({ error: '', success }); }
    catch (failure) { setMessage({ error: errorMessage(failure), success: '' }); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = validateCardDetails(form); setErrors(next);
    if (Object.keys(next).length) return;
    await action(async () => {
      if (editing) await query.update(editing, form); else await query.add(form);
      setShowForm(false); setEditing(null); setForm({ ...blankCard });
    }, 'Mock card reference saved.');
  };
  if (query.loading) return <AccountSkeleton label="Loading card details" />;
  if (query.error) return <AccountError message={query.error} retry={query.reload} />;

  return <section aria-label="Card details" className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Card details</h2><button type="button" disabled={query.busy} onClick={() => { setEditing(null); setForm({ ...blankCard }); setErrors({}); setMessage({ error: '', success: '' }); setShowForm(true); }} className={buttonClass}>Add card reference</button></div>
    <p className="text-sm text-muted dark:text-muted">Mock references only. Enter the last four digits, never a full card number or CVV. These details cannot be used for payments.</p>
    <FormMessage {...message} />
    {showForm && <form noValidate autoComplete="off" onSubmit={save} className={`${panelClass} space-y-4`}>
      <h3 className="font-semibold">{editing ? 'Edit card reference' : 'New card reference'}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <AccountField label="Cardholder name" required maxLength={80} autoComplete="off" value={form.cardholder} onChange={cardholder => setForm(current => ({ ...current, cardholder }))} error={errors.cardholder} />
        <div className="min-w-0"><label htmlFor={networkId} className="mb-1 block text-xs font-semibold text-main dark:text-main">Card network</label><select id={networkId} required value={form.network} onChange={event => setForm(current => ({ ...current, network: event.target.value }))} aria-invalid={!!errors.network} aria-describedby={errors.network ? `${networkId}-error` : undefined} className="account-input w-full rounded-lg border border-border bg-surface-soft px-3 py-2.5 text-sm text-main dark:border-border dark:bg-surface-elevated dark:text-main"><option value="">Choose a network</option>{accountConfig.CARD_NETWORKS.map(network => <option key={network} value={network}>{network}</option>)}</select>{errors.network && <p id={`${networkId}-error`} className="mt-1 text-xs text-danger-ink dark:text-danger-ink">{errors.network}</p>}</div>
        <AccountField label="Last 4 digits" required maxLength={4} inputMode="numeric" autoComplete="off" value={form.last4} onChange={last4 => setForm(current => ({ ...current, last4: last4.replace(/\D/g, '').slice(0, 4) }))} error={errors.last4} />
        <AccountField label="Expiry (MM/YY)" required maxLength={5} placeholder="MM/YY" autoComplete="off" value={form.expiry} onChange={expiry => setForm(current => ({ ...current, expiry }))} error={errors.expiry} />
      </div>
      <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={event => setForm(current => ({ ...current, isDefault: event.target.checked }))} />Use as default card reference</label>
      <div className="flex flex-wrap gap-2"><button type="submit" disabled={query.busy} className={buttonClass}>{query.busy ? 'Saving…' : 'Save card reference'}</button><button type="button" disabled={query.busy} onClick={() => setShowForm(false)} className={secondaryClass}>Cancel</button></div>
    </form>}
    {!query.data?.length && !showForm && <div className={panelClass}><h3 className="font-semibold">No card references saved</h3><p className="mt-2 text-sm text-muted dark:text-muted">Add a mock reference to preview your account's saved card details.</p></div>}
    <div className="grid gap-4 sm:grid-cols-2">{query.data?.map(card => <article key={card.id} className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 font-semibold"><CreditCard aria-hidden="true" className="h-5 w-5 shrink-0" />{card.network}</h3>{card.isDefault && <span className="text-xs font-semibold text-accent dark:text-accent">Default reference</span>}</div>
      <p className="mt-3 font-sans text-lg tracking-widest">•••• {card.last4}</p><p className="mt-2 break-words text-sm">{card.cardholder}</p><p className="mt-1 text-xs text-muted dark:text-muted">Expires {card.expiry} · Mock reference</p>
      <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={query.busy} className={secondaryClass} onClick={() => { setEditing(card.id); setForm({ cardholder: card.cardholder, network: card.network, last4: card.last4, expiry: card.expiry, isDefault: card.isDefault }); setErrors({}); setShowForm(true); }}>Edit</button>{!card.isDefault && <button type="button" disabled={query.busy} className={secondaryClass} onClick={() => action(() => query.setDefault(card.id), 'Default card reference updated.')}>Set default</button>}<button type="button" disabled={query.busy} className={secondaryClass} onClick={() => action(() => query.remove(card.id), 'Card reference removed.')}>Remove</button></div>
    </article>)}</div>
  </section>;
};
