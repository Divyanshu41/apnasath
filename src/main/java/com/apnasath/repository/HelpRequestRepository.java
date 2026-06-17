package com.apnasath.repository;

import com.apnasath.model.HelpRequest;
import com.apnasath.model.HelpRequest.HelpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {

    List<HelpRequest> findBySocietyIdOrderByCreatedAtDesc(Long societyId);

    List<HelpRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<HelpRequest> findByHelperIdOrderByCreatedAtDesc(Long helperId);

    List<HelpRequest> findBySocietyIdAndStatusOrderByCreatedAtDesc(Long societyId, HelpStatus status);

    Long countBySocietyIdAndStatus(Long societyId, HelpStatus status);
}
