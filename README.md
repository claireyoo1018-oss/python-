# 저어새의 내일

저어새 보존을 소개하는 한국어 정적 웹사이트. 팀명과 팀 소개는 초안입니다.

## 페이지
- index.html: 팀 소개
- spoonbill.html: 저어새 소개와 생태 정보
- habitat.html: 클릭 가능한 서식 지역 개념도와 관측 예시

## 미리보기
이 폴더에서 `python3 -m http.server 8080`을 실행한 뒤 http://localhost:8080 에 접속합니다. index.html을 직접 열어도 동작합니다.

## GitHub Pages 게시
파일을 GitHub 저장소에 올린 후 Settings → Pages → Deploy from a branch → main 브랜치 / (root)를 선택합니다. 별도 빌드는 없습니다. 하위 경로 배포를 위해 모든 내부 링크는 상대 경로입니다.

## 관측 자료 교체
assets/data.js의 지역별 날짜, 개체 수, 설명은 가상 예시입니다. 검증된 관측 자료가 준비되면 출처 및 조사 방법과 함께 교체하고 사이트의 예시 안내도 함께 수정하세요. 지도는 정확한 좌표나 축척을 제공하지 않는 개념도입니다.

현재 백엔드가 필요하지 않습니다. 향후 관측 등록·관리 기능이 필요할 때 Supabase를 연결할 수 있습니다. 비밀 키나 service_role 키는 브라우저 코드에 넣지 마세요.

## 디자인 및 출처
assets/spoonbill.svg는 직접 작성한 단순화된 일러스트입니다. 생태 정보 출처는 각 페이지에 링크했습니다. Noto Sans KR 글꼴은 Google Fonts에서 불러오며 오프라인에서는 시스템 글꼴로 표시됩니다.
