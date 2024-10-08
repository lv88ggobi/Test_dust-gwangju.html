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
            padding: 2px 0 0 5px; /* 상단과 좌측에 10px 패딩 */
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
            width: 700px;
        }
        .weather-info {
            font-size: 50px;
            text-align: center;
            padding-top: 5px;
            margin-right: 20px;
        }
        .weather-icon {
            width: 50px;
            height: 55px;
            padding-top: 8px;
            margin-right: 5px;
        }
        table {
            width: 285px;
            border-collapse: collapse;
            background-color: black;
            font-size: 20px;
        }
        th {
            background-color: #004d40;
            font-size: 24px; /* 헤더 셀의 폰트 크기 설정 */
        }
        td {
            font-size: 30px; /* 데이터 셀의 폰트 크기 설정 */
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
            pty: '',
            skyStat: '' // skyStat 추가
        };

        let previousAirQuality = {
            pm10Value: null,
            pm25Value: null,
            status: ''
        };

        async function fetchWeather() {
            // 날씨 정보 가져오기
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

            // 미세먼지 데이터도 가져오기
            await fetchAirQualityData();
        }

        async function fetchWeatherData(date, hour) {
            const area = "&nx=58&ny=125"; // 광주광역시 좌표
            const apiKey = 'YOUR_API_KEY'; // 여기에 API 키를 입력하세요.
            const url =  `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=jf%2FvdfY7Y%2BbX9OrcH4QGLyZoaIZAXSa7hYlvlZ9mU%2B8eLl3o7ZkUFIHKY45xn1ksjCiwnxG5xvrojybxWJ3R5Q%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&base_date=${date}&base_time=${hour}&nx=58&ny=125`; // URL 수정
            try {
                const response = await fetch(url);
                const data = await response.json();
                const weatherInfo = data.response.body.items.item;

                let weatherString = '';
                let temperature = '';

                weatherInfo.forEach(item => {
                    if (item.category === 'SKY') {
                        const sky = parseInt(item.fcstValue);
                        weatherData.skyStat = sky; // skyStat 저장
                    } else if (item.category === 'TMP') {
                        temperature = `${item.fcstValue}°C`;
                    } else if (item.category === 'PTY') {
                        const pty = parseInt(item.fcstValue);
                        weatherData.pty = pty; // pty 저장
                        if (pty === 1 || pty === 4) {
                            weatherString = '비';
                        } else if (pty === 2) {
                            weatherString = '비/눈';
                        } else if (pty === 3) {
                            weatherString = '눈';
                        } else if (pty === 0) {
                            weatherString = (weatherData.skyStat === 1 || weatherData.skyStat === 2) ? "맑음" : "흐림";
                        }
                    }
                });

                weatherData.weather = weatherString;
                weatherData.temperature = temperature;

                updateWeatherDisplay();
            } catch (error) {
                console.error('날씨 데이터 가져오기 오류:', error);
                document.getElementById('error').innerText = `날씨 데이터 오류: ${error.message}`;
            }
        }

        async function fetchAirQualityData() {
            const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0';

            try {
                const response = await fetch(airQualityApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const airQualityInfo = data.response.body.items[0]; // 첫 번째 아이템 가져오기

                // pm10Value와 pm25Value를 td에 업데이트
                previousAirQuality.pm10Value = airQualityInfo.pm10Value;
                previousAirQuality.pm25Value = airQualityInfo.pm25Value;
                previousAirQuality.status = getStatus(airQualityInfo.pm10Value, airQualityInfo.pm25Value);

                const dataRow = document.getElementById('dataRow');
                dataRow.innerHTML = `
                    <td>${previousAirQuality.pm10Value}</td>
                    <td>${previousAirQuality.pm25Value}</td>
                    <td>${previousAirQuality.status}</td>
                `;
            } catch (error) {
                console.error('미세먼지 데이터 가져오기 오류:', error);
                // 이전 데이터를 표시
                const dataRow = document.getElementById('dataRow');
                dataRow.innerHTML = `
                    <td>${previousAirQuality.pm10Value !== null ? previousAirQuality.pm10Value : 'N/A'}</td>
                    <td>${previousAirQuality.pm25Value !== null ? previousAirQuality.pm25Value : 'N/A'}</td>
                    <td>${previousAirQuality.status !== '' ? previousAirQuality.status : 'N/A'}</td>
                `;
                document.getElementById('error').innerText = `미세먼지 데이터 오류: ${error.message}`;
            }
        }

        function updateWeatherDisplay() {
            const { weather, temperature, pty, skyStat } = weatherData;
            document.getElementById('weatherInfo').innerText = `${weather} ${temperature}`;

            // 날씨 아이콘 설정
            const weatherIcon = document.getElementById('weatherIcon');
            if (pty === '0' && skyStat === '1') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Sun.png'; // 맑음
            } else if (pty === '1') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Rain.png'; // 비
            } else if (pty === '2' || pty === '4') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Snow_Rain.png'; // 비/눈
            } else if (pty === '3') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Snow.png'; // 눈
            } else if (pty === '0' && skyStat === '4') {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Cloud.png'; // 흐림
            } else {
                weatherIcon.src = 'https://github.com/WriggleCat/Test_Weather/raw/main/Resource/WeatherIcon/Cloud.png'; // 기본 흐림 아이콘
            }
        }

        function getStatus(pm10, pm25) {
            if (pm10 <= 30 && pm25 <= 15) return '좋음';
            if (pm10 <= 80 && pm25 <= 35) return '보통';
            if (pm10 <= 150 && pm25 <= 75) return '나쁨';
            return '매우 나쁨';
        }

        // 초기 데이터 호출
        fetchWeather();
        fetchAirQualityData();

        // 매 6시간마다 미세먼지 데이터 재호출
        setInterval(fetchAirQualityData, 6 * 60 * 60 * 1000); // 6시간마다 호출
    </script>
</body>
</html>
