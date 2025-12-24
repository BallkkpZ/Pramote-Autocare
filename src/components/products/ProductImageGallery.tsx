import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-muted border-2 border-primary overflow-hidden group">
          <img
            src={currentImage.url}
            alt={currentImage.alt || productName}
            className="w-full h-full object-contain"
          />

          {/* Zoom Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-primary"
            onClick={() => setIsZoomed(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-primary"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-primary"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 border-2 border-primary px-3 py-1 text-sm font-bold">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={`aspect-square border-2 overflow-hidden hover:opacity-80 transition-opacity ${
                  index === currentIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 border-2 border-primary">
          <div className="relative w-full h-full bg-background">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 z-10 border-2 border-primary"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={currentImage.url}
                alt={currentImage.alt || productName}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation in Zoom */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 border-2 border-primary"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 border-2 border-primary"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Thumbnail Strip in Zoom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/90 p-2 border-2 border-primary max-w-[90%] overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-16 h-16 shrink-0 border-2 overflow-hidden hover:opacity-80 transition-opacity ${
                        index === currentIndex ? 'border-primary ring-2 ring-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${productName} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
