import {createContext, useContext, useMemo, useState} from "react";

const ToastContext = createContext(null);

export function ToastProvider({children}) {
    const [toasts, setToasts] = useState([]);

    function pushToast({type = "info", message}) {
        const id = crypto.randomUUID?.() || String(Date.now() + Math.random())
        const toast = {id, type, message};
        setToasts((prev) => [...prev, toast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    const value = useMemo(() => ({pushToast}), []);

    return (
        <ToastContext.Provider value = {value}>
            {children}
            <ToastViewport toasts = {toasts}/>
        </ToastContext.Provider>
    )
}

function ToastViewport({toasts}) {
    return (
        <div className = "fixed right-4 top-4 z-50 space-y-2 w-[320px] max-w-[90vw]">
            {toasts.map((t) => (
                <div key = {t.id} className = {`border rounded p-3 shadow bg-white ${t.type === "error" ? "border-red-300": "border-gray-200"}`}>
                    <div className = "text-sm font-semibold">{t.type === "error" ? "Error" : "Notice"}</div>
                    <div className = "text-sm opacity-70">{t.message}</div>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within <ToastProvider>");
    }

    return context;
}