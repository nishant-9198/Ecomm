import { useState } from "react";

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/models/model-3.jpg",
  className,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      className={`${className ?? ""} ${
        loaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    />
  );
}
