async function fetchAirQualityData() {
    const airQualityApiUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=cd3PPQWcbkKMI5VfNxGsPtJrtQj06%2FdeSWnzTp7x9WcwByrKU26y4O8UCCJSWTN24yIW6hHLmA0DleNDExXe1A%3D%3D&sidoName=%EA%B4%91%EC%A3%BC&pageNo=1&numOfRows=1&returnType=JSON&ver=1.0';

    try {
        const response = await fetch(airQualityApiUrl);
        
        // 응답 상태 코드 로그
        console.log(`응답 상태 코드: ${response.status}`);
        
        // HTML 응답인지 확인
        const text = await response.text();
        if (text.startsWith('<')) {
            console.error('HTML 응답:', text);
            throw new Error('HTML 응답이 반환되었습니다.');
        }

        const data = JSON.parse(text);
        
        // API에서 응답한 데이터 로그
        console.log(data);

        if (data.response && data.response.body && data.response.body.items.length > 0) {
            const airQualityInfo = data.response.body.items[0]; // 첫 번째 아이템 가져오기

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
