let weatherData = {
    weather: '',
    temperature: '',
    pty: '',
    skyStat: '' // skyStat 추가
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
    const area = "&nx=98&ny=76"; // 부산 지역 좌표
    const apiKey = 'YOUR_API_KEY'; // 여기에 API 키를 입력하세요.
    const url =  `${date}&base_time=${hour}&nx=59&ny=74`; // URL 수정 필요
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
    const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0'; // 여기에 미세먼지 API URL을 입력하세요.
    try {
        const response = await fetch(airQualityApiUrl);
        const data = await response.json();
        const airQualityInfo = data.response.body.items[0]; // 첫 번째 아이템 가져오기

        // pm10Value와 pm25Value를 td에 업데이트
        const dataRow = document.getElementById('dataRow');
        dataRow.innerHTML = `
            <td>${airQualityInfo.pm10Value}</td>
            <td>${airQualityInfo.pm25Value}</td>
            <td>${getStatus(airQualityInfo.pm10Value, airQualityInfo.pm25Value)}</td>
        `;
    } catch (error) {
        console.error('미세먼지 데이터 가져오기 오류:', error);
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

// 매초마다 날씨 정보 갱신
setInterval(() => {
    updateWeatherDisplay();
}, 1000); // 1초마다 갱신

// 매시 정각에 날씨 데이터 재호출
setInterval(() => {
    const now = new Date();
    if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        fetchWeather(); // 정각에 날씨 데이터 재호출
        fetchAirQualityData(); // 미세먼지 데이터 재호출
    }
}, 1000);

fetchAirQualityData(); // 페이지 로드 시 초기 미세먼지 데이터 호출
fetchWeather(); // 페이지 로드 시 초기 날씨 데이터 호출
