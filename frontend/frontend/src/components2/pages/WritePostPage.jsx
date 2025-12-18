import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WritePostPage.css";

export default function WritePostPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null); // 이미지 파일
    const [preview, setPreview] = useState(null); // 미리보기 URL

    // 이미지 선택 시
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // 이미지 파일인지 체크
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }

        // 이미지가 있다면 FormData 사용
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("image", image);

        try {
            // 실제 백엔드 POST 요청
            await fetch("/api/posts", {
                method: "POST",
                body: formData,
            });

            alert("글이 등록되었습니다!");
            navigate("/post"); // 글쓰기 완료 후 게시글 목록으로 이동
        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="write-page">
            <h2>글쓰기</h2>

            <form onSubmit={handleSubmit} className="write-form">
                {/* 제목 */}
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 내용 */}
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows={10}
                    />
                </div>

                {/* 이미지 업로드 */}
                <div className="form-group">
                    <label>사진 첨부</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 이미지 미리보기 */}
                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="미리보기" />
                    </div>
                )}

                {/* 버튼 */}
                <div className="button-group">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => navigate(-1)}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
