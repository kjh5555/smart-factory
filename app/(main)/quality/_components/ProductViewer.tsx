"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import * as THREE from "three";

// 기본 모델 경로 - 실제 제품 모델로 교체 필요
const DEFAULT_MODEL_PATH = "/models/product_default.glb";

interface ModelViewerProps {
  modelPath: string;
}

function Model({ modelPath }: ModelViewerProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // 모델 회전 애니메이션
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1} 
      position={[0, 0, 0]} 
    />
  );
}

interface ProductViewerProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductViewer({ productId, productName, open, onOpenChange }: ProductViewerProps) {
  const [modelPath, setModelPath] = useState<string>(DEFAULT_MODEL_PATH);
  const [loading, setLoading] = useState<boolean>(true);
  
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle>{productName} 3D 모델</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            마우스로 모델을 회전하고 확대/축소할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              모델 로딩 중...
            </div>
          ) : (
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
              <color attach="background" args={["#f5f5f5"]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              
              <Stage environment="city" intensity={0.6}>
                <Model modelPath={modelPath} />
              </Stage>
              
              <OrbitControls enableZoom={true} autoRotate={false} />
            </Canvas>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 