package com.carrymate.dto;

import com.carrymate.model.DocType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VerificationInput {

    @NotNull(message = "docType is required")
    private DocType docType;

    /**
     * Reference only — e.g. "passport ending 1234, verified on video
     * call". Never send the full document number or a file in v1.
     */
    private String docReference;
}
