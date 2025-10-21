import React, { useEffect, useRef, useState } from 'react';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  anchorEl?: HTMLElement | null;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  anchorEl,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsReady(false);
      setPosition(null);
    } else {
      document.body.style.overflow = '';
      setIsReady(false);
      setPosition(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && anchorEl && sheetRef.current) {
      // Wait for next frame to ensure layout is calculated
      requestAnimationFrame(() => {
        if (!sheetRef.current) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const sheetRect = sheetRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = anchorRect.bottom + 8;
        let left = anchorRect.left;

        // On mobile, center horizontally with padding
        if (viewportWidth < 640) {
          const sheetWidth = Math.min(320, viewportWidth - 32);
          left = (viewportWidth - sheetWidth) / 2;
        } else {
          // Desktop: adjust if sheet goes off right edge
          if (left + sheetRect.width > viewportWidth) {
            left = viewportWidth - sheetRect.width - 16;
          }

          // Adjust if sheet goes off left edge
          if (left < 16) {
            left = 16;
          }
        }

        // Adjust if sheet goes off bottom edge
        if (top + sheetRect.height > viewportHeight - 16) {
          top = anchorRect.top - sheetRect.height - 8;
        }

        // Ensure top doesn't go above viewport
        if (top < 16) {
          top = 16;
        }

        setPosition({ top, left });
        setIsReady(true);
      });
    } else if (isOpen && !anchorEl) {
      // No anchor element, show immediately at center
      setIsReady(true);
    }
  }, [isOpen, anchorEl]);

  if (!isOpen) return null;

  const usePositioning = anchorEl && position;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Action Sheet */}
      <div
        ref={sheetRef}
        className={`absolute transition-opacity duration-150 ${isReady ? 'opacity-100 animate-scale-in' : 'opacity-0'}`}
        style={usePositioning ? { top: position.top, left: position.left } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-auto min-w-[280px] max-w-[calc(100vw-32px)]">
          {/* Content Container */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col">
            {/* Title */}
            {title && (
              <div className="px-6 py-4 border-b border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {title}
                </h3>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="overflow-y-auto elastic-scroll">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

