package com.foodorder.kitchenservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

@Configuration
public class ActiveMQConfig {

    @Bean
    public MessageConverter jacksonJmsMessageConverter(com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        converter.setObjectMapper(objectMapper);
        
        java.util.Map<String, Class<?>> typeIdMappings = new java.util.HashMap<>();
        typeIdMappings.put("OrderEvent", com.foodorder.kitchenservice.dto.OrderEvent.class);
        converter.setTypeIdMappings(typeIdMappings);
        
        return converter;
    }
}
