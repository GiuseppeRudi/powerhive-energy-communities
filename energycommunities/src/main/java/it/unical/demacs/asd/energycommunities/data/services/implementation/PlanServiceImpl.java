package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import it.unical.demacs.asd.energycommunities.data.dao.PlanDao;
import it.unical.demacs.asd.energycommunities.data.services.PlanService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@SuppressWarnings(value = { "unused" })
public class PlanServiceImpl implements PlanService {
    private final PlanDao planDao;
    
    @Override
    public void upload(MultipartFile file) throws UnsupportedEncodingException, IOException {
        BufferedReader bReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
        CSVParser csvParser = CSVFormat.DEFAULT.parse(bReader);

        for(CSVRecord record: csvParser){
            System.out.println(record.toString());
        }


    }


}
