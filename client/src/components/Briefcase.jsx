import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PresentationControls, Float, ContactShadows, Environment, Center } from '@react-three/drei'
import briefcaseModel from '../assets/briefcase.glb'

function Model() {
    const { scene } = useGLTF(briefcaseModel)
    const group = useRef()

    // GTA-style continuous rotation (faster than before)
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.02
        }
    })

    return (
        <group ref={group}>
            <primitive object={scene} scale={0.4} />
        </group>
    )
}

const Briefcase = () => {
    return (
        <div className="w-full h-[400px] md:h-[500px] cursor-pointer relative">
            <Canvas
                dpr={[1, 2]}
                shadows
                camera={{ position: [0, 0, 5], fov: 30 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={2.5} />
                <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={3} castShadow />
                <pointLight position={[-5, -5, -5]} intensity={1.5} />

                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <PresentationControls
                        speed={1.5}
                        global
                        zoom={1.2}
                        polar={[-0.2, Math.PI / 4]}
                    >
                        {/* Exaggerated GTA-style bobbing */}
                        <Float
                            speed={3}
                            rotationIntensity={0.1}
                            floatIntensity={1.5}
                            floatingRange={[0.1, 0.4]}
                        >
                            <Center>
                                <Model />
                            </Center>
                        </Float>
                    </PresentationControls>

                    {/* Contact shadows that pulse slightly with the float */}
                    <ContactShadows
                        position={[0, -1.2, 0]}
                        opacity={0.6}
                        scale={8}
                        blur={3}
                        far={2}
                    />
                </Suspense>
            </Canvas>

            {/* Ambient Red Glow Filter (CSS Overlay) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-900/10 via-transparent to-transparent"></div>
        </div>
    )
}

useGLTF.preload(briefcaseModel)

export default Briefcase