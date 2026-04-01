const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json()); // JSON 요청 처리

// ----------------------------
// MySQL 연결
// ----------------------------
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // 실제 MySQL 비밀번호로 변경
  database: "comment_app",
  port: 1234 //포트번호 4자리
});

connection.connect(err => {
  if (err) {
    console.error("DB 연결 실패:", err);
  } else {
    console.log("DB 연결 성공");
  }
});

// ----------------------------
// 댓글 조회 (GET)
// ----------------------------
app.get("/api/comments", (req, res) => {
  const sql = "SELECT * FROM comments ORDER BY created_at DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("댓글 불러오기 실패:", err);
      return res.status(500).json({ error: "DB 오류" });
    }
    res.json(results);
  });
});

// ----------------------------
// 댓글 추가 (POST)
// ----------------------------
app.post("/api/comments", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "댓글 내용 필요" });

  const sql = "INSERT INTO comments (text) VALUES (?)";
  connection.query(sql, [text], (err, result) => {
    if (err) {
      console.error("댓글 추가 실패:", err);
      return res.status(500).json({ error: "DB 오류" });
    }
    res.json({ id: result.insertId, text });
  });
});

// ----------------------------
// 댓글 수정 (PUT)
// ----------------------------
app.put("/api/comments/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "댓글 내용 필요" });

  const sql = "UPDATE comments SET text = ? WHERE id = ?";
  connection.query(sql, [text, id], (err, result) => {
    if (err) {
      console.error("댓글 수정 실패:", err);
      return res.status(500).json({ error: "DB 오류" });
    }
    res.json({ message: "댓글 수정 완료" });
  });
});

// ----------------------------
// 댓글 삭제 (DELETE)
// ----------------------------
app.delete("/api/comments/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM comments WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("댓글 삭제 실패:", err);
      return res.status(500).json({ error: "DB 오류" });
    }
    res.json({ message: "댓글 삭제 완료" });
  });
});

// ----------------------------
// 서버 시작
// ----------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버 실행중 http://localhost:${PORT}`);
});