import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '../utils/analytics';

interface AdSenseSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slot = '8910111213', // default slot placeholder or provided by user
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only attempt push once per mount
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (err) {
      // Gracefully silent if adblocker blocks or script unready
    }
  }, []);

  return (
    <div
      className={`my-8 mx-auto w-full max-w-5xl rounded-xl border border-white/5 bg-[#0a0f18]/60 p-3 text-center overflow-hidden transition-all ${className}`}
      aria-label="Advertisement"
    >
      <div className="flex items-center justify-between pb-1.5 px-2 text-[10px] uppercase font-mono tracking-widest text-slate-500 border-b border-white/5 mb-2">
        <span>Advertisement</span>
        <span className="text-slate-600">CodeExecute Sponsored</span>
      </div>
      <div className="min-h-[90px] flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};
