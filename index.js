const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://claude.ai',
    changeOrigin: true,
    // 아래 옵션들을 추가해야 리다이렉션을 방지할 수 있습니다.
    autoRewrite: true,      // 응답 헤더의 호스트네임을 프록시 호스트로 자동 재작성
    followRedirects: true,  // 프록시 서버가 직접 리다이렉션을 따라가서 결과를 반환
    cookieDomainRewrite: "", // 쿠키 도메인 문제로 인한 리다이렉션 방지
    onProxyRes: function (proxyRes, req, res) {
        // 원래 사이트로 튕겨나가는 것을 방지하기 위해 Location 헤더 조작 가능
        if (proxyRes.headers['location']) {
            console.log('Redirect detected:', proxyRes.headers['location']);
        }
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

// 컨테이너 내부 포트는 3000을 유지합니다.
app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
