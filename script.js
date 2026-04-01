// ----------------------------
// 기본 기능: 알림, 다크모드, 방문자 수
// ----------------------------
function sayHello() {
  alert("반가워요! 🎉");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// 방문자 카운트
let count = localStorage.getItem("visitCount") || 0;
count++;
localStorage.setItem("visitCount", count);

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("counter");
  if(counter) counter.innerText = "방문자 수: " + count;
});

// ----------------------------
// 댓글 CRUD (서버 연동)
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");
  const addBtn = document.getElementById("addCommentBtn");
  const commentSection = document.getElementById("comments");

  let comments = [];

  // ----------------------------
  // 서버에서 댓글 불러오기
  // ----------------------------
  async function fetchComments() {
    try {
      const res = await fetch("http://localhost:3000/api/comments");
      const data = await res.json();
      comments = data; // {id, text, created_at}
      displayComments();
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  }

  // ----------------------------
  // 댓글 화면 표시 (버튼 이벤트 안전하게 연결)
  // ----------------------------
  function displayComments() {
    list.innerHTML = "";
    comments.forEach(c => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = `${c.text} (${new Date(c.created_at).toLocaleString()})`;
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.addEventListener("click", () => editComment(c.id, c.text));
      li.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.addEventListener("click", () => deleteComment(c.id));
      li.appendChild(delBtn);

      list.appendChild(li);
    });
  }

  // ----------------------------
  // 댓글 추가
  // ----------------------------
  async function addComment() {
    const text = input.value.trim();
    if (!text) return;

    try {
      await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      input.value = "";
      fetchComments(); // 추가 후 댓글 갱신
    } catch (err) {
      console.error("댓글 추가 실패:", err);
    }
  }

  addBtn.addEventListener("click", addComment);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addComment();
    }
  });

  // ----------------------------
  // 댓글 수정
  // ----------------------------
  async function editComment(id, oldText) {
    const newText = prompt("댓글을 수정하세요:", oldText);
    if (!newText) return;

    try {
      await fetch(`http://localhost:3000/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
      });
      fetchComments();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  }

  // ----------------------------
  // 댓글 삭제
  // ----------------------------
  async function deleteComment(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await fetch(`http://localhost:3000/api/comments/${id}`, { method: "DELETE" });
      fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  }

  // window에 등록해서 다른 함수에서도 호출 가능
  window.editComment = editComment;
  window.deleteComment = deleteComment;

  // 초기 화면 표시
  fetchComments();

  // ----------------------------
  // fade-in 스크롤 애니메이션
  // ----------------------------
  window.addEventListener("scroll", () => {
    if (commentSection) {
      const rect = commentSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        commentSection.classList.add("show");
      }
    }
  });
});