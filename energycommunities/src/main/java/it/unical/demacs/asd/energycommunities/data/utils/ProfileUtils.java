package it.unical.demacs.asd.energycommunities.data.utils;

import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ProfileUtils {

    public static ProfileDto computeAverageProfile(List<ProfileDto> profiles, ProfileType type) {
        // Filtra i profili del tipo richiesto
        List<ProfileDto> filtered = profiles.stream()
                .filter(p -> p.getProfileType() == type)
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            return null; // oppure lancia eccezione, a seconda di come vuoi gestirlo
        }

        int hours = 24;
        List<Double> sums = new ArrayList<>();
        for (int i = 0; i < hours; i++) {
            sums.add(0.0);
        }

        // Somma i consumi di ogni ora
        for (ProfileDto p : filtered) {
            List<Integer> graph = p.getGraph();
            for (int i = 0; i < hours; i++) {
                sums.set(i, sums.get(i) + graph.get(i));
            }
        }

        // Calcola la media
        int count = filtered.size();
        List<Integer> avg = sums.stream()
                .map(sum -> (int) Math.round(sum / count))
                .collect(Collectors.toList());

        // Crea il nuovo profilo medio
        ProfileDto averageProfile = new ProfileDto();
        averageProfile.setProfileType(type);
        averageProfile.setGraph(avg);
        averageProfile.setId(null); // non ha un ID perché è calcolato

        return averageProfile;
    }
}
