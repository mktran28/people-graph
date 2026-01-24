export default function ConfirmModal({open, title = "Confirm", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, danger = false}) {
    if (!open) {
        return null;
    }

    return (
        <div className = "fixed inset-0 z-50 flex items-center justify-center">
            <div className = "absolute inset-0 bg-black/40" onClick = {onCancel} />

            <div className = "relative bg-white rounded-xl shadow-xl max-w-md w-[92vw] p-4">
                <div className = "text-lg font-semibold">{title}</div>

                {message && <div>{message}</div>}

                <div className = "mt-4 flex justify-end gap-2">
                    <button className = "px-3 py-2 rounded-xl border text-sm" onClick = {onCancel}>{cancelText}</button>
                    <button className = {`px-3 py-2 rounded-xl text-sm text-white ${danger ? "bg-red-600" : "bg-black"}`} onClick = {onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}