/**
 * 말문(malmunkorean.com) 인앱 브라우저 경고 배너
 *
 * 카카오톡·페이스북 메신저·인스타그램·라인·네이버 등 앱 내장 브라우저에서는
 * 구글 로그인 팝업(auth/disallowed_useragent)과 화상수업 카메라/마이크 권한(getUserMedia)이
 * 앱 자체 정책으로 차단되어 코드로는 우회할 수 없다. 이 스크립트는 그런 환경을 감지해
 * 상단에 "외부 브라우저로 열어달라"는 안내 배너를 자동으로 띄운다.
 *
 * 사용법: 로그인/예약/화상수업/튜터지원처럼 구글 로그인 또는 카메라·마이크가
 * 필요한 페이지의 <body> 여는 태그 바로 다음 줄에 아래 한 줄만 추가하면 된다.
 *   <script src="inapp-browser-guard.js"></script>
 */
(function(){
  var ua = navigator.userAgent || '';
  var isInApp = /KAKAOTALK|FBAN|FBAV|FB_IAB|Instagram|Line\/|NAVER\(|NAVER-Android|WhatsApp/i.test(ua);
  if(!isInApp) return;

  var lang = (function(){
    try{ return localStorage.getItem('malmun_lang') || 'ko'; }catch(e){ return 'ko'; }
  })();

  var TEXT = {
    ko: {
      msg: '카카오톡·인스타그램 등 앱 내 브라우저에서는 로그인/화상수업이 제한될 수 있어요.',
      androidBtn: '외부 브라우저로 열기',
      iosHint: '오른쪽 위 메뉴(⋮ 또는 •••)에서 "다른 브라우저로 열기"를 눌러주세요.',
      close: '닫기'
    },
    en: {
      msg: 'Login and video class may not work inside this in-app browser (KakaoTalk, Instagram, etc).',
      androidBtn: 'Open in browser',
      iosHint: 'Tap the menu (⋮ or •••) at the top and choose "Open in Browser".',
      close: 'Close'
    },
    ja: {
      msg: 'カカオトーク・インスタグラムなどアプリ内ブラウザでは、ログイン・オンライン授業が制限される場合があります。',
      androidBtn: '外部ブラウザで開く',
      iosHint: '右上のメニュー(⋮または•••)から「他のブラウザで開く」を選んでください。',
      close: '閉じる'
    }
  };
  var T = TEXT[lang] || TEXT.ko;
  var isAndroid = /Android/i.test(ua);

  function render(){
    var bar = document.createElement('div');
    bar.id = 'malmunInAppGuard';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;'
      + 'background:#412402;color:#FFF3E0;padding:10px 14px;font-size:12.5px;line-height:1.5;'
      + 'display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,0.25);'
      + 'font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard","Noto Sans KR",sans-serif;';

    var msgSpan = document.createElement('span');
    msgSpan.style.cssText = 'flex:1;';
    msgSpan.textContent = isAndroid ? T.msg : (T.msg + ' ' + T.iosHint);
    bar.appendChild(msgSpan);

    if(isAndroid){
      var openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.textContent = T.androidBtn;
      openBtn.style.cssText = 'flex-shrink:0;background:#EF9F27;color:#412402;border:none;border-radius:8px;'
        + 'padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;';
      openBtn.onclick = function(){
        var target = location.href.replace(/^https?:\/\//, '');
        location.href = 'intent://' + target + '#Intent;scheme=https;package=com.android.chrome;end;';
      };
      bar.appendChild(openBtn);
    }

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', T.close);
    closeBtn.style.cssText = 'flex-shrink:0;background:none;border:none;color:#FFF3E0;font-size:16px;cursor:pointer;padding:0 2px;';
    closeBtn.onclick = function(){
      bar.remove();
      document.body.classList.remove('malmun-inapp-guard-padded');
    };
    bar.appendChild(closeBtn);

    document.body.insertBefore(bar, document.body.firstChild);
    document.body.style.paddingTop = bar.offsetHeight + 'px';
    document.body.classList.add('malmun-inapp-guard-padded');
  }

  if(document.body){
    render();
  } else {
    document.addEventListener('DOMContentLoaded', render);
  }
})();
