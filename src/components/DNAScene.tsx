import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { DNAHelix } from './DNAHelix';
import { Suspense } from 'react';

function DNASceneContent() {
  return (
    <>
      {/* Enhanced lighting for realism */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[0, -5, -5]} intensity={0.6} color="#8b5cf6" />

      {/* Camera positioned for best view */}
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={60} />

      {/* Multiple DNA helixes at different positions for depth - larger and more visible */}
      <DNAHelix position={[-4, -2, -4]} scale={1.2} speed={0.4} />
      <DNAHelix position={[0, 0, -2]} scale={1.5} speed={0.5} />
      <DNAHelix position={[4, 2, -4]} scale={1.2} speed={0.4} />
      <DNAHelix position={[-2, 3, -3]} scale={1} speed={0.3} />
      <DNAHelix position={[2, -3, -3]} scale={1} speed={0.3} />
    </>
  );
}

export function DNAScene() {
  if (typeof window === 'undefined') return null;
  
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-[1] overflow-hidden">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        onCreated={(state) => {
          // Error handling
          state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          console.log('DNA Scene Canvas created successfully');
        }}
        onError={(error) => {
          console.error('DNA Scene Canvas error:', error);
        }}
      >
        <Suspense fallback={null}>
          <DNASceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
