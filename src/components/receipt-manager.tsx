import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, FileCheck, Sparkles, Camera, Scan } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface ReceiptManagerProps {
  onReceiptUpload?: (file: File, preview: string) => void;
  onReceiptRemove?: () => void;
  existingReceipt?: string | null;
}

export function ReceiptManager({ onReceiptUpload, onReceiptRemove, existingReceipt }: ReceiptManagerProps) {
  const [receiptPreview, setReceiptPreview] = useState<string | null>(existingReceipt || null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setReceiptPreview(preview);
        
        // Simulate OCR processing
        simulateOCR();
        
        if (onReceiptUpload) {
          onReceiptUpload(file, preview);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function simulateOCR() {
    setIsProcessing(true);
    toast.info('Scanning receipt...', { duration: 1500 });
    
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Receipt uploaded! OCR feature coming soon', {
        description: 'Automatic extraction of amount, merchant, and date',
      });
    }, 1500);
  }

  function removeReceipt() {
    setReceiptPreview(null);
    if (onReceiptRemove) {
      onReceiptRemove();
    }
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {!receiptPreview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 hover:from-violet-100 hover:to-fuchsia-100 dark:hover:from-violet-950/30 dark:hover:to-fuchsia-950/30 transition-all group">
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/40 transition-shadow"
                >
                  <Camera className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-sm font-medium text-foreground mb-1">Upload Receipt</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-powered OCR coming soon</span>
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleReceiptUpload}
              />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="overflow-hidden border-2 border-violet-200 dark:border-violet-800 shadow-lg">
              <div className="relative">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-56 object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Processing indicator */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-violet-600/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-16 h-16 mx-auto mb-3"
                        >
                          <Scan className="w-16 h-16 text-white" />
                        </motion.div>
                        <p className="text-white font-medium">Scanning receipt...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Status badge */}
                {!isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-violet-700 shadow-lg"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Receipt uploaded</span>
                  </motion.div>
                )}
                
                {/* Remove button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeReceipt}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Info section */}
              <CardContent className="p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
                <div className="flex items-start gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    OCR feature coming soon - Automatically extract amount, merchant name, date, and itemized details from your receipts
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
