-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2024 at 04:05 PM
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
(601, '22-TRIAL- 11', '80-TRIAL-glimepiride  55', '258-TRIAL- 147', 601),
(602, '70-TRIAL- 90', '273-TRIAL-acetohexamide  127', '113-TRIAL- 154', 602),
(603, '96-TRIAL- 172', '150-TRIAL-glymidine  141', '141-TRIAL- 246', 603),
(604, '125-TRIAL-A10BC  13', '24-TRIAL-Sulfonamides (heterocyclic) 229', '295-TRIAL- 203', 604),
(605, '294-TRIAL-A10BD  193', '267-TRIAL-Combinations of oral blood glucose lowering drugs 287', '140-TRIAL- 179', 605),
(606, '141-TRIAL- 125', '234-TRIAL-phenformin and sulfonylureas  60', '200-TRIAL- 107', 606),
(607, '221-TRIAL- 92', '93-TRIAL-metformin and sulfonylureas  17', '217-TRIAL- 3', 607),
(608, '43-TRIAL- 193', '139-TRIAL-metformin and rosiglitazone  211', '225-TRIAL- 28', 608),
(609, '178-TRIAL- 248', '150-TRIAL-glimepiride and rosiglitazone  92', '44-TRIAL- 154', 609),
(610, '223-TRIAL- 53', '36-TRIAL-metformin and pioglitazone  47', '46-TRIAL- 226', 610),
(611, '161-TRIAL- 4', '38-TRIAL-glimepiride and pioglitazone  171', '186-TRIAL- 205', 611),
(612, '199-TRIAL- 156', '28-TRIAL-metformin and sitagliptin  67', '151-TRIAL- 219', 612),
(613, '191-TRIAL- 166', '17-TRIAL-metformin and vildagliptin  46', '293-TRIAL- 187', 613),
(614, '221-TRIAL- 112', '267-TRIAL-pioglitazone and alogliptin  99', '44-TRIAL- 197', 614),
(615, '1-TRIAL-A10BD10  28', '42-TRIAL-metformin and saxagliptin  204', '268-TRIAL- 68', 615),
(616, '241-TRIAL- 96', '162-TRIAL-metformin and linagliptin  220', '244-TRIAL- 18', 616),
(617, '25-TRIAL- 219', '184-TRIAL-pioglitazone and sitagliptin  174', '184-TRIAL- 259', 617),
(618, '249-TRIAL- 214', '295-TRIAL-metformin and alogliptin  203', '232-TRIAL- 51', 618),
(619, '37-TRIAL- 114', '263-TRIAL-metformin and repaglinide  151', '19-TRIAL- 290', 619),
(620, '117-TRIAL- 83', '118-TRIAL-metformin and dapagliflozin  184', '252-TRIAL- 286', 620),
(621, '69-TRIAL- 148', '137-TRIAL-metformin and canagliflozin  297', '124-TRIAL- 68', 621),
(622, '227-TRIAL- 248', '193-TRIAL-metformin and acarbose  182', '171-TRIAL- 69', 622),
(623, '293-TRIAL- 177', '114-TRIAL-metformin and gemigliptin  204', '184-TRIAL- 243', 623),
(624, '95-TRIAL- 111', '93-TRIAL-linagliptin and empagliflozin  92', '198-TRIAL- 190', 624),
(625, '199-TRIAL- 190', '93-TRIAL-metformin and empagliflozin  274', '49-TRIAL- 274', 625),
(626, '14-TRIAL- 73', '69-TRIAL-saxagliptin and dapagliflozin  118', '165-TRIAL- 33', 626),
(627, '238-TRIAL- 111', '52-TRIAL-metformin and evogliptin  163', '208-TRIAL- 249', 627),
(628, '288-TRIAL- 245', '231-TRIAL-metformin and ertugliflozin  120', '206-TRIAL- 71', 628),
(629, '68-TRIAL- 121', '258-TRIAL-sitagliptin and ertugliflozin  257', '47-TRIAL- 182', 629),
(630, '238-TRIAL- 122', '23-TRIAL-metformin, saxagliptin and dapagliflozin  6', '106-TRIAL- 289', 630),
(631, '56-TRIAL- 45', '51-TRIAL-metformin and lobeglitazone  23', '218-TRIAL- 50', 631),
(632, '297-TRIAL- 136', '91-TRIAL-metformin, linagliptin and empagliflozin  206', '10-TRIAL- 13', 632),
(633, '251-TRIAL-A10BF 80', '244-TRIAL- Alpha glucosidase inhibitors 143', '241-TRIAL- 145', 633),
(634, '178-TRIAL- 149', '105-TRIAL-acarbose  214', '285-TRIAL- 227', 634),
(635, '224-TRIAL- 104', '156-TRIAL-miglitol  217', '227-TRIAL- 255', 635),
(636, '202-TRIAL- 186', '268-TRIAL-voglibose  298', '279-TRIAL- 111', 636),
(637, '189-TRIAL- 258', '290-TRIAL-troglitazone  175', '210-TRIAL- 32', 637),
(638, '89-TRIAL-A10BG  296', '250-TRIAL-Thiazolidinediones 12', '22-TRIAL- 229', 638),
(639, '172-TRIAL- 36', '277-TRIAL-rosiglitazone  153', '176-TRIAL- 170', 639),
(640, '85-TRIAL- 252', '251-TRIAL-pioglitazone  97', '251-TRIAL- 201', 640),
(641, '135-TRIAL- 193', '72-TRIAL-lobeglitazone  216', '116-TRIAL- 128', 641),
(642, '11-TRIAL-A10BH  25', '138-TRIAL-Dipeptidyl peptidase 4 (DPP-4) inhibitors 296', '39-TRIAL- 144', 642),
(643, '156-TRIAL- 226', '2-TRIAL-sitagliptin  58', '288-TRIAL- 21', 643),
(644, '86-TRIAL- 8', '77-TRIAL-vildagliptin  28', '79-TRIAL- 247', 644),
(645, '249-TRIAL- 80', '45-TRIAL-saxagliptin  228', '262-TRIAL- 226', 645),
(646, '219-TRIAL- 177', '291-TRIAL-alogliptin  147', '285-TRIAL- 131', 646),
(647, '206-TRIAL- 284', '54-TRIAL-linagliptin  269', '9-TRIAL- 56', 647),
(648, '221-TRIAL- 45', '265-TRIAL-gemigliptin  116', '260-TRIAL- 297', 648),
(649, '35-TRIAL- 90', '277-TRIAL-evogliptin  149', '5-TRIAL- 86', 649),
(650, '288-TRIAL- 75', '243-TRIAL-teneligliptin  277', '230-TRIAL- 287', 650),
(651, '155-TRIAL- 282', '53-TRIAL-sitagliptin and simvastatin  0', '154-TRIAL- 289', 651),
(652, '88-TRIAL- 15', '8-TRIAL-gemigliptin and rosuvastatin  110', '40-TRIAL- 199', 652),
(653, '297-TRIAL-A10BJ  107', '54-TRIAL-Glucagon-like peptide-1 (GLP-1) analogues 4', '137-TRIAL- 285', 653),
(654, '199-TRIAL- 192', '213-TRIAL-exenatide  212', '82-TRIAL- 83', 654),
(655, '51-TRIAL- 229', '37-TRIAL- 233', '100-TRIAL- 64', NULL),
(656, '283-TRIAL- 157', '268-TRIAL-liraglutide  210', '68-TRIAL- 208', 656),
(657, '241-TRIAL- 132', '137-TRIAL-lixisenatide  284', '99-TRIAL- 1', 657),
(658, '169-TRIAL- 83', '156-TRIAL-albiglutide  192', '140-TRIAL- 87', 658),
(659, '12-TRIAL- 10', '120-TRIAL-dulaglutide  135', '163-TRIAL- 115', 659),
(660, '97-TRIAL- 77', '74-TRIAL-semaglutide  234', '253-TRIAL- 33', 660),
(661, '78-TRIAL- 186', '124-TRIAL- 34', '75-TRIAL- 49', NULL),
(662, '112-TRIAL- 284', '24-TRIAL-beinaglutide  192', '204-TRIAL- 22', 662),
(663, '155-TRIAL- 13', '162-TRIAL-dapagliflozin  173', '284-TRIAL- 160', 663),
(664, '222-TRIAL- 253', '197-TRIAL-canagliflozin  122', '250-TRIAL- 37', 664),
(665, '117-TRIAL-A10BK  106', '131-TRIAL-Sodium-glucose co-transporter 2 (SGLT2) inhibitors 297', '205-TRIAL- 136', 665),
(666, '157-TRIAL- 299', '90-TRIAL-empagliflozin  98', '85-TRIAL- 147', 666),
(667, '184-TRIAL- 292', '125-TRIAL-ertugliflozin  296', '155-TRIAL- 228', 667),
(668, '38-TRIAL- 242', '28-TRIAL-ipragliflozin  95', '142-TRIAL- 37', 668),
(669, '106-TRIAL- 167', '253-TRIAL-sotagliflozin  193', '5-TRIAL- 146', 669),
(670, '9-TRIAL-A10BK07  124', '54-TRIAL-luseogliflozin  65', '239-TRIAL- 106', 670),
(671, '209-TRIAL-A10BX  192', '299-TRIAL-Other blood glucose lowering drugs, excl. insulins 175', '136-TRIAL- 261', 671),
(672, '147-TRIAL- 18', '113-TRIAL-guar gum  27', '112-TRIAL- 296', 672),
(673, '9-TRIAL-A10BX02  241', '30-TRIAL-repaglinide  90', '34-TRIAL- 115', 673),
(674, '286-TRIAL- 223', '266-TRIAL-nateglinide  144', '36-TRIAL- 137', 674),
(675, '16-TRIAL- 193', '149-TRIAL-pramlintide  71', '44-TRIAL- 277', 675),
(676, '85-TRIAL- 100', '190-TRIAL-benfluorex  85', '125-TRIAL- 18', 676),
(677, '168-TRIAL- 106', '129-TRIAL-mitiglinide  8', '141-TRIAL- 225', 677),
(678, '236-TRIAL- 280', '116-TRIAL-imeglimin  170', '84-TRIAL- 247', 678),
(679, '228-TRIAL- 36', '204-TRIAL-tirzepatide  200', '23-TRIAL- 264', 679),
(680, '211-TRIAL- 140', '250-TRIAL-carfloglitazar  104', '83-TRIAL- 166', 680),
(681, '241-TRIAL- 270', '45-TRIAL-dorzagliatin  6', '88-TRIAL- 156', 681),
(682, '207-TRIAL-A10X  166', '157-TRIAL-OTHER DRUGS USED IN DIABETES 178', '99-TRIAL- 74', 682),
(683, '55-TRIAL-A10XA  291', '290-TRIAL-Aldose reductase inhibitors 132', '258-TRIAL- 196', 683),
(684, '217-TRIAL-A11A  90', '67-TRIAL-MULTIVITAMINS, COMBINATIONS 207', '134-TRIAL- 46', 684),
(685, '62-TRIAL-A11AA  202', '139-TRIAL-Multivitamins with minerals 126', '195-TRIAL- 6', 685),
(686, '214-TRIAL-A11  150', '86-TRIAL-VITAMINS 179', '76-TRIAL- 22', 686),
(687, '279-TRIAL- 201', '212-TRIAL-multivitamins and iron  276', '164-TRIAL- 157', 687),
(688, '170-TRIAL- 38', '12-TRIAL-multivitamins and calcium  244', '61-TRIAL- 280', 688),
(689, '200-TRIAL- 43', '256-TRIAL-multivitamins and trace elements  61', '247-TRIAL- 239', 689),
(690, '8-TRIAL-A11AA03  290', '52-TRIAL-multivitamins and other minerals, incl. combinations  79', '218-TRIAL- 119', 690),
(691, '7-TRIAL-A11AB  84', '247-TRIAL-Multivitamins, other combinations 277', '75-TRIAL- 13', 691),
(692, '109-TRIAL-A11B  171', '142-TRIAL-MULTIVITAMINS, PLAIN 139', '36-TRIAL- 221', 692),
(693, '201-TRIAL-A11BA  234', '129-TRIAL-Multivitamins, plain 58', '236-TRIAL- 269', 693),
(694, '97-TRIAL-A11C  4', '298-TRIAL-VITAMIN A AND D, INCL. COMBINATIONS OF THE TWO 2', '5-TRIAL- 38', 694),
(695, '32-TRIAL- 265', '216-TRIAL-retinol (vit A)  81', '279-TRIAL- 23', 695),
(696, '227-TRIAL- 271', '113-TRIAL- 182', '140-TRIAL- 216', NULL),
(697, '288-TRIAL-A11CA  19', '189-TRIAL-Vitamin A, plain 113', '259-TRIAL- 151', 697),
(698, '171-TRIAL- 183', '164-TRIAL-betacarotene  38', '12-TRIAL- 184', 698),
(699, '159-TRIAL-A11CB  101', '274-TRIAL-Vitamin A and D in combination 233', '259-TRIAL- 114', 699),
(700, '49-TRIAL-A11CC  295', '22-TRIAL-Vitamin D and analogues 241', '16-TRIAL- 77', 700),
(801, '218-TRIAL- 57', '261-TRIAL-sodium selenite  120', '228-TRIAL- 256', 801),
(802, '213-TRIAL-A12CX  32', '292-TRIAL-Other mineral products 82', '67-TRIAL- 220', 802),
(803, '158-TRIAL-A13A  74', '87-TRIAL-TONICS 94', '183-TRIAL- 64', 803),
(804, '264-TRIAL-A13  214', '46-TRIAL-TONICS 90', '225-TRIAL- 155', 804),
(805, '263-TRIAL-A14  267', '92-TRIAL-ANABOLIC AGENTS FOR SYSTEMIC USE 131', '119-TRIAL- 180', 805),
(806, '218-TRIAL-A14A  228', '148-TRIAL-ANABOLIC STEROIDS 220', '79-TRIAL- 291', 806),
(807, '166-TRIAL-A14AA  287', '108-TRIAL-Androstan derivatives 126', '125-TRIAL- 259', 807),
(808, '118-TRIAL- 220', '135-TRIAL-androstanolone  114', '256-TRIAL- 147', 808),
(809, '56-TRIAL- 134', '60-TRIAL-stanozolol  151', '8-TRIAL- 278', 809),
(810, '94-TRIAL- 289', '124-TRIAL- 176', '94-TRIAL- 190', NULL),
(811, '89-TRIAL- 272', '219-TRIAL-metandienone  1', '102-TRIAL- 244', 811),
(812, '123-TRIAL- 139', '209-TRIAL-metenolone  127', '37-TRIAL- 86', 812),
(813, '116-TRIAL- 27', '169-TRIAL- 223', '199-TRIAL- 14', NULL),
(814, '215-TRIAL- 44', '36-TRIAL-oxymetholone  269', '178-TRIAL- 176', 814),
(815, '158-TRIAL- 152', '246-TRIAL-quinbolone  137', '215-TRIAL- 188', 815),
(816, '16-TRIAL- 88', '282-TRIAL-prasterone  174', '233-TRIAL- 15', 816),
(817, '256-TRIAL- 156', '62-TRIAL-oxandrolone  16', '224-TRIAL- 129', 817),
(818, '142-TRIAL- 184', '72-TRIAL-norethandrolone  149', '296-TRIAL- 26', 818),
(819, '182-TRIAL-A14AB  2', '175-TRIAL-Estren derivatives 16', '65-TRIAL- 152', 819),
(820, '159-TRIAL- 155', '17-TRIAL-nandrolone  44', '254-TRIAL- 243', 820),
(821, '224-TRIAL- 199', '222-TRIAL-ethylestrenol  121', '133-TRIAL- 213', 821),
(822, '117-TRIAL- 193', '273-TRIAL-oxabolone cipionate  60', '275-TRIAL- 74', 822),
(823, '285-TRIAL-A14B  101', '122-TRIAL-OTHER ANABOLIC AGENTS 8', '95-TRIAL- 226', 823),
(824, '20-TRIAL-A15  191', '188-TRIAL-APPETITE STIMULANTS 129', '72-TRIAL- 77', 824),
(825, '293-TRIAL-A16  8', '254-TRIAL-OTHER ALIMENTARY TRACT AND METABOLISM PRODUCTS 22', '276-TRIAL- 137', 825),
(826, '216-TRIAL-A16A  3', '90-TRIAL-OTHER ALIMENTARY TRACT AND METABOLISM PRODUCTS 112', '289-TRIAL- 153', 826),
(827, '279-TRIAL-A16AA  99', '22-TRIAL-Amino acids and derivatives 102', '2-TRIAL- 69', 827),
(828, '54-TRIAL- 129', '134-TRIAL-levocarnitine  138', '274-TRIAL- 126', 828),
(829, '263-TRIAL- 234', '172-TRIAL- 48', '253-TRIAL- 203', NULL),
(830, '207-TRIAL- 18', '33-TRIAL-ademetionine  137', '295-TRIAL- 279', 830),
(831, '61-TRIAL- 44', '259-TRIAL-glutamine  161', '7-TRIAL- 276', 831),
(832, '272-TRIAL- 245', '292-TRIAL-mercaptamine  172', '28-TRIAL- 196', 832),
(833, '211-TRIAL- 235', '235-TRIAL-carglumic acid  29', '116-TRIAL- 132', 833),
(834, '56-TRIAL- 258', '49-TRIAL-betaine  20', '196-TRIAL- 224', 834),
(835, '220-TRIAL- 226', '206-TRIAL-metreleptin  283', '145-TRIAL- 274', 835),
(836, '91-TRIAL- 188', '238-TRIAL-alglucerase  264', '104-TRIAL- 177', 836),
(837, '253-TRIAL-A16AB  242', '204-TRIAL-Enzymes 23', '152-TRIAL- 25', 837),
(838, '211-TRIAL- 242', '24-TRIAL-imiglucerase  249', '35-TRIAL- 90', 838),
(839, '246-TRIAL- 128', '155-TRIAL-agalsidase alfa  204', '241-TRIAL- 109', 839),
(840, '181-TRIAL- 179', '2-TRIAL-agalsidase beta  183', '92-TRIAL- 32', 840),
(841, '212-TRIAL- 299', '161-TRIAL-sacrosidase  247', '205-TRIAL- 290', 841),
(842, '169-TRIAL- 259', '228-TRIAL-laronidase  239', '228-TRIAL- 280', 842),
(843, '71-TRIAL- 178', '140-TRIAL-alglucosidase alfa  156', '248-TRIAL- 44', 843),
(844, '145-TRIAL- 225', '10-TRIAL-galsulfase  198', '116-TRIAL- 280', 844),
(845, '215-TRIAL- 64', '26-TRIAL-idursulfase  72', '179-TRIAL- 93', 845),
(846, '82-TRIAL- 5', '236-TRIAL-velaglucerase alfa  33', '5-TRIAL- 287', 846),
(847, '132-TRIAL- 38', '265-TRIAL-taliglucerase alfa  164', '118-TRIAL- 299', 847),
(848, '232-TRIAL- 108', '96-TRIAL-elosulfase alfa  238', '278-TRIAL- 138', 848),
(849, '145-TRIAL- 159', '169-TRIAL-asfotase alfa  144', '62-TRIAL- 169', 849),
(850, '249-TRIAL- 118', '267-TRIAL-sebelipase alfa  58', '43-TRIAL- 261', 850),
(851, '103-TRIAL- 190', '286-TRIAL-velmanase alfa  26', '3-TRIAL- 204', 851),
(852, '0-TRIAL-A16AB16  268', '123-TRIAL-idursulfase beta  147', '296-TRIAL- 66', 852),
(853, '30-TRIAL- 65', '52-TRIAL-cerliponase alfa  200', '17-TRIAL- 73', 853),
(854, '186-TRIAL- 168', '97-TRIAL-vestronidase alfa  79', '124-TRIAL- 28', 854),
(855, '160-TRIAL- 158', '25-TRIAL-pegvaliase  167', '112-TRIAL- 134', 855),
(856, '152-TRIAL- 69', '162-TRIAL-pegunigalsidase alfa  70', '111-TRIAL- 135', 856),
(857, '290-TRIAL- 211', '264-TRIAL-atidarsagene autotemcel  250', '160-TRIAL- 45', 857),
(858, '67-TRIAL- 154', '187-TRIAL-avalglucosidase alfa  117', '265-TRIAL- 242', 858),
(859, '288-TRIAL- 73', '115-TRIAL-cipaglucosidase alfa  279', '237-TRIAL- 88', 859),
(860, '69-TRIAL- 186', '30-TRIAL-pegzilarginase  9', '140-TRIAL- 121', 860),
(861, '19-TRIAL- 181', '126-TRIAL-olipudase alfa  120', '211-TRIAL- 54', 861),
(862, '93-TRIAL- 84', '257-TRIAL-thioctic acid  199', '36-TRIAL- 229', 862),
(863, '250-TRIAL-A16AX  157', '5-TRIAL-Various alimentary tract and metabolism products 165', '234-TRIAL- 49', 863),
(864, '194-TRIAL- 92', '70-TRIAL- 119', '217-TRIAL- 213', NULL),
(865, '253-TRIAL- 217', '177-TRIAL-anethole trithione  260', '205-TRIAL- 153', 865),
(866, '291-TRIAL- 262', '276-TRIAL-sodium phenylbutyrate  54', '272-TRIAL- 34', 866),
(867, '216-TRIAL- 150', '193-TRIAL-nitisinone  45', '52-TRIAL- 47', 867),
(868, '121-TRIAL- 261', '44-TRIAL-zinc acetate  159', '166-TRIAL- 185', 868),
(869, '39-TRIAL- 18', '107-TRIAL-miglustat  168', '254-TRIAL- 250', 869),
(870, '232-TRIAL- 299', '220-TRIAL-sapropterin  235', '198-TRIAL- 92', 870),
(871, '16-TRIAL- 82', '129-TRIAL-teduglutide  116', '59-TRIAL- 258', 871),
(872, '83-TRIAL- 199', '235-TRIAL-glycerol phenylbutyrate  257', '270-TRIAL- 271', 872),
(873, '142-TRIAL- 80', '77-TRIAL-eliglustat  106', '95-TRIAL- 286', 873),
(874, '3-TRIAL-A16AX11  152', '118-TRIAL-sodium benzoate  235', '85-TRIAL- 228', 874),
(875, '178-TRIAL- 160', '101-TRIAL-trientine  249', '264-TRIAL- 285', 875),
(876, '26-TRIAL- 57', '37-TRIAL-uridine triacetate  41', '38-TRIAL- 193', 876),
(877, '296-TRIAL- 133', '293-TRIAL-migalastat  68', '273-TRIAL- 235', 877),
(878, '209-TRIAL- 96', '281-TRIAL-telotristat  261', '239-TRIAL- 184', 878),
(879, '123-TRIAL- 299', '231-TRIAL-givosiran  149', '242-TRIAL- 206', 879),
(880, '250-TRIAL- 87', '240-TRIAL-triheptanoin  269', '223-TRIAL- 88', 880),
(881, '267-TRIAL- 83', '100-TRIAL-lumasiran  58', '6-TRIAL- 138', 881),
(882, '263-TRIAL- 220', '66-TRIAL-fosdenopterin  158', '185-TRIAL- 23', 882),
(883, '129-TRIAL- 98', '256-TRIAL-lonafarnib  70', '75-TRIAL- 196', 883),
(884, '183-TRIAL- 88', '119-TRIAL-elivaldogene autotemcel  246', '90-TRIAL- 175', 884),
(885, '69-TRIAL- 19', '241-TRIAL-tiomolibdic acid  97', '145-TRIAL- 154', 885),
(886, '258-TRIAL- 258', '94-TRIAL-sodium benzoate and sodium phenylacetate  91', '141-TRIAL- 237', 886),
(887, '100-TRIAL-B01AA  32', '75-TRIAL-Vitamin K antagonists 236', '38-TRIAL- 58', 887),
(888, '280-TRIAL- 85', '13-TRIAL-dicoumarol  184', '153-TRIAL- 27', 888),
(889, '285-TRIAL-B01  26', '170-TRIAL-ANTITHROMBOTIC AGENTS 136', '281-TRIAL- 270', 889),
(890, '249-TRIAL-B  148', '77-TRIAL-BLOOD AND BLOOD FORMING ORGANS 99', '35-TRIAL- 273', 890),
(891, '237-TRIAL-B01A  251', '231-TRIAL-ANTITHROMBOTIC AGENTS 17', '133-TRIAL- 271', 891),
(892, '76-TRIAL- 29', '31-TRIAL-phenindione  244', '242-TRIAL- 267', 892),
(893, '0-TRIAL-B01AA03  28', '16-TRIAL-warfarin  34', '199-TRIAL- 57', 893),
(894, '140-TRIAL- 281', '123-TRIAL- 41', '231-TRIAL- 149', NULL),
(895, '39-TRIAL- 299', '75-TRIAL-phenprocoumon  199', '263-TRIAL- 45', 895),
(896, '26-TRIAL- 201', '124-TRIAL-acenocoumarol  83', '189-TRIAL- 35', 896),
(897, '124-TRIAL- 295', '245-TRIAL-ethyl biscoumacetate  170', '83-TRIAL- 217', 897),
(898, '192-TRIAL- 252', '224-TRIAL-clorindione  273', '140-TRIAL- 255', 898),
(899, '268-TRIAL- 170', '43-TRIAL-diphenadione  130', '156-TRIAL- 265', 899),
(900, '114-TRIAL- 280', '258-TRIAL-tioclomarol  58', '24-TRIAL- 8', 900),
(1301, '45-TRIAL- 197', '266-TRIAL- 143', '248-TRIAL- 292', NULL),
(1302, '31-TRIAL- 4', '195-TRIAL-tocainide  294', '50-TRIAL- 249', 1302),
(1303, '151-TRIAL- 181', '98-TRIAL- 245', '175-TRIAL- 245', NULL),
(1304, '84-TRIAL- 133', '100-TRIAL-aprindine  299', '267-TRIAL- 197', 1304),
(1305, '209-TRIAL-C01BC  241', '131-TRIAL-Antiarrhythmics, class Ic 299', '98-TRIAL- 174', 1305),
(1306, '87-TRIAL- 159', '62-TRIAL-propafenone  245', '129-TRIAL- 159', 1306),
(1307, '24-TRIAL- 167', '166-TRIAL- 68', '27-TRIAL- 294', NULL),
(1308, '49-TRIAL- 296', '142-TRIAL-flecainide  223', '96-TRIAL- 17', 1308),
(1309, '111-TRIAL- 268', '48-TRIAL- 181', '133-TRIAL- 74', NULL),
(1310, '88-TRIAL- 284', '168-TRIAL-lorcainide  268', '25-TRIAL- 204', 1310),
(1311, '44-TRIAL- 21', '260-TRIAL-encainide  111', '222-TRIAL- 151', 1311),
(1312, '0-TRIAL-C01BC09  142', '30-TRIAL-ethacizine  125', '230-TRIAL- 251', 1312),
(1313, '20-TRIAL-C01BD  298', '27-TRIAL-Antiarrhythmics, class III 280', '105-TRIAL- 82', 1313),
(1314, '125-TRIAL- 14', '112-TRIAL-amiodarone  204', '192-TRIAL- 109', 1314),
(1315, '238-TRIAL- 105', '166-TRIAL- 166', '71-TRIAL- 80', NULL),
(1316, '64-TRIAL- 241', '26-TRIAL-bretylium tosilate  86', '135-TRIAL- 133', 1316),
(1317, '151-TRIAL- 224', '276-TRIAL-bunaftine  292', '59-TRIAL- 51', 1317),
(1318, '296-TRIAL- 227', '7-TRIAL-dofetilide  87', '27-TRIAL- 120', 1318),
(1319, '5-TRIAL-C01BD05  27', '237-TRIAL-ibutilide  10', '83-TRIAL- 203', 1319),
(1320, '137-TRIAL- 83', '41-TRIAL-tedisamil  235', '121-TRIAL- 177', 1320),
(1321, '78-TRIAL- 80', '234-TRIAL-dronedarone  211', '29-TRIAL- 153', 1321),
(1322, '30-TRIAL-C01BG  8', '30-TRIAL-Other antiarrhythmics, class I and III 248', '32-TRIAL- 241', 1322),
(1323, '270-TRIAL- 116', '63-TRIAL-moracizine  18', '215-TRIAL- 184', 1323),
(1324, '109-TRIAL- 274', '241-TRIAL-cibenzoline  285', '208-TRIAL- 60', 1324),
(1325, '248-TRIAL- 285', '78-TRIAL-vernakalant  101', '71-TRIAL- 105', 1325),
(1326, '101-TRIAL-C01C  196', '272-TRIAL-CARDIAC STIMULANTS EXCL. CARDIAC GLYCOSIDES 109', '31-TRIAL- 287', 1326),
(1327, '270-TRIAL-C01CA  225', '284-TRIAL-Adrenergic and dopaminergic agents 202', '127-TRIAL- 246', 1327),
(1328, '188-TRIAL- 252', '197-TRIAL-etilefrine  289', '195-TRIAL- 98', 1328),
(1329, '151-TRIAL- 18', '173-TRIAL- 57', '219-TRIAL- 173', NULL),
(1330, '15-TRIAL- 68', '183-TRIAL-isoprenaline  110', '159-TRIAL- 25', 1330),
(1331, '296-TRIAL- 39', '183-TRIAL- 18', '159-TRIAL- 218', NULL),
(1332, '261-TRIAL- 167', '103-TRIAL-norepinephrine  266', '238-TRIAL- 126', 1332),
(1333, '293-TRIAL- 182', '276-TRIAL-dopamine  160', '38-TRIAL- 157', 1333),
(1334, '180-TRIAL- 254', '78-TRIAL-norfenefrine  61', '68-TRIAL- 221', 1334),
(1335, '173-TRIAL- 98', '257-TRIAL-phenylephrine  58', '219-TRIAL- 245', 1335),
(1336, '201-TRIAL- 189', '16-TRIAL-dobutamine  156', '139-TRIAL- 25', 1336),
(1337, '25-TRIAL- 32', '278-TRIAL-oxedrine  21', '16-TRIAL- 162', 1337),
(1338, '87-TRIAL- 8', '238-TRIAL- 30', '105-TRIAL- 290', NULL),
(1339, '199-TRIAL- 169', '7-TRIAL-metaraminol  53', '213-TRIAL- 56', 1339),
(1340, '285-TRIAL- 283', '148-TRIAL-methoxamine  293', '99-TRIAL- 162', 1340),
(1341, '206-TRIAL- 66', '135-TRIAL-mephentermine  219', '71-TRIAL- 264', 1341),
(1342, '199-TRIAL- 8', '247-TRIAL-dimetofrine  14', '214-TRIAL- 212', 1342),
(1343, '7-TRIAL-C01CA13  122', '227-TRIAL-prenalterol  292', '220-TRIAL- 299', 1343),
(1344, '98-TRIAL- 171', '86-TRIAL-dopexamine  92', '152-TRIAL- 17', 1344),
(1345, '124-TRIAL- 288', '93-TRIAL-gepefrine  89', '188-TRIAL- 214', 1345),
(1346, '296-TRIAL- 168', '146-TRIAL-ibopamine  158', '237-TRIAL- 145', 1346),
(1347, '168-TRIAL- 297', '225-TRIAL-midodrine  247', '21-TRIAL- 37', 1347),
(1348, '243-TRIAL- 207', '70-TRIAL-octopamine  49', '246-TRIAL- 139', 1348),
(1349, '152-TRIAL- 12', '220-TRIAL-fenoldopam  31', '76-TRIAL- 91', 1349),
(1350, '225-TRIAL- 145', '299-TRIAL-cafedrine  216', '274-TRIAL- 256', 1350),
(1351, '77-TRIAL- 272', '236-TRIAL-arbutamine  108', '296-TRIAL- 9', 1351),
(1352, '132-TRIAL- 258', '288-TRIAL-theodrenaline  144', '4-TRIAL- 230', 1352),
(1353, '227-TRIAL- 49', '219-TRIAL-epinephrine  68', '174-TRIAL- 101', 1353),
(1354, '261-TRIAL- 55', '266-TRIAL-amezinium metilsulfate  227', '13-TRIAL- 62', 1354),
(1355, '80-TRIAL- 18', '28-TRIAL-ephedrine  189', '113-TRIAL- 141', 1355),
(1356, '23-TRIAL- 96', '131-TRIAL-droxidopa  240', '231-TRIAL- 135', 1356),
(1357, '32-TRIAL- 82', '182-TRIAL-combinations  50', '44-TRIAL- 152', 1357),
(1358, '57-TRIAL- 1', '168-TRIAL-etilefrine, combinations  33', '173-TRIAL- 294', 1358),
(1359, '219-TRIAL-C01CE  126', '83-TRIAL-Phosphodiesterase inhibitors 233', '282-TRIAL- 212', 1359),
(1360, '36-TRIAL- 25', '52-TRIAL-amrinone  12', '24-TRIAL- 145', 1360),
(1361, '96-TRIAL- 2', '73-TRIAL-milrinone  58', '105-TRIAL- 177', 1361),
(1362, '58-TRIAL- 111', '181-TRIAL-enoximone  250', '170-TRIAL- 80', 1362),
(1363, '53-TRIAL- 227', '259-TRIAL-bucladesine  216', '97-TRIAL- 118', 1363),
(1364, '18-TRIAL-C01CX  177', '281-TRIAL-Other cardiac stimulants 165', '52-TRIAL- 113', 1364),
(1365, '171-TRIAL- 76', '286-TRIAL-angiotensinamide  174', '242-TRIAL- 241', 1365),
(1366, '209-TRIAL- 197', '262-TRIAL-xamoterol  48', '142-TRIAL- 48', 1366),
(1367, '192-TRIAL- 36', '20-TRIAL-levosimendan  117', '229-TRIAL- 24', 1367),
(1368, '81-TRIAL- 138', '106-TRIAL-angiotensin II  61', '250-TRIAL- 247', 1368),
(1369, '258-TRIAL-C01D  139', '105-TRIAL-VASODILATORS USED IN CARDIAC DISEASES 281', '68-TRIAL- 14', 1369),
(1370, '1-TRIAL-C01DA  116', '294-TRIAL-Organic nitrates 167', '45-TRIAL- 267', 1370),
(1371, '139-TRIAL- 263', '100-TRIAL-glyceryl trinitrate  174', '144-TRIAL- 99', 1371),
(1372, '125-TRIAL- 280', '217-TRIAL- 124', '49-TRIAL- 286', NULL),
(1373, '74-TRIAL- 57', '85-TRIAL- 15', '58-TRIAL- 275', NULL),
(1374, '130-TRIAL- 282', '111-TRIAL- 37', '270-TRIAL- 262', NULL),
(1375, '91-TRIAL- 28', '261-TRIAL-methylpropylpropanediol dinitrate  112', '296-TRIAL- 76', 1375),
(1376, '0-TRIAL-C01DA05  158', '171-TRIAL-pentaerithrityl tetranitrate  191', '148-TRIAL- 22', 1376),
(1377, '98-TRIAL- 50', '58-TRIAL-propatylnitrate  28', '245-TRIAL- 42', 1377),
(1378, '238-TRIAL- 160', '73-TRIAL-isosorbide dinitrate  177', '93-TRIAL- 95', 1378),
(1379, '104-TRIAL- 113', '132-TRIAL- 125', '104-TRIAL- 195', NULL),
(1380, '121-TRIAL- 148', '168-TRIAL- 184', '220-TRIAL- 191', NULL),
(1381, '138-TRIAL- 32', '119-TRIAL- 37', '166-TRIAL- 132', NULL),
(1382, '162-TRIAL- 234', '131-TRIAL-trolnitrate  37', '294-TRIAL- 102', 1382),
(1383, '211-TRIAL- 114', '142-TRIAL-eritrityl tetranitrate  169', '234-TRIAL- 247', 1383),
(1384, '130-TRIAL- 3', '141-TRIAL-isosorbide mononitrate  6', '211-TRIAL- 97', 1384),
(1385, '37-TRIAL- 202', '115-TRIAL-organic nitrates in combination  163', '17-TRIAL- 117', 1385),
(1386, '299-TRIAL- 151', '243-TRIAL-tenitramine  38', '182-TRIAL- 54', 1386),
(1387, '87-TRIAL- 12', '12-TRIAL-glyceryl trinitrate, combinations  222', '137-TRIAL- 274', 1387),
(1388, '191-TRIAL- 208', '18-TRIAL-methylpropylpropanediol dinitrate, combinations  51', '77-TRIAL- 123', 1388),
(1389, '52-TRIAL- 111', '30-TRIAL-pentaerithrityl tetranitrate, combinations  89', '201-TRIAL- 115', 1389),
(1390, '87-TRIAL- 228', '29-TRIAL-propatylnitrate, combinations  21', '287-TRIAL- 263', 1390),
(1391, '27-TRIAL- 188', '177-TRIAL-isosorbide dinitrate, combinations  214', '246-TRIAL- 175', 1391),
(1392, '82-TRIAL- 231', '239-TRIAL-trolnitrate, combinations  19', '169-TRIAL- 147', 1392),
(1393, '162-TRIAL- 106', '260-TRIAL-eritrityl tetranitrate, combinations  252', '5-TRIAL- 261', 1393),
(1394, '220-TRIAL- 80', '41-TRIAL-organic nitrates in combination with psycholeptics 250', '139-TRIAL- 138', 1394),
(1395, '124-TRIAL-C01DB  151', '105-TRIAL-Quinolone vasodilators 140', '289-TRIAL- 225', 1395),
(1396, '282-TRIAL- 204', '53-TRIAL-flosequinan  280', '130-TRIAL- 11', 1396),
(1397, '6-TRIAL-C01DX  258', '287-TRIAL-Other vasodilators used in cardiac diseases 251', '27-TRIAL- 30', 1397),
(1398, '222-TRIAL- 247', '207-TRIAL-itramin tosilate  296', '14-TRIAL- 5', 1398),
(1399, '49-TRIAL- 106', '210-TRIAL-prenylamine  215', '35-TRIAL- 88', 1399),
(1400, '285-TRIAL- 34', '213-TRIAL-oxyfedrine  223', '276-TRIAL- 63', 1400),
(4202, '96-TRIAL- 108', '5-TRIAL-dabrafenib  195', '217-TRIAL- 17', 4202),
(4203, '254-TRIAL- 239', '54-TRIAL-encorafenib  154', '13-TRIAL- 115', 4203),
(4204, '170-TRIAL-L01ED  126', '209-TRIAL-Anaplastic lymphoma kinase (ALK) inhibitors 70', '278-TRIAL- 288', 4204),
(4205, '23-TRIAL- 113', '96-TRIAL-crizotinib  232', '219-TRIAL- 275', 4205),
(4206, '253-TRIAL- 60', '11-TRIAL-ceritinib  182', '3-TRIAL- 138', 4206),
(4207, '66-TRIAL- 36', '197-TRIAL-alectinib  81', '118-TRIAL- 240', 4207),
(4208, '147-TRIAL- 117', '97-TRIAL-brigatinib  126', '85-TRIAL- 84', 4208),
(4209, '266-TRIAL- 36', '12-TRIAL-lorlatinib  95', '234-TRIAL- 107', 4209),
(4210, '205-TRIAL-L01EE  162', '233-TRIAL-Mitogen-activated protein kinase (MEK) inhibitors 34', '208-TRIAL- 91', 4210),
(4211, '130-TRIAL- 181', '103-TRIAL-trametinib  196', '298-TRIAL- 272', 4211),
(4212, '90-TRIAL- 3', '281-TRIAL-cobimetinib  180', '230-TRIAL- 178', 4212),
(4213, '1-TRIAL-L01EE03  186', '119-TRIAL-binimetinib  275', '167-TRIAL- 192', 4213),
(4214, '151-TRIAL- 197', '115-TRIAL-selumetinib  57', '288-TRIAL- 299', 4214),
(4215, '88-TRIAL-L01EF  225', '207-TRIAL-Cyclin-dependent kinase (CDK) inhibitors 224', '168-TRIAL- 115', 4215),
(4216, '125-TRIAL- 80', '133-TRIAL-palbociclib  65', '26-TRIAL- 223', 4216),
(4217, '4-TRIAL-L01EF02  257', '105-TRIAL-ribociclib  296', '5-TRIAL- 33', 4217),
(4218, '171-TRIAL- 127', '127-TRIAL-abemaciclib  170', '8-TRIAL- 82', 4218),
(4219, '117-TRIAL-L01EG  264', '110-TRIAL-Mammalian target of rapamycin (mTOR) kinase inhibitors 36', '93-TRIAL- 9', 4219),
(4220, '191-TRIAL- 159', '212-TRIAL-temsirolimus  230', '189-TRIAL- 255', 4220),
(4221, '174-TRIAL- 46', '207-TRIAL-everolimus  235', '211-TRIAL- 298', 4221),
(4222, '227-TRIAL- 288', '115-TRIAL-ridaforolimus  170', '70-TRIAL- 260', 4222),
(4223, '290-TRIAL- 158', '152-TRIAL-sirolimus  197', '247-TRIAL- 30', 4223),
(4224, '261-TRIAL-L01EH  86', '30-TRIAL-Human epidermal growth factor receptor 2 (HER2) tyrosine kinase inhibitors 193', '211-TRIAL- 217', 4224),
(4225, '39-TRIAL- 192', '112-TRIAL-lapatinib  282', '141-TRIAL- 12', 4225),
(4226, '6-TRIAL-L01EH02  111', '10-TRIAL-neratinib  78', '22-TRIAL- 184', 4226),
(4227, '277-TRIAL- 174', '30-TRIAL-tucatinib  112', '62-TRIAL- 141', 4227),
(4228, '118-TRIAL-L01EJ  0', '221-TRIAL-Janus-associated kinase (JAK) inhibitors 134', '53-TRIAL- 132', 4228),
(4229, '157-TRIAL- 200', '31-TRIAL-ruxolitinib  60', '178-TRIAL- 9', 4229),
(4230, '54-TRIAL- 165', '109-TRIAL-fedratinib  38', '21-TRIAL- 132', 4230),
(4231, '35-TRIAL- 177', '136-TRIAL-pacritinib  255', '109-TRIAL- 31', 4231),
(4232, '37-TRIAL-L01EK  209', '238-TRIAL-Vascular endothelial growth factor receptor (VEGFR) tyrosine kinase inhibitors 128', '279-TRIAL- 186', 4232),
(4233, '289-TRIAL- 103', '13-TRIAL-axitinib  112', '37-TRIAL- 127', 4233),
(4234, '45-TRIAL- 147', '134-TRIAL-cediranib  282', '38-TRIAL- 132', 4234),
(4235, '269-TRIAL- 159', '226-TRIAL-tivozanib  212', '299-TRIAL- 143', 4235),
(4236, '280-TRIAL-L01EL  35', '119-TRIAL-Bruton\'s tyrosine kinase (BTK) inhibitors 11', '173-TRIAL- 191', 4236),
(4237, '86-TRIAL- 221', '162-TRIAL-ibrutinib  285', '94-TRIAL- 48', 4237),
(4238, '269-TRIAL- 15', '181-TRIAL-acalabrutinib  253', '159-TRIAL- 143', 4238),
(4239, '178-TRIAL- 148', '49-TRIAL-zanubrutinib  167', '129-TRIAL- 78', 4239),
(4240, '6-TRIAL-L01EM  21', '200-TRIAL-Phosphatidylinositol-3-kinase (Pi3K) inhibitors 135', '233-TRIAL- 193', 4240),
(4241, '254-TRIAL- 71', '231-TRIAL-idelalisib  1', '11-TRIAL- 185', 4241),
(4242, '266-TRIAL- 264', '133-TRIAL-copanlisib  232', '167-TRIAL- 110', 4242),
(4243, '141-TRIAL- 270', '217-TRIAL-alpelisib  107', '173-TRIAL- 218', 4243),
(4244, '292-TRIAL- 105', '276-TRIAL-duvelisib  56', '209-TRIAL- 192', 4244),
(4245, '138-TRIAL- 18', '230-TRIAL-parsaclisib  240', '298-TRIAL- 285', 4245),
(4246, '101-TRIAL-L01EN  225', '261-TRIAL-Fibroblast growth factor receptor (FGFR) tyrosine kinase inhibitors 114', '44-TRIAL- 2', 4246),
(4247, '258-TRIAL- 251', '119-TRIAL-erdafitinib  226', '118-TRIAL- 213', 4247),
(4248, '1-TRIAL-L01EN02  40', '140-TRIAL-pemigatinib  146', '196-TRIAL- 9', 4248),
(4249, '173-TRIAL- 25', '255-TRIAL-infigratinib  96', '192-TRIAL- 297', 4249),
(4250, '21-TRIAL- 257', '106-TRIAL-futibatinib  104', '272-TRIAL- 88', 4250),
(4251, '220-TRIAL-L01EX  166', '179-TRIAL-Other protein kinase inhibitors 23', '53-TRIAL- 36', 4251),
(4252, '164-TRIAL- 299', '33-TRIAL-sunitinib  209', '220-TRIAL- 0', 4252),
(4253, '226-TRIAL- 178', '212-TRIAL-sorafenib  189', '106-TRIAL- 76', 4253),
(4254, '24-TRIAL- 14', '269-TRIAL-pazopanib  36', '262-TRIAL- 73', 4254),
(4255, '81-TRIAL- 262', '65-TRIAL-vandetanib  10', '252-TRIAL- 95', 4255),
(4256, '166-TRIAL- 190', '81-TRIAL-regorafenib  120', '263-TRIAL- 184', 4256),
(4257, '72-TRIAL- 262', '270-TRIAL-masitinib  144', '242-TRIAL- 43', 4257),
(4258, '177-TRIAL- 23', '112-TRIAL-cabozantinib  272', '283-TRIAL- 26', 4258),
(4259, '24-TRIAL- 213', '45-TRIAL-lenvatinib  217', '62-TRIAL- 42', 4259),
(4260, '59-TRIAL- 83', '260-TRIAL-nintedanib  159', '176-TRIAL- 172', 4260),
(4261, '8-TRIAL-L01EX10  191', '181-TRIAL-midostaurin  298', '225-TRIAL- 204', 4261),
(4262, '140-TRIAL- 276', '44-TRIAL-quizartinib  182', '180-TRIAL- 180', 4262),
(4263, '12-TRIAL- 185', '217-TRIAL-larotrectinib  98', '116-TRIAL- 111', 4263),
(4264, '272-TRIAL- 213', '132-TRIAL-gilteritinib  51', '257-TRIAL- 191', 4264),
(4265, '164-TRIAL- 235', '62-TRIAL-entrectinib  264', '140-TRIAL- 44', 4265),
(4266, '212-TRIAL- 135', '50-TRIAL-pexidartinib  120', '25-TRIAL- 247', 4266),
(4267, '92-TRIAL- 226', '16-TRIAL-capmatinib  270', '201-TRIAL- 121', 4267),
(4268, '212-TRIAL- 139', '172-TRIAL-avapritinib  83', '57-TRIAL- 242', 4268),
(4269, '187-TRIAL- 204', '233-TRIAL-ripretinib  102', '137-TRIAL- 39', 4269),
(4270, '6-TRIAL-L01EX21  47', '29-TRIAL-tepotinib  171', '197-TRIAL- 76', 4270),
(4271, '261-TRIAL- 189', '143-TRIAL-selpercatinib  34', '267-TRIAL- 174', 4271),
(4272, '5-TRIAL-L01EX23  269', '183-TRIAL-pralsetinib  75', '17-TRIAL- 119', 4272),
(4273, '285-TRIAL- 204', '155-TRIAL-surufatinib  179', '140-TRIAL- 1', 4273),
(4274, '265-TRIAL- 43', '152-TRIAL-umbralisib  161', '195-TRIAL- 1', 4274),
(4275, '200-TRIAL-L01F  242', '230-TRIAL-MONOCLONAL ANTIBODIES AND ANTIBODY DRUG CONJUGATES 70', '127-TRIAL- 174', 4275),
(4276, '251-TRIAL-L01FA  140', '191-TRIAL-CD20 (Clusters of Differentiation 20) inhibitors 19', '166-TRIAL- 178', 4276),
(4277, '58-TRIAL- 281', '35-TRIAL-ofatumumab  53', '229-TRIAL- 153', 4277),
(4278, '252-TRIAL- 110', '58-TRIAL-rituximab  217', '137-TRIAL- 113', 4278),
(4279, '234-TRIAL- 51', '93-TRIAL-obinutuzumab  228', '115-TRIAL- 160', 4279),
(4280, '158-TRIAL-L01FB  109', '251-TRIAL-CD22 (Clusters of Differentiation 22) inhibitors 270', '15-TRIAL- 155', 4280),
(4281, '1-TRIAL-L01FB01  164', '119-TRIAL-inotuzumab ozogamicin  232', '27-TRIAL- 32', 4281),
(4282, '128-TRIAL- 282', '68-TRIAL-moxetumomab pasudotox 265', '297-TRIAL- 243', 4282),
(4283, '218-TRIAL-L01FC  250', '57-TRIAL-CD38 (Clusters of Differentiation 38) inhibitors 7', '184-TRIAL- 282', 4283),
(4284, '286-TRIAL- 48', '262-TRIAL-daratumumab  194', '217-TRIAL- 34', 4284),
(4285, '129-TRIAL- 40', '286-TRIAL-isatuximab 82', '77-TRIAL- 253', 4285),
(4286, '269-TRIAL-L01FD  167', '276-TRIAL-HER2 (Human Epidermal Growth Factor Receptor 2) inhibitors 161', '66-TRIAL- 19', 4286),
(4287, '92-TRIAL- 17', '63-TRIAL-trastuzumab  3', '152-TRIAL- 186', 4287),
(4288, '76-TRIAL- 174', '203-TRIAL-pertuzumab  164', '180-TRIAL- 48', 4288),
(4289, '277-TRIAL- 86', '265-TRIAL-trastuzumab emtansine  46', '163-TRIAL- 208', 4289),
(4290, '296-TRIAL- 272', '153-TRIAL-trastuzumab deruxtecan  108', '182-TRIAL- 137', 4290),
(4291, '294-TRIAL- 233', '122-TRIAL-trastuzumab duocarmazine  250', '254-TRIAL- 285', 4291),
(4292, '124-TRIAL- 58', '38-TRIAL-margetuximab  143', '225-TRIAL- 205', 4292),
(4293, '210-TRIAL-L01FE  232', '196-TRIAL-EGFR (Epidermal Growth Factor Receptor) inhibitors 139', '231-TRIAL- 117', 4293),
(4294, '161-TRIAL- 11', '95-TRIAL-cetuximab  112', '79-TRIAL- 23', 4294),
(4295, '269-TRIAL- 50', '11-TRIAL-panitumumab  290', '27-TRIAL- 106', 4295),
(4296, '255-TRIAL- 110', '178-TRIAL-necitumumab  36', '220-TRIAL- 283', 4296),
(4297, '281-TRIAL- 88', '297-TRIAL-nivolumab  264', '114-TRIAL- 124', 4297),
(4298, '87-TRIAL- 191', '22-TRIAL-pembrolizumab  159', '145-TRIAL- 22', 4298),
(4299, '210-TRIAL-L01FF  108', '255-TRIAL-PD-1/PDL-1 (Programmed cell death protein 1/death ligand 1) inhibitors 80', '174-TRIAL- 182', 4299),
(4300, '33-TRIAL- 128', '76-TRIAL-durvalumab  165', '262-TRIAL- 250', 4300),
(4301, '236-TRIAL- 37', '149-TRIAL-avelumab  164', '38-TRIAL- 137', 4301),
(4302, '33-TRIAL- 155', '117-TRIAL-atezolizumab  55', '192-TRIAL- 10', 4302),
(4303, '127-TRIAL- 30', '177-TRIAL-cemiplimab  241', '245-TRIAL- 56', 4303),
(4304, '254-TRIAL- 62', '277-TRIAL-dostarlimab  53', '207-TRIAL- 148', 4304),
(4305, '260-TRIAL- 243', '265-TRIAL-prolgolimab  157', '73-TRIAL- 175', 4305),
(4306, '237-TRIAL- 114', '175-TRIAL-tislelizumab  73', '108-TRIAL- 84', 4306),
(4307, '206-TRIAL- 192', '179-TRIAL-retifanlimab  197', '28-TRIAL- 100', 4307),
(4308, '251-TRIAL-L01FG  223', '113-TRIAL-VEGF/VEGFR (Vascular Endothelial Growth Factor) inhibitors 239', '7-TRIAL- 72', 4308),
(4309, '214-TRIAL- 41', '53-TRIAL-bevacizumab  91', '194-TRIAL- 247', 4309),
(4310, '217-TRIAL- 251', '79-TRIAL-ramucirumab  179', '55-TRIAL- 205', 4310),
(4311, '75-TRIAL-L01FX  154', '208-TRIAL-Other monoclonal antibodies and antibody drug conjugates 222', '252-TRIAL- 282', 4311),
(4312, '116-TRIAL- 281', '108-TRIAL-edrecolomab  209', '99-TRIAL- 246', 4312),
(4313, '232-TRIAL- 240', '188-TRIAL-gemtuzumab ozogamicin  60', '37-TRIAL- 285', 4313),
(4314, '77-TRIAL- 280', '73-TRIAL-catumaxomab  267', '144-TRIAL- 298', 4314),
(4315, '92-TRIAL- 276', '233-TRIAL-ipilimumab  92', '134-TRIAL- 70', 4315),
(4316, '185-TRIAL- 85', '30-TRIAL-brentuximab vedotin  89', '234-TRIAL- 255', 4316),
(4317, '19-TRIAL- 0', '293-TRIAL-dinutuximab beta  188', '138-TRIAL- 208', 4317),
(4318, '220-TRIAL- 77', '253-TRIAL-blinatumomab  88', '184-TRIAL- 97', 4318),
(4319, '294-TRIAL- 147', '6-TRIAL-elotuzumab  228', '283-TRIAL- 155', 4319),
(4320, '96-TRIAL- 163', '120-TRIAL-mogamulizumab  131', '58-TRIAL- 187', 4320),
(4321, '142-TRIAL- 96', '137-TRIAL-olaratumab  4', '278-TRIAL- 183', 4321),
(4322, '261-TRIAL- 65', '273-TRIAL-bermekimab  95', '158-TRIAL- 28', 4322),
(4323, '179-TRIAL- 193', '24-TRIAL-tafasitamab  211', '229-TRIAL- 91', 4323),
(4324, '159-TRIAL- 133', '36-TRIAL-enfortumab vedotin  184', '267-TRIAL- 93', 4324),
(4325, '11-TRIAL- 151', '184-TRIAL-polatuzumab vedotin  121', '196-TRIAL- 60', 4325),
(4326, '50-TRIAL- 94', '25-TRIAL-belantamab mafodotin  5', '201-TRIAL- 159', 4326),
(4327, '120-TRIAL- 94', '223-TRIAL-oportuzumab monatox  15', '189-TRIAL- 267', 4327),
(4328, '240-TRIAL- 286', '112-TRIAL-sacituzumab govitecan  16', '209-TRIAL- 140', 4328),
(4329, '142-TRIAL- 60', '100-TRIAL-amivantamab  296', '280-TRIAL- 142', 4329),
(4330, '152-TRIAL- 155', '105-TRIAL-sabatolimab  41', '86-TRIAL- 133', 4330),
(4331, '163-TRIAL- 23', '119-TRIAL-tremelimumab  70', '26-TRIAL- 273', 4331),
(4332, '131-TRIAL- 269', '188-TRIAL-naxitamab  253', '269-TRIAL- 137', 4332),
(4333, '188-TRIAL- 180', '167-TRIAL-loncastuximab tesirine  234', '275-TRIAL- 181', 4333),
(4334, '228-TRIAL- 195', '152-TRIAL-tisotumab vedotin  141', '269-TRIAL- 267', 4334),
(4335, '169-TRIAL-L01X  116', '173-TRIAL-OTHER ANTINEOPLASTIC AGENTS 169', '26-TRIAL- 104', 4335),
(4336, '48-TRIAL-L01XA  282', '94-TRIAL-Platinum compounds 197', '226-TRIAL- 290', 4336),
(4337, '290-TRIAL- 112', '255-TRIAL-cisplatin  247', '236-TRIAL- 12', 4337),
(4338, '74-TRIAL- 145', '132-TRIAL-carboplatin  266', '71-TRIAL- 167', 4338),
(4339, '175-TRIAL- 236', '289-TRIAL-oxaliplatin  48', '297-TRIAL- 277', 4339),
(4340, '92-TRIAL- 54', '43-TRIAL-satraplatin  146', '262-TRIAL- 199', 4340),
(4341, '109-TRIAL- 256', '20-TRIAL-polyplatillen  13', '219-TRIAL- 4', 4341),
(4342, '255-TRIAL-L01XB  60', '247-TRIAL-Methylhydrazines 199', '71-TRIAL- 129', 4342),
(4343, '154-TRIAL- 71', '196-TRIAL-procarbazine  17', '67-TRIAL- 21', 4343),
(4344, '151-TRIAL-L01XD  138', '5-TRIAL-Sensitizers used in photodynamic/radiation therapy 217', '48-TRIAL- 117', 4344),
(4345, '227-TRIAL- 75', '34-TRIAL-porfimer sodium  21', '34-TRIAL- 24', 4345),
(4346, '70-TRIAL- 114', '202-TRIAL-methyl aminolevulinate  8', '288-TRIAL- 122', 4346),
(4347, '4-TRIAL-L01XD04  121', '42-TRIAL-aminolevulinic acid  100', '268-TRIAL- 40', 4347),
(4348, '110-TRIAL- 238', '153-TRIAL-temoporfin  146', '145-TRIAL- 13', 4348),
(4349, '245-TRIAL- 10', '281-TRIAL-efaproxiral  226', '259-TRIAL- 104', 4349),
(4350, '121-TRIAL- 87', '137-TRIAL-padeliporfin  145', '231-TRIAL- 54', 4350),
(4351, '39-TRIAL-L01XF  290', '171-TRIAL-Retinoids for cancer treatment 158', '265-TRIAL- 174', 4351),
(4352, '8-TRIAL-L01XF01  0', '69-TRIAL-tretinoin  104', '42-TRIAL- 35', 4352),
(4353, '237-TRIAL- 76', '275-TRIAL-alitretinoin  259', '278-TRIAL- 101', 4353),
(4354, '287-TRIAL- 62', '33-TRIAL-bexarotene  91', '235-TRIAL- 132', 4354),
(4355, '224-TRIAL-L01XG  162', '203-TRIAL-Proteasome inhibitors 189', '200-TRIAL- 294', 4355),
(4356, '218-TRIAL- 32', '45-TRIAL-bortezomib  132', '187-TRIAL- 282', 4356),
(4357, '139-TRIAL- 97', '42-TRIAL-carfilzomib  227', '32-TRIAL- 26', 4357),
(4358, '64-TRIAL- 97', '83-TRIAL-ixazomib  248', '7-TRIAL- 231', 4358),
(4359, '131-TRIAL-L01XH  84', '240-TRIAL-Histone deacetylase (HDAC) inhibitors 3', '139-TRIAL- 226', 4359),
(4360, '90-TRIAL- 115', '248-TRIAL-vorinostat  37', '215-TRIAL- 289', 4360),
(4361, '99-TRIAL- 226', '173-TRIAL-romidepsin  225', '173-TRIAL- 222', 4361),
(4362, '63-TRIAL- 79', '103-TRIAL-panobinostat  285', '116-TRIAL- 173', 4362),
(4363, '71-TRIAL- 173', '237-TRIAL-belinostat  157', '145-TRIAL- 294', 4363),
(4364, '246-TRIAL- 19', '146-TRIAL-entinostat  23', '40-TRIAL- 81', 4364),
(4365, '87-TRIAL-L01XJ  173', '194-TRIAL-Hedgehog pathway inhibitors 192', '8-TRIAL- 59', 4365),
(4366, '29-TRIAL- 99', '230-TRIAL-vismodegib  181', '270-TRIAL- 226', 4366),
(4367, '33-TRIAL- 249', '62-TRIAL-sonidegib  280', '154-TRIAL- 50', 4367),
(4368, '164-TRIAL- 267', '30-TRIAL-glasdegib  15', '174-TRIAL- 164', 4368),
(4369, '275-TRIAL-L01XK  152', '239-TRIAL-Poly (ADP-ribose) polymerase (PARP) inhibitors 278', '15-TRIAL- 63', 4369),
(4370, '113-TRIAL- 84', '278-TRIAL-olaparib  258', '63-TRIAL- 203', 4370),
(4371, '75-TRIAL- 170', '69-TRIAL-niraparib  268', '201-TRIAL- 295', 4371),
(4372, '58-TRIAL- 50', '68-TRIAL-rucaparib  279', '238-TRIAL- 126', 4372),
(4373, '31-TRIAL- 265', '88-TRIAL-talazoparib  196', '7-TRIAL- 106', 4373),
(4374, '46-TRIAL- 237', '2-TRIAL-veliparib  225', '136-TRIAL- 221', 4374),
(4375, '161-TRIAL- 98', '69-TRIAL-pamiparib  203', '254-TRIAL- 72', 4375),
(4376, '152-TRIAL-L01XL  111', '49-TRIAL-Antineoplastic cell and gene therapy 68', '179-TRIAL- 156', 4376),
(4377, '129-TRIAL- 205', '53-TRIAL-sitimagene ceradenovec  205', '179-TRIAL- 297', 4377),
(4378, '225-TRIAL- 297', '282-TRIAL-talimogene laherparepvec  168', '25-TRIAL- 65', 4378),
(4379, '236-TRIAL- 212', '272-TRIAL-axicabtagene ciloleucel  273', '233-TRIAL- 48', 4379),
(4380, '287-TRIAL- 84', '64-TRIAL-tisagenlecleucel  38', '6-TRIAL- 107', 4380),
(4381, '274-TRIAL- 2', '250-TRIAL-ciltacabtagene autoleucel  236', '223-TRIAL- 224', 4381),
(4382, '58-TRIAL- 58', '213-TRIAL-brexucabtagene autoleucel  177', '143-TRIAL- 125', 4382),
(4383, '64-TRIAL- 40', '116-TRIAL-idecabtagene vicleucel  212', '271-TRIAL- 0', 4383),
(4384, '218-TRIAL-L01XX  245', '5-TRIAL-Other antineoplastic agents 52', '227-TRIAL- 271', 4384),
(4385, '188-TRIAL- 23', '282-TRIAL-amsacrine  294', '236-TRIAL- 5', 4385),
(4386, '38-TRIAL- 3', '103-TRIAL-asparaginase  238', '186-TRIAL- 28', 4386),
(4387, '120-TRIAL- 165', '123-TRIAL-altretamine  182', '126-TRIAL- 280', 4387),
(4388, '216-TRIAL- 263', '246-TRIAL-hydroxycarbamide  154', '51-TRIAL- 35', 4388),
(4389, '239-TRIAL- 197', '245-TRIAL-lonidamine  258', '136-TRIAL- 257', 4389),
(4390, '72-TRIAL- 76', '31-TRIAL-pentostatin  49', '142-TRIAL- 299', 4390),
(4391, '286-TRIAL- 177', '70-TRIAL-masoprocol  40', '223-TRIAL- 235', 4391),
(4392, '85-TRIAL- 52', '256-TRIAL-estramustine  197', '279-TRIAL- 174', 4392),
(4393, '86-TRIAL- 15', '199-TRIAL-mitoguazone  234', '113-TRIAL- 73', 4393),
(4394, '162-TRIAL- 35', '237-TRIAL-tiazofurine  232', '88-TRIAL- 52', 4394),
(4395, '75-TRIAL- 41', '287-TRIAL-mitotane  72', '271-TRIAL- 126', 4395),
(4396, '98-TRIAL- 244', '145-TRIAL-pegaspargase  140', '257-TRIAL- 74', 4396),
(4397, '257-TRIAL- 177', '118-TRIAL-arsenic trioxide  103', '11-TRIAL- 211', 4397),
(4398, '215-TRIAL- 187', '195-TRIAL-denileukin diftitox  44', '21-TRIAL- 72', 4398),
(4399, '182-TRIAL- 43', '233-TRIAL-celecoxib  120', '293-TRIAL- 139', 4399),
(4400, '196-TRIAL- 232', '133-TRIAL-anagrelide  71', '8-TRIAL- 146', 4400),
(4401, '27-TRIAL- 286', '281-TRIAL-oblimersen  193', '109-TRIAL- 68', 4401),
(4502, '256-TRIAL- 1', '286-TRIAL-ropeginterferon alfa-2b  283', '48-TRIAL- 296', 4502),
(4503, '159-TRIAL- 65', '88-TRIAL-peginterferon alfacon-2  56', '127-TRIAL- 230', 4503),
(4504, '131-TRIAL- 41', '138-TRIAL-peginterferon alfa-2b, combinations  226', '46-TRIAL- 130', 4504),
(4505, '197-TRIAL- 32', '67-TRIAL-peginterferon alfa-2a, combinations  143', '142-TRIAL- 81', 4505),
(4506, '209-TRIAL-L03AC  12', '154-TRIAL-Interleukins 91', '162-TRIAL- 35', 4506),
(4507, '269-TRIAL- 18', '285-TRIAL-aldesleukin  78', '141-TRIAL- 260', 4507),
(4508, '75-TRIAL- 288', '298-TRIAL-oprelvekin  262', '96-TRIAL- 78', 4508),
(4509, '26-TRIAL-L03AX  195', '213-TRIAL-Other immunostimulants 292', '143-TRIAL- 235', 4509),
(4510, '97-TRIAL- 170', '217-TRIAL-lentinan  218', '153-TRIAL- 36', 4510),
(4511, '130-TRIAL- 177', '48-TRIAL- 281', '187-TRIAL- 297', NULL),
(4512, '83-TRIAL- 139', '73-TRIAL-roquinimex  204', '232-TRIAL- 154', 4512),
(4513, '47-TRIAL- 169', '169-TRIAL-BCG vaccine  92', '78-TRIAL- 107', 4513),
(4514, '207-TRIAL- 204', '299-TRIAL-pegademase  108', '40-TRIAL- 185', 4514),
(4515, '11-TRIAL- 74', '26-TRIAL-pidotimod  88', '197-TRIAL- 71', 4515),
(4516, '181-TRIAL- 200', '123-TRIAL-poly I:C  253', '178-TRIAL- 122', 4516),
(4517, '266-TRIAL- 200', '285-TRIAL-poly ICLC  206', '48-TRIAL- 255', 4517),
(4518, '164-TRIAL- 213', '78-TRIAL-thymopentin  20', '193-TRIAL- 167', 4518),
(4519, '79-TRIAL- 284', '166-TRIAL-immunocyanin  190', '134-TRIAL- 262', 4519),
(4520, '15-TRIAL- 127', '167-TRIAL-tasonermin  295', '12-TRIAL- 37', 4520),
(4521, '169-TRIAL- 130', '288-TRIAL-melanoma vaccine  224', '86-TRIAL- 249', 4521),
(4522, '137-TRIAL- 148', '284-TRIAL-glatiramer acetate  176', '88-TRIAL- 226', 4522),
(4523, '50-TRIAL- 96', '239-TRIAL-histamine dihydrochloride  246', '118-TRIAL- 118', 4523),
(4524, '53-TRIAL- 61', '45-TRIAL-mifamurtide  289', '174-TRIAL- 169', 4524),
(4525, '196-TRIAL- 190', '147-TRIAL-plerixafor  255', '266-TRIAL- 127', 4525),
(4526, '189-TRIAL- 80', '102-TRIAL-sipuleucel-T  205', '145-TRIAL- 120', 4526),
(4527, '142-TRIAL- 253', '215-TRIAL-cridanimod  242', '79-TRIAL- 237', 4527),
(4528, '119-TRIAL- 180', '0-TRIAL-dasiprotimut-T  32', '99-TRIAL- 185', 4528),
(4529, '93-TRIAL- 240', '19-TRIAL-elapegademase  184', '45-TRIAL- 271', 4529),
(4530, '245-TRIAL-L04  144', '264-TRIAL-IMMUNOSUPPRESSANTS 14', '280-TRIAL- 160', 4530),
(4531, '220-TRIAL-L04A  116', '39-TRIAL-IMMUNOSUPPRESSANTS 86', '182-TRIAL- 67', 4531),
(4532, '26-TRIAL-L04AA  255', '140-TRIAL-Selective immunosuppressants 38', '57-TRIAL- 229', 4532),
(4533, '2-TRIAL-L04AA02  59', '176-TRIAL-muromonab-CD3  103', '141-TRIAL- 117', 4533),
(4534, '37-TRIAL- 203', '45-TRIAL-antilymphocyte immunoglobulin (horse)  220', '36-TRIAL- 165', 4534),
(4535, '46-TRIAL- 224', '183-TRIAL-antithymocyte immunoglobulin (rabbit)  196', '258-TRIAL- 164', 4535),
(4536, '94-TRIAL- 227', '142-TRIAL-mycophenolic acid  292', '171-TRIAL- 298', 4536),
(4537, '72-TRIAL- 120', '241-TRIAL- 289', '194-TRIAL- 190', NULL),
(4538, '294-TRIAL- 144', '278-TRIAL-sirolimus  18', '189-TRIAL- 291', 4538),
(4539, '113-TRIAL- 189', '37-TRIAL-leflunomide  248', '126-TRIAL- 132', 4539),
(4540, '47-TRIAL- 227', '41-TRIAL-alefacept  293', '250-TRIAL- 277', 4540),
(4541, '47-TRIAL- 294', '141-TRIAL-everolimus  228', '235-TRIAL- 65', 4541),
(4542, '41-TRIAL- 233', '277-TRIAL-gusperimus  37', '39-TRIAL- 7', 4542),
(4543, '10-TRIAL- 110', '176-TRIAL-efalizumab  224', '49-TRIAL- 154', 4543),
(4544, '227-TRIAL- 130', '153-TRIAL-abetimus  298', '199-TRIAL- 207', 4544),
(4545, '230-TRIAL- 79', '270-TRIAL-natalizumab  180', '84-TRIAL- 6', 4545),
(4546, '153-TRIAL- 278', '74-TRIAL-abatacept  230', '140-TRIAL- 194', 4546),
(4547, '99-TRIAL- 197', '160-TRIAL-eculizumab  15', '151-TRIAL- 284', 4547),
(4548, '168-TRIAL- 217', '228-TRIAL-belimumab  287', '209-TRIAL- 16', 4548),
(4549, '298-TRIAL- 7', '262-TRIAL-fingolimod  230', '192-TRIAL- 182', 4549),
(4550, '110-TRIAL- 73', '299-TRIAL-belatacept  196', '155-TRIAL- 96', 4550),
(4551, '257-TRIAL- 240', '55-TRIAL-tofacitinib  4', '227-TRIAL- 263', 4551),
(4552, '17-TRIAL- 146', '95-TRIAL-teriflunomide  162', '162-TRIAL- 143', 4552),
(4553, '289-TRIAL- 230', '216-TRIAL-apremilast  282', '106-TRIAL- 251', 4553),
(4554, '146-TRIAL- 278', '185-TRIAL-vedolizumab  118', '170-TRIAL- 223', 4554),
(4555, '118-TRIAL- 188', '48-TRIAL-alemtuzumab  50', '152-TRIAL- 217', 4555),
(4556, '191-TRIAL- 268', '8-TRIAL-begelomab  149', '209-TRIAL- 58', 4556),
(4557, '110-TRIAL- 145', '62-TRIAL-ocrelizumab  63', '210-TRIAL- 186', 4557),
(4558, '93-TRIAL- 90', '267-TRIAL-baricitinib  11', '206-TRIAL- 291', 4558),
(4559, '6-TRIAL-L04AA38  120', '235-TRIAL-ozanimod  299', '87-TRIAL- 21', 4559),
(4560, '194-TRIAL- 234', '88-TRIAL-emapalumab  115', '103-TRIAL- 213', 4560),
(4561, '254-TRIAL- 109', '170-TRIAL-cladribine  280', '239-TRIAL- 211', 4561),
(4562, '83-TRIAL- 193', '136-TRIAL-imlifidase  231', '172-TRIAL- 282', 4562),
(4563, '264-TRIAL- 108', '294-TRIAL-siponimod  167', '238-TRIAL- 192', 4563),
(4564, '232-TRIAL- 292', '80-TRIAL-ravulizumab  224', '36-TRIAL- 253', 4564),
(4565, '219-TRIAL- 89', '183-TRIAL-upadacitinib  143', '281-TRIAL- 281', 4565),
(4566, '292-TRIAL- 278', '144-TRIAL-filgotinib  172', '184-TRIAL- 139', 4566),
(4567, '188-TRIAL- 148', '200-TRIAL-itacitinib  129', '160-TRIAL- 175', 4567),
(4568, '146-TRIAL- 226', '34-TRIAL-inebilizumab  52', '89-TRIAL- 163', 4568),
(4569, '165-TRIAL- 71', '288-TRIAL-belumosudil  88', '10-TRIAL- 213', 4569),
(4570, '233-TRIAL- 48', '213-TRIAL-peficitinib  291', '190-TRIAL- 157', 4570),
(4571, '273-TRIAL- 181', '147-TRIAL-ponesimod  270', '46-TRIAL- 2', 4571),
(4572, '201-TRIAL- 278', '247-TRIAL-anifrolumab  298', '70-TRIAL- 97', 4572),
(4573, '219-TRIAL- 96', '290-TRIAL-ofatumumab  84', '27-TRIAL- 222', 4573),
(4574, '186-TRIAL- 269', '124-TRIAL-teprotumumab  46', '275-TRIAL- 3', 4574),
(4575, '106-TRIAL- 114', '193-TRIAL-pegcetacoplan  199', '142-TRIAL- 93', 4575),
(4576, '265-TRIAL- 36', '168-TRIAL-sutimlimab  127', '187-TRIAL- 153', 4576),
(4577, '189-TRIAL- 31', '52-TRIAL-deucravacitinib  52', '174-TRIAL- 148', 4577),
(4578, '255-TRIAL- 133', '160-TRIAL-ublituximab  242', '238-TRIAL- 59', 4578),
(4579, '11-TRIAL- 138', '16-TRIAL-efgartigimod alfa  290', '4-TRIAL- 147', 4579),
(4580, '93-TRIAL- 226', '72-TRIAL-avacopan  74', '109-TRIAL- 167', 4580),
(4581, '93-TRIAL-L04AB  265', '268-TRIAL-Tumor necrosis factor alpha (TNF-α) inhibitors 102', '299-TRIAL- 183', 4581),
(4582, '122-TRIAL- 266', '215-TRIAL-etanercept  55', '142-TRIAL- 210', 4582),
(4583, '55-TRIAL- 2', '72-TRIAL-infliximab  282', '39-TRIAL- 266', 4583),
(4584, '104-TRIAL- 220', '214-TRIAL-afelimomab  204', '165-TRIAL- 66', 4584),
(4585, '36-TRIAL- 236', '117-TRIAL-adalimumab  197', '206-TRIAL- 187', 4585),
(4586, '221-TRIAL- 48', '130-TRIAL-certolizumab pegol  38', '225-TRIAL- 264', 4586),
(4587, '93-TRIAL- 57', '210-TRIAL-golimumab  154', '114-TRIAL- 134', 4587),
(4588, '111-TRIAL- 287', '269-TRIAL-opinercept  12', '289-TRIAL- 296', 4588),
(4589, '296-TRIAL-L04AC  14', '229-TRIAL-Interleukin inhibitors 255', '97-TRIAL- 4', 4589),
(4590, '131-TRIAL- 180', '196-TRIAL-daclizumab  39', '221-TRIAL- 147', 4590),
(4591, '138-TRIAL- 228', '93-TRIAL-basiliximab  12', '62-TRIAL- 243', 4591),
(4592, '266-TRIAL- 193', '39-TRIAL-anakinra  245', '296-TRIAL- 36', 4592),
(4593, '286-TRIAL- 196', '103-TRIAL-rilonacept  12', '157-TRIAL- 177', 4593),
(4594, '262-TRIAL- 234', '176-TRIAL-ustekinumab  103', '264-TRIAL- 275', 4594),
(4595, '111-TRIAL- 6', '239-TRIAL-tocilizumab  257', '41-TRIAL- 286', 4595),
(4596, '15-TRIAL- 37', '187-TRIAL-canakinumab  25', '5-TRIAL- 242', 4596),
(4597, '108-TRIAL- 178', '60-TRIAL-briakinumab  143', '19-TRIAL- 219', 4597),
(4598, '148-TRIAL- 73', '206-TRIAL-secukinumab  202', '166-TRIAL- 137', 4598),
(4599, '90-TRIAL- 183', '199-TRIAL-siltuximab  29', '274-TRIAL- 77', 4599),
(4600, '128-TRIAL- 53', '37-TRIAL-brodalumab  294', '232-TRIAL- 92', 4600),
(4601, '70-TRIAL- 100', '284-TRIAL-ixekizumab  142', '138-TRIAL- 18', 4601),
(5102, '119-TRIAL- 246', '57-TRIAL-codeine and acetylsalicylic acid  37', '241-TRIAL- 2', 5102),
(5103, '273-TRIAL- 240', '221-TRIAL-codeine and ibuprofen  16', '162-TRIAL- 50', 5103),
(5104, '134-TRIAL- 73', '261-TRIAL-codeine and other non-opioid analgesics  35', '111-TRIAL- 290', 5104),
(5105, '78-TRIAL- 73', '190-TRIAL-tramadol and paracetamol  255', '147-TRIAL- 288', 5105),
(5106, '49-TRIAL- 233', '224-TRIAL-tramadol and dexketoprofen  149', '155-TRIAL- 7', 5106),
(5107, '64-TRIAL- 199', '69-TRIAL-tramadol and other non-opioid analgesics  133', '228-TRIAL- 257', 5107),
(5108, '257-TRIAL- 130', '100-TRIAL-tramadol and celecoxib  155', '155-TRIAL- 48', 5108),
(5109, '298-TRIAL- 271', '114-TRIAL-oxycodone and paracetamol  233', '8-TRIAL- 27', 5109),
(5110, '285-TRIAL- 129', '20-TRIAL-oxycodone and acetylsalicylic acid  36', '223-TRIAL- 201', 5110),
(5111, '69-TRIAL- 240', '60-TRIAL-oxycodone and ibuprofen  42', '8-TRIAL- 13', 5111),
(5112, '125-TRIAL-N02AX  98', '140-TRIAL-Other opioids 253', '241-TRIAL- 202', 5112),
(5113, '279-TRIAL- 153', '220-TRIAL-tilidine  285', '296-TRIAL- 62', 5113);
INSERT INTO `atc_code` (`ATC_ID`, `Code`, `Name`, `Description`, `ParentID`) VALUES
(5114, '276-TRIAL- 128', '253-TRIAL- 69', '231-TRIAL- 283', NULL),
(5115, '210-TRIAL- 69', '97-TRIAL-tramadol  298', '78-TRIAL- 158', 5115),
(5116, '98-TRIAL- 219', '254-TRIAL- 76', '90-TRIAL- 95', NULL),
(5117, '70-TRIAL- 110', '75-TRIAL- 144', '162-TRIAL- 45', NULL),
(5118, '263-TRIAL- 26', '290-TRIAL-dezocine  52', '150-TRIAL- 240', 5118),
(5119, '274-TRIAL- 17', '74-TRIAL-meptazinol  85', '169-TRIAL- 71', 5119),
(5120, '57-TRIAL- 30', '7-TRIAL- 134', '118-TRIAL- 238', NULL),
(5121, '156-TRIAL- 232', '205-TRIAL-tapentadol  205', '55-TRIAL- 213', 5121),
(5122, '156-TRIAL- 41', '291-TRIAL-oliceridine  185', '198-TRIAL- 94', 5122),
(5123, '136-TRIAL- 256', '218-TRIAL-tilidine and naloxone  180', '181-TRIAL- 274', 5123),
(5124, '299-TRIAL-N02B  191', '41-TRIAL-OTHER ANALGESICS AND ANTIPYRETICS 60', '187-TRIAL- 286', 5124),
(5125, '236-TRIAL-N02BA  271', '104-TRIAL-Salicylic acid and derivatives 238', '200-TRIAL- 176', 5125),
(5126, '42-TRIAL- 65', '231-TRIAL-acetylsalicylic acid  244', '30-TRIAL- 150', 5126),
(5127, '230-TRIAL- 245', '226-TRIAL- 68', '198-TRIAL- 80', NULL),
(5128, '222-TRIAL- 259', '158-TRIAL- 116', '7-TRIAL- 253', NULL),
(5129, '121-TRIAL- 243', '290-TRIAL-aloxiprin  21', '230-TRIAL- 11', 5129),
(5130, '212-TRIAL- 140', '153-TRIAL-choline salicylate  64', '215-TRIAL- 160', 5130),
(5131, '84-TRIAL- 68', '247-TRIAL-sodium salicylate  66', '226-TRIAL- 120', 5131),
(5132, '166-TRIAL- 103', '58-TRIAL-salicylamide  285', '220-TRIAL- 71', 5132),
(5133, '263-TRIAL- 205', '243-TRIAL-salsalate  237', '222-TRIAL- 138', 5133),
(5134, '286-TRIAL- 168', '157-TRIAL-ethenzamide  15', '89-TRIAL- 174', 5134),
(5135, '103-TRIAL- 43', '228-TRIAL-morpholine salicylate  262', '265-TRIAL- 242', 5135),
(5136, '139-TRIAL- 276', '151-TRIAL-dipyrocetyl  295', '30-TRIAL- 142', 5136),
(5137, '109-TRIAL- 210', '208-TRIAL-benorilate  235', '151-TRIAL- 197', 5137),
(5138, '146-TRIAL- 186', '171-TRIAL-diflunisal  234', '29-TRIAL- 284', 5138),
(5139, '282-TRIAL- 15', '163-TRIAL-potassium salicylate  63', '178-TRIAL- 74', 5139),
(5140, '54-TRIAL- 251', '287-TRIAL-guacetisal  106', '105-TRIAL- 9', 5140),
(5141, '126-TRIAL- 62', '197-TRIAL-carbasalate calcium  221', '86-TRIAL- 28', 5141),
(5142, '43-TRIAL- 92', '261-TRIAL-imidazole salicylate  204', '190-TRIAL- 107', 5142),
(5143, '14-TRIAL- 22', '195-TRIAL-acetylsalicylic acid, combinations excl. psycholeptics  259', '181-TRIAL- 41', 5143),
(5144, '83-TRIAL- 17', '122-TRIAL-salicylamide, combinations excl. psycholeptics  226', '266-TRIAL- 243', 5144),
(5145, '250-TRIAL- 9', '122-TRIAL-ethenzamide, combinations excl. psycholeptics  44', '131-TRIAL- 1', 5145),
(5146, '193-TRIAL- 12', '238-TRIAL-dipyrocetyl, combinations excl. psycholeptics  78', '242-TRIAL- 220', 5146),
(5147, '168-TRIAL- 182', '57-TRIAL-carbasalate calcium combinations excl. psycholeptics  65', '136-TRIAL- 53', 5147),
(5148, '46-TRIAL- 275', '46-TRIAL-acetylsalicylic acid, combinations with psycholeptics  54', '252-TRIAL- 3', 5148),
(5149, '133-TRIAL- 101', '79-TRIAL-salicylamide, combinations with psycholeptics  172', '284-TRIAL- 226', 5149),
(5150, '42-TRIAL- 290', '92-TRIAL-ethenzamide, combinations with psycholeptics  270', '161-TRIAL- 164', 5150),
(5151, '117-TRIAL- 249', '169-TRIAL-dipyrocetyl, combinations with psycholeptics  40', '81-TRIAL- 115', 5151),
(5152, '201-TRIAL-N02BB  157', '73-TRIAL-Pyrazolones 159', '97-TRIAL- 244', 5152),
(5153, '109-TRIAL- 109', '81-TRIAL-phenazone  178', '207-TRIAL- 166', 5153),
(5154, '113-TRIAL- 113', '279-TRIAL-metamizole sodium  50', '259-TRIAL- 12', 5154),
(5155, '110-TRIAL- 261', '92-TRIAL- 160', '225-TRIAL- 142', NULL),
(5156, '146-TRIAL- 120', '188-TRIAL- 112', '57-TRIAL- 141', NULL),
(5157, '242-TRIAL- 261', '201-TRIAL-aminophenazone  39', '237-TRIAL- 242', 5157),
(5158, '276-TRIAL- 290', '21-TRIAL-propyphenazone  19', '271-TRIAL- 20', 5158),
(5159, '290-TRIAL- 119', '234-TRIAL-nifenazone  86', '16-TRIAL- 292', 5159),
(5160, '172-TRIAL- 222', '232-TRIAL-phenazone, combinations excl. psycholeptics  218', '272-TRIAL- 116', 5160),
(5161, '19-TRIAL- 73', '218-TRIAL-metamizole sodium, combinations excl. psycholeptics  8', '12-TRIAL- 40', 5161),
(5162, '173-TRIAL- 98', '57-TRIAL-phenazone, combinations with psycholeptics  269', '273-TRIAL- 298', 5162),
(5163, '125-TRIAL- 195', '220-TRIAL-aminophenazone, combinations excl. psycholeptics  267', '102-TRIAL- 269', 5163),
(5164, '292-TRIAL- 227', '274-TRIAL-propyphenazone, combinations excl. psycholeptics  216', '55-TRIAL- 61', 5164),
(5165, '283-TRIAL- 130', '197-TRIAL-metamizole sodium, combinations with psycholeptics  245', '144-TRIAL- 105', 5165),
(5166, '254-TRIAL- 295', '221-TRIAL-aminophenazone, combinations with psycholeptics  80', '26-TRIAL- 47', 5166),
(5167, '154-TRIAL- 163', '281-TRIAL-propyphenazone, combinations with psycholeptics  72', '174-TRIAL- 57', 5167),
(5168, '218-TRIAL-N02BE  87', '29-TRIAL-Anilides 297', '81-TRIAL- 218', 5168),
(5169, '119-TRIAL- 38', '92-TRIAL-paracetamol  76', '175-TRIAL- 280', 5169),
(5170, '99-TRIAL- 152', '265-TRIAL- 266', '224-TRIAL- 182', NULL),
(5171, '104-TRIAL- 10', '166-TRIAL- 240', '259-TRIAL- 209', NULL),
(5172, '184-TRIAL- 213', '40-TRIAL-phenacetin  95', '68-TRIAL- 94', 5172),
(5173, '182-TRIAL- 179', '108-TRIAL-bucetin  222', '3-TRIAL- 214', 5173),
(5174, '197-TRIAL- 224', '89-TRIAL-propacetamol  242', '54-TRIAL- 146', 5174),
(5175, '198-TRIAL- 149', '216-TRIAL-paracetamol, combinations excl. psycholeptics  211', '61-TRIAL- 203', 5175),
(5176, '71-TRIAL- 24', '131-TRIAL-phenacetin, combinations excl. psycholeptics  169', '19-TRIAL- 36', 5176),
(5177, '70-TRIAL- 242', '176-TRIAL-bucetin, combinations excl. psycholeptics  143', '161-TRIAL- 99', 5177),
(5178, '239-TRIAL- 109', '52-TRIAL-paracetamol, combinations with psycholeptics  249', '83-TRIAL- 238', 5178),
(5179, '197-TRIAL- 289', '158-TRIAL-phenacetin, combinations with psycholeptics  4', '71-TRIAL- 57', 5179),
(5180, '235-TRIAL- 194', '146-TRIAL-bucetin, combinations with psycholeptics  174', '68-TRIAL- 236', 5180),
(5181, '211-TRIAL-N02BF  106', '35-TRIAL-Gabapentinoids 188', '38-TRIAL- 202', 5181),
(5182, '283-TRIAL- 211', '233-TRIAL-gabapentin  222', '128-TRIAL- 61', 5182),
(5183, '262-TRIAL- 83', '154-TRIAL-pregabalin  260', '264-TRIAL- 285', 5183),
(5184, '118-TRIAL- 28', '86-TRIAL-mirogabalin  183', '274-TRIAL- 23', 5184),
(5185, '101-TRIAL-N02BG  232', '23-TRIAL-Other analgesics and antipyretics 79', '147-TRIAL- 159', 5185),
(5186, '8-TRIAL-N02BG02  24', '235-TRIAL-rimazolium  5', '208-TRIAL- 178', 5186),
(5187, '163-TRIAL- 177', '176-TRIAL-glafenine  128', '212-TRIAL- 60', 5187),
(5188, '162-TRIAL- 150', '89-TRIAL-floctafenine  143', '25-TRIAL- 140', 5188),
(5189, '210-TRIAL- 34', '163-TRIAL-viminol  43', '111-TRIAL- 138', 5189),
(5190, '39-TRIAL- 16', '231-TRIAL-nefopam  73', '46-TRIAL- 243', 5190),
(5191, '94-TRIAL- 288', '244-TRIAL-flupirtine  122', '298-TRIAL- 101', 5191),
(5192, '122-TRIAL- 57', '12-TRIAL-ziconotide  146', '3-TRIAL- 128', 5192),
(5193, '143-TRIAL- 2', '8-TRIAL-methoxyflurane  283', '213-TRIAL- 251', 5193),
(5194, '16-TRIAL- 45', '295-TRIAL-cannabinoids  244', '0-TRIAL- 192', 5194),
(5195, '202-TRIAL- 15', '170-TRIAL-tanezumab  96', '54-TRIAL- 93', 5195),
(5196, '100-TRIAL-N02C  122', '173-TRIAL-ANTIMIGRAINE PREPARATIONS 61', '131-TRIAL- 275', 5196),
(5197, '143-TRIAL-N02CA  122', '181-TRIAL-Ergot alkaloids 178', '149-TRIAL- 241', 5197),
(5198, '292-TRIAL- 258', '111-TRIAL-dihydroergotamine  187', '264-TRIAL- 291', 5198),
(5199, '235-TRIAL- 35', '214-TRIAL- 74', '67-TRIAL- 194', NULL),
(5200, '82-TRIAL- 275', '57-TRIAL- 218', '270-TRIAL- 110', NULL),
(5201, '241-TRIAL- 264', '252-TRIAL-ergotamine  42', '231-TRIAL- 26', 5201),
(5202, '151-TRIAL- 78', '159-TRIAL- 265', '120-TRIAL- 20', NULL),
(5203, '97-TRIAL- 279', '186-TRIAL- 207', '176-TRIAL- 91', NULL),
(5204, '31-TRIAL- 295', '118-TRIAL- 267', '89-TRIAL- 8', NULL),
(5205, '84-TRIAL- 262', '233-TRIAL- 79', '64-TRIAL- 139', NULL),
(5206, '129-TRIAL- 51', '144-TRIAL-methysergide  263', '204-TRIAL- 52', 5206),
(5207, '77-TRIAL- 115', '298-TRIAL-lisuride  125', '40-TRIAL- 156', 5207),
(5208, '248-TRIAL- 252', '44-TRIAL-dihydroergotamine, combinations  154', '187-TRIAL- 270', 5208),
(5209, '276-TRIAL- 122', '112-TRIAL-ergotamine, combinations excl. psycholeptics  6', '82-TRIAL- 135', 5209),
(5210, '299-TRIAL- 30', '120-TRIAL-ergotamine, combinations with psycholeptics  295', '276-TRIAL- 20', 5210),
(5211, '73-TRIAL-N02CB  151', '153-TRIAL-Corticosteroid derivatives 287', '292-TRIAL- 28', 5211),
(5212, '62-TRIAL- 59', '149-TRIAL-flumedroxone  108', '193-TRIAL- 188', 5212),
(5213, '236-TRIAL-N02CC  125', '109-TRIAL-Selective serotonin (5HT1) agonists 97', '38-TRIAL- 183', 5213),
(5214, '145-TRIAL- 248', '165-TRIAL-sumatriptan  284', '17-TRIAL- 161', 5214),
(5215, '179-TRIAL- 79', '189-TRIAL- 33', '290-TRIAL- 65', NULL),
(5216, '145-TRIAL- 68', '166-TRIAL- 240', '239-TRIAL- 21', NULL),
(5217, '56-TRIAL- 133', '235-TRIAL- 128', '278-TRIAL- 1', NULL),
(5218, '172-TRIAL- 48', '299-TRIAL-naratriptan  94', '51-TRIAL- 240', 5218),
(5219, '124-TRIAL- 27', '165-TRIAL-zolmitriptan  152', '170-TRIAL- 149', 5219),
(5220, '56-TRIAL- 52', '90-TRIAL- 251', '22-TRIAL- 148', NULL),
(5221, '155-TRIAL- 84', '234-TRIAL-rizatriptan  284', '215-TRIAL- 176', 5221),
(5222, '235-TRIAL- 102', '188-TRIAL-almotriptan  212', '202-TRIAL- 114', 5222),
(5223, '292-TRIAL- 238', '58-TRIAL-eletriptan  189', '95-TRIAL- 225', 5223),
(5224, '258-TRIAL- 153', '205-TRIAL-frovatriptan  296', '207-TRIAL- 31', 5224),
(5225, '132-TRIAL- 221', '242-TRIAL-lasmiditan  62', '22-TRIAL- 188', 5225),
(5226, '152-TRIAL-N02CD  216', '121-TRIAL-Calcitonin gene-related peptide (CGRP) antagonists 92', '148-TRIAL- 55', 5226),
(5227, '154-TRIAL- 145', '9-TRIAL-erenumab  281', '53-TRIAL- 71', 5227),
(5228, '113-TRIAL- 195', '44-TRIAL-galcanezumab  48', '65-TRIAL- 106', 5228),
(5229, '70-TRIAL- 272', '149-TRIAL-fremanezumab  235', '113-TRIAL- 252', 5229),
(5230, '46-TRIAL- 213', '69-TRIAL-ubrogepant  136', '259-TRIAL- 100', 5230),
(5231, '43-TRIAL- 240', '145-TRIAL-eptinezumab  16', '138-TRIAL- 230', 5231),
(5232, '91-TRIAL- 154', '81-TRIAL-rimegepant  117', '116-TRIAL- 223', 5232),
(5233, '122-TRIAL- 145', '18-TRIAL-clonidine  75', '185-TRIAL- 237', 5233),
(5234, '287-TRIAL- 164', '247-TRIAL-atogepant  93', '250-TRIAL- 138', 5234),
(5235, '277-TRIAL-N02CX  202', '216-TRIAL-Other antimigraine preparations 25', '211-TRIAL- 162', 5235),
(5236, '227-TRIAL- 197', '218-TRIAL-pizotifen  76', '26-TRIAL- 237', 5236),
(5237, '170-TRIAL- 68', '7-TRIAL-iprazochrome  284', '224-TRIAL- 139', 5237),
(5238, '30-TRIAL- 227', '283-TRIAL-dimetotiazine  2', '174-TRIAL- 47', 5238),
(5239, '259-TRIAL- 167', '9-TRIAL-oxetorone  106', '95-TRIAL- 243', 5239),
(5240, '251-TRIAL-N03A 144', '151-TRIAL- ANTIEPILEPTICS 205', '299-TRIAL- 44', 5240),
(5241, '134-TRIAL-N03AA 68', '169-TRIAL- Barbiturates and derivatives 142', '170-TRIAL- 277', 5240),
(5242, '207-TRIAL- 7', '156-TRIAL-methylphenobarbital  111', '3-TRIAL- 35', 5242),
(5243, '97-TRIAL- 79', '45-TRIAL-phenobarbital  138', '33-TRIAL- 73', 5243),
(5244, '237-TRIAL- 295', '107-TRIAL- 176', '199-TRIAL- 81', NULL),
(5245, '25-TRIAL- 42', '117-TRIAL-primidone  54', '22-TRIAL- 103', 5245),
(5246, '200-TRIAL- 145', '57-TRIAL-barbexaclone  184', '179-TRIAL- 214', 5246),
(5247, '255-TRIAL- 109', '16-TRIAL-metharbital  261', '80-TRIAL- 64', 5247),
(5248, '65-TRIAL- 187', '18-TRIAL-ethotoin  116', '274-TRIAL- 204', 5248),
(5249, '246-TRIAL-N03AB 60', '203-TRIAL- Hydantoin derivatives 294', '260-TRIAL- 154', 5240),
(5250, '16-TRIAL- 244', '261-TRIAL-phenytoin  110', '180-TRIAL- 195', 5250),
(5251, '99-TRIAL- 183', '143-TRIAL- 117', '176-TRIAL- 43', NULL),
(5252, '19-TRIAL- 150', '186-TRIAL-mephenytoin  54', '137-TRIAL- 8', 5252),
(5253, '38-TRIAL- 261', '175-TRIAL-amino(diphenylhydantoin) valeric acid  213', '230-TRIAL- 116', 5253),
(5254, '153-TRIAL- 284', '277-TRIAL-fosphenytoin  294', '68-TRIAL- 109', 5254),
(5255, '114-TRIAL- 107', '34-TRIAL-phenytoin, combinations  24', '172-TRIAL- 131', 5255),
(5256, '143-TRIAL- 249', '156-TRIAL-mephenytoin, combinations  117', '140-TRIAL- 55', 5256),
(5257, '35-TRIAL-N03AC  110', '54-TRIAL-Oxazolidine derivatives 178', '106-TRIAL- 207', 5257),
(5258, '5-TRIAL-N03AC02  267', '7-TRIAL-trimethadione  172', '86-TRIAL- 77', 5258),
(5259, '102-TRIAL- 158', '133-TRIAL-ethosuximide  207', '23-TRIAL- 171', 5259),
(5260, '235-TRIAL-N03AD 63', '262-TRIAL- Succinimide derivatives 289', '51-TRIAL- 261', 5240),
(5261, '204-TRIAL- 25', '11-TRIAL-ethadione  160', '28-TRIAL- 93', 5261),
(5262, '250-TRIAL- 92', '123-TRIAL-phensuximide  47', '88-TRIAL- 281', 5262),
(5263, '87-TRIAL- 212', '209-TRIAL-paramethadione  227', '238-TRIAL- 195', 5263),
(5264, '257-TRIAL- 262', '101-TRIAL-mesuximide  170', '156-TRIAL- 80', 5264),
(5265, '194-TRIAL- 87', '5-TRIAL-ethosuximide, combinations  237', '187-TRIAL- 35', 5265),
(5266, '80-TRIAL-N03AE  262', '252-TRIAL-Benzodiazepine derivatives 72', '61-TRIAL- 25', 5266),
(5267, '80-TRIAL- 79', '227-TRIAL-clonazepam  272', '234-TRIAL- 152', 5267),
(5268, '224-TRIAL-N03AF  36', '62-TRIAL-Carboxamide derivatives 64', '225-TRIAL- 119', 5268),
(5269, '195-TRIAL- 232', '182-TRIAL-carbamazepine  81', '119-TRIAL- 296', 5269),
(5270, '180-TRIAL- 48', '245-TRIAL- 171', '54-TRIAL- 166', NULL),
(5271, '269-TRIAL- 233', '193-TRIAL-oxcarbazepine  216', '249-TRIAL- 256', 5271),
(5272, '171-TRIAL- 200', '99-TRIAL-rufinamide  95', '5-TRIAL- 210', 5272),
(5273, '251-TRIAL- 16', '8-TRIAL-eslicarbazepine  42', '190-TRIAL- 141', 5273),
(5274, '149-TRIAL-N03AG 116', '55-TRIAL- Fatty acid derivatives 146', '223-TRIAL- 33', 5240),
(5275, '180-TRIAL- 297', '186-TRIAL-valproic acid  30', '140-TRIAL- 49', 5275),
(5276, '226-TRIAL- 247', '217-TRIAL- 215', '210-TRIAL- 46', NULL),
(5277, '177-TRIAL- 225', '221-TRIAL- 264', '73-TRIAL- 241', NULL),
(5278, '141-TRIAL- 62', '191-TRIAL-valpromide  67', '114-TRIAL- 288', 5278),
(5279, '259-TRIAL- 202', '97-TRIAL-aminobutyric acid  166', '36-TRIAL- 200', 5279),
(5280, '50-TRIAL- 279', '265-TRIAL- 79', '174-TRIAL- 187', NULL),
(5281, '160-TRIAL- 214', '133-TRIAL-vigabatrin  264', '265-TRIAL- 265', 5281),
(5282, '107-TRIAL- 53', '31-TRIAL-progabide  260', '65-TRIAL- 221', 5282),
(5283, '150-TRIAL- 2', '10-TRIAL-tiagabine  294', '256-TRIAL- 96', 5283),
(5284, '59-TRIAL-N03AX  121', '121-TRIAL-Other antiepileptics 19', '68-TRIAL- 184', 5284),
(5285, '105-TRIAL- 160', '161-TRIAL-sultiame  67', '21-TRIAL- 67', 5285),
(5286, '28-TRIAL- 87', '192-TRIAL-phenacemide  58', '190-TRIAL- 192', 5286),
(5287, '280-TRIAL- 215', '111-TRIAL-lamotrigine  176', '179-TRIAL- 3', 5287),
(5288, '57-TRIAL- 201', '271-TRIAL-felbamate  140', '210-TRIAL- 107', 5288),
(5289, '89-TRIAL- 297', '95-TRIAL-topiramate  146', '253-TRIAL- 16', 5289),
(5290, '220-TRIAL- 135', '171-TRIAL-pheneturide  285', '32-TRIAL- 268', 5290),
(5291, '252-TRIAL- 1', '19-TRIAL-levetiracetam  205', '169-TRIAL- 206', 5291),
(5292, '119-TRIAL- 132', '51-TRIAL- 113', '171-TRIAL- 132', NULL),
(5293, '38-TRIAL- 235', '255-TRIAL-zonisamide  86', '207-TRIAL- 136', 5293),
(5294, '87-TRIAL- 284', '115-TRIAL-stiripentol  225', '242-TRIAL- 258', 5294),
(5295, '130-TRIAL- 233', '291-TRIAL-lacosamide  18', '124-TRIAL- 171', 5295),
(5296, '273-TRIAL- 215', '27-TRIAL- 138', '276-TRIAL- 221', NULL),
(5297, '269-TRIAL- 180', '142-TRIAL-carisbamate  7', '268-TRIAL- 223', 5297),
(5298, '187-TRIAL- 273', '35-TRIAL-retigabine  133', '153-TRIAL- 184', 5298),
(5299, '54-TRIAL- 191', '279-TRIAL-perampanel  274', '133-TRIAL- 136', 5299),
(5300, '123-TRIAL- 110', '153-TRIAL-brivaracetam  259', '178-TRIAL- 210', 5300),
(5301, '195-TRIAL- 142', '262-TRIAL- 127', '141-TRIAL- 280', NULL),
(7302, '39-TRIAL- 218', '188-TRIAL-indium (111In) satumomab pendetide  47', '41-TRIAL- 297', 7302),
(7303, '205-TRIAL- 279', '230-TRIAL-indium (111In) antiovariumcarcinoma antibody  136', '13-TRIAL- 214', 7303),
(7304, '170-TRIAL- 239', '133-TRIAL-indium (111In) capromab pendetide  15', '34-TRIAL- 205', 7304),
(7305, '255-TRIAL-V09IX  147', '295-TRIAL-Other diagnostic radiopharmaceuticals for tumour detection 130', '293-TRIAL- 195', 7305),
(7306, '73-TRIAL- 295', '184-TRIAL-iobenguane (123I)  183', '85-TRIAL- 160', 7306),
(7307, '22-TRIAL- 260', '71-TRIAL-iobenguane (131I)  96', '179-TRIAL- 0', 7307),
(7308, '52-TRIAL- 123', '113-TRIAL-iodine (125I) CC49-monoclonal antibody  189', '71-TRIAL- 236', 7308),
(7309, '158-TRIAL- 280', '263-TRIAL-fludeoxyglucose (18F)  286', '37-TRIAL- 103', 7309),
(7310, '152-TRIAL- 194', '162-TRIAL-fluorodopa (18F)  28', '173-TRIAL- 9', 7310),
(7311, '186-TRIAL- 4', '10-TRIAL-sodium fluoride (18F)  66', '55-TRIAL- 62', 7311),
(7312, '229-TRIAL- 269', '89-TRIAL-fluorocholine(18F)  208', '126-TRIAL- 149', 7312),
(7313, '182-TRIAL- 260', '198-TRIAL-fluoroethylcholine (18F)  277', '169-TRIAL- 47', 7313),
(7314, '41-TRIAL- 297', '205-TRIAL-gallium (68Ga) edotreotide  167', '100-TRIAL- 163', 7314),
(7315, '124-TRIAL- 285', '117-TRIAL-fluoroethyl-L-tyrosine (18F)  17', '186-TRIAL- 277', 7315),
(7316, '18-TRIAL- 16', '144-TRIAL-fluoroestradiol (18F)  44', '106-TRIAL- 131', 7316),
(7317, '141-TRIAL- 223', '289-TRIAL-fluciclovine (18F)  188', '15-TRIAL- 122', 7317),
(7318, '162-TRIAL- 57', '21-TRIAL-methionine (11C)  56', '187-TRIAL- 131', 7318),
(7319, '88-TRIAL- 141', '6-TRIAL-gallium (68Ga) gozetotide  235', '159-TRIAL- 227', 7319),
(7320, '94-TRIAL- 294', '87-TRIAL-copper (64Cu) dotatate  281', '163-TRIAL- 191', 7320),
(7321, '166-TRIAL- 253', '205-TRIAL-piflufolastat (18F)  150', '28-TRIAL- 25', 7321),
(7322, '89-TRIAL- 292', '16-TRIAL-PSMA-1007 (18F)  228', '31-TRIAL- 184', 7322),
(7323, '221-TRIAL-V09X  295', '92-TRIAL-OTHER DIAGNOSTIC RADIOPHARMACEUTICALS 40', '260-TRIAL- 214', 7323),
(7324, '95-TRIAL-V09XA  244', '11-TRIAL-Iodine (131I) compounds 171', '154-TRIAL- 41', 7324),
(7325, '298-TRIAL- 204', '193-TRIAL-iodine (131I) norcholesterol  190', '9-TRIAL- 191', 7325),
(7326, '15-TRIAL- 40', '27-TRIAL-iodocholesterol (131I)  152', '279-TRIAL- 100', 7326),
(7327, '293-TRIAL- 142', '9-TRIAL-iodine (131I) human albumin  197', '270-TRIAL- 43', 7327),
(7328, '185-TRIAL-V09XX  282', '58-TRIAL-Various diagnostic radiopharmaceuticals 101', '52-TRIAL- 189', 7328),
(7329, '144-TRIAL- 27', '134-TRIAL-cobalt (57Co) cyanocobalamine  236', '108-TRIAL- 285', 7329),
(7330, '231-TRIAL- 152', '116-TRIAL-cobalt (58Co) cyanocobalamine  283', '248-TRIAL- 88', 7330),
(7331, '39-TRIAL- 100', '113-TRIAL-selenium (75Se) norcholesterol  259', '268-TRIAL- 229', 7331),
(7332, '56-TRIAL- 113', '56-TRIAL-ferric (59Fe) citrate  99', '1-TRIAL- 199', 7332),
(7333, '266-TRIAL-V10A  263', '24-TRIAL-ANTIINFLAMMATORY AGENTS 165', '102-TRIAL- 129', 7333),
(7334, '158-TRIAL-V10AA  140', '296-TRIAL-Yttrium (90Y) compounds 19', '255-TRIAL- 16', 7334),
(7335, '174-TRIAL- 219', '95-TRIAL-yttrium (90Y) citrate colloid  72', '253-TRIAL- 270', 7335),
(7336, '249-TRIAL-V10 183', '252-TRIAL- THERAPEUTIC RADIOPHARMACEUTICALS 238', '288-TRIAL- 189', 7336),
(7337, '165-TRIAL- 78', '20-TRIAL-yttrium (90Y) ferrihydroxide colloid  262', '228-TRIAL- 88', 7337),
(7338, '84-TRIAL- 58', '149-TRIAL-yttrium (90Y) silicate colloid  16', '252-TRIAL- 38', 7338),
(7339, '93-TRIAL-V10AX  23', '149-TRIAL-Other antiinflammatory therapeutic radiopharmaceuticals 2', '48-TRIAL- 283', 7339),
(7340, '112-TRIAL- 284', '138-TRIAL-phosphorous (32P) chromicphosphate colloid  117', '295-TRIAL- 48', 7340),
(7341, '56-TRIAL- 114', '18-TRIAL-samarium (153Sm) hydroxyapatite colloid  60', '52-TRIAL- 86', 7341),
(7342, '122-TRIAL- 105', '211-TRIAL-dysprosium (165Dy) colloid  290', '259-TRIAL- 7', 7342),
(7343, '149-TRIAL- 149', '203-TRIAL-erbium (169Er) citrate colloid  209', '106-TRIAL- 98', 7343),
(7344, '180-TRIAL- 65', '68-TRIAL-rhenium (186Re) sulfide colloid  136', '18-TRIAL- 123', 7344),
(7345, '113-TRIAL- 41', '91-TRIAL-gold (198Au) colloidal  63', '18-TRIAL- 79', 7345),
(7346, '131-TRIAL-V10BX  36', '185-TRIAL-Various pain palliation radiopharmaceuticals 192', '184-TRIAL- 162', 7346),
(7347, '135-TRIAL-V10B 241', '249-TRIAL- PAIN PALLIATION (BONE SEEKING AGENTS) 196', '136-TRIAL- 85', 7336),
(7348, '96-TRIAL- 35', '219-TRIAL-strontium (89Sr) chloride  35', '50-TRIAL- 61', 7348),
(7349, '69-TRIAL- 233', '186-TRIAL-samarium (153Sm) lexidronam  1', '154-TRIAL- 106', 7349),
(7350, '78-TRIAL- 258', '46-TRIAL-rhenium (186Re) etidronic acid  215', '253-TRIAL- 234', 7350),
(7351, '65-TRIAL-V10XA  149', '27-TRIAL-Iodine (131I) compounds 165', '212-TRIAL- 78', 7351),
(7352, '11-TRIAL-V10X 254', '198-TRIAL- OTHER THERAPEUTIC RADIOPHARMACEUTICALS 149', '58-TRIAL- 153', 7336),
(7353, '155-TRIAL- 119', '193-TRIAL-sodium iodide (131I)  286', '71-TRIAL- 216', 7353),
(7354, '73-TRIAL- 161', '150-TRIAL-iobenguane (131I)  149', '152-TRIAL- 123', 7354),
(7355, '175-TRIAL- 119', '291-TRIAL-iodine (131I) omburtamab  240', '183-TRIAL- 159', 7355),
(7356, '261-TRIAL- 136', '220-TRIAL-tositumomab/iodine (131I) tositumomab  124', '155-TRIAL- 271', 7356),
(7357, '121-TRIAL-V10XX  214', '98-TRIAL-Various therapeutic radiopharmaceuticals 292', '192-TRIAL- 104', 7357),
(7358, '157-TRIAL- 277', '125-TRIAL-sodium phosphate (32P)  112', '280-TRIAL- 197', 7358),
(7359, '192-TRIAL- 277', '139-TRIAL-ibritumomab tiuxetan (90Y)  2', '138-TRIAL- 2', 7359),
(7360, '31-TRIAL- 134', '116-TRIAL-radium (223Ra) dichloride  245', '177-TRIAL- 236', 7360),
(7361, '5-TRIAL-V10XX04  259', '13-TRIAL-lutetium (177Lu) oxodotreotide  298', '289-TRIAL- 110', 7361),
(7362, '242-TRIAL- 197', '241-TRIAL-lutetium (177Lu) vipivotide tetraxetan  75', '119-TRIAL- 259', 7362),
(7363, '269-TRIAL-V20  216', '41-TRIAL-SURGICAL DRESSINGS 44', '280-TRIAL- 253', 7363);

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

-- --------------------------------------------------------

--
-- Table structure for table `batchserialnumber`
--

CREATE TABLE `batchserialnumber` (
  `BatchSerialNumberId` int(11) NOT NULL,
  `BatchId` int(11) DEFAULT NULL,
  `SerialNumber` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `BrandId` int(11) NOT NULL,
  `BrandName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
(1, 'first', 0, 100, 200, 300, 400, 500, 600, 700, 800, 900),
(2, 'second', 1, 110, 210, 310, 410, 510, 610, 710, 810, 910),
(1, 'first', 0, 100, 200, 300, 400, 500, 600, 700, 800, 900),
(2, 'second', 1, 110, 210, 310, 410, 510, 610, 710, 810, 910);

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

-- --------------------------------------------------------

--
-- Table structure for table `countrygovernoratemapping`
--

CREATE TABLE `countrygovernoratemapping` (
  `CountryId` int(11) NOT NULL,
  `GovernorateId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `diseasecategoryatc`
--

CREATE TABLE `diseasecategoryatc` (
  `MappingId` int(11) NOT NULL,
  `DiseaseCategoryId` int(11) NOT NULL,
  `ATC_CodeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `districtcitymapping`
--

CREATE TABLE `districtcitymapping` (
  `DistrictId` int(11) NOT NULL,
  `CityId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
(3, 'Tonai', 'Organization', 'Zgharté', '03117117', 'tonai@example.com', 'lebanon', 1, '2024-03-20', '2024-03-20');

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
(52, '41-TRIAL-Pessary 167', '34-TRIAL- 100', '2024-04-16 08:28:32', NULL),
(53, '269-TRIAL-Powder 124', '78-TRIAL- 258', '2024-04-16 08:28:32', NULL),
(54, '262-TRIAL-Powder, effervescent 164', '5-TRIAL- 245', '2024-04-16 08:28:32', NULL),
(55, '181-TRIAL-Powder, for solution 27', '61-TRIAL- 191', '2024-04-16 08:28:32', NULL),
(56, '295-TRIAL-Powder, for suspension 242', '27-TRIAL- 36', '2024-04-16 08:28:32', NULL),
(57, '291-TRIAL-Powder, inhalation 204', '2-TRIAL- 153', '2024-04-16 08:28:32', NULL),
(58, '292-TRIAL-Rotacaps 82', '21-TRIAL- 116', '2024-04-16 08:28:32', NULL),
(59, '218-TRIAL-Pulvule 95', '47-TRIAL- 126', '2024-04-16 08:28:32', NULL),
(60, '71-TRIAL-Respule 138', '69-TRIAL- 112', '2024-04-16 08:28:32', NULL),
(61, '167-TRIAL-Ring 199', '235-TRIAL- 294', '2024-04-16 08:28:32', NULL),
(62, '203-TRIAL-Shampoo 111', '122-TRIAL- 33', '2024-04-16 08:28:32', NULL),
(63, '273-TRIAL-Solution 164', '141-TRIAL- 211', '2024-04-16 08:28:32', NULL),
(64, '53-TRIAL-Solution, film forming 268', '47-TRIAL- 44', '2024-04-16 08:28:32', NULL),
(65, '262-TRIAL-Solution, inhalation 57', '237-TRIAL- 259', '2024-04-16 08:28:32', NULL),
(66, '23-TRIAL-Spray 141', '229-TRIAL- 178', '2024-04-16 08:28:32', NULL),
(67, '16-TRIAL-Suspension, inhalation 35', '290-TRIAL- 42', '2024-04-16 08:28:32', NULL),
(68, '288-TRIAL-Syrup 106', '40-TRIAL- 242', '2024-04-16 08:28:32', NULL),
(69, '64-TRIAL-Tablet 148', '146-TRIAL- 105', '2024-04-16 08:28:32', NULL),
(70, '290-TRIAL-Suppository 129', '70-TRIAL- 50', '2024-04-16 08:28:32', NULL),
(71, '6-TRIAL-Tablet, chewable 201', '93-TRIAL- 248', '2024-04-16 08:28:32', NULL),
(72, '129-TRIAL-Tablet, coated 23', '84-TRIAL- 154', '2024-04-16 08:28:32', NULL),
(73, '156-TRIAL-Tablet, controlled release / extended release / modified release / prolonged release / slow release / sustained release 140', '166-TRIAL- 176', '2024-04-16 08:28:32', NULL),
(74, '131-TRIAL-Tablet, repetab 208', '144-TRIAL- 39', '2024-04-16 08:28:32', NULL),
(75, '26-TRIAL-Tablet, dispersible 223', '137-TRIAL- 238', '2024-04-16 08:28:32', NULL),
(76, '218-TRIAL-Tablet, effervescent 282', '129-TRIAL- 41', '2024-04-16 08:28:32', NULL),
(77, '33-TRIAL-Tablet, delayed release / enteric coated / gastro-resistant 215', '139-TRIAL- 258', '2024-04-16 08:28:32', NULL),
(78, '204-TRIAL-Tablet, film coated 30', '177-TRIAL- 206', '2024-04-16 08:28:32', NULL),
(79, '173-TRIAL-Tablet, microgranules 186', '221-TRIAL- 245', '2024-04-16 08:28:32', NULL),
(80, '224-TRIAL-Tablet, lyophilised / freeze-dried 172', '270-TRIAL- 129', '2024-04-16 08:28:32', NULL),
(81, '77-TRIAL-Tablet, sugar coated 273', '297-TRIAL- 12', '2024-04-16 08:28:32', NULL),
(82, '286-TRIAL-Tablet, orally disintegrating / mouth dissolving / orodispersible 90', '161-TRIAL- 36', '2024-04-16 08:28:32', NULL),
(83, '155-TRIAL-Vaginal delivery system 167', '255-TRIAL- 274', '2024-04-16 08:28:32', NULL),
(84, '131-TRIAL-Volatile liquid 52', '50-TRIAL- 250', '2024-04-16 08:28:32', NULL),
(85, '141-TRIAL-Water, for injection / for irrigation 124', '166-TRIAL- 130', '2024-04-16 08:28:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dosageformmapping`
--

CREATE TABLE `dosageformmapping` (
  `DosageFormMappingId` int(11) NOT NULL,
  `DosageId` int(11) NOT NULL,
  `DosageFormId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `drugbrands`
--

CREATE TABLE `drugbrands` (
  `DrugId` int(11) NOT NULL,
  `BrandId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `drugdispensingconditions`
--

CREATE TABLE `drugdispensingconditions` (
  `DrugID` int(11) NOT NULL,
  `DispensingConditionsID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `drugform`
--

CREATE TABLE `drugform` (
  `DrugFormId` int(11) NOT NULL,
  `DrugId` int(11) NOT NULL,
  `FormId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `druginteraction`
--

CREATE TABLE `druginteraction` (
  `DrugInteractionID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `Interaction` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `druginteractions`
--

CREATE TABLE `druginteractions` (
  `DrugInteractionID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `Interaction` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `drug_atc_mapping`
--

CREATE TABLE `drug_atc_mapping` (
  `MappingID` int(11) NOT NULL,
  `DrugID` int(11) DEFAULT NULL,
  `ATC_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `governoratedistrictmapping`
--

CREATE TABLE `governoratedistrictmapping` (
  `GovernorateId` int(11) NOT NULL,
  `DistrictId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
(1, 1);

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
(1, 'Operation 1', NULL, NULL, NULL),
(2, 'Operation 2', NULL, NULL, NULL);

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
(2, '0.40', '0.50', '0.60', 1);

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

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `RoleId` int(11) NOT NULL,
  `RoleName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

-- --------------------------------------------------------

--
-- Table structure for table `substitute`
--

CREATE TABLE `substitute` (
  `SubstituteId` int(11) NOT NULL,
  `Drug` int(11) DEFAULT NULL,
  `Substitute` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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
  MODIFY `AgentID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `BatchLotId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
  MODIFY `DonorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dosage`
--
ALTER TABLE `dosage`
  MODIFY `DosageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dosageform`
--
ALTER TABLE `dosageform`
  MODIFY `DosageFormId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `dosageformmapping`
--
ALTER TABLE `dosageformmapping`
  MODIFY `DosageFormMappingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug`
--
ALTER TABLE `drug`
  MODIFY `DrugID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `PresentationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drugroute`
--
ALTER TABLE `drugroute`
  MODIFY `DrugRouteId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drugstratum`
--
ALTER TABLE `drugstratum`
  MODIFY `DrugStratumId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drugtreatment`
--
ALTER TABLE `drugtreatment`
  MODIFY `DrugTreatmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drug_atc_mapping`
--
ALTER TABLE `drug_atc_mapping`
  MODIFY `MappingID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `SubstituteId` int(11) NOT NULL AUTO_INCREMENT;

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
