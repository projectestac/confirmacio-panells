-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: May 22, 2023 at 08:54 AM
-- Server version: 5.7.40-log
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enquesta`
--

-- --------------------------------------------------------

--
-- Table structure for table `respostes`
--

CREATE TABLE `respostes` (
  `idCentre` varchar(8) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` varchar(64) NOT NULL,
  `estat` varchar(12) NOT NULL DEFAULT 'OBERT',
  `grups` int(3) NOT NULL DEFAULT '0',
  `pDepartament` int(2) NOT NULL DEFAULT '0',
  `pAltres` int(2) NOT NULL DEFAULT '0',
  `mad` int(4) NOT NULL DEFAULT '0',
  `a75paret` int(2) NOT NULL DEFAULT '0',
  `a75rodes` int(2) NOT NULL DEFAULT '0',
  `a65paret` int(2) NOT NULL DEFAULT '0',
  `a65rodes` int(2) NOT NULL DEFAULT '0',
  `srFixes` int(2) NOT NULL DEFAULT '0',
  `srRodes` int(2) NOT NULL DEFAULT '0',
  `armGrans` int(2) NOT NULL DEFAULT '0',
  `armPetits` int(2) NOT NULL DEFAULT '0',
  `tablets` int(2) NOT NULL DEFAULT '0',
  `visDoc` int(2) NOT NULL DEFAULT '0',
  `altaveus` int(2) NOT NULL DEFAULT '0',
  `comentaris` text,
  `nomFitxer` varchar(64) DEFAULT NULL,
  `dataFitxer` int(11) DEFAULT NULL,
  `signatPer` varchar(512) DEFAULT NULL,
  `metaFitxer` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `respostes`
--
ALTER TABLE `respostes`
  ADD PRIMARY KEY (`idCentre`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
