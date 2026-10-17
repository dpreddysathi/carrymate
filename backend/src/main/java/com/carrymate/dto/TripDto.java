package com.carrymate.dto;

import com.carrymate.model.Trip;
import com.carrymate.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/** Trip with its traveler attached. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripDto {

    private Long id;
    private UserDto traveler;
    private String fromCountry;
    private String fromCity;
    private String toCountry;
    private String toCity;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private Double availableKg;
    private String categories;
    private Double commissionPct;
    private TripStatus status;

    public static TripDto from(Trip t) {
        return new TripDto(t.getId(), UserDto.from(t.getTraveler()),
                t.getFromCountry(), t.getFromCity(), t.getToCountry(), t.getToCity(),
                t.getDepartureDate(), t.getArrivalDate(), t.getAvailableKg(),
                t.getCategories(), t.getCommissionPct(), t.getStatus());
    }
}
