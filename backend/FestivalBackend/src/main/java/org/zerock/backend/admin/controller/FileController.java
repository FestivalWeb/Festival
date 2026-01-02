package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.backend.admin.dto.booth.PostImageResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/files")
@Log4j2
@RequiredArgsConstructor
public class FileController {

    // 파일 저장할 실제 경로 (application.properties에서 가져옴)
    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    @PostMapping("/upload")
    public List<PostImageResponse> upload(@RequestParam("files") List<MultipartFile> files) {
        
        if (files == null || files.isEmpty()) {
            return null;
        }

        List<PostImageResponse> list = new ArrayList<>();

        // 폴더 없으면 생성
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String saveName = uuid + "_" + originalName;
            
            Path savePath = Paths.get(uploadPath, saveName);

            try {
                // 실제 파일 저장
                file.transferTo(savePath);

                // 썸네일이나 이미지 확인을 위한 DTO 리턴
                list.add(PostImageResponse.builder()
                        .originalName(originalName)
                        .storedName(saveName)
                        .fileId(0L) // 임시 ID
                        .storageUri("/api/files/view/" + saveName) // 이미지 보여줄 주소
                        .build());

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    // 저장된 이미지 보여주기 (view)
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable("fileName") String fileName) {
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }
}