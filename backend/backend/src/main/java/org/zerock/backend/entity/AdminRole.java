package org.zerock.backend.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "admin_role")
public class AdminRole {

    @EmbeddedId
    private AdminRoleId id;

 
    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode 
    public static class AdminRoleId implements Serializable {

        @Column(name = "admin_id")
        private Long adminId;

        @Column(name = "role_id")
        private Long roleId;
    }
}