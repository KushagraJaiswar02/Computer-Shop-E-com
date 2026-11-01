import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const panelClass = 'account-panel rounded-xl border border-border bg-surface p-4 sm:p-5 dark:border-border dark:bg-surface';
export const buttonClass = 'account-action inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50';
export const secondaryClass = 'account-action inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-main hover:bg-surface-soft disabled:opacity-50 dark:border-border dark:bg-surface-elevated dark:text-main dark:hover:bg-surface-soft';
export const linkClass = 'inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline dark:text-accent';

export const AccountSkeleton: React.FC<{ label?: string }> = ({ label = 'Loading account' }) => <div role="status" aria-busy="true" className={`${panelClass} space-y-4`}><span className="sr-only">{label}</span><div className="skeleton-block h-6 w-1/3" /><div className="skeleton-block h-16 w-full" /><div className="skeleton-block h-16 w-full" /></div>;
export const AccountError: React.FC<{ message: string; retry?: () => void }> = ({ message, retry }) => <div role="alert" className={`${panelClass} space-y-3`}><p className="text-sm text-danger-ink dark:text-danger-ink">{message}</p>{retry && <button type="button" onClick={retry} className={secondaryClass}>Try again</button>}</div>;
export const EmptyAccountState: React.FC<{ title: string; description: string; to: string; action: string }> = ({ title, description, to, action }) => <div className={`${panelClass} py-10 text-center`}><h2 className="text-lg font-semibold text-main dark:text-main">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted dark:text-muted">{description}</p><Link to={to} className={`${linkClass} mt-3`}>{action}</Link></div>;
export const FormMessage: React.FC<{ error?: string; success?: string }> = ({ error, success }) => error ? <p role="alert" className="text-sm text-danger-ink dark:text-danger-ink">{error}</p> : success ? <p role="status" className="text-sm text-success-ink dark:text-success-ink">{success}</p> : null;

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  onChange(value: string): void;
}
export const AccountField: React.FC<FieldProps> = ({ label, error, onChange, type = 'text', ...props }) => {
  const id = useId(), [visible, setVisible] = useState(false);
  const password = type === 'password';
  return <div className="min-w-0"><label htmlFor={id} className="mb-1 block text-xs font-semibold text-main dark:text-main">{label}</label><div className="relative"><input {...props} id={id} type={password && visible ? 'text' : type} onChange={event => onChange(event.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`account-input w-full min-w-0 rounded-lg border bg-surface-soft px-3 py-2.5 text-sm text-main dark:bg-surface-elevated dark:text-main ${password ? 'pr-12' : ''} ${error ? 'border-danger' : 'border-border dark:border-border'}`} />{password && <button type="button" onClick={() => setVisible(value => !value)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted dark:text-main">{visible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}</button>}</div>{error && <p id={`${id}-error`} className="mt-1 text-xs text-danger-ink dark:text-danger-ink">{error}</p>}</div>;
};

const statusColors: Record<string, string> = {
  Placed: 'bg-surface-soft text-main dark:bg-surface-elevated dark:text-main',
  Confirmed: 'bg-accent/10 text-accent dark:bg-accent/10 dark:text-accent',
  Shipped: 'bg-info/10 text-info-ink dark:bg-info/10 dark:text-info-ink',
  Delivered: 'bg-success/10 text-success-ink dark:bg-success/10 dark:text-success-ink',
  Cancelled: 'bg-danger/10 text-danger-ink dark:bg-danger/10 dark:text-danger-ink',
  Received: 'bg-accent/10 text-accent dark:bg-accent/10 dark:text-accent',
  Searching: 'bg-warning/10 text-warning-ink dark:bg-warning/10 dark:text-warning-ink',
  Available: 'bg-success/10 text-success-ink dark:bg-success/10 dark:text-success-ink',
  Unavailable: 'bg-surface-soft text-main dark:bg-surface-elevated dark:text-main',
};
export const AccountStatus: React.FC<{ status: string }> = ({ status }) => <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[status] || statusColors.Placed}`}>{status}</span>;
