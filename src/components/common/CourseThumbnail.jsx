import { isLogoImage } from '../../utils/courseImage';

// Brand-logo thumbnails have a transparent background and aren't
// photographic, so they're shown padded/contained on a neutral background
// instead of cropped edge-to-edge like a regular cover photo.
export default function CourseThumbnail({ src, alt, className = '' }) {
  if (isLogoImage(src)) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <img src={src} alt={alt} className="h-2/3 w-2/3 object-contain" />
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
