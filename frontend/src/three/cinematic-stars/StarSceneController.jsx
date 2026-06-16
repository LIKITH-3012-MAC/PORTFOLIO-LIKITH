import React from 'react';
import { useFrame } from '@react-three/fiber';

export const StarSceneController = ({ quality, currentPath }) => {
  useFrame((state) => {
    // Expose current path in scene userData for shaders and subcomponents to react to
    state.scene.userData.currentPath = currentPath || '/';
  });

  return null;
};

export default StarSceneController;
