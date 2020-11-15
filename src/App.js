import React, { Suspense, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  useLoader,
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import mc from "./t.png";
import bw from "./b.png";
import * as THREE from "three";
import "./styles.css";

extend({ OrbitControls });

function Box({
  position = [1, 1, 1],
  _texture = mc,
  animation = false,
  speed = 0.1,
}) {
  const mesh = useRef();
  const [texture] = useLoader(THREE.TextureLoader, [_texture]);
  const radiansPerSecond = THREE.MathUtils.degToRad(30);

  useFrame(() => {
    if (animation) {
      mesh.current.rotation.x = mesh.current.rotation.z = mesh.current.rotation.y +=
        radiansPerSecond * speed;
    }
  });

  return (
    <mesh ref={mesh} position={position} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
}

function Sphere() {
  const [texture] = useLoader(THREE.TextureLoader, [mc]);

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        map={texture}
        opacity={1}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

const CameraControls = () => {
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame like tick method
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      maxAzimuthAngle={2 * Math.PI}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-2 * Math.PI}
      minPolarAngle={0}
      enableDamping
    />
  );
};

export default function App() {
  const [shAmbLig, setAmbLig] = useState(false);
  const [controls, setControls] = useState(false);
  const [animateCube, setAnCub] = useState(false);
  const [speed, setSpeed] = useState(0);
  return (
    <>
      <h1>Example React Fiber </h1>
      <div className="controls">
        <button onClick={() => setAmbLig((prev) => !prev)}>
          {shAmbLig ? "Apagar" : "Encender luz"}
        </button>
        <button onClick={() => setControls((prev) => !prev)}>
          {controls ? "Deshabiliar control" : "Habilitar control"}
        </button>
      </div>
      <br />
      <div>
        <button onClick={() => setAnCub((prev) => !prev)}>
          {animateCube ? "Parar" : "Animar"}
        </button>
        <br />
        {animateCube && (
          <>
            <input
              id="typeinp"
              type="range"
              min="0"
              max="0.5"
              value={speed}
              onChange={({ target: { value } }) => setSpeed(value)}
              step="0.001"
            />
            <p>Velocidad: {speed}</p>
          </>
        )}
      </div>
      <br />

      <div className="container">
        <Canvas
          style={{ background: "white" }}
          camera={{ position: [0, 0, 6] }}
        >
          {controls && <CameraControls />}
          {shAmbLig && <ambientLight intensity={0.5} />}
          <directionalLight intensity={1} position={[0, 0, 6]} />
          <Suspense fallback={<>Cargando .... </>}>
            <>
              <Sphere />
              <Box
                speed={speed}
                _texture={bw}
                position={[2, 0, 2]}
                animation={animateCube}
              />
              <Box
                _texture={bw}
                speed={speed}
                position={[-2, 0, 2]}
                animation={animateCube}
              />
              <Box
                speed={speed}
                position={[-2, 0, -2]}
                animation={animateCube}
              />
              <Box
                speed={speed}
                position={[2, 0, -2]}
                animation={animateCube}
              />
              <Box speed={speed} position={[0, 2, 0]} animation={animateCube} />
              <Box
                _texture={bw}
                speed={speed}
                position={[0, -2, 0]}
                animation={animateCube}
              />
            </>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
