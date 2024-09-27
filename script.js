const airQualityData = {
    "광주광역시": { pm10: 50, pm25: 20 },
    "서울특별시": { pm10: 80, pm25: 35 },
    "부산광역시": { pm10: 60, pm25: 25 },
    "대구광역시": { pm10: 45, pm25: 18 },
    "인천광역시": { pm10: 70, pm25: 30 },
    "대전광역시": { pm10: 55, pm25: 22 },
    "울산광역시": { pm10: 40, pm25: 15 },
    "세종특별자치시": { pm10: 30, pm25: 10 },
    "경기도": { pm10: 65, pm25: 28 },
    "강원도": { pm10: 35, pm25: 12 },
    "충청북도": { pm10: 50, pm25: 20 },
    "충청남도": { pm10: 55, pm25: 25 },
    "전라북도": { pm10: 45, pm25: 18 },
    "전라남도": { pm10: 40, pm25: 15 },
    "경상북도": { pm10: 50, pm25: 20 },
    "경상남도": { pm10: 65, pm25: 28 },
    "제주특별자치도": { pm10: 30, pm25: 12 }
};

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const sidoName = document.getElementById('sidoName').value;
    
    // 선택한 지역의 데이터 가져오기
    updateAirQualityData(sidoName);
});

function updateAirQualityData(sidoName) {
    const dataRow = document.getElementById('dataRow');
    const data = airQualityData[sidoName];

    if (data) {
        const status = getStatus(data.pm10, data.pm25);
        dataRow.innerHTML = `
            <td>${sidoName}</td>
            <td>${data.pm10}</td>
            <td>${data.pm25}</td>
            <td>${status}</td>
        `;
        document.getElementById('error').innerText = '';
    } else {
        dataRow.innerHTML = `<td colspan="4">데이터가 없습니다.</td>`;
    }
}

function getStatus(pm10, pm25) {
    if (pm10 <= 30 && pm25 <= 15) return '좋음';
    if (pm10 <= 80 && pm25 <= 35) return '보통';
    if (pm10 <= 150 && pm25 <= 75) return '나쁨';
    return '매우 나쁨';
}

// 페이지 로드 시 기본값으로 광주광역시 정보 가져오기
updateAirQualityData('광주광역시');
