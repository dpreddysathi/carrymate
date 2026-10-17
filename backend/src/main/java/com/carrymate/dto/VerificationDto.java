package com.carrymate.dto;

import com.carrymate.model.DocType;
import com.carrymate.model.VerificationRequest;
import com.carrymate.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationDto {

    private Long id;
    private Long userId;
    private DocType docType;
    private String docReference;
    private VerificationStatus status;

    public static VerificationDto from(VerificationRequest v) {
        return new VerificationDto(v.getId(), v.getUser().getId(),
                v.getDocType(), v.getDocReference(), v.getStatus());
    }
}
