import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Vec3 = [number, number, number]

interface NodeProps {
  position: Vec3
  size?: number
  brightness?: number
}

const Node = ({ position, size = 0.02, brightness = 1 }: NodeProps) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0] + position[1]) * 0.2
      ref.current.scale.setScalar(scale)
    }
  })

  const color = brightness > 0.7 ? '#67e8f9' : brightness > 0.4 ? '#22d3ee' : '#0e7490'

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6 + brightness * 0.4} />
    </mesh>
  )
}

interface ParticleProps {
  initialPosition: Vec3
  speed: number
  size: number
  opacity: number
}

const Particle = ({ initialPosition, speed, size, opacity }: ParticleProps) => {
  const ref = useRef<THREE.Mesh>(null)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.x = initialPosition[0] + Math.sin(t + offset) * 0.5
    ref.current.position.y = initialPosition[1] + Math.cos(t * 0.7 + offset) * 0.3 + t * 0.05
    ref.current.position.z = initialPosition[2] + Math.sin(t * 0.5 + offset) * 0.2
    if (ref.current.position.y > 15) ref.current.position.y = -15
    ref.current.scale.setScalar(0.8 + Math.sin(t * 2 + offset) * 0.2)
  })

  return (
    <mesh ref={ref} position={initialPosition}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={opacity} />
    </mesh>
  )
}

const Particles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        pos: [
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 8 - 3,
        ] as Vec3,
        speed: 0.1 + Math.random() * 0.15,
        size: 0.008 + Math.random() * 0.012,
        opacity: 0.2 + Math.random() * 0.3,
      })),
    []
  )

  return (
    <group>
      {particles.map((p, i) => (
        <Particle
          key={i}
          initialPosition={p.pos}
          speed={p.speed}
          size={p.size}
          opacity={p.opacity}
        />
      ))}
    </group>
  )
}

const Connection = ({ start, end }: { start: Vec3; end: Vec3 }) => {
  const ref = useRef<THREE.Line>(null)

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ])
    const material = new THREE.LineBasicMaterial({
      color: '#0e7490',
      transparent: true,
      opacity: 0.15,
    })
    return new THREE.Line(geometry, material)
  }, [start, end])

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial
      material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5 + start[0]) * 0.05
    }
  })

  return <primitive object={line} ref={ref} />
}

const Network = () => {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const nodes = useMemo(() => {
    const result: { pos: Vec3; brightness: number; size: number }[] = []

    for (let i = 0; i < 200; i++) {
      result.push({
        pos: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10 - 2,
        ],
        brightness: Math.random(),
        size: 0.015 + Math.random() * 0.025,
      })
    }

    // A few denser clusters so the field reads as a network, not noise.
    for (let c = 0; c < 5; c++) {
      const cx = (Math.random() - 0.5) * 20
      const cy = (Math.random() - 0.5) * 14
      const cz = (Math.random() - 0.5) * 6 - 2
      for (let i = 0; i < 15; i++) {
        result.push({
          pos: [
            cx + (Math.random() - 0.5) * 4,
            cy + (Math.random() - 0.5) * 4,
            cz + (Math.random() - 0.5) * 2,
          ],
          brightness: 0.5 + Math.random() * 0.5,
          size: 0.02 + Math.random() * 0.02,
        })
      }
    }

    return result
  }, [])

  const connections = useMemo(() => {
    const result: { start: Vec3; end: Vec3 }[] = []
    const positions = nodes.map((n) => n.pos)

    positions.forEach((pos, idx) => {
      positions
        .map((other, otherIdx) => ({
          idx: otherIdx,
          dist: Math.hypot(other[0] - pos[0], other[1] - pos[1], other[2] - pos[2]),
        }))
        .filter((n) => n.idx !== idx && n.dist < 4 && n.dist > 0.5)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2)
        .forEach((n) => {
          if (n.idx > idx && Math.random() > 0.3) {
            result.push({ start: pos, end: positions[n.idx] })
          }
        })
    })

    return result
  }, [nodes])

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.y * 0.05, 0.02)
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      pointer.x * 0.05 + state.clock.elapsedTime * 0.01,
      0.02
    )
    group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.x * 0.3, 0.015)
    group.position.y = THREE.MathUtils.lerp(group.position.y, pointer.y * 0.3, 0.015)
  })

  return (
    <group ref={groupRef}>
      {connections.map((c, i) => (
        <Connection key={`conn-${i}`} start={c.start} end={c.end} />
      ))}
      {nodes.map((n, i) => (
        <Node key={`node-${i}`} position={n.pos} brightness={n.brightness} size={n.size} />
      ))}
    </group>
  )
}

const NeuralBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1525] to-[#0a1020]" />
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Network />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default NeuralBackground
