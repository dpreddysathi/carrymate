package com.carrymate.controller;

import com.carrymate.dto.TripDto;
import com.carrymate.dto.TripInput;
import com.carrymate.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping("/search")
    public List<TripDto> search(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return tripService.search(from, to, date);
    }

    @GetMapping("/mine")
    public List<TripDto> myTrips() {
        return tripService.myTrips();
    }

    @GetMapping("/{id}")
    public TripDto get(@PathVariable Long id) {
        return tripService.get(id);
    }

    @PostMapping
    public ResponseEntity<TripDto> create(@Valid @RequestBody TripInput in) {
        return ResponseEntity.status(201).body(tripService.create(in));
    }

    @PutMapping("/{id}")
    public TripDto update(@PathVariable Long id, @Valid @RequestBody TripInput in) {
        return tripService.update(id, in);
    }

    /** Cancels the trip (owner only). */
    @DeleteMapping("/{id}")
    public TripDto cancel(@PathVariable Long id) {
        return tripService.cancel(id);
    }
}
