# Test_dust-gwangju.html
!DOCTYPE html
html lang=ko
head
    meta charset=UTF-8
    meta name=viewport content=width=device-width, initial-scale=1.0
    link rel=stylesheet href=styles.css
    title미세먼지 지수title
    style
        body {
            font-family 'Arial', sans-serif;
            margin 0;
            padding 0;
            background-color #000000;
            color white;
        }

        .container {
            display flex;
            justify-content center;
            align-items flex-start;
        }

        .main {
            display flex;
            align-items flex-start;
            background-color #000000;
            border-radius 10px;
            box-shadow 0 4px 10px rgba(0, 0, 0, 0.2);
            padding 10px;
            width 300px;
        }

        .table-container {
            margin-right 10px;
        }

        .form-group {
            display flex;
            flex-direction column;
            align-items center;
            margin 0;
        }

        .select-container {
            display flex;
            align-items center;
            margin 0;
        }

        select {
            padding 5px;
            border 1px solid #00796b;
            border-radius 5px;
            margin-right 5px;
            font-size 12px;
            color black;
        }

        button {
            background-color #00796b;
            color white;
            border none;
            border-radius 5px;
            padding 5px 10px;
            cursor pointer;
            transition background-color 0.3s;
            font-size 12px;
        }

        buttonhover {
            background-color #004d40;
        }

        table {
            width 100%;
            border-collapse collapse;
            background-color black;
        }

        th, td {
            border 1px solid #ddd;
            padding 5px;
            text-align center;
            font-size 12px;
            color white;
        }

        th {
            background-color #004d40;
            color white;
        }

        .error {
            color red;
            text-align center;
            margin-top 10px;
        }
    style
head
body
    div class=main
        form id=searchForm
            div class=select-container
                select id=sidoName
                    option value=광주광역시광주광역시option
                    option value=서울특별시서울특별시option
                    option value=부산광역시부산광역시option
                    option value=대구광역시대구광역시option
                    option value=인천광역시인천광역시option
                    option value=대전광역시대전광역시option
                    option value=울산광역시울산광역시option
                    option value=세종특별자치시세종특별자치시option
                    option value=경기도경기도option
                    option value=강원도강원도option
                    option value=충청북도충청북도option
                    option value=충청남도충청남도option
                    option value=전라북도전라북도option
                    option value=전라남도전라남도option
                    option value=경상북도경상북도option
                    option value=경상남도경상남도option
                    option value=제주특별자치도제주특별자치도option
                select
                button type=submitSearchbutton
            div
        form
        div id=error class=errordiv
        table id=dataTable
            thead
                tr
                    th측정소th
                    th미세먼지th
                    th초미세먼지th
                    th상태th
                tr
            thead
            tbody
                tr id=dataRow
                    td광주광역시td
                    td50td
                    td20td
                    td보통td
                tr
            tbody
        table
    div
    script src=script.jsscript
body
html
