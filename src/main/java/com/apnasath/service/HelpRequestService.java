package com.apnasath.service;

import com.apnasath.dto.HelpRequestDTO;
import com.apnasath.model.HelpRequest;
import com.apnasath.model.HelpRequest.HelpStatus;
import com.apnasath.model.User;
import com.apnasath.repository.HelpRequestRepository;
import com.apnasath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public HelpRequest createHelpRequest(HelpRequestDTO dto, String userEmail) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        HelpRequest helpRequest = new HelpRequest();
        helpRequest.setTitle(dto.getTitle());
        helpRequest.setDescription(dto.getDescription());
        helpRequest.setCategory(dto.getCategory());
        helpRequest.setPriority(dto.getPriority() != null ? dto.getPriority() : HelpRequest.Priority.MEDIUM);
        helpRequest.setStatus(HelpStatus.OPEN);
        helpRequest.setRequester(requester);
        helpRequest.setSociety(requester.getSociety());

        return helpRequestRepository.save(helpRequest);
    }

    public List<HelpRequest> getAllHelpRequestsBySociety(Long societyId) {
        return helpRequestRepository.findBySocietyIdOrderByCreatedAtDesc(societyId);
    }

    public List<HelpRequest> getMyHelpRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return helpRequestRepository.findByRequesterIdOrderByCreatedAtDesc(user.getId());
    }

    public List<HelpRequest> getHelpRequestsByStatus(Long societyId, HelpStatus status) {
        return helpRequestRepository.findBySocietyIdAndStatusOrderByCreatedAtDesc(societyId, status);
    }

    @Transactional
    public HelpRequest acceptHelpRequest(Long requestId, String helperEmail) {
        HelpRequest helpRequest = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        User helper = userRepository.findByEmail(helperEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!helpRequest.getStatus().equals(HelpStatus.OPEN)) {
            throw new RuntimeException("Help request is not available");
        }

        helpRequest.setHelper(helper);
        helpRequest.setStatus(HelpStatus.IN_PROGRESS);

        return helpRequestRepository.save(helpRequest);
    }

    @Transactional
    public HelpRequest resolveHelpRequest(Long requestId, String userEmail) {
        HelpRequest helpRequest = helpRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only requester or helper can resolve
        if (!helpRequest.getRequester().getId().equals(user.getId()) &&
                (helpRequest.getHelper() == null || !helpRequest.getHelper().getId().equals(user.getId()))) {
            throw new RuntimeException("Unauthorized to resolve this request");
        }

        helpRequest.setStatus(HelpStatus.RESOLVED);
        helpRequest.setResolvedAt(LocalDateTime.now());

        return helpRequestRepository.save(helpRequest);
    }

    public Long getOpenHelpRequestsCount(Long societyId) {
        return helpRequestRepository.countBySocietyIdAndStatus(societyId, HelpStatus.OPEN);
    }
}
