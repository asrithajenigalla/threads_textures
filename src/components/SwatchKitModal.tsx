import React, { useState } from 'react';
import { FABRICS } from '../data/fabrics';
import { COLORS } from '../data/colors';
import { FabricId, ColorShade } from '../types';
import { X, Layers, Check, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

interface SwatchKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: ColorShade;
}

export const SwatchKitModal: React.FC<SwatchKitModalProps> = ({
  isOpen,
  onClose,
  currentColor
}) => {
  const [selectedSwatches, setSelectedSwatches] = useState<FabricId[]>([
    'kanchipuram_silk',
    'banarasi_brocade'
  ]);
  const [clientName, setClientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const toggleSwatch = (id: FabricId) => {
    setSelectedSwatches((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOrderSwatchKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || selectedSwatches.length === 0) return;
    setIsOrdered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F7F3EB] border border-[#E2D8C3] text-[#B89355]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                Bespoke Atelier Swatch Kit
              </h3>
              <p className="text-xs text-[#8C7A5B]">
                Complimentary 6"×6" tactile weave samples with certificate of zari purity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8C7A5B] hover:text-[#24211D] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {isOrdered ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif-luxury text-xl font-bold text-[#24211D]">
                Swatch Kit Dispatched
              </h4>
              <p className="text-xs text-[#6B6254] max-w-md mx-auto leading-relaxed">
                Your curated presentation box containing {selectedSwatches.length} authentic textile swatches dyed in <strong>{currentColor.name}</strong> has been assigned to our Varanasi courier. Expected arrival in 3-5 business days.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold bg-[#24211D] text-white rounded-md cursor-pointer"
                >
                  Return to Studio
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6254] block mb-2">
                  Select Swatches for Your Presentation Box:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FABRICS.map((fabric) => {
                    const isSelected = selectedSwatches.includes(fabric.id);
                    return (
                      <button
                        key={fabric.id}
                        type="button"
                        onClick={() => toggleSwatch(fabric.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? 'bg-white border-[#B89355] shadow-xs ring-1 ring-[#B89355]'
                            : 'bg-[#F7F3EB] border-[#E2D8C3] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                            {fabric.name}
                          </div>
                          <div className="text-[10px] text-[#8C7A5B]">
                            {fabric.sheenLevel} · {fabric.drapeWeight}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#B89355] border-[#B89355] text-white'
                              : 'border-[#C7BBA4] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dye & Zari Note */}
              <div className="p-3 bg-[#F4EFE6] border border-[#E0D7C4] rounded-lg text-xs text-[#5E5547] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89355] shrink-0" />
                <span>
                  All swatches in this kit will be prepared with your currently selected <strong>{currentColor.name}</strong> natural dye bath and silver-gold electroplated zari borders.
                </span>
              </div>

              {/* Delivery Form */}
              <form onSubmit={handleOrderSwatchKit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#453F35] mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Anya Montgomery"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD5C3] rounded-md focus:outline-none focus:border-[#B89355]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#453F35] mb-1">
                    Courier Shipping Address & Postal Code
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Residential / Atelier Suite Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DDD5C3] rounded-md focus:outline-none focus:border-[#B89355]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={selectedSwatches.length === 0}
                  className="w-full py-2.5 bg-[#24211D] hover:bg-[#3D372F] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Truck className="w-3.5 h-3.5 text-[#E6C687]" />
                  <span>Request Complimentary Swatch Kit ({selectedSwatches.length} Swatches)</span>
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
