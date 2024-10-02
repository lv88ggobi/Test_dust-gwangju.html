async function fetchAirQualityData() {
    const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0';
    try {
        const response = await fetch(airQualityApiUrl);
        
        // 상태 코드 체크
        console.log(`응답 상태 코드: ${response.status}`); // 상태 코드 로그
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();

        // 응답 데이터 로그
        console.log(data);
        
        if (data.response && data.response.body && data.response.body.items.length > 0) {
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
