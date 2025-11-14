package org.zerock.backend.service; 

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class MapService { 

    
    private final RestTemplate restTemplate;

   
    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    
    private final String KAKAO_ADDRESS_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/address.json";
   
    public String searchAddress(String query) {
        
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", kakaoApiKey);

      
        HttpEntity<String> entity = new HttpEntity<>(headers);

       
        String url = KAKAO_ADDRESS_SEARCH_URL + "?query=" + query;

       
        ResponseEntity<String> response = restTemplate.exchange(
                url,          
                HttpMethod.GET, 
                entity,       
                String.class  
        );
       
       
        return response.getBody();
    }
}