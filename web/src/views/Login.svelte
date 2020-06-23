<div class="container">
    <div class="grid grid-rows-3 gap-4">
        <div class="text-center flex justify-center items-center">
            <h1 class="text-3xl text-yellow-500 font-extrabold">로그인</h1>
        </div>
        <div class="text-white text-center">
            <p>카카오 마피아를 이용하기 위해선</p>
            <p>카카오 계정과 연동해야 합니다.</p>
			<br>
            <p>계정 정보는 수집하지 않으며, 로그인 후 이용시</p>
            <p>카카오 마피아 이용약관에 동의한 것으로 간주합니다.</p>
        </div>
		<div class="flex justify-center items-center w-full">
			<div id="kakao-login-button"> </div>
		</div>
    </div>
</div>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		Kakao.Auth.createLoginButton({
			container: '#kakao-login-button',
			success: (res) => {
				Kakao.API.request({
					url: '/v2/user/me',
					success: (user) => {
						localStorage.setItem('kakao', JSON.stringify({
							auth: res,
							user,
						}));
					},
				});
			},
			fail: (err) => {
				console.error(err);
			},
		});
	});
</script>

