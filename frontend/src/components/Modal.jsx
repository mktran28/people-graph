export default function Modal({open, onClose, children}) {
    if (!open) {
        return null;
    }

    return (
        <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick = {onClose}>
            <div onClick = {(e) => e.stopPropagation()}>{children}</div>
        </div>
    )
}