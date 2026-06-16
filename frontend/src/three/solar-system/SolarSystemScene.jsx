import React, { useMemo } from 'react';
import * as THREE from 'three';

import { PLANET_CONFIG } from './solarConfig';
import Sun from './Sun';
import Planet from './Planet';
import PlanetOrbit from './PlanetOrbit';
import AsteroidBelt from './AsteroidBelt';
import CometSystem from './CometSystem';
import SolarSceneController from './SolarSceneController';
import SolarCameraRig from './SolarCameraRig';
import IntroSceneController from '../../components/intro/IntroSceneController';
import IntroComet from '../../components/intro/IntroComet';

const PLANET_ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const ORBIT_COLOR = '#ffffff';
const SUN_POSITION = new THREE.Vector3(0, 0, 0);

export const SolarSystemScene = ({ quality, prefersReduced, introActive, introTime, onIntroComplete, currentPath }) => {
  // Filter planets based on quality tier
  const visiblePlanets = useMemo(() => {
    return PLANET_ORDER.filter(id => quality.visiblePlanets.includes(id));
  }, [quality.visiblePlanets]);

  return (
    <>
      {/* Controllers */}
      {introActive ? (
        <>
          <IntroSceneController 
            introActive={introActive} 
            introTime={introTime} 
            onIntroComplete={onIntroComplete} 
          />
          <IntroComet introTime={introTime} />
        </>
      ) : (
        <>
          <SolarSceneController quality={quality} currentPath={currentPath} />
          <SolarCameraRig quality={quality} prefersReduced={prefersReduced} />
        </>
      )}

      {/* Ambient environment light */}
      <ambientLight intensity={0.06} color="#ffffff" />
      <hemisphereLight
        skyColor="#4a6085"
        groundColor="#080b12"
        intensity={0.10}
      />

      {/* Main solar system group (moved by scroll controller) */}
      <group name="solar-system-group">
        {/* The Sun */}
        <Sun config={PLANET_CONFIG.sun} quality={quality} />

        {/* Planets with orbital paths */}
        {visiblePlanets.map((id) => {
          const config = PLANET_CONFIG[id];
          if (!config) return null;

          return (
            <group key={id}>
              {/* Orbit ring */}
              {config.orbitRadius && (
                <PlanetOrbit
                  radius={config.orbitRadius}
                  color={ORBIT_COLOR}
                  opacity={0.06}
                />
              )}

              {/* Planet */}
              <Planet
                id={id}
                config={config}
                quality={quality}
                sunPosition={SUN_POSITION}
                introActive={introActive}
                introTime={introTime}
              />
            </group>
          );
        })}

        {/* Asteroid belt between Mars and Jupiter */}
        <AsteroidBelt
          innerRadius={9.5}
          outerRadius={11.0}
          count={quality.asteroidCount}
          ySpread={0.5}
          baseColor="#888899"
        />

        {/* Comets and shooting stars */}
        {quality.cometsEnabled && (
          <CometSystem quality={quality} />
        )}
      </group>
    </>
  );
};

export default SolarSystemScene;
