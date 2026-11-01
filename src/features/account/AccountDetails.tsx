import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { errorMessage, FieldErrors, validatePassword, validateProfile } from '../../services/account/validation';
import { AccountField, buttonClass, FormMessage, panelClass } from './AccountUi';
import { accountConfig } from '../../config/account';
import { AccountAddresses } from './AccountAddresses';
import { AccountCards } from './AccountCards';

export const AccountDetails: React.FC = () => {
  const auth = useAuth();
  const [profile, setProfile] = useState({ name: auth.user?.name || '', email: auth.user?.email || '', phone: auth.user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FieldErrors>({}), [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});
  const [profileBusy, setProfileBusy] = useState(false), [passwordBusy, setPasswordBusy] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' }), [passwordMessage, setPasswordMessage] = useState({ error: '', success: '' });
  useEffect(() => { if (auth.user) setProfile({ name: auth.user.name, email: auth.user.email, phone: auth.user.phone }); }, [auth.user]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); const next = validateProfile(profile); setErrors(next); setMessage({ error: '', success: '' });
    if (Object.keys(next).length) return;
    setProfileBusy(true);
    try { await auth.updateProfile(profile); setMessage({ error: '', success: 'Account details saved.' }); }
    catch (failure) { setMessage({ error: errorMessage(failure), success: '' }); }
    finally { setProfileBusy(false); }
  };
  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault(); const next = validatePassword(passwords); setPasswordErrors(next); setPasswordMessage({ error: '', success: '' });
    if (Object.keys(next).length) return;
    setPasswordBusy(true);
    try { await auth.changePassword(passwords); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordMessage({ error: '', success: 'Password changed.' }); }
    catch (failure) { setPasswordMessage({ error: errorMessage(failure), success: '' }); }
    finally { setPasswordBusy(false); }
  };
  return <div className="space-y-5"><h1 className="text-2xl font-bold">Account details</h1>
    <section className={panelClass}><h2 className="mb-4 text-base font-semibold">Profile</h2><form noValidate onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><AccountField label="Full name" name="name" required autoComplete="name" value={profile.name} onChange={name => setProfile(current => ({ ...current, name }))} error={errors.name} /><AccountField label="Email address" name="email" required type="email" autoComplete="email" value={profile.email} onChange={email => setProfile(current => ({ ...current, email }))} error={errors.email} /><AccountField label="Phone number" name="phone" required type="tel" autoComplete="tel" value={profile.phone} onChange={phone => setProfile(current => ({ ...current, phone }))} error={errors.phone} /></div>
      <FormMessage {...message} /><button type="submit" disabled={profileBusy || auth.busy} className={buttonClass}>{profileBusy ? 'Saving…' : 'Save details'}</button>
    </form></section>
    {accountConfig.SHOW_ADDRESSES && <AccountAddresses embedded />}
    {accountConfig.SHOW_CARD_DETAILS && <AccountCards />}
    <section className={panelClass}><h2 className="mb-4 text-base font-semibold">Change password</h2><form noValidate onSubmit={changePassword} className="space-y-4">
      <AccountField label="Current password" name="currentPassword" required type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={currentPassword => setPasswords(current => ({ ...current, currentPassword }))} error={passwordErrors.currentPassword} />
      <div className="grid gap-4 sm:grid-cols-2"><AccountField label="New password" name="newPassword" required type="password" autoComplete="new-password" value={passwords.newPassword} onChange={newPassword => setPasswords(current => ({ ...current, newPassword }))} error={passwordErrors.newPassword} /><AccountField label="Confirm new password" name="confirmPassword" required type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={confirmPassword => setPasswords(current => ({ ...current, confirmPassword }))} error={passwordErrors.confirmPassword} /></div>
      <FormMessage {...passwordMessage} /><button type="submit" disabled={passwordBusy || auth.busy} className={buttonClass}>{passwordBusy ? 'Changing password…' : 'Change password'}</button>
    </form></section>
  </div>;
};
