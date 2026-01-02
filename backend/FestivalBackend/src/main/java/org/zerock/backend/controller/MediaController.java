// src/main/java/org/zerock/backend/controller/MediaController.java
package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.backend.dto.MediaUploadResponse;
import org.zerock.backend.entity.MediaFile;
import org.zerock.backend.repository.MediaFileRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaFileRepository mediaFileRepository;

    // 업로드 루트 디렉터리 (프로젝트 루트 기준 "uploads")
    private final Path uploadRoot = Paths.get("uploads").toAbsolutePath();

    @PostMapping("/upload")
    @SuppressWarnings("null")
    public ResponseEntity<List<MediaUploadResponse>> upload(
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 폴더 없으면 생성
        if (!Files.exists(uploadRoot)) {
            Files.createDirectories(uploadRoot);
        }

        List<MediaUploadResponse> result = new ArrayList<>();

        for (MultipartFile multipartFile : files) {

            if (multipartFile.isEmpty()) continue;

            // 원본 파일명에서 확장자만 추출
            String originalFilename = multipartFile.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 충돌 방지를 위해 랜덤 파일명 사용
            String saveName = UUID.randomUUID() + ext;

            // 실제 저장 경로: uploads/랜덤파일명
            Path targetPath = uploadRoot.resolve(saveName);

            // 파일 저장
            Files.copy(multipartFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // DB에 MediaFile 엔티티 저장 (필드명은 실제 엔티티에 맞게 조정)
            MediaFile mediaFile = MediaFile.builder()
                    .storageUri("/uploads/" + saveName) // 브라우저에서 접근할 URL
                    .thumbUri(null)                     // 썸네일은 나중에 만들면 채우기
                    .type("IMAGE")                      // type 필드가 String 이라고 가정
                    .sizeBytes(multipartFile.getSize())
                    .weight(null)    // 이미지 사이즈 계산까지 하고 싶으면 ImageIO 사용해서 채우기
                    .height(null)
                    .durationSec(null)
                    .build();

            MediaFile saved = mediaFileRepository.save(mediaFile);

            result.add(MediaUploadResponse.builder()
                    .fileId(saved.getFileId())
                    .url(saved.getStorageUri())
                    .thumbUrl(saved.getThumbUri())
                    .build());
        }

        return ResponseEntity.ok(result);
    }
}
