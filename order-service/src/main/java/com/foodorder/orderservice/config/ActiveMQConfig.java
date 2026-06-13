package com.foodorder.orderservice.config;

import jakarta.jms.Queue;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

@Configuration
public class ActiveMQConfig {

    @Bean
    public Queue orderCreatedQueue() {
        return new ActiveMQQueue("order.created");
    }

    @Bean
    public MessageConverter jacksonJmsMessageConverter(com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        converter.setObjectMapper(objectMapper);
        
        java.util.Map<String, Class<?>> typeIdMappings = new java.util.HashMap<>();
        typeIdMappings.put("OrderEvent", com.foodorder.orderservice.dto.OrderEvent.class);
        typeIdMappings.put("OrderCreatedEvent", com.foodorder.orderservice.dto.OrderCreatedEvent.class);
        converter.setTypeIdMappings(typeIdMappings);
        
        return converter;
    }
}
