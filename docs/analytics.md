# Analytics Tracking

헤어컨설팅 웹은 플러터 앱 웹뷰 안에서 실행되더라도 별도 분석 프로젝트가 아니라 미몽 서비스의 같은 Firebase/Amplitude/Mixpanel 프로젝트로 이벤트를 전송한다.

## Vendor Project

- Firebase: `new-meemong` / `G-RHKCZXCFQ5`
- Amplitude: `11ec68514a0232f5c8c657847dc4c2c7`
- Mixpanel: `67358144bc05dadfc30ca580f7c1b8f1`

`NEXT_PUBLIC_AMPLITUDE_API_KEY`, `NEXT_PUBLIC_MIXPANEL_TOKEN`이 있으면 해당 값을 우선 사용한다.

## Surface Segmentation

웹뷰 데이터는 프로젝트를 나누지 않고 공통 속성으로 구분한다.

- `app_surface`: `hair_consultation_web`
- `service_area`: `hair_consultation`
- `runtime_context`: `flutter_webview`, `web_browser` 중 실행 환경
- `entry_source`: 플러터 웹뷰 진입이면 `flutter_app`
- `screen_source`: 현재 `next_app_router`

플러터 앱, 헤어컨설팅 웹, 샴푸실 웹을 함께 볼 때는 `app_surface` 또는 `service_area`로 필터링한다.

## Events

- Firebase/GA4: `screen_view`
- Amplitude/Mixpanel: `screen_viewed`

화면 이동은 개별 이벤트 이름을 만들지 않고 `screen_name`, `screen_path_template`, `page_path` 속성으로 구분한다. 동적 ID와 쿼리 값은 원문 URL로 보내지 않고 라우트 템플릿으로 정규화한다.

같은 실제 pathname이 연속으로 들어오면 query string 변경만으로 screen event를 중복 전송하지 않는다. `/posts/1`과 `/posts/2`처럼 pathname이 다른 동적 상세 화면은 각각 전송한다.

## Identity

플러터 앱이 웹뷰 URL에 기존 로그인 파라미터인 `userId`를 전달한다. 웹에서는 이 값을 초기 analytics user id로 사용하고, 인증 완료 후에는 `AuthProvider`의 서버 응답 사용자 정보로 role을 포함해 다시 동기화한다.

같은 사용자와 같은 traits 조합은 vendor identify/profile update를 반복하지 않는다.

사용자 속성:

- `user_id`
- `user_role`
- `user_type`

## Privacy And QA

- SDK 자동 pageview/autocapture는 코드에서 끈다.
- 원문 URL, query string, post id, chat room id 같은 동적 값은 이벤트 속성으로 직접 보내지 않는다.
- GA4 Enhanced Measurement의 browser history pageview 설정이 켜져 있으면 콘솔에서 별도 pageview가 발생할 수 있으므로 DebugView로 중복 여부를 확인한다.
- 배포 후 Firebase DebugView, Amplitude Live Events, Mixpanel Events에서 `app_surface=hair_consultation_web`과 `screen_viewed` 수신을 확인한다.
