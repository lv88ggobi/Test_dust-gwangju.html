let previousAirQuality = {
    pm10Value: null,
    pm25Value: null,
    status: ''
};

const CACHE_DURATION = 3600000; // 1시간

async function fetchAirQualityData() {
    const now = Date.now();
    const lastFetch = localStorage.getItem('lastFetch');
    
    if (lastFetch && now - lastFetch < CACHE_DURATION) {
        const cachedData = JSON.parse(localStorage.getItem('airQualityData'));
        updateAirQualityDisplay(cachedData);
        return;
    }

    const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0';

    try {
        const response = await fetch(airQualityApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 데이터 구조 확인
        if (data.response && data.response.body && data.response.body.items && data.response.body.items.length > 0) {
            const airQualityInfo = data.response.body.items[0];

            previousAirQuality.pm10Value = airQualityInfo.pm10Value;
            previousAirQuality.pm25Value = airQualityInfo.pm25Value;
            previousAirQuality.status = getStatus(airQualityInfo.pm10Value, airQualityInfo.pm25Value);

            // 캐시에 저장
            localStorage.setItem('airQualityData', JSON.stringify(previousAirQuality));
            localStorage.setItem('lastFetch', now);
            updateAirQualityDisplay(previousAirQuality);
        } else {
            throw new Error("미세먼지 데이터가 없습니다.");
        }
    } catch (error) {
        console.error('미세먼지 데이터 가져오기 오류:', error);
        // 이전 데이터 표시
        updateAirQualityDisplay(previousAirQuality);
        document.getElementById('error').innerText = `미세먼지 데이터 오류: ${error.message}`;
    }
}

function updateAirQualityDisplay(airQualityInfo) {
    const dataRow = document.getElementById('dataRow');
    dataRow.innerHTML = `
        <td>${airQualityInfo.pm10Value !== null ? airQualityInfo.pm10Value : 'N/A'}</td>
        <td>${airQualityInfo.pm25Value !== null ? airQualityInfo.pm25Value : 'N/A'}</td>
        <td>${airQualityInfo.status !== '' ? airQualityInfo.status : 'N/A'}</td>
    `;
}

// 초기 데이터 호출
fetchWeather();
fetchAirQualityData();

// 매 12시간마다 미세먼지 데이터 재호출
setInterval(fetchAirQualityData, 12 * 60 * 60 * 1000); // 12시간마다 호출
