package com.apnasath.repository;

import com.apnasath.model.SharedItem;
import com.apnasath.model.SharedItem.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedItemRepository extends JpaRepository<SharedItem, Long> {

    List<SharedItem> findBySocietyIdOrderByCreatedAtDesc(Long societyId);

    List<SharedItem> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<SharedItem> findByBorrowerIdOrderByCreatedAtDesc(Long borrowerId);

    List<SharedItem> findBySocietyIdAndStatusOrderByCreatedAtDesc(Long societyId, ItemStatus status);

    Long countBySocietyIdAndStatus(Long societyId, ItemStatus status);
}
