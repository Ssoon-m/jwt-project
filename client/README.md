# token refresh 프로세스

## 페이지 첫 진입 시(ssr)

1. access token이 존재하고 refresh token이 존재하거나 없을 경우 access token의 만료시간 기준으로 token refresh scheduler 시작
2. access token이 없고 refresh token만 존재할 경우 token refresh 이후 새로 발급 받은 access token의 만료시간 기준으로 token refresh scheduler 시작
3. access token , refresh token 둘다 없는 경우 로그인 페이지로 redirect

## 페이지 진입 이후(csr)

1. access token이 만료되기 전에 token refresh scheduler로 지속적으로 token을 refresh 시킴
2. access token만 존재할 경우 refresh를 못하므로 access token이 만료되면 로그인 되어 있는것 처럼 보이지만 권한이 필요한 행위를 할 때 로그인 페이지로 이동 함.
