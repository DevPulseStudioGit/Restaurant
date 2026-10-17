import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Branch } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Edit3, Trash2, X, MapPin, Phone, Clock } from 'lucide-react';

export const AdminBranches: React.FC = () => {
  const { showToast } = useRestaurant();
  const [branches, setBranches] = useState<Branch[]>(() => StorageService.getBranches());
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [minOrder, setMinOrder] = useState(800);
  const [deliveryZones, setDeliveryZones] = useState('');
  const [estDeliveryTime, setEstDeliveryTime] = useState('35 - 45 mins');
  const [estPickupTime, setEstPickupTime] = useState('15 - 20 mins');
  const [active, setActive] = useState(true);

  const refresh = () => setBranches(StorageService.getBranches());

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setName('');
    setAddress('');
    setArea('Karachi East');
    setPhone('+92 21 3498 0000');
    setHours('01:00 PM - 01:30 AM (Daily)');
    setDeliveryFee(140);
    setMinOrder(700);
    setDeliveryZones('PECHS, Bahadurabad, Tariq Road');
    setEstDeliveryTime('35 - 45 mins');
    setEstPickupTime('15 - 20 mins');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setName(branch.name);
    setAddress(branch.address);
    setArea(branch.area);
    setPhone(branch.phone);
    setHours(branch.hours);
    setDeliveryFee(branch.deliveryFee);
    setMinOrder(branch.minOrder);
    setDeliveryZones(branch.deliveryZones.join(', '));
    setEstDeliveryTime(branch.estDeliveryTimeMinutes);
    setEstPickupTime(branch.estPickupTimeMinutes);
    setActive(branch.active);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, branchName: string) => {
    if (confirm(`Delete branch "${branchName}"?`)) {
      StorageService.deleteBranch(id);
      refresh();
      showToast(`Branch "${branchName}" deleted.`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const zones = deliveryZones.split(',').map((z) => z.trim()).filter(Boolean);

    const newBranch: Branch = {
      id: editingBranch ? editingBranch.id : `branch-${Date.now()}`,
      slug: editingBranch ? editingBranch.slug : slug,
      name: name.trim(),
      address: address.trim(),
      area: area.trim(),
      city: 'Karachi',
      phone: phone.trim(),
      hours: hours.trim(),
      coordinates: editingBranch ? editingBranch.coordinates : { lat: 24.86, lng: 67.0 },
      supportedOrderTypes: ['delivery', 'pickup'],
      deliveryZones: zones,
      deliveryFee: Number(deliveryFee),
      minOrder: Number(minOrder),
      active,
      estDeliveryTimeMinutes: estDeliveryTime.trim(),
      estPickupTimeMinutes: estPickupTime.trim(),
    };

    StorageService.saveBranch(newBranch);
    refresh();
    setIsModalOpen(false);
    showToast(`Saved branch "${newBranch.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Locations & Service Rules
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Kitchen Branches ({branches.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B64E35] uppercase">{b.area}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    b.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {b.active ? 'Operational' : 'Closed'}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-[#25231F]">{b.name}</h3>

              <div className="space-y-1.5 text-xs text-[#77736D]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B64E35] shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B64E35] shrink-0" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B64E35] shrink-0" />
                  <span>{b.hours}</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F4] rounded-xl text-xs space-y-1">
                <div className="text-[10px] uppercase font-semibold text-[#77736D]">Delivery Coverage:</div>
                <div className="text-[#25231F] truncate">{b.deliveryZones.join(', ')}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#FAF8F4] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#77736D] block">Fee / Min Order:</span>
                <span className="font-bold text-[#25231F]">Rs. {b.deliveryFee} / Rs. {b.minOrder}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 text-[#77736D] hover:text-[#25231F] rounded-lg"
                  title="Edit branch"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className="p-1.5 text-[#77736D] hover:text-rose-600 rounded-lg"
                  title="Delete branch"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
              <h3 className="font-serif font-bold text-xl text-[#25231F]">
                {editingBranch ? 'Edit Branch' : 'Add Kitchen Branch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Branch Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Neighborhood / Area</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Phone Hotline</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Opening Hours</label>
                  <input
                    type="text"
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Min. Order (PKR)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">
                  Delivery Zones Covered (Comma separated)
                </label>
                <input
                  type="text"
                  value={deliveryZones}
                  onChange={(e) => setDeliveryZones(e.target.value)}
                  placeholder="DHA Phase 1-8, Clifton, Zamzama..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="b-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-[#B64E35]"
                />
                <label htmlFor="b-active" className="text-xs text-[#25231F]">
                  Branch is active and accepting orders
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2DA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B64E35] text-white text-xs font-semibold px-5 py-2 rounded-xl"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
