# 3D 모델 설정 안내

이 프로젝트는 제품의 3D 모델을 표시하기 위해 Three.js를 사용합니다. 아래 단계에 따라 샘플 모델을 설정하세요.

## 모델 다운로드

다음 웹사이트에서 무료 3D 모델을 다운로드할 수 있습니다:
- [Sketchfab](https://sketchfab.com/features/free-3d-models)
- [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free)
- [Free3D](https://free3d.com/)

## 모델 설정

1. 다운로드한 모델(GLB 또는 GLTF 형식)을 `public/models/` 디렉토리에 배치합니다.
2. 기본 모델 파일명을 `product_default.glb`로 설정합니다.
3. 특정 제품의 모델은 해당 제품 ID를 이용하여 `{productId}.glb` 형식으로 저장합니다.

## 파일 구조 예시

```
public/
  models/
    product_default.glb     # 기본 모델
    df86a2ab-efbe-4ed9-88b9-523d482e2a16.glb  # 특정 제품 모델
    other-product-id.glb    # 다른 제품 모델
```

## 참고사항

- GLB 파일은 GLTF 파일 형식의 바이너리 버전입니다.
- 3D 모델의 크기가 지나치게 크면 로딩 시간이 길어질 수 있으므로 최적화가 필요합니다.
- 모델 최적화를 위해 [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) 또는 [glTF-Transform](https://gltf-transform.dev/)을 사용할 수 있습니다.

## 실제 환경에서의 구현

실제 프로덕션 환경에서는 다음과 같은 방식을 고려해보세요:

1. 모든 모델을 미리 준비하는 대신, API를 통해 필요한 모델을 동적으로 로드
2. 모델 캐싱 시스템 구현
3. 모델의 LOD(Level of Detail) 시스템 구현으로 성능 최적화
4. 모델 변환 및 최적화를 위한 서버 사이드 파이프라인 구축 