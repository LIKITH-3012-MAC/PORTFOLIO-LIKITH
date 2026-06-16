import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { PLANET_TEXTURES } from './planetTextureManifest';
import { PLANET_FALLBACKS } from './textureFallbacks';

const loader = new THREE.TextureLoader();

export function usePlanetTextures(id) {
  const [textures, setTextures] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const manifest = PLANET_TEXTURES[id];

    if (!manifest) {
      setLoading(false);
      return;
    }

    const loadedTextures = {};
    const keys = Object.keys(manifest);
    let loadedCount = 0;
    const totalCount = keys.length;

    if (totalCount === 0) {
      setLoading(false);
      return;
    }

    keys.forEach((key) => {
      const url = manifest[key];
      loader.load(
        url,
        (texture) => {
          if (!active) {
            texture.dispose();
            return;
          }

          // Apply sRGB only to color/diffuse channels. Leave bump/normal in linear color space.
          if (key === 'color' || key === 'clouds' || key === 'ringColor') {
            texture.colorSpace = THREE.SRGBColorSpace;
          }

          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          loadedTextures[key] = texture;
          loadedCount++;

          if (loadedCount === totalCount) {
            setTextures(loadedTextures);
            setLoading(false);
          }
        },
        undefined, // onProgress
        (err) => {
          console.error(`Error loading texture ${url} for ${id}:`, err);
          if (active) {
            setError(true);
            setLoading(false);
          }
        }
      );
    });

    return () => {
      active = false;
      // Dispose loaded textures to prevent memory leaks
      Object.values(loadedTextures).forEach((texture) => {
        if (texture) {
          texture.dispose();
        }
      });
    };
  }, [id]);

  const fallback = PLANET_FALLBACKS[id] || { color: '#ffffff', roughness: 0.8, metalness: 0 };

  return {
    textures: error ? null : textures,
    loading,
    error,
    fallback
  };
}

export default usePlanetTextures;
