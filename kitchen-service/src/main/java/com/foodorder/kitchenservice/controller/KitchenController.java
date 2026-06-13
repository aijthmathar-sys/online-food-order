package com.foodorder.kitchenservice.controller;

import com.foodorder.kitchenservice.dto.KitchenRequest;
import com.foodorder.kitchenservice.dto.KitchenResponse;
import com.foodorder.kitchenservice.service.KitchenService;
import com.foodorder.kitchenservice.repository.KitchenTicketRepository;
import com.foodorder.kitchenservice.model.KitchenTicket;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kitchen/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KitchenController {

    private final KitchenService kitchenService;
    private final KitchenTicketRepository kitchenTicketRepository;

    @GetMapping
    public ResponseEntity<List<KitchenResponse>> getAllKitchenTickets() {
        List<KitchenResponse> responses = kitchenTicketRepository.findAll().stream()
                .map(ticket -> KitchenResponse.builder()
                        .id(ticket.getId())
                        .orderId(ticket.getOrderId())
                        .items(ticket.getItems())
                        .status(ticket.getStatus())
                        .createdAt(ticket.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<KitchenResponse> createKitchenTicket(@Valid @RequestBody KitchenRequest request) {
        KitchenResponse response = kitchenService.createKitchenTicketRest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
