const colors = ["#fee4cb", "#e9e7fd", "#ffd3e2", "#c8f7dc"];
const Fontcolors = ["#ff942e", "#4f3ff0", "#df3670", "#34c471"];

document.addEventListener('DOMContentLoaded', function()
  {
    // 페이지 로드 시 CSV 데이터 불러오기
    loadCSVData();
    loadAdminComment();
    loadRoomLinks();

    //모드 변경
    SwithMode();
  }
);




//모드 변경
function SwithMode()
{
  var modeSwitch = document.querySelector('.mode-switch');

  modeSwitch.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');
    modeSwitch.classList.toggle('active');
  });

  var listView = document.querySelector('.list-view');
  var gridView = document.querySelector('.grid-view');
  var projectsList = document.querySelector('.project-boxes');

  listView.addEventListener('click', function () {
    gridView.classList.remove('active');
    listView.classList.add('active');
    projectsList.classList.remove('jsGridView');
    projectsList.classList.add('jsListView');
  });

  gridView.addEventListener('click', function () {
    gridView.classList.add('active');
    listView.classList.remove('active');
    projectsList.classList.remove('jsListView');
    projectsList.classList.add('jsGridView');
  });

  document.querySelector('.messages-btn').addEventListener('click', function () {
    document.querySelector('.messages-section').classList.add('show');
  });

  document.querySelector('.messages-close').addEventListener('click', function () {
    document.querySelector('.messages-section').classList.remove('show');
  });
}


//날짜 포맷 변경
function formatDate(dateString) {
  const date = new Date(dateString); // 날짜 문자열을 Date 객체로 변환
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // 날짜 형식 옵션
  return date.toLocaleDateString('en-US', options); // "January 1, 2025" 형식







let workflowData = []; // CSV 데이터를 저장할 배열]

function loadCSVData() {
  fetch('https://chaenana.github.io/IIC-Test/Sheet1.csv') // CSV 파일 경로
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n').slice(1); // 첫 번째 줄(헤더) 제거
      console.log(`Total rows (excluding header): ${rows.length}`); // 로그로 총 row 개수 출력
      const rowCount = rows.length;

      // status-number 클래스 요소 업데이트
      const statusNumberElement = document.querySelector('.status-number');
      if (statusNumberElement) {
        statusNumberElement.innerText = rowCount; // 행 개수를 status-number에 삽입
      }


      workflowData = rows.map(row => {
        const columns = row.split(',');
        return {
          id: columns[0],
          img_link: columns[1],
          description: columns[2],
          title: columns[3],
          SidePanel_WorkflowDescription: columns[4],
          download_link: columns[5],
          Update_date: columns[6]
        };
      });
      createProjectBoxes(); // 데이터 기반 박스 생성
    })
    .catch(error => console.error('CSV 파일 로드 중 오류:', error));
}



function createProjectBoxes() {
  const container = document.querySelector('.project-boxes');
  container.innerHTML = ''; // 기존 내용을 비우기

  workflowData.forEach((item, index) => { // `index` 추가
    const color = colors[index % colors.length]; // `index` 사용해 색상 순환
    const FontColor = Fontcolors[index % colors.length]; // `index` 사용해 색상 순환
    const formattedDate = formatDate(item.Update_date); // 날짜 포맷 변환

    const boxHTML = `
            <div class="project-box-wrapper">
                <div class="project-box" style="background-color: ${color};">
                    <div class="project-box-header">
                        <span class="Update-Date">${formattedDate}</span>
                    </div>
                    <div class="project-box-content-header">
                        <p class="box-content-header">${item.title}</p>
                        <p class="box-content-subheader">${item.description}</p>
                    </div>
                    <div class="Thumbs">
                        <img src="${item.img_link}" style="width: 100%; border-radius: 10px;">
                    </div>
                    <div class="project-box-footer">
                        <button class="Download-Btn" onclick="window.open('${item.download_link}', '_blank')" style="color: ${FontColor};">Download Workflow</button>
                    </div>
                </div>
            </div>
        `;
    container.innerHTML += boxHTML; // DOM에 추가
  });
}









// Rooms 데이터를 저장할 배열
let roomData = [];

// CSV 데이터 로드 함수
function loadRoomLinks() {
fetch('https://chaenana.github.io/IIC-Test/rooms.csv') // CSV 파일 경로
.then(response => response.text())
.then(text => {
  const rows = text.split('\n').slice(1); // 첫 번째 줄(헤더) 제거
  roomData = rows.map(row => {
    const columns = row.split(',');
    return {
      id: columns[0],   // Room ID
      link: columns[1], // 링크 URL
      title: columns[2] // 링크 제목
    };
  }).filter(item => item.id && item.link && item.title); // 빈 값 제거
  createRoomBoxes(); // Rooms-box 생성
})
.catch(error => console.error('Error loading room links:', error));
}

// Rooms-box 생성 함수
function createRoomBoxes() {
const roomContainer = document.querySelector('.Rooms'); // Rooms 컨테이너 선택
roomContainer.innerHTML = ''; // 기존 내용 초기화

roomData.forEach((room) => {
const roomBoxHTML = `
  <div class="Rooms-box">
    <p class="room-title">${room.title}</p>
    <button class="Room-enterBtn" onclick="window.open('${room.link}', '_blank')">Enter Room</button>

  </div>
`;
roomContainer.innerHTML += roomBoxHTML; // DOM 업데이트
});
}



function loadAdminComment() {
  fetch('https://chaenana.github.io/IIC-Test/AdminComment.csv') // CSV 파일 경로
    .then(response => response.text())
    .then(text => {
      const rows = text.split('\n').slice(1); // 첫 번째 줄(헤더) 제거
      const adminComments = rows.map(row => {
        const columns = row.split(',');
        if (columns.length >= 4) {
          return {
            id: columns[0],          // row ID
            admin_id: columns[1],    // 관리자 ID
            comment: columns[2],     // 댓글 내용
            date: columns[3]         // 날짜
          };
        }
      }).filter(item => item); // null 값 제거
      createMessageBoxes(adminComments); // 메시지 박스 생성
    })
    .catch(error => console.error('Error loading Admin Comment:', error));
}



function createMessageBoxes(comments) {
  const messageContainer = document.querySelector('.messages'); // 메시지 박스 컨테이너
  messageContainer.innerHTML = ''; // 기존 메시지 박스 비우기

  comments.forEach(comment => {
    const formattedDate = formatDate(comment.date); // 날짜 포맷 변환
    const messageBoxHTML = `
    <div class="message-box">
      <img src="https://via.placeholder.com/50" alt="profile image"> <!-- 기본 프로필 이미지 -->
      <div class="message-content">
        <div class="message-header">
          <div class="name">${comment.admin_id}</div> <!-- 관리자 ID -->
        </div>
        <p class="message-line">${comment.comment}</p> <!-- 댓글 내용 -->
        <p class="message-line time">${formattedDate}</p> <!-- 댓글 날짜 -->
      </div>
    </div>
  `;
    messageContainer.innerHTML += messageBoxHTML; // DOM 업데이트
  });
}


}
