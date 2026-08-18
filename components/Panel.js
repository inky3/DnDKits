export default function Panel({ title, eyebrow, right, children, className = "" }) {
  return (
    <div className={`bg-panel border border-line rounded-sm shadow-card ${className}`}>
      {(title || right) && (
        <div className="px-5 pt-4 pb-3 border-b border-line flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <div className="text-xs tracking-widest text-crimsonBright font-display mb-1">
                {eyebrow}
              </div>
            )}
            {title && (
              <h3 className="font-display text-xl text-parchment">{title}</h3>
            )}
          </div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
