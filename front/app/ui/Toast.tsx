import { useEffect, useState } from "react";

export default function Toast({ msg, open, onClose }: { msg: string; open: boolean; onClose(): void }) {
  const [show, setShow] = useState(open);
  useEffect(() => {
    setShow(open);
    if (open) {
      const t = setTimeout(() => { setShow(false); onClose(); }, 2200);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-end p-4">
      <div className="pointer-events-auto rounded-[var(--radius-lg)] bg-black/90 px-4 py-2 text-sm text-white shadow-lg">
        {msg}
      </div>
    </div>
  );
}
