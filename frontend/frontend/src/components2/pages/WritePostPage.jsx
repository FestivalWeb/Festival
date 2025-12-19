import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WritePostPage.css";

export default function WritePostPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null); // 이미지 파일
    const [preview, setPreview] = useState(null); // 미리보기 URL

    // ▼▼▼ [누락되었던 부분] 이미지 선택 핸들러 추가 ▼▼▼
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // 미리보기 생성
        }
    };
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }

        try {
            let uploadedFileId = null; 

            // 1. 이미지가 있다면 먼저 업로드
            if (image) {
                const imageFormData = new FormData();
                
                // [수정 1] 백엔드가 "files"라고 기다리므로 's'를 붙여야 함!
                imageFormData.append("files", image); 

                const uploadRes = await fetch("/api/media/upload", { 
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) {
                    // ▼▼▼ [수정] 백엔드가 보낸 에러 메시지("파일 용량이 너무 큽니다...")를 읽어서 띄움
                    const errorMsg = await uploadRes.text(); 
                    throw new Error(errorMsg || "이미지 업로드 실패");
                }
                
                // [수정 2] 백엔드가 리스트(배열)로 주므로 첫 번째([0])를 꺼내야 함!
                const mediaDataList = await uploadRes.json(); 
                if (mediaDataList && mediaDataList.length > 0) {
                    uploadedFileId = mediaDataList[0].fileId; 
                }
            }

            // 2. 글 등록
            const postRequest = {
                title: title,
                context: content, // [수정] 백엔드는 'context'를 원합니다! (기존: content)
                fileIds: uploadedFileId ? [uploadedFileId] : [] 
            };

            const postRes = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(postRequest),
            });

            if (!postRes.ok) throw new Error("게시글 등록 실패");

            alert("글이 등록되었습니다!");
            navigate("/post");

        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다: " + err.message);
        }
    };

    return (
        <div className="write-page">
            <h2>글쓰기</h2>

            <form onSubmit={handleSubmit} className="write-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows={10}
                    />
                </div>

                <div className="form-group">
                    <label>사진 첨부</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange} 
                    />
                </div>

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="미리보기" />
                    </div>
                )}

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