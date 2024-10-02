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
    // 여기에 날씨 데이터 API 호출 로직을 추가하세요.
    // 예시:
    console.log(`Fetching weather data for ${date} at ${hour}`);
}

async function fetchAirQualityData() {
    const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0';

    try {
        const response = await fetch(airQualityApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check if the data structure is correct
        if (data.response && data.response.body && data.response.body.items && data.response.body.items.length > 0) {
            const airQualityInfo = data.response.body.items[0]; // 첫 번째 아이템 가져오기

            // pm10Value와 pm25Value를 td에 업데이트
            const dataRow = document.getElementById('dataRow');
            dataRow.innerHTML = `
                <td>${airQualityInfo.pm10Value}</td>
                <td>${airQualityInfo.pm25Value}</td>
                <td>${getStatus(airQualityInfo.pm10Value, airQualityInfo.pm25Value)}</td>
            `;
        } else {
            throw new Error("미세먼지 데이터가 없습니다.");
        }
    } catch (error) {
        console.error('미세먼지 데이터 가져오기 오류:', error);
        document.getElementById('error').innerText = `미세먼지 데이터 오류: ${error.message}`;
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
