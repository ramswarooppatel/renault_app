
import { useRef } from 'react';

const CarModel = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resetView = () => {
    // Reload iframe to reset view
    if (iframeRef.current) {
      // eslint-disable-next-line no-self-assign
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] relative rounded-lg overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        title="Renault Captur"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/2d166ebc096d4cc5bdeef76fb2eb1798/embed?dnt=1&autostart=1&ui_theme=dark"
      />
    </div>
  );
};

export default CarModel;
