import { getCurrentWindow } from "@tauri-apps/api/window";

export default function TitleBar() {
  const win = getCurrentWindow();

  return (
    <div className="titlebar" data-tauri-drag-region>
      <span className="titlebar-title">Damas</span>
      <div className="titlebar-actions">
        <button className="titlebar-btn" onClick={() => win.minimize()} title="Minimizar">
          <svg viewBox="0 0 12 12" width="12" height="12"><rect y="5" width="12" height="1.5" fill="currentColor"/></svg>
        </button>
        <button className="titlebar-btn" onClick={() => win.toggleMaximize()} title="Maximizar">
          <svg viewBox="0 0 12 12" width="12" height="12"><rect x="1.5" y="1.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <button className="titlebar-btn titlebar-btn-close" onClick={() => win.close()} title="Fechar">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
