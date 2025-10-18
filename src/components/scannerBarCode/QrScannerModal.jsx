import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const qrcodeRegionId = "html5qr-code-modal-region";

export const QrScannerModal = ({
    isOpen,
    onClose,
    onScanSuccess,
    onScanError,
    title = "Escanear Código de Barras",
    description = "Apunta la cámara hacia el código de barras del producto"
}) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Pequeño delay para asegurar que el DOM esté listo
        const timer = setTimeout(() => {
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1,
                disableFlip: false,
            };

            const verbose = false;

            const html5QrcodeScanner = new Html5QrcodeScanner(
                qrcodeRegionId,
                config,
                verbose
            );

            const successCallback = (decodedText, decodedResult) => {
                if (onScanSuccess) {
                    onScanSuccess(decodedText);
                }
                html5QrcodeScanner.clear().catch(error => {
                    console.error("Failed to clear scanner:", error);
                });
                onClose();
            };

            const errorCallback = (error) => {
                if (onScanError) {
                    onScanError(error);
                }
            };

            html5QrcodeScanner.render(successCallback, errorCallback);
            scannerRef.current = html5QrcodeScanner;
        }, 100);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner:", error);
                });
            }
        };
    }, [isOpen, onScanSuccess, onScanError, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

            {/* Modal Container - DIMENSIONES FIJAS */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div
                    className="bg-white rounded-lg shadow-lg pointer-events-auto overflow-hidden"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition" aria-label="Cerrar modal">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content - SCROLL si es necesario */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
                        <div
                            id={qrcodeRegionId}
                            style={{ width: '100%', maxWidth: '400px' }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
