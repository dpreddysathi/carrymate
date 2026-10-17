package com.carrymate.controller;

import com.carrymate.dto.RequestDto;
import com.carrymate.dto.RequestInput;
import com.carrymate.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @GetMapping("/search")
    public List<RequestDto> search(
            @RequestParam(required = false) String buyCountry,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q) {
        return requestService.search(buyCountry, category, q);
    }

    @GetMapping("/mine")
    public List<RequestDto> myRequests() {
        return requestService.myRequests();
    }

    @GetMapping("/{id}")
    public RequestDto get(@PathVariable Long id) {
        return requestService.get(id);
    }

    @PostMapping
    public ResponseEntity<RequestDto> create(@Valid @RequestBody RequestInput in) {
        return ResponseEntity.status(201).body(requestService.create(in));
    }

    @PutMapping("/{id}")
    public RequestDto update(@PathVariable Long id, @Valid @RequestBody RequestInput in) {
        return requestService.update(id, in);
    }

    /** Cancels the request (owner only). */
    @DeleteMapping("/{id}")
    public RequestDto cancel(@PathVariable Long id) {
        return requestService.cancel(id);
    }
}
