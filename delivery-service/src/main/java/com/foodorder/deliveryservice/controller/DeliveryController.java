package com.foodorder.deliveryservice.controller;

import com.foodorder.deliveryservice.dto.DeliveryRequest;
import com.foodorder.deliveryservice.dto.DeliveryResponse;
import com.foodorder.deliveryservice.model.Delivery;
import com.foodorder.deliveryservice.repository.DeliveryRepository;
import com.foodorder.deliveryservice.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final DeliveryRepository deliveryRepository;

    @PostMapping
    public ResponseEntity<DeliveryResponse> createDelivery(@Valid @RequestBody DeliveryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.processDeliveryRest(request));
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryRepository.findAll());
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<Delivery> startDelivery(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.startDelivery(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Delivery> completeDelivery(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.completeDelivery(id));
    }
}
