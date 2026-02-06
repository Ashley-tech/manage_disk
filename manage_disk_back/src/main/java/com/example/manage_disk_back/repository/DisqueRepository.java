package com.example.manage_disk_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.manage_disk_back.model.Disque;

@Repository
public interface DisqueRepository extends JpaRepository<Disque, Long> {
    List<Disque> findByUtilisateurId(Long utilisateurId);
    List<Disque> findByUtilisateurIdOrderByNomAsc(Long utilisateurId);
    List<Disque> findAllByOrderByNomAsc();

}
