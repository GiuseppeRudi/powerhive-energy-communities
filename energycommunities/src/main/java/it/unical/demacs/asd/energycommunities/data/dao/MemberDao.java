package it.unical.demacs.asd.energycommunities.data.dao;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.Member;

import java.util.Optional;

@Repository
public interface MemberDao extends JpaRepository<Member, Long> {

    @EntityGraph(attributePaths = {"profiles", "profiles.profileGraph"})
    Optional<Member> findByIdAndPlanId(Long memberId, Long planId);

}

