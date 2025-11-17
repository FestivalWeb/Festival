package org.zerock.backend.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserSignupRequestDto {

   
    private String name;
    private String userId;
    private String password;
    private String email;
    private String sex;
    private String nationality; 

    
   
    private boolean termsOfServiceAgreed; 
    
   
    private boolean privacyPolicyAgreed;  
    
    
    private boolean marketingOptIn;       
}