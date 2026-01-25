export default function ConfirmModal({title = "Confirm", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, danger = false}) {
    return (
        <div className = "relative bg-white rounded-xl shadow-xl max-w-md w-[92vw] p-4">
            <div className = "text-lg font-semibold">{title}</div>

            {message && <div>{message}</div>}

            <div className = "mt-4 flex justify-end gap-2">
                <button className = "px-3 py-2 rounded-xl border text-sm" onClick = {onCancel}>{cancelText}</button>
                <button className = {`px-3 py-2 rounded-xl text-sm text-white ${danger ? "bg-red-600" : "bg-black"}`} onClick = {onConfirm}>{confirmText}</button>
            </div>
        </div>
    );
}