import { useRef, useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Plus, ScanQrCodeIcon } from 'lucide-react';
import { QrScannerModal } from '../scannerBarCode/QrScannerModal';

export function CodesModal({ isOpen, onClose, onAddCodes }) {
  const inputRefs = useRef([]);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  const { control, watch, reset, setValue } = useForm({
    defaultValues: {
      codes: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'codes',
  });

  const handleNewScanResult = (decodedText) => {
    const lastIndex = fields.length - 1;
    setValue(`codes.${lastIndex}.value`, decodedText);

    append({ value: '' });
    inputRefs.current[lastIndex + 1]?.focus();
    setQrScannerOpen(false);
  };

  const handleScanBarcode = () => {
    setQrScannerOpen(true);
  };

  const handleCloseQrScanner = () => {
    setQrScannerOpen(false);
  };

  // Handle dialog open change only if QR scanner is not open
  const handleDialogOpenChange = (open) => {
    if (!qrScannerOpen) {
      onClose(open);
      handleClearAll();
    }
  };

  const codesWatch = watch('codes');

  const handleSubmitAddCodes = () => {
    const filledCodes = codesWatch.filter(
      (code) => code.value?.trim().length > 0
    );
    onAddCodes(filledCodes);
  };

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    if (!isOpen) {
      setQrScannerOpen(false);
    }
  }, [isOpen]);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const currentValue = codesWatch[index]?.value?.trim();

      // If this is the last input and it has a value, add a new input
      if (index === fields.length - 1 && currentValue) {
        append({ value: '' });
        // Focus the new input after state updates
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      } else if (index < fields.length - 1) {
        // Move to next input
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleRemoveCode = (index) => {
    if (fields.length > 1) {
      remove(index);
      // Focus previous input or first input
      setTimeout(() => {
        const focusIndex = index > 0 ? index - 1 : 0;
        inputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const handleAddInput = () => {
    append({ value: '' });
    setTimeout(() => {
      inputRefs.current[fields.length]?.focus();
    }, 0);
  };

  const handleClearAll = () => {
    reset({ codes: [{ value: '' }] });
  };

  const filledCodesCount = codesWatch.filter(
    (code) => code.value?.trim().length > 0
  ).length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            if (qrScannerOpen) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Escanear Códigos - Modo Masivo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 <strong>Instrucciones:</strong> Escanea cada código con tu
                pistola lectora. Presiona Enter o espera a que se agregue
                automáticamente el siguiente campo.
              </p>
            </div>

            <Card className="p-4 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-1 text-center">
                      {index + 1}
                    </span>
                    <Controller
                      name={`codes.${index}.value`}
                      control={control}
                      render={({ field: controllerField }) => (
                        <Input
                          {...controllerField}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                            controllerField.ref(el);
                          }}
                          type="text"
                          placeholder={`Código ${index + 1}`}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className="flex-1 text-sm w-full"
                        />
                      )}
                    />
                    {!watch(`codes.${index}.value`) && (
                      <Button
                        size="sm"
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-700"
                        onClick={handleScanBarcode}
                      >
                        <p className='block md:hidden'>Escanear Código</p>
                        <ScanQrCodeIcon className="hidden md:block" />
                      </Button>
                    )}
                    {fields.length > 1 && (
                      <button
                        onClick={() => handleRemoveCode(index)}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                        aria-label="Eliminar código"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <strong>{filledCodesCount}</strong> código(s) ingresado(s)
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddInput}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar campo
                </Button>
                {filledCodesCount > 0 && (
                  <Button
                    onClick={handleClearAll}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Limpiar todo
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={handleSubmitAddCodes}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Insertar códigos
              </Button>
              <Button
                onClick={handleDialogOpenChange}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {
        qrScannerOpen && (
          <QrScannerModal
            isOpen={qrScannerOpen}
            title="Escanear Código de Barras"
            description="Apunta la cámara hacia el código de barras del producto"
            onScanSuccess={handleNewScanResult}
            onScanError={(errorMessage) => {
              // Solo loguear errores reales, ignorar "NotFoundException"
              if (!errorMessage.includes('NotFoundException')) {
                console.error('Error de escaneo:', errorMessage);
              }
            }}
            onClose={handleCloseQrScanner}
          />
        )
      }
    </>
  );
}
