-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2024 at 11:54 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ommal_medapiv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `agent`
--

CREATE TABLE `agent` (
  `AgentID` int(11) NOT NULL,
  `AgentName` varchar(255) DEFAULT NULL,
  `AgentType` varchar(50) DEFAULT NULL,
  `ContactName` varchar(255) DEFAULT NULL,
  `ContactEmail` varchar(255) DEFAULT NULL,
  `ContactPhone` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `PostalCode` varchar(20) DEFAULT NULL,
  `IsSupplier` tinyint(1) DEFAULT NULL,
  `IsManufacturer` tinyint(1) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `agent`
--

INSERT INTO `agent` (`AgentID`, `AgentName`, `AgentType`, `ContactName`, `ContactEmail`, `ContactPhone`, `Address`, `City`, `Country`, `PostalCode`, `IsSupplier`, `IsManufacturer`, `IsActive`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES
(1, 'PharmaLeb', 'asd', 'Pharma', 'asd', 'asd', 'asd', 'asd', 'Lebanon', 'asd', 1, 1, 1, '{4A657A64-052E-4F27-ADB4-EC9556ABFE3E}', '2023-07-24 08:23:26', NULL, '2023-07-24 08:23:26');

--
-- Triggers `agent`
--
DELIMITER $$
CREATE TRIGGER `a_d_Agent` AFTER DELETE ON `agent` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Agent';						SET @pk_d = CONCAT('<AgentID>',OLD.`AgentID`,'</AgentID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Agent` AFTER INSERT ON `agent` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Agent'; 						SET @pk_d = CONCAT('<AgentID>',NEW.`AgentID`,'</AgentID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Agent` AFTER UPDATE ON `agent` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Agent';						SET @pk_d_old = CONCAT('<AgentID>',OLD.`AgentID`,'</AgentID>');						SET @pk_d = CONCAT('<AgentID>',NEW.`AgentID`,'</AgentID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `alertsnotifications`
--

CREATE TABLE `alertsnotifications` (
  `AlertId` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `AlertType` varchar(255) NOT NULL,
  `AlertMessage` longtext NOT NULL,
  `AlertDate` datetime NOT NULL,
  `IsRead` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `alertsnotifications`
--
DELIMITER $$
CREATE TRIGGER `a_d_AlertsNotifications` AFTER DELETE ON `alertsnotifications` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'AlertsNotifications';						SET @pk_d = CONCAT('<AlertId>',OLD.`AlertId`,'</AlertId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_AlertsNotifications` AFTER INSERT ON `alertsnotifications` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'AlertsNotifications'; 						SET @pk_d = CONCAT('<AlertId>',NEW.`AlertId`,'</AlertId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_AlertsNotifications` AFTER UPDATE ON `alertsnotifications` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'AlertsNotifications';						SET @pk_d_old = CONCAT('<AlertId>',OLD.`AlertId`,'</AlertId>');						SET @pk_d = CONCAT('<AlertId>',NEW.`AlertId`,'</AlertId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `atc_code`
--

CREATE TABLE `atc_code` (
  `ATC_ID` int(11) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `ParentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `atc_code`
--

INSERT INTO `atc_code` (`ATC_ID`, `Code`, `Name`, `Description`, `ParentID`) VALUES
(601, '231-TRIAL- 289', '165-TRIAL-glimepiride  21', '127-TRIAL- 64', 601),
(602, '140-TRIAL- 113', '89-TRIAL-acetohexamide  210', '88-TRIAL- 263', 602),
(603, '20-TRIAL- 88', '121-TRIAL-glymidine  164', '3-TRIAL- 154', 603),
(604, '22-TRIAL-A10BC  116', '154-TRIAL-Sulfonamides (heterocyclic) 286', '25-TRIAL- 224', 604),
(605, '218-TRIAL-A10BD  2', '120-TRIAL-Combinations of oral blood glucose lowering drugs 259', '188-TRIAL- 82', 605),
(606, '41-TRIAL- 174', '200-TRIAL-phenformin and sulfonylureas  66', '122-TRIAL- 54', 606),
(607, '52-TRIAL- 250', '16-TRIAL-metformin and sulfonylureas  26', '86-TRIAL- 2', 607),
(608, '237-TRIAL- 101', '201-TRIAL-metformin and rosiglitazone  249', '67-TRIAL- 102', 608),
(609, '65-TRIAL- 281', '43-TRIAL-glimepiride and rosiglitazone  210', '108-TRIAL- 89', 609),
(610, '258-TRIAL- 284', '121-TRIAL-metformin and pioglitazone  206', '286-TRIAL- 287', 610),
(611, '171-TRIAL- 90', '72-TRIAL-glimepiride and pioglitazone  18', '273-TRIAL- 253', 611),
(612, '81-TRIAL- 262', '96-TRIAL-metformin and sitagliptin  13', '151-TRIAL- 15', 612),
(613, '104-TRIAL- 285', '233-TRIAL-metformin and vildagliptin  264', '4-TRIAL- 237', 613),
(614, '53-TRIAL- 284', '133-TRIAL-pioglitazone and alogliptin  172', '221-TRIAL- 44', 614),
(615, '70-TRIAL- 57', '88-TRIAL-metformin and saxagliptin  129', '197-TRIAL- 40', 615),
(616, '123-TRIAL- 1', '43-TRIAL-metformin and linagliptin  176', '231-TRIAL- 200', 616),
(617, '48-TRIAL- 113', '253-TRIAL-pioglitazone and sitagliptin  211', '93-TRIAL- 32', 617),
(618, '151-TRIAL- 14', '99-TRIAL-metformin and alogliptin  216', '112-TRIAL- 234', 618),
(619, '249-TRIAL- 152', '212-TRIAL-metformin and repaglinide  241', '109-TRIAL- 150', 619),
(620, '180-TRIAL- 169', '235-TRIAL-metformin and dapagliflozin  62', '265-TRIAL- 211', 620),
(621, '217-TRIAL- 211', '163-TRIAL-metformin and canagliflozin  121', '206-TRIAL- 145', 621),
(622, '243-TRIAL- 250', '93-TRIAL-metformin and acarbose  64', '42-TRIAL- 144', 622),
(623, '233-TRIAL- 136', '202-TRIAL-metformin and gemigliptin  25', '259-TRIAL- 253', 623),
(624, '207-TRIAL- 6', '43-TRIAL-linagliptin and empagliflozin  129', '51-TRIAL- 70', 624),
(625, '95-TRIAL- 228', '141-TRIAL-metformin and empagliflozin  59', '220-TRIAL- 215', 625),
(626, '244-TRIAL- 278', '158-TRIAL-saxagliptin and dapagliflozin  284', '238-TRIAL- 83', 626),
(627, '138-TRIAL- 137', '135-TRIAL-metformin and evogliptin  230', '282-TRIAL- 215', 627),
(628, '280-TRIAL- 221', '225-TRIAL-metformin and ertugliflozin  52', '204-TRIAL- 46', 628),
(629, '212-TRIAL- 104', '245-TRIAL-sitagliptin and ertugliflozin  25', '44-TRIAL- 149', 629),
(630, '294-TRIAL- 129', '32-TRIAL-metformin, saxagliptin and dapagliflozin  9', '116-TRIAL- 29', 630),
(631, '261-TRIAL- 133', '30-TRIAL-metformin and lobeglitazone  246', '132-TRIAL- 83', 631),
(632, '273-TRIAL- 139', '280-TRIAL-metformin, linagliptin and empagliflozin  135', '87-TRIAL- 170', 632),
(633, '89-TRIAL-A10BF 129', '160-TRIAL- Alpha glucosidase inhibitors 121', '97-TRIAL- 89', 633),
(634, '263-TRIAL- 144', '21-TRIAL-acarbose  105', '115-TRIAL- 213', 634),
(635, '134-TRIAL- 199', '237-TRIAL-miglitol  115', '64-TRIAL- 258', 635),
(636, '111-TRIAL- 283', '246-TRIAL-voglibose  243', '37-TRIAL- 131', 636),
(637, '155-TRIAL- 251', '51-TRIAL-troglitazone  90', '152-TRIAL- 295', 637),
(638, '120-TRIAL-A10BG  61', '260-TRIAL-Thiazolidinediones 67', '273-TRIAL- 234', 638),
(639, '33-TRIAL- 291', '1-TRIAL-rosiglitazone  78', '187-TRIAL- 279', 639),
(640, '0-TRIAL-A10BG03  15', '109-TRIAL-pioglitazone  72', '161-TRIAL- 152', 640),
(641, '170-TRIAL- 23', '64-TRIAL-lobeglitazone  137', '150-TRIAL- 110', 641),
(642, '291-TRIAL-A10BH  78', '243-TRIAL-Dipeptidyl peptidase 4 (DPP-4) inhibitors 261', '21-TRIAL- 18', 642),
(643, '98-TRIAL- 183', '133-TRIAL-sitagliptin  295', '9-TRIAL- 72', 643),
(644, '268-TRIAL- 3', '264-TRIAL-vildagliptin  245', '49-TRIAL- 50', 644),
(645, '146-TRIAL- 242', '244-TRIAL-saxagliptin  155', '59-TRIAL- 168', 645),
(646, '185-TRIAL- 1', '168-TRIAL-alogliptin  247', '206-TRIAL- 187', 646),
(647, '135-TRIAL- 109', '164-TRIAL-linagliptin  233', '151-TRIAL- 240', 647),
(648, '25-TRIAL- 224', '46-TRIAL-gemigliptin  200', '138-TRIAL- 231', 648),
(649, '121-TRIAL- 217', '224-TRIAL-evogliptin  84', '115-TRIAL- 244', 649),
(650, '252-TRIAL- 19', '70-TRIAL-teneligliptin  267', '219-TRIAL- 74', 650),
(651, '187-TRIAL- 130', '145-TRIAL-sitagliptin and simvastatin  216', '144-TRIAL- 199', 651),
(652, '262-TRIAL- 85', '215-TRIAL-gemigliptin and rosuvastatin  121', '202-TRIAL- 41', 652),
(653, '4-TRIAL-A10BJ  73', '233-TRIAL-Glucagon-like peptide-1 (GLP-1) analogues 52', '11-TRIAL- 229', 653),
(654, '124-TRIAL- 259', '83-TRIAL-exenatide  165', '245-TRIAL- 150', 654),
(655, '226-TRIAL- 191', '197-TRIAL- 113', '171-TRIAL- 286', NULL),
(656, '262-TRIAL- 190', '184-TRIAL-liraglutide  6', '18-TRIAL- 22', 656),
(657, '119-TRIAL- 266', '18-TRIAL-lixisenatide  191', '59-TRIAL- 266', 657),
(658, '3-TRIAL-A10BJ04  179', '198-TRIAL-albiglutide  67', '45-TRIAL- 3', 658),
(659, '30-TRIAL- 20', '25-TRIAL-dulaglutide  34', '121-TRIAL- 33', 659),
(660, '35-TRIAL- 87', '193-TRIAL-semaglutide  27', '48-TRIAL- 124', 660),
(661, '292-TRIAL- 218', '200-TRIAL- 144', '131-TRIAL- 86', NULL),
(662, '95-TRIAL- 108', '153-TRIAL-beinaglutide  197', '92-TRIAL- 221', 662),
(663, '119-TRIAL- 207', '271-TRIAL-dapagliflozin  222', '161-TRIAL- 191', 663),
(664, '152-TRIAL- 151', '23-TRIAL-canagliflozin  165', '56-TRIAL- 280', 664),
(665, '61-TRIAL-A10BK  265', '223-TRIAL-Sodium-glucose co-transporter 2 (SGLT2) inhibitors 0', '28-TRIAL- 135', 665),
(666, '53-TRIAL- 12', '182-TRIAL-empagliflozin  176', '157-TRIAL- 189', 666),
(667, '292-TRIAL- 199', '276-TRIAL-ertugliflozin  61', '142-TRIAL- 231', 667),
(668, '60-TRIAL- 0', '238-TRIAL-ipragliflozin  80', '20-TRIAL- 145', 668),
(669, '29-TRIAL- 168', '41-TRIAL-sotagliflozin  162', '134-TRIAL- 133', 669),
(670, '170-TRIAL- 282', '100-TRIAL-luseogliflozin  160', '164-TRIAL- 141', 670),
(671, '199-TRIAL-A10BX  36', '165-TRIAL-Other blood glucose lowering drugs, excl. insulins 233', '229-TRIAL- 27', 671),
(672, '254-TRIAL- 28', '119-TRIAL-guar gum  284', '110-TRIAL- 168', 672),
(673, '117-TRIAL- 297', '25-TRIAL-repaglinide  206', '10-TRIAL- 263', 673),
(674, '248-TRIAL- 190', '169-TRIAL-nateglinide  244', '99-TRIAL- 243', 674),
(675, '255-TRIAL- 164', '137-TRIAL-pramlintide  158', '106-TRIAL- 111', 675),
(676, '14-TRIAL- 147', '293-TRIAL-benfluorex  129', '187-TRIAL- 280', 676),
(677, '85-TRIAL- 64', '34-TRIAL-mitiglinide  276', '215-TRIAL- 118', 677),
(678, '184-TRIAL- 247', '248-TRIAL-imeglimin  147', '155-TRIAL- 32', 678),
(679, '81-TRIAL- 237', '127-TRIAL-tirzepatide  96', '159-TRIAL- 224', 679),
(680, '199-TRIAL- 53', '201-TRIAL-carfloglitazar  41', '204-TRIAL- 129', 680),
(681, '15-TRIAL- 265', '50-TRIAL-dorzagliatin  32', '83-TRIAL- 19', 681),
(682, '296-TRIAL-A10X  139', '178-TRIAL-OTHER DRUGS USED IN DIABETES 238', '141-TRIAL- 103', 682),
(683, '6-TRIAL-A10XA  120', '270-TRIAL-Aldose reductase inhibitors 49', '5-TRIAL- 24', 683),
(684, '178-TRIAL-A11A  87', '84-TRIAL-MULTIVITAMINS, COMBINATIONS 29', '139-TRIAL- 98', 684),
(685, '173-TRIAL-A11AA  138', '215-TRIAL-Multivitamins with minerals 2', '41-TRIAL- 185', 685),
(686, '63-TRIAL-A11  11', '266-TRIAL-VITAMINS 227', '283-TRIAL- 30', 686),
(687, '165-TRIAL- 82', '82-TRIAL-multivitamins and iron  131', '35-TRIAL- 190', 687),
(688, '112-TRIAL- 256', '202-TRIAL-multivitamins and calcium  248', '213-TRIAL- 26', 688),
(689, '197-TRIAL- 64', '215-TRIAL-multivitamins and trace elements  293', '107-TRIAL- 37', 689),
(690, '118-TRIAL- 138', '224-TRIAL-multivitamins and other minerals, incl. combinations  70', '83-TRIAL- 45', 690),
(691, '28-TRIAL-A11AB  259', '283-TRIAL-Multivitamins, other combinations 21', '237-TRIAL- 160', 691),
(692, '149-TRIAL-A11B  123', '283-TRIAL-MULTIVITAMINS, PLAIN 5', '247-TRIAL- 213', 692),
(693, '86-TRIAL-A11BA  284', '9-TRIAL-Multivitamins, plain 34', '200-TRIAL- 170', 693),
(694, '239-TRIAL-A11C  157', '268-TRIAL-VITAMIN A AND D, INCL. COMBINATIONS OF THE TWO 256', '285-TRIAL- 192', 694),
(695, '122-TRIAL- 233', '35-TRIAL-retinol (vit A)  283', '227-TRIAL- 199', 695),
(696, '61-TRIAL- 190', '35-TRIAL- 100', '179-TRIAL- 173', NULL),
(697, '106-TRIAL-A11CA  285', '145-TRIAL-Vitamin A, plain 9', '36-TRIAL- 181', 697),
(698, '239-TRIAL- 99', '101-TRIAL-betacarotene  107', '195-TRIAL- 19', 698),
(699, '84-TRIAL-A11CB  27', '255-TRIAL-Vitamin A and D in combination 60', '233-TRIAL- 152', 699),
(700, '200-TRIAL-A11CC  3', '188-TRIAL-Vitamin D and analogues 298', '275-TRIAL- 169', 700),
(801, '86-TRIAL- 92', '152-TRIAL-sodium selenite  17', '124-TRIAL- 288', 801),
(802, '93-TRIAL-A12CX  89', '188-TRIAL-Other mineral products 214', '296-TRIAL- 168', 802),
(803, '146-TRIAL-A13A  158', '237-TRIAL-TONICS 145', '168-TRIAL- 297', 803),
(804, '225-TRIAL-A13  247', '21-TRIAL-TONICS 37', '243-TRIAL- 207', 804),
(805, '70-TRIAL-A14  49', '246-TRIAL-ANABOLIC AGENTS FOR SYSTEMIC USE 139', '152-TRIAL- 12', 805),
(806, '220-TRIAL-A14A  31', '76-TRIAL-ANABOLIC STEROIDS 91', '225-TRIAL- 145', 806),
(807, '299-TRIAL-A14AA  216', '274-TRIAL-Androstan derivatives 256', '77-TRIAL- 272', 807),
(808, '236-TRIAL- 108', '296-TRIAL-androstanolone  9', '132-TRIAL- 258', 808),
(809, '288-TRIAL- 144', '4-TRIAL-stanozolol  230', '227-TRIAL- 49', 809),
(810, '219-TRIAL- 68', '174-TRIAL- 101', '261-TRIAL- 55', NULL),
(811, '266-TRIAL- 227', '13-TRIAL-metandienone  62', '80-TRIAL- 18', 811),
(812, '28-TRIAL- 189', '113-TRIAL-metenolone  141', '23-TRIAL- 96', 812),
(813, '131-TRIAL- 240', '231-TRIAL- 135', '32-TRIAL- 82', NULL),
(814, '182-TRIAL- 50', '44-TRIAL-oxymetholone  152', '57-TRIAL- 1', 814),
(815, '168-TRIAL- 33', '173-TRIAL-quinbolone  294', '219-TRIAL- 126', 815),
(816, '83-TRIAL- 233', '282-TRIAL-prasterone  212', '36-TRIAL- 25', 816),
(817, '52-TRIAL- 12', '24-TRIAL-oxandrolone  145', '96-TRIAL- 2', 817),
(818, '73-TRIAL- 58', '105-TRIAL-norethandrolone  177', '58-TRIAL- 111', 818),
(819, '181-TRIAL-A14AB  250', '170-TRIAL-Estren derivatives 80', '53-TRIAL- 227', 819),
(820, '259-TRIAL- 216', '97-TRIAL-nandrolone  118', '18-TRIAL- 177', 820),
(821, '281-TRIAL- 165', '52-TRIAL-ethylestrenol  113', '171-TRIAL- 76', 821),
(822, '286-TRIAL- 174', '242-TRIAL-oxabolone cipionate  241', '209-TRIAL- 197', 822),
(823, '262-TRIAL-A14B  48', '142-TRIAL-OTHER ANABOLIC AGENTS 48', '192-TRIAL- 36', 823),
(824, '20-TRIAL-A15  117', '229-TRIAL-APPETITE STIMULANTS 24', '81-TRIAL- 138', 824),
(825, '106-TRIAL-A16  61', '250-TRIAL-OTHER ALIMENTARY TRACT AND METABOLISM PRODUCTS 247', '258-TRIAL- 139', 825),
(826, '105-TRIAL-A16A  281', '68-TRIAL-OTHER ALIMENTARY TRACT AND METABOLISM PRODUCTS 14', '1-TRIAL- 116', 826),
(827, '294-TRIAL-A16AA  167', '45-TRIAL-Amino acids and derivatives 267', '139-TRIAL- 263', 827),
(828, '100-TRIAL- 174', '144-TRIAL-levocarnitine  99', '125-TRIAL- 280', 828),
(829, '217-TRIAL- 124', '49-TRIAL- 286', '74-TRIAL- 57', NULL),
(830, '85-TRIAL- 15', '58-TRIAL-ademetionine  275', '130-TRIAL- 282', 830),
(831, '111-TRIAL- 37', '270-TRIAL-glutamine  262', '91-TRIAL- 28', 831),
(832, '261-TRIAL- 112', '296-TRIAL-mercaptamine  76', '0-TRIAL- 158', 832),
(833, '171-TRIAL- 191', '148-TRIAL-carglumic acid  22', '98-TRIAL- 50', 833),
(834, '58-TRIAL- 28', '245-TRIAL-betaine  42', '238-TRIAL- 160', 834),
(835, '73-TRIAL- 177', '93-TRIAL-metreleptin  95', '104-TRIAL- 113', 835),
(836, '132-TRIAL- 125', '104-TRIAL-alglucerase  195', '121-TRIAL- 148', 836),
(837, '168-TRIAL-A16AB  184', '220-TRIAL-Enzymes 191', '138-TRIAL- 32', 837),
(838, '119-TRIAL- 37', '166-TRIAL-imiglucerase  132', '162-TRIAL- 234', 838),
(839, '131-TRIAL- 37', '294-TRIAL-agalsidase alfa  102', '211-TRIAL- 114', 839),
(840, '142-TRIAL- 169', '234-TRIAL-agalsidase beta  247', '130-TRIAL- 3', 840),
(841, '141-TRIAL- 6', '211-TRIAL-sacrosidase  97', '37-TRIAL- 202', 841),
(842, '115-TRIAL- 163', '17-TRIAL-laronidase  117', '299-TRIAL- 151', 842),
(843, '243-TRIAL- 38', '182-TRIAL-alglucosidase alfa  54', '87-TRIAL- 12', 843),
(844, '12-TRIAL- 222', '137-TRIAL-galsulfase  274', '191-TRIAL- 208', 844),
(845, '18-TRIAL- 51', '77-TRIAL-idursulfase  123', '52-TRIAL- 111', 845),
(846, '30-TRIAL- 89', '201-TRIAL-velaglucerase alfa  115', '87-TRIAL- 228', 846),
(847, '29-TRIAL- 21', '287-TRIAL-taliglucerase alfa  263', '27-TRIAL- 188', 847),
(848, '177-TRIAL- 214', '246-TRIAL-elosulfase alfa  175', '82-TRIAL- 231', 848),
(849, '239-TRIAL- 19', '169-TRIAL-asfotase alfa  147', '162-TRIAL- 106', 849),
(850, '260-TRIAL- 252', '5-TRIAL-sebelipase alfa  261', '220-TRIAL- 80', 850),
(851, '41-TRIAL- 250', '139-TRIAL-velmanase alfa  138', '124-TRIAL- 151', 851),
(852, '105-TRIAL- 140', '289-TRIAL-idursulfase beta  225', '282-TRIAL- 204', 852),
(853, '53-TRIAL- 280', '130-TRIAL-cerliponase alfa  11', '6-TRIAL- 258', 853),
(854, '287-TRIAL- 251', '27-TRIAL-vestronidase alfa  30', '222-TRIAL- 247', 854),
(855, '207-TRIAL- 296', '14-TRIAL-pegvaliase  5', '49-TRIAL- 106', 855),
(856, '210-TRIAL- 215', '35-TRIAL-pegunigalsidase alfa  88', '285-TRIAL- 34', 856),
(857, '213-TRIAL- 223', '276-TRIAL-atidarsagene autotemcel  63', '77-TRIAL- 126', 857),
(858, '222-TRIAL- 7', '129-TRIAL-avalglucosidase alfa  266', '227-TRIAL- 125', 858),
(859, '100-TRIAL- 248', '175-TRIAL-cipaglucosidase alfa  130', '257-TRIAL- 113', 859),
(860, '196-TRIAL- 216', '292-TRIAL-pegzilarginase  205', '51-TRIAL- 7', 860),
(861, '230-TRIAL- 103', '147-TRIAL-olipudase alfa  252', '55-TRIAL- 284', 861),
(862, '135-TRIAL- 294', '146-TRIAL-thioctic acid  290', '36-TRIAL- 147', 862),
(863, '105-TRIAL-A16AX  107', '278-TRIAL-Various alimentary tract and metabolism products 158', '81-TRIAL- 46', 863),
(864, '299-TRIAL- 22', '292-TRIAL- 113', '208-TRIAL- 52', NULL),
(865, '141-TRIAL- 91', '276-TRIAL-anethole trithione  124', '157-TRIAL- 108', 865),
(866, '246-TRIAL- 258', '232-TRIAL-sodium phenylbutyrate  163', '127-TRIAL- 131', 866),
(867, '141-TRIAL- 279', '137-TRIAL-nitisinone  100', '237-TRIAL- 109', 867),
(868, '250-TRIAL- 154', '40-TRIAL-zinc acetate  97', '127-TRIAL- 279', 868),
(869, '146-TRIAL- 39', '38-TRIAL-miglustat  281', '298-TRIAL- 292', 869),
(870, '221-TRIAL- 97', '93-TRIAL-sapropterin  213', '206-TRIAL- 29', 870),
(871, '93-TRIAL- 51', '16-TRIAL-teduglutide  94', '38-TRIAL- 288', 871),
(872, '175-TRIAL- 171', '121-TRIAL-glycerol phenylbutyrate  80', '183-TRIAL- 266', 872),
(873, '299-TRIAL- 256', '209-TRIAL-eliglustat  66', '268-TRIAL- 59', 873),
(874, '95-TRIAL- 184', '28-TRIAL-sodium benzoate  94', '32-TRIAL- 266', 874),
(875, '58-TRIAL- 266', '163-TRIAL-trientine  213', '31-TRIAL- 86', 875),
(876, '160-TRIAL- 66', '249-TRIAL-uridine triacetate  22', '60-TRIAL- 83', 876),
(877, '273-TRIAL- 266', '106-TRIAL-migalastat  146', '74-TRIAL- 208', 877),
(878, '46-TRIAL- 270', '20-TRIAL-telotristat  66', '169-TRIAL- 78', 878),
(879, '127-TRIAL- 238', '84-TRIAL-givosiran  159', '167-TRIAL- 278', 879),
(880, '130-TRIAL- 21', '91-TRIAL-triheptanoin  190', '93-TRIAL- 244', 880),
(881, '109-TRIAL- 207', '40-TRIAL-lumasiran  123', '222-TRIAL- 47', 881),
(882, '250-TRIAL- 225', '62-TRIAL-fosdenopterin  282', '169-TRIAL- 140', 882),
(883, '101-TRIAL- 155', '5-TRIAL-lonafarnib  226', '287-TRIAL- 63', 883),
(884, '179-TRIAL- 166', '178-TRIAL-elivaldogene autotemcel  245', '209-TRIAL- 286', 884),
(885, '6-TRIAL-A16AX22  20', '243-TRIAL-tiomolibdic acid  106', '242-TRIAL- 161', 885),
(886, '183-TRIAL- 38', '217-TRIAL-sodium benzoate and sodium phenylacetate  295', '109-TRIAL- 99', 886),
(887, '197-TRIAL-B01AA  195', '242-TRIAL-Vitamin K antagonists 252', '67-TRIAL- 140', 887),
(888, '103-TRIAL- 55', '255-TRIAL-dicoumarol  252', '56-TRIAL- 45', 888),
(889, '162-TRIAL-B01  297', '50-TRIAL-ANTITHROMBOTIC AGENTS 289', '265-TRIAL- 205', 889),
(890, '227-TRIAL-B  247', '27-TRIAL-BLOOD AND BLOOD FORMING ORGANS 3', '76-TRIAL- 165', 890),
(891, '75-TRIAL-B01A  146', '281-TRIAL-ANTITHROMBOTIC AGENTS 103', '15-TRIAL- 263', 891),
(892, '260-TRIAL- 16', '181-TRIAL-phenindione  277', '133-TRIAL- 228', 892),
(893, '284-TRIAL- 203', '244-TRIAL-warfarin  176', '74-TRIAL- 8', 893),
(894, '35-TRIAL- 202', '135-TRIAL- 241', '286-TRIAL- 93', NULL),
(895, '20-TRIAL- 114', '244-TRIAL-phenprocoumon  257', '12-TRIAL- 204', 895),
(896, '296-TRIAL- 291', '6-TRIAL-acenocoumarol  26', '116-TRIAL- 283', 896),
(897, '133-TRIAL- 11', '176-TRIAL-ethyl biscoumacetate  205', '265-TRIAL- 106', 897),
(898, '198-TRIAL- 18', '219-TRIAL-clorindione  291', '24-TRIAL- 267', 898),
(899, '250-TRIAL- 234', '95-TRIAL-diphenadione  75', '275-TRIAL- 194', 899),
(900, '187-TRIAL- 65', '62-TRIAL-tioclomarol  139', '108-TRIAL- 60', 900),
(1301, '28-TRIAL- 29', '130-TRIAL- 246', '187-TRIAL- 94', NULL),
(1302, '14-TRIAL- 178', '168-TRIAL-tocainide  233', '120-TRIAL- 291', 1302),
(1303, '23-TRIAL- 146', '278-TRIAL- 89', '98-TRIAL- 16', NULL),
(1304, '100-TRIAL- 57', '132-TRIAL-aprindine  203', '262-TRIAL- 82', 1304),
(1305, '196-TRIAL-C01BC  259', '141-TRIAL-Antiarrhythmics, class Ic 261', '25-TRIAL- 84', 1305),
(1306, '15-TRIAL- 52', '124-TRIAL-propafenone  118', '93-TRIAL- 274', 1306),
(1307, '69-TRIAL- 199', '297-TRIAL- 198', '134-TRIAL- 27', NULL),
(1308, '125-TRIAL- 72', '288-TRIAL-flecainide  151', '57-TRIAL- 180', 1308),
(1309, '291-TRIAL- 161', '188-TRIAL- 239', '260-TRIAL- 299', NULL),
(1310, '70-TRIAL- 11', '33-TRIAL-lorcainide  126', '152-TRIAL- 146', 1310),
(1311, '221-TRIAL- 80', '236-TRIAL-encainide  36', '45-TRIAL- 225', 1311),
(1312, '123-TRIAL- 176', '142-TRIAL-ethacizine  299', '24-TRIAL- 29', 1312),
(1313, '151-TRIAL-C01BD  28', '267-TRIAL-Antiarrhythmics, class III 298', '157-TRIAL- 241', 1313),
(1314, '250-TRIAL- 52', '249-TRIAL-amiodarone  100', '291-TRIAL- 211', 1314),
(1315, '214-TRIAL- 53', '110-TRIAL- 242', '53-TRIAL- 28', NULL),
(1316, '64-TRIAL- 15', '213-TRIAL-bretylium tosilate  149', '224-TRIAL- 142', 1316),
(1317, '154-TRIAL- 17', '40-TRIAL-bunaftine  12', '84-TRIAL- 149', 1317),
(1318, '128-TRIAL- 63', '63-TRIAL-dofetilide  197', '187-TRIAL- 0', 1318),
(1319, '186-TRIAL- 243', '238-TRIAL-ibutilide  118', '220-TRIAL- 12', 1319),
(1320, '97-TRIAL- 5', '46-TRIAL-tedisamil  289', '170-TRIAL- 237', 1320),
(1321, '235-TRIAL- 90', '197-TRIAL-dronedarone  92', '117-TRIAL- 103', 1321),
(1322, '130-TRIAL-C01BG  265', '52-TRIAL-Other antiarrhythmics, class I and III 119', '97-TRIAL- 154', 1322),
(1323, '128-TRIAL- 74', '83-TRIAL-moracizine  261', '13-TRIAL- 154', 1323),
(1324, '24-TRIAL- 198', '50-TRIAL-cibenzoline  90', '248-TRIAL- 56', 1324),
(1325, '124-TRIAL- 201', '218-TRIAL-vernakalant  5', '168-TRIAL- 40', 1325),
(1326, '287-TRIAL-C01C  155', '28-TRIAL-CARDIAC STIMULANTS EXCL. CARDIAC GLYCOSIDES 55', '35-TRIAL- 285', 1326),
(1327, '0-TRIAL-C01CA  129', '54-TRIAL-Adrenergic and dopaminergic agents 101', '75-TRIAL- 215', 1327),
(1328, '37-TRIAL- 31', '61-TRIAL-etilefrine  10', '147-TRIAL- 81', 1328),
(1329, '255-TRIAL- 174', '38-TRIAL- 288', '211-TRIAL- 21', NULL),
(1330, '116-TRIAL- 15', '112-TRIAL-isoprenaline  197', '131-TRIAL- 143', 1330),
(1331, '208-TRIAL- 174', '269-TRIAL- 52', '216-TRIAL- 64', NULL),
(1332, '259-TRIAL- 186', '251-TRIAL-norepinephrine  287', '72-TRIAL- 45', 1332),
(1333, '163-TRIAL- 276', '201-TRIAL-dopamine  213', '89-TRIAL- 132', 1333),
(1334, '88-TRIAL- 12', '139-TRIAL-norfenefrine  290', '157-TRIAL- 18', 1334),
(1335, '15-TRIAL- 217', '159-TRIAL-phenylephrine  272', '145-TRIAL- 249', 1335),
(1336, '71-TRIAL- 268', '181-TRIAL-dobutamine  271', '6-TRIAL- 152', 1336),
(1337, '286-TRIAL- 244', '140-TRIAL-oxedrine  231', '78-TRIAL- 279', 1337),
(1338, '73-TRIAL- 159', '92-TRIAL- 98', '187-TRIAL- 221', NULL),
(1339, '202-TRIAL- 120', '16-TRIAL-metaraminol  247', '122-TRIAL- 125', 1339),
(1340, '102-TRIAL- 20', '99-TRIAL-methoxamine  34', '204-TRIAL- 69', 1340),
(1341, '183-TRIAL- 68', '38-TRIAL-mephentermine  74', '56-TRIAL- 217', 1341),
(1342, '200-TRIAL- 179', '232-TRIAL-dimetofrine  248', '147-TRIAL- 144', 1342),
(1343, '209-TRIAL- 246', '56-TRIAL-prenalterol  70', '141-TRIAL- 39', 1343),
(1344, '193-TRIAL- 296', '113-TRIAL-dopexamine  31', '21-TRIAL- 272', 1344),
(1345, '196-TRIAL- 28', '188-TRIAL-gepefrine  39', '15-TRIAL- 199', 1345),
(1346, '55-TRIAL- 184', '158-TRIAL-ibopamine  84', '125-TRIAL- 75', 1346),
(1347, '189-TRIAL- 171', '94-TRIAL-midodrine  285', '44-TRIAL- 220', 1347),
(1348, '75-TRIAL- 261', '124-TRIAL-octopamine  71', '66-TRIAL- 135', 1348),
(1349, '59-TRIAL- 140', '43-TRIAL-fenoldopam  156', '154-TRIAL- 297', 1349),
(1350, '139-TRIAL- 209', '257-TRIAL-cafedrine  102', '223-TRIAL- 237', 1350),
(1351, '138-TRIAL- 16', '297-TRIAL-arbutamine  291', '2-TRIAL- 89', 1351),
(1352, '187-TRIAL- 97', '220-TRIAL-theodrenaline  267', '149-TRIAL- 26', 1352),
(1353, '123-TRIAL- 291', '248-TRIAL-epinephrine  235', '291-TRIAL- 144', 1353),
(1354, '258-TRIAL- 112', '98-TRIAL-amezinium metilsulfate  272', '155-TRIAL- 271', 1354),
(1355, '9-TRIAL-C01CA26  253', '148-TRIAL-ephedrine  45', '104-TRIAL- 112', 1355),
(1356, '216-TRIAL- 55', '198-TRIAL-droxidopa  162', '57-TRIAL- 196', 1356),
(1357, '218-TRIAL- 164', '104-TRIAL-combinations  118', '245-TRIAL- 213', 1357),
(1358, '295-TRIAL- 54', '133-TRIAL-etilefrine, combinations  254', '18-TRIAL- 0', 1358),
(1359, '229-TRIAL-C01CE  61', '232-TRIAL-Phosphodiesterase inhibitors 258', '46-TRIAL- 260', 1359),
(1360, '143-TRIAL- 123', '117-TRIAL-amrinone  212', '106-TRIAL- 31', 1360),
(1361, '139-TRIAL- 109', '130-TRIAL-milrinone  90', '37-TRIAL- 121', 1361),
(1362, '75-TRIAL- 74', '16-TRIAL-enoximone  281', '257-TRIAL- 165', 1362),
(1363, '243-TRIAL- 259', '250-TRIAL-bucladesine  221', '78-TRIAL- 256', 1363),
(1364, '234-TRIAL-C01CX  174', '147-TRIAL-Other cardiac stimulants 95', '0-TRIAL- 261', 1364),
(1365, '263-TRIAL- 155', '214-TRIAL-angiotensinamide  150', '68-TRIAL- 126', 1365),
(1366, '17-TRIAL- 85', '132-TRIAL-xamoterol  270', '294-TRIAL- 212', 1366),
(1367, '92-TRIAL- 284', '236-TRIAL-levosimendan  161', '102-TRIAL- 99', 1367),
(1368, '217-TRIAL- 209', '52-TRIAL-angiotensin II  290', '238-TRIAL- 44', 1368),
(1369, '166-TRIAL-C01D  270', '103-TRIAL-VASODILATORS USED IN CARDIAC DISEASES 155', '137-TRIAL- 22', 1369),
(1370, '287-TRIAL-C01DA  277', '209-TRIAL-Organic nitrates 263', '273-TRIAL- 131', 1370),
(1371, '272-TRIAL- 186', '91-TRIAL-glyceryl trinitrate  58', '292-TRIAL- 63', 1371),
(1372, '62-TRIAL- 183', '15-TRIAL- 248', '235-TRIAL- 97', NULL),
(1373, '25-TRIAL- 207', '84-TRIAL- 44', '222-TRIAL- 273', NULL),
(1374, '294-TRIAL- 173', '4-TRIAL- 159', '29-TRIAL- 93', NULL),
(1375, '147-TRIAL- 61', '128-TRIAL-methylpropylpropanediol dinitrate  59', '215-TRIAL- 116', 1375),
(1376, '15-TRIAL- 266', '262-TRIAL-pentaerithrityl tetranitrate  292', '258-TRIAL- 298', 1376),
(1377, '131-TRIAL- 279', '288-TRIAL-propatylnitrate  73', '146-TRIAL- 189', 1377),
(1378, '180-TRIAL- 181', '0-TRIAL-isosorbide dinitrate  280', '187-TRIAL- 141', 1378),
(1379, '261-TRIAL- 41', '198-TRIAL- 189', '73-TRIAL- 8', NULL),
(1380, '209-TRIAL- 50', '8-TRIAL- 141', '267-TRIAL- 125', NULL),
(1381, '150-TRIAL- 204', '236-TRIAL- 167', '54-TRIAL- 285', NULL),
(1382, '285-TRIAL- 121', '128-TRIAL-trolnitrate  35', '115-TRIAL- 104', 1382),
(1383, '244-TRIAL- 250', '155-TRIAL-eritrityl tetranitrate  119', '81-TRIAL- 119', 1383),
(1384, '248-TRIAL- 56', '231-TRIAL-isosorbide mononitrate  41', '278-TRIAL- 73', 1384),
(1385, '89-TRIAL- 297', '138-TRIAL-organic nitrates in combination  76', '174-TRIAL- 225', 1385),
(1386, '265-TRIAL- 129', '250-TRIAL-tenitramine  236', '189-TRIAL- 98', 1386),
(1387, '283-TRIAL- 149', '121-TRIAL-glyceryl trinitrate, combinations  239', '137-TRIAL- 234', 1387),
(1388, '184-TRIAL- 15', '22-TRIAL-methylpropylpropanediol dinitrate, combinations  187', '193-TRIAL- 42', 1388),
(1389, '222-TRIAL- 16', '222-TRIAL-pentaerithrityl tetranitrate, combinations  25', '279-TRIAL- 191', 1389),
(1390, '171-TRIAL- 271', '204-TRIAL-propatylnitrate, combinations  293', '100-TRIAL- 162', 1390),
(1391, '283-TRIAL- 190', '189-TRIAL-isosorbide dinitrate, combinations  217', '191-TRIAL- 118', 1391),
(1392, '20-TRIAL- 103', '175-TRIAL-trolnitrate, combinations  67', '192-TRIAL- 32', 1392),
(1393, '8-TRIAL-C01DA63  241', '298-TRIAL-eritrityl tetranitrate, combinations  158', '113-TRIAL- 93', 1393),
(1394, '1-TRIAL-C01DA70  87', '216-TRIAL-organic nitrates in combination with psycholeptics 18', '218-TRIAL- 268', 1394),
(1395, '136-TRIAL-C01DB  147', '223-TRIAL-Quinolone vasodilators 297', '173-TRIAL- 152', 1395),
(1396, '115-TRIAL- 256', '228-TRIAL-flosequinan  15', '219-TRIAL- 243', 1396),
(1397, '248-TRIAL-C01DX  110', '244-TRIAL-Other vasodilators used in cardiac diseases 210', '104-TRIAL- 40', 1397),
(1398, '237-TRIAL- 112', '234-TRIAL-itramin tosilate  144', '217-TRIAL- 268', 1398),
(1399, '35-TRIAL- 204', '232-TRIAL-prenylamine  216', '291-TRIAL- 297', 1399),
(1400, '46-TRIAL- 253', '223-TRIAL-oxyfedrine  78', '133-TRIAL- 62', 1400),
(4202, '20-TRIAL- 269', '149-TRIAL-dabrafenib  185', '203-TRIAL- 21', 4202),
(4203, '144-TRIAL- 107', '224-TRIAL-encorafenib  151', '198-TRIAL- 7', 4203),
(4204, '268-TRIAL-L01ED  279', '169-TRIAL-Anaplastic lymphoma kinase (ALK) inhibitors 133', '30-TRIAL- 51', 4204),
(4205, '170-TRIAL- 12', '226-TRIAL-crizotinib  184', '271-TRIAL- 229', 4205),
(4206, '35-TRIAL- 262', '125-TRIAL-ceritinib  247', '250-TRIAL- 234', 4206),
(4207, '62-TRIAL- 154', '248-TRIAL-alectinib  58', '280-TRIAL- 152', 4207),
(4208, '145-TRIAL- 299', '61-TRIAL-brigatinib  120', '282-TRIAL- 142', 4208),
(4209, '82-TRIAL- 173', '120-TRIAL-lorlatinib  127', '186-TRIAL- 159', 4209),
(4210, '294-TRIAL-L01EE  75', '149-TRIAL-Mitogen-activated protein kinase (MEK) inhibitors 76', '125-TRIAL- 175', 4210),
(4211, '88-TRIAL- 246', '166-TRIAL-trametinib  177', '95-TRIAL- 155', 4211),
(4212, '16-TRIAL- 207', '68-TRIAL-cobimetinib  225', '70-TRIAL- 287', 4212),
(4213, '5-TRIAL-L01EE03  170', '187-TRIAL-binimetinib  245', '33-TRIAL- 63', 4213),
(4214, '276-TRIAL- 115', '279-TRIAL-selumetinib  81', '54-TRIAL- 264', 4214),
(4215, '135-TRIAL-L01EF  60', '213-TRIAL-Cyclin-dependent kinase (CDK) inhibitors 294', '1-TRIAL- 12', 4215),
(4216, '212-TRIAL- 271', '68-TRIAL-palbociclib  132', '126-TRIAL- 102', 4216),
(4217, '207-TRIAL- 205', '148-TRIAL-ribociclib  47', '214-TRIAL- 15', 4217),
(4218, '164-TRIAL- 123', '247-TRIAL-abemaciclib  17', '193-TRIAL- 264', 4218),
(4219, '166-TRIAL-L01EG  99', '40-TRIAL-Mammalian target of rapamycin (mTOR) kinase inhibitors 269', '74-TRIAL- 159', 4219),
(4220, '282-TRIAL- 109', '185-TRIAL-temsirolimus  65', '163-TRIAL- 137', 4220),
(4221, '267-TRIAL- 120', '75-TRIAL-everolimus  27', '189-TRIAL- 204', 4221),
(4222, '27-TRIAL- 12', '83-TRIAL-ridaforolimus  197', '234-TRIAL- 114', 4222),
(4223, '152-TRIAL- 183', '208-TRIAL-sirolimus  154', '30-TRIAL- 284', 4223),
(4224, '143-TRIAL-L01EH  236', '218-TRIAL-Human epidermal growth factor receptor 2 (HER2) tyrosine kinase inhibitors 28', '4-TRIAL- 165', 4224),
(4225, '185-TRIAL- 247', '272-TRIAL-lapatinib  256', '274-TRIAL- 64', 4225),
(4226, '123-TRIAL- 56', '50-TRIAL-neratinib  16', '222-TRIAL- 180', 4226),
(4227, '13-TRIAL- 72', '156-TRIAL-tucatinib  48', '267-TRIAL- 215', 4227),
(4228, '18-TRIAL-L01EJ  135', '219-TRIAL-Janus-associated kinase (JAK) inhibitors 155', '183-TRIAL- 30', 4228),
(4229, '39-TRIAL- 211', '172-TRIAL-ruxolitinib  280', '84-TRIAL- 9', 4229),
(4230, '205-TRIAL- 182', '55-TRIAL-fedratinib  238', '276-TRIAL- 205', 4230),
(4231, '196-TRIAL- 50', '211-TRIAL-pacritinib  258', '46-TRIAL- 200', 4231),
(4232, '116-TRIAL-L01EK  233', '44-TRIAL-Vascular endothelial growth factor receptor (VEGFR) tyrosine kinase inhibitors 117', '67-TRIAL- 201', 4232),
(4233, '70-TRIAL- 192', '27-TRIAL-axitinib  283', '290-TRIAL- 190', 4233),
(4234, '41-TRIAL- 121', '148-TRIAL-cediranib  290', '2-TRIAL- 225', 4234),
(4235, '277-TRIAL- 72', '283-TRIAL-tivozanib  61', '92-TRIAL- 238', 4235),
(4236, '197-TRIAL-L01EL  65', '251-TRIAL-Bruton\'s tyrosine kinase (BTK) inhibitors 116', '145-TRIAL- 12', 4236),
(4237, '115-TRIAL- 52', '170-TRIAL-ibrutinib  203', '296-TRIAL- 152', 4237),
(4238, '250-TRIAL- 192', '260-TRIAL-acalabrutinib  138', '279-TRIAL- 69', 4238),
(4239, '190-TRIAL- 76', '101-TRIAL-zanubrutinib  187', '136-TRIAL- 125', 4239),
(4240, '175-TRIAL-L01EM  70', '16-TRIAL-Phosphatidylinositol-3-kinase (Pi3K) inhibitors 180', '81-TRIAL- 34', 4240),
(4241, '129-TRIAL- 0', '97-TRIAL-idelalisib  252', '181-TRIAL- 180', 4241),
(4242, '82-TRIAL- 73', '46-TRIAL-copanlisib  204', '52-TRIAL- 278', 4242),
(4243, '231-TRIAL- 183', '134-TRIAL-alpelisib  28', '237-TRIAL- 254', 4243),
(4244, '140-TRIAL- 214', '86-TRIAL-duvelisib  137', '57-TRIAL- 249', 4244),
(4245, '32-TRIAL- 273', '84-TRIAL-parsaclisib  124', '133-TRIAL- 57', 4245),
(4246, '45-TRIAL-L01EN  20', '197-TRIAL-Fibroblast growth factor receptor (FGFR) tyrosine kinase inhibitors 133', '286-TRIAL- 221', 4246),
(4247, '212-TRIAL- 236', '82-TRIAL-erdafitinib  258', '86-TRIAL- 32', 4247),
(4248, '118-TRIAL- 53', '89-TRIAL-pemigatinib  156', '183-TRIAL- 142', 4248),
(4249, '94-TRIAL- 17', '199-TRIAL-infigratinib  110', '54-TRIAL- 61', 4249),
(4250, '267-TRIAL- 83', '70-TRIAL-futibatinib  236', '176-TRIAL- 238', 4250),
(4251, '276-TRIAL-L01EX  195', '289-TRIAL-Other protein kinase inhibitors 64', '284-TRIAL- 151', 4251),
(4252, '129-TRIAL- 37', '12-TRIAL-sunitinib  34', '205-TRIAL- 2', 4252),
(4253, '112-TRIAL- 69', '8-TRIAL-sorafenib  196', '16-TRIAL- 209', 4253),
(4254, '164-TRIAL- 94', '286-TRIAL-pazopanib  221', '232-TRIAL- 124', 4254),
(4255, '254-TRIAL- 100', '164-TRIAL-vandetanib  256', '137-TRIAL- 199', 4255),
(4256, '21-TRIAL- 233', '98-TRIAL-regorafenib  286', '234-TRIAL- 101', 4256),
(4257, '211-TRIAL- 196', '278-TRIAL-masitinib  235', '191-TRIAL- 164', 4257),
(4258, '18-TRIAL- 202', '294-TRIAL-cabozantinib  121', '281-TRIAL- 253', 4258),
(4259, '110-TRIAL- 120', '147-TRIAL-lenvatinib  127', '161-TRIAL- 244', 4259),
(4260, '267-TRIAL- 196', '155-TRIAL-nintedanib  142', '12-TRIAL- 125', 4260),
(4261, '21-TRIAL- 99', '105-TRIAL-midostaurin  140', '234-TRIAL- 287', 4261),
(4262, '200-TRIAL- 192', '189-TRIAL-quizartinib  215', '136-TRIAL- 296', 4262),
(4263, '43-TRIAL- 277', '223-TRIAL-larotrectinib  145', '134-TRIAL- 49', 4263),
(4264, '86-TRIAL- 5', '143-TRIAL-gilteritinib  160', '238-TRIAL- 213', 4264),
(4265, '264-TRIAL- 45', '51-TRIAL-entrectinib  275', '236-TRIAL- 40', 4265),
(4266, '251-TRIAL- 205', '67-TRIAL-pexidartinib  18', '133-TRIAL- 164', 4266),
(4267, '29-TRIAL- 252', '247-TRIAL-capmatinib  84', '262-TRIAL- 275', 4267),
(4268, '96-TRIAL- 35', '35-TRIAL-avapritinib  288', '290-TRIAL- 8', 4268),
(4269, '260-TRIAL- 94', '23-TRIAL-ripretinib  147', '65-TRIAL- 32', 4269),
(4270, '82-TRIAL- 150', '2-TRIAL-tepotinib  263', '117-TRIAL- 85', 4270),
(4271, '122-TRIAL- 140', '285-TRIAL-selpercatinib  169', '286-TRIAL- 190', 4271),
(4272, '101-TRIAL- 149', '273-TRIAL-pralsetinib  270', '202-TRIAL- 222', 4272),
(4273, '199-TRIAL- 294', '203-TRIAL-surufatinib  149', '216-TRIAL- 51', 4273),
(4274, '128-TRIAL- 23', '258-TRIAL-umbralisib  14', '44-TRIAL- 41', 4274),
(4275, '242-TRIAL-L01F  210', '59-TRIAL-MONOCLONAL ANTIBODIES AND ANTIBODY DRUG CONJUGATES 155', '239-TRIAL- 92', 4275),
(4276, '89-TRIAL-L01FA  53', '147-TRIAL-CD20 (Clusters of Differentiation 20) inhibitors 263', '157-TRIAL- 44', 4276),
(4277, '46-TRIAL- 229', '53-TRIAL-ofatumumab  14', '100-TRIAL- 94', 4277),
(4278, '30-TRIAL- 234', '131-TRIAL-rituximab  103', '219-TRIAL- 102', 4278),
(4279, '77-TRIAL- 213', '149-TRIAL-obinutuzumab  217', '82-TRIAL- 183', 4279),
(4280, '189-TRIAL-L01FB  27', '277-TRIAL-CD22 (Clusters of Differentiation 22) inhibitors 229', '249-TRIAL- 207', 4280),
(4281, '239-TRIAL- 3', '171-TRIAL-inotuzumab ozogamicin  152', '229-TRIAL- 154', 4281),
(4282, '48-TRIAL- 187', '48-TRIAL-moxetumomab pasudotox 133', '25-TRIAL- 220', 4282),
(4283, '226-TRIAL-L01FC  10', '132-TRIAL-CD38 (Clusters of Differentiation 38) inhibitors 143', '50-TRIAL- 214', 4283),
(4284, '160-TRIAL- 33', '54-TRIAL-daratumumab  90', '232-TRIAL- 239', 4284),
(4285, '76-TRIAL- 220', '217-TRIAL-isatuximab 86', '159-TRIAL- 257', 4285),
(4286, '239-TRIAL-L01FD  104', '259-TRIAL-HER2 (Human Epidermal Growth Factor Receptor 2) inhibitors 16', '259-TRIAL- 90', 4286),
(4287, '192-TRIAL- 63', '206-TRIAL-trastuzumab  274', '47-TRIAL- 249', 4287),
(4288, '100-TRIAL- 198', '73-TRIAL-pertuzumab  136', '277-TRIAL- 194', 4288),
(4289, '244-TRIAL- 291', '132-TRIAL-trastuzumab emtansine  227', '164-TRIAL- 94', 4289),
(4290, '163-TRIAL- 92', '114-TRIAL-trastuzumab deruxtecan  164', '210-TRIAL- 206', 4290),
(4291, '83-TRIAL- 262', '287-TRIAL-trastuzumab duocarmazine  138', '250-TRIAL- 203', 4291),
(4292, '64-TRIAL- 153', '106-TRIAL-margetuximab  168', '183-TRIAL- 104', 4292),
(4293, '67-TRIAL-L01FE  36', '219-TRIAL-EGFR (Epidermal Growth Factor Receptor) inhibitors 57', '11-TRIAL- 154', 4293),
(4294, '76-TRIAL- 58', '262-TRIAL-cetuximab  146', '189-TRIAL- 35', 4294),
(4295, '165-TRIAL- 205', '228-TRIAL-panitumumab  109', '98-TRIAL- 1', 4295),
(4296, '130-TRIAL- 178', '125-TRIAL-necitumumab  176', '183-TRIAL- 290', 4296),
(4297, '93-TRIAL- 184', '288-TRIAL-nivolumab  0', '21-TRIAL- 115', 4297),
(4298, '103-TRIAL- 105', '224-TRIAL-pembrolizumab  276', '206-TRIAL- 144', 4298),
(4299, '56-TRIAL-L01FF  150', '104-TRIAL-PD-1/PDL-1 (Programmed cell death protein 1/death ligand 1) inhibitors 228', '247-TRIAL- 39', 4299),
(4300, '245-TRIAL- 290', '95-TRIAL-durvalumab  135', '252-TRIAL- 242', 4300),
(4301, '223-TRIAL- 134', '166-TRIAL-avelumab  238', '37-TRIAL- 100', 4301),
(4302, '156-TRIAL- 268', '59-TRIAL-atezolizumab  27', '149-TRIAL- 97', 4302),
(4303, '165-TRIAL- 282', '89-TRIAL-cemiplimab  259', '127-TRIAL- 192', 4303),
(4304, '109-TRIAL- 216', '62-TRIAL-dostarlimab  103', '240-TRIAL- 23', 4304),
(4305, '40-TRIAL- 146', '258-TRIAL-prolgolimab  291', '170-TRIAL- 229', 4305),
(4306, '127-TRIAL- 170', '150-TRIAL-tislelizumab  147', '254-TRIAL- 264', 4306),
(4307, '284-TRIAL- 164', '38-TRIAL-retifanlimab  67', '20-TRIAL- 16', 4307),
(4308, '88-TRIAL-L01FG  185', '140-TRIAL-VEGF/VEGFR (Vascular Endothelial Growth Factor) inhibitors 80', '170-TRIAL- 39', 4308),
(4309, '184-TRIAL- 28', '92-TRIAL-bevacizumab  269', '271-TRIAL- 228', 4309),
(4310, '269-TRIAL- 116', '103-TRIAL-ramucirumab  27', '181-TRIAL- 219', 4310),
(4311, '185-TRIAL-L01FX  193', '16-TRIAL-Other monoclonal antibodies and antibody drug conjugates 161', '230-TRIAL- 140', 4311),
(4312, '253-TRIAL- 137', '77-TRIAL-edrecolomab  97', '96-TRIAL- 39', 4312),
(4313, '104-TRIAL- 284', '197-TRIAL-gemtuzumab ozogamicin  175', '264-TRIAL- 249', 4313),
(4314, '46-TRIAL- 276', '225-TRIAL-catumaxomab  108', '38-TRIAL- 238', 4314),
(4315, '230-TRIAL- 271', '111-TRIAL-ipilimumab  74', '135-TRIAL- 155', 4315),
(4316, '13-TRIAL- 221', '212-TRIAL-brentuximab vedotin  204', '221-TRIAL- 8', 4316),
(4317, '143-TRIAL- 61', '276-TRIAL-dinutuximab beta  148', '268-TRIAL- 95', 4317),
(4318, '204-TRIAL- 266', '40-TRIAL-blinatumomab  113', '287-TRIAL- 192', 4318),
(4319, '132-TRIAL- 265', '249-TRIAL-elotuzumab  256', '148-TRIAL- 4', 4319),
(4320, '289-TRIAL- 68', '132-TRIAL-mogamulizumab  143', '54-TRIAL- 286', 4320),
(4321, '57-TRIAL- 152', '280-TRIAL-olaratumab  126', '299-TRIAL- 103', 4321),
(4322, '276-TRIAL- 227', '165-TRIAL-bermekimab  74', '20-TRIAL- 195', 4322),
(4323, '158-TRIAL- 155', '0-TRIAL-tafasitamab  146', '179-TRIAL- 0', 4323),
(4324, '192-TRIAL- 27', '149-TRIAL-enfortumab vedotin  168', '219-TRIAL- 59', 4324),
(4325, '240-TRIAL- 8', '99-TRIAL-polatuzumab vedotin  242', '280-TRIAL- 156', 4325),
(4326, '126-TRIAL- 200', '187-TRIAL-belantamab mafodotin  159', '256-TRIAL- 30', 4326),
(4327, '211-TRIAL- 196', '222-TRIAL-oportuzumab monatox  25', '201-TRIAL- 95', 4327),
(4328, '3-TRIAL-L01FX17  214', '222-TRIAL-sacituzumab govitecan  235', '297-TRIAL- 171', 4328),
(4329, '37-TRIAL- 126', '130-TRIAL-amivantamab  53', '134-TRIAL- 30', 4329),
(4330, '295-TRIAL- 54', '21-TRIAL-sabatolimab  288', '149-TRIAL- 121', 4330),
(4331, '94-TRIAL- 286', '54-TRIAL-tremelimumab  219', '236-TRIAL- 97', 4331),
(4332, '234-TRIAL- 240', '219-TRIAL-naxitamab  89', '167-TRIAL- 167', 4332),
(4333, '150-TRIAL- 284', '261-TRIAL-loncastuximab tesirine  54', '284-TRIAL- 261', 4333),
(4334, '243-TRIAL- 126', '191-TRIAL-tisotumab vedotin  285', '206-TRIAL- 77', 4334),
(4335, '115-TRIAL-L01X  255', '123-TRIAL-OTHER ANTINEOPLASTIC AGENTS 133', '4-TRIAL- 1', 4335),
(4336, '34-TRIAL-L01XA  136', '198-TRIAL-Platinum compounds 9', '140-TRIAL- 204', 4336),
(4337, '280-TRIAL- 100', '266-TRIAL-cisplatin  269', '175-TRIAL- 84', 4337),
(4338, '191-TRIAL- 40', '237-TRIAL-carboplatin  22', '88-TRIAL- 131', 4338),
(4339, '77-TRIAL- 92', '185-TRIAL-oxaliplatin  82', '244-TRIAL- 191', 4339),
(4340, '12-TRIAL- 284', '164-TRIAL-satraplatin  283', '81-TRIAL- 215', 4340),
(4341, '28-TRIAL- 113', '40-TRIAL-polyplatillen  60', '33-TRIAL- 197', 4341),
(4342, '82-TRIAL-L01XB  42', '120-TRIAL-Methylhydrazines 290', '84-TRIAL- 4', 4342),
(4343, '44-TRIAL- 287', '73-TRIAL-procarbazine  125', '284-TRIAL- 199', 4343),
(4344, '159-TRIAL-L01XD  240', '44-TRIAL-Sensitizers used in photodynamic/radiation therapy 151', '281-TRIAL- 72', 4344),
(4345, '164-TRIAL- 234', '291-TRIAL-porfimer sodium  266', '70-TRIAL- 146', 4345),
(4346, '154-TRIAL- 4', '298-TRIAL-methyl aminolevulinate  77', '169-TRIAL- 272', 4346),
(4347, '282-TRIAL- 226', '288-TRIAL-aminolevulinic acid  142', '287-TRIAL- 33', 4347),
(4348, '243-TRIAL- 242', '229-TRIAL-temoporfin  233', '3-TRIAL- 290', 4348),
(4349, '209-TRIAL- 261', '105-TRIAL-efaproxiral  282', '277-TRIAL- 160', 4349),
(4350, '85-TRIAL- 184', '244-TRIAL-padeliporfin  192', '77-TRIAL- 154', 4350),
(4351, '60-TRIAL-L01XF  16', '161-TRIAL-Retinoids for cancer treatment 270', '140-TRIAL- 94', 4351),
(4352, '146-TRIAL- 29', '242-TRIAL-tretinoin  133', '132-TRIAL- 203', 4352),
(4353, '137-TRIAL- 47', '285-TRIAL-alitretinoin  83', '86-TRIAL- 253', 4353),
(4354, '31-TRIAL- 62', '88-TRIAL-bexarotene  30', '43-TRIAL- 164', 4354),
(4355, '109-TRIAL-L01XG  210', '258-TRIAL-Proteasome inhibitors 29', '239-TRIAL- 56', 4355),
(4356, '84-TRIAL- 185', '11-TRIAL-bortezomib  125', '128-TRIAL- 63', 4356),
(4357, '216-TRIAL- 278', '247-TRIAL-carfilzomib  259', '151-TRIAL- 24', 4357),
(4358, '61-TRIAL- 50', '58-TRIAL-ixazomib  131', '204-TRIAL- 270', 4358),
(4359, '11-TRIAL-L01XH  153', '86-TRIAL-Histone deacetylase (HDAC) inhibitors 225', '127-TRIAL- 216', 4359),
(4360, '109-TRIAL- 35', '87-TRIAL-vorinostat  153', '96-TRIAL- 176', 4360),
(4361, '201-TRIAL- 266', '285-TRIAL-romidepsin  42', '73-TRIAL- 274', 4361),
(4362, '145-TRIAL- 99', '214-TRIAL-panobinostat  131', '168-TRIAL- 97', 4362),
(4363, '63-TRIAL- 0', '86-TRIAL-belinostat  299', '299-TRIAL- 233', 4363),
(4364, '113-TRIAL- 219', '213-TRIAL-entinostat  28', '260-TRIAL- 121', 4364),
(4365, '28-TRIAL-L01XJ  173', '158-TRIAL-Hedgehog pathway inhibitors 50', '67-TRIAL- 9', 4365),
(4366, '299-TRIAL- 252', '274-TRIAL-vismodegib  209', '4-TRIAL- 142', 4366),
(4367, '280-TRIAL- 293', '277-TRIAL-sonidegib  115', '144-TRIAL- 63', 4367),
(4368, '61-TRIAL- 284', '6-TRIAL-glasdegib  234', '260-TRIAL- 285', 4368),
(4369, '67-TRIAL-L01XK  217', '280-TRIAL-Poly (ADP-ribose) polymerase (PARP) inhibitors 187', '179-TRIAL- 210', 4369),
(4370, '16-TRIAL- 247', '18-TRIAL-olaparib  75', '136-TRIAL- 142', 4370),
(4371, '17-TRIAL- 130', '203-TRIAL-niraparib  174', '299-TRIAL- 295', 4371),
(4372, '85-TRIAL- 48', '40-TRIAL-rucaparib  48', '220-TRIAL- 270', 4372),
(4373, '152-TRIAL- 240', '125-TRIAL-talazoparib  39', '22-TRIAL- 56', 4373),
(4374, '103-TRIAL- 273', '135-TRIAL-veliparib  95', '256-TRIAL- 274', 4374),
(4375, '274-TRIAL- 163', '292-TRIAL-pamiparib  30', '22-TRIAL- 241', 4375),
(4376, '237-TRIAL-L01XL  211', '154-TRIAL-Antineoplastic cell and gene therapy 0', '111-TRIAL- 118', 4376),
(4377, '112-TRIAL- 207', '55-TRIAL-sitimagene ceradenovec  193', '139-TRIAL- 33', 4377),
(4378, '214-TRIAL- 250', '241-TRIAL-talimogene laherparepvec  73', '185-TRIAL- 187', 4378),
(4379, '229-TRIAL- 4', '7-TRIAL-axicabtagene ciloleucel  282', '166-TRIAL- 95', 4379),
(4380, '119-TRIAL- 83', '73-TRIAL-tisagenlecleucel  215', '222-TRIAL- 11', 4380),
(4381, '191-TRIAL- 74', '10-TRIAL-ciltacabtagene autoleucel  204', '1-TRIAL- 35', 4381),
(4382, '68-TRIAL- 15', '171-TRIAL-brexucabtagene autoleucel  117', '200-TRIAL- 21', 4382),
(4383, '279-TRIAL- 14', '295-TRIAL-idecabtagene vicleucel  228', '180-TRIAL- 90', 4383),
(4384, '249-TRIAL-L01XX  223', '227-TRIAL-Other antineoplastic agents 209', '131-TRIAL- 157', 4384),
(4385, '256-TRIAL- 129', '291-TRIAL-amsacrine  195', '232-TRIAL- 30', 4385),
(4386, '115-TRIAL- 165', '73-TRIAL-asparaginase  260', '291-TRIAL- 38', 4386),
(4387, '95-TRIAL- 151', '186-TRIAL-altretamine  85', '6-TRIAL- 210', 4387),
(4388, '290-TRIAL- 47', '67-TRIAL-hydroxycarbamide  114', '170-TRIAL- 274', 4388),
(4389, '292-TRIAL- 299', '113-TRIAL-lonidamine  20', '122-TRIAL- 2', 4389),
(4390, '173-TRIAL- 29', '225-TRIAL-pentostatin  189', '221-TRIAL- 93', 4390),
(4391, '115-TRIAL- 1', '47-TRIAL-masoprocol  218', '141-TRIAL- 34', 4391),
(4392, '136-TRIAL- 72', '182-TRIAL-estramustine  296', '113-TRIAL- 45', 4392),
(4393, '0-TRIAL-L01XX16  284', '78-TRIAL-mitoguazone  195', '192-TRIAL- 296', 4393),
(4394, '189-TRIAL- 8', '201-TRIAL-tiazofurine  228', '193-TRIAL- 126', 4394),
(4395, '136-TRIAL- 113', '99-TRIAL-mitotane  195', '258-TRIAL- 183', 4395),
(4396, '141-TRIAL- 74', '235-TRIAL-pegaspargase  86', '297-TRIAL- 254', 4396),
(4397, '98-TRIAL- 212', '53-TRIAL-arsenic trioxide  239', '124-TRIAL- 150', 4397),
(4398, '232-TRIAL- 63', '1-TRIAL-denileukin diftitox  124', '43-TRIAL- 195', 4398),
(4399, '89-TRIAL- 218', '262-TRIAL-celecoxib  278', '291-TRIAL- 249', 4399),
(4400, '256-TRIAL- 60', '0-TRIAL-anagrelide  141', '246-TRIAL- 298', 4400),
(4401, '98-TRIAL- 3', '2-TRIAL-oblimersen  238', '179-TRIAL- 278', 4401),
(4502, '174-TRIAL- 105', '97-TRIAL-ropeginterferon alfa-2b  65', '99-TRIAL- 163', 4502),
(4503, '259-TRIAL- 263', '209-TRIAL-peginterferon alfacon-2  158', '286-TRIAL- 145', 4503),
(4504, '128-TRIAL- 29', '71-TRIAL-peginterferon alfa-2b, combinations  136', '123-TRIAL- 289', 4504),
(4505, '105-TRIAL- 46', '99-TRIAL-peginterferon alfa-2a, combinations  257', '248-TRIAL- 82', 4505),
(4506, '265-TRIAL-L03AC  212', '21-TRIAL-Interleukins 238', '210-TRIAL- 264', 4506),
(4507, '158-TRIAL- 265', '65-TRIAL-aldesleukin  228', '63-TRIAL- 206', 4507),
(4508, '33-TRIAL- 137', '74-TRIAL-oprelvekin  288', '159-TRIAL- 41', 4508),
(4509, '106-TRIAL-L03AX  52', '157-TRIAL-Other immunostimulants 160', '270-TRIAL- 220', 4509),
(4510, '152-TRIAL- 212', '160-TRIAL-lentinan  54', '243-TRIAL- 138', 4510),
(4511, '276-TRIAL- 52', '141-TRIAL- 28', '103-TRIAL- 216', NULL),
(4512, '198-TRIAL- 98', '163-TRIAL-roquinimex  51', '97-TRIAL- 252', 4512),
(4513, '241-TRIAL- 90', '116-TRIAL-BCG vaccine  267', '160-TRIAL- 41', 4513),
(4514, '43-TRIAL- 44', '28-TRIAL-pegademase  183', '150-TRIAL- 127', 4514),
(4515, '263-TRIAL- 78', '133-TRIAL-pidotimod  168', '111-TRIAL- 7', 4515),
(4516, '141-TRIAL- 289', '268-TRIAL-poly I:C  297', '24-TRIAL- 80', 4516),
(4517, '18-TRIAL- 179', '213-TRIAL-poly ICLC  208', '18-TRIAL- 238', 4517),
(4518, '10-TRIAL- 190', '126-TRIAL-thymopentin  283', '170-TRIAL- 11', 4518),
(4519, '159-TRIAL- 121', '214-TRIAL-immunocyanin  170', '131-TRIAL- 79', 4519),
(4520, '38-TRIAL- 131', '238-TRIAL-tasonermin  165', '156-TRIAL- 13', 4520),
(4521, '220-TRIAL- 283', '188-TRIAL-melanoma vaccine  12', '288-TRIAL- 49', 4521),
(4522, '34-TRIAL- 99', '199-TRIAL-glatiramer acetate  25', '280-TRIAL- 151', 4522),
(4523, '152-TRIAL- 98', '143-TRIAL-histamine dihydrochloride  274', '42-TRIAL- 139', 4523),
(4524, '169-TRIAL- 37', '122-TRIAL-mifamurtide  163', '261-TRIAL- 180', 4524),
(4525, '95-TRIAL- 66', '238-TRIAL-plerixafor  147', '100-TRIAL- 68', 4525),
(4526, '47-TRIAL- 192', '177-TRIAL-sipuleucel-T  137', '106-TRIAL- 140', 4526),
(4527, '212-TRIAL- 277', '59-TRIAL-cridanimod  106', '201-TRIAL- 240', 4527),
(4528, '75-TRIAL- 255', '203-TRIAL-dasiprotimut-T  136', '210-TRIAL- 27', 4528),
(4529, '78-TRIAL- 289', '206-TRIAL-elapegademase  190', '214-TRIAL- 137', 4529),
(4530, '274-TRIAL-L04  190', '293-TRIAL-IMMUNOSUPPRESSANTS 118', '54-TRIAL- 24', 4530),
(4531, '124-TRIAL-L04A  9', '3-TRIAL-IMMUNOSUPPRESSANTS 209', '197-TRIAL- 144', 4531),
(4532, '261-TRIAL-L04AA  155', '125-TRIAL-Selective immunosuppressants 247', '26-TRIAL- 81', 4532),
(4533, '12-TRIAL- 186', '262-TRIAL-muromonab-CD3  255', '158-TRIAL- 122', 4533),
(4534, '57-TRIAL- 297', '113-TRIAL-antilymphocyte immunoglobulin (horse)  13', '229-TRIAL- 186', 4534),
(4535, '110-TRIAL- 138', '113-TRIAL-antithymocyte immunoglobulin (rabbit)  275', '124-TRIAL- 189', 4535),
(4536, '241-TRIAL- 217', '2-TRIAL-mycophenolic acid  75', '123-TRIAL- 88', 4536),
(4537, '193-TRIAL- 294', '46-TRIAL- 213', '126-TRIAL- 256', NULL),
(4538, '232-TRIAL- 195', '13-TRIAL-sirolimus  113', '189-TRIAL- 128', 4538),
(4539, '14-TRIAL- 257', '269-TRIAL-leflunomide  257', '91-TRIAL- 75', 4539),
(4540, '206-TRIAL- 280', '62-TRIAL-alefacept  34', '280-TRIAL- 200', 4540),
(4541, '184-TRIAL- 221', '77-TRIAL-everolimus  291', '138-TRIAL- 250', 4541),
(4542, '277-TRIAL- 247', '72-TRIAL-gusperimus  258', '4-TRIAL- 206', 4542),
(4543, '223-TRIAL- 5', '277-TRIAL-efalizumab  240', '115-TRIAL- 47', 4543),
(4544, '259-TRIAL- 21', '77-TRIAL-abetimus  78', '134-TRIAL- 171', 4544),
(4545, '280-TRIAL- 22', '57-TRIAL-natalizumab  272', '202-TRIAL- 53', 4545),
(4546, '237-TRIAL- 56', '98-TRIAL-abatacept  233', '56-TRIAL- 214', 4546),
(4547, '177-TRIAL- 86', '3-TRIAL-eculizumab  129', '134-TRIAL- 224', 4547),
(4548, '33-TRIAL- 169', '5-TRIAL-belimumab  220', '61-TRIAL- 269', 4548),
(4549, '22-TRIAL- 138', '161-TRIAL-fingolimod  63', '134-TRIAL- 52', 4549),
(4550, '276-TRIAL- 222', '17-TRIAL-belatacept  17', '253-TRIAL- 68', 4550),
(4551, '175-TRIAL- 291', '226-TRIAL-tofacitinib  88', '249-TRIAL- 161', 4551),
(4552, '95-TRIAL- 233', '78-TRIAL-teriflunomide  299', '178-TRIAL- 264', 4552),
(4553, '211-TRIAL- 92', '115-TRIAL-apremilast  10', '235-TRIAL- 67', 4553),
(4554, '124-TRIAL- 90', '199-TRIAL-vedolizumab  177', '39-TRIAL- 281', 4554),
(4555, '181-TRIAL- 10', '255-TRIAL-alemtuzumab  23', '25-TRIAL- 201', 4555),
(4556, '155-TRIAL- 177', '200-TRIAL-begelomab  45', '185-TRIAL- 200', 4556),
(4557, '117-TRIAL- 157', '130-TRIAL-ocrelizumab  197', '78-TRIAL- 137', 4557),
(4558, '178-TRIAL- 40', '92-TRIAL-baricitinib  250', '119-TRIAL- 246', 4558),
(4559, '57-TRIAL- 37', '241-TRIAL-ozanimod  2', '273-TRIAL- 240', 4559),
(4560, '221-TRIAL- 16', '162-TRIAL-emapalumab  50', '134-TRIAL- 73', 4560),
(4561, '261-TRIAL- 35', '111-TRIAL-cladribine  290', '78-TRIAL- 73', 4561),
(4562, '190-TRIAL- 255', '147-TRIAL-imlifidase  288', '49-TRIAL- 233', 4562),
(4563, '224-TRIAL- 149', '155-TRIAL-siponimod  7', '64-TRIAL- 199', 4563),
(4564, '69-TRIAL- 133', '228-TRIAL-ravulizumab  257', '257-TRIAL- 130', 4564),
(4565, '100-TRIAL- 155', '155-TRIAL-upadacitinib  48', '298-TRIAL- 271', 4565),
(4566, '114-TRIAL- 233', '8-TRIAL-filgotinib  27', '285-TRIAL- 129', 4566),
(4567, '20-TRIAL- 36', '223-TRIAL-itacitinib  201', '69-TRIAL- 240', 4567),
(4568, '60-TRIAL- 42', '8-TRIAL-inebilizumab  13', '125-TRIAL- 98', 4568),
(4569, '140-TRIAL- 253', '241-TRIAL-belumosudil  202', '279-TRIAL- 153', 4569),
(4570, '220-TRIAL- 285', '296-TRIAL-peficitinib  62', '276-TRIAL- 128', 4570),
(4571, '253-TRIAL- 69', '231-TRIAL-ponesimod  283', '210-TRIAL- 69', 4571),
(4572, '97-TRIAL- 298', '78-TRIAL-anifrolumab  158', '98-TRIAL- 219', 4572),
(4573, '254-TRIAL- 76', '90-TRIAL-ofatumumab  95', '70-TRIAL- 110', 4573),
(4574, '75-TRIAL- 144', '162-TRIAL-teprotumumab  45', '263-TRIAL- 26', 4574),
(4575, '290-TRIAL- 52', '150-TRIAL-pegcetacoplan  240', '274-TRIAL- 17', 4575),
(4576, '74-TRIAL- 85', '169-TRIAL-sutimlimab  71', '57-TRIAL- 30', 4576),
(4577, '7-TRIAL-L04AA56  134', '118-TRIAL-deucravacitinib  238', '156-TRIAL- 232', 4577),
(4578, '205-TRIAL- 205', '55-TRIAL-ublituximab  213', '156-TRIAL- 41', 4578),
(4579, '291-TRIAL- 185', '198-TRIAL-efgartigimod alfa  94', '136-TRIAL- 256', 4579),
(4580, '218-TRIAL- 180', '181-TRIAL-avacopan  274', '299-TRIAL- 191', 4580),
(4581, '41-TRIAL-L04AB  60', '187-TRIAL-Tumor necrosis factor alpha (TNF-α) inhibitors 286', '236-TRIAL- 271', 4581),
(4582, '104-TRIAL- 238', '200-TRIAL-etanercept  176', '42-TRIAL- 65', 4582),
(4583, '231-TRIAL- 244', '30-TRIAL-infliximab  150', '230-TRIAL- 245', 4583),
(4584, '226-TRIAL- 68', '198-TRIAL-afelimomab  80', '222-TRIAL- 259', 4584),
(4585, '158-TRIAL- 116', '7-TRIAL-adalimumab  253', '121-TRIAL- 243', 4585),
(4586, '290-TRIAL- 21', '230-TRIAL-certolizumab pegol  11', '212-TRIAL- 140', 4586),
(4587, '153-TRIAL- 64', '215-TRIAL-golimumab  160', '84-TRIAL- 68', 4587),
(4588, '247-TRIAL- 66', '226-TRIAL-opinercept  120', '166-TRIAL- 103', 4588),
(4589, '58-TRIAL-L04AC  285', '220-TRIAL-Interleukin inhibitors 71', '263-TRIAL- 205', 4589),
(4590, '243-TRIAL- 237', '222-TRIAL-daclizumab  138', '286-TRIAL- 168', 4590),
(4591, '157-TRIAL- 15', '89-TRIAL-basiliximab  174', '103-TRIAL- 43', 4591),
(4592, '228-TRIAL- 262', '265-TRIAL-anakinra  242', '139-TRIAL- 276', 4592),
(4593, '151-TRIAL- 295', '30-TRIAL-rilonacept  142', '109-TRIAL- 210', 4593),
(4594, '208-TRIAL- 235', '151-TRIAL-ustekinumab  197', '146-TRIAL- 186', 4594),
(4595, '171-TRIAL- 234', '29-TRIAL-tocilizumab  284', '282-TRIAL- 15', 4595),
(4596, '163-TRIAL- 63', '178-TRIAL-canakinumab  74', '54-TRIAL- 251', 4596),
(4597, '287-TRIAL- 106', '105-TRIAL-briakinumab  9', '126-TRIAL- 62', 4597),
(4598, '197-TRIAL- 221', '86-TRIAL-secukinumab  28', '43-TRIAL- 92', 4598),
(4599, '261-TRIAL- 204', '190-TRIAL-siltuximab  107', '14-TRIAL- 22', 4599),
(4600, '195-TRIAL- 259', '181-TRIAL-brodalumab  41', '83-TRIAL- 17', 4600),
(4601, '122-TRIAL- 226', '266-TRIAL-ixekizumab  243', '250-TRIAL- 9', 4601),
(5102, '32-TRIAL- 282', '98-TRIAL-codeine and acetylsalicylic acid  21', '227-TRIAL- 91', 5102),
(5103, '210-TRIAL- 212', '101-TRIAL-codeine and ibuprofen  297', '162-TRIAL- 295', 5103),
(5104, '268-TRIAL- 78', '225-TRIAL-codeine and other non-opioid analgesics  17', '231-TRIAL- 97', 5104),
(5105, '53-TRIAL- 88', '261-TRIAL-tramadol and paracetamol  291', '273-TRIAL- 19', 5105),
(5106, '232-TRIAL- 81', '189-TRIAL-tramadol and dexketoprofen  40', '265-TRIAL- 197', 5106),
(5107, '214-TRIAL- 236', '180-TRIAL-tramadol and other non-opioid analgesics  216', '132-TRIAL- 95', 5107),
(5108, '89-TRIAL- 127', '65-TRIAL-tramadol and celecoxib  290', '292-TRIAL- 136', 5108),
(5109, '23-TRIAL- 244', '195-TRIAL-oxycodone and paracetamol  75', '33-TRIAL- 282', 5109),
(5110, '130-TRIAL- 288', '138-TRIAL-oxycodone and acetylsalicylic acid  91', '208-TRIAL- 75', 5110),
(5111, '186-TRIAL- 246', '187-TRIAL-oxycodone and ibuprofen  199', '10-TRIAL- 179', 5111),
(5112, '252-TRIAL-N02AX  295', '202-TRIAL-Other opioids 161', '160-TRIAL- 135', 5112),
(5113, '205-TRIAL- 256', '282-TRIAL-tilidine  205', '103-TRIAL- 118', 5113),
(5114, '58-TRIAL- 199', '14-TRIAL- 189', '113-TRIAL- 224', NULL),
(5115, '131-TRIAL- 229', '298-TRIAL-tramadol  21', '146-TRIAL- 220', 5115);
INSERT INTO `atc_code` (`ATC_ID`, `Code`, `Name`, `Description`, `ParentID`) VALUES
(5116, '77-TRIAL- 54', '4-TRIAL- 21', '110-TRIAL- 105', NULL),
(5117, '216-TRIAL- 137', '239-TRIAL- 50', '288-TRIAL- 103', NULL),
(5118, '149-TRIAL- 11', '194-TRIAL-dezocine  231', '253-TRIAL- 275', 5118),
(5119, '139-TRIAL- 13', '71-TRIAL-meptazinol  169', '13-TRIAL- 215', 5119),
(5120, '163-TRIAL- 266', '163-TRIAL- 212', '195-TRIAL- 11', NULL),
(5121, '53-TRIAL- 242', '259-TRIAL-tapentadol  180', '99-TRIAL- 295', 5121),
(5122, '167-TRIAL- 110', '71-TRIAL-oliceridine  155', '294-TRIAL- 249', 5122),
(5123, '125-TRIAL- 201', '256-TRIAL-tilidine and naloxone  10', '105-TRIAL- 292', 5123),
(5124, '1-TRIAL-N02B  290', '230-TRIAL-OTHER ANALGESICS AND ANTIPYRETICS 227', '170-TRIAL- 19', 5124),
(5125, '198-TRIAL-N02BA  252', '205-TRIAL-Salicylic acid and derivatives 209', '254-TRIAL- 20', 5125),
(5126, '16-TRIAL- 131', '296-TRIAL-acetylsalicylic acid  75', '63-TRIAL- 112', 5126),
(5127, '81-TRIAL- 116', '103-TRIAL- 147', '64-TRIAL- 226', NULL),
(5128, '69-TRIAL- 161', '240-TRIAL- 261', '26-TRIAL- 213', NULL),
(5129, '273-TRIAL- 230', '147-TRIAL-aloxiprin  81', '46-TRIAL- 145', 5129),
(5130, '265-TRIAL- 77', '5-TRIAL-choline salicylate  218', '51-TRIAL- 108', 5130),
(5131, '271-TRIAL- 142', '259-TRIAL-sodium salicylate  281', '106-TRIAL- 82', 5131),
(5132, '289-TRIAL- 214', '112-TRIAL-salicylamide  268', '261-TRIAL- 107', 5132),
(5133, '78-TRIAL- 189', '272-TRIAL-salsalate  290', '73-TRIAL- 50', 5133),
(5134, '210-TRIAL- 299', '123-TRIAL-ethenzamide  219', '199-TRIAL- 217', 5134),
(5135, '102-TRIAL- 245', '2-TRIAL-morpholine salicylate  262', '64-TRIAL- 175', 5135),
(5136, '269-TRIAL- 288', '194-TRIAL-dipyrocetyl  60', '190-TRIAL- 48', 5136),
(5137, '7-TRIAL-N02BA10  11', '285-TRIAL-benorilate  231', '27-TRIAL- 230', 5137),
(5138, '291-TRIAL- 6', '225-TRIAL-diflunisal  263', '294-TRIAL- 15', 5138),
(5139, '144-TRIAL- 172', '259-TRIAL-potassium salicylate  202', '49-TRIAL- 114', 5139),
(5140, '285-TRIAL- 177', '222-TRIAL-guacetisal  277', '162-TRIAL- 154', 5140),
(5141, '37-TRIAL- 37', '110-TRIAL-carbasalate calcium  16', '116-TRIAL- 96', 5141),
(5142, '182-TRIAL- 45', '55-TRIAL-imidazole salicylate  290', '223-TRIAL- 175', 5142),
(5143, '7-TRIAL-N02BA51  253', '207-TRIAL-acetylsalicylic acid, combinations excl. psycholeptics  218', '14-TRIAL- 122', 5143),
(5144, '217-TRIAL- 224', '118-TRIAL-salicylamide, combinations excl. psycholeptics  227', '264-TRIAL- 78', 5144),
(5145, '234-TRIAL- 83', '48-TRIAL-ethenzamide, combinations excl. psycholeptics  179', '247-TRIAL- 87', 5145),
(5146, '133-TRIAL- 86', '43-TRIAL-dipyrocetyl, combinations excl. psycholeptics  299', '115-TRIAL- 233', 5146),
(5147, '104-TRIAL- 96', '75-TRIAL-carbasalate calcium combinations excl. psycholeptics  107', '99-TRIAL- 199', 5147),
(5148, '158-TRIAL- 133', '247-TRIAL-acetylsalicylic acid, combinations with psycholeptics  14', '299-TRIAL- 37', 5148),
(5149, '243-TRIAL- 117', '71-TRIAL-salicylamide, combinations with psycholeptics  178', '234-TRIAL- 147', 5149),
(5150, '182-TRIAL- 112', '259-TRIAL-ethenzamide, combinations with psycholeptics  182', '25-TRIAL- 247', 5150),
(5151, '88-TRIAL- 253', '202-TRIAL-dipyrocetyl, combinations with psycholeptics  50', '199-TRIAL- 105', 5151),
(5152, '108-TRIAL-N02BB  86', '106-TRIAL-Pyrazolones 146', '144-TRIAL- 31', 5152),
(5153, '282-TRIAL- 298', '167-TRIAL-phenazone  38', '183-TRIAL- 290', 5153),
(5154, '21-TRIAL- 219', '47-TRIAL-metamizole sodium  52', '141-TRIAL- 181', 5154),
(5155, '149-TRIAL- 32', '9-TRIAL- 40', '95-TRIAL- 111', NULL),
(5156, '269-TRIAL- 114', '41-TRIAL- 86', '263-TRIAL- 297', NULL),
(5157, '248-TRIAL- 83', '1-TRIAL-aminophenazone  232', '183-TRIAL- 60', 5157),
(5158, '107-TRIAL- 132', '9-TRIAL-propyphenazone  163', '46-TRIAL- 89', 5158),
(5159, '31-TRIAL- 293', '70-TRIAL-nifenazone  241', '79-TRIAL- 43', 5159),
(5160, '35-TRIAL- 272', '190-TRIAL-phenazone, combinations excl. psycholeptics  247', '245-TRIAL- 293', 5160),
(5161, '282-TRIAL- 155', '249-TRIAL-metamizole sodium, combinations excl. psycholeptics  256', '10-TRIAL- 197', 5161),
(5162, '42-TRIAL- 264', '230-TRIAL-phenazone, combinations with psycholeptics  273', '162-TRIAL- 67', 5162),
(5163, '2-TRIAL-N02BB53  84', '142-TRIAL-aminophenazone, combinations excl. psycholeptics  19', '246-TRIAL- 186', 5163),
(5164, '279-TRIAL- 99', '120-TRIAL-propyphenazone, combinations excl. psycholeptics  99', '173-TRIAL- 207', 5164),
(5165, '161-TRIAL- 190', '76-TRIAL-metamizole sodium, combinations with psycholeptics  268', '101-TRIAL- 54', 5165),
(5166, '122-TRIAL- 91', '280-TRIAL-aminophenazone, combinations with psycholeptics  212', '128-TRIAL- 216', 5166),
(5167, '80-TRIAL- 128', '140-TRIAL-propyphenazone, combinations with psycholeptics  218', '209-TRIAL- 167', 5167),
(5168, '106-TRIAL-N02BE  126', '79-TRIAL-Anilides 233', '6-TRIAL- 91', 5168),
(5169, '24-TRIAL- 76', '102-TRIAL-paracetamol  120', '289-TRIAL- 117', 5169),
(5170, '100-TRIAL- 72', '108-TRIAL- 209', '10-TRIAL- 61', NULL),
(5171, '270-TRIAL- 182', '179-TRIAL- 280', '118-TRIAL- 99', NULL),
(5172, '17-TRIAL- 119', '79-TRIAL-phenacetin  186', '121-TRIAL- 144', 5172),
(5173, '218-TRIAL- 237', '39-TRIAL-bucetin  53', '143-TRIAL- 51', 5173),
(5174, '287-TRIAL- 273', '96-TRIAL-propacetamol  287', '134-TRIAL- 239', 5174),
(5175, '218-TRIAL- 253', '149-TRIAL-paracetamol, combinations excl. psycholeptics  188', '61-TRIAL- 32', 5175),
(5176, '267-TRIAL- 13', '298-TRIAL-phenacetin, combinations excl. psycholeptics  28', '125-TRIAL- 26', 5176),
(5177, '215-TRIAL- 12', '115-TRIAL-bucetin, combinations excl. psycholeptics  124', '109-TRIAL- 179', 5177),
(5178, '93-TRIAL- 122', '176-TRIAL-paracetamol, combinations with psycholeptics  175', '19-TRIAL- 34', 5178),
(5179, '196-TRIAL- 82', '44-TRIAL-phenacetin, combinations with psycholeptics  109', '248-TRIAL- 292', 5179),
(5180, '21-TRIAL- 224', '40-TRIAL-bucetin, combinations with psycholeptics  81', '129-TRIAL- 297', 5180),
(5181, '290-TRIAL-N02BF  271', '100-TRIAL-Gabapentinoids 131', '292-TRIAL- 82', 5181),
(5182, '104-TRIAL- 121', '251-TRIAL-gabapentin  200', '207-TRIAL- 236', 5182),
(5183, '292-TRIAL- 179', '95-TRIAL-pregabalin  287', '204-TRIAL- 217', 5183),
(5184, '291-TRIAL- 26', '57-TRIAL-mirogabalin  2', '275-TRIAL- 70', 5184),
(5185, '191-TRIAL-N02BG  80', '189-TRIAL-Other analgesics and antipyretics 17', '26-TRIAL- 239', 5185),
(5186, '216-TRIAL- 260', '262-TRIAL-rimazolium  22', '213-TRIAL- 193', 5186),
(5187, '76-TRIAL- 106', '96-TRIAL-glafenine  50', '39-TRIAL- 157', 5187),
(5188, '97-TRIAL- 31', '287-TRIAL-floctafenine  290', '72-TRIAL- 299', 5188),
(5189, '145-TRIAL- 283', '218-TRIAL-viminol  164', '183-TRIAL- 255', 5189),
(5190, '10-TRIAL- 153', '233-TRIAL-nefopam  153', '119-TRIAL- 27', 5190),
(5191, '260-TRIAL- 133', '122-TRIAL-flupirtine  136', '102-TRIAL- 165', 5191),
(5192, '61-TRIAL- 84', '51-TRIAL-ziconotide  190', '285-TRIAL- 252', 5192),
(5193, '14-TRIAL- 61', '113-TRIAL-methoxyflurane  224', '70-TRIAL- 184', 5193),
(5194, '37-TRIAL- 107', '275-TRIAL-cannabinoids  278', '86-TRIAL- 218', 5194),
(5195, '84-TRIAL- 145', '218-TRIAL-tanezumab  109', '11-TRIAL- 197', 5195),
(5196, '114-TRIAL-N02C  145', '107-TRIAL-ANTIMIGRAINE PREPARATIONS 29', '294-TRIAL- 267', 5196),
(5197, '32-TRIAL-N02CA  25', '158-TRIAL-Ergot alkaloids 199', '292-TRIAL- 92', 5197),
(5198, '158-TRIAL- 24', '144-TRIAL-dihydroergotamine  139', '263-TRIAL- 107', 5198),
(5199, '58-TRIAL- 29', '107-TRIAL- 55', '62-TRIAL- 184', NULL),
(5200, '129-TRIAL- 36', '75-TRIAL- 16', '39-TRIAL- 47', NULL),
(5201, '152-TRIAL- 179', '64-TRIAL-ergotamine  196', '106-TRIAL- 133', 5201),
(5202, '253-TRIAL- 57', '103-TRIAL- 12', '298-TRIAL- 71', NULL),
(5203, '291-TRIAL- 267', '173-TRIAL- 122', '122-TRIAL- 166', NULL),
(5204, '14-TRIAL- 113', '150-TRIAL- 162', '269-TRIAL- 38', NULL),
(5205, '171-TRIAL- 202', '140-TRIAL- 7', '284-TRIAL- 205', NULL),
(5206, '113-TRIAL- 34', '216-TRIAL-methysergide  50', '39-TRIAL- 251', 5206),
(5207, '77-TRIAL- 12', '52-TRIAL-lisuride  99', '91-TRIAL- 252', 5207),
(5208, '134-TRIAL- 207', '48-TRIAL-dihydroergotamine, combinations  139', '20-TRIAL- 89', 5208),
(5209, '71-TRIAL- 0', '16-TRIAL-ergotamine, combinations excl. psycholeptics  246', '19-TRIAL- 213', 5209),
(5210, '14-TRIAL- 281', '293-TRIAL-ergotamine, combinations with psycholeptics  149', '27-TRIAL- 91', 5210),
(5211, '120-TRIAL-N02CB  82', '219-TRIAL-Corticosteroid derivatives 127', '223-TRIAL- 144', 5211),
(5212, '268-TRIAL- 152', '117-TRIAL-flumedroxone  166', '217-TRIAL- 113', 5212),
(5213, '137-TRIAL-N02CC  183', '34-TRIAL-Selective serotonin (5HT1) agonists 224', '276-TRIAL- 92', 5213),
(5214, '32-TRIAL- 30', '207-TRIAL-sumatriptan  216', '171-TRIAL- 53', 5214),
(5215, '183-TRIAL- 119', '265-TRIAL- 28', '280-TRIAL- 123', NULL),
(5216, '222-TRIAL- 91', '166-TRIAL- 184', '138-TRIAL- 42', NULL),
(5217, '286-TRIAL- 40', '167-TRIAL- 147', '200-TRIAL- 159', NULL),
(5218, '240-TRIAL- 38', '240-TRIAL-naratriptan  131', '153-TRIAL- 277', 5218),
(5219, '66-TRIAL- 281', '240-TRIAL-zolmitriptan  104', '210-TRIAL- 270', 5219),
(5220, '172-TRIAL- 155', '144-TRIAL- 177', '255-TRIAL- 281', NULL),
(5221, '117-TRIAL- 6', '73-TRIAL-rizatriptan  216', '286-TRIAL- 84', 5221),
(5222, '154-TRIAL- 82', '116-TRIAL-almotriptan  270', '100-TRIAL- 97', 5222),
(5223, '117-TRIAL- 23', '23-TRIAL-eletriptan  239', '96-TRIAL- 198', 5223),
(5224, '137-TRIAL- 231', '55-TRIAL-frovatriptan  24', '214-TRIAL- 228', 5224),
(5225, '221-TRIAL- 298', '262-TRIAL-lasmiditan  211', '74-TRIAL- 17', 5225),
(5226, '48-TRIAL-N02CD  139', '43-TRIAL-Calcitonin gene-related peptide (CGRP) antagonists 125', '283-TRIAL- 217', 5226),
(5227, '89-TRIAL- 12', '155-TRIAL-erenumab  144', '50-TRIAL- 246', 5227),
(5228, '123-TRIAL- 130', '161-TRIAL-galcanezumab  190', '296-TRIAL- 207', 5228),
(5229, '230-TRIAL- 174', '248-TRIAL-fremanezumab  54', '254-TRIAL- 140', 5229),
(5230, '92-TRIAL- 278', '171-TRIAL-ubrogepant  256', '271-TRIAL- 190', 5230),
(5231, '295-TRIAL- 69', '280-TRIAL-eptinezumab  48', '198-TRIAL- 28', 5231),
(5232, '241-TRIAL- 251', '58-TRIAL-rimegepant  70', '233-TRIAL- 15', 5232),
(5233, '187-TRIAL- 196', '107-TRIAL-clonidine  285', '278-TRIAL- 88', 5233),
(5234, '265-TRIAL- 255', '124-TRIAL-atogepant  62', '199-TRIAL- 225', 5234),
(5235, '255-TRIAL-N02CX  78', '151-TRIAL-Other antimigraine preparations 117', '261-TRIAL- 112', 5235),
(5236, '181-TRIAL- 136', '73-TRIAL-pizotifen  163', '291-TRIAL- 21', 5236),
(5237, '214-TRIAL- 106', '23-TRIAL-iprazochrome  249', '93-TRIAL- 293', 5237),
(5238, '180-TRIAL- 4', '187-TRIAL-dimetotiazine  32', '81-TRIAL- 175', 5238),
(5239, '87-TRIAL- 145', '4-TRIAL-oxetorone  286', '229-TRIAL- 246', 5239),
(5240, '62-TRIAL-N03A 129', '294-TRIAL- ANTIEPILEPTICS 52', '203-TRIAL- 101', 5240),
(5241, '46-TRIAL-N03AA 186', '297-TRIAL- Barbiturates and derivatives 128', '52-TRIAL- 193', 5240),
(5242, '20-TRIAL- 221', '184-TRIAL-methylphenobarbital  205', '257-TRIAL- 16', 5242),
(5243, '3-TRIAL-N03AA02  108', '291-TRIAL-phenobarbital  214', '170-TRIAL- 46', 5243),
(5244, '190-TRIAL- 88', '124-TRIAL- 289', '121-TRIAL- 29', NULL),
(5245, '182-TRIAL- 194', '25-TRIAL-primidone  57', '188-TRIAL- 243', 5245),
(5246, '128-TRIAL- 111', '278-TRIAL-barbexaclone  210', '275-TRIAL- 159', 5246),
(5247, '18-TRIAL- 218', '48-TRIAL-metharbital  105', '99-TRIAL- 16', 5247),
(5248, '227-TRIAL- 100', '7-TRIAL-ethotoin  149', '3-TRIAL- 2', 5248),
(5249, '89-TRIAL-N03AB 146', '131-TRIAL- Hydantoin derivatives 46', '30-TRIAL- 112', 5240),
(5250, '298-TRIAL- 236', '289-TRIAL-phenytoin  122', '296-TRIAL- 78', 5250),
(5251, '96-TRIAL- 167', '146-TRIAL- 83', '205-TRIAL- 36', NULL),
(5252, '23-TRIAL- 92', '105-TRIAL-mephenytoin  98', '55-TRIAL- 220', 5252),
(5253, '140-TRIAL- 47', '232-TRIAL-amino(diphenylhydantoin) valeric acid  252', '137-TRIAL- 111', 5253),
(5254, '184-TRIAL- 183', '55-TRIAL-fosphenytoin  225', '227-TRIAL- 288', 5254),
(5255, '196-TRIAL- 207', '118-TRIAL-phenytoin, combinations  214', '45-TRIAL- 298', 5255),
(5256, '202-TRIAL- 295', '87-TRIAL-mephenytoin, combinations  69', '244-TRIAL- 144', 5256),
(5257, '136-TRIAL-N03AC  128', '137-TRIAL-Oxazolidine derivatives 264', '92-TRIAL- 256', 5257),
(5258, '293-TRIAL- 39', '154-TRIAL-trimethadione  122', '130-TRIAL- 0', 5258),
(5259, '170-TRIAL- 22', '174-TRIAL-ethosuximide  199', '273-TRIAL- 253', 5259),
(5260, '149-TRIAL-N03AD 88', '255-TRIAL- Succinimide derivatives 296', '132-TRIAL- 132', 5240),
(5261, '211-TRIAL- 34', '60-TRIAL-ethadione  193', '11-TRIAL- 291', 5261),
(5262, '247-TRIAL- 15', '142-TRIAL-phensuximide  267', '32-TRIAL- 254', 5262),
(5263, '36-TRIAL- 250', '18-TRIAL-paramethadione  289', '13-TRIAL- 213', 5263),
(5264, '259-TRIAL- 14', '60-TRIAL-mesuximide  78', '117-TRIAL- 211', 5264),
(5265, '109-TRIAL- 187', '188-TRIAL-ethosuximide, combinations  27', '17-TRIAL- 137', 5265),
(5266, '265-TRIAL-N03AE  145', '273-TRIAL-Benzodiazepine derivatives 194', '70-TRIAL- 191', 5266),
(5267, '162-TRIAL- 147', '115-TRIAL-clonazepam  236', '87-TRIAL- 283', 5267),
(5268, '45-TRIAL-N03AF  115', '268-TRIAL-Carboxamide derivatives 103', '217-TRIAL- 255', 5268),
(5269, '117-TRIAL- 141', '148-TRIAL-carbamazepine  231', '110-TRIAL- 3', 5269),
(5270, '88-TRIAL- 209', '129-TRIAL- 132', '57-TRIAL- 160', NULL),
(5271, '240-TRIAL- 184', '141-TRIAL-oxcarbazepine  70', '114-TRIAL- 58', 5271),
(5272, '152-TRIAL- 187', '112-TRIAL-rufinamide  275', '148-TRIAL- 173', 5272),
(5273, '64-TRIAL- 90', '96-TRIAL-eslicarbazepine  206', '168-TRIAL- 103', 5273),
(5274, '188-TRIAL-N03AG 81', '31-TRIAL- Fatty acid derivatives 76', '244-TRIAL- 206', 5240),
(5275, '225-TRIAL- 57', '41-TRIAL-valproic acid  169', '89-TRIAL- 174', 5275),
(5276, '20-TRIAL- 19', '60-TRIAL- 259', '24-TRIAL- 242', NULL),
(5277, '43-TRIAL- 255', '82-TRIAL- 246', '211-TRIAL- 121', NULL),
(5278, '210-TRIAL- 17', '228-TRIAL-valpromide  46', '261-TRIAL- 296', 5278),
(5279, '128-TRIAL- 203', '125-TRIAL-aminobutyric acid  34', '146-TRIAL- 203', 5279),
(5280, '117-TRIAL- 57', '99-TRIAL- 232', '158-TRIAL- 94', NULL),
(5281, '39-TRIAL- 183', '129-TRIAL-vigabatrin  210', '87-TRIAL- 48', 5281),
(5282, '177-TRIAL- 58', '98-TRIAL-progabide  59', '119-TRIAL- 282', 5282),
(5283, '53-TRIAL- 223', '272-TRIAL-tiagabine  282', '63-TRIAL- 197', 5283),
(5284, '200-TRIAL-N03AX  25', '149-TRIAL-Other antiepileptics 289', '197-TRIAL- 139', 5284),
(5285, '278-TRIAL- 227', '117-TRIAL-sultiame  184', '231-TRIAL- 48', 5285),
(5286, '227-TRIAL- 277', '261-TRIAL-phenacemide  10', '87-TRIAL- 75', 5286),
(5287, '215-TRIAL- 105', '169-TRIAL-lamotrigine  6', '214-TRIAL- 231', 5287),
(5288, '12-TRIAL- 11', '145-TRIAL-felbamate  255', '76-TRIAL- 273', 5288),
(5289, '278-TRIAL- 134', '96-TRIAL-topiramate  240', '110-TRIAL- 146', 5289),
(5290, '40-TRIAL- 175', '144-TRIAL-pheneturide  94', '85-TRIAL- 56', 5290),
(5291, '265-TRIAL- 297', '10-TRIAL-levetiracetam  2', '130-TRIAL- 186', 5291),
(5292, '288-TRIAL- 98', '11-TRIAL- 45', '209-TRIAL- 261', NULL),
(5293, '283-TRIAL- 180', '225-TRIAL-zonisamide  124', '140-TRIAL- 220', 5293),
(5294, '96-TRIAL- 17', '212-TRIAL-stiripentol  264', '114-TRIAL- 298', 5294),
(5295, '72-TRIAL- 258', '93-TRIAL-lacosamide  183', '83-TRIAL- 174', 5295),
(5296, '17-TRIAL- 21', '94-TRIAL- 100', '166-TRIAL- 40', NULL),
(5297, '83-TRIAL- 29', '174-TRIAL-carisbamate  8', '56-TRIAL- 20', 5297),
(5298, '298-TRIAL- 223', '30-TRIAL-retigabine  196', '246-TRIAL- 54', 5298),
(5299, '197-TRIAL- 58', '181-TRIAL-perampanel  35', '33-TRIAL- 13', 5299),
(5300, '110-TRIAL- 94', '233-TRIAL-brivaracetam  10', '102-TRIAL- 258', 5300),
(5301, '267-TRIAL- 13', '257-TRIAL- 94', '117-TRIAL- 175', NULL),
(7302, '48-TRIAL- 146', '176-TRIAL-indium (111In) satumomab pendetide  98', '21-TRIAL- 285', 7302),
(7303, '236-TRIAL- 292', '43-TRIAL-indium (111In) antiovariumcarcinoma antibody  294', '140-TRIAL- 206', 7303),
(7304, '242-TRIAL- 158', '256-TRIAL-indium (111In) capromab pendetide  252', '19-TRIAL- 243', 7304),
(7305, '109-TRIAL-V09IX  154', '295-TRIAL-Other diagnostic radiopharmaceuticals for tumour detection 105', '288-TRIAL- 45', 7305),
(7306, '195-TRIAL- 295', '76-TRIAL-iobenguane (123I)  282', '166-TRIAL- 76', 7306),
(7307, '291-TRIAL- 153', '161-TRIAL-iobenguane (131I)  133', '221-TRIAL- 19', 7307),
(7308, '175-TRIAL- 129', '2-TRIAL-iodine (125I) CC49-monoclonal antibody  197', '217-TRIAL- 240', 7308),
(7309, '129-TRIAL- 242', '172-TRIAL-fludeoxyglucose (18F)  144', '57-TRIAL- 86', 7309),
(7310, '195-TRIAL- 106', '211-TRIAL-fluorodopa (18F)  145', '146-TRIAL- 135', 7310),
(7311, '184-TRIAL- 23', '243-TRIAL-sodium fluoride (18F)  178', '280-TRIAL- 149', 7311),
(7312, '275-TRIAL- 289', '186-TRIAL-fluorocholine(18F)  105', '24-TRIAL- 294', 7312),
(7313, '258-TRIAL- 297', '194-TRIAL-fluoroethylcholine (18F)  104', '29-TRIAL- 121', 7313),
(7314, '6-TRIAL-V09IX09  157', '88-TRIAL-gallium (68Ga) edotreotide  254', '2-TRIAL- 291', 7314),
(7315, '40-TRIAL- 122', '99-TRIAL-fluoroethyl-L-tyrosine (18F)  194', '24-TRIAL- 97', 7315),
(7316, '95-TRIAL- 96', '91-TRIAL-fluoroestradiol (18F)  60', '99-TRIAL- 252', 7316),
(7317, '200-TRIAL- 237', '192-TRIAL-fluciclovine (18F)  235', '127-TRIAL- 194', 7317),
(7318, '79-TRIAL- 248', '182-TRIAL-methionine (11C)  70', '255-TRIAL- 101', 7318),
(7319, '172-TRIAL- 221', '70-TRIAL-gallium (68Ga) gozetotide  162', '264-TRIAL- 54', 7319),
(7320, '252-TRIAL- 126', '9-TRIAL-copper (64Cu) dotatate  98', '195-TRIAL- 176', 7320),
(7321, '9-TRIAL-V09IX16  156', '62-TRIAL-piflufolastat (18F)  48', '156-TRIAL- 212', 7321),
(7322, '189-TRIAL- 129', '2-TRIAL-PSMA-1007 (18F)  184', '229-TRIAL- 229', 7322),
(7323, '159-TRIAL-V09X  80', '212-TRIAL-OTHER DIAGNOSTIC RADIOPHARMACEUTICALS 107', '185-TRIAL- 24', 7323),
(7324, '158-TRIAL-V09XA  185', '99-TRIAL-Iodine (131I) compounds 16', '237-TRIAL- 291', 7324),
(7325, '234-TRIAL- 270', '30-TRIAL-iodine (131I) norcholesterol  86', '17-TRIAL- 60', 7325),
(7326, '21-TRIAL- 7', '253-TRIAL-iodocholesterol (131I)  216', '123-TRIAL- 290', 7326),
(7327, '100-TRIAL- 132', '42-TRIAL-iodine (131I) human albumin  11', '9-TRIAL- 107', 7327),
(7328, '21-TRIAL-V09XX  160', '69-TRIAL-Various diagnostic radiopharmaceuticals 219', '73-TRIAL- 41', 7328),
(7329, '184-TRIAL- 29', '187-TRIAL-cobalt (57Co) cyanocobalamine  223', '123-TRIAL- 25', 7329),
(7330, '238-TRIAL- 239', '168-TRIAL-cobalt (58Co) cyanocobalamine  247', '127-TRIAL- 82', 7330),
(7331, '91-TRIAL- 178', '176-TRIAL-selenium (75Se) norcholesterol  136', '172-TRIAL- 255', 7331),
(7332, '74-TRIAL- 230', '61-TRIAL-ferric (59Fe) citrate  238', '126-TRIAL- 151', 7332),
(7333, '173-TRIAL-V10A  11', '289-TRIAL-ANTIINFLAMMATORY AGENTS 60', '125-TRIAL- 103', 7333),
(7334, '119-TRIAL-V10AA  176', '294-TRIAL-Yttrium (90Y) compounds 167', '45-TRIAL- 228', 7334),
(7335, '135-TRIAL- 202', '243-TRIAL-yttrium (90Y) citrate colloid  194', '168-TRIAL- 7', 7335),
(7336, '61-TRIAL-V10 63', '235-TRIAL- THERAPEUTIC RADIOPHARMACEUTICALS 126', '235-TRIAL- 99', 7336),
(7337, '243-TRIAL- 164', '58-TRIAL-yttrium (90Y) ferrihydroxide colloid  49', '218-TRIAL- 151', 7337),
(7338, '213-TRIAL- 168', '143-TRIAL-yttrium (90Y) silicate colloid  210', '206-TRIAL- 64', 7338),
(7339, '107-TRIAL-V10AX  20', '205-TRIAL-Other antiinflammatory therapeutic radiopharmaceuticals 260', '55-TRIAL- 276', 7339),
(7340, '194-TRIAL- 220', '3-TRIAL-phosphorous (32P) chromicphosphate colloid  298', '22-TRIAL- 33', 7340),
(7341, '194-TRIAL- 64', '62-TRIAL-samarium (153Sm) hydroxyapatite colloid  120', '238-TRIAL- 111', 7341),
(7342, '143-TRIAL- 59', '173-TRIAL-dysprosium (165Dy) colloid  118', '49-TRIAL- 71', 7342),
(7343, '195-TRIAL- 219', '6-TRIAL-erbium (169Er) citrate colloid  263', '258-TRIAL- 106', 7343),
(7344, '66-TRIAL- 152', '4-TRIAL-rhenium (186Re) sulfide colloid  291', '229-TRIAL- 2', 7344),
(7345, '272-TRIAL- 135', '240-TRIAL-gold (198Au) colloidal  89', '144-TRIAL- 97', 7345),
(7346, '84-TRIAL-V10BX  56', '268-TRIAL-Various pain palliation radiopharmaceuticals 204', '219-TRIAL- 54', 7346),
(7347, '191-TRIAL-V10B 101', '144-TRIAL- PAIN PALLIATION (BONE SEEKING AGENTS) 169', '294-TRIAL- 143', 7336),
(7348, '229-TRIAL- 123', '165-TRIAL-strontium (89Sr) chloride  195', '83-TRIAL- 71', 7348),
(7349, '22-TRIAL- 77', '281-TRIAL-samarium (153Sm) lexidronam  109', '51-TRIAL- 270', 7349),
(7350, '221-TRIAL- 134', '40-TRIAL-rhenium (186Re) etidronic acid  244', '16-TRIAL- 270', 7350),
(7351, '212-TRIAL-V10XA  179', '240-TRIAL-Iodine (131I) compounds 154', '208-TRIAL- 269', 7351),
(7352, '203-TRIAL-V10X 68', '38-TRIAL- OTHER THERAPEUTIC RADIOPHARMACEUTICALS 0', '154-TRIAL- 172', 7336),
(7353, '102-TRIAL- 42', '175-TRIAL-sodium iodide (131I)  246', '71-TRIAL- 189', 7353),
(7354, '158-TRIAL- 274', '68-TRIAL-iobenguane (131I)  25', '85-TRIAL- 95', 7354),
(7355, '228-TRIAL- 43', '282-TRIAL-iodine (131I) omburtamab  243', '155-TRIAL- 283', 7355),
(7356, '206-TRIAL- 137', '182-TRIAL-tositumomab/iodine (131I) tositumomab  160', '72-TRIAL- 276', 7356),
(7357, '194-TRIAL-V10XX  246', '8-TRIAL-Various therapeutic radiopharmaceuticals 279', '95-TRIAL- 44', 7357),
(7358, '60-TRIAL- 101', '154-TRIAL-sodium phosphate (32P)  271', '178-TRIAL- 80', 7358),
(7359, '241-TRIAL- 87', '112-TRIAL-ibritumomab tiuxetan (90Y)  152', '55-TRIAL- 160', 7359),
(7360, '296-TRIAL- 277', '260-TRIAL-radium (223Ra) dichloride  92', '184-TRIAL- 109', 7360),
(7361, '101-TRIAL- 80', '13-TRIAL-lutetium (177Lu) oxodotreotide  71', '299-TRIAL- 220', 7361),
(7362, '262-TRIAL- 29', '196-TRIAL-lutetium (177Lu) vipivotide tetraxetan  106', '80-TRIAL- 171', 7362),
(7363, '95-TRIAL-V20  133', '120-TRIAL-SURGICAL DRESSINGS 248', '169-TRIAL- 234', 7363);

--
-- Triggers `atc_code`
--
DELIMITER $$
CREATE TRIGGER `a_d_ATC_Code` AFTER DELETE ON `atc_code` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ATC_Code';						SET @pk_d = CONCAT('<ATC_ID>',OLD.`ATC_ID`,'</ATC_ID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_ATC_Code` AFTER INSERT ON `atc_code` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'ATC_Code'; 						SET @pk_d = CONCAT('<ATC_ID>',NEW.`ATC_ID`,'</ATC_ID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_ATC_Code` AFTER UPDATE ON `atc_code` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ATC_Code';						SET @pk_d_old = CONCAT('<ATC_ID>',OLD.`ATC_ID`,'</ATC_ID>');						SET @pk_d = CONCAT('<ATC_ID>',NEW.`ATC_ID`,'</ATC_ID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `audittrail`
--

CREATE TABLE `audittrail` (
  `AuditTrailId` int(11) NOT NULL,
  `TableName` varchar(100) DEFAULT NULL,
  `RecordId` int(11) DEFAULT NULL,
  `Operation` varchar(50) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `OldValue` longtext DEFAULT NULL,
  `NewValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `audittrail`
--
DELIMITER $$
CREATE TRIGGER `a_d_AuditTrail` AFTER DELETE ON `audittrail` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'AuditTrail';						SET @pk_d = CONCAT('<AuditTrailId>',OLD.`AuditTrailId`,'</AuditTrailId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_AuditTrail` AFTER INSERT ON `audittrail` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'AuditTrail'; 						SET @pk_d = CONCAT('<AuditTrailId>',NEW.`AuditTrailId`,'</AuditTrailId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_AuditTrail` AFTER UPDATE ON `audittrail` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'AuditTrail';						SET @pk_d_old = CONCAT('<AuditTrailId>',OLD.`AuditTrailId`,'</AuditTrailId>');						SET @pk_d = CONCAT('<AuditTrailId>',NEW.`AuditTrailId`,'</AuditTrailId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `batchlottracking`
--

CREATE TABLE `batchlottracking` (
  `BatchLotId` int(11) NOT NULL,
  `DrugId` int(11) DEFAULT NULL,
  `BatchNumber` varchar(50) NOT NULL,
  `ProductionDate` date NOT NULL,
  `ExpiryDate` date NOT NULL,
  `Quantity` int(11) NOT NULL,
  `DonationId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `batchlottracking`
--

INSERT INTO `batchlottracking` (`BatchLotId`, `DrugId`, `BatchNumber`, `ProductionDate`, `ExpiryDate`, `Quantity`, `DonationId`) VALUES
(1, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(2, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(3, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(4, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(5, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(6, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(7, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(8, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(9, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(10, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(11, NULL, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(12, 1003, '1234', '2024-03-19', '2024-12-31', 45, NULL),
(13, 1007, '1197', '2025-06-12', '2025-06-12', 222, 23);

--
-- Triggers `batchlottracking`
--
DELIMITER $$
CREATE TRIGGER `a_d_BatchLotTracking` AFTER DELETE ON `batchlottracking` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'BatchLotTracking';						SET @pk_d = CONCAT('<BatchLotId>',OLD.`BatchLotId`,'</BatchLotId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_BatchLotTracking` AFTER INSERT ON `batchlottracking` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'BatchLotTracking'; 						SET @pk_d = CONCAT('<BatchLotId>',NEW.`BatchLotId`,'</BatchLotId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_BatchLotTracking` AFTER UPDATE ON `batchlottracking` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'BatchLotTracking';						SET @pk_d_old = CONCAT('<BatchLotId>',OLD.`BatchLotId`,'</BatchLotId>');						SET @pk_d = CONCAT('<BatchLotId>',NEW.`BatchLotId`,'</BatchLotId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `batchserialnumber`
--

CREATE TABLE `batchserialnumber` (
  `BatchSerialNumberId` int(11) NOT NULL,
  `BatchId` int(11) DEFAULT NULL,
  `SerialNumber` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `batchserialnumber`
--
DELIMITER $$
CREATE TRIGGER `a_d_BatchSerialNumber` AFTER DELETE ON `batchserialnumber` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'BatchSerialNumber';						SET @pk_d = CONCAT('<BatchSerialNumberId>',OLD.`BatchSerialNumberId`,'</BatchSerialNumberId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_BatchSerialNumber` AFTER INSERT ON `batchserialnumber` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'BatchSerialNumber'; 						SET @pk_d = CONCAT('<BatchSerialNumberId>',NEW.`BatchSerialNumberId`,'</BatchSerialNumberId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_BatchSerialNumber` AFTER UPDATE ON `batchserialnumber` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'BatchSerialNumber';						SET @pk_d_old = CONCAT('<BatchSerialNumberId>',OLD.`BatchSerialNumberId`,'</BatchSerialNumberId>');						SET @pk_d = CONCAT('<BatchSerialNumberId>',NEW.`BatchSerialNumberId`,'</BatchSerialNumberId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `BrandId` int(11) NOT NULL,
  `BrandName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `brands`
--
DELIMITER $$
CREATE TRIGGER `a_d_Brands` AFTER DELETE ON `brands` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Brands';						SET @pk_d = CONCAT('<BrandId>',OLD.`BrandId`,'</BrandId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Brands` AFTER INSERT ON `brands` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Brands'; 						SET @pk_d = CONCAT('<BrandId>',NEW.`BrandId`,'</BrandId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Brands` AFTER UPDATE ON `brands` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Brands';						SET @pk_d_old = CONCAT('<BrandId>',OLD.`BrandId`,'</BrandId>');						SET @pk_d = CONCAT('<BrandId>',NEW.`BrandId`,'</BrandId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `categorypricing`
--

CREATE TABLE `categorypricing` (
  `OperationId` int(11) DEFAULT NULL,
  `CategoryType` varchar(10) DEFAULT NULL,
  `isPrivate` tinyint(1) DEFAULT NULL,
  `FirstProcedurePrice` int(11) DEFAULT NULL,
  `FirstSurgeon` int(11) DEFAULT NULL,
  `FirstAnesthist` int(11) DEFAULT NULL,
  `FirstConsultant` int(11) DEFAULT NULL,
  `SecondProcedurePrice` int(11) DEFAULT NULL,
  `SecondSurgeon` int(11) DEFAULT NULL,
  `SecondAnesthist` int(11) DEFAULT NULL,
  `SecondConsultant` int(11) DEFAULT NULL,
  `TotalAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `categorypricing`
--

INSERT INTO `categorypricing` (`OperationId`, `CategoryType`, `isPrivate`, `FirstProcedurePrice`, `FirstSurgeon`, `FirstAnesthist`, `FirstConsultant`, `SecondProcedurePrice`, `SecondSurgeon`, `SecondAnesthist`, `SecondConsultant`, `TotalAmount`) VALUES
(1, 'First', 0, 100, 200, 300, 400, 500, 600, 700, 800, 900),
(2, 'second', 1, 110, 210, 310, 410, 510, 610, 710, 810, 910),
(1, 'First', 0, 100, 200, 300, 400, 500, 600, 700, 800, 900),
(2, 'second', 1, 110, 210, 310, 410, 510, 610, 710, 810, 910),
(1, 'First', 1, 200, 250, 400, 100, 299, 300, 400, 400, 2500),
(2, 'A', 0, 200, 400, 300, 200, 500, 600, 800, 900, 6000);

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `CityId` int(11) NOT NULL,
  `DistrictId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `cities`
--
DELIMITER $$
CREATE TRIGGER `a_d_Cities` AFTER DELETE ON `cities` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Cities';						SET @pk_d = CONCAT('<CityId>',OLD.`CityId`,'</CityId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Cities` AFTER INSERT ON `cities` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Cities'; 						SET @pk_d = CONCAT('<CityId>',NEW.`CityId`,'</CityId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Cities` AFTER UPDATE ON `cities` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Cities';						SET @pk_d_old = CONCAT('<CityId>',OLD.`CityId`,'</CityId>');						SET @pk_d = CONCAT('<CityId>',NEW.`CityId`,'</CityId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `containertype`
--

CREATE TABLE `containertype` (
  `ContainerTypeId` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `TypeNameAr` varchar(100) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `UpdatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `containertype`
--
DELIMITER $$
CREATE TRIGGER `a_d_ContainerType` AFTER DELETE ON `containertype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ContainerType';						SET @pk_d = CONCAT('<ContainerTypeId>',OLD.`ContainerTypeId`,'</ContainerTypeId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_ContainerType` AFTER INSERT ON `containertype` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'ContainerType'; 						SET @pk_d = CONCAT('<ContainerTypeId>',NEW.`ContainerTypeId`,'</ContainerTypeId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_ContainerType` AFTER UPDATE ON `containertype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ContainerType';						SET @pk_d_old = CONCAT('<ContainerTypeId>',OLD.`ContainerTypeId`,'</ContainerTypeId>');						SET @pk_d = CONCAT('<ContainerTypeId>',NEW.`ContainerTypeId`,'</ContainerTypeId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `CountryId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`CountryId`, `Name`, `NameAr`, `Enabled`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Belgium', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(2, 'France', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(3, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(4, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(5, 'Egypt', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(6, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(7, 'France', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(8, 'Italy', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(9, 'USA', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(10, 'Saudi Arabia', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(11, 'Canada', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(12, 'Italy', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(13, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(14, 'UK', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(15, 'UK', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(16, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(17, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(18, 'Argentine', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(19, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(20, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(21, 'Egypt', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(22, 'Egypt', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(23, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(24, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(25, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(26, 'Greece', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(27, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(28, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(29, 'Cyprus', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(30, 'United Arab Emirates', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(31, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(32, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(33, 'Greece', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(34, 'Tunisia', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(35, 'India', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(36, 'Greece', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(37, 'Lebanon', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(38, 'Saudi Arabia', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(39, 'Portugal', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(40, 'Slovenia', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(41, 'Saudi Arabia', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(42, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(43, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(44, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(45, 'Portugal', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(46, 'Spain', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(47, 'France', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(48, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(49, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(50, 'Jordan', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(51, 'India', NULL, 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(52, '41-TRIAL-Saudi Arabia 167', '34-TRIAL- 100', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(53, '269-TRIAL-Sweden 124', '78-TRIAL- 258', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(54, '262-TRIAL-Japan 164', '5-TRIAL- 245', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(55, '181-TRIAL-Argentine 27', '61-TRIAL- 191', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(56, '295-TRIAL-Lebanon 242', '27-TRIAL- 36', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(57, '291-TRIAL-Spain 204', '2-TRIAL- 153', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(58, '292-TRIAL-India 82', '21-TRIAL- 116', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(59, '218-TRIAL-Canada 95', '47-TRIAL- 126', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(60, '71-TRIAL-France 138', '69-TRIAL- 112', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(61, '167-TRIAL-Lebanon 199', '235-TRIAL- 294', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(62, '203-TRIAL-Spain 111', '122-TRIAL- 33', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(63, '273-TRIAL-Jordan 164', '141-TRIAL- 211', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(64, '53-TRIAL-Italy 268', '47-TRIAL- 44', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(65, '262-TRIAL-Germany 57', '237-TRIAL- 259', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(66, '23-TRIAL-India 141', '229-TRIAL- 178', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(67, '16-TRIAL-Egypt 35', '290-TRIAL- 42', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(68, '288-TRIAL-Canada 106', '40-TRIAL- 242', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(69, '64-TRIAL-Italy 148', '146-TRIAL- 105', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(70, '290-TRIAL-UK 129', '70-TRIAL- 50', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(71, '6-TRIAL-UK 201', '93-TRIAL- 248', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(72, '129-TRIAL-Italy 23', '84-TRIAL- 154', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(73, '156-TRIAL-Lebanon 140', '166-TRIAL- 176', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(74, '131-TRIAL-Italy 208', '144-TRIAL- 39', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(75, '26-TRIAL-Canada 223', '137-TRIAL- 238', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(76, '218-TRIAL-Germany 282', '129-TRIAL- 41', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(77, '33-TRIAL-Turkey 215', '139-TRIAL- 258', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(78, '204-TRIAL-Egypt 30', '177-TRIAL- 206', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(79, '173-TRIAL-Switzerland 186', '221-TRIAL- 245', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(80, '224-TRIAL-UK 172', '270-TRIAL- 129', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(81, '77-TRIAL-France 273', '297-TRIAL- 12', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(82, '286-TRIAL-France 90', '161-TRIAL- 36', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(83, '155-TRIAL-Tunisia 167', '255-TRIAL- 274', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(84, '131-TRIAL-Canada 52', '50-TRIAL- 250', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(85, '141-TRIAL-France 124', '166-TRIAL- 130', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(86, '207-TRIAL-Lebanon 191', '7-TRIAL- 237', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(87, '157-TRIAL-France 287', '153-TRIAL- 183', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(88, '245-TRIAL-Italy 209', '109-TRIAL- 158', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(89, '221-TRIAL-France 288', '122-TRIAL- 46', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(90, '206-TRIAL-France 130', '213-TRIAL- 68', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(91, '0-TRIAL-Poland 191', '162-TRIAL- 155', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(92, '10-TRIAL-Poland 59', '24-TRIAL- 137', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(93, '248-TRIAL-France 183', '295-TRIAL- 141', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(94, '2-TRIAL-Japan 50', '91-TRIAL- 236', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(95, '74-TRIAL-France 220', '96-TRIAL- 21', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(96, '48-TRIAL-Cyprus 99', '168-TRIAL- 184', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(97, '181-TRIAL-India 234', '53-TRIAL- 199', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(98, '18-TRIAL-Portugal 38', '0-TRIAL- 188', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(99, '127-TRIAL-Poland 167', '128-TRIAL- 193', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(100, '48-TRIAL-Lebanon 283', '107-TRIAL- 21', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(101, '210-TRIAL-Lebanon 17', '13-TRIAL- 214', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(102, '209-TRIAL-Lebanon 116', '35-TRIAL- 51', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(103, '200-TRIAL-Spain 149', '19-TRIAL- 56', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(104, '298-TRIAL-Greece 3', '224-TRIAL- 208', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(105, '144-TRIAL-Portugal 209', '289-TRIAL- 2', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(106, '195-TRIAL-Portugal 85', '93-TRIAL- 243', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(107, '223-TRIAL-India 87', '214-TRIAL- 203', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(108, '248-TRIAL-Greece 0', '258-TRIAL- 18', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(109, '180-TRIAL-Lebanon 296', '98-TRIAL- 281', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(110, '89-TRIAL-Spain 98', '109-TRIAL- 157', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(111, '72-TRIAL-Italy 222', '238-TRIAL- 292', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(112, '38-TRIAL-Germany 179', '190-TRIAL- 257', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(113, '158-TRIAL-France 191', '15-TRIAL- 88', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(114, '256-TRIAL-Germany 111', '2-TRIAL- 234', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(115, '272-TRIAL-Ireland 255', '228-TRIAL- 146', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(116, '262-TRIAL-Greece 86', '275-TRIAL- 233', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(117, '169-TRIAL-Germany 42', '144-TRIAL- 216', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(118, '281-TRIAL-UK 198', '122-TRIAL- 51', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(119, '121-TRIAL-Monaco 299', '257-TRIAL- 276', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(120, '292-TRIAL-Germany 89', '275-TRIAL- 212', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(121, '200-TRIAL-Lebanon 110', '3-TRIAL- 169', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(122, '161-TRIAL-Australia 288', '201-TRIAL- 189', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(123, '255-TRIAL-China 223', '202-TRIAL- 85', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(124, '182-TRIAL-Spain 85', '88-TRIAL- 226', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(125, '117-TRIAL-Spain 57', '232-TRIAL- 32', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(126, '269-TRIAL-France 54', '221-TRIAL- 89', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(127, '176-TRIAL-France 129', '268-TRIAL- 192', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(128, '125-TRIAL-The Netherlands 55', '134-TRIAL- 49', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(129, '241-TRIAL-Lebanon 212', '145-TRIAL- 60', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(130, '118-TRIAL-Italy 153', '239-TRIAL- 123', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(131, '79-TRIAL-Italy 196', '187-TRIAL- 229', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(132, '49-TRIAL-The Netherlands 37', '66-TRIAL- 49', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(133, '193-TRIAL-Austria 95', '297-TRIAL- 16', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(134, '86-TRIAL-France 205', '188-TRIAL- 82', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(135, '155-TRIAL-Austria 234', '114-TRIAL- 1', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(136, '116-TRIAL-Lebanon 271', '86-TRIAL- 263', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(137, '113-TRIAL-UK 55', '285-TRIAL- 253', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(138, '12-TRIAL-France 8', '32-TRIAL- 245', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(139, '113-TRIAL-Italy 156', '121-TRIAL- 58', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(140, '246-TRIAL-Germany 82', '181-TRIAL- 244', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(141, '96-TRIAL-Spain 122', '229-TRIAL- 61', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(142, '135-TRIAL-Switzerland 50', '73-TRIAL- 266', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(143, '44-TRIAL-Portugal 59', '192-TRIAL- 39', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(144, '153-TRIAL-Switzerland 224', '54-TRIAL- 110', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(145, '245-TRIAL-France 249', '286-TRIAL- 213', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(146, '274-TRIAL-France 122', '68-TRIAL- 218', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(147, '187-TRIAL-Czech Republic 5', '258-TRIAL- 191', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(148, '2-TRIAL-Germany 25', '77-TRIAL- 214', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(149, '14-TRIAL-Italy 24', '234-TRIAL- 74', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(150, '72-TRIAL-France 59', '133-TRIAL- 170', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(151, '287-TRIAL-France 97', '18-TRIAL- 77', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(152, '73-TRIAL-Germany 170', '263-TRIAL- 268', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(153, '92-TRIAL-USA 185', '102-TRIAL- 80', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(154, '113-TRIAL-Lebanon 127', '2-TRIAL- 199', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(155, '227-TRIAL-Jordan 225', '43-TRIAL- 124', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(156, '223-TRIAL-Egypt 272', '161-TRIAL- 81', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(157, '103-TRIAL-Jordan 132', '105-TRIAL- 293', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(158, '225-TRIAL-Germany 131', '92-TRIAL- 142', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(159, '122-TRIAL-Denmark 86', '164-TRIAL- 100', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(160, '287-TRIAL-France 260', '213-TRIAL- 74', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(161, '170-TRIAL-USA 70', '235-TRIAL- 233', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(162, '211-TRIAL-France 260', '296-TRIAL- 167', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(163, '85-TRIAL-Lebanon 250', '140-TRIAL- 194', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(164, '295-TRIAL-Brazil 24', '119-TRIAL- 25', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(165, '176-TRIAL-Germany 94', '158-TRIAL- 202', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(166, '271-TRIAL-France 266', '178-TRIAL- 93', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(167, '151-TRIAL-Malta 284', '118-TRIAL- 264', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(168, '119-TRIAL-Lebanon 52', '100-TRIAL- 87', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(169, '160-TRIAL-Lebanon 126', '10-TRIAL- 257', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(170, '70-TRIAL-Italy 215', '276-TRIAL- 227', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(171, '43-TRIAL-France 258', '264-TRIAL- 9', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(172, '82-TRIAL-Japan 286', '165-TRIAL- 187', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(173, '177-TRIAL-Puerto Rico 74', '225-TRIAL- 127', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(174, '229-TRIAL-Lebanon 128', '223-TRIAL- 20', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(175, '2-TRIAL-Puerto Rico 262', '123-TRIAL- 296', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(176, '137-TRIAL-Germany 61', '295-TRIAL- 125', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(177, '64-TRIAL-Japan 160', '202-TRIAL- 16', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(178, '230-TRIAL-Jordan 226', '211-TRIAL- 171', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(179, '111-TRIAL-USA 47', '153-TRIAL- 220', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(180, '90-TRIAL-Greece 224', '188-TRIAL- 163', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(181, '140-TRIAL-Germany 151', '62-TRIAL- 29', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(182, '0-TRIAL-Germany 13', '58-TRIAL- 178', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(183, '265-TRIAL-Germany 107', '77-TRIAL- 0', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(184, '258-TRIAL-USA 139', '203-TRIAL- 160', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(185, '157-TRIAL-Belgium 224', '177-TRIAL- 8', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(186, '113-TRIAL-Germany 187', '1-TRIAL- 50', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(187, '60-TRIAL-Jordan 228', '93-TRIAL- 84', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(188, '205-TRIAL-UK 240', '211-TRIAL- 204', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(189, '235-TRIAL-Spain 256', '72-TRIAL- 250', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(190, '223-TRIAL-Ireland 85', '156-TRIAL- 116', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(191, '126-TRIAL-USA 57', '126-TRIAL- 157', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(192, '237-TRIAL-USA 171', '169-TRIAL- 261', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(193, '296-TRIAL-Germany 122', '217-TRIAL- 212', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(194, '117-TRIAL-UK 96', '185-TRIAL- 41', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(195, '123-TRIAL-Switzerland 129', '229-TRIAL- 65', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(196, '259-TRIAL-Germany 232', '96-TRIAL- 155', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(197, '53-TRIAL-Sweden 162', '284-TRIAL- 34', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(198, '54-TRIAL-France 172', '157-TRIAL- 269', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(199, '32-TRIAL-Denmark 263', '207-TRIAL- 83', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(200, '11-TRIAL-Lebanon 235', '167-TRIAL- 48', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(201, '175-TRIAL-Canada 38', '123-TRIAL- 242', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(202, '54-TRIAL-USA 211', '241-TRIAL- 75', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(203, '159-TRIAL-Lebanon 125', '221-TRIAL- 170', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(204, '126-TRIAL-Canada 134', '205-TRIAL- 283', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(205, '150-TRIAL-France 298', '79-TRIAL- 201', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(206, '193-TRIAL-Belgium 134', '137-TRIAL- 134', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(207, '156-TRIAL-Italy 193', '276-TRIAL- 205', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(208, '62-TRIAL-Spain 48', '281-TRIAL- 0', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(209, '13-TRIAL-Lebanon 141', '55-TRIAL- 255', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(210, '242-TRIAL-Austria 62', '11-TRIAL- 277', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(211, '24-TRIAL-Switzerland 278', '252-TRIAL- 143', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(212, '96-TRIAL-Switzerland 73', '140-TRIAL- 13', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(213, '275-TRIAL-Switzerland 272', '218-TRIAL- 10', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(214, '117-TRIAL-Lebanon 232', '212-TRIAL- 95', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(215, '269-TRIAL-France 131', '240-TRIAL- 88', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(216, '185-TRIAL-Saudi Arabia 190', '297-TRIAL- 189', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(217, '190-TRIAL-Canada 145', '153-TRIAL- 114', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(218, '51-TRIAL-France 40', '144-TRIAL- 158', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(219, '35-TRIAL-Canada 59', '92-TRIAL- 105', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(220, '64-TRIAL-Germany 181', '3-TRIAL- 229', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(221, '75-TRIAL-Hungary 208', '192-TRIAL- 297', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(222, '149-TRIAL-Hungary 156', '61-TRIAL- 127', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(223, '167-TRIAL-France 141', '29-TRIAL- 40', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(224, '213-TRIAL-Portugal 74', '201-TRIAL- 77', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(225, '115-TRIAL-Spain 283', '113-TRIAL- 292', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(226, '24-TRIAL-Germany 201', '292-TRIAL- 159', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(227, '270-TRIAL-UK 28', '127-TRIAL- 184', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(228, '175-TRIAL-Ireland 186', '198-TRIAL- 70', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(229, '287-TRIAL-UK 147', '204-TRIAL- 203', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(230, '221-TRIAL-Germany 163', '6-TRIAL- 263', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(231, '10-TRIAL-Germany 271', '189-TRIAL- 240', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(232, '164-TRIAL-Spain 42', '119-TRIAL- 213', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(233, '91-TRIAL-Tunisia 104', '18-TRIAL- 232', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(234, '150-TRIAL-Italy 5', '175-TRIAL- 39', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(235, '3-TRIAL-Italy 22', '98-TRIAL- 147', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(236, '84-TRIAL-Jordan 148', '271-TRIAL- 164', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(237, '113-TRIAL-Lebanon 275', '245-TRIAL- 212', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(238, '146-TRIAL-India 78', '269-TRIAL- 262', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(239, '119-TRIAL-Lebanon 185', '89-TRIAL- 44', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(240, '165-TRIAL-Spain 240', '145-TRIAL- 8', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(241, '118-TRIAL-Argentine 270', '1-TRIAL- 123', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(242, '132-TRIAL-Ireland 172', '152-TRIAL- 187', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(243, '70-TRIAL-USA 63', '201-TRIAL- 3', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(244, '23-TRIAL-Germany 227', '200-TRIAL- 269', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(245, '215-TRIAL-Lebanon 165', '28-TRIAL- 243', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(246, '147-TRIAL-Lebanon 288', '243-TRIAL- 37', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(247, '209-TRIAL-Spain 63', '249-TRIAL- 181', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(248, '88-TRIAL-Germany 242', '8-TRIAL- 260', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(249, '221-TRIAL-Lebanon 258', '254-TRIAL- 188', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(250, '46-TRIAL-Lebanon 90', '149-TRIAL- 243', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(251, '130-TRIAL-France 120', '148-TRIAL- 67', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(252, '36-TRIAL-Sweden 83', '35-TRIAL- 126', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(253, '185-TRIAL-Lebanon 138', '253-TRIAL- 129', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(254, '124-TRIAL-Germany 148', '123-TRIAL- 59', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(255, '157-TRIAL-Austria 166', '144-TRIAL- 255', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(256, '218-TRIAL-Austria 26', '211-TRIAL- 25', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(257, '255-TRIAL-Belgium 101', '49-TRIAL- 196', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(258, '284-TRIAL-Spain 215', '264-TRIAL- 242', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(259, '275-TRIAL-Lebanon 213', '242-TRIAL- 296', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(260, '48-TRIAL-Austria 172', '26-TRIAL- 206', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(261, '73-TRIAL-Spain 129', '4-TRIAL- 105', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(262, '226-TRIAL-Switzerland 112', '175-TRIAL- 93', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(263, '65-TRIAL-Iran 136', '36-TRIAL- 41', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(264, '214-TRIAL-The Netherlands 294', '156-TRIAL- 52', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(265, '236-TRIAL-UK 238', '82-TRIAL- 155', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(266, '15-TRIAL-Japan 231', '230-TRIAL- 141', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(267, '225-TRIAL-Lebanon 211', '237-TRIAL- 286', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(268, '190-TRIAL-Egypt 150', '262-TRIAL- 34', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(269, '93-TRIAL-Belgium 153', '116-TRIAL- 252', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(270, '208-TRIAL-Spain 62', '33-TRIAL- 54', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(271, '103-TRIAL-Switzerland 134', '203-TRIAL- 156', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(272, '148-TRIAL-Austria 24', '17-TRIAL- 13', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(273, '109-TRIAL-Greece 28', '100-TRIAL- 80', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(274, '18-TRIAL-France 58', '50-TRIAL- 155', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(275, '161-TRIAL-Greece 264', '203-TRIAL- 76', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(276, '243-TRIAL-Germany 209', '202-TRIAL- 261', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(277, '289-TRIAL-Switzerland 48', '82-TRIAL- 153', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(278, '74-TRIAL-Switzerland 120', '2-TRIAL- 23', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(279, '231-TRIAL-Portugal 169', '278-TRIAL- 159', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(280, '108-TRIAL-Germany 119', '271-TRIAL- 3', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(281, '45-TRIAL-France 181', '104-TRIAL- 92', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(282, '285-TRIAL-Jordan 113', '98-TRIAL- 189', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(283, '122-TRIAL-Switzerland 238', '137-TRIAL- 110', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(284, '261-TRIAL-Tunisia 234', '208-TRIAL- 61', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(285, '59-TRIAL-Switzerland 193', '15-TRIAL- 69', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(286, '37-TRIAL-Argentine 69', '58-TRIAL- 0', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(287, '171-TRIAL-USA 164', '117-TRIAL- 15', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(288, '255-TRIAL-Lebanon 15', '30-TRIAL- 39', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(289, '212-TRIAL-USA 188', '182-TRIAL- 154', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(290, '185-TRIAL-Italy 10', '184-TRIAL- 174', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(291, '280-TRIAL-France 115', '151-TRIAL- 241', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(292, '115-TRIAL-Switzerland 179', '10-TRIAL- 98', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(293, '273-TRIAL-Germany 188', '277-TRIAL- 132', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(294, '256-TRIAL-Austria 189', '13-TRIAL- 108', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(295, '41-TRIAL-Germany 190', '223-TRIAL- 63', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(296, '28-TRIAL-India 284', '178-TRIAL- 0', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(297, '271-TRIAL-Belgium 85', '74-TRIAL- 171', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(298, '233-TRIAL-Lebanon 67', '53-TRIAL- 195', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(299, '68-TRIAL-Lebanon 125', '76-TRIAL- 29', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(300, '150-TRIAL-Germany 198', '9-TRIAL- 193', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(301, '186-TRIAL-Ireland 80', '216-TRIAL- 249', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(302, '267-TRIAL-Saudi Arabia 28', '279-TRIAL- 64', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(303, '21-TRIAL-Norway 5', '126-TRIAL- 216', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(304, '16-TRIAL-USA 126', '166-TRIAL- 287', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(305, '81-TRIAL-Switzerland 164', '140-TRIAL- 286', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(306, '21-TRIAL-Germany 262', '21-TRIAL- 64', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(307, '209-TRIAL-Italy 15', '202-TRIAL- 173', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(308, '24-TRIAL-Lebanon 241', '45-TRIAL- 262', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(309, '223-TRIAL-Ireland 231', '6-TRIAL- 268', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(310, '18-TRIAL-Germany 202', '107-TRIAL- 7', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(311, '81-TRIAL-Germany 112', '136-TRIAL- 230', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(312, '114-TRIAL-Italy 109', '184-TRIAL- 156', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(313, '290-TRIAL-USA 293', '296-TRIAL- 52', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(314, '154-TRIAL-Finland 145', '8-TRIAL- 248', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(315, '291-TRIAL-UK 212', '31-TRIAL- 114', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(316, '239-TRIAL-Italy 158', '122-TRIAL- 4', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(317, '95-TRIAL-Italy 152', '69-TRIAL- 279', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(318, '238-TRIAL-Lebanon 23', '18-TRIAL- 66', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(319, '259-TRIAL-France 98', '286-TRIAL- 196', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(320, '262-TRIAL-France 233', '158-TRIAL- 22', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(321, '246-TRIAL-Germany 92', '137-TRIAL- 25', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(322, '147-TRIAL-Belgium 58', '2-TRIAL- 207', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(323, '198-TRIAL-Jordan 230', '192-TRIAL- 200', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(324, '78-TRIAL-Ireland 99', '52-TRIAL- 48', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(325, '82-TRIAL-Austria 240', '115-TRIAL- 75', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(326, '62-TRIAL-Canada 267', '136-TRIAL- 97', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(327, '218-TRIAL-Slovenia 97', '28-TRIAL- 51', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(328, '116-TRIAL-France 230', '249-TRIAL- 125', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(329, '58-TRIAL-France 229', '220-TRIAL- 140', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(330, '160-TRIAL-Spain 147', '262-TRIAL- 155', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(331, '275-TRIAL-Portugal 192', '161-TRIAL- 254', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(332, '198-TRIAL-Argentine 46', '14-TRIAL- 246', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(333, '188-TRIAL-France 69', '238-TRIAL- 63', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(334, '75-TRIAL-Ireland 215', '121-TRIAL- 175', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(335, '15-TRIAL-Italy 128', '34-TRIAL- 270', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(336, '5-TRIAL-Egypt 164', '57-TRIAL- 162', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(337, '61-TRIAL-Iran 224', '249-TRIAL- 69', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(338, '30-TRIAL-Australia 123', '150-TRIAL- 233', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(339, '125-TRIAL-Iran 110', '237-TRIAL- 136', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(340, '37-TRIAL-France 78', '93-TRIAL- 136', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(341, '114-TRIAL-Germany 264', '91-TRIAL- 149', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(342, '235-TRIAL-France 105', '137-TRIAL- 104', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(343, '137-TRIAL-Germany 223', '164-TRIAL- 70', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(344, '108-TRIAL-China 268', '81-TRIAL- 185', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(345, '152-TRIAL-Spain 73', '152-TRIAL- 94', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(346, '276-TRIAL-Lebanon 126', '196-TRIAL- 72', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(347, '249-TRIAL-Germany 240', '74-TRIAL- 219', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(348, '43-TRIAL-UK 211', '141-TRIAL- 189', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(349, '19-TRIAL-Poland 165', '205-TRIAL- 85', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(350, '16-TRIAL-France 250', '115-TRIAL- 209', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(351, '264-TRIAL-France 166', '93-TRIAL- 174', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(352, '9-TRIAL-Saudi Arabia 0', '195-TRIAL- 273', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(353, '289-TRIAL-Greece 261', '272-TRIAL- 268', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(354, '58-TRIAL-France 231', '168-TRIAL- 226', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(355, '10-TRIAL-Lebanon 222', '174-TRIAL- 79', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(356, '10-TRIAL-Turkey 152', '282-TRIAL- 191', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(357, '195-TRIAL-UK 64', '274-TRIAL- 164', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(358, '202-TRIAL-Spain 55', '260-TRIAL- 174', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(359, '72-TRIAL-Lebanon 121', '22-TRIAL- 47', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(360, '277-TRIAL-Spain 189', '105-TRIAL- 195', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(361, '294-TRIAL-Poland 150', '143-TRIAL- 154', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(362, '81-TRIAL-Ireland 112', '272-TRIAL- 39', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(363, '228-TRIAL-Lebanon 212', '162-TRIAL- 267', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(364, '108-TRIAL-Lebanon 215', '108-TRIAL- 123', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(365, '59-TRIAL-Portugal 34', '104-TRIAL- 86', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(366, '119-TRIAL-Lebanon 58', '245-TRIAL- 106', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(367, '66-TRIAL-Germany 100', '267-TRIAL- 292', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(368, '187-TRIAL-Greece 32', '256-TRIAL- 74', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(369, '147-TRIAL-Argentine 221', '283-TRIAL- 122', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(370, '231-TRIAL-Italy 276', '83-TRIAL- 248', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(371, '123-TRIAL-Lebanon 282', '118-TRIAL- 76', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(372, '220-TRIAL-India 211', '82-TRIAL- 156', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(373, '290-TRIAL-Slovenia 225', '124-TRIAL- 186', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(374, '177-TRIAL-Italy 69', '243-TRIAL- 34', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(375, '77-TRIAL-Hungary 168', '168-TRIAL- 91', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(376, '96-TRIAL-United Arab Emirates 283', '28-TRIAL- 227', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(377, '26-TRIAL-USA 271', '197-TRIAL- 212', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(378, '103-TRIAL-Tunisia 227', '8-TRIAL- 145', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(379, '208-TRIAL-Lebanon 285', '238-TRIAL- 237', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(380, '43-TRIAL-Lebanon 13', '1-TRIAL- 150', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(381, '228-TRIAL-Lebanon 11', '250-TRIAL- 249', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(382, '92-TRIAL-Spain 254', '269-TRIAL- 81', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(383, '165-TRIAL-The Netherlands 167', '13-TRIAL- 293', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(384, '34-TRIAL-Lebanon 272', '272-TRIAL- 30', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(385, '1-TRIAL-USA 242', '77-TRIAL- 77', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(386, '270-TRIAL-Ireland 102', '264-TRIAL- 181', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(387, '90-TRIAL-The Netherlands 123', '137-TRIAL- 223', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(388, '79-TRIAL-Argentine 95', '69-TRIAL- 227', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(389, '42-TRIAL-Germany 110', '282-TRIAL- 258', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(390, '126-TRIAL-Germany 187', '170-TRIAL- 128', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(391, '251-TRIAL-Italy 158', '13-TRIAL- 260', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(392, '283-TRIAL-Spain 286', '42-TRIAL- 210', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(393, '272-TRIAL-Spain 228', '134-TRIAL- 141', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(394, '18-TRIAL-France 203', '167-TRIAL- 265', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(395, '138-TRIAL-India 81', '257-TRIAL- 250', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(396, '114-TRIAL-France 298', '258-TRIAL- 261', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(397, '263-TRIAL-Switzerland 56', '107-TRIAL- 178', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(398, '289-TRIAL-Saudi Arabia 235', '65-TRIAL- 275', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(399, '86-TRIAL-Lebanon 186', '33-TRIAL- 260', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(400, '130-TRIAL-France 248', '228-TRIAL- 92', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(401, '133-TRIAL-France 140', '166-TRIAL- 235', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(402, '10-TRIAL-Austria 199', '137-TRIAL- 292', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(403, '182-TRIAL-Austria 128', '252-TRIAL- 269', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(404, '44-TRIAL-France 194', '8-TRIAL- 252', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(405, '247-TRIAL-Lebanon 32', '235-TRIAL- 8', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(406, '264-TRIAL-Germany 197', '143-TRIAL- 49', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(407, '115-TRIAL-USA 141', '189-TRIAL- 200', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(408, '12-TRIAL-Ireland 48', '223-TRIAL- 51', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(409, '174-TRIAL-USA 133', '191-TRIAL- 200', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(410, '54-TRIAL-Jordan 90', '197-TRIAL- 119', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(411, '80-TRIAL-Germany 78', '31-TRIAL- 144', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(412, '40-TRIAL-Saudi Arabia 287', '299-TRIAL- 25', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(413, '83-TRIAL-Spain 138', '292-TRIAL- 193', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(414, '52-TRIAL-Spain 111', '60-TRIAL- 234', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(415, '40-TRIAL-Switzerland 297', '85-TRIAL- 229', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(416, '40-TRIAL-UK 205', '291-TRIAL- 192', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(417, '10-TRIAL-Portugal 49', '278-TRIAL- 279', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(418, '71-TRIAL-Italy 277', '73-TRIAL- 93', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(419, '120-TRIAL-Jordan 197', '26-TRIAL- 76', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(420, '290-TRIAL-Jordan 282', '78-TRIAL- 59', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(421, '18-TRIAL-Saudi Arabia 89', '159-TRIAL- 149', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(422, '24-TRIAL-Canada 72', '180-TRIAL- 8', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(423, '67-TRIAL-Italy 8', '177-TRIAL- 203', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(424, '70-TRIAL-Portugal 207', '96-TRIAL- 74', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(425, '222-TRIAL-Switzerland 11', '119-TRIAL- 261', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(426, '256-TRIAL-Lebanon 290', '263-TRIAL- 183', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(427, '216-TRIAL-Spain 132', '252-TRIAL- 41', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(428, '154-TRIAL-Cyprus 213', '162-TRIAL- 196', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(429, '160-TRIAL-United Arab Emirates 215', '104-TRIAL- 199', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(430, '36-TRIAL-Germany 180', '198-TRIAL- 32', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(431, '287-TRIAL-Jordan 184', '40-TRIAL- 217', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(432, '206-TRIAL-France 270', '241-TRIAL- 282', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(433, '49-TRIAL-Germany 223', '258-TRIAL- 105', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(434, '221-TRIAL-Greece 295', '96-TRIAL- 16', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(435, '78-TRIAL-Ireland 278', '79-TRIAL- 158', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(436, '277-TRIAL-USA 150', '207-TRIAL- 29', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(437, '81-TRIAL-Switzerland 295', '278-TRIAL- 76', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(438, '153-TRIAL-Portugal 199', '84-TRIAL- 265', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(439, '93-TRIAL-Lebanon 108', '172-TRIAL- 143', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(440, '229-TRIAL-France 14', '268-TRIAL- 255', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(441, '91-TRIAL-Italy 273', '222-TRIAL- 148', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(442, '251-TRIAL-Italy 186', '44-TRIAL- 246', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(443, '77-TRIAL-UK 117', '229-TRIAL- 216', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(444, '174-TRIAL-Portugal 191', '169-TRIAL- 112', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(445, '46-TRIAL-France 93', '91-TRIAL- 215', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(446, '249-TRIAL-The Netherlands 157', '240-TRIAL- 252', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(447, '236-TRIAL-Finland 151', '187-TRIAL- 26', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(448, '262-TRIAL-Italy 155', '83-TRIAL- 294', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(449, '180-TRIAL-Germany 197', '65-TRIAL- 65', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(450, '113-TRIAL-Spain 261', '278-TRIAL- 78', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(451, '78-TRIAL-Germany 40', '111-TRIAL- 147', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(452, '45-TRIAL-France 170', '275-TRIAL- 289', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(453, '150-TRIAL-Belgium 149', '33-TRIAL- 65', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(454, '14-TRIAL-Belgium 182', '7-TRIAL- 132', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(455, '196-TRIAL-Austria 167', '22-TRIAL- 82', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(456, '10-TRIAL-Spain 241', '31-TRIAL- 87', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(457, '105-TRIAL-Germany 179', '21-TRIAL- 238', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(458, '151-TRIAL-France 247', '208-TRIAL- 46', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(459, '76-TRIAL-Spain 259', '189-TRIAL- 122', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(460, '66-TRIAL-UK 86', '155-TRIAL- 228', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(461, '214-TRIAL-Sweden 60', '153-TRIAL- 77', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(462, '148-TRIAL-Belgium 203', '61-TRIAL- 231', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(463, '282-TRIAL-Switzerland 155', '97-TRIAL- 206', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(464, '52-TRIAL-Germany 221', '196-TRIAL- 181', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(465, '221-TRIAL-Iran 155', '47-TRIAL- 124', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(466, '18-TRIAL-Italy 135', '276-TRIAL- 274', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(467, '159-TRIAL-Germany 98', '74-TRIAL- 253', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(468, '22-TRIAL-Switzerland 135', '143-TRIAL- 88', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(469, '53-TRIAL-France 32', '247-TRIAL- 180', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(470, '126-TRIAL-USA 178', '150-TRIAL- 101', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(471, '61-TRIAL-Germany 99', '155-TRIAL- 263', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(472, '16-TRIAL-Germany 73', '61-TRIAL- 145', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(473, '173-TRIAL-Lebanon 74', '50-TRIAL- 53', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(474, '281-TRIAL-Lebanon 87', '299-TRIAL- 110', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(475, '43-TRIAL-Poland 65', '272-TRIAL- 129', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(476, '81-TRIAL-Spain 12', '276-TRIAL- 181', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(477, '147-TRIAL-Lebanon 190', '171-TRIAL- 105', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(478, '272-TRIAL-Bulgaria 32', '89-TRIAL- 20', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(479, '65-TRIAL-Lebanon 131', '58-TRIAL- 193', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(480, '106-TRIAL-Belgium 178', '148-TRIAL- 106', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(481, '171-TRIAL-Germany 166', '96-TRIAL- 197', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(482, '120-TRIAL-Lebanon 294', '229-TRIAL- 88', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(483, '109-TRIAL-Puerto Rico 284', '269-TRIAL- 178', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(484, '17-TRIAL-Spain 115', '126-TRIAL- 84', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(485, '168-TRIAL-UK 206', '128-TRIAL- 97', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(486, '218-TRIAL-Lebanon 90', '199-TRIAL- 85', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(487, '86-TRIAL-Belgium 299', '120-TRIAL- 10', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(488, '271-TRIAL-Austria 213', '115-TRIAL- 85', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(489, '18-TRIAL-Spain 280', '131-TRIAL- 67', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(490, '287-TRIAL-France 244', '86-TRIAL- 107', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(491, '160-TRIAL-Germany 127', '174-TRIAL- 31', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(492, '252-TRIAL-Lebanon 271', '68-TRIAL- 193', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(493, '85-TRIAL-India 37', '111-TRIAL- 204', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(494, '77-TRIAL-Saudi Arabia 106', '268-TRIAL- 222', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(495, '213-TRIAL-Germany 200', '242-TRIAL- 137', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(496, '38-TRIAL-Czech Republic 88', '155-TRIAL- 89', 1, '2024-04-16 05:04:14', NULL, NULL, NULL),
(497, '147-TRIAL-Lebanon 181', '193-TRIAL- 84', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(498, '187-TRIAL-Germany 261', '93-TRIAL- 117', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(499, '201-TRIAL-Italy 82', '47-TRIAL- 65', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(500, '253-TRIAL-USA 204', '84-TRIAL- 195', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(501, '25-TRIAL-France 221', '64-TRIAL- 181', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(502, '72-TRIAL-Switzerland 6', '56-TRIAL- 43', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(503, '93-TRIAL-Italy 80', '180-TRIAL- 168', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(504, '111-TRIAL-Italy 213', '268-TRIAL- 251', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(505, '216-TRIAL-Cyprus 79', '268-TRIAL- 240', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(506, '31-TRIAL-Lebanon 33', '79-TRIAL- 263', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(507, '259-TRIAL-Lebanon 253', '36-TRIAL- 295', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(508, '65-TRIAL-UK 174', '220-TRIAL- 135', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(509, '180-TRIAL-France 276', '155-TRIAL- 25', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(510, '171-TRIAL-Jordan 208', '59-TRIAL- 156', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(511, '202-TRIAL-Portugal 132', '105-TRIAL- 240', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(512, '175-TRIAL-Lebanon 262', '85-TRIAL- 62', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(513, '80-TRIAL-Lebanon 36', '297-TRIAL- 2', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(514, '8-TRIAL-Lebanon 180', '240-TRIAL- 76', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(515, '58-TRIAL-Italy 293', '240-TRIAL- 146', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(516, '74-TRIAL-Greece 173', '197-TRIAL- 180', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(517, '235-TRIAL-Switzerland 272', '0-TRIAL- 107', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(518, '155-TRIAL-Lebanon 266', '241-TRIAL- 188', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(519, '181-TRIAL-Portugal 68', '115-TRIAL- 196', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(520, '25-TRIAL-Portugal 109', '112-TRIAL- 136', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(521, '55-TRIAL-Jordan 162', '143-TRIAL- 142', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(522, '21-TRIAL-Saudi Arabia 222', '212-TRIAL- 248', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(523, '218-TRIAL-Jordan 68', '17-TRIAL- 114', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(524, '250-TRIAL-Saudi Arabia 90', '35-TRIAL- 159', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(525, '169-TRIAL-Italy 295', '203-TRIAL- 140', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(526, '79-TRIAL-Spain 199', '5-TRIAL- 191', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(527, '61-TRIAL-Brazil 281', '52-TRIAL- 53', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(528, '33-TRIAL-Lebanon 229', '87-TRIAL- 142', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(529, '153-TRIAL-Lebanon 283', '20-TRIAL- 214', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(530, '18-TRIAL-Lebanon 244', '163-TRIAL- 29', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(531, '252-TRIAL-UK 264', '269-TRIAL- 170', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(532, '5-TRIAL-Italy 47', '94-TRIAL- 187', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(533, '26-TRIAL-France 276', '23-TRIAL- 240', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(534, '179-TRIAL-Tunisia 290', '188-TRIAL- 110', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(535, '171-TRIAL-USA 245', '121-TRIAL- 270', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(536, '83-TRIAL-Italy 189', '255-TRIAL- 178', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(537, '179-TRIAL-France 206', '62-TRIAL- 35', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(538, '87-TRIAL-Greece 196', '233-TRIAL- 288', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(539, '35-TRIAL-Italy 279', '93-TRIAL- 90', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(540, '62-TRIAL-Spain 65', '201-TRIAL- 205', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(541, '107-TRIAL-Lebanon 267', '269-TRIAL- 134', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(542, '271-TRIAL-Lebanon 257', '98-TRIAL- 245', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(543, '97-TRIAL-USA 118', '138-TRIAL- 144', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(544, '172-TRIAL-Greece 163', '28-TRIAL- 164', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(545, '1-TRIAL-Denmark 23', '290-TRIAL- 104', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(546, '101-TRIAL-Switzerland 227', '97-TRIAL- 292', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(547, '271-TRIAL-Puerto Rico 263', '201-TRIAL- 163', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(548, '221-TRIAL-Greece 265', '21-TRIAL- 45', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(549, '10-TRIAL-Italy 195', '241-TRIAL- 22', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(550, '12-TRIAL-Ireland 51', '215-TRIAL- 255', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(551, '93-TRIAL-Italy 38', '279-TRIAL- 82', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(552, '108-TRIAL-Germany 54', '222-TRIAL- 7', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(553, '245-TRIAL-Lebanon 138', '144-TRIAL- 90', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(554, '139-TRIAL-Switzerland 54', '4-TRIAL- 123', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(555, '25-TRIAL-USA 278', '124-TRIAL- 181', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(556, '230-TRIAL-France 33', '23-TRIAL- 194', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(557, '30-TRIAL-Japan 246', '187-TRIAL- 45', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(558, '205-TRIAL-Germany 216', '50-TRIAL- 89', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(559, '38-TRIAL-Italy 63', '235-TRIAL- 297', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(560, '109-TRIAL-Spain 30', '124-TRIAL- 108', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(561, '37-TRIAL-Canada 174', '120-TRIAL- 72', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(562, '93-TRIAL-Lebanon 255', '134-TRIAL- 261', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(563, '156-TRIAL-Lebanon 6', '84-TRIAL- 175', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(564, '182-TRIAL-USA 19', '141-TRIAL- 132', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(565, '84-TRIAL-Ireland 179', '279-TRIAL- 283', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(566, '267-TRIAL-Australia 236', '125-TRIAL- 118', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(567, '137-TRIAL-UK 28', '19-TRIAL- 177', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(568, '237-TRIAL-Ireland 291', '156-TRIAL- 295', 1, '2024-04-16 05:04:15', NULL, NULL, NULL);
INSERT INTO `countries` (`CountryId`, `Name`, `NameAr`, `Enabled`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES
(569, '160-TRIAL-Belgium 1', '93-TRIAL- 132', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(570, '36-TRIAL-Lebanon 80', '175-TRIAL- 207', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(571, '184-TRIAL-The Netherlands 174', '19-TRIAL- 90', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(572, '76-TRIAL-Switzerland 41', '51-TRIAL- 229', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(573, '90-TRIAL-India 174', '272-TRIAL- 291', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(574, '189-TRIAL-USA 187', '290-TRIAL- 239', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(575, '193-TRIAL-USA 53', '263-TRIAL- 181', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(576, '103-TRIAL-France 5', '176-TRIAL- 179', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(577, '195-TRIAL-India 139', '68-TRIAL- 198', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(578, '83-TRIAL-France 239', '115-TRIAL- 21', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(579, '293-TRIAL-India 226', '122-TRIAL- 138', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(580, '228-TRIAL-USA 281', '99-TRIAL- 278', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(581, '191-TRIAL-China 123', '243-TRIAL- 234', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(582, '143-TRIAL-USA 149', '2-TRIAL- 7', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(583, '102-TRIAL-Germany 241', '187-TRIAL- 246', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(584, '291-TRIAL-Germany 37', '113-TRIAL- 0', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(585, '16-TRIAL-Germany 190', '262-TRIAL- 235', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(586, '26-TRIAL-Finland 210', '77-TRIAL- 282', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(587, '160-TRIAL-Jordan 189', '5-TRIAL- 74', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(588, '263-TRIAL-Austria 22', '95-TRIAL- 66', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(589, '160-TRIAL-Tunisia 38', '288-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(590, '45-TRIAL-Argentine 167', '25-TRIAL- 167', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(591, '289-TRIAL-UK 42', '163-TRIAL- 247', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(592, '202-TRIAL-India 217', '99-TRIAL- 123', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(593, '126-TRIAL-Argentine 3', '48-TRIAL- 51', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(594, '70-TRIAL-China 236', '158-TRIAL- 167', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(595, '56-TRIAL-Lebanon 105', '131-TRIAL- 262', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(596, '119-TRIAL-France 175', '56-TRIAL- 31', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(597, '295-TRIAL-Australia 244', '291-TRIAL- 103', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(598, '88-TRIAL-Argentine 15', '250-TRIAL- 19', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(599, '272-TRIAL-USA 291', '283-TRIAL- 233', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(600, '275-TRIAL-Belgium 42', '169-TRIAL- 0', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(601, '254-TRIAL-UK 78', '285-TRIAL- 157', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(602, '133-TRIAL-Argentine 293', '290-TRIAL- 203', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(603, '250-TRIAL-UK 133', '222-TRIAL- 271', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(604, '111-TRIAL-Australia 90', '38-TRIAL- 41', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(605, '158-TRIAL-Argentine 147', '252-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(606, '179-TRIAL-The Netherlands 102', '283-TRIAL- 90', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(607, '102-TRIAL-Italy 268', '222-TRIAL- 95', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(608, '135-TRIAL-Lebanon 8', '61-TRIAL- 242', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(609, '294-TRIAL-Japan 299', '88-TRIAL- 78', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(610, '142-TRIAL-Canada 157', '241-TRIAL- 47', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(611, '269-TRIAL-Germany 145', '180-TRIAL- 113', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(612, '264-TRIAL-USA 210', '261-TRIAL- 185', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(613, '273-TRIAL-Singapore 204', '162-TRIAL- 3', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(614, '202-TRIAL-USA 269', '54-TRIAL- 229', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(615, '52-TRIAL-France 274', '249-TRIAL- 130', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(616, '144-TRIAL-Romania 44', '149-TRIAL- 18', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(617, '65-TRIAL-Malta 263', '52-TRIAL- 273', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(618, '170-TRIAL-France 31', '147-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(619, '169-TRIAL-UK 298', '298-TRIAL- 203', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(620, '52-TRIAL-Lebanon 179', '153-TRIAL- 143', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(621, '122-TRIAL-Germany 188', '63-TRIAL- 34', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(622, '250-TRIAL-Korea 222', '40-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(623, '192-TRIAL-USA 251', '80-TRIAL- 177', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(624, '16-TRIAL-USA 176', '278-TRIAL- 120', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(625, '215-TRIAL-Lebanon 148', '98-TRIAL- 79', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(626, '135-TRIAL-Switzerland 57', '183-TRIAL- 162', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(627, '2-TRIAL-USA 62', '220-TRIAL- 270', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(628, '122-TRIAL-Ireland 273', '41-TRIAL- 86', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(629, '88-TRIAL-Switzerland 17', '217-TRIAL- 92', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(630, '198-TRIAL-Ireland 167', '49-TRIAL- 65', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(631, '189-TRIAL-Switzerland 32', '119-TRIAL- 181', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(632, '203-TRIAL-Greece 30', '128-TRIAL- 31', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(633, '189-TRIAL-Iran 52', '30-TRIAL- 272', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(634, '64-TRIAL-USA 107', '295-TRIAL- 228', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(635, '281-TRIAL-Lebanon 190', '210-TRIAL- 77', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(636, '171-TRIAL-Lebanon 36', '159-TRIAL- 243', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(637, '40-TRIAL-India 33', '37-TRIAL- 193', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(638, '130-TRIAL-Germany 174', '93-TRIAL- 282', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(639, '103-TRIAL-Ireland 61', '190-TRIAL- 162', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(640, '107-TRIAL-USA 297', '251-TRIAL- 123', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(641, '190-TRIAL-UK 217', '40-TRIAL- 203', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(642, '166-TRIAL-Spain 83', '261-TRIAL- 159', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(643, '245-TRIAL-USA 286', '251-TRIAL- 65', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(644, '101-TRIAL-Austria 40', '109-TRIAL- 297', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(645, '283-TRIAL-Germany 150', '58-TRIAL- 21', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(646, '175-TRIAL-USA 281', '87-TRIAL- 271', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(647, '87-TRIAL-Germany 99', '204-TRIAL- 79', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(648, '38-TRIAL-Ireland 200', '230-TRIAL- 61', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(649, '118-TRIAL-Lebanon 205', '40-TRIAL- 228', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(650, '159-TRIAL-France 222', '298-TRIAL- 160', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(651, '98-TRIAL-Croatia 35', '281-TRIAL- 14', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(652, '67-TRIAL-Austria 193', '96-TRIAL- 261', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(653, '246-TRIAL-Austria 38', '170-TRIAL- 138', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(654, '176-TRIAL-Denmark 255', '17-TRIAL- 171', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(655, '260-TRIAL-Switzerland 52', '258-TRIAL- 133', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(656, '155-TRIAL-Denmark 265', '126-TRIAL- 1', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(657, '34-TRIAL-Ireland 159', '193-TRIAL- 248', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(658, '273-TRIAL-Denmark 192', '293-TRIAL- 33', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(659, '137-TRIAL-USA 3', '90-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(660, '194-TRIAL-Canada 68', '227-TRIAL- 298', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(661, '89-TRIAL-Lebanon 248', '279-TRIAL- 247', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(662, '49-TRIAL-Lebanon 31', '69-TRIAL- 275', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(663, '98-TRIAL-Switzerland 249', '236-TRIAL- 299', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(664, '23-TRIAL-Ireland 243', '231-TRIAL- 154', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(665, '61-TRIAL-Korea 234', '85-TRIAL- 267', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(666, '16-TRIAL-Belgium 293', '204-TRIAL- 166', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(667, '53-TRIAL-Japan 8', '23-TRIAL- 84', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(668, '192-TRIAL-Switzerland 167', '148-TRIAL- 69', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(669, '130-TRIAL-India 211', '14-TRIAL- 190', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(670, '27-TRIAL-Switzerland 43', '104-TRIAL- 99', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(671, '274-TRIAL-Lebanon 295', '206-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(672, '189-TRIAL-Egypt 258', '209-TRIAL- 189', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(673, '47-TRIAL-Argentine 40', '218-TRIAL- 64', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(674, '275-TRIAL-Argentine 26', '189-TRIAL- 103', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(675, '66-TRIAL-Italy 12', '240-TRIAL- 270', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(676, '276-TRIAL-Egypt 195', '141-TRIAL- 286', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(677, '251-TRIAL-Lebanon 109', '87-TRIAL- 283', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(678, '85-TRIAL-Spain 290', '50-TRIAL- 86', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(679, '255-TRIAL-Lebanon 281', '228-TRIAL- 2', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(680, '277-TRIAL-Portugal 262', '24-TRIAL- 265', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(681, '272-TRIAL-Italy 232', '285-TRIAL- 28', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(682, '46-TRIAL-France 189', '178-TRIAL- 83', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(683, '25-TRIAL-Italy 265', '60-TRIAL- 245', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(684, '78-TRIAL-Spain 121', '55-TRIAL- 120', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(685, '27-TRIAL-USA 173', '234-TRIAL- 251', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(686, '175-TRIAL-USA 136', '134-TRIAL- 1', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(687, '37-TRIAL-Spain 10', '274-TRIAL- 90', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(688, '256-TRIAL-Jordan 171', '280-TRIAL- 135', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(689, '45-TRIAL-Lebanon 182', '25-TRIAL- 118', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(690, '73-TRIAL-Argentine 212', '137-TRIAL- 198', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(691, '5-TRIAL-Germany 262', '217-TRIAL- 292', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(692, '39-TRIAL-Germany 147', '146-TRIAL- 203', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(693, '231-TRIAL-Switzerland 115', '239-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(694, '129-TRIAL-Portugal 245', '94-TRIAL- 99', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(695, '145-TRIAL-Italy 172', '75-TRIAL- 262', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(696, '272-TRIAL-Saudi Arabia 273', '80-TRIAL- 138', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(697, '197-TRIAL-Japan 242', '208-TRIAL- 3', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(698, '177-TRIAL-Egypt 125', '34-TRIAL- 201', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(699, '78-TRIAL-France 82', '69-TRIAL- 36', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(700, '178-TRIAL-Ireland 239', '138-TRIAL- 121', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(701, '226-TRIAL-Lebanon 163', '177-TRIAL- 275', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(702, '124-TRIAL-UK 181', '100-TRIAL- 161', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(703, '62-TRIAL-France 102', '148-TRIAL- 195', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(704, '84-TRIAL-Greece 16', '137-TRIAL- 207', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(705, '193-TRIAL-Lebanon 284', '244-TRIAL- 259', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(706, '221-TRIAL-Switzerland 158', '43-TRIAL- 268', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(707, '177-TRIAL-South Africa 119', '157-TRIAL- 241', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(708, '191-TRIAL-France 64', '123-TRIAL- 15', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(709, '272-TRIAL-Lebanon 229', '241-TRIAL- 215', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(710, '215-TRIAL-Romania 236', '257-TRIAL- 159', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(711, '100-TRIAL-Switzerland 252', '293-TRIAL- 241', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(712, '129-TRIAL-UK 148', '127-TRIAL- 98', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(713, '24-TRIAL-Latvia 124', '274-TRIAL- 133', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(714, '85-TRIAL-Argentine 38', '170-TRIAL- 262', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(715, '229-TRIAL-Italy 284', '209-TRIAL- 178', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(716, '23-TRIAL-Lebanon 85', '0-TRIAL- 224', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(717, '93-TRIAL-USA 5', '112-TRIAL- 165', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(718, '67-TRIAL-USA 107', '177-TRIAL- 284', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(719, '104-TRIAL-Serbia 90', '234-TRIAL- 91', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(720, '21-TRIAL-Italy 85', '134-TRIAL- 290', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(721, '142-TRIAL-Lebanon 298', '186-TRIAL- 218', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(722, '21-TRIAL-France 124', '97-TRIAL- 76', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(723, '254-TRIAL-Germany 269', '108-TRIAL- 27', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(724, '193-TRIAL-France 268', '66-TRIAL- 102', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(725, '38-TRIAL-Italy 0', '19-TRIAL- 218', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(726, '190-TRIAL-Sweden 284', '139-TRIAL- 156', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(727, '8-TRIAL-Spain 132', '178-TRIAL- 114', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(728, '287-TRIAL-Italy 39', '174-TRIAL- 120', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(729, '27-TRIAL-Canada 154', '188-TRIAL- 241', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(730, '298-TRIAL-UK 142', '102-TRIAL- 121', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(731, '104-TRIAL-Germany 146', '156-TRIAL- 209', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(732, '133-TRIAL-UK 8', '261-TRIAL- 233', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(733, '286-TRIAL-France 104', '285-TRIAL- 242', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(734, '242-TRIAL-France 160', '261-TRIAL- 120', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(735, '143-TRIAL-Spain 278', '287-TRIAL- 113', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(736, '163-TRIAL-Germany 91', '234-TRIAL- 15', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(737, '56-TRIAL-Germany 61', '112-TRIAL- 211', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(738, '259-TRIAL-Spain 51', '138-TRIAL- 170', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(739, '24-TRIAL-Ireland 107', '207-TRIAL- 184', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(740, '151-TRIAL-Lebanon 1', '89-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(741, '141-TRIAL-Australia 290', '213-TRIAL- 112', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(742, '155-TRIAL-France 60', '193-TRIAL- 72', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(743, '202-TRIAL-France 276', '43-TRIAL- 173', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(744, '266-TRIAL-Lebanon 51', '275-TRIAL- 228', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(745, '232-TRIAL-Greece 261', '69-TRIAL- 103', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(746, '29-TRIAL-Spain 7', '292-TRIAL- 51', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(747, '253-TRIAL-Switzerland 192', '70-TRIAL- 19', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(748, '272-TRIAL-France 7', '294-TRIAL- 205', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(749, '240-TRIAL-France 283', '162-TRIAL- 109', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(750, '107-TRIAL-Spain 38', '160-TRIAL- 71', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(751, '71-TRIAL-India 254', '247-TRIAL- 114', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(752, '123-TRIAL-USA 229', '189-TRIAL- 166', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(753, '187-TRIAL-USA 56', '232-TRIAL- 270', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(754, '239-TRIAL-Lebanon 266', '122-TRIAL- 83', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(755, '60-TRIAL-Australia 153', '105-TRIAL- 91', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(756, '59-TRIAL-Portugal 186', '187-TRIAL- 129', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(757, '42-TRIAL-France 117', '145-TRIAL- 56', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(758, '188-TRIAL-UK 252', '154-TRIAL- 166', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(759, '133-TRIAL-China 160', '219-TRIAL- 131', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(760, '138-TRIAL-Germany 267', '276-TRIAL- 98', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(761, '14-TRIAL-Spain 120', '153-TRIAL- 7', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(762, '269-TRIAL-Spain 216', '122-TRIAL- 42', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(763, '207-TRIAL-Canada 163', '160-TRIAL- 47', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(764, '293-TRIAL-Germany 130', '117-TRIAL- 243', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(765, '176-TRIAL-Germany 114', '126-TRIAL- 17', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(766, '134-TRIAL-Lebanon 220', '71-TRIAL- 92', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(767, '264-TRIAL-Germany 254', '266-TRIAL- 293', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(768, '64-TRIAL-Belgium 75', '100-TRIAL- 212', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(769, '100-TRIAL-USA 51', '276-TRIAL- 79', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(770, '143-TRIAL-Denmark 177', '189-TRIAL- 61', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(771, '285-TRIAL-Turkey 172', '34-TRIAL- 144', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(772, '161-TRIAL-Spain 63', '104-TRIAL- 46', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(773, '188-TRIAL-USA 208', '157-TRIAL- 230', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(774, '23-TRIAL-Lebanon 164', '174-TRIAL- 146', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(775, '37-TRIAL-India 181', '118-TRIAL- 211', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(776, '92-TRIAL-Greece 191', '232-TRIAL- 123', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(777, '161-TRIAL-Canada 191', '261-TRIAL- 30', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(778, '298-TRIAL-Lebanon 269', '191-TRIAL- 0', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(779, '79-TRIAL-Puerto Rico 117', '217-TRIAL- 114', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(780, '95-TRIAL-Hungary 241', '236-TRIAL- 267', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(781, '128-TRIAL-Denmark 253', '9-TRIAL- 173', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(782, '281-TRIAL-Belgium 103', '169-TRIAL- 216', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(783, '83-TRIAL-Belgium 167', '285-TRIAL- 202', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(784, '130-TRIAL-France 57', '181-TRIAL- 267', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(785, '210-TRIAL-USA 66', '87-TRIAL- 271', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(786, '177-TRIAL-USA 45', '64-TRIAL- 238', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(787, '71-TRIAL-USA 247', '15-TRIAL- 92', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(788, '11-TRIAL-Germany 257', '205-TRIAL- 53', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(789, '271-TRIAL-Germany 180', '240-TRIAL- 30', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(790, '175-TRIAL-Ireland 20', '290-TRIAL- 177', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(791, '198-TRIAL-Sweden 86', '4-TRIAL- 289', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(792, '131-TRIAL-Germany 44', '288-TRIAL- 210', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(793, '118-TRIAL-France 219', '259-TRIAL- 227', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(794, '209-TRIAL-USA 219', '179-TRIAL- 216', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(795, '0-TRIAL-Lebanon 96', '53-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(796, '130-TRIAL-Saudi Arabia 293', '206-TRIAL- 149', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(797, '154-TRIAL-South Africa 272', '60-TRIAL- 294', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(798, '54-TRIAL-France 233', '146-TRIAL- 29', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(799, '271-TRIAL-Lebanon 228', '59-TRIAL- 41', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(800, '21-TRIAL-Germany 188', '166-TRIAL- 33', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(801, '285-TRIAL-Switzerland 170', '129-TRIAL- 161', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(802, '60-TRIAL-Jordan 108', '282-TRIAL- 262', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(803, '106-TRIAL-UK 278', '279-TRIAL- 97', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(804, '87-TRIAL-France 238', '69-TRIAL- 183', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(805, '140-TRIAL-France 295', '66-TRIAL- 33', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(806, '9-TRIAL-USA 257', '217-TRIAL- 34', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(807, '253-TRIAL-Switzerland 135', '258-TRIAL- 193', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(808, '143-TRIAL-Lebanon 93', '266-TRIAL- 151', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(809, '140-TRIAL-Tunisia 294', '37-TRIAL- 74', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(810, '112-TRIAL-UK 97', '251-TRIAL- 295', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(811, '217-TRIAL-Belgium 92', '292-TRIAL- 137', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(812, '230-TRIAL-France 13', '96-TRIAL- 110', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(813, '289-TRIAL-USA 228', '109-TRIAL- 286', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(814, '244-TRIAL-USA 240', '82-TRIAL- 69', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(815, '120-TRIAL-Germany 93', '292-TRIAL- 262', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(816, '114-TRIAL-UK 227', '107-TRIAL- 294', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(817, '5-TRIAL-Germany 13', '111-TRIAL- 13', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(818, '93-TRIAL-Jordan 164', '103-TRIAL- 195', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(819, '62-TRIAL-Germany 281', '246-TRIAL- 209', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(820, '148-TRIAL-Lebanon 168', '224-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(821, '154-TRIAL-Spain 35', '227-TRIAL- 233', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(822, '40-TRIAL-Switzerland 62', '127-TRIAL- 277', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(823, '117-TRIAL-Italy 240', '242-TRIAL- 100', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(824, '200-TRIAL-Lebanon 258', '176-TRIAL- 154', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(825, '135-TRIAL-Belgium 230', '131-TRIAL- 295', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(826, '237-TRIAL-France 23', '222-TRIAL- 227', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(827, '129-TRIAL-Portugal 211', '11-TRIAL- 54', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(828, '180-TRIAL-France 253', '293-TRIAL- 21', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(829, '85-TRIAL-France 128', '243-TRIAL- 100', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(830, '55-TRIAL-Argentine 71', '270-TRIAL- 252', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(831, '75-TRIAL-USA 231', '140-TRIAL- 234', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(832, '40-TRIAL-Ireland 186', '34-TRIAL- 148', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(833, '39-TRIAL-France 265', '196-TRIAL- 112', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(834, '62-TRIAL-Italy 152', '131-TRIAL- 287', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(835, '164-TRIAL-Ireland 157', '148-TRIAL- 156', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(836, '70-TRIAL-Italy 50', '182-TRIAL- 101', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(837, '93-TRIAL-Belgium 99', '232-TRIAL- 144', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(838, '231-TRIAL-USA 75', '104-TRIAL- 150', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(839, '26-TRIAL-France 266', '38-TRIAL- 1', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(840, '123-TRIAL-USA 43', '141-TRIAL- 80', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(841, '195-TRIAL-France 118', '59-TRIAL- 163', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(842, '28-TRIAL-Belgium 29', '188-TRIAL- 54', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(843, '213-TRIAL-Germany 79', '269-TRIAL- 66', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(844, '179-TRIAL-USA 277', '237-TRIAL- 102', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(845, '15-TRIAL-Lithuania 192', '223-TRIAL- 172', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(846, '48-TRIAL-USA 23', '53-TRIAL- 48', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(847, '95-TRIAL-France 297', '8-TRIAL- 108', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(848, '11-TRIAL-Belgium 193', '165-TRIAL- 81', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(849, '202-TRIAL-Spain 210', '228-TRIAL- 256', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(850, '105-TRIAL-France 265', '23-TRIAL- 69', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(851, '15-TRIAL-Lebanon 153', '5-TRIAL- 284', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(852, '78-TRIAL-Greece 45', '240-TRIAL- 233', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(853, '85-TRIAL-Italy 200', '168-TRIAL- 294', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(854, '133-TRIAL-Germany 85', '48-TRIAL- 281', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(855, '32-TRIAL-USA 56', '210-TRIAL- 72', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(856, '282-TRIAL-USA 201', '6-TRIAL- 135', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(857, '160-TRIAL-Spain 71', '127-TRIAL- 237', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(858, '243-TRIAL-France 168', '33-TRIAL- 95', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(859, '71-TRIAL-France 103', '142-TRIAL- 11', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(860, '79-TRIAL-Greece 134', '112-TRIAL- 293', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(861, '230-TRIAL-France 61', '134-TRIAL- 58', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(862, '26-TRIAL-Spain 206', '91-TRIAL- 43', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(863, '188-TRIAL-UK 227', '19-TRIAL- 84', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(864, '124-TRIAL-Turkey 193', '135-TRIAL- 24', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(865, '194-TRIAL-UK 282', '167-TRIAL- 227', 1, '2024-04-16 05:04:15', NULL, NULL, NULL),
(866, '105-TRIAL-Germany 46', '286-TRIAL- 89', 1, '2024-04-16 05:04:15', NULL, NULL, NULL);

--
-- Triggers `countries`
--
DELIMITER $$
CREATE TRIGGER `a_d_Countries` AFTER DELETE ON `countries` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Countries';						SET @pk_d = CONCAT('<CountryId>',OLD.`CountryId`,'</CountryId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Countries` AFTER INSERT ON `countries` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Countries'; 						SET @pk_d = CONCAT('<CountryId>',NEW.`CountryId`,'</CountryId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Countries` AFTER UPDATE ON `countries` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Countries';						SET @pk_d_old = CONCAT('<CountryId>',OLD.`CountryId`,'</CountryId>');						SET @pk_d = CONCAT('<CountryId>',NEW.`CountryId`,'</CountryId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `countrygovernoratemapping`
--

CREATE TABLE `countrygovernoratemapping` (
  `CountryId` int(11) NOT NULL,
  `GovernorateId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `countrygovernoratemapping`
--
DELIMITER $$
CREATE TRIGGER `a_d_CountryGovernorateMapping` AFTER DELETE ON `countrygovernoratemapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'CountryGovernorateMapping';						SET @pk_d = CONCAT('<CountryId>',OLD.`CountryId`,'</CountryId>','<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_CountryGovernorateMapping` AFTER INSERT ON `countrygovernoratemapping` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'CountryGovernorateMapping'; 						SET @pk_d = CONCAT('<CountryId>',NEW.`CountryId`,'</CountryId>','<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_CountryGovernorateMapping` AFTER UPDATE ON `countrygovernoratemapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'CountryGovernorateMapping';						SET @pk_d_old = CONCAT('<CountryId>',OLD.`CountryId`,'</CountryId>','<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>');						SET @pk_d = CONCAT('<CountryId>',NEW.`CountryId`,'</CountryId>','<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `diseasecategory`
--

CREATE TABLE `diseasecategory` (
  `DiseaseCategoryId` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `CategoryNameAr` varchar(100) DEFAULT NULL,
  `IsEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `UpdatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `diseasecategory`
--

INSERT INTO `diseasecategory` (`DiseaseCategoryId`, `CategoryName`, `CategoryNameAr`, `IsEnabled`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES
(2, 'Cardiovascular Diseases', 'أمراض القلب والأوعية الدموية', 1, '2024-04-13 15:59:26', NULL, 1, NULL);

--
-- Triggers `diseasecategory`
--
DELIMITER $$
CREATE TRIGGER `a_d_DiseaseCategory` AFTER DELETE ON `diseasecategory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DiseaseCategory';						SET @pk_d = CONCAT('<DiseaseCategoryId>',OLD.`DiseaseCategoryId`,'</DiseaseCategoryId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DiseaseCategory` AFTER INSERT ON `diseasecategory` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DiseaseCategory'; 						SET @pk_d = CONCAT('<DiseaseCategoryId>',NEW.`DiseaseCategoryId`,'</DiseaseCategoryId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DiseaseCategory` AFTER UPDATE ON `diseasecategory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DiseaseCategory';						SET @pk_d_old = CONCAT('<DiseaseCategoryId>',OLD.`DiseaseCategoryId`,'</DiseaseCategoryId>');						SET @pk_d = CONCAT('<DiseaseCategoryId>',NEW.`DiseaseCategoryId`,'</DiseaseCategoryId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `diseasecategoryatc`
--

CREATE TABLE `diseasecategoryatc` (
  `MappingId` int(11) NOT NULL,
  `DiseaseCategoryId` int(11) NOT NULL,
  `ATC_CodeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `diseasecategoryatc`
--
DELIMITER $$
CREATE TRIGGER `a_d_DiseaseCategoryATC` AFTER DELETE ON `diseasecategoryatc` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DiseaseCategoryATC';						SET @pk_d = CONCAT('<MappingId>',OLD.`MappingId`,'</MappingId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DiseaseCategoryATC` AFTER INSERT ON `diseasecategoryatc` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DiseaseCategoryATC'; 						SET @pk_d = CONCAT('<MappingId>',NEW.`MappingId`,'</MappingId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DiseaseCategoryATC` AFTER UPDATE ON `diseasecategoryatc` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DiseaseCategoryATC';						SET @pk_d_old = CONCAT('<MappingId>',OLD.`MappingId`,'</MappingId>');						SET @pk_d = CONCAT('<MappingId>',NEW.`MappingId`,'</MappingId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `dispensingconditions`
--

CREATE TABLE `dispensingconditions` (
  `Id` int(11) NOT NULL,
  `dispensingCondition` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `dispensingconditions`
--

INSERT INTO `dispensingconditions` (`Id`, `dispensingCondition`) VALUES
(1, 'Prescription and dispensing conditions'),
(2, 'Narcotics'),
(3, 'Biological drugs'),
(4, 'Dispensed multiple times from one prescription'),
(5, 'Dispensed for the prescription duration'),
(6, 'OTC drugs');

--
-- Triggers `dispensingconditions`
--
DELIMITER $$
CREATE TRIGGER `a_d_DispensingConditions` AFTER DELETE ON `dispensingconditions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DispensingConditions';						SET @pk_d = CONCAT('<Id>',OLD.`Id`,'</Id>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DispensingConditions` AFTER INSERT ON `dispensingconditions` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DispensingConditions'; 						SET @pk_d = CONCAT('<Id>',NEW.`Id`,'</Id>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DispensingConditions` AFTER UPDATE ON `dispensingconditions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DispensingConditions';						SET @pk_d_old = CONCAT('<Id>',OLD.`Id`,'</Id>');						SET @pk_d = CONCAT('<Id>',NEW.`Id`,'</Id>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `districtcitymapping`
--

CREATE TABLE `districtcitymapping` (
  `DistrictId` int(11) NOT NULL,
  `CityId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `districtcitymapping`
--
DELIMITER $$
CREATE TRIGGER `a_d_DistrictCityMapping` AFTER DELETE ON `districtcitymapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DistrictCityMapping';						SET @pk_d = CONCAT('<DistrictId>',OLD.`DistrictId`,'</DistrictId>','<CityId>',OLD.`CityId`,'</CityId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DistrictCityMapping` AFTER INSERT ON `districtcitymapping` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DistrictCityMapping'; 						SET @pk_d = CONCAT('<DistrictId>',NEW.`DistrictId`,'</DistrictId>','<CityId>',NEW.`CityId`,'</CityId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DistrictCityMapping` AFTER UPDATE ON `districtcitymapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DistrictCityMapping';						SET @pk_d_old = CONCAT('<DistrictId>',OLD.`DistrictId`,'</DistrictId>','<CityId>',OLD.`CityId`,'</CityId>');						SET @pk_d = CONCAT('<DistrictId>',NEW.`DistrictId`,'</DistrictId>','<CityId>',NEW.`CityId`,'</CityId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `DistrictId` int(11) NOT NULL,
  `GovernorateId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `districts`
--
DELIMITER $$
CREATE TRIGGER `a_d_Districts` AFTER DELETE ON `districts` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Districts';						SET @pk_d = CONCAT('<DistrictId>',OLD.`DistrictId`,'</DistrictId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Districts` AFTER INSERT ON `districts` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Districts'; 						SET @pk_d = CONCAT('<DistrictId>',NEW.`DistrictId`,'</DistrictId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Districts` AFTER UPDATE ON `districts` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Districts';						SET @pk_d_old = CONCAT('<DistrictId>',OLD.`DistrictId`,'</DistrictId>');						SET @pk_d = CONCAT('<DistrictId>',NEW.`DistrictId`,'</DistrictId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `DoctorId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Specialty` varchar(255) DEFAULT NULL,
  `IsAssistant` tinyint(1) DEFAULT NULL,
  `DoctorParentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `doctors`
--
DELIMITER $$
CREATE TRIGGER `a_d_Doctors` AFTER DELETE ON `doctors` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Doctors';						SET @pk_d = CONCAT('<DoctorId>',OLD.`DoctorId`,'</DoctorId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Doctors` AFTER INSERT ON `doctors` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Doctors'; 						SET @pk_d = CONCAT('<DoctorId>',NEW.`DoctorId`,'</DoctorId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Doctors` AFTER UPDATE ON `doctors` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Doctors';						SET @pk_d_old = CONCAT('<DoctorId>',OLD.`DoctorId`,'</DoctorId>');						SET @pk_d = CONCAT('<DoctorId>',NEW.`DoctorId`,'</DoctorId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `DonationId` int(11) NOT NULL,
  `DonorId` int(11) DEFAULT NULL,
  `RecipientId` int(11) DEFAULT NULL,
  `DonationDate` date DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `DonationPurpose` varchar(255) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  `Laboratory` varchar(255) DEFAULT NULL,
  `LaboratoryCountry` varchar(255) DEFAULT NULL,
  `Serial` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `donation`
--

INSERT INTO `donation` (`DonationId`, `DonorId`, `RecipientId`, `DonationDate`, `Quantity`, `DonationPurpose`, `UpdatedDate`, `Laboratory`, `LaboratoryCountry`, `Serial`) VALUES
(20, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 1, 2, NULL, 100, NULL, NULL, 'Lab Name', 'Country Name', NULL),
(22, 1, 2, NULL, 100, NULL, NULL, 'Lab Name', 'Country Name', NULL),
(23, 2, 2, NULL, 222, NULL, NULL, 'Sgzgsgg', 'Ggssg', NULL);

--
-- Triggers `donation`
--
DELIMITER $$
CREATE TRIGGER `a_d_Donation` AFTER DELETE ON `donation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Donation';						SET @pk_d = CONCAT('<DonationId>',OLD.`DonationId`,'</DonationId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Donation` AFTER INSERT ON `donation` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Donation'; 						SET @pk_d = CONCAT('<DonationId>',NEW.`DonationId`,'</DonationId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Donation` AFTER UPDATE ON `donation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Donation';						SET @pk_d_old = CONCAT('<DonationId>',OLD.`DonationId`,'</DonationId>');						SET @pk_d = CONCAT('<DonationId>',NEW.`DonationId`,'</DonationId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donor`
--

CREATE TABLE `donor` (
  `DonorId` int(11) NOT NULL,
  `DonorName` varchar(255) DEFAULT NULL,
  `DonorType` varchar(50) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DonorCountry` varchar(100) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `donor`
--

INSERT INTO `donor` (`DonorId`, `DonorName`, `DonorType`, `Address`, `PhoneNumber`, `Email`, `DonorCountry`, `IsActive`, `CreatedDate`, `UpdatedDate`) VALUES
(1, 'John Doe', 'Individual', '123 Main Street', '123-456-7890', 'john@example.com', 'USA', 1, '2024-03-19', '2024-03-19'),
(2, 'Jane fisher', 'Individual', '456 Main Street', '123-456-7890', 'jane@example.com', 'Canada', 1, '2024-03-19', '2024-03-19'),
(3, 'Tonai', 'Organization', 'Zgharté', '03117117', 'tonai@example.com', 'lebanon', 1, '2024-03-20', '2024-03-20'),
(4, 'Nizar Akleh', 'Company', NULL, NULL, NULL, 'France', 1, NULL, NULL);

--
-- Triggers `donor`
--
DELIMITER $$
CREATE TRIGGER `a_d_Donor` AFTER DELETE ON `donor` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Donor';						SET @pk_d = CONCAT('<DonorId>',OLD.`DonorId`,'</DonorId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Donor` AFTER INSERT ON `donor` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Donor'; 						SET @pk_d = CONCAT('<DonorId>',NEW.`DonorId`,'</DonorId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Donor` AFTER UPDATE ON `donor` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Donor';						SET @pk_d_old = CONCAT('<DonorId>',OLD.`DonorId`,'</DonorId>');						SET @pk_d = CONCAT('<DonorId>',NEW.`DonorId`,'</DonorId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `dosage`
--

CREATE TABLE `dosage` (
  `DosageId` int(11) NOT NULL,
  `Numerator` int(11) NOT NULL,
  `Denominator` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `NumeratorUnit` varchar(50) DEFAULT NULL,
  `DenominatorUnit` varchar(50) DEFAULT NULL,
  `DrugID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `dosage`
--

INSERT INTO `dosage` (`DosageId`, `Numerator`, `Denominator`, `CreatedDate`, `UpdatedDate`, `NumeratorUnit`, `DenominatorUnit`, `DrugID`) VALUES
(2, 500, 1, '2024-04-30 07:18:26', NULL, 'mg', 'mg', 1003),
(3, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1018),
(4, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1020),
(5, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1021),
(6, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1022),
(7, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1023),
(8, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1024),
(9, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1025),
(10, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1026),
(11, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1027),
(12, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1028),
(13, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1029),
(14, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1030),
(15, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1031),
(16, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1032),
(17, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1033),
(18, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1034),
(19, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1035),
(20, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1036),
(21, 500, 1, '1753-01-01 00:00:00', NULL, 'mg', 'mg', 1007);

--
-- Triggers `dosage`
--
DELIMITER $$
CREATE TRIGGER `a_d_Dosage` AFTER DELETE ON `dosage` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Dosage';						SET @pk_d = CONCAT('<DosageId>',OLD.`DosageId`,'</DosageId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Dosage` AFTER INSERT ON `dosage` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Dosage'; 						SET @pk_d = CONCAT('<DosageId>',NEW.`DosageId`,'</DosageId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Dosage` AFTER UPDATE ON `dosage` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Dosage';						SET @pk_d_old = CONCAT('<DosageId>',OLD.`DosageId`,'</DosageId>');						SET @pk_d = CONCAT('<DosageId>',NEW.`DosageId`,'</DosageId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `dosageform`
--

CREATE TABLE `dosageform` (
  `DosageFormId` int(11) NOT NULL,
  `Child` varchar(255) NOT NULL,
  `Parent` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL,
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `dosageform`
--

INSERT INTO `dosageform` (`DosageFormId`, `Child`, `Parent`, `CreatedDate`, `UpdatedDate`) VALUES
(1, 'Adhesive plaster', NULL, '2024-04-16 08:28:32', NULL),
(2, 'Caplet, film coated', NULL, '2024-04-16 08:28:32', NULL),
(3, 'Caplet, coated', NULL, '2024-04-16 08:28:32', NULL),
(4, 'Caplet', NULL, '2024-04-16 08:28:32', NULL),
(5, 'Capsule, coated', NULL, '2024-04-16 08:28:32', NULL),
(6, 'Capsule', NULL, '2024-04-16 08:28:32', NULL),
(7, 'Capsule, controlled release / extended release / modified release / prolonged release / slow release / sustained release', NULL, '2024-04-16 08:28:32', NULL),
(8, 'Capsule, delayed release / enteric coated / gastro-resistant', NULL, '2024-04-16 08:28:32', NULL),
(9, 'Capsule, dual release', NULL, '2024-04-16 08:28:32', NULL),
(10, 'Capsule, hard', NULL, '2024-04-16 08:28:32', NULL),
(11, 'Capsule, inhalation', NULL, '2024-04-16 08:28:32', NULL),
(12, 'Capsule, microionized', NULL, '2024-04-16 08:28:32', NULL),
(13, 'Capsule, soft / liquid gel / liquid filled / soft gelatin', NULL, '2024-04-16 08:28:32', NULL),
(14, 'Cream', NULL, '2024-04-16 08:28:32', NULL),
(15, 'Creamgel', NULL, '2024-04-16 08:28:32', NULL),
(16, 'Drops, concentrated', NULL, '2024-04-16 08:28:32', NULL),
(17, 'Drops, solution', NULL, '2024-04-16 08:28:32', NULL),
(18, 'Drops, suspension', NULL, '2024-04-16 08:28:32', NULL),
(19, 'Elixir', NULL, '2024-04-16 08:28:32', NULL),
(20, 'Emulsion', NULL, '2024-04-16 08:28:32', NULL),
(21, 'Enema', NULL, '2024-04-16 08:28:32', NULL),
(22, 'Emulsion Gel', NULL, '2024-04-16 08:28:32', NULL),
(23, 'Film forming solution', NULL, '2024-04-16 08:28:32', NULL),
(24, 'Film, orally soluble', NULL, '2024-04-16 08:28:32', NULL),
(25, 'Film, orodispersible', NULL, '2024-04-16 08:28:32', NULL),
(26, 'Foam', NULL, '2024-04-16 08:28:32', NULL),
(27, 'Gargle / Mouthwash', NULL, '2024-04-16 08:28:32', NULL),
(28, 'Gauze', NULL, '2024-04-16 08:28:32', NULL),
(29, 'Granules', NULL, '2024-04-16 08:28:32', NULL),
(30, 'Gel', NULL, '2024-04-16 08:28:32', NULL),
(31, 'Granules for solution', NULL, '2024-04-16 08:28:32', NULL),
(32, 'Granules for suspension', NULL, '2024-04-16 08:28:32', NULL),
(33, 'Granules, prolonged release', NULL, '2024-04-16 08:28:32', NULL),
(34, 'Granules, effervescent', NULL, '2024-04-16 08:28:32', NULL),
(35, 'Granules, gastro-resistant / delayed release', NULL, '2024-04-16 08:28:32', NULL),
(36, 'Implant', NULL, '2024-04-16 08:28:32', NULL),
(37, 'Injectable concentrate for solution', NULL, '2024-04-16 08:28:32', NULL),
(38, 'Injectable lyophilized / freeze-dried / dry powder', NULL, '2024-04-16 08:28:32', NULL),
(39, 'Injectable solution', NULL, '2024-04-16 08:28:32', NULL),
(40, 'Injectable, powder, for liposomal dispersion', NULL, '2024-04-16 08:28:32', NULL),
(41, 'Injectable, lyophilized / freeze-dried / dry powder, prolonged release', NULL, '2024-04-16 08:28:32', NULL),
(42, 'Injectable, powder, for solution', NULL, '2024-04-16 08:28:32', NULL),
(43, 'Injectable, solution', NULL, '2024-04-16 08:28:32', NULL),
(44, 'Injectable, powder, for suspension, prolonged release', NULL, '2024-04-16 08:28:32', NULL),
(45, 'Jelly', NULL, '2024-04-16 08:28:32', NULL),
(46, 'Lipocream', NULL, '2024-04-16 08:28:32', NULL),
(47, 'Lotion', NULL, '2024-04-16 08:28:32', NULL),
(48, 'Lozenge', NULL, '2024-04-16 08:28:32', NULL),
(49, 'Metered dose spray', NULL, '2024-04-16 08:28:32', NULL),
(50, 'Ointment', NULL, '2024-04-16 08:28:32', NULL),
(51, 'Patch', NULL, '2024-04-16 08:28:32', NULL),
(52, '88-TRIAL-Pessary 212', '80-TRIAL- 199', '2024-04-16 08:28:32', NULL),
(53, '97-TRIAL-Powder 106', '35-TRIAL- 12', '2024-04-16 08:28:32', NULL),
(54, '188-TRIAL-Powder, effervescent 96', '50-TRIAL- 239', '2024-04-16 08:28:32', NULL),
(55, '299-TRIAL-Powder, for solution 102', '231-TRIAL- 115', '2024-04-16 08:28:32', NULL),
(56, '27-TRIAL-Powder, for suspension 159', '257-TRIAL- 107', '2024-04-16 08:28:32', NULL),
(57, '200-TRIAL-Powder, inhalation 142', '20-TRIAL- 271', '2024-04-16 08:28:32', NULL),
(58, '84-TRIAL-Rotacaps 271', '113-TRIAL- 199', '2024-04-16 08:28:32', NULL),
(59, '288-TRIAL-Pulvule 128', '192-TRIAL- 83', '2024-04-16 08:28:32', NULL),
(60, '235-TRIAL-Respule 66', '3-TRIAL- 39', '2024-04-16 08:28:32', NULL),
(61, '168-TRIAL-Ring 60', '261-TRIAL- 224', '2024-04-16 08:28:32', NULL),
(62, '87-TRIAL-Shampoo 200', '10-TRIAL- 294', '2024-04-16 08:28:32', NULL),
(63, '139-TRIAL-Solution 247', '184-TRIAL- 48', '2024-04-16 08:28:32', NULL),
(64, '90-TRIAL-Solution, film forming 266', '227-TRIAL- 229', '2024-04-16 08:28:32', NULL),
(65, '8-TRIAL-Solution, inhalation 102', '93-TRIAL- 40', '2024-04-16 08:28:32', NULL),
(66, '72-TRIAL-Spray 284', '134-TRIAL- 110', '2024-04-16 08:28:32', NULL),
(67, '29-TRIAL-Suspension, inhalation 213', '98-TRIAL- 254', '2024-04-16 08:28:32', NULL),
(68, '140-TRIAL-Syrup 43', '102-TRIAL- 50', '2024-04-16 08:28:32', NULL),
(69, '287-TRIAL-Tablet 265', '107-TRIAL- 224', '2024-04-16 08:28:32', NULL),
(70, '69-TRIAL-Suppository 276', '201-TRIAL- 211', '2024-04-16 08:28:32', NULL),
(71, '183-TRIAL-Tablet, chewable 31', '237-TRIAL- 55', '2024-04-16 08:28:32', NULL),
(72, '67-TRIAL-Tablet, coated 291', '125-TRIAL- 166', '2024-04-16 08:28:32', NULL),
(73, '178-TRIAL-Tablet, controlled release / extended release / modified release / prolonged release / slow release / sustained release 122', '8-TRIAL- 265', '2024-04-16 08:28:32', NULL),
(74, '252-TRIAL-Tablet, repetab 17', '156-TRIAL- 94', '2024-04-16 08:28:32', NULL),
(75, '74-TRIAL-Tablet, dispersible 200', '155-TRIAL- 131', '2024-04-16 08:28:32', NULL),
(76, '11-TRIAL-Tablet, effervescent 183', '50-TRIAL- 175', '2024-04-16 08:28:32', NULL),
(77, '112-TRIAL-Tablet, delayed release / enteric coated / gastro-resistant 294', '148-TRIAL- 52', '2024-04-16 08:28:32', NULL),
(78, '136-TRIAL-Tablet, film coated 88', '126-TRIAL- 233', '2024-04-16 08:28:32', NULL),
(79, '148-TRIAL-Tablet, microgranules 96', '185-TRIAL- 296', '2024-04-16 08:28:32', NULL),
(80, '6-TRIAL-Tablet, lyophilised / freeze-dried 115', '212-TRIAL- 226', '2024-04-16 08:28:32', NULL),
(81, '276-TRIAL-Tablet, sugar coated 102', '184-TRIAL- 214', '2024-04-16 08:28:32', NULL),
(82, '211-TRIAL-Tablet, orally disintegrating / mouth dissolving / orodispersible 187', '89-TRIAL- 152', '2024-04-16 08:28:32', NULL),
(83, '25-TRIAL-Vaginal delivery system 209', '95-TRIAL- 147', '2024-04-16 08:28:32', NULL),
(84, '104-TRIAL-Volatile liquid 165', '162-TRIAL- 24', '2024-04-16 08:28:32', NULL),
(85, '176-TRIAL-Water, for injection / for irrigation 142', '281-TRIAL- 168', '2024-04-16 08:28:32', NULL);

--
-- Triggers `dosageform`
--
DELIMITER $$
CREATE TRIGGER `a_d_DosageForm` AFTER DELETE ON `dosageform` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DosageForm';						SET @pk_d = CONCAT('<DosageFormId>',OLD.`DosageFormId`,'</DosageFormId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DosageForm` AFTER INSERT ON `dosageform` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DosageForm'; 						SET @pk_d = CONCAT('<DosageFormId>',NEW.`DosageFormId`,'</DosageFormId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DosageForm` AFTER UPDATE ON `dosageform` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DosageForm';						SET @pk_d_old = CONCAT('<DosageFormId>',OLD.`DosageFormId`,'</DosageFormId>');						SET @pk_d = CONCAT('<DosageFormId>',NEW.`DosageFormId`,'</DosageFormId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `dosageformmapping`
--

CREATE TABLE `dosageformmapping` (
  `DosageFormMappingId` int(11) NOT NULL,
  `DosageId` int(11) NOT NULL,
  `DosageFormId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `dosageformmapping`
--

INSERT INTO `dosageformmapping` (`DosageFormMappingId`, `DosageId`, `DosageFormId`) VALUES
(1, 2, 1),
(2, 3, 80),
(3, 4, 80),
(4, 5, 80),
(5, 6, 80),
(6, 7, 80),
(7, 8, 80),
(8, 9, 80),
(9, 10, 80),
(10, 11, 80),
(11, 12, 80),
(12, 13, 80),
(13, 14, 80),
(14, 15, 80),
(15, 16, 80),
(16, 17, 80),
(17, 18, 80),
(18, 19, 80),
(19, 20, 80),
(20, 21, 80);

--
-- Triggers `dosageformmapping`
--
DELIMITER $$
CREATE TRIGGER `a_d_DosageFormMapping` AFTER DELETE ON `dosageformmapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DosageFormMapping';						SET @pk_d = CONCAT('<DosageFormMappingId>',OLD.`DosageFormMappingId`,'</DosageFormMappingId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DosageFormMapping` AFTER INSERT ON `dosageformmapping` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DosageFormMapping'; 						SET @pk_d = CONCAT('<DosageFormMappingId>',NEW.`DosageFormMappingId`,'</DosageFormMappingId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DosageFormMapping` AFTER UPDATE ON `dosageformmapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DosageFormMapping';						SET @pk_d_old = CONCAT('<DosageFormMappingId>',OLD.`DosageFormMappingId`,'</DosageFormMappingId>');						SET @pk_d = CONCAT('<DosageFormMappingId>',NEW.`DosageFormMappingId`,'</DosageFormMappingId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drug`
--

CREATE TABLE `drug` (
  `DrugID` int(11) NOT NULL,
  `DrugName` varchar(255) DEFAULT NULL,
  `ManufacturerID` int(11) DEFAULT NULL,
  `RegistrationNumber` varchar(255) DEFAULT NULL,
  `GTIN` varchar(255) DEFAULT NULL,
  `Notes` longtext DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `IngredientAndStrength` text DEFAULT NULL,
  `Indication` text DEFAULT NULL,
  `Posology` text DEFAULT NULL,
  `MethodOfAdministration` text DEFAULT NULL,
  `Contraindications` text DEFAULT NULL,
  `PrecautionForUse` text DEFAULT NULL,
  `EffectOnFGN` text DEFAULT NULL,
  `SideEffect` text DEFAULT NULL,
  `Toxicity` text DEFAULT NULL,
  `StorageCondition` text DEFAULT NULL,
  `ShelfLife` text DEFAULT NULL,
  `IngredientLabel` text DEFAULT NULL,
  `Price` decimal(18,6) DEFAULT NULL,
  `ImagesPath` longtext DEFAULT NULL,
  `ImageDefault` tinyint(1) DEFAULT NULL,
  `InteractionIngredientName` varchar(255) DEFAULT NULL,
  `IsDouanes` tinyint(1) DEFAULT NULL,
  `RegistrationDate` date DEFAULT NULL,
  `PublicPrice` decimal(18,6) DEFAULT NULL,
  `SubsidyLabel` varchar(255) DEFAULT NULL,
  `SubsidyPercentage` decimal(18,6) DEFAULT NULL,
  `HospPricing` tinyint(1) DEFAULT NULL,
  `Substitutable` tinyint(1) DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL,
  `OtherIngredients` text DEFAULT NULL,
  `ATCRelatedIngredient` text DEFAULT NULL,
  `ReviewDate` date DEFAULT NULL,
  `MoPHCode` varchar(10) DEFAULT NULL,
  `CargoShippingTerms` varchar(255) DEFAULT NULL,
  `ProductType` varchar(255) DEFAULT NULL,
  `NotMarketed` tinyint(1) DEFAULT NULL,
  `DFSequence` varchar(255) DEFAULT NULL,
  `PriceForeign` decimal(18,6) DEFAULT NULL,
  `CurrencyForeign` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `drug`
--

INSERT INTO `drug` (`DrugID`, `DrugName`, `ManufacturerID`, `RegistrationNumber`, `GTIN`, `Notes`, `Description`, `IngredientAndStrength`, `Indication`, `Posology`, `MethodOfAdministration`, `Contraindications`, `PrecautionForUse`, `EffectOnFGN`, `SideEffect`, `Toxicity`, `StorageCondition`, `ShelfLife`, `IngredientLabel`, `Price`, `ImagesPath`, `ImageDefault`, `InteractionIngredientName`, `IsDouanes`, `RegistrationDate`, `PublicPrice`, `SubsidyLabel`, `SubsidyPercentage`, `HospPricing`, `Substitutable`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`, `OtherIngredients`, `ATCRelatedIngredient`, `ReviewDate`, `MoPHCode`, `CargoShippingTerms`, `ProductType`, `NotMarketed`, `DFSequence`, `PriceForeign`, `CurrencyForeign`) VALUES
(1003, 'Panadol', 1, '123-456', '12345678999943', 'Sample notes', 'Sample description 22', 'Ingredient and strength details', 'Indication details', 'Posology details', 'Method of administration details', 'Contraindications details', 'Precaution for use details', 'Effect on FGN details', 'Side effect details', 'Toxicity details', 'Storage condition details', 'Shelf life details', 'Ingredient label details', '15.990000', 'Path to images', 1, 'Interaction ingredient name', 0, '2022-01-01', '12.990000', 'Subsidy label', '0.100000', 1, 1, '{D4D05329-BF55-4969-86D4-B3F43EE85EB6}', NULL, '{EB73273C-E126-4AEB-87B5-3C0BAFAAFC2B}', NULL, 'Other ingredients details', 'ATC related ingredient details', '2023-01-01', '123456', 'CIF', 'Product type details', 0, 'DF sequence details', '85.990000', '{4F4C77B2-994C-4348-9D28-1EB12E31AFFF}'),
(1007, 'Zoloft', 1, '123-456-789', '7908236800124', 'zoloft note test', 'desc1', 'erosasf', 'dfsfasf', 'ewrwfsdf', 'sdfdfasf', 'sdfsdfs', 'sdfdfsd', 'sdfsdf', 'strinsdfsdfg', 'sdfSDF', 'SDFDFGDFG', 'TYRTY', 'DFSDF', '8.000000', 'img\\Zoloft.jpeg', 1, 'DFGDFG', 1, '2024-03-20', '11.000000', 'DFGDG', '0.000000', 1, 1, '{680286EA-359E-4D38-89B6-731A3B8B75D9}', '2024-03-20', '{B60669CB-0633-46E8-BBFA-FE67212BAE45}', '2024-03-20', 'SDFSDF', 'SDFSDF', '2024-03-20', 'DFGDFG', 'SDFSF', 'SDFSDF', 1, 'DFGDFG', '8.000000', '{FEFBE499-9467-4B2A-997C-5629144E83CA}'),
(1008, 'Advil', 1, '111', '11111111111111', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '0.000000', 'string', 1, 'string', 1, '2024-03-20', '0.000000', 'string', '0.000000', 1, 1, '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-03-20', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-02-29', 'string', 'string', '2024-03-20', 'string', 'string', 'string', 1, 'string', '55.000000', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}'),
(1009, 'Nexium', 1, '111', '11111111111111', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '234234.000000', 'string', 1, 'string', 1, '2024-03-20', '0.000000', 'string', '0.000000', 1, 1, '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-03-20', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-02-29', 'string', 'string', '2024-03-20', 'string', 'string', 'string', 1, 'string', '2342340.000000', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}'),
(1016, 'EFFERALGAN', 1, '27717', 'string', 'string', 'string', 'Paracetamol', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '0.000000', 'string', 1, 'string', 1, '2024-04-22', '0.000000', 'string', '0.000000', 1, 1, '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-04-22', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-04-22', 'string', 'string', '2024-04-22', '196', 'string', 'B', 1, '1', '0.000000', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}'),
(1017, 'ADOL', 1, '7884598', 'string', 'string', 'string', 'Paracetamol', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', '0.000000', 'string', 1, 'string', 1, '2024-04-22', '0.000000', 'string', '0.000000', 1, 1, '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-04-22', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}', '2024-04-22', 'string', 'string', '2024-04-22', '3436', 'string', 'B', 1, '12', '0.000000', '{3FA85F64-5717-4562-B3FC-2C963F66AFA6}'),
(1018, 'Albuterol Inhaler', 1, 'DRX-123456', '06285101000072', NULL, 'Relief of bronchospasm in patients with reversible obstructive airway disease', 'Albuterol Sulfate 90 mcg per actuation', 'Bronchial asthma, COPD', '2 puffs every 4-6 hours as needed, not to exceed 12 puffs in 24 hours', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1020, 'Amoxicillin Capsule', 1, 'DRX-654321', '0009876543210', NULL, 'Treatment of a variety of bacterial infections', 'Amoxicillin 500mg capsule', 'Bacterial infections of the respiratory tract, skin, and urinary tract', 'Adults: 500mg every 8 hours for 7-10 days', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1021, 'Aspirin Tablet', 1, 'DRX-987654', '0001122334456', NULL, 'Pain relief and fever reduction', 'Aspirin 325mg tablet', 'Pain, fever, and inflammation', 'Adults: 325mg to 650mg every 4-6 hours as needed', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imglondon-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1022, 'Cetirizine Tablet', 1, 'DRX-234567', '0007890123456', NULL, 'Relief of allergy symptoms', 'Cetirizine Hydrochloride 10mg tablet', 'Allergic rhinitis, hay fever', 'Adults: 10mg once daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1023, 'Cialis Tablet', 1, 'DRX-543210', '0003456789012', NULL, 'Treatment of erectile dysfunction', 'Tadalafil 20mg tablet', 'Erectile dysfunction', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1024, 'Claritin D Tablet', 1, 'DRX-876543', '06251600000332', NULL, 'Relief of allergy symptoms with decongestant', 'Loratadine 10mg, Pseudoephedrine 120mg tablet', 'Allergic rhinitis, hay fever', 'Adults: 1 tablet twice daily, not to exceed 4 per day', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imglondon-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1025, 'Fluoxetine Capsule', 1, 'DRX-109876', '0002345678901', NULL, 'Treatment of depression and obsessive-compulsive disorder', 'Fluoxetine 20mg capsule', 'Depression, OCD', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1026, 'Ibuprofen Tablet', 1, 'DRX-432109', '06285074001113', NULL, 'Pain relief and fever reduction', 'Ibuprofen 400mg tablet', 'Pain, fever, and inflammation', 'Adults: 400mg to 800mg every 4-6 hours as needed', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1027, 'Lisinopril Tablet', 1, 'DRX-765432', '0006789012345', NULL, 'Treatment of high blood pressure', 'Lisinopril 20mg tablet', 'Hypertension', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imglondon-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1028, 'Metformin Tablet', 1, 'DRX-098765', '0004567890123', NULL, 'Treatment of type 2 diabetes mellitus', 'Metformin 500mg tablet', 'Type 2 diabetes mellitus', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1029, 'Omeprazole Capsule', 1, 'DRX-321098', '0009876543211', NULL, 'Treatment of peptic ulcers and gastroesophageal reflux disease (GERD)', 'Omeprazole 20mg capsule', 'Peptic ulcers, GERD', 'Adults: 20mg once daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1030, 'Prednisolone Tablet', 1, 'DRX-543219', '0007890123457', NULL, 'Treatment of a variety of inflammatory conditions', 'Prednisolone 5mg tablet', 'Autoimmune diseases, allergies, asthma', 'Adults: Dosage varies depending on the condition', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imglondon-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1031, 'Simvastatin Tablet', 1, 'DRX-876540', '0005678901235', NULL, 'Treatment of high cholesterol and to reduce the risk of heart disease', 'Simvastatin 20mg tablet', 'High cholesterol, heart disease prevention', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1032, 'Salbutamol Inhaler', 1, 'DRX-109875', '0002345678902', NULL, 'Relief of bronchospasm in patients with asthma or COPD', 'Salbutamol 100 mcg per actuation', 'Asthma, COPD', 'Adults and children: As needed for shortness of breath', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1033, 'Thyroxine Tablet', 1, 'DRX-210987', '0008901234568', NULL, 'Replacement therapy for low thyroid hormone levels', 'Levothyroxine sodium (Thyroxine) various mg tablets', 'Hypothyroidism', 'Adults: Dosage varies depending on individual needs', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imglondon-uk-october-th-packet-ibuprofen-painkillers-closeup-blister-pack-tablets-bell-s-healthcare-london-uk-162660294.webp', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1034, 'Tramadol Capsule', 1, 'DRX-432108', '0006789012346', NULL, 'Treatment of moderate to severe pain', 'Tramadol hydrochloride 50mg capsule', 'Pain management', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'img\\47b0d3102550727.5f39872bc803f.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1035, 'Zoloft Capsule', 1, 'DRX-543217', '0004567890124', NULL, 'Treatment of depression and anxiety disorders', 'Sertraline hydrochloride (Zoloft) various mg capsules', 'Depression, anxiety', 'Adults: As directed by a physician', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', 'imgimages.jpeg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1036, 'Azithromycin Tablet', 1, 'DRX-765431', '0002345678903', NULL, 'Treatment of a variety of bacterial infections', 'Azithromycin 250mg tablet', 'Bacterial infections of the respiratory tract, skin, and others', 'Adults: Dosage varies depending on the infection', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24.000000', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Triggers `drug`
--
DELIMITER $$
CREATE TRIGGER `a_d_Drug` AFTER DELETE ON `drug` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Drug';						SET @pk_d = CONCAT('<DrugID>',OLD.`DrugID`,'</DrugID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Drug` AFTER INSERT ON `drug` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Drug'; 						SET @pk_d = CONCAT('<DrugID>',NEW.`DrugID`,'</DrugID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Drug` AFTER UPDATE ON `drug` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Drug';						SET @pk_d_old = CONCAT('<DrugID>',OLD.`DrugID`,'</DrugID>');						SET @pk_d = CONCAT('<DrugID>',NEW.`DrugID`,'</DrugID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugbrands`
--

CREATE TABLE `drugbrands` (
  `DrugId` int(11) NOT NULL,
  `BrandId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `drugbrands`
--
DELIMITER $$
CREATE TRIGGER `a_d_drugBrands` AFTER DELETE ON `drugbrands` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'drugBrands';						SET @pk_d = CONCAT('<DrugId>',OLD.`DrugId`,'</DrugId>','<BrandId>',OLD.`BrandId`,'</BrandId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_drugBrands` AFTER INSERT ON `drugbrands` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'drugBrands'; 						SET @pk_d = CONCAT('<DrugId>',NEW.`DrugId`,'</DrugId>','<BrandId>',NEW.`BrandId`,'</BrandId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_drugBrands` AFTER UPDATE ON `drugbrands` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'drugBrands';						SET @pk_d_old = CONCAT('<DrugId>',OLD.`DrugId`,'</DrugId>','<BrandId>',OLD.`BrandId`,'</BrandId>');						SET @pk_d = CONCAT('<DrugId>',NEW.`DrugId`,'</DrugId>','<BrandId>',NEW.`BrandId`,'</BrandId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugdispensingconditions`
--

CREATE TABLE `drugdispensingconditions` (
  `DrugID` int(11) NOT NULL,
  `DispensingConditionsID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `drugdispensingconditions`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugDispensingConditions` AFTER DELETE ON `drugdispensingconditions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugDispensingConditions';						SET @pk_d = CONCAT('<DrugID>',OLD.`DrugID`,'</DrugID>','<DispensingConditionsID>',OLD.`DispensingConditionsID`,'</DispensingConditionsID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugDispensingConditions` AFTER INSERT ON `drugdispensingconditions` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugDispensingConditions'; 						SET @pk_d = CONCAT('<DrugID>',NEW.`DrugID`,'</DrugID>','<DispensingConditionsID>',NEW.`DispensingConditionsID`,'</DispensingConditionsID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugDispensingConditions` AFTER UPDATE ON `drugdispensingconditions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugDispensingConditions';						SET @pk_d_old = CONCAT('<DrugID>',OLD.`DrugID`,'</DrugID>','<DispensingConditionsID>',OLD.`DispensingConditionsID`,'</DispensingConditionsID>');						SET @pk_d = CONCAT('<DrugID>',NEW.`DrugID`,'</DrugID>','<DispensingConditionsID>',NEW.`DispensingConditionsID`,'</DispensingConditionsID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugform`
--

CREATE TABLE `drugform` (
  `DrugFormId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `FormId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `drugform`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugForm` AFTER DELETE ON `drugform` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugForm';						SET @pk_d = CONCAT('<DrugFormId>',OLD.`DrugFormId`,'</DrugFormId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugForm` AFTER INSERT ON `drugform` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugForm'; 						SET @pk_d = CONCAT('<DrugFormId>',NEW.`DrugFormId`,'</DrugFormId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugForm` AFTER UPDATE ON `drugform` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugForm';						SET @pk_d_old = CONCAT('<DrugFormId>',OLD.`DrugFormId`,'</DrugFormId>');						SET @pk_d = CONCAT('<DrugFormId>',NEW.`DrugFormId`,'</DrugFormId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugimage`
--

CREATE TABLE `drugimage` (
  `ImageId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `ImagePath` varchar(255) NOT NULL,
  `ImageExtension` varchar(5) NOT NULL,
  `Description` text DEFAULT NULL,
  `IsDefault` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `drugimage`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugImage` AFTER DELETE ON `drugimage` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugImage';						SET @pk_d = CONCAT('<ImageId>',OLD.`ImageId`,'</ImageId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugImage` AFTER INSERT ON `drugimage` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugImage'; 						SET @pk_d = CONCAT('<ImageId>',NEW.`ImageId`,'</ImageId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugImage` AFTER UPDATE ON `drugimage` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugImage';						SET @pk_d_old = CONCAT('<ImageId>',OLD.`ImageId`,'</ImageId>');						SET @pk_d = CONCAT('<ImageId>',NEW.`ImageId`,'</ImageId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `druginteraction`
--

CREATE TABLE `druginteraction` (
  `DrugInteractionID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `Interaction` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `druginteraction`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugInteraction` AFTER DELETE ON `druginteraction` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugInteraction';						SET @pk_d = CONCAT('<DrugInteractionID>',OLD.`DrugInteractionID`,'</DrugInteractionID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugInteraction` AFTER INSERT ON `druginteraction` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugInteraction'; 						SET @pk_d = CONCAT('<DrugInteractionID>',NEW.`DrugInteractionID`,'</DrugInteractionID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugInteraction` AFTER UPDATE ON `druginteraction` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugInteraction';						SET @pk_d_old = CONCAT('<DrugInteractionID>',OLD.`DrugInteractionID`,'</DrugInteractionID>');						SET @pk_d = CONCAT('<DrugInteractionID>',NEW.`DrugInteractionID`,'</DrugInteractionID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `druginteractions`
--

CREATE TABLE `druginteractions` (
  `DrugInteractionID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `Interaction` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `druginteractions`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugInteractions` AFTER DELETE ON `druginteractions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugInteractions';						SET @pk_d = CONCAT('<DrugInteractionID>',OLD.`DrugInteractionID`,'</DrugInteractionID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugInteractions` AFTER INSERT ON `druginteractions` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugInteractions'; 						SET @pk_d = CONCAT('<DrugInteractionID>',NEW.`DrugInteractionID`,'</DrugInteractionID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugInteractions` AFTER UPDATE ON `druginteractions` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugInteractions';						SET @pk_d_old = CONCAT('<DrugInteractionID>',OLD.`DrugInteractionID`,'</DrugInteractionID>');						SET @pk_d = CONCAT('<DrugInteractionID>',NEW.`DrugInteractionID`,'</DrugInteractionID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `druglabel`
--

CREATE TABLE `druglabel` (
  `LabelId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `Code` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `SubsidyValue` decimal(18,3) NOT NULL,
  `IsSpecialFormula` tinyint(1) NOT NULL DEFAULT 0,
  `FormulaOperator` varchar(5) DEFAULT NULL,
  `FormulaValue` decimal(18,3) DEFAULT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `druglabel`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugLabel` AFTER DELETE ON `druglabel` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugLabel';						SET @pk_d = CONCAT('<LabelId>',OLD.`LabelId`,'</LabelId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugLabel` AFTER INSERT ON `druglabel` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugLabel'; 						SET @pk_d = CONCAT('<LabelId>',NEW.`LabelId`,'</LabelId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugLabel` AFTER UPDATE ON `druglabel` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugLabel';						SET @pk_d_old = CONCAT('<LabelId>',OLD.`LabelId`,'</LabelId>');						SET @pk_d = CONCAT('<LabelId>',NEW.`LabelId`,'</LabelId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugpresentation`
--

CREATE TABLE `drugpresentation` (
  `PresentationId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `Amount` decimal(18,3) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `TypeId` int(11) DEFAULT NULL,
  `PackageType` varchar(255) DEFAULT NULL,
  `PackageAmount` decimal(18,3) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `drugpresentation`
--

INSERT INTO `drugpresentation` (`PresentationId`, `DrugId`, `Amount`, `UnitId`, `TypeId`, `PackageType`, `PackageAmount`, `CreatedDate`, `UpdatedDate`) VALUES
(1, 1003, '12.000', 1, 24, 'tablet', '2.000', '2024-04-30 07:58:17', NULL),
(2, 1018, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(3, 1020, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(4, 1021, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(5, 1022, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(6, 1023, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(7, 1024, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(8, 1025, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(9, 1026, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(10, 1027, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(11, 1028, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(12, 1029, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(13, 1030, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(14, 1031, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(15, 1032, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(16, 1033, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(17, 1034, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(18, 1035, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(19, 1036, '34.000', 5, 34, 'Carton Box', '34.000', '1753-01-01 00:00:00', NULL),
(20, 1007, '34.000', 6, 53, NULL, '34.000', '1753-01-01 00:00:00', NULL);

--
-- Triggers `drugpresentation`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugPresentation` AFTER DELETE ON `drugpresentation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugPresentation';						SET @pk_d = CONCAT('<PresentationId>',OLD.`PresentationId`,'</PresentationId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugPresentation` AFTER INSERT ON `drugpresentation` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugPresentation'; 						SET @pk_d = CONCAT('<PresentationId>',NEW.`PresentationId`,'</PresentationId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugPresentation` AFTER UPDATE ON `drugpresentation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugPresentation';						SET @pk_d_old = CONCAT('<PresentationId>',OLD.`PresentationId`,'</PresentationId>');						SET @pk_d = CONCAT('<PresentationId>',NEW.`PresentationId`,'</PresentationId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugroute`
--

CREATE TABLE `drugroute` (
  `DrugRouteId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `RouteId` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `drugroute`
--

INSERT INTO `drugroute` (`DrugRouteId`, `DrugId`, `RouteId`, `CreatedDate`, `UpdatedDate`) VALUES
(3, 1003, 1, '2024-04-30 07:33:24', NULL),
(4, 1018, 1, '1753-01-01 00:00:00', NULL),
(24, 1020, 1, '1753-01-01 00:00:00', NULL),
(25, 1021, 1, '1753-01-01 00:00:00', NULL),
(26, 1022, 1, '1753-01-01 00:00:00', NULL),
(27, 1023, 1, '1753-01-01 00:00:00', NULL),
(28, 1024, 1, '1753-01-01 00:00:00', NULL),
(29, 1025, 1, '1753-01-01 00:00:00', NULL),
(30, 1026, 1, '1753-01-01 00:00:00', NULL),
(31, 1027, 1, '1753-01-01 00:00:00', NULL),
(32, 1028, 1, '1753-01-01 00:00:00', NULL),
(33, 1029, 1, '1753-01-01 00:00:00', NULL),
(34, 1030, 1, '1753-01-01 00:00:00', NULL),
(35, 1031, 1, '1753-01-01 00:00:00', NULL),
(36, 1032, 1, '1753-01-01 00:00:00', NULL),
(37, 1033, 1, '1753-01-01 00:00:00', NULL),
(38, 1034, 1, '1753-01-01 00:00:00', NULL),
(39, 1035, 1, '1753-01-01 00:00:00', NULL),
(40, 1036, 1, '1753-01-01 00:00:00', NULL),
(41, 1007, 1, '1753-01-01 00:00:00', NULL);

--
-- Triggers `drugroute`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugRoute` AFTER DELETE ON `drugroute` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugRoute';						SET @pk_d = CONCAT('<DrugRouteId>',OLD.`DrugRouteId`,'</DrugRouteId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugRoute` AFTER INSERT ON `drugroute` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugRoute'; 						SET @pk_d = CONCAT('<DrugRouteId>',NEW.`DrugRouteId`,'</DrugRouteId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugRoute` AFTER UPDATE ON `drugroute` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugRoute';						SET @pk_d_old = CONCAT('<DrugRouteId>',OLD.`DrugRouteId`,'</DrugRouteId>');						SET @pk_d = CONCAT('<DrugRouteId>',NEW.`DrugRouteId`,'</DrugRouteId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugstratum`
--

CREATE TABLE `drugstratum` (
  `DrugStratumId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `StratumTypeId` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `drugstratum`
--

INSERT INTO `drugstratum` (`DrugStratumId`, `DrugId`, `StratumTypeId`, `CreatedDate`, `UpdatedDate`) VALUES
(1, 1003, 1, '2024-04-30 09:11:41', NULL),
(2, 1018, 1, '1753-01-01 00:00:00', NULL),
(3, 1020, 1, '1753-01-01 00:00:00', NULL),
(4, 1021, 1, '1753-01-01 00:00:00', NULL),
(5, 1022, 1, '1753-01-01 00:00:00', NULL),
(6, 1023, 1, '1753-01-01 00:00:00', NULL),
(7, 1024, 1, '1753-01-01 00:00:00', NULL),
(8, 1025, 1, '1753-01-01 00:00:00', NULL),
(9, 1026, 1, '1753-01-01 00:00:00', NULL),
(10, 1027, 1, '1753-01-01 00:00:00', NULL),
(11, 1028, 1, '1753-01-01 00:00:00', NULL),
(12, 1029, 1, '1753-01-01 00:00:00', NULL),
(13, 1030, 1, '1753-01-01 00:00:00', NULL),
(14, 1031, 1, '1753-01-01 00:00:00', NULL),
(15, 1032, 1, '1753-01-01 00:00:00', NULL),
(16, 1033, 1, '1753-01-01 00:00:00', NULL),
(17, 1034, 1, '1753-01-01 00:00:00', NULL),
(18, 1035, 1, '1753-01-01 00:00:00', NULL),
(19, 1036, 1, '1753-01-01 00:00:00', NULL),
(20, 1007, 1, '1753-01-01 00:00:00', NULL);

--
-- Triggers `drugstratum`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugStratum` AFTER DELETE ON `drugstratum` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugStratum';						SET @pk_d = CONCAT('<DrugStratumId>',OLD.`DrugStratumId`,'</DrugStratumId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugStratum` AFTER INSERT ON `drugstratum` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugStratum'; 						SET @pk_d = CONCAT('<DrugStratumId>',NEW.`DrugStratumId`,'</DrugStratumId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugStratum` AFTER UPDATE ON `drugstratum` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugStratum';						SET @pk_d_old = CONCAT('<DrugStratumId>',OLD.`DrugStratumId`,'</DrugStratumId>');						SET @pk_d = CONCAT('<DrugStratumId>',NEW.`DrugStratumId`,'</DrugStratumId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drugtreatment`
--

CREATE TABLE `drugtreatment` (
  `DrugTreatmentId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `TreatmentTypeId` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `drugtreatment`
--
DELIMITER $$
CREATE TRIGGER `a_d_DrugTreatment` AFTER DELETE ON `drugtreatment` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugTreatment';						SET @pk_d = CONCAT('<DrugTreatmentId>',OLD.`DrugTreatmentId`,'</DrugTreatmentId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_DrugTreatment` AFTER INSERT ON `drugtreatment` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'DrugTreatment'; 						SET @pk_d = CONCAT('<DrugTreatmentId>',NEW.`DrugTreatmentId`,'</DrugTreatmentId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_DrugTreatment` AFTER UPDATE ON `drugtreatment` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'DrugTreatment';						SET @pk_d_old = CONCAT('<DrugTreatmentId>',OLD.`DrugTreatmentId`,'</DrugTreatmentId>');						SET @pk_d = CONCAT('<DrugTreatmentId>',NEW.`DrugTreatmentId`,'</DrugTreatmentId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `drug_atc_mapping`
--

CREATE TABLE `drug_atc_mapping` (
  `MappingID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `ATC_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `drug_atc_mapping`
--

INSERT INTO `drug_atc_mapping` (`MappingID`, `DrugID`, `ATC_ID`) VALUES
(7, 1016, 5169),
(8, 1003, 5169),
(9, 1017, 5169),
(10, 1018, 601),
(11, 1020, 601),
(12, 1021, 601),
(13, 1022, 601),
(14, 1023, 601),
(15, 1023, 601),
(16, 1023, 601),
(17, 1023, 601),
(18, 1024, 601),
(19, 1025, 601),
(20, 1026, 601),
(21, 1027, 602),
(22, 1028, 602),
(23, 1029, 602),
(24, 1030, 602),
(25, 1031, 602),
(26, 1032, 602),
(27, 1033, 602),
(28, 1034, 602),
(29, 1035, 602),
(30, 1036, 602),
(31, 1007, 601);

--
-- Triggers `drug_atc_mapping`
--
DELIMITER $$
CREATE TRIGGER `a_d_Drug_ATC_Mapping` AFTER DELETE ON `drug_atc_mapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Drug_ATC_Mapping';						SET @pk_d = CONCAT('<MappingID>',OLD.`MappingID`,'</MappingID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Drug_ATC_Mapping` AFTER INSERT ON `drug_atc_mapping` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Drug_ATC_Mapping'; 						SET @pk_d = CONCAT('<MappingID>',NEW.`MappingID`,'</MappingID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Drug_ATC_Mapping` AFTER UPDATE ON `drug_atc_mapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Drug_ATC_Mapping';						SET @pk_d_old = CONCAT('<MappingID>',OLD.`MappingID`,'</MappingID>');						SET @pk_d = CONCAT('<MappingID>',NEW.`MappingID`,'</MappingID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `form`
--

CREATE TABLE `form` (
  `FormId` int(11) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `form`
--
DELIMITER $$
CREATE TRIGGER `a_d_Form` AFTER DELETE ON `form` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Form';						SET @pk_d = CONCAT('<FormId>',OLD.`FormId`,'</FormId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Form` AFTER INSERT ON `form` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Form'; 						SET @pk_d = CONCAT('<FormId>',NEW.`FormId`,'</FormId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Form` AFTER UPDATE ON `form` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Form';						SET @pk_d_old = CONCAT('<FormId>',OLD.`FormId`,'</FormId>');						SET @pk_d = CONCAT('<FormId>',NEW.`FormId`,'</FormId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `formparent`
--

CREATE TABLE `formparent` (
  `FormParentId` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `formparent`
--
DELIMITER $$
CREATE TRIGGER `a_d_FormParent` AFTER DELETE ON `formparent` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'FormParent';						SET @pk_d = CONCAT('<FormParentId>',OLD.`FormParentId`,'</FormParentId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_FormParent` AFTER INSERT ON `formparent` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'FormParent'; 						SET @pk_d = CONCAT('<FormParentId>',NEW.`FormParentId`,'</FormParentId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_FormParent` AFTER UPDATE ON `formparent` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'FormParent';						SET @pk_d_old = CONCAT('<FormParentId>',OLD.`FormParentId`,'</FormParentId>');						SET @pk_d = CONCAT('<FormParentId>',NEW.`FormParentId`,'</FormParentId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `governoratedistrictmapping`
--

CREATE TABLE `governoratedistrictmapping` (
  `GovernorateId` int(11) NOT NULL,
  `DistrictId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `governoratedistrictmapping`
--
DELIMITER $$
CREATE TRIGGER `a_d_GovernorateDistrictMapping` AFTER DELETE ON `governoratedistrictmapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'GovernorateDistrictMapping';						SET @pk_d = CONCAT('<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>','<DistrictId>',OLD.`DistrictId`,'</DistrictId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_GovernorateDistrictMapping` AFTER INSERT ON `governoratedistrictmapping` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'GovernorateDistrictMapping'; 						SET @pk_d = CONCAT('<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>','<DistrictId>',NEW.`DistrictId`,'</DistrictId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_GovernorateDistrictMapping` AFTER UPDATE ON `governoratedistrictmapping` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'GovernorateDistrictMapping';						SET @pk_d_old = CONCAT('<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>','<DistrictId>',OLD.`DistrictId`,'</DistrictId>');						SET @pk_d = CONCAT('<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>','<DistrictId>',NEW.`DistrictId`,'</DistrictId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `governorates`
--

CREATE TABLE `governorates` (
  `GovernorateId` int(11) NOT NULL,
  `CountryId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `governorates`
--
DELIMITER $$
CREATE TRIGGER `a_d_Governorates` AFTER DELETE ON `governorates` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Governorates';						SET @pk_d = CONCAT('<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Governorates` AFTER INSERT ON `governorates` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Governorates'; 						SET @pk_d = CONCAT('<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Governorates` AFTER UPDATE ON `governorates` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Governorates';						SET @pk_d_old = CONCAT('<GovernorateId>',OLD.`GovernorateId`,'</GovernorateId>');						SET @pk_d = CONCAT('<GovernorateId>',NEW.`GovernorateId`,'</GovernorateId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `history_store`
--

CREATE TABLE `history_store` (
  `timemark` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `table_name` tinytext NOT NULL,
  `pk_date_src` text NOT NULL,
  `pk_date_dest` text NOT NULL,
  `record_state` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `history_store`
--

INSERT INTO `history_store` (`timemark`, `table_name`, `pk_date_src`, `pk_date_dest`, `record_state`) VALUES
('2024-05-06 23:15:30', 'Agent', '<AgentID>1</AgentID>', '<AgentID>1</AgentID>', 2),
('2024-05-08 12:04:05', 'Donor', '<DonorId>4</DonorId>', '<DonorId>4</DonorId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>10</DosageId>', '<DosageId>10</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>11</DosageId>', '<DosageId>11</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>12</DosageId>', '<DosageId>12</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>13</DosageId>', '<DosageId>13</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>14</DosageId>', '<DosageId>14</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>15</DosageId>', '<DosageId>15</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>16</DosageId>', '<DosageId>16</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>17</DosageId>', '<DosageId>17</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>18</DosageId>', '<DosageId>18</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>19</DosageId>', '<DosageId>19</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>20</DosageId>', '<DosageId>20</DosageId>', 1),
('2024-05-09 08:28:58', 'Dosage', '<DosageId>21</DosageId>', '<DosageId>21</DosageId>', 1),
('2024-05-06 23:45:32', 'Dosage', '<DosageId>3</DosageId>', '<DosageId>3</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>4</DosageId>', '<DosageId>4</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>5</DosageId>', '<DosageId>5</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>6</DosageId>', '<DosageId>6</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>7</DosageId>', '<DosageId>7</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>8</DosageId>', '<DosageId>8</DosageId>', 1),
('2024-05-06 23:48:13', 'Dosage', '<DosageId>9</DosageId>', '<DosageId>9</DosageId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>10</DosageFormMappingId>', '<DosageFormMappingId>10</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>11</DosageFormMappingId>', '<DosageFormMappingId>11</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>12</DosageFormMappingId>', '<DosageFormMappingId>12</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>13</DosageFormMappingId>', '<DosageFormMappingId>13</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>14</DosageFormMappingId>', '<DosageFormMappingId>14</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>15</DosageFormMappingId>', '<DosageFormMappingId>15</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>16</DosageFormMappingId>', '<DosageFormMappingId>16</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>17</DosageFormMappingId>', '<DosageFormMappingId>17</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>18</DosageFormMappingId>', '<DosageFormMappingId>18</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>19</DosageFormMappingId>', '<DosageFormMappingId>19</DosageFormMappingId>', 1),
('2024-05-09 08:30:36', 'DosageFormMapping', '<DosageFormMappingId>20</DosageFormMappingId>', '<DosageFormMappingId>20</DosageFormMappingId>', 1),
('2024-05-07 14:05:57', 'DosageFormMapping', '<DosageFormMappingId>2</DosageFormMappingId>', '<DosageFormMappingId>2</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>3</DosageFormMappingId>', '<DosageFormMappingId>3</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>4</DosageFormMappingId>', '<DosageFormMappingId>4</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>5</DosageFormMappingId>', '<DosageFormMappingId>5</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>6</DosageFormMappingId>', '<DosageFormMappingId>6</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>7</DosageFormMappingId>', '<DosageFormMappingId>7</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>8</DosageFormMappingId>', '<DosageFormMappingId>8</DosageFormMappingId>', 1),
('2024-05-07 14:07:55', 'DosageFormMapping', '<DosageFormMappingId>9</DosageFormMappingId>', '<DosageFormMappingId>9</DosageFormMappingId>', 1),
('2024-05-09 08:27:36', 'Drug', '<DrugID>1007</DrugID>', '<DrugID>1007</DrugID>', 2),
('2024-05-08 04:07:20', 'Drug', '<DrugID>1018</DrugID>', '<DrugID>1018</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1020</DrugID>', '<DrugID>1020</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1021</DrugID>', '<DrugID>1021</DrugID>', 1),
('2024-05-07 14:13:16', 'Drug', '<DrugID>1022</DrugID>', '<DrugID>1022</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1023</DrugID>', '<DrugID>1023</DrugID>', 1),
('2024-05-08 04:09:55', 'Drug', '<DrugID>1024</DrugID>', '<DrugID>1024</DrugID>', 1),
('2024-05-07 14:13:16', 'Drug', '<DrugID>1025</DrugID>', '<DrugID>1025</DrugID>', 1),
('2024-05-08 04:08:32', 'Drug', '<DrugID>1026</DrugID>', '<DrugID>1026</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1027</DrugID>', '<DrugID>1027</DrugID>', 1),
('2024-05-07 14:13:16', 'Drug', '<DrugID>1028</DrugID>', '<DrugID>1028</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1029</DrugID>', '<DrugID>1029</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1030</DrugID>', '<DrugID>1030</DrugID>', 1),
('2024-05-07 14:13:16', 'Drug', '<DrugID>1031</DrugID>', '<DrugID>1031</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1032</DrugID>', '<DrugID>1032</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1033</DrugID>', '<DrugID>1033</DrugID>', 1),
('2024-05-07 14:12:02', 'Drug', '<DrugID>1034</DrugID>', '<DrugID>1034</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1035</DrugID>', '<DrugID>1035</DrugID>', 1),
('2024-05-07 14:21:53', 'Drug', '<DrugID>1036</DrugID>', '<DrugID>1036</DrugID>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>10</PresentationId>', '<PresentationId>10</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>11</PresentationId>', '<PresentationId>11</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>12</PresentationId>', '<PresentationId>12</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>13</PresentationId>', '<PresentationId>13</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>14</PresentationId>', '<PresentationId>14</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>15</PresentationId>', '<PresentationId>15</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>16</PresentationId>', '<PresentationId>16</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>17</PresentationId>', '<PresentationId>17</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>18</PresentationId>', '<PresentationId>18</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>19</PresentationId>', '<PresentationId>19</PresentationId>', 1),
('2024-05-09 08:31:40', 'DrugPresentation', '<PresentationId>20</PresentationId>', '<PresentationId>20</PresentationId>', 1),
('2024-05-06 23:55:29', 'DrugPresentation', '<PresentationId>2</PresentationId>', '<PresentationId>2</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>3</PresentationId>', '<PresentationId>3</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>4</PresentationId>', '<PresentationId>4</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>5</PresentationId>', '<PresentationId>5</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>6</PresentationId>', '<PresentationId>6</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>7</PresentationId>', '<PresentationId>7</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>8</PresentationId>', '<PresentationId>8</PresentationId>', 1),
('2024-05-06 23:56:20', 'DrugPresentation', '<PresentationId>9</PresentationId>', '<PresentationId>9</PresentationId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>24</DrugRouteId>', '<DrugRouteId>24</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>25</DrugRouteId>', '<DrugRouteId>25</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>26</DrugRouteId>', '<DrugRouteId>26</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>27</DrugRouteId>', '<DrugRouteId>27</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>28</DrugRouteId>', '<DrugRouteId>28</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>29</DrugRouteId>', '<DrugRouteId>29</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>30</DrugRouteId>', '<DrugRouteId>30</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>31</DrugRouteId>', '<DrugRouteId>31</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>32</DrugRouteId>', '<DrugRouteId>32</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>33</DrugRouteId>', '<DrugRouteId>33</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>34</DrugRouteId>', '<DrugRouteId>34</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>35</DrugRouteId>', '<DrugRouteId>35</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>36</DrugRouteId>', '<DrugRouteId>36</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>37</DrugRouteId>', '<DrugRouteId>37</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>38</DrugRouteId>', '<DrugRouteId>38</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>39</DrugRouteId>', '<DrugRouteId>39</DrugRouteId>', 1),
('2024-05-06 23:52:37', 'DrugRoute', '<DrugRouteId>40</DrugRouteId>', '<DrugRouteId>40</DrugRouteId>', 1),
('2024-05-09 08:32:02', 'DrugRoute', '<DrugRouteId>41</DrugRouteId>', '<DrugRouteId>41</DrugRouteId>', 1),
('2024-05-06 23:51:11', 'DrugRoute', '<DrugRouteId>4</DrugRouteId>', '<DrugRouteId>4</DrugRouteId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>10</DrugStratumId>', '<DrugStratumId>10</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>11</DrugStratumId>', '<DrugStratumId>11</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>12</DrugStratumId>', '<DrugStratumId>12</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>13</DrugStratumId>', '<DrugStratumId>13</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>14</DrugStratumId>', '<DrugStratumId>14</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>15</DrugStratumId>', '<DrugStratumId>15</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>16</DrugStratumId>', '<DrugStratumId>16</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>17</DrugStratumId>', '<DrugStratumId>17</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>18</DrugStratumId>', '<DrugStratumId>18</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>19</DrugStratumId>', '<DrugStratumId>19</DrugStratumId>', 1),
('2024-05-09 08:32:30', 'DrugStratum', '<DrugStratumId>20</DrugStratumId>', '<DrugStratumId>20</DrugStratumId>', 1),
('2024-05-06 23:57:12', 'DrugStratum', '<DrugStratumId>2</DrugStratumId>', '<DrugStratumId>2</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>3</DrugStratumId>', '<DrugStratumId>3</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>4</DrugStratumId>', '<DrugStratumId>4</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>5</DrugStratumId>', '<DrugStratumId>5</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>6</DrugStratumId>', '<DrugStratumId>6</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>7</DrugStratumId>', '<DrugStratumId>7</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>8</DrugStratumId>', '<DrugStratumId>8</DrugStratumId>', 1),
('2024-05-06 23:57:53', 'DrugStratum', '<DrugStratumId>9</DrugStratumId>', '<DrugStratumId>9</DrugStratumId>', 1),
('2024-05-06 23:39:42', 'Drug_ATC_Mapping', '<MappingID>10</MappingID>', '<MappingID>10</MappingID>', 1),
('2024-05-06 23:39:56', 'Drug_ATC_Mapping', '<MappingID>11</MappingID>', '<MappingID>11</MappingID>', 1),
('2024-05-06 23:40:25', 'Drug_ATC_Mapping', '<MappingID>12</MappingID>', '<MappingID>12</MappingID>', 1),
('2024-05-06 23:41:05', 'Drug_ATC_Mapping', '<MappingID>13</MappingID>', '<MappingID>13</MappingID>', 1),
('2024-05-06 23:41:05', 'Drug_ATC_Mapping', '<MappingID>14</MappingID>', '<MappingID>14</MappingID>', 1),
('2024-05-06 23:41:05', 'Drug_ATC_Mapping', '<MappingID>15</MappingID>', '<MappingID>15</MappingID>', 1),
('2024-05-06 23:41:05', 'Drug_ATC_Mapping', '<MappingID>16</MappingID>', '<MappingID>16</MappingID>', 1),
('2024-05-06 23:41:05', 'Drug_ATC_Mapping', '<MappingID>17</MappingID>', '<MappingID>17</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>18</MappingID>', '<MappingID>18</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>19</MappingID>', '<MappingID>19</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>20</MappingID>', '<MappingID>20</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>21</MappingID>', '<MappingID>21</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>22</MappingID>', '<MappingID>22</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>23</MappingID>', '<MappingID>23</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>24</MappingID>', '<MappingID>24</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>25</MappingID>', '<MappingID>25</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>26</MappingID>', '<MappingID>26</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>27</MappingID>', '<MappingID>27</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>28</MappingID>', '<MappingID>28</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>29</MappingID>', '<MappingID>29</MappingID>', 1),
('2024-05-06 23:42:53', 'Drug_ATC_Mapping', '<MappingID>30</MappingID>', '<MappingID>30</MappingID>', 1),
('2024-05-09 08:28:17', 'Drug_ATC_Mapping', '<MappingID>31</MappingID>', '<MappingID>31</MappingID>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>12</SubstituteId>', '<SubstituteId>12</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>13</SubstituteId>', '<SubstituteId>13</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>14</SubstituteId>', '<SubstituteId>14</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>15</SubstituteId>', '<SubstituteId>15</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>16</SubstituteId>', '<SubstituteId>16</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>17</SubstituteId>', '<SubstituteId>17</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>18</SubstituteId>', '<SubstituteId>18</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>19</SubstituteId>', '<SubstituteId>19</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>20</SubstituteId>', '<SubstituteId>20</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>21</SubstituteId>', '<SubstituteId>21</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>22</SubstituteId>', '<SubstituteId>22</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>23</SubstituteId>', '<SubstituteId>23</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>24</SubstituteId>', '<SubstituteId>24</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>25</SubstituteId>', '<SubstituteId>25</SubstituteId>', 1),
('2024-05-07 14:04:16', 'Substitute', '<SubstituteId>26</SubstituteId>', '<SubstituteId>26</SubstituteId>', 1),
('2024-05-09 08:41:15', 'operation', '<ID>1</ID>', '<ID>1</ID>', 2),
('2024-05-08 05:22:47', 'operation', '<ID>2</ID>', '<ID>2</ID>', 2);

-- --------------------------------------------------------

--
-- Table structure for table `hospital`
--

CREATE TABLE `hospital` (
  `hospitalName` varchar(255) NOT NULL,
  `categoryType` varchar(10) NOT NULL,
  `isPrivate` tinyint(1) NOT NULL DEFAULT 0,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `hospital`
--

INSERT INTO `hospital` (`hospitalName`, `categoryType`, `isPrivate`, `ID`) VALUES
('Hospital 1', 'first', 0, 1),
('Hospital 2', 'second', 1, 2);

--
-- Triggers `hospital`
--
DELIMITER $$
CREATE TRIGGER `a_d_Hospital` AFTER DELETE ON `hospital` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Hospital';						SET @pk_d = CONCAT('<ID>',OLD.`ID`,'</ID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Hospital` AFTER INSERT ON `hospital` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Hospital'; 						SET @pk_d = CONCAT('<ID>',NEW.`ID`,'</ID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Hospital` AFTER UPDATE ON `hospital` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Hospital';						SET @pk_d_old = CONCAT('<ID>',OLD.`ID`,'</ID>');						SET @pk_d = CONCAT('<ID>',NEW.`ID`,'</ID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hospitaloperationmapping`
--

CREATE TABLE `hospitaloperationmapping` (
  `OperationId` int(11) DEFAULT NULL,
  `HospitalId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `hospitaloperationmapping`
--

INSERT INTO `hospitaloperationmapping` (`OperationId`, `HospitalId`) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 1),
(1, 2),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `importation`
--

CREATE TABLE `importation` (
  `ImportationID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `ImportDate` date DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `importation`
--
DELIMITER $$
CREATE TRIGGER `a_d_Importation` AFTER DELETE ON `importation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Importation';						SET @pk_d = CONCAT('<ImportationID>',OLD.`ImportationID`,'</ImportationID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Importation` AFTER INSERT ON `importation` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Importation'; 						SET @pk_d = CONCAT('<ImportationID>',NEW.`ImportationID`,'</ImportationID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Importation` AFTER UPDATE ON `importation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Importation';						SET @pk_d_old = CONCAT('<ImportationID>',OLD.`ImportationID`,'</ImportationID>');						SET @pk_d = CONCAT('<ImportationID>',NEW.`ImportationID`,'</ImportationID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `InventoryID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `ExpirationDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `inventory`
--
DELIMITER $$
CREATE TRIGGER `a_d_Inventory` AFTER DELETE ON `inventory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Inventory';						SET @pk_d = CONCAT('<InventoryID>',OLD.`InventoryID`,'</InventoryID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Inventory` AFTER INSERT ON `inventory` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Inventory'; 						SET @pk_d = CONCAT('<InventoryID>',NEW.`InventoryID`,'</InventoryID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Inventory` AFTER UPDATE ON `inventory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Inventory';						SET @pk_d_old = CONCAT('<InventoryID>',OLD.`InventoryID`,'</InventoryID>');						SET @pk_d = CONCAT('<InventoryID>',NEW.`InventoryID`,'</InventoryID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `operation`
--

CREATE TABLE `operation` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `System` varchar(255) DEFAULT NULL,
  `Description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `operation`
--

INSERT INTO `operation` (`ID`, `Name`, `Code`, `System`, `Description`) VALUES
(1, 'Operation 1', '4102', 'CardioVascular', NULL),
(2, 'Operation 2', '3340', 'Digestive', NULL);

--
-- Triggers `operation`
--
DELIMITER $$
CREATE TRIGGER `a_d_operation` AFTER DELETE ON `operation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'operation';						SET @pk_d = CONCAT('<ID>',OLD.`ID`,'</ID>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_operation` AFTER INSERT ON `operation` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'operation'; 						SET @pk_d = CONCAT('<ID>',NEW.`ID`,'</ID>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_operation` AFTER UPDATE ON `operation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'operation';						SET @pk_d_old = CONCAT('<ID>',OLD.`ID`,'</ID>');						SET @pk_d = CONCAT('<ID>',NEW.`ID`,'</ID>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `operationshare`
--

CREATE TABLE `operationshare` (
  `OperationId` int(11) DEFAULT NULL,
  `Category1` decimal(5,2) DEFAULT NULL,
  `Category2` decimal(5,2) DEFAULT NULL,
  `Category3` decimal(5,2) DEFAULT NULL,
  `isPrivate` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `operationshare`
--

INSERT INTO `operationshare` (`OperationId`, `Category1`, `Category2`, `Category3`, `isPrivate`) VALUES
(1, '0.10', '0.20', '0.30', 0),
(2, '0.40', '0.50', '0.60', 1),
(1, '0.10', '0.20', '0.30', 0),
(2, '0.40', '0.50', '0.60', 1),
(2, '0.50', '0.60', '0.20', 0),
(1, '0.50', '0.60', '0.20', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `PatientId` int(11) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `patients`
--
DELIMITER $$
CREATE TRIGGER `a_d_Patients` AFTER DELETE ON `patients` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Patients';						SET @pk_d = CONCAT('<PatientId>',OLD.`PatientId`,'</PatientId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Patients` AFTER INSERT ON `patients` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Patients'; 						SET @pk_d = CONCAT('<PatientId>',NEW.`PatientId`,'</PatientId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Patients` AFTER UPDATE ON `patients` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Patients';						SET @pk_d_old = CONCAT('<PatientId>',OLD.`PatientId`,'</PatientId>');						SET @pk_d = CONCAT('<PatientId>',NEW.`PatientId`,'</PatientId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy`
--

CREATE TABLE `pharmacy` (
  `PharmacyId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `IsClerk` tinyint(1) DEFAULT NULL,
  `PharmacyParentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `pharmacy`
--
DELIMITER $$
CREATE TRIGGER `a_d_Pharmacy` AFTER DELETE ON `pharmacy` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Pharmacy';						SET @pk_d = CONCAT('<PharmacyId>',OLD.`PharmacyId`,'</PharmacyId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Pharmacy` AFTER INSERT ON `pharmacy` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Pharmacy'; 						SET @pk_d = CONCAT('<PharmacyId>',NEW.`PharmacyId`,'</PharmacyId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Pharmacy` AFTER UPDATE ON `pharmacy` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Pharmacy';						SET @pk_d_old = CONCAT('<PharmacyId>',OLD.`PharmacyId`,'</PharmacyId>');						SET @pk_d = CONCAT('<PharmacyId>',NEW.`PharmacyId`,'</PharmacyId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `PrescriptionId` int(11) NOT NULL,
  `PatientId` int(11) DEFAULT NULL,
  `DoctorId` int(11) DEFAULT NULL,
  `MedicationName` varchar(100) DEFAULT NULL,
  `Dosage` varchar(50) DEFAULT NULL,
  `Instructions` varchar(255) DEFAULT NULL,
  `PrescriptionDate` date DEFAULT NULL,
  `IsDigital` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `prescription`
--
DELIMITER $$
CREATE TRIGGER `a_d_Prescription` AFTER DELETE ON `prescription` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Prescription';						SET @pk_d = CONCAT('<PrescriptionId>',OLD.`PrescriptionId`,'</PrescriptionId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Prescription` AFTER INSERT ON `prescription` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Prescription'; 						SET @pk_d = CONCAT('<PrescriptionId>',NEW.`PrescriptionId`,'</PrescriptionId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Prescription` AFTER UPDATE ON `prescription` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Prescription';						SET @pk_d_old = CONCAT('<PrescriptionId>',OLD.`PrescriptionId`,'</PrescriptionId>');						SET @pk_d = CONCAT('<PrescriptionId>',NEW.`PrescriptionId`,'</PrescriptionId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `presentationtype`
--

CREATE TABLE `presentationtype` (
  `PresentationTypeId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL,
  `Definition` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `presentationtype`
--

INSERT INTO `presentationtype` (`PresentationTypeId`, `Name`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `Definition`) VALUES
(23, 'Bottle', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(24, 'Ampule', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(25, 'Applicator', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(26, 'Bag ', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(27, 'Blister', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(28, 'Box', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(29, 'Canister', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(30, 'Cartridge', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(31, 'Inhaler', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(32, 'Inhaler refill', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(33, 'Pen', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(34, 'Pack', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(35, 'Kit', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(36, 'Not stated', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(37, 'Syringe', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(38, 'Penfill', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(39, 'Packet / Sachet', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(40, 'Vial', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(41, 'Pre-filled pen', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(42, 'Tube', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(43, 'Pre-filled syringe', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(44, 'New ', '2024-04-17 14:05:34', NULL, NULL, NULL, NULL),
(45, 'Ampule', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(46, 'Applicator', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(47, 'Bag ', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(48, 'Blister', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(49, 'Bottle', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(50, 'Box', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(51, 'Canister', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(52, 'Inhaler', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(53, 'Cartridge', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(54, 'Inhaler refill', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(55, 'Packet / Sachet', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(56, 'Penfill', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(57, 'Syringe', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(58, 'Kit', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(59, 'Not stated', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(60, 'Pack', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(61, 'Pen', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(62, 'Pre-filled pen', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(63, 'Pre-filled syringe', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(64, 'Tube', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(65, 'Vial', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL),
(66, 'New ', '2024-04-17 14:54:53', NULL, NULL, NULL, NULL);

--
-- Triggers `presentationtype`
--
DELIMITER $$
CREATE TRIGGER `a_d_PresentationType` AFTER DELETE ON `presentationtype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PresentationType';						SET @pk_d = CONCAT('<PresentationTypeId>',OLD.`PresentationTypeId`,'</PresentationTypeId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_PresentationType` AFTER INSERT ON `presentationtype` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'PresentationType'; 						SET @pk_d = CONCAT('<PresentationTypeId>',NEW.`PresentationTypeId`,'</PresentationTypeId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_PresentationType` AFTER UPDATE ON `presentationtype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PresentationType';						SET @pk_d_old = CONCAT('<PresentationTypeId>',OLD.`PresentationTypeId`,'</PresentationTypeId>');						SET @pk_d = CONCAT('<PresentationTypeId>',NEW.`PresentationTypeId`,'</PresentationTypeId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `presentationunit`
--

CREATE TABLE `presentationunit` (
  `PresentationUnitId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL,
  `ValueType` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `presentationunit`
--

INSERT INTO `presentationunit` (`PresentationUnitId`, `Name`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `ValueType`) VALUES
(1, 'mg', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(2, 'g', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(3, 'L', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(4, 'ml', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(5, 'pill', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(6, 'dose', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL),
(7, 'New', '2024-04-17 14:01:40', NULL, NULL, NULL, NULL);

--
-- Triggers `presentationunit`
--
DELIMITER $$
CREATE TRIGGER `a_d_PresentationUnit` AFTER DELETE ON `presentationunit` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PresentationUnit';						SET @pk_d = CONCAT('<PresentationUnitId>',OLD.`PresentationUnitId`,'</PresentationUnitId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_PresentationUnit` AFTER INSERT ON `presentationunit` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'PresentationUnit'; 						SET @pk_d = CONCAT('<PresentationUnitId>',NEW.`PresentationUnitId`,'</PresentationUnitId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_PresentationUnit` AFTER UPDATE ON `presentationunit` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PresentationUnit';						SET @pk_d_old = CONCAT('<PresentationUnitId>',OLD.`PresentationUnitId`,'</PresentationUnitId>');						SET @pk_d = CONCAT('<PresentationUnitId>',NEW.`PresentationUnitId`,'</PresentationUnitId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pricehistory`
--

CREATE TABLE `pricehistory` (
  `PriceHistoryId` int(11) NOT NULL,
  `DrugId` int(11) DEFAULT NULL,
  `Price` decimal(18,6) DEFAULT NULL,
  `EffectiveDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `pricehistory`
--
DELIMITER $$
CREATE TRIGGER `a_d_PriceHistory` AFTER DELETE ON `pricehistory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PriceHistory';						SET @pk_d = CONCAT('<PriceHistoryId>',OLD.`PriceHistoryId`,'</PriceHistoryId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_PriceHistory` AFTER INSERT ON `pricehistory` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'PriceHistory'; 						SET @pk_d = CONCAT('<PriceHistoryId>',NEW.`PriceHistoryId`,'</PriceHistoryId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_PriceHistory` AFTER UPDATE ON `pricehistory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'PriceHistory';						SET @pk_d_old = CONCAT('<PriceHistoryId>',OLD.`PriceHistoryId`,'</PriceHistoryId>');						SET @pk_d = CONCAT('<PriceHistoryId>',NEW.`PriceHistoryId`,'</PriceHistoryId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `recipient`
--

CREATE TABLE `recipient` (
  `RecipientId` int(11) NOT NULL,
  `RecipientName` varchar(255) DEFAULT NULL,
  `RecipientType` varchar(50) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `ContactPerson` varchar(255) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `UpdatedDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `recipient`
--

INSERT INTO `recipient` (`RecipientId`, `RecipientName`, `RecipientType`, `Address`, `City`, `Country`, `ContactPerson`, `ContactNumber`, `IsActive`, `CreatedDate`, `UpdatedDate`) VALUES
(1, 'Caritas', 'Organisation', 'Mono Street', 'Beirut', 'Lebanon', 'Mhamad', '1234567889', 1, '2024-03-21', '2024-03-21'),
(2, 'Red Cross', 'Organisation', 'BadaroStreet', 'Beirut', 'Lebanon', 'Ziad', '54785136', 1, '2024-03-21', '2024-03-21'),
(3, 'MOPH', 'Ministry', 'Jnah', 'Beirut', 'Lebanon', 'Colette', '01-830300', 1, '2024-03-21', '2024-03-21');

--
-- Triggers `recipient`
--
DELIMITER $$
CREATE TRIGGER `a_d_Recipient` AFTER DELETE ON `recipient` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Recipient';						SET @pk_d = CONCAT('<RecipientId>',OLD.`RecipientId`,'</RecipientId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Recipient` AFTER INSERT ON `recipient` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Recipient'; 						SET @pk_d = CONCAT('<RecipientId>',NEW.`RecipientId`,'</RecipientId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Recipient` AFTER UPDATE ON `recipient` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Recipient';						SET @pk_d_old = CONCAT('<RecipientId>',OLD.`RecipientId`,'</RecipientId>');						SET @pk_d = CONCAT('<RecipientId>',NEW.`RecipientId`,'</RecipientId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `RoleId` int(11) NOT NULL,
  `RoleName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `roles`
--
DELIMITER $$
CREATE TRIGGER `a_d_Roles` AFTER DELETE ON `roles` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Roles';						SET @pk_d = CONCAT('<RoleId>',OLD.`RoleId`,'</RoleId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Roles` AFTER INSERT ON `roles` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Roles'; 						SET @pk_d = CONCAT('<RoleId>',NEW.`RoleId`,'</RoleId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Roles` AFTER UPDATE ON `roles` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Roles';						SET @pk_d_old = CONCAT('<RoleId>',OLD.`RoleId`,'</RoleId>');						SET @pk_d = CONCAT('<RoleId>',NEW.`RoleId`,'</RoleId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `RouteId` int(11) NOT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Definition` longtext DEFAULT NULL,
  `IsChild` tinyint(1) NOT NULL DEFAULT 0,
  `ParentId` int(11) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`RouteId`, `Code`, `Name`, `NameAr`, `Definition`, `IsChild`, `ParentId`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES
(1, '1', 'Oral', 'فموي', NULL, 0, NULL, '2024-04-30 07:32:45', NULL, NULL, NULL);

--
-- Triggers `route`
--
DELIMITER $$
CREATE TRIGGER `a_d_Route` AFTER DELETE ON `route` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Route';						SET @pk_d = CONCAT('<RouteId>',OLD.`RouteId`,'</RouteId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Route` AFTER INSERT ON `route` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Route'; 						SET @pk_d = CONCAT('<RouteId>',NEW.`RouteId`,'</RouteId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Route` AFTER UPDATE ON `route` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Route';						SET @pk_d_old = CONCAT('<RouteId>',OLD.`RouteId`,'</RouteId>');						SET @pk_d = CONCAT('<RouteId>',NEW.`RouteId`,'</RouteId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `shippinginformation`
--

CREATE TABLE `shippinginformation` (
  `ShippingId` int(11) NOT NULL,
  `DrugId` int(11) DEFAULT NULL,
  `CarrierName` varchar(100) DEFAULT NULL,
  `TrackingNumber` varchar(50) DEFAULT NULL,
  `ShippingDate` date DEFAULT NULL,
  `DeliveryStatus` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `shippinginformation`
--
DELIMITER $$
CREATE TRIGGER `a_d_ShippingInformation` AFTER DELETE ON `shippinginformation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ShippingInformation';						SET @pk_d = CONCAT('<ShippingId>',OLD.`ShippingId`,'</ShippingId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_ShippingInformation` AFTER INSERT ON `shippinginformation` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'ShippingInformation'; 						SET @pk_d = CONCAT('<ShippingId>',NEW.`ShippingId`,'</ShippingId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_ShippingInformation` AFTER UPDATE ON `shippinginformation` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'ShippingInformation';						SET @pk_d_old = CONCAT('<ShippingId>',OLD.`ShippingId`,'</ShippingId>');						SET @pk_d = CONCAT('<ShippingId>',NEW.`ShippingId`,'</ShippingId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `stratumtype`
--

CREATE TABLE `stratumtype` (
  `StratumTypeId` int(11) NOT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `stratumtype`
--

INSERT INTO `stratumtype` (`StratumTypeId`, `Code`, `Description`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'A', '25%', '2024-04-30 09:11:14', NULL, NULL, NULL);

--
-- Triggers `stratumtype`
--
DELIMITER $$
CREATE TRIGGER `a_d_StratumType` AFTER DELETE ON `stratumtype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'StratumType';						SET @pk_d = CONCAT('<StratumTypeId>',OLD.`StratumTypeId`,'</StratumTypeId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_StratumType` AFTER INSERT ON `stratumtype` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'StratumType'; 						SET @pk_d = CONCAT('<StratumTypeId>',NEW.`StratumTypeId`,'</StratumTypeId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_StratumType` AFTER UPDATE ON `stratumtype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'StratumType';						SET @pk_d_old = CONCAT('<StratumTypeId>',OLD.`StratumTypeId`,'</StratumTypeId>');						SET @pk_d = CONCAT('<StratumTypeId>',NEW.`StratumTypeId`,'</StratumTypeId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `strengthunit`
--

CREATE TABLE `strengthunit` (
  `id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `strengthunit`
--

INSERT INTO `strengthunit` (`id`, `value`) VALUES
(1, 'billions/g'),
(2, 'g'),
(3, '%'),
(4, 'billions'),
(5, 'CCID50'),
(6, 'ELISA units/ml'),
(7, 'g/g'),
(8, 'g/L'),
(9, 'mg/g'),
(10, 'g/ml'),
(11, 'IU/g'),
(12, 'IR or IC/ml'),
(13, 'IU/ml'),
(14, 'LRU'),
(15, 'IU'),
(16, 'IU/actuation'),
(17, 'IU/drop'),
(18, 'LSU'),
(19, 'mcg'),
(20, 'mcg/mcg'),
(21, 'mcg/ml'),
(22, 'mcg/dose'),
(23, 'mcg/g'),
(24, 'mcg/mg'),
(25, 'mcg/ml'),
(26, 'mcl/ml'),
(27, 'mg'),
(28, 'MIU'),
(29, 'MIU/ml'),
(30, 'ml'),
(31, 'ml/l'),
(32, 'ml/ml'),
(33, 'PFU'),
(34, 'U.CEIP'),
(35, 'U/ml'),
(36, 'U.CEIP/ml'),
(37, 'units LD50');

--
-- Triggers `strengthunit`
--
DELIMITER $$
CREATE TRIGGER `a_d_StrengthUnit` AFTER DELETE ON `strengthunit` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'StrengthUnit';						SET @pk_d = CONCAT('<id>',OLD.`id`,'</id>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_StrengthUnit` AFTER INSERT ON `strengthunit` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'StrengthUnit'; 						SET @pk_d = CONCAT('<id>',NEW.`id`,'</id>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_StrengthUnit` AFTER UPDATE ON `strengthunit` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'StrengthUnit';						SET @pk_d_old = CONCAT('<id>',OLD.`id`,'</id>');						SET @pk_d = CONCAT('<id>',NEW.`id`,'</id>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `substitute`
--

CREATE TABLE `substitute` (
  `SubstituteId` int(11) NOT NULL,
  `Drug` int(11) DEFAULT NULL,
  `Substitute` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `substitute`
--

INSERT INTO `substitute` (`SubstituteId`, `Drug`, `Substitute`) VALUES
(1, 1003, 1007),
(2, 1003, 1016),
(3, 1016, 1003),
(6, 1017, 1016),
(7, 1016, 1017),
(8, 1017, 1003),
(9, 1003, 1017),
(10, 1017, 1017),
(11, 1017, 1017),
(12, 1018, 1020),
(13, 1020, 1018),
(14, 1018, 1021),
(15, 1021, 1018),
(16, 1018, 1022),
(17, 1022, 1018),
(18, 1018, 1023),
(19, 1023, 1018),
(20, 1018, 1024),
(21, 1024, 1018),
(22, 1025, 1018),
(23, 1018, 1025),
(24, 1018, 1026),
(25, 1027, 1028),
(26, 1028, 1027);

--
-- Triggers `substitute`
--
DELIMITER $$
CREATE TRIGGER `a_d_Substitute` AFTER DELETE ON `substitute` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Substitute';						SET @pk_d = CONCAT('<SubstituteId>',OLD.`SubstituteId`,'</SubstituteId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Substitute` AFTER INSERT ON `substitute` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Substitute'; 						SET @pk_d = CONCAT('<SubstituteId>',NEW.`SubstituteId`,'</SubstituteId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Substitute` AFTER UPDATE ON `substitute` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Substitute';						SET @pk_d_old = CONCAT('<SubstituteId>',OLD.`SubstituteId`,'</SubstituteId>');						SET @pk_d = CONCAT('<SubstituteId>',NEW.`SubstituteId`,'</SubstituteId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transactionhistory`
--

CREATE TABLE `transactionhistory` (
  `TransactionId` int(11) NOT NULL,
  `TransactionType` varchar(100) DEFAULT NULL,
  `TransactionDate` datetime DEFAULT NULL,
  `DrugId` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `TransactionDescription` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `transactionhistory`
--
DELIMITER $$
CREATE TRIGGER `a_d_TransactionHistory` AFTER DELETE ON `transactionhistory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'TransactionHistory';						SET @pk_d = CONCAT('<TransactionId>',OLD.`TransactionId`,'</TransactionId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_TransactionHistory` AFTER INSERT ON `transactionhistory` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'TransactionHistory'; 						SET @pk_d = CONCAT('<TransactionId>',NEW.`TransactionId`,'</TransactionId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_TransactionHistory` AFTER UPDATE ON `transactionhistory` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'TransactionHistory';						SET @pk_d_old = CONCAT('<TransactionId>',OLD.`TransactionId`,'</TransactionId>');						SET @pk_d = CONCAT('<TransactionId>',NEW.`TransactionId`,'</TransactionId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `treatmenttype`
--

CREATE TABLE `treatmenttype` (
  `TreatmentTypeId` int(11) NOT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `NameAr` varchar(255) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT '1753-01-01 00:00:00',
  `UpdatedDate` datetime DEFAULT NULL,
  `CreatedBy` char(38) DEFAULT NULL,
  `UpdatedBy` char(38) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `treatmenttype`
--
DELIMITER $$
CREATE TRIGGER `a_d_TreatmentType` AFTER DELETE ON `treatmenttype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'TreatmentType';						SET @pk_d = CONCAT('<TreatmentTypeId>',OLD.`TreatmentTypeId`,'</TreatmentTypeId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_TreatmentType` AFTER INSERT ON `treatmenttype` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'TreatmentType'; 						SET @pk_d = CONCAT('<TreatmentTypeId>',NEW.`TreatmentTypeId`,'</TreatmentTypeId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_TreatmentType` AFTER UPDATE ON `treatmenttype` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'TreatmentType';						SET @pk_d_old = CONCAT('<TreatmentTypeId>',OLD.`TreatmentTypeId`,'</TreatmentTypeId>');						SET @pk_d = CONCAT('<TreatmentTypeId>',NEW.`TreatmentTypeId`,'</TreatmentTypeId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `useraccounts`
--

CREATE TABLE `useraccounts` (
  `UserId` int(11) NOT NULL,
  `Username` varchar(100) DEFAULT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `PharmacyId` int(11) DEFAULT NULL,
  `DoctorId` int(11) DEFAULT NULL,
  `AgentId` int(11) DEFAULT NULL,
  `PatientId` int(11) DEFAULT NULL,
  `RoleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `useraccounts`
--
DELIMITER $$
CREATE TRIGGER `a_d_UserAccounts` AFTER DELETE ON `useraccounts` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'UserAccounts';						SET @pk_d = CONCAT('<UserId>',OLD.`UserId`,'</UserId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_UserAccounts` AFTER INSERT ON `useraccounts` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'UserAccounts'; 						SET @pk_d = CONCAT('<UserId>',NEW.`UserId`,'</UserId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_UserAccounts` AFTER UPDATE ON `useraccounts` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'UserAccounts';						SET @pk_d_old = CONCAT('<UserId>',OLD.`UserId`,'</UserId>');						SET @pk_d = CONCAT('<UserId>',NEW.`UserId`,'</UserId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `WarehouseId` int(11) NOT NULL,
  `LocationName` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  `CurrentInventoryLevel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `warehouse`
--
DELIMITER $$
CREATE TRIGGER `a_d_Warehouse` AFTER DELETE ON `warehouse` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Warehouse';						SET @pk_d = CONCAT('<WarehouseId>',OLD.`WarehouseId`,'</WarehouseId>');						SET @rec_state = 3;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE  `table_name` = @tbl_name AND `pk_date_src` = @pk_d;						IF @rs = 1 THEN 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs > 1 THEN 						UPDATE `history_store` SET `timemark` = @time_mark, `record_state` = 3, `pk_date_src` = `pk_date_dest` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d; 						END IF; 						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d, @rec_state ); 						END IF; END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_i_Warehouse` AFTER INSERT ON `warehouse` FOR EACH ROW BEGIN 						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'cvb'; 						SET @tbl_name = 'Warehouse'; 						SET @pk_d = CONCAT('<WarehouseId>',NEW.`WarehouseId`,'</WarehouseId>'); 						SET @rec_state = 1;						UPDATE `history_store` SET `pk_date_dest` = `pk_date_src` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d AND (`record_state` = 2 OR `record_state` = 1); 						DELETE FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_dest` = @pk_d; 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`,`record_state` ) 						VALUES (@time_mark, @tbl_name, @pk_d, @pk_d, @rec_state); 						END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `a_u_Warehouse` AFTER UPDATE ON `warehouse` FOR EACH ROW BEGIN						SET @time_mark = DATE_ADD(NOW(), INTERVAL 0 SECOND); 						SET @tbl_name = 'Warehouse';						SET @pk_d_old = CONCAT('<WarehouseId>',OLD.`WarehouseId`,'</WarehouseId>');						SET @pk_d = CONCAT('<WarehouseId>',NEW.`WarehouseId`,'</WarehouseId>');						SET @rec_state = 2;						SET @rs = 0;						SELECT `record_state` INTO @rs FROM `history_store` WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						IF @rs = 0 THEN 						INSERT INTO `history_store`( `timemark`, `table_name`, `pk_date_src`,`pk_date_dest`, `record_state` ) VALUES (@time_mark, @tbl_name, @pk_d,@pk_d_old, @rec_state );						ELSE 						UPDATE `history_store` SET `timemark` = @time_mark, `pk_date_src` = @pk_d WHERE `table_name` = @tbl_name AND `pk_date_src` = @pk_d_old;						END IF; END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`AgentID`);

--
-- Indexes for table `alertsnotifications`
--
ALTER TABLE `alertsnotifications`
  ADD PRIMARY KEY (`AlertId`),
  ADD KEY `FK__AlertsNot__UserI__0B91BA14` (`UserId`);

--
-- Indexes for table `atc_code`
--
ALTER TABLE `atc_code`
  ADD PRIMARY KEY (`ATC_ID`),
  ADD KEY `FK__ATC_Code__Parent__4316F928` (`ParentID`);

--
-- Indexes for table `audittrail`
--
ALTER TABLE `audittrail`
  ADD PRIMARY KEY (`AuditTrailId`),
  ADD KEY `FK_AuditTrail_Users` (`UserId`);

--
-- Indexes for table `batchlottracking`
--
ALTER TABLE `batchlottracking`
  ADD PRIMARY KEY (`BatchLotId`),
  ADD KEY `FK_Donation_BatchLot` (`DonationId`),
  ADD KEY `FK_Drug_BatchLot` (`DrugId`);

--
-- Indexes for table `batchserialnumber`
--
ALTER TABLE `batchserialnumber`
  ADD PRIMARY KEY (`BatchSerialNumberId`),
  ADD KEY `FK_BatchSerialNumber_Batch` (`BatchId`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`BrandId`);

--
-- Indexes for table `categorypricing`
--
ALTER TABLE `categorypricing`
  ADD KEY `FK__CategoryP__Opera__51BA1E3A` (`OperationId`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`CityId`),
  ADD KEY `FK__Cities__District__7FEAFD3E` (`DistrictId`);

--
-- Indexes for table `containertype`
--
ALTER TABLE `containertype`
  ADD PRIMARY KEY (`ContainerTypeId`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`CountryId`);

--
-- Indexes for table `countrygovernoratemapping`
--
ALTER TABLE `countrygovernoratemapping`
  ADD PRIMARY KEY (`CountryId`,`GovernorateId`),
  ADD KEY `FK__CountryGo__Gover__03BB8E22` (`GovernorateId`);

--
-- Indexes for table `diseasecategory`
--
ALTER TABLE `diseasecategory`
  ADD PRIMARY KEY (`DiseaseCategoryId`);

--
-- Indexes for table `diseasecategoryatc`
--
ALTER TABLE `diseasecategoryatc`
  ADD PRIMARY KEY (`MappingId`),
  ADD KEY `FK__DiseaseCa__Disea__25518C17` (`DiseaseCategoryId`),
  ADD KEY `FK__DiseaseCa__ATC_C__2645B050` (`ATC_CodeId`);

--
-- Indexes for table `dispensingconditions`
--
ALTER TABLE `dispensingconditions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `districtcitymapping`
--
ALTER TABLE `districtcitymapping`
  ADD PRIMARY KEY (`DistrictId`,`CityId`),
  ADD KEY `FK__DistrictC__CityI__0B5CAFEA` (`CityId`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`DistrictId`),
  ADD KEY `FK__Districts__Gover__7B264821` (`GovernorateId`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`DoctorId`),
  ADD KEY `FK_Doctors_Doctors` (`DoctorParentId`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`DonationId`),
  ADD KEY `FK_Donation_Donor` (`DonorId`),
  ADD KEY `FK_Donation_Recipient` (`RecipientId`);

--
-- Indexes for table `donor`
--
ALTER TABLE `donor`
  ADD PRIMARY KEY (`DonorId`);

--
-- Indexes for table `dosage`
--
ALTER TABLE `dosage`
  ADD PRIMARY KEY (`DosageId`),
  ADD KEY `FK__Dosage__DrugID__351DDF8C` (`DrugID`);

--
-- Indexes for table `dosageform`
--
ALTER TABLE `dosageform`
  ADD PRIMARY KEY (`DosageFormId`);

--
-- Indexes for table `dosageformmapping`
--
ALTER TABLE `dosageformmapping`
  ADD PRIMARY KEY (`DosageFormMappingId`),
  ADD KEY `FK_DosageFormMapping_Dosage` (`DosageId`),
  ADD KEY `FK_DosageFormMapping_DosageForm` (`DosageFormId`);

--
-- Indexes for table `drug`
--
ALTER TABLE `drug`
  ADD PRIMARY KEY (`DrugID`),
  ADD KEY `FK__Drug__Manufactur__403A8C7D` (`ManufacturerID`);

--
-- Indexes for table `drugbrands`
--
ALTER TABLE `drugbrands`
  ADD PRIMARY KEY (`DrugId`,`BrandId`),
  ADD KEY `FK_drugBrands_Brand` (`BrandId`);

--
-- Indexes for table `drugdispensingconditions`
--
ALTER TABLE `drugdispensingconditions`
  ADD PRIMARY KEY (`DrugID`,`DispensingConditionsID`),
  ADD KEY `FK_DrugDispensingConditions_DispensingConditions` (`DispensingConditionsID`);

--
-- Indexes for table `drugform`
--
ALTER TABLE `drugform`
  ADD PRIMARY KEY (`DrugFormId`),
  ADD KEY `FK__DrugForm__FormId__395884C4` (`FormId`),
  ADD KEY `FK__DrugForm__DrugId__3864608B` (`DrugId`);

--
-- Indexes for table `drugimage`
--
ALTER TABLE `drugimage`
  ADD PRIMARY KEY (`ImageId`),
  ADD KEY `FK__DrugImage__DrugI__3E1D39E1` (`DrugId`);

--
-- Indexes for table `druginteraction`
--
ALTER TABLE `druginteraction`
  ADD PRIMARY KEY (`DrugInteractionID`),
  ADD KEY `FK__DrugInter__DrugI__2116E6DF` (`DrugID`);

--
-- Indexes for table `druginteractions`
--
ALTER TABLE `druginteractions`
  ADD PRIMARY KEY (`DrugInteractionID`),
  ADD KEY `FK__DrugInter__DrugI__473C8FC7` (`DrugID`);

--
-- Indexes for table `druglabel`
--
ALTER TABLE `druglabel`
  ADD PRIMARY KEY (`LabelId`),
  ADD KEY `FK__DrugLabel__DrugI__43D61337` (`DrugId`);

--
-- Indexes for table `drugpresentation`
--
ALTER TABLE `drugpresentation`
  ADD PRIMARY KEY (`PresentationId`),
  ADD KEY `FK__DrugPrese__UnitI__4F47C5E3` (`UnitId`),
  ADD KEY `FK__DrugPrese__TypeI__503BEA1C` (`TypeId`),
  ADD KEY `FK__DrugPrese__DrugI__5224328E` (`DrugId`);

--
-- Indexes for table `drugroute`
--
ALTER TABLE `drugroute`
  ADD PRIMARY KEY (`DrugRouteId`),
  ADD KEY `FK__DrugRoute__DrugI__5BAD9CC8` (`DrugId`),
  ADD KEY `FK__DrugRoute__Route__5CA1C101` (`RouteId`);

--
-- Indexes for table `drugstratum`
--
ALTER TABLE `drugstratum`
  ADD PRIMARY KEY (`DrugStratumId`),
  ADD KEY `FK__DrugStrat__DrugI__6442E2C9` (`DrugId`),
  ADD KEY `FK__DrugStrat__Strat__65370702` (`StratumTypeId`);

--
-- Indexes for table `drugtreatment`
--
ALTER TABLE `drugtreatment`
  ADD PRIMARY KEY (`DrugTreatmentId`),
  ADD KEY `FK__DrugTreat__DrugI__6CD828CA` (`DrugId`),
  ADD KEY `FK__DrugTreat__Treat__6DCC4D03` (`TreatmentTypeId`);

--
-- Indexes for table `drug_atc_mapping`
--
ALTER TABLE `drug_atc_mapping`
  ADD PRIMARY KEY (`MappingID`),
  ADD KEY `FK__Drug_ATC___ATC_I__49C3F6B7` (`ATC_ID`),
  ADD KEY `FK__Drug_ATC___DrugI__48CFD27E` (`DrugID`);

--
-- Indexes for table `form`
--
ALTER TABLE `form`
  ADD PRIMARY KEY (`FormId`),
  ADD KEY `FK__Form__ParentId__3587F3E0` (`ParentId`);

--
-- Indexes for table `formparent`
--
ALTER TABLE `formparent`
  ADD PRIMARY KEY (`FormParentId`);

--
-- Indexes for table `governoratedistrictmapping`
--
ALTER TABLE `governoratedistrictmapping`
  ADD PRIMARY KEY (`GovernorateId`,`DistrictId`),
  ADD KEY `FK__Governora__Distr__078C1F06` (`DistrictId`);

--
-- Indexes for table `governorates`
--
ALTER TABLE `governorates`
  ADD PRIMARY KEY (`GovernorateId`),
  ADD KEY `FK__Governora__Count__76619304` (`CountryId`);

--
-- Indexes for table `history_store`
--
ALTER TABLE `history_store`
  ADD PRIMARY KEY (`table_name`(85),`pk_date_dest`(85));

--
-- Indexes for table `hospital`
--
ALTER TABLE `hospital`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `hospitaloperationmapping`
--
ALTER TABLE `hospitaloperationmapping`
  ADD KEY `FK__HospitalO__Opera__5B438874` (`OperationId`),
  ADD KEY `FK__HospitalO__Hospi__5C37ACAD` (`HospitalId`);

--
-- Indexes for table `importation`
--
ALTER TABLE `importation`
  ADD PRIMARY KEY (`ImportationID`),
  ADD KEY `FK_Importation_Drug_Info` (`DrugID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`InventoryID`),
  ADD KEY `FK_Inventory_Drug_Info` (`DrugID`);

--
-- Indexes for table `operation`
--
ALTER TABLE `operation`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `operationshare`
--
ALTER TABLE `operationshare`
  ADD KEY `FK__Operation__Opera__4EDDB18F` (`OperationId`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`PatientId`);

--
-- Indexes for table `pharmacy`
--
ALTER TABLE `pharmacy`
  ADD PRIMARY KEY (`PharmacyId`),
  ADD KEY `FK_Pharmacy_Pharmacy` (`PharmacyParentId`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`PrescriptionId`),
  ADD KEY `FK_Prescription_Patients` (`PatientId`),
  ADD KEY `FK_Prescription_Doctors` (`DoctorId`);

--
-- Indexes for table `presentationtype`
--
ALTER TABLE `presentationtype`
  ADD PRIMARY KEY (`PresentationTypeId`);

--
-- Indexes for table `presentationunit`
--
ALTER TABLE `presentationunit`
  ADD PRIMARY KEY (`PresentationUnitId`);

--
-- Indexes for table `pricehistory`
--
ALTER TABLE `pricehistory`
  ADD PRIMARY KEY (`PriceHistoryId`),
  ADD KEY `FK_PriceHistory_Drug` (`DrugId`);

--
-- Indexes for table `recipient`
--
ALTER TABLE `recipient`
  ADD PRIMARY KEY (`RecipientId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`RoleId`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`RouteId`),
  ADD KEY `FK_Route_Parent` (`ParentId`);

--
-- Indexes for table `shippinginformation`
--
ALTER TABLE `shippinginformation`
  ADD PRIMARY KEY (`ShippingId`),
  ADD KEY `FK_ShippingInformation_Drug` (`DrugId`);

--
-- Indexes for table `stratumtype`
--
ALTER TABLE `stratumtype`
  ADD PRIMARY KEY (`StratumTypeId`);

--
-- Indexes for table `strengthunit`
--
ALTER TABLE `strengthunit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `substitute`
--
ALTER TABLE `substitute`
  ADD PRIMARY KEY (`SubstituteId`),
  ADD KEY `FK__Substitute__Drug__1B9317B3` (`Drug`),
  ADD KEY `FK__Substitut__Subst__1C873BEC` (`Substitute`);

--
-- Indexes for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  ADD PRIMARY KEY (`TransactionId`),
  ADD KEY `FK_TransactionHistory_Drug` (`DrugId`);

--
-- Indexes for table `treatmenttype`
--
ALTER TABLE `treatmenttype`
  ADD PRIMARY KEY (`TreatmentTypeId`);

--
-- Indexes for table `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `UserAccounts_UQ__UserAcco__536C85E4AB16AB51` (`Username`),
  ADD KEY `FK_UserRoles` (`RoleId`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`WarehouseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `AgentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `alertsnotifications`
--
ALTER TABLE `alertsnotifications`
  MODIFY `AlertId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `atc_code`
--
ALTER TABLE `atc_code`
  MODIFY `ATC_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7364;

--
-- AUTO_INCREMENT for table `audittrail`
--
ALTER TABLE `audittrail`
  MODIFY `AuditTrailId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `batchlottracking`
--
ALTER TABLE `batchlottracking`
  MODIFY `BatchLotId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `batchserialnumber`
--
ALTER TABLE `batchserialnumber`
  MODIFY `BatchSerialNumberId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `BrandId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `CityId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `containertype`
--
ALTER TABLE `containertype`
  MODIFY `ContainerTypeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `CountryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=867;

--
-- AUTO_INCREMENT for table `diseasecategory`
--
ALTER TABLE `diseasecategory`
  MODIFY `DiseaseCategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `diseasecategoryatc`
--
ALTER TABLE `diseasecategoryatc`
  MODIFY `MappingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispensingconditions`
--
ALTER TABLE `dispensingconditions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `DistrictId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `DoctorId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
  MODIFY `DonationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `donor`
--
ALTER TABLE `donor`
  MODIFY `DonorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dosage`
--
ALTER TABLE `dosage`
  MODIFY `DosageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `dosageform`
--
ALTER TABLE `dosageform`
  MODIFY `DosageFormId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `dosageformmapping`
--
ALTER TABLE `dosageformmapping`
  MODIFY `DosageFormMappingId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `drug`
--
ALTER TABLE `drug`
  MODIFY `DrugID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1037;

--
-- AUTO_INCREMENT for table `drugform`
--
ALTER TABLE `drugform`
  MODIFY `DrugFormId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drugimage`
--
ALTER TABLE `drugimage`
  MODIFY `ImageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `druginteraction`
--
ALTER TABLE `druginteraction`
  MODIFY `DrugInteractionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `druginteractions`
--
ALTER TABLE `druginteractions`
  MODIFY `DrugInteractionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `druglabel`
--
ALTER TABLE `druglabel`
  MODIFY `LabelId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drugpresentation`
--
ALTER TABLE `drugpresentation`
  MODIFY `PresentationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `drugroute`
--
ALTER TABLE `drugroute`
  MODIFY `DrugRouteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `drugstratum`
--
ALTER TABLE `drugstratum`
  MODIFY `DrugStratumId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `drugtreatment`
--
ALTER TABLE `drugtreatment`
  MODIFY `DrugTreatmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug_atc_mapping`
--
ALTER TABLE `drug_atc_mapping`
  MODIFY `MappingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `form`
--
ALTER TABLE `form`
  MODIFY `FormId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formparent`
--
ALTER TABLE `formparent`
  MODIFY `FormParentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `governorates`
--
ALTER TABLE `governorates`
  MODIFY `GovernorateId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hospital`
--
ALTER TABLE `hospital`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `importation`
--
ALTER TABLE `importation`
  MODIFY `ImportationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `InventoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `PatientId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy`
--
ALTER TABLE `pharmacy`
  MODIFY `PharmacyId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `PrescriptionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `presentationtype`
--
ALTER TABLE `presentationtype`
  MODIFY `PresentationTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `presentationunit`
--
ALTER TABLE `presentationunit`
  MODIFY `PresentationUnitId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pricehistory`
--
ALTER TABLE `pricehistory`
  MODIFY `PriceHistoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipient`
--
ALTER TABLE `recipient`
  MODIFY `RecipientId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `RouteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shippinginformation`
--
ALTER TABLE `shippinginformation`
  MODIFY `ShippingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stratumtype`
--
ALTER TABLE `stratumtype`
  MODIFY `StratumTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `strengthunit`
--
ALTER TABLE `strengthunit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `substitute`
--
ALTER TABLE `substitute`
  MODIFY `SubstituteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  MODIFY `TransactionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `treatmenttype`
--
ALTER TABLE `treatmenttype`
  MODIFY `TreatmentTypeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `useraccounts`
--
ALTER TABLE `useraccounts`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `WarehouseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alertsnotifications`
--
ALTER TABLE `alertsnotifications`
  ADD CONSTRAINT `FK__AlertsNot__UserI__0B91BA14` FOREIGN KEY (`UserId`) REFERENCES `useraccounts` (`UserId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `atc_code`
--
ALTER TABLE `atc_code`
  ADD CONSTRAINT `FK__ATC_Code__Parent__4316F928` FOREIGN KEY (`ParentID`) REFERENCES `atc_code` (`ATC_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `audittrail`
--
ALTER TABLE `audittrail`
  ADD CONSTRAINT `FK_AuditTrail_Users` FOREIGN KEY (`UserId`) REFERENCES `useraccounts` (`UserId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `batchlottracking`
--
ALTER TABLE `batchlottracking`
  ADD CONSTRAINT `FK_Donation_BatchLot` FOREIGN KEY (`DonationId`) REFERENCES `donation` (`DonationId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_Drug_BatchLot` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `batchserialnumber`
--
ALTER TABLE `batchserialnumber`
  ADD CONSTRAINT `FK_BatchSerialNumber_Batch` FOREIGN KEY (`BatchId`) REFERENCES `batchlottracking` (`BatchLotId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `categorypricing`
--
ALTER TABLE `categorypricing`
  ADD CONSTRAINT `FK__CategoryP__Opera__51BA1E3A` FOREIGN KEY (`OperationId`) REFERENCES `operation` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `FK__Cities__District__7FEAFD3E` FOREIGN KEY (`DistrictId`) REFERENCES `districts` (`DistrictId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `countrygovernoratemapping`
--
ALTER TABLE `countrygovernoratemapping`
  ADD CONSTRAINT `FK__CountryGo__Count__02C769E9` FOREIGN KEY (`CountryId`) REFERENCES `countries` (`CountryId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__CountryGo__Gover__03BB8E22` FOREIGN KEY (`GovernorateId`) REFERENCES `governorates` (`GovernorateId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `diseasecategoryatc`
--
ALTER TABLE `diseasecategoryatc`
  ADD CONSTRAINT `FK__DiseaseCa__ATC_C__2645B050` FOREIGN KEY (`ATC_CodeId`) REFERENCES `atc_code` (`ATC_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DiseaseCa__Disea__25518C17` FOREIGN KEY (`DiseaseCategoryId`) REFERENCES `diseasecategory` (`DiseaseCategoryId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `districtcitymapping`
--
ALTER TABLE `districtcitymapping`
  ADD CONSTRAINT `FK__DistrictC__CityI__0B5CAFEA` FOREIGN KEY (`CityId`) REFERENCES `cities` (`CityId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DistrictC__Distr__0A688BB1` FOREIGN KEY (`DistrictId`) REFERENCES `districts` (`DistrictId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `FK__Districts__Gover__7B264821` FOREIGN KEY (`GovernorateId`) REFERENCES `governorates` (`GovernorateId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `FK_Doctors_Doctors` FOREIGN KEY (`DoctorParentId`) REFERENCES `doctors` (`DoctorId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `donation`
--
ALTER TABLE `donation`
  ADD CONSTRAINT `FK_Donation_Donor` FOREIGN KEY (`DonorId`) REFERENCES `donor` (`DonorId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_Donation_Recipient` FOREIGN KEY (`RecipientId`) REFERENCES `recipient` (`RecipientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `dosage`
--
ALTER TABLE `dosage`
  ADD CONSTRAINT `FK__Dosage__DrugID__351DDF8C` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `dosageformmapping`
--
ALTER TABLE `dosageformmapping`
  ADD CONSTRAINT `FK_DosageFormMapping_Dosage` FOREIGN KEY (`DosageId`) REFERENCES `dosage` (`DosageId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_DosageFormMapping_DosageForm` FOREIGN KEY (`DosageFormId`) REFERENCES `dosageform` (`DosageFormId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drug`
--
ALTER TABLE `drug`
  ADD CONSTRAINT `FK__Drug__Manufactur__403A8C7D` FOREIGN KEY (`ManufacturerID`) REFERENCES `agent` (`AgentID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugbrands`
--
ALTER TABLE `drugbrands`
  ADD CONSTRAINT `FK_drugBrands_Brand` FOREIGN KEY (`BrandId`) REFERENCES `brands` (`BrandId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_drugBrands_Drug` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugdispensingconditions`
--
ALTER TABLE `drugdispensingconditions`
  ADD CONSTRAINT `FK_DrugDispensingConditions_DispensingConditions` FOREIGN KEY (`DispensingConditionsID`) REFERENCES `dispensingconditions` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_DrugDispensingConditions_Drug` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugform`
--
ALTER TABLE `drugform`
  ADD CONSTRAINT `FK__DrugForm__DrugId__3864608B` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugForm__FormId__395884C4` FOREIGN KEY (`FormId`) REFERENCES `form` (`FormId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugimage`
--
ALTER TABLE `drugimage`
  ADD CONSTRAINT `FK__DrugImage__DrugI__3E1D39E1` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `druginteraction`
--
ALTER TABLE `druginteraction`
  ADD CONSTRAINT `FK__DrugInter__DrugI__2116E6DF` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `druginteractions`
--
ALTER TABLE `druginteractions`
  ADD CONSTRAINT `FK__DrugInter__DrugI__473C8FC7` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `druglabel`
--
ALTER TABLE `druglabel`
  ADD CONSTRAINT `FK__DrugLabel__DrugI__43D61337` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugpresentation`
--
ALTER TABLE `drugpresentation`
  ADD CONSTRAINT `FK__DrugPrese__DrugI__5224328E` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugPrese__TypeI__503BEA1C` FOREIGN KEY (`TypeId`) REFERENCES `presentationtype` (`PresentationTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugPrese__UnitI__4F47C5E3` FOREIGN KEY (`UnitId`) REFERENCES `presentationunit` (`PresentationUnitId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugroute`
--
ALTER TABLE `drugroute`
  ADD CONSTRAINT `FK__DrugRoute__DrugI__5BAD9CC8` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugRoute__Route__5CA1C101` FOREIGN KEY (`RouteId`) REFERENCES `route` (`RouteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugstratum`
--
ALTER TABLE `drugstratum`
  ADD CONSTRAINT `FK__DrugStrat__DrugI__6442E2C9` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugStrat__Strat__65370702` FOREIGN KEY (`StratumTypeId`) REFERENCES `stratumtype` (`StratumTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drugtreatment`
--
ALTER TABLE `drugtreatment`
  ADD CONSTRAINT `FK__DrugTreat__DrugI__6CD828CA` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__DrugTreat__Treat__6DCC4D03` FOREIGN KEY (`TreatmentTypeId`) REFERENCES `treatmenttype` (`TreatmentTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `drug_atc_mapping`
--
ALTER TABLE `drug_atc_mapping`
  ADD CONSTRAINT `FK__Drug_ATC___ATC_I__49C3F6B7` FOREIGN KEY (`ATC_ID`) REFERENCES `atc_code` (`ATC_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__Drug_ATC___DrugI__48CFD27E` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `form`
--
ALTER TABLE `form`
  ADD CONSTRAINT `FK__Form__ParentId__3587F3E0` FOREIGN KEY (`ParentId`) REFERENCES `formparent` (`FormParentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `governoratedistrictmapping`
--
ALTER TABLE `governoratedistrictmapping`
  ADD CONSTRAINT `FK__Governora__Distr__078C1F06` FOREIGN KEY (`DistrictId`) REFERENCES `districts` (`DistrictId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__Governora__Gover__0697FACD` FOREIGN KEY (`GovernorateId`) REFERENCES `governorates` (`GovernorateId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `governorates`
--
ALTER TABLE `governorates`
  ADD CONSTRAINT `FK__Governora__Count__76619304` FOREIGN KEY (`CountryId`) REFERENCES `countries` (`CountryId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `hospitaloperationmapping`
--
ALTER TABLE `hospitaloperationmapping`
  ADD CONSTRAINT `FK__HospitalO__Hospi__5C37ACAD` FOREIGN KEY (`HospitalId`) REFERENCES `hospital` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__HospitalO__Opera__5B438874` FOREIGN KEY (`OperationId`) REFERENCES `operation` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `importation`
--
ALTER TABLE `importation`
  ADD CONSTRAINT `FK_Importation_Drug_Info` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `FK_Inventory_Drug_Info` FOREIGN KEY (`DrugID`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `operationshare`
--
ALTER TABLE `operationshare`
  ADD CONSTRAINT `FK__Operation__Opera__4EDDB18F` FOREIGN KEY (`OperationId`) REFERENCES `operation` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pharmacy`
--
ALTER TABLE `pharmacy`
  ADD CONSTRAINT `FK_Pharmacy_Pharmacy` FOREIGN KEY (`PharmacyParentId`) REFERENCES `pharmacy` (`PharmacyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `prescription`
--
ALTER TABLE `prescription`
  ADD CONSTRAINT `FK_Prescription_Doctors` FOREIGN KEY (`DoctorId`) REFERENCES `doctors` (`DoctorId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_Prescription_Patients` FOREIGN KEY (`PatientId`) REFERENCES `patients` (`PatientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pricehistory`
--
ALTER TABLE `pricehistory`
  ADD CONSTRAINT `FK_PriceHistory_Drug` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `FK_Route_Parent` FOREIGN KEY (`ParentId`) REFERENCES `route` (`RouteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `shippinginformation`
--
ALTER TABLE `shippinginformation`
  ADD CONSTRAINT `FK_ShippingInformation_Drug` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `substitute`
--
ALTER TABLE `substitute`
  ADD CONSTRAINT `FK__Substitut__Subst__1C873BEC` FOREIGN KEY (`Substitute`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__Substitute__Drug__1B9317B3` FOREIGN KEY (`Drug`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  ADD CONSTRAINT `FK_TransactionHistory_Drug` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`DrugID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD CONSTRAINT `FK_UserRoles` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
