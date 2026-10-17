package com.carrymate.service;

import com.carrymate.dto.RequestDto;
import com.carrymate.dto.RequestInput;
import com.carrymate.exception.ResourceNotFoundException;
import com.carrymate.exception.UnauthorizedException;
import com.carrymate.model.AppUser;
import com.carrymate.model.ProductRequest;
import com.carrymate.model.RequestStatus;
import com.carrymate.repository.AppUserRepository;
import com.carrymate.repository.ProductRequestRepository;
import com.carrymate.security.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Product-request CRUD. Only the shopper who posted a request can edit
 * or cancel it; anyone logged in can search open requests.
 */
@Service
@RequiredArgsConstructor
public class RequestService {

    private final ProductRequestRepository requestRepository;
    private final AppUserRepository userRepository;

    private AppUser me() {
        return userRepository.findById(AuthContext.currentUserId())
                .orElseThrow(() -> new UnauthorizedException("Login required"));
    }

    private ProductRequest owned(Long id) {
        ProductRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request", id));
        if (!req.getShopper().getId().equals(AuthContext.currentUserId())) {
            throw new UnauthorizedException("Only the request owner can change it");
        }
        return req;
    }

    private void apply(ProductRequest req, RequestInput in) {
        req.setProductName(in.getProductName().trim());
        req.setDescription(in.getDescription());
        req.setBuyCountry(in.getBuyCountry().trim());
        req.setBuyCity(in.getBuyCity());
        req.setMaxPrice(in.getMaxPrice());
        req.setCurrency(in.getCurrency() == null || in.getCurrency().isBlank()
                ? "INR" : in.getCurrency().trim().toUpperCase());
        req.setQuantity(in.getQuantity());
        req.setCategory(in.getCategory() == null || in.getCategory().isBlank()
                ? "other" : in.getCategory().trim().toLowerCase());
        req.setDeliverCity(in.getDeliverCity());
        req.setDeliverCountry(in.getDeliverCountry());
        req.setImageUrl(in.getImageUrl());
    }

    @Transactional
    public RequestDto create(RequestInput in) {
        ProductRequest req = new ProductRequest();
        req.setShopper(me());
        apply(req, in);
        req.setStatus(RequestStatus.OPEN);
        return RequestDto.from(requestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<RequestDto> myRequests() {
        return requestRepository.findByShopperIdOrderByCreatedAtDesc(
                AuthContext.currentUserId()).stream().map(RequestDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<RequestDto> search(String buyCountry, String category, String q) {
        return requestRepository.search(
                blankToNull(buyCountry), blankToNull(category), blankToNull(q))
                .stream().map(RequestDto::from).toList();
    }

    @Transactional(readOnly = true)
    public RequestDto get(Long id) {
        ProductRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request", id));
        return RequestDto.from(req);
    }

    @Transactional
    public RequestDto update(Long id, RequestInput in) {
        ProductRequest req = owned(id);
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new IllegalStateException("Only OPEN requests can be edited");
        }
        apply(req, in);
        return RequestDto.from(requestRepository.save(req));
    }

    @Transactional
    public RequestDto cancel(Long id) {
        ProductRequest req = owned(id);
        req.setStatus(RequestStatus.CANCELLED);
        return RequestDto.from(requestRepository.save(req));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
