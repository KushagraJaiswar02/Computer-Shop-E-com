import React, { useState } from 'react';
import { ShoppingBag, Truck, Check, Eye, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { formatPrice, formatDate } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminOrdersPage: React.FC = () => {
  const { orders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Customer Orders & Shipments ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review customer hardware purchases, tracking codes, and simulated payment statuses.
        </p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-soft-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-3.5">Order Number</th>
              <th className="p-3.5">Customer & City</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Items</th>
              <th className="p-3.5">Total Amount</th>
              <th className="p-3.5">Shipment Status</th>
              <th className="p-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3.5 font-mono font-bold text-white">
                  #{order.orderNumber}
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-slate-200 block">{order.shippingAddress.fullName}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </span>
                </td>
                <td className="p-3.5 text-slate-400 font-mono">
                  {formatDate(order.date)}
                </td>
                <td className="p-3.5 text-slate-300">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} component(s)
                </td>
                <td className="p-3.5 font-mono font-bold text-brand-400">
                  {formatPrice(order.total)}
                </td>
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                        : 'bg-blue-950 text-blue-400 border border-blue-900'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    {order.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Inspect Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 text-xs space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                Order Manifest #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="text-slate-400 font-mono uppercase block">Delivery Target</span>
                <span className="font-semibold text-white block">{selectedOrder.shippingAddress.fullName}</span>
                <span className="text-slate-300 block">{selectedOrder.shippingAddress.street}</span>
                <span className="text-slate-300 block">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                </span>
                <span className="text-slate-400 font-mono block">Phone: {selectedOrder.shippingAddress.phone}</span>
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-2">Hardware Items</span>
                <div className="divide-y divide-slate-800">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2 flex justify-between items-center text-slate-300">
                      <span>{item.productName} (x{item.quantity})</span>
                      <span className="font-mono font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Grand Total</span>
                <span className="font-mono text-brand-400">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <KeycapButton variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Manifest
              </KeycapButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
