// Temporary verification render for Task 2 (3D asset spike). Confirms
// public/models/brain.glb loads and renders. Replaced by Task 7's real
// scene/camera setup.
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Brain() {
  const { scene } = useGLTF('/models/brain.glb')
  return <primitive object={scene} />
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 400] }}>
      <ambientLight intensity={1} />
      <Brain />
      <OrbitControls />
    </Canvas>
  )
}
