package it.unical.demacs.asd.energycommunities.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import it.unical.demacs.asd.energycommunities.exception.ElementNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public ResponseEntity<Object> handler_element_not_found(ElementNotFoundException ex){
        return ResponseEntity.notFound().build();
    }

}
