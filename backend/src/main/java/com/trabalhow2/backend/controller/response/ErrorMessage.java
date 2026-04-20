package com.trabalhow2.backend.controller.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ErrorMessage {
    private LocalDateTime timestamp = LocalDateTime.now();
    private int status;
    private List<String> messages; 
}