package com.carrymate.dto;

import com.carrymate.model.AppUser;
import com.carrymate.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Public shape of a user — never includes the password hash. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean travelerVerified;
    private VerificationStatus verificationStatus;
    private double ratingAvg;
    private int ratingCount;

    public static UserDto from(AppUser u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
                u.isTravelerVerified(), u.getVerificationStatus(),
                u.getRatingAvg(), u.getRatingCount());
    }
}
