package it.unical.demacs.asd.energycommunities.data.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import org.springframework.web.multipart.MultipartFile;

public interface PlanService {
    void upload(MultipartFile file, Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException;

}
