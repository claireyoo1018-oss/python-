# 저어새의 내일

저어새 보존 프로젝트의 첫 번째 정적 웹사이트입니다. 팀명과 소개는 임시 초안입니다.

## 페이지
- index.html: 팀 소개
- spoonbill.html: 저어새 소개 및 생태 자료 출처
- habitat.html: 확대/축소 지도, 지역 선택, 예시 관측 기록

## 실행
index.html을 브라우저에서 열면 됩니다. 또는 이 폴더에서 `python -m http.server 8000` 실행 후 http://localhost:8000 접속.
배경 지도는 인터넷이 필요합니다. 지도 로딩 실패 시에도 지역 버튼과 관측 패널은 동작합니다.

## 수정
공통 디자인: styles.css / 지역과 관측 예시: data.js / 지도 동작: map.js.
모든 날짜, 개체 수, 행동은 허구의 시연 자료입니다. 실제 조사자료로 대체할 때 출처와 조사 방법도 추가하세요.
좌표는 대략적인 지역 위치이며 둥지나 실제 관측 좌표가 아닙니다.
현재 서버, 계정, Supabase 연결은 없습니다. 실제 관측 입력·저장이 필요해지면 추가할 수 있습니다.

## GitHub Pages
이 폴더의 파일을 저장소에 올린 뒤 Settings → Pages → Deploy from a branch에서 해당 브랜치와 /(root)를 선택하세요.
빌드 명령이나 API 키가 필요하지 않습니다. 상대 경로를 사용하므로 저장소 이름이 붙는 프로젝트 URL도 지원합니다.
현재 원격 저장소로 push하거나 배포하지 않았습니다.

## 자료와 라이선스
- 저어새 설명: https://bih.gov.hk/en/fast-facts/iconic-species/index-id-6.html
- 사진: Kristinvafranzi, Black-faced spoonbill.jpg, Wikimedia Commons. CC BY-SA 3.0. 원본 파일은 변경하지 않았으며 웹 화면에서는 일부가 잘려 표시됩니다.
  https://commons.wikimedia.org/wiki/File:Black-faced_spoonbill.jpg
  https://creativecommons.org/licenses/by-sa/3.0/
- 지도: © OpenStreetMap contributors. https://www.openstreetmap.org/copyright
- Leaflet 1.9.4: BSD-2-Clause. assets/leaflet-LICENSE.txt 참조.
