"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  useGLTF, 
  PerspectiveCamera, 
  Environment
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

// 기본 모델 경로 - 실제 제품 모델로 교체 필요
const DEFAULT_MODEL_PATH = "/models/product_default.glb";

// 홀로그램 선 격자 생성
function Grid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <group ref={gridRef}>
      <gridHelper 
        args={[20, 40, new THREE.Color(0x00ffff), new THREE.Color(0x00ffff)]} 
        position={[0, -3, 0]} 
        rotation={[0, 0, 0]}
      />
      <gridHelper 
        args={[20, 40, new THREE.Color(0x00ffff), new THREE.Color(0x00ffff)]} 
        position={[0, 3, 0]} 
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

interface ModelViewerProps {
  modelPath: string;
  emissive?: boolean;
}

function Model({ modelPath, emissive = true }: ModelViewerProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  
  // 로드된 모델에 홀로그램 효과 적용
  useEffect(() => {
    if (scene && emissive) {
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          // 기존 재질 복제 및 발광 속성 추가
          // 새로운 재질로 교체
          const newMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            emissive: 0x88ccff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            wireframe: Math.random() > 0.7, // 일부만 와이어프레임으로 표시
          });
          
          node.material = newMaterial;
        }
      });
    }
  }, [scene, emissive]);
  
  // 모델 회전 애니메이션
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={2} 
        position={[0, 0, 0]} 
      />
    </group>
  );
}

interface HologramViewerProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HologramViewer({ productId, productName, open, onOpenChange }: HologramViewerProps) {
  const [modelPath, setModelPath] = useState<string>(DEFAULT_MODEL_PATH);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  
  useEffect(() => {
    // 여기서 제품 ID에 따라 적절한 모델 경로 설정
    // 실제 구현 시에는 API 호출 등으로 경로 가져오기
    setLoading(true);
    
    // 모델 로딩 시뮬레이션 (실제로는 API 요청으로 대체)
    const timer = setTimeout(() => {
      // productId에 따라 다른 모델 로드 (예시)
      // 실제 구현에서는 서버에서 productId에 맞는 모델 경로 가져오기
      setModelPath(`/models/${productId}.glb`);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [productId]);
  
  // 줌 기능
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };
  
  // 카메라 리셋
  const handleResetCamera = () => {
    setZoom(1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[700px] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle>{productName} 홀로그램 뷰어</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            홀로그램 효과로 제품을 확인할 수 있습니다. 마우스로 회전 및 확대/축소가 가능합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse text-blue-500">홀로그램 생성 중...</div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button size="icon" variant="outline" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={handleResetCamera}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <Canvas shadows dpr={[1, 2]}>
                <color attach="background" args={["#000020"]} />
                <fog attach="fog" args={["#000020", 10, 40]} />
                
                <PerspectiveCamera makeDefault position={[0, 0, 10]} zoom={zoom} />
                
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
                <pointLight position={[-10, -10, -10]} color="blue" intensity={1} />
                
                <Grid />
                <Model modelPath={modelPath} />
                
                <Environment preset="night" />
                
                <EffectComposer>
                  <Bloom 
                    intensity={1.0} 
                    luminanceThreshold={0.2} 
                    luminanceSmoothing={0.9} 
                    width={300}
                  />
                  <Noise opacity={0.05} blendFunction={BlendFunction.ADD} />
                  <Vignette eskil={false} offset={0.1} darkness={1.0} />
                </EffectComposer>
                
                <OrbitControls 
                  enableZoom={true}
                  autoRotate={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 1.5}
                  minPolarAngle={Math.PI / 3}
                />
              </Canvas>
              
              <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-blue-400 opacity-70">
                스마트팩토리 고급 홀로그램 분석 시스템 v1.0
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 