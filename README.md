<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>미세먼지 지수</title>
</head>
<body>
    <div class="main">
        <div class="table-container">
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>측정소</th>
                        <th>미세먼지</th>
                        <th>초미세먼지</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="dataRow">
                        <td>광주광역시</td>
                        <td>50</td>
                        <td>20</td>
                        <td>보통</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <form id="searchForm">
            <label>
                <select id="sidoName">
                    <option value="광주광역시">광주광역시</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                </select>
            </label>
            <button type="submit">Search</button>
        </form>
        <div id="error" class="error"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
