import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { X } from 'lucide-react';

export const QrScannerModal = ({
    isOpen,
    onClose,
    onScanSuccess,
    onScanError,
    title = "Escanear Código de Barras",
    description = "Apunta la cámara hacia el código de barras del producto"
}) => {
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

    const closeModal = () => {
        onClose();
    };

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        const startScanning = async () => {
            try {
                // Obtener dispositivos de video
                const videoInputDevices = await codeReader.listVideoInputDevices();

                if (videoInputDevices.length === 0) {
                    if (onScanError) {
                        onScanError('No se encontró ninguna cámara disponible');
                    }
                    return;
                }

                // Usar la primera cámara disponible (o la trasera si está disponible)
                const selectedDeviceId = videoInputDevices[0].deviceId;

                if (!isMounted) return;
                setIsScanning(true);

                // Iniciar el escaneo continuo
                await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current,
                    (result, error) => {
                        if (result) {
                            // Código escaneado exitosamente
                            if (onScanSuccess) {
                                onScanSuccess(result.getText());
                            }
                            // Detener el escaneo después de éxito
                            codeReader.reset();
                            setIsScanning(false);
                            onClose();
                        }

                        if (error && !(error instanceof NotFoundException)) {
                            // Solo reportar errores que no sean "código no encontrado"
                            if (onScanError) {
                                onScanError(error.message);
                            }
                        }
                    }
                );
            } catch (error) {
                console.error('Error iniciando el escáner:', error);
                if (onScanError && isMounted) {
                    onScanError(error.message || 'Error al acceder a la cámara');
                }
                setIsScanning(false);
            }
        };

        startScanning();

        return () => {
            isMounted = false;
            if (codeReaderRef.current) {
                codeReaderRef.current.reset();
            }
            setIsScanning(false);
        };
    }, [isOpen, onScanSuccess, onScanError, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-51" onClick={onClose} />

            {/* Modal Container - DIMENSIONES FIJAS */}
            <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
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
                        <button onClick={closeModal} type='button' className="p-1 hover:bg-gray-100 rounded-lg transition" aria-label="Cerrar modal">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content - Video de la cámara */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-gray-900">
                        <div className="relative" style={{ width: '100%', maxWidth: '500px' }}>
                            <video
                                ref={videoRef}
                                className="w-full h-auto rounded-lg"
                                style={{
                                    maxHeight: '400px',
                                    objectFit: 'cover'
                                }}
                            />
                            {isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="border-4 border-green-500 rounded-lg"
                                        style={{
                                            width: '250px',
                                            height: '250px',
                                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                                        }}
                                    >
                                        <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-white text-sm mt-4 text-center">
                            {isScanning ? 'Escaneando... Apunta al código de barras' : 'Iniciando cámara...'}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={closeModal}
                            type='button'
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
