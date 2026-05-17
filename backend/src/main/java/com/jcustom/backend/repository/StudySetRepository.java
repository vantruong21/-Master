package com.jcustom.backend.repository;

import com.jcustom.backend.entity.StudySet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudySetRepository extends JpaRepository<StudySet, Long> {
}
