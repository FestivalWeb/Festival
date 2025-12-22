import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./WritePostPage.css";

export default function WritePostPage() {
    const navigate = useNavigate();
    const location = useLocation(); 

    // 수정 모드인지 확인
    const isEditMode = location.state && location.state.post;
    const originalPost = isEditMode ? location.state.post : null;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);       // 새로 업로드할 파일 객체
    const [preview, setPreview] = useState(null);   // 미리보기 URL

    // [초기화] 수정 모드라면 기존 데이터 채워넣기
    useEffect(() => {
        if (isEditMode && originalPost) {
            setTitle(originalPost.title);
            setContent(originalPost.context); 
            
            // 기존 이미지가 있다면 미리보기에 띄워주기
            if (originalPost.images && originalPost.images.length > 0) {
                 const firstImg = originalPost.images[0];
                 setPreview(`http://localhost:8080${firstImg.storageUri || firstImg.thumbUri}`);
            }
        }
    }, [isEditMode, originalPost]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }

        try {
            let finalFileIds = []; // 최종적으로 서버에 보낼 파일 ID 목록

            // 1. 새 이미지를 선택했다면 -> 업로드 후 그 ID 사용
            if (image) {
                const imageFormData = new FormData();
                imageFormData.append("files", image); 

                const uploadRes = await fetch("/api/media/upload", { 
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) {
                    const errorMsg = await uploadRes.text(); 
                    throw new Error(errorMsg || "이미지 업로드 실패");
                }
                
                // [수정 핵심] 서버 응답이 배열인지 객체인지 확인하여 처리
                const mediaData = await uploadRes.json(); 
                console.log("📸 [디버그] 업로드된 데이터:", mediaData);

                if (Array.isArray(mediaData) && mediaData.length > 0) {
                    // 응답이 배열인 경우 (예: [{fileId: 10, ...}])
                    finalFileIds.push(mediaData[0].fileId);
                } else if (mediaData && mediaData.fileId) {
                    // 응답이 단일 객체인 경우 (예: {fileId: 10, ...})
                    finalFileIds.push(mediaData.fileId);
                }
            } 
            // 2. 새 이미지가 없고, 수정 모드라면 -> 기존 이미지 ID 유지
            else if (isEditMode && originalPost && originalPost.images) {
                // 기존 글에 있던 이미지들의 ID를 그대로 다시 보냄
                finalFileIds = originalPost.images.map(img => img.fileId);
            }

            console.log("📤 [디버그] 최종 전송할 fileIds:", finalFileIds);

            // 3. 요청 데이터 준비
            const postRequest = {
                title: title,
                context: content, 
                fileIds: finalFileIds // [핵심] 여기에 값이 들어있어야 백엔드에서 저장됨
            };

            let response;
            if (isEditMode) {
                const targetId = originalPost.postId; 
                if (!targetId) throw new Error("게시글 ID(postId)를 찾을 수 없습니다.");

                response = await fetch(`/api/posts/${targetId}`, { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postRequest),
                });
            } else {
                response = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postRequest),
                });
            }

            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || "작업 실패");
            }

            alert(isEditMode ? "글이 수정되었습니다!" : "글이 등록되었습니다!");
            
            // 작업 후 상세 페이지로 이동
            if (isEditMode) {
                navigate(`/post/${originalPost.postId}`); 
            } else {
                navigate("/post"); 
            }

        } catch (err) {
            console.error(err);
            alert("오류가 발생했습니다: " + err.message);
        }
    };

    return (
        <div className="write-page">
            <h2>{isEditMode ? "글 수정하기" : "글쓰기"}</h2>

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
                    {isEditMode && !image && (
                        <p style={{fontSize:'12px', color:'#666', marginTop:'5px'}}>
                            ※ 새로운 사진을 선택하지 않으면 <strong>기존 사진이 유지</strong>됩니다.
                        </p>
                    )}
                    {isEditMode && image && (
                         <p style={{fontSize:'12px', color:'#e91e63', marginTop:'5px'}}>
                            ※ 새로운 사진으로 <strong>변경</strong>됩니다.
                        </p>
                    )}
                </div>

                {preview && (
                    <div className="image-preview">
                        <p style={{fontSize:'12px', marginBottom:'5px'}}>
                            [{image ? "새 이미지 미리보기" : "현재 이미지"}]
                        </p>
                        <img src={preview} alt="미리보기" />
                    </div>
                )}

                <div className="button-group">
                    <button type="submit">{isEditMode ? "수정 완료" : "등록"}</button>
                    <button type="button" onClick={() => navigate(-1)}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}