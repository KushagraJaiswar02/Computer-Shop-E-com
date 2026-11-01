import React, { useState } from 'react';
import { authorize, audit } from '../../services/admin/mockAdmin';
import { adminConfig } from '../../config/admin';
import { useStore } from '../../context/StoreContext';
import { AdminButton, AdminModal, Field, PageHeading, Panel, useAdminToast } from './AdminUi';
export const AdminSettingsPage: React.FC = () => {
  const { resetHomepageConfig, homepageConfig } = useStore(), toast = useAdminToast();
  const [reset, setReset] = useState<'homepage' | 'all' | 'reload' | 'clear' | null>(null), [confirmation, setConfirmation] = useState(''), [error, setError] = useState('');
  const run = () => {
    if (confirmation !== 'RESET') return;
    try {
      const user = authorize('settings.write');
      if (reset === 'homepage') { resetHomepageConfig(); audit(user, 'settings', 'homepage', 'reset', homepageConfig, null); setReset(null); toast('Homepage reset to its original layout.'); }
      else if (reset === 'reload') {
        audit(user, 'settings', 'demo', 'reload', null, { source: 'deterministic-demo-generator' });
        localStorage.removeItem('compshop_demo_cleared');
        ['compshop_custom_products', 'compshop_archived_products', 'compshop_orders', 'compshop_enquiries', 'compshop_cart', 'compshop_wishlist', 'compshop_compare', 'compshop_homepage_config_v3'].forEach(key => localStorage.removeItem(key));
        window.location.reload();
      } else if (reset === 'clear') {
        audit(user, 'settings', 'demo', 'clear', { source: 'browser-demo-data' }, null);
        localStorage.setItem('compshop_demo_cleared', '1');
        ['compshop_custom_products', 'compshop_archived_products', 'compshop_orders', 'compshop_enquiries', 'compshop_cart', 'compshop_wishlist', 'compshop_compare', 'compshop_homepage_config_v3', 'compshop_admin_audit'].forEach(key => localStorage.removeItem(key));
        window.location.reload();
      }
      else {
        audit(user, 'settings', 'demo', 'reset', { keys: ['products', 'archive', 'orders', 'enquiries', 'cart', 'wishlist', 'compare', 'homepage'] }, null);
        resetHomepageConfig();
        ['compshop_custom_products', 'compshop_archived_products', 'compshop_orders', 'compshop_enquiries', 'compshop_cart', 'compshop_wishlist', 'compshop_compare', 'compshop_homepage_config_v3'].forEach(key => localStorage.removeItem(key));
        window.location.reload();
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not reset.'); }
  };
  const start = (value: 'homepage' | 'all' | 'reload' | 'clear') => { setReset(value); setConfirmation(''); setError(''); };
  const modalTitle = reset === 'homepage' ? 'Reset homepage?' : reset === 'reload' ? 'Reload demo data?' : reset === 'clear' ? 'Clear all demo data?' : 'Reset demo data?';
  const modalCopy = reset === 'homepage' ? 'This replaces your homepage changes with the original layout.' : reset === 'clear' ? 'This removes browser-stored demo data. You can reload it later from this page.' : 'This clears your shop edits in this browser and reloads deterministic demo data.';
  return <div className="au-stack"><PageHeading title="Settings" description="Manage this demo workspace and restore the original shop setup." /><Panel title="About this workspace"><p className="au-muted">Your products, stock changes, orders, wishlist and homepage edits are saved in this browser. {adminConfig.PUBLIC_DEMO_ACCESS ? 'Public demo access is enabled.' : 'Admin access requires an admin account.'} {adminConfig.DEMO_MODE && 'Demo admin sign-in is available on the login page.'}</p></Panel><Panel title="Demo data"><p className="au-muted mb-4">Reload the full deterministic demo catalogue, customer activity and admin scenarios, or remove the browser-stored demo records.</p><div className="au-actions"><AdminButton onClick={() => start('reload')}>Reload demo data</AdminButton><AdminButton variant="danger" onClick={() => start('clear')}>Clear all data</AdminButton></div></Panel><Panel title="Reset homepage"><p className="au-muted mb-4">Restore the original sections, banners, announcement and product selections. Products and orders are kept.</p><AdminButton onClick={() => start('homepage')}>Reset homepage</AdminButton></Panel><Panel title="Reset demo data"><p className="au-muted mb-4">Remove catalog edits, archived products, custom orders, enquiries, basket, wishlist, comparison list and homepage changes. The original sample shop will load again. Accounts and audit history are kept.</p><AdminButton variant="danger" onClick={() => start('all')}>Reset demo data</AdminButton></Panel>{reset && <AdminModal title={modalTitle} onClose={() => setReset(null)}><p className="mb-5">{modalCopy} This cannot be undone.</p><Field label="Type RESET to confirm" error={error}><input autoComplete="off" value={confirmation} onChange={event => setConfirmation(event.target.value)} /></Field><div className="au-actions mt-5"><AdminButton onClick={() => setReset(null)}>Keep my changes</AdminButton><AdminButton variant="danger" disabled={confirmation !== 'RESET'} onClick={run}>Confirm</AdminButton></div></AdminModal>}</div>;
};
