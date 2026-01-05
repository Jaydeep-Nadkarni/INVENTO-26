import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PresentationControls, Float, ContactShadows, Environment, Center } from '@react-three/drei'
import briefcaseModel from '../assets/briefcase.glb'

function Model({ onClick }) {
    const { scene, animations } = useGLTF(briefcaseModel)
    const group = useRef()

    console.log('Briefcase animations:', animations)

    // GTA-style continuous rotation
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.015
        }
    })

    return (
        <group 
            ref={group} 
            onClick={onClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
        >
            <primitive object={scene} scale={0.4} />
        </group>
    )
}

const Briefcase = ({ onClick }) => {
    return (
        <div className="w-full h-full min-h-[500px] relative flex items-center justify-center">
                <Canvas
                    dpr={[1, 2]}
                shadows
                camera={{ position: [0, 0, 5], fov: 40 }}
                gl={{ alpha: true, antialias: true }}
                className="w-full h-full"
            >
                <ambientLight intensity={3} />
                <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={3} castShadow />
                <pointLight position={[-5, -5, -5]} intensity={1.5} />

                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <PresentationControls
                        speed={1.5}
                        global
                        zoom={1}
                        polar={[-0.2, Math.PI / 4]}
                    >
                        <Float
                            speed={2.5}
                            rotationIntensity={0.1}
                            floatIntensity={1}
                            floatingRange={[0, 0.4]}
                        >
                            <Center>
                                <Model onClick={onClick} />
                            </Center>
                        </Float>
                    </PresentationControls>

                    <ContactShadows
                        position={[0, -1.2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={3}
                        far={2}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}

useGLTF.preload(briefcaseModel)

export default Briefcase
