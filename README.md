
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현재 날씨 및 미세먼지 정보</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Nanum Gothic', sans-serif;
            margin: 0;
            padding: 10px 0 0 5px; /* 상단과 좌측에 15px 패딩 */
            background-color: #000000; /* 배경색: 검정 */
            color: white;
            display: flex;
            justify-content: flex-start; /* 왼쪽 정렬 */
            align-items: flex-start;
            height: 100vh;
        }
        .main {
            display: flex;
            align-items: flex-start; /* 왼쪽 정렬 */
            background-color: #000000;
            padding: 0px;
            width: 1200px;
        }
        .weather-info {
            font-size: 48px;
            text-align: center;
            padding-top:5px;
            margin-right: 20px;
        }
        .weather-icon {
            width: 60px;
            height: 60px;
            padding-top:5px;
            margin-right: 20px;
        }
        table {
            width: 300px;
            border-collapse: collapse;
            background-color: black;
            font-size: 30px;
        }

        th {
            background-color: #004d40;
            font-size: 24px; /* 헤더 셀의 폰트 크기 설정 */
            }

        td {
            font-size: 36px; /* 데이터 셀의 폰트 크기 설정 */
            text-align: center;
            color: white;
            }
        .error {
            color: red;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="main">
        <div id="weatherInfo" class="weather-info">날씨 정보를 불러오는 중...</div>
        <img id="weatherIcon" class="weather-icon" src="" alt="날씨 아이콘" />
        <div class="table-container">
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>미세먼지</th>
                        <th>초미세먼지</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="dataRow">
                        <td>50</td>
                        <td>20</td>
                        <td>보통</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="error" class="error"></div>
    </div>
    <script>
        let weatherData = {
            weather: '',
            temperature: '',
            pty: ''
        };

        async function fetchWeather() {
            const today = new Date();
            const date = today.toISOString().slice(0, 10).replace(/-/g, '');
            let hour = String(today.getHours()).padStart(2, '0') + '00';
            const baseTimeArray = [200, 500, 800, 1100, 1400, 1700, 2000, 2300];

            for (let i = baseTimeArray.length - 1; i >= 0; i--) {
                if (parseInt(hour) >= baseTimeArray[i]) {
                    hour = String(baseTimeArray[i]).padStart(4, '0');
                    break;
                }
            }

            hour = (parseInt(hour) - 300).toString().padStart(4, '0');

            if (parseInt(hour) < 0) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const newDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
                hour = '2300';
                await fetchWeatherData(newDate, hour);
            } else {
                await fetchWeatherData(date, hour);
            }
        }

        async function fetchWeatherData(date, hour) {
            const area = "&nx=98&ny=76"; // 부산 지역 좌표
            const apiKey = 'YOUR_API_KEY'; // 여기에 API 키를 입력하세요.
            const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=jf%2FvdfY7Y%2BbX9OrcH4QGLyZoaIZAXSa7hYlvlZ9mU%2B8eLl3o7ZkUFIHKY45xn1ksjCiwnxG5xvrojybxWJ3R5Q%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&base_date=${date}&base_time=${hour}&nx=59&ny=74`; // URL 수정 필요
            try {
                const response = await fetch(url);
                const data = await response.json();
                const weatherInfo = data.response.body.items.item;

                let weatherString = '';
                let temperature = '';
                let skyStat = '';

                weatherInfo.forEach(item => {
                    if (item.category === 'SKY') {
                        const sky = parseInt(item.fcstValue);
                        skyStat = sky === 1 ? '1' : sky === 2 ? '2' : sky === 3 ? '3' : '4';
                    } else if (item.category === 'TMP') {
                        temperature = `${item.fcstValue}°C`;
                    } else if (item.category === 'PTY') {
                        const pty = parseInt(item.fcstValue);
                        if (pty === 1 || pty === 4) {
                            weatherString = '비';
                        } else if (pty === 2) {
                            weatherString = '비/눈';
                        } else if (pty === 3) {
                            weatherString = '눈';
                        } else if (pty === 0) {
                            weatherString = (skyStat === '1' || skyStat === '2') ? "맑음" : "흐림";
                        }
                    }
                });

                weatherData.weather = weatherString;
                weatherData.temperature = temperature;
                weatherData.pty = skyStat; // skyStat로 pty 대체

                updateWeatherDisplay();
            }catch (error) {
        console.error('날씨 데이터 가져오기 오류:', error);
        document.getElementById('error').innerText = `날씨 데이터 오류: ${error.message}`;

        if (attempt < 6) {
            setTimeout(() => {
                fetchWeatherData(date, hour, attempt + 1);
            }, 10000); // 10초 후 재호출
        } else {
            document.getElementById('error').innerText = `날씨 데이터 오류: 최대 재호출 시도 횟수 초과`;
        }
    }
        }

        function updateWeatherDisplay() {
            const { weather, temperature, pty } = weatherData;
            document.getElementById('weatherInfo').innerText = `${weather} ${temperature}`;

            // 날씨 아이콘 설정
            const weatherIcon = document.getElementById('weatherIcon');
            if (pty === '1') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Sun.png';
            } else if (pty === '2' || pty === '4') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Rain.png';
            } else if (pty === '3') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Snow_Rain.png';
            } else if (pty === '4') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Snow.png';
            } else {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Cloud.png';
            }

            // 미세먼지 데이터 업데이트 (임시 데이터)
            const dataRow = document.getElementById('dataRow');
            const airQualityData = {
                pm10: 50, // 예시 값
                pm25: 20, // 예시 값
                status: getStatus(50, 20) // 상태 계산
            };

            dataRow.innerHTML = `
                <td>${airQualityData.pm10}</td>
                <td>${airQualityData.pm25}</td>
                <td>${airQualityData.status}</td>
            `;
        }

        function getStatus(pm10, pm25) {
            if (pm10 <= 30 && pm25 <= 15) return '좋음';
            if (pm10 <= 80 && pm25 <= 35) return '보통';
            if (pm10 <= 150 && pm25 <= 75) return '나쁨';
            return '매우 나쁨';
        }

        // 매초마다 날씨 정보 갱신
        setInterval(() => {
            updateWeatherDisplay();
        }, 1000); // 1초마다 갱신

        // 매시 정각에 날씨 데이터 재호출
        setInterval(() => {
            const now = new Date();
            if (now.getMinutes() === 0 && now.getSeconds() === 0) {
                fetchWeather(); // 정각에 날씨 데이터 재호출
            }
        }, 1000); //
                fetchWeather(); // 페이지 로드 시 초기 날씨 데이터 호출
    </script>
</body>
</html>
