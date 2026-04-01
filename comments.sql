-- DB 생성
CREATE DATABASE IF NOT EXISTS comment_app;

-- DB 사용
USE comment_app;

-- 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,    -- 댓글 고유 ID
    text VARCHAR(255) NOT NULL,           -- 댓글 내용
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 작성 시간
);

-- (선택) 테스트용 댓글 삽입
INSERT INTO comments (text) VALUES ('첫 댓글입니다!');
INSERT INTO comments (text) VALUES ('두 번째 댓글');