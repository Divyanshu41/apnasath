package com.apnasath.service;

import com.apnasath.dto.SharedItemDTO;
import com.apnasath.model.SharedItem;
import com.apnasath.model.SharedItem.ItemStatus;
import com.apnasath.model.User;
import com.apnasath.repository.SharedItemRepository;
import com.apnasath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SharedItemService {

    @Autowired
    private SharedItemRepository sharedItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public SharedItem createSharedItem(SharedItemDTO dto, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SharedItem item = new SharedItem();
        item.setItemName(dto.getItemName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());
        item.setStatus(ItemStatus.AVAILABLE);
        item.setAvailableFrom(dto.getAvailableFrom());
        item.setAvailableUntil(dto.getAvailableUntil());
        item.setOwner(owner);
        item.setSociety(owner.getSociety());

        return sharedItemRepository.save(item);
    }

    public List<SharedItem> getAllItemsBySociety(Long societyId) {
        return sharedItemRepository.findBySocietyIdOrderByCreatedAtDesc(societyId);
    }

    public List<SharedItem> getMySharedItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sharedItemRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());
    }

    public List<SharedItem> getAvailableItems(Long societyId) {
        return sharedItemRepository.findBySocietyIdAndStatusOrderByCreatedAtDesc(societyId, ItemStatus.AVAILABLE);
    }

    @Transactional
    public SharedItem borrowItem(Long itemId, String borrowerEmail) {
        SharedItem item = sharedItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User borrower = userRepository.findByEmail(borrowerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!item.getStatus().equals(ItemStatus.AVAILABLE)) {
            throw new RuntimeException("Item is not available");
        }

        if (item.getOwner().getId().equals(borrower.getId())) {
            throw new RuntimeException("Cannot borrow your own item");
        }

        item.setBorrower(borrower);
        item.setStatus(ItemStatus.BORROWED);
        item.setBorrowedAt(LocalDateTime.now());

        return sharedItemRepository.save(item);
    }

    @Transactional
    public SharedItem returnItem(Long itemId, String userEmail) {
        SharedItem item = sharedItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only owner or borrower can return
        if (!item.getOwner().getId().equals(user.getId()) &&
                (item.getBorrower() == null || !item.getBorrower().getId().equals(user.getId()))) {
            throw new RuntimeException("Unauthorized to return this item");
        }

        item.setBorrower(null);
        item.setStatus(ItemStatus.AVAILABLE);
        item.setReturnedAt(LocalDateTime.now());

        return sharedItemRepository.save(item);
    }

    public Long getAvailableItemsCount(Long societyId) {
        return sharedItemRepository.countBySocietyIdAndStatus(societyId, ItemStatus.AVAILABLE);
    }
}
