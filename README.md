<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현재 날씨 및 미세먼지 정보</title>
    <link rel="stylesheet" href="styles.css">
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
    <script src="script.js"></script>
</body>
</html>
