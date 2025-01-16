-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2022 at 03:52 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 5.6.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hris_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `addition`
--

CREATE TABLE `addition` (
  `addi_id` int(14) NOT NULL,
  `salary_id` int(14) NOT NULL,
  `basic` varchar(128) DEFAULT NULL,
  `medical` varchar(64) DEFAULT NULL,
  `house_rent` varchar(64) DEFAULT NULL,
  `conveyance` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `addition`
--

INSERT INTO `addition` (`addi_id`, `salary_id`, `basic`, `medical`, `house_rent`, `conveyance`) VALUES
(11, 1, NULL, NULL, NULL, NULL),
(12, 2, NULL, NULL, NULL, NULL),
(13, 3, NULL, NULL, NULL, NULL),
(14, 4, NULL, NULL, NULL, NULL),
(15, 5, NULL, NULL, NULL, NULL),
(16, 6, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(14) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `address` varchar(512) DEFAULT NULL,
  `type` enum('Present','Permanent') DEFAULT 'Present'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `emp_id`, `city`, `country`, `address`, `type`) VALUES
(1, 'Sis1477', 'Jakarta', 'DKI Jakarta', 'Jalan x', 'Permanent');

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `ass_id` int(14) NOT NULL,
  `catid` varchar(14) NOT NULL,
  `ass_name` varchar(256) DEFAULT NULL,
  `ass_brand` varchar(128) DEFAULT NULL,
  `ass_model` varchar(256) DEFAULT NULL,
  `ass_code` varchar(256) DEFAULT NULL,
  `configuration` varchar(512) DEFAULT NULL,
  `purchasing_date` varchar(128) DEFAULT NULL,
  `ass_price` varchar(128) DEFAULT NULL,
  `ass_qty` varchar(64) DEFAULT NULL,
  `in_stock` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `assets_category`
--

CREATE TABLE `assets_category` (
  `cat_id` int(14) NOT NULL,
  `cat_status` enum('ASSETS','LOGISTIC') NOT NULL DEFAULT 'ASSETS',
  `cat_name` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assets_category`
--

INSERT INTO `assets_category` (`cat_id`, `cat_status`, `cat_name`) VALUES
(1, 'ASSETS', 'TAB'),
(2, 'ASSETS', 'Computer'),
(3, 'ASSETS', 'Laptop'),
(4, 'LOGISTIC', 'tab');

-- --------------------------------------------------------

--
-- Table structure for table `assign_leave`
--

CREATE TABLE `assign_leave` (
  `id` int(14) NOT NULL,
  `app_id` varchar(11) DEFAULT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `type_id` int(14) NOT NULL,
  `day` varchar(256) DEFAULT NULL,
  `hour` varchar(255) NOT NULL,
  `total_day` varchar(64) DEFAULT NULL,
  `dateyear` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assign_leave`
--

INSERT INTO `assign_leave` (`id`, `app_id`, `emp_id`, `type_id`, `day`, `hour`, `total_day`, `dateyear`) VALUES
(1, '', 'Ram1186', 10, '12', '', '12', '2022'),
(2, NULL, 'an1390', 10, '12', '', '12', '2022'),
(3, NULL, 'Soy1332', 10, '23', '', '0', '2022'),
(4, NULL, 'Sis1477', 10, '12', '', '0', '2022');

-- --------------------------------------------------------

--
-- Table structure for table `assign_task`
--

CREATE TABLE `assign_task` (
  `id` int(14) NOT NULL,
  `task_id` int(14) NOT NULL,
  `project_id` int(14) NOT NULL,
  `assign_user` varchar(64) DEFAULT NULL,
  `user_type` enum('Team Head','Collaborators') NOT NULL DEFAULT 'Collaborators'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assign_task`
--

INSERT INTO `assign_task` (`id`, `task_id`, `project_id`, `assign_user`, `user_type`) VALUES
(1, 1, 1, 'Moo1402', 'Team Head'),
(2, 1, 1, 'Doe1753', 'Collaborators');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(14) NOT NULL,
  `emp_id` varchar(64) NOT NULL,
  `atten_date` varchar(64) NOT NULL,
  `signin_time` time DEFAULT NULL,
  `signout_time` time DEFAULT NULL,
  `working_hour` varchar(64) DEFAULT NULL,
  `place_in` varchar(255) DEFAULT NULL,
  `place_out` varchar(255) NOT NULL,
  `absence` varchar(128) DEFAULT NULL,
  `overtime` varchar(128) DEFAULT NULL,
  `earnleave` varchar(128) DEFAULT NULL,
  `status` varchar(64) DEFAULT NULL,
  `signin_longlat` varchar(100) DEFAULT NULL,
  `signout_longlat` varchar(100) DEFAULT NULL,
  `att_type` varchar(20) DEFAULT NULL COMMENT 'Kategori Absen',
  `signin_pict` varchar(255) DEFAULT NULL,
  `signout_pict` varchar(255) DEFAULT NULL,
  `signin_note` varchar(50) DEFAULT NULL,
  `signout_note` varchar(50) DEFAULT NULL,
  `signin_addr` varchar(255) DEFAULT NULL,
  `signout_addr` varchar(255) DEFAULT NULL,
  `atttype` int(11) DEFAULT NULL COMMENT 'p_att_type'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `emp_id`, `atten_date`, `signin_time`, `signout_time`, `working_hour`, `place_in`, `place_out`, `absence`, `overtime`, `earnleave`, `status`, `signin_longlat`, `signout_longlat`, `att_type`, `signin_pict`, `signout_pict`, `signin_note`, `signout_note`, `signin_addr`, `signout_addr`, `atttype`) VALUES
(1, '1234', '2022-09-07', '07:28:47', '18:00:57', '', '', '', '', '', '', '', '-6.134612,106.7356375', '-6.1345864,106.7356968', '', '', '', 'test absen masuk tidak save gambar', 'keluar absen tidak save gambar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(2, '1234', '2022-09-07', '15:37:11', '15:37:58', '', '', '', '', '', '', '', '-6.1346214,106.7356331', '-6.1345616,106.7356317', '', '', '', 'absen masuk ke 2 tidak save gambar', 'absen keluar ke 2  tidak save gambar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(3, '1234', '2022-09-07', '15:43:43', '15:46:22', '', '', '', '', '', '', '', '-6.1346094,106.735655', '-6.1346146,106.7356329', '', 'UhASl7920221543.png', 'xtDVL7920221546.png', 'absen ke3 save gambar', 'absen keluar dengan save gambar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(4, '3519', '2022-09-07', '00:00:00', '15:26:19', '', '', '', '', '', '', '', '', '-6.1346259,106.7356469', '', '', 'ue0Gk7920221547.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(5, '99', '2022-09-07', '00:00:00', '15:47:21', '', '', '', '', '', '', '', '', '-6.1346163,106.7356451', '', '', 'iAKWv7920221547.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(6, '3519', '2022-09-07', '15:47:31', '15:47:54', '', '', '', '', '', '', '', '-6.1346221,106.7356422', '-6.1346403,106.7356568', '', '92VqT7920221547.png', 'US3OC7920221548.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(7, '99', '2022-09-07', '15:49:33', '00:00:00', '', '', '', '', '', '', '', '-6.1345612,106.7356412', '', '', '3IOs97920221549.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(8, '1234', '2022-09-07', '16:32:47', '16:34:06', '', '', '', '', '', '', '', '-6.1346577,106.7355966', '-6.1346612,106.7356019', '', '7guQH7920221633.png', 'HPoT87920221636.png', 'test absen masuk ke 3 dengan save gambar', 'absen keluar 2 dengan save gambar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(9, '3519', '2022-09-07', '16:33:15', '00:00:00', '', '', '', '', '', '', '', '-6.1346558,106.7356007', '', '', 'NY01A7920221633.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(10, '3519', '2022-09-08', '00:00:00', '09:53:42', '', '', '', '', '', '', '', '', '-6.1346015,106.7356521', '', '', 'blB8l892022953.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(11, '3519', '2022-09-08', '16:19:40', '16:20:38', '', '', '', '', '', '', '', '-6.134616,106.7356373', '-6.1346092,106.73564', '', '8irzN8920221619.png', 'sr5nJ8920221620.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(12, '3519', '2022-09-08', '16:29:02', '20:14:18', '', '', '', '', '', '', '', '-6.1346191,106.7356958', '-6.0934059,106.7509009', '', 'i8zyx8920221629.png', 'qfVqK8920222014.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'WQ42+P34 WQ42+P34, Kamal Muara, , , , ', 1),
(13, '1234', '2022-09-09', '18:06:54', '18:20:36', '', '', '', '', '', '', '', '-6.1346069,106.7356353', '-6.1345972,106.7356565', '', 'vrZh5992022187.png', 'Bq3PD9920221820.png', 'absen masuk', 'keluar aman', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(14, '3519', '2022-09-09', '18:58:23', '18:59:00', '', '', '', '', '', '', '', '-6.1214571,106.7007223', '-6.1214611,106.7007163', '', 'ZvQbs9920221858.png', 'C01go9920221859.png', '', '', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 1),
(15, '99', '2022-09-12', '00:00:00', '09:39:20', '', '', '', '', '', '', '', '', '-6.1346552,106.7355968', '', '', 'KTJTe1292022940.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(16, '99', '2022-09-12', '09:40:55', '00:00:00', '', '', '', '', '', '', '', '-6.134655,106.7355972', '', '', 'bmsrI1292022945.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(17, '3519', '2022-09-12', '09:39:08', '09:45:31', '', '', '', '', '', '', '', '-6.1346537,106.735601', '0.0,0.0', '', 'UozfX1292022945.png', '4t1MJ1292022945.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(20, '1234', '2022-09-12', '14:33:27', '14:35:34', '', '', 'Kantor', '', '', '', '', '-6.1346261,106.7356454', '-6.1345996,106.7356734', '', 'ZUZvJ12920221433.png', 'C7Fg512920221435.png', 'tes absen masuk pakai lokasi absen', 'tes asben keluar pakai lokasi absen', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(22, '1234', '2022-09-12', '15:34:40', '15:36:22', '', NULL, 'undefined', '', '', '', '', '-6.1346034,106.7356286', '0.0,0.0', '', 'RtpWJ12920221534.png', 'mofVw12920221536.png', 'telattt', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(23, '3519', '2022-09-13', '10:01:22', '15:09:54', '', NULL, 'undefined', '', '', '', '', '-6.134624,106.7356581', '-6.1346143,106.7356564', '', 'NXupC1392022101.png', '76a4A13920221510.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(25, '99', '2022-09-13', '18:24:32', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.1345774,106.7355907', '', '', 'F3PJY13920221824.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(26, '1234', '2022-09-14', '13:11:15', '13:12:04', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1345985,106.7356605', '-6.1346033,106.7356551', '', 'WjYrE14920221311.png', 'NRyGE14920221312.png', 'tes absen masuk cek radius', 'cek absen keluar cek radius', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(27, '1234', '2022-09-14', '18:13:45', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.1346045,106.7356456', '', '', 'qbYCk14920221814.png', '', 'jdjsjsjdjdjsjsjsjsjjsjsjsjsjjsjsjsjsjjs', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(28, '99', '2022-09-14', '18:14:33', '18:15:20', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1346149,106.7355571', '-6.1345487,106.7355634', '', 'RV9Ve14920221814.png', 'vhjdC14920221815.png', 'junet', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(30, '1234', '2022-09-15', '09:37:13', '10:18:50', '', 'WFH / Tugas luar kantor', 'Kantor', '', '', '', '', '-6.1346219,106.7356704', '-6.1345984,106.7356498', '', '17nK11592022942.png', '6xeRO15920221019.png', 'tes absen masuk wfh hari ini', 'tes kluar\n', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(31, '1234', '2022-09-15', '10:19:32', '16:59:30', '', 'Kantor', 'Tugas Luar', '', '', '', '', '-6.1345929,106.7356748', '-6.1346276,106.7356769', '', 'lpEUU15920221019.png', 'CsTdu15920221659.png', 'masuk siang', 'tes absen keluar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(32, '3519', '2022-09-15', '16:55:32', '19:03:48', '', 'Kantor', 'Tugas Luar', '', '', '', '', '-6.1346222,106.7356781', '-6.0896024,106.7406814', '', 'cQDvI15920221656.png', 'S8C7d1592022193.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Jl. Pulau Untung Jalan Pulau Untung, , , , , 14460', 1),
(33, '1234', '2022-09-15', '18:15:57', '00:00:00', '', 'WFH', '', '', '', '', '', '-6.1345817,106.7356704', '', '', 'BhIHf15920221816.png', '', 'tes absen masuk wfh', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(34, '99', '2022-09-15', '19:04:35', '00:00:00', '', 'WFH', '', '', '', '', '', '-6.1288906,106.7149434', '', '', 'a3jmH1592022194.png', '', '', '', 'Jl. Taman Palem Lestari No.6 6, Tegal Alur, Kecamatan Kalideres, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11840', '', 1),
(35, '3519', '2022-09-15', '19:08:39', '19:09:03', '', 'WFH', 'WFH', '', '', '', '', '-6.0897244,106.7407202', '-6.0896324,106.7406964', '', 'KxsHh1592022198.png', 'ZRqTr1592022199.png', '', '', 'Jl. Pulau Untung Jalan Pulau Untung, , , , , 14460', 'Jl. Pulau Untung Jalan Pulau Untung, , , , , 14460', 1),
(36, '1234', '2022-09-16', '09:00:14', '00:00:00', '', 'Tugas Luar', '', '', '', '', '', '-6.1346219,106.7356818', '', '', 'zfaHT169202290.png', '', 'tes absen masuk tugas luar', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(37, '1234', '2022-08-29', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, '1234', '2022-08-30', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, '1234', '2022-08-31', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, '1234', '2022-09-01', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, '1234', '2022-09-02', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, '1234', '2022-09-03', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, '1234', '2022-09-04', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, '1234', '2022-09-05', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, '1234', '2022-09-06', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, '1234', '2022-09-07', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, '1234', '2022-09-08', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, '1234', '2022-09-09', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, '1234', '2022-09-10', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, '1234', '2022-09-11', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, '1234', '2022-09-12', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, '1234', '2022-09-13', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, '1234', '2022-09-14', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, '1234', '2022-09-15', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, '1234', '2022-09-16', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, '1234', '2022-09-17', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, '1234', '2022-09-18', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, '1234', '2022-09-19', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, '1234', '2022-09-20', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, '1234', '2022-09-21', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, '1234', '2022-09-22', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, '1234', '2022-09-23', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, '1234', '2022-09-24', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, '1234', '2022-09-25', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, '1234', '2022-09-27', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, '1234', '2022-09-28', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, '1234', '2022-09-29', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, '1234', '2022-09-30', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, '1234', '2022-10-01', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, '1234', '2022-10-02', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, '1234', '2022-10-03', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, '1234', '2022-10-04', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, '1234', '2022-10-05', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, '1234', '2022-10-06', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(76, '1234', '2022-10-07', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, '1234', '2022-10-08', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, '1234', '2022-10-09', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, '1234', '2022-10-10', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, '1234', '2022-10-11', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, '1234', '2022-10-12', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, '1234', '2022-10-13', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, '1234', '2022-10-14', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, '1234', '2022-10-15', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, '1234', '2022-10-16', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, '1234', '2022-10-17', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, '1234', '2022-10-18', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, '1234', '2022-10-19', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, '1234', '2022-10-20', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, '1234', '2022-10-21', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, '1234', '2022-10-22', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, '1234', '2022-10-23', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, '1234', '2022-10-24', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, '1234', '2022-10-25', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, '1234', '2022-10-26', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(96, '1234', '2022-10-27', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(97, '1234', '2022-10-28', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(98, '1234', '2022-10-29', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(99, '1234', '2022-10-30', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(100, '1234', '2022-10-31', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, '1234', '2022-11-01', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(102, '1234', '2022-11-02', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, '1234', '2022-11-03', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, '1234', '2022-11-04', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(105, '1234', '2022-11-05', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, '1234', '2022-11-06', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, '1234', '2022-11-07', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(108, '1234', '2022-11-08', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(109, '1234', '2022-11-09', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(110, '1234', '2022-11-10', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(111, '1234', '2022-11-11', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(112, '1234', '2022-11-12', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, '1234', '2022-11-13', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, '1234', '2022-11-14', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, '1234', '2022-11-15', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, '1234', '2022-11-16', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, '1234', '2022-11-17', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, '1234', '2022-11-18', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, '1234', '2022-11-19', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, '1234', '2022-11-20', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, '1234', '2022-11-21', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, '1234', '2022-11-22', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, '1234', '2022-11-23', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, '1234', '2022-11-24', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, '1234', '2022-11-25', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, '1234', '2022-11-26', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, '1234', '2022-11-27', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, '1234', '2022-11-28', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, '1234', '2022-11-29', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, '1234', '2022-11-30', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, '1234', '2022-12-01', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, '1234', '2022-12-02', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, '1234', '2022-12-03', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, '1234', '2022-12-04', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, '1234', '2022-12-05', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, '1234', '2022-12-06', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, '1234', '2022-12-07', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, '1234', '2022-12-08', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, '1234', '2022-12-09', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, '1234', '2022-12-10', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, '1234', '2022-12-11', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, '1234', '2022-12-12', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, '1234', '2022-12-13', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, '1234', '2022-12-14', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, '1234', '2022-12-15', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, '1234', '2022-12-16', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, '1234', '2022-12-17', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, '1234', '2022-12-18', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, '1234', '2022-12-19', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, '1234', '2022-12-20', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, '1234', '2022-12-21', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, '1234', '2022-12-22', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, '1234', '2022-12-23', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, '1234', '2022-12-24', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, '1234', '2022-12-25', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, '1234', '2022-12-26', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, '1234', '2022-12-27', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, '1234', '2022-12-28', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, '1234', '2022-12-29', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, '1234', '2022-12-30', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, '1234', '2022-12-31', '09:00:00', '17:00:00', '480', NULL, '', NULL, NULL, NULL, 'E', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, '1234', '2022-09-16', '15:39:46', '15:40:58', '', 'Kantor', 'WFH', '', '', '', '', '-6.1346052,106.7356858', '-6.1346274,106.7356779', '', 'RPGWF16920221540.png', 'eaTBM16920221541.png', 'masukk', 'wfh keluar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(163, '1234', '2022-09-16', '15:44:39', '15:45:49', '', 'WFH', 'Kantor', '', '', '', '', '-6.1345846,106.7356972', '-6.13462,106.7356776', '', 'wpHG916920221545.png', '4tQ0616920221546.png', '', 'keluarrr', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(164, '1234', '2022-09-16', '00:00:00', '18:06:27', '', '', 'WFH', '', '', '', '', '', '-6.1345854,106.735691', '', '', '3074m1692022186.png', '', 'tesss absen keluar', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(165, '8820', '2022-09-16', '18:16:12', '18:17:13', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1346218,106.7356474', '-6.1346189,106.7356055', '', 'oTAs416920221816.png', 'itFUq16920221817.png', 'Test Absen', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(166, '3519', '2022-09-16', '18:46:20', '18:46:46', '', 'Kantor', 'Tugas Luar', '', '', '', '', '-6.1272028,106.7382876', '-6.1271692,106.7382174', '', 'ljyI316920221846.png', 'jmTOu16920221846.png', '', '', 'Jalan Kayu Besar Dalam No.215 RT.6/RW.11 Cengkareng Timur Kecamatan Cengkareng Kayu Besar Metro RT 06, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Jalan Kayu Besar Dalam No.215 RT.6/RW.11 Cengkareng Timur Kecamatan Cengkareng Kayu Besar Metro RT 06, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(167, '3519', '2022-09-16', '20:03:48', '00:00:00', '', 'WFH', '', '', '', '', '', '-6.0895069,106.7426144', '', '', 'BAX2Q1692022204.png', '', '', '', 'WP6R+7VC WP6R+7VC, , , , Daerah Khusus Ibukota Jakarta, 14460', '', 1),
(168, '3519', '2022-09-19', '09:05:16', '18:47:42', '', 'WFH', 'Tugas Luar', '', '', '', '', '-6.1214599,106.7007439', '-6.1214756,106.700744', '', 'TV6MY199202295.png', 'm1dWW19920221847.png', '', '', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 1),
(169, '99', '2022-09-19', '10:23:36', '10:25:22', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1346157,106.7356887', '-6.1345348,106.7354572', '', 'ZNG8519920221023.png', 'MZC7F19920221025.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Jl. Malibu Raya No.7 7, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(170, '99', '2022-09-19', '10:25:36', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.134552,106.735473', '', '', 'oeEhf19920221025.png', '', '', '', '7 7, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(171, '1234', '2022-09-19', '18:07:08', '18:08:13', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1346311,106.7356802', '-6.1346129,106.7356856', '', 'mfLyx1992022187.png', 'PUinZ1992022188.png', 'absen masuk test', 'test absen keluar', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(172, '3519', '2022-09-19', '20:05:10', '20:08:51', '', 'WFH', 'WFH', '', '', '', '', '-6.1214722,106.7007513', '-6.1214513,106.7007437', '', 'OrFJG1992022205.png', 'AMhJ61992022208.png', '', '', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 1),
(173, '3519', '2022-09-19', '20:10:48', '20:12:25', '', 'Tugas Luar', 'Tugas Luar', '', '', '', '', '-6.1214457,106.7007491', '-6.1214554,106.7007534', '', '3j41119920222011.png', 'DKpkH19920222012.png', '', '', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 'MONTGOMERY BLOK G3 Pegadungan, Pegadungan, Kalideres, West Jakarta City, Jakarta, 11830', 1),
(174, 'SIS202209187', '2022-09-20', '13:21:51', '18:22:17', '', 'WFH', 'WFH', '', '', '', '', '-6.1345873,106.7356223', '-6.1346504,106.7356231', '', 'R1Eca20920221322.png', 'OBm2g20920221822.png', 'tes absen masuk wfh ', 'test absen keluar wfh', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1),
(175, 'SIS202209187', '2022-09-21', '08:34:33', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.1346195,106.7357148', '', '', 'sf1KI2192022834.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(176, '3519', '2022-09-21', '17:07:30', '19:06:05', '', 'Kantor', 'Tugas Luar', '', '', '', '', '-6.134566,106.7356148', '-6.1154515,106.7922809', '', 'wPbQc2192022177.png', 'Sizqs2192022196.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Jl. Pluit Permai No.31 31, Pluit, Kecamatan Penjaringan, Kota Jakarta Utara, Daerah Khusus Ibukota Jakarta, 14450', 1),
(177, 'SIS202209187', '2022-09-23', '08:36:50', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.1345988,106.7356319', '', '', '0yQYe2392022837.png', '', 'absen masuk tanggal 23 september', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(178, '99', '2022-09-23', '18:46:14', '00:00:00', '', 'Kantor', '', '', '', '', '', '-6.1346656,106.7356536', '', '', 'xxl7m23920221846.png', '', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', '', 1),
(179, 'SIS202209187', '2022-09-26', '08:43:40', '18:00:34', '', 'Kantor', 'Kantor', '', '', '', '', '-6.1345982,106.7356877', '-6.1346223,106.7356421', '', 'X2Q632692022843.png', 'UHxmP2692022180.png', '', '', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 'Komplek City Resort Residence Rukan Malibu Blok J. 75-77 RT 07, Cengkareng Timur, Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11730', 1);

-- --------------------------------------------------------

--
-- Table structure for table `bank_info`
--

CREATE TABLE `bank_info` (
  `id` int(14) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `holder_name` varchar(256) DEFAULT NULL,
  `bank_name` varchar(256) DEFAULT NULL,
  `branch_name` varchar(256) DEFAULT NULL,
  `account_number` varchar(256) DEFAULT NULL,
  `account_type` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `banner_dashboard`
--

CREATE TABLE `banner_dashboard` (
  `id` int(11) NOT NULL,
  `gambar` varchar(50) NOT NULL,
  `status` int(11) NOT NULL COMMENT '0 = tidak aktif, 1 = aktif'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `banner_dashboard`
--

INSERT INTO `banner_dashboard` (`id`, `gambar`, `status`) VALUES
(1, 'bnr1.png', 1),
(2, 'bnr2.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `deduction`
--

CREATE TABLE `deduction` (
  `de_id` int(14) NOT NULL,
  `salary_id` int(14) NOT NULL,
  `provident_fund` varchar(64) DEFAULT NULL,
  `bima` varchar(64) DEFAULT NULL,
  `tax` varchar(64) DEFAULT NULL,
  `others` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `deduction`
--

INSERT INTO `deduction` (`de_id`, `salary_id`, `provident_fund`, `bima`, `tax`, `others`) VALUES
(11, 1, NULL, NULL, NULL, NULL),
(12, 2, NULL, NULL, NULL, NULL),
(13, 3, NULL, NULL, NULL, NULL),
(14, 4, NULL, NULL, NULL, NULL),
(15, 5, NULL, NULL, NULL, NULL),
(16, 6, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `dep_name` varchar(64) NOT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `dep_name`, `parent_id`) VALUES
(38, 'ACCOUNTING', NULL),
(39, 'SOFTWARE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `desciplinary`
--

CREATE TABLE `desciplinary` (
  `id` int(14) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `action` varchar(256) DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

CREATE TABLE `designation` (
  `id` int(11) NOT NULL,
  `des_name` varchar(64) NOT NULL,
  `grade` varchar(50) DEFAULT 'Staff' COMMENT 'Staff,Managerial,BOD'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `designation`
--

INSERT INTO `designation` (`id`, `des_name`, `grade`) VALUES
(32, 'Accounting Manager', 'Manager'),
(33, 'Acounting Staff', 'Staff'),
(34, 'Acounting SPV', 'Staff'),
(36, 'Acounting Intern', 'Intern'),
(37, 'MARKETING', 'Manager'),
(38, 'PRODUCT', 'Manager'),
(39, 'IT Support', 'Staff'),
(40, 'Trainer', 'Staff'),
(41, 'FINANCE', 'Manager'),
(42, 'CS', 'Staff'),
(43, 'QC', 'Staff'),
(44, 'Web Manger', 'Manager'),
(45, 'Hr Recruitment', 'Staff'),
(46, 'Product', 'Staff'),
(47, 'COO', 'BOD'),
(48, 'Marketing/Sales', 'Staff'),
(49, 'WEB', 'Staff'),
(50, 'UI/UX', 'Staff'),
(51, 'Office Girl', 'Staff'),
(52, 'Ofiice Boy', 'Staff'),
(53, 'Intern HR', 'Intern'),
(54, 'Network – Intern', 'Intern'),
(55, 'Project Manager', 'Manager'),
(56, 'Mobile Apps', 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `earned_leave`
--

CREATE TABLE `earned_leave` (
  `id` int(14) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `present_date` varchar(64) DEFAULT NULL,
  `hour` varchar(64) DEFAULT NULL,
  `status` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `earned_leave`
--

INSERT INTO `earned_leave` (`id`, `em_id`, `present_date`, `hour`, `status`) VALUES
(26, 'Mir1685', '0', '0', '1'),
(27, 'Rah1682', '0', '0', '1'),
(28, 'edr1432', '0', '0', '1'),
(29, 'Soy1332', '28', '224', '1'),
(30, 'Ram1186', '124', '992', '1');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `emp_id` varchar(128) DEFAULT NULL,
  `edu_type` varchar(256) DEFAULT NULL,
  `institute` varchar(256) DEFAULT NULL,
  `result` varchar(64) DEFAULT NULL,
  `year` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `emp_id`, `edu_type`, `institute`, `result`, `year`) VALUES
(1, 'Ram1186', 'Sarjana Komputer', 'STMIK MIKAR', '3.2', '2014');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `em_code` varchar(64) DEFAULT NULL,
  `des_id` int(11) DEFAULT NULL,
  `dep_id` int(11) DEFAULT NULL,
  `first_name` varchar(128) DEFAULT NULL,
  `last_name` varchar(128) DEFAULT NULL,
  `em_email` varchar(64) DEFAULT NULL,
  `em_password` varchar(512) NOT NULL,
  `em_role` enum('ADMIN','EMPLOYEE','SUPER ADMIN') NOT NULL DEFAULT 'EMPLOYEE',
  `em_address` varchar(512) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `em_gender` enum('PRIA','WANITA') NOT NULL DEFAULT 'PRIA',
  `em_phone` varchar(64) DEFAULT NULL,
  `em_birthday` varchar(128) DEFAULT NULL,
  `em_marital` enum('LAJANG','MENIKAH','DUDA','JANDA') DEFAULT NULL,
  `em_blood_group` enum('O+','O-','A+','A-','B+','B-','AB+','OB+') DEFAULT NULL,
  `em_joining_date` varchar(128) DEFAULT NULL,
  `em_contact_end` varchar(128) DEFAULT NULL,
  `em_image` varchar(128) DEFAULT NULL,
  `em_nid` varchar(64) DEFAULT NULL,
  `em_att_working` int(11) DEFAULT NULL COMMENT '0=Not Open,1=Open',
  `em_report_to` varchar(255) DEFAULT NULL,
  `em_status` enum('PERMANENT','CONTRACT','PROBATION','INTERNSHIP') DEFAULT 'CONTRACT' COMMENT 'Permanent,Kontrak,Probition,Magang',
  `em_branch` varchar(100) DEFAULT 'HEAD QUARTER',
  `em_hak_akses` varchar(50) NOT NULL COMMENT 'akses semua = 1, data diambil dari id tabel departement'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `em_id`, `em_code`, `des_id`, `dep_id`, `first_name`, `last_name`, `em_email`, `em_password`, `em_role`, `em_address`, `status`, `em_gender`, `em_phone`, `em_birthday`, `em_marital`, `em_blood_group`, `em_joining_date`, `em_contact_end`, `em_image`, `em_nid`, `em_att_working`, `em_report_to`, `em_status`, `em_branch`, `em_hak_akses`) VALUES
(10, 'Soy1332', '99', 12, 12, 'Wisnu', 'siscom', 'wisnu.siscom@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'ADMIN', NULL, 'ACTIVE', 'PRIA', '0811985219', '2002-09-01', 'MENIKAH', 'OB+', '2018-01-06', '2018-01-06', 'userav-min.png', '132154566556', 1, 'Har1369', '', 'HEAD QUARTER', ''),
(45, 'Ram1186', '1234', 55, 39, 'Budi', 'Ramadhanus', 'budi.rch@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'SUPER ADMIN', NULL, 'ACTIVE', 'PRIA', '081213711535', '1986-05-22', 'LAJANG', 'B+', '2022-08-29', '', '7wl5i23920221345.png', '1234', 0, 'Har1369', 'PERMANENT', 'HEAD QUARTER', '1'),
(46, 'sis1159', '8820', 14, 14, 'Ardhi Fadlika ', 'Satria', 'ardhie@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', '08111111111', '2022-09-01', 'LAJANG', 'O+', '2022-09-01', '', NULL, '1223456789456123', 0, 'Kar1627', '', 'HEAD QUARTER', ''),
(47, 'Har1369', '3519', 5, 5, 'Rudy', 'Haryanto', 'rudy@siscom.co.id', 'f5d4cb17ba5041b3b6aea245857aadff72a71acb', 'ADMIN', NULL, 'ACTIVE', 'PRIA', '0811803519', '1980-05-19', 'MENIKAH', 'A+', '2022-09-01', '', 'FT9b721920221526.png', '12345678901234567', NULL, NULL, '', 'HEAD QUARTER', '1'),
(48, 'Sis1477', '12345', 28, 8, 'Sisca', 'Siscom', 'sisca@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'WANITA', '0811803519', '2022-09-06', NULL, 'B-', '2022-09-07', '', NULL, '12345678901234567', NULL, '', '', 'HEAD QUARTER', ''),
(49, 'Kar1627', '54321', 26, 5, 'Iwan', 'Kartadinata', 'iwansetiadik@gmail.com', 'd431a1dc41e7f91bf50ae7464d9f679af01b8602', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', '09877755555', '2022-09-05', NULL, 'A-', '2022-09-01', '', NULL, '1234567890111111', NULL, NULL, '', 'HEAD QUARTER', ''),
(50, 'an1390', '8211444', 30, 5, 'Bohan', 'an', 'bohan@siscom.id', 'f90e26fe622adc407dc7310837ef49e848562c49', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', '0811111123', '1983-07-13', NULL, 'O-', '2022-01-01', '', NULL, '1223456789456123', NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(91, 'SIS20020804', 'SIS20020804', 32, 38, 'Yuni Kurniawaty', NULL, 'yuni_kurniawaty@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(92, 'SIS20031008', 'SIS20031008', 36, 38, 'Nurria Widowati', NULL, 'nurria_widowati@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(93, 'SIS20170621', 'SIS20170621', 34, 38, 'Susana', NULL, 'susana@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(94, 'SIS20180637', 'SIS20180637', 36, 38, 'Reni Yuniyanti', NULL, 'reni_yuniyanti@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(95, 'SIS202203170', 'SIS202203170', 36, 38, 'Filipus Gulo', NULL, 'filipus_gulo@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(96, 'SIS202204171', 'SIS202204171', 36, 38, 'Anggraini Lathifah', NULL, 'anggraini_lathifah@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(97, 'SIS20227179', 'SIS20227179', 32, 38, 'Nur Alifia', NULL, 'nur_alifia@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(98, 'SIS20227180', 'SIS20227180', 32, 38, 'Lia Mulyawan', NULL, 'lia_mulyawan@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(99, 'SIS20020905', 'SIS20020905', 37, 39, 'Suharwanto', NULL, 'suharwanto@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(100, 'SIS20030607', 'SIS20030607', 38, 39, 'Wisnu', NULL, 'wisnu@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(101, 'SIS20070109', 'SIS20070109', 36, 39, 'Lutfi Rushendrawan', NULL, 'lutfi_rushendrawan@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(102, 'SIS20100210', 'SIS20100210', 36, 39, 'Bohan Setiawan', NULL, 'bohan_setiawan@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(103, 'SIS20121111', 'SIS20121111', 43, 39, 'Kukuh Tri Widodo', NULL, 'kukuh_tri_widodo@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(104, 'SIS20131012', 'SIS20131012', 36, 39, 'Theresia Erna Novitasari', NULL, 'theresia_erna_novitasari@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(105, 'SIS20150813', 'SIS20150813', 36, 39, 'Supandi', NULL, 'supandi@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(106, 'SIS20160115', 'SIS20160115', 37, 39, 'Amelia', NULL, 'amelia@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(107, 'SIS20160416', 'SIS20160416', 36, 39, 'Oktaviyani', NULL, 'oktaviyani@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(108, 'SIS20160517', 'SIS20160517', 43, 39, 'Iik Zulkarnaen', NULL, 'iik_zulkarnaen@siscom.co.id', 'f1dee8965a73993313d3f67a4dc7d6e6d1f9803e', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(109, 'SIS20180533', 'SIS20180533', 44, 39, 'Iwan Setiadi K', NULL, 'iwan_setiadi_k@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(110, 'SIS20190283', 'SIS20190283', 36, 39, 'Andiani Dini Putri', NULL, 'andiani_dini_putri@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(111, 'SIS20190384', 'SIS20190384', 36, 39, 'Dipo Giarri Nugroho', NULL, 'dipo_giarri_nugroho@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(112, 'SIS201911110', 'SIS201911110', 38, 39, 'Junita Panjaitan', NULL, 'junita_panjaitan@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(113, 'SIS20208130', 'SIS20208130', 36, 39, 'Mukti Munasir', NULL, 'mukti_munasir@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(114, 'SIS202010135', 'SIS202010135', 36, 39, 'Christanto Chandra', NULL, 'christanto_chandra@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(115, 'SIS202011139', 'SIS202011139', 37, 39, 'Benedict', NULL, 'benedict@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(116, 'SIS202104149', 'SIS202104149', 37, 39, 'Gregorius Andrean', NULL, 'gregorius_andrean@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(117, 'SIS20216152', 'SIS20216152', 43, 39, 'Alvin Rachman S', NULL, 'alvin_rachman_s@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(118, 'SISI202110156', 'SISI202110156', 38, 39, 'Abdul Malik', NULL, 'abdul_malik@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(119, 'SIS202112159', 'SIS202112159', 43, 39, 'Ardhi Fadlika S', NULL, 'ardhi_fadlika_s@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(120, 'SIS20221161', 'SIS20221161', 38, 39, 'Andriana Dirgantara', NULL, 'andriana_dirgantara@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(121, 'SIS20221164', 'SIS20221164', 38, 39, 'Yusuf Ardilla', NULL, 'yusuf_ardilla@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(122, 'SIS20221163', 'SIS20221163', 43, 39, 'Ibnu Maulana', NULL, 'ibnu_maulana@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(123, 'SIS202203165', 'SIS202203165', 37, 39, 'Bella Anastasia', NULL, 'bella_anastasia@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(124, 'SIS202203169', 'SIS202203169', 36, 39, 'Claudia Rehct', NULL, 'claudia_rehct@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(125, 'SIS202206176', 'SIS202206176', 37, 39, 'Wahyudin', NULL, 'wahyudin@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(126, 'SIS202207183', 'SIS202207183', 36, 39, 'Annisa Sasqia', NULL, 'annisa_sasqia@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(127, 'SIS202208184', 'SIS202208184', 37, 39, 'Adi Setiawan', NULL, 'adi_setiawan@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(128, 'SIS202208185', 'SIS202208185', 42, 39, 'Budi Ramadhanus', NULL, 'budi_ramadhanus@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(129, 'SIS202209186', 'SIS202209186', 36, 39, 'Ninda Evani', NULL, 'ninda_evani@siscom.co.id', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, NULL, NULL, NULL, NULL, NULL, 'userav-min.png', NULL, NULL, NULL, 'CONTRACT', 'HEAD QUARTER', ''),
(130, 'SIS202209187', 'SIS202209187', 37, 39, 'Bayu', 'Hardiansyah', 'bayu_hardiansyah@siscom.co.id', 'dd5b0d2ab4d8547050f28d0f89db5c3e02b26b6f', 'EMPLOYEE', NULL, 'ACTIVE', 'PRIA', NULL, '1998-07-25', 'MENIKAH', 'O-', '2022-09-01', NULL, 'YNGiZ2692022207.png', NULL, NULL, 'SIS20180533', 'CONTRACT', 'HEAD QUARTER', '1');

-- --------------------------------------------------------

--
-- Table structure for table `employee_file`
--

CREATE TABLE `employee_file` (
  `id` int(14) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `file_title` varchar(512) DEFAULT NULL,
  `file_url` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `emp_assets`
--

CREATE TABLE `emp_assets` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `assets_id` int(11) NOT NULL,
  `given_date` date NOT NULL,
  `return_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `emp_component_sallary`
--

CREATE TABLE `emp_component_sallary` (
  `idxComp` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `comp_id` int(11) DEFAULT NULL,
  `comp_value_pct` float DEFAULT NULL,
  `comp_value_absolute` float DEFAULT NULL,
  `comp_cycle` varchar(20) DEFAULT NULL COMMENT 'per hari , per bulan',
  `comp_sign` varchar(1) DEFAULT NULL COMMENT '+ / -',
  `rBPJS_id` int(11) DEFAULT NULL COMMENT 'reffer to p_ratateBPJS',
  `input_by_id` int(11) DEFAULT NULL,
  `input_by_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emp_experience`
--

CREATE TABLE `emp_experience` (
  `id` int(14) NOT NULL,
  `emp_id` varchar(256) DEFAULT NULL,
  `exp_company` varchar(128) DEFAULT NULL,
  `exp_com_position` varchar(128) DEFAULT NULL,
  `exp_com_address` varchar(128) DEFAULT NULL,
  `exp_workduration` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `emp_experience`
--

INSERT INTO `emp_experience` (`id`, `emp_id`, `exp_company`, `exp_com_position`, `exp_com_address`, `exp_workduration`) VALUES
(1, 'Ram1186', 'SISCOM', 'Product', 'Cengkareng', '2010-2022');

-- --------------------------------------------------------

--
-- Table structure for table `emp_labor`
--

CREATE TABLE `emp_labor` (
  `id` int(11) NOT NULL,
  `emp_id` varchar(50) DEFAULT NULL,
  `dari_jam` time DEFAULT NULL,
  `sampai_jam` time DEFAULT NULL,
  `atten_date` varchar(68) DEFAULT NULL,
  `status` enum('Pending','Approve','Rejected') DEFAULT NULL,
  `approve_date` varchar(68) DEFAULT NULL,
  `approve_by` varchar(100) NOT NULL,
  `alasan_reject` varchar(255) NOT NULL,
  `em_delegation` varchar(100) NOT NULL,
  `uraian` varchar(300) NOT NULL,
  `ajuan` int(11) NOT NULL COMMENT '1 = lembur , 2 = tugas luar'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `emp_labor`
--

INSERT INTO `emp_labor` (`id`, `emp_id`, `dari_jam`, `sampai_jam`, `atten_date`, `status`, `approve_date`, `approve_by`, `alasan_reject`, `em_delegation`, `uraian`, `ajuan`) VALUES
(1, 'Ram1186', '18:00:00', '20:00:00', '2022-09-12', 'Approve', '2022-09-23', 'Rudy Haryanto', '', 'SIS20180533', 'test lembur', 1),
(2, 'Ram1186', '18:00:00', '20:00:00', '2022-09-16', 'Approve', '2022-09-23', 'Rudy Haryanto', '', 'SIS20180533', 'testing pengajuan lembur', 1),
(3, 'Ram1186', '20:33:00', '20:48:00', '2022-09-21', 'Approve', '2022-09-26', 'Rudy Haryanto', '', '1234', 'tes lemburr mlm', 1),
(4, 'Har1369', '18:30:00', '21:30:00', '2022-09-19', 'Pending', '', '', '', '', 'pengerjaan modul master', 1),
(11, 'SIS202209187', '19:00:00', '22:00:00', '2022-09-20', 'Rejected', '2022-09-26', 'Iwan Setiadi K ', 'untuk so yang di buat sudah selesai semua', 'SIS20180533', 'fixing mobile, banyak kesalahan', 1),
(12, 'SIS202209187', '19:00:00', '21:00:00', '2022-09-22', 'Pending', '', '', '', '1234', 'test lembur ada masalah', 1),
(14, 'SIS202209187', '08:00:00', '18:00:00', '2022-09-30', 'Rejected', '2022-09-22', 'Iwan Setiadi K ', '', 'SIS20180533', 'tugas luar presentasi di pt abc', 2),
(15, 'SIS202209187', '08:00:00', '19:00:00', '2022-09-23', 'Approve', '2022-09-22', 'Iwan Setiadi K ', '', 'SIS20180533', 'kunjungan ke bekasi ', 2),
(16, 'SIS202209187', '19:00:00', '22:00:00', '2022-09-23', 'Approve', '2022-09-23', 'Iwan Setiadi K ', '', 'SIS20030607', 'fixing mobile', 1);

-- --------------------------------------------------------

--
-- Table structure for table `emp_leave`
--

CREATE TABLE `emp_leave` (
  `id` int(11) NOT NULL,
  `em_id` varchar(64) DEFAULT NULL,
  `typeid` int(14) NOT NULL,
  `leave_type` varchar(64) DEFAULT NULL,
  `start_date` varchar(64) DEFAULT NULL,
  `end_date` varchar(64) DEFAULT NULL,
  `leave_duration` varchar(128) DEFAULT NULL,
  `apply_date` varchar(64) DEFAULT NULL,
  `apply_by` varchar(100) NOT NULL,
  `alasan_reject` varchar(255) NOT NULL,
  `reason` varchar(1024) DEFAULT NULL,
  `leave_status` enum('Approve','Rejected','Pending') NOT NULL DEFAULT 'Pending',
  `atten_date` varchar(64) NOT NULL,
  `em_delegation` varchar(100) DEFAULT NULL COMMENT 'em_code = tbl employee',
  `leave_files` varchar(255) DEFAULT NULL,
  `ajuan` int(11) NOT NULL COMMENT '1= izin / tidak hadir, 2 = cuti'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `emp_leave`
--

INSERT INTO `emp_leave` (`id`, `em_id`, `typeid`, `leave_type`, `start_date`, `end_date`, `leave_duration`, `apply_date`, `apply_by`, `alasan_reject`, `reason`, `leave_status`, `atten_date`, `em_delegation`, `leave_files`, `ajuan`) VALUES
(1, 'Ram1186', 12, 'Full Day', '2022-09-07', '2022-09-09', '8', '2022-09-07', '', '', 'Keperluan Keluarga', 'Approve', '2022-09-05', NULL, NULL, 1),
(3, 'Ram1186', 12, 'Full Day', '2022-09-21', '2022-09-21', '1', '2022-09-23', 'Rudy Haryanto', '', 'test edit pengajuan form tidak hadir dan input log aktifitas', 'Approve', '2022-09-21', '1234', '', 1),
(4, 'Ram1186', 12, 'Full Day', '2022-09-14', '2022-09-14', '1', '2022-09-26', 'Rudy Haryanto', '', 'test upload file', 'Approve', '2022-09-14', 'SIS20180533', 'YearbookUMB-2022.pdf', 1),
(5, 'null', 11, 'Full Day', '2022-09-14', '2022-09-14', '1', '', '', '', 'snsnnsns', 'Pending', '2022-09-14', '99', '', 1),
(8, 'Ram1186', 10, 'Full Day', '2022-09-14', '', '8', '2022-09-16', '', '', 'perlu ke bank', 'Approve', '', NULL, NULL, 2),
(9, 'Har1369', 10, 'Full Day', '2022-09-20', '2022-09-22', '8', '2022-09-16', '', '', 'conference meeting in US', '', '', NULL, NULL, 2),
(10, 'Ram1186', 10, 'Full Day', '2022-09-16', '2022-09-19', '4', '2022-09-23', 'Rudy Haryanto', '', 'test pengajuan cuti tahunan ', 'Approve', '2022-09-16', '99', 'IMG-20220914-WA0004.jpg', 2),
(11, 'Ram1186', 10, 'More than One day', '2022-09-12', '2022-09-16', '32', '2022-09-16', '', '', 'test 3 hari', '', '', NULL, NULL, 2),
(13, 'Ram1186', 10, 'Full Day', '2022-09-19', '2022-09-19', '1', '2022-09-23', 'Rudy Haryanto', '', 'test cuti ', 'Rejected', '2022-09-19', '99', '', 2),
(15, 'Har1369', 10, 'Full Day', '2022-09-19', '2022-09-19', '1', '', '', '', 'Pulang kampung', 'Pending', '2022-09-23', '3519', '', 2),
(17, 'SIS202209187', 12, 'Full Day', '2022-09-28', '2022-09-30', '3', '', '', '', 'izin karena pergih ke rumah sakit solooo', 'Pending', '2022-09-26', '1234', '', 1),
(20, 'SIS202209187', 11, 'Full Day', '2022-09-20', '2022-09-20', '1', '', '', '', 'izin sakit test form tidak hadir edit methods', 'Pending', '2022-09-20', 'SIS20180533', '', 1),
(21, 'SIS202209187', 11, 'Full Day', '2022-09-26', '2022-09-28', '3', '', '', '', 'izin tidak enk badannnn', 'Pending', '2022-09-26', '1234', '', 1),
(25, 'SIS202209187', 10, 'Full Day', '2022-10-01', '2022-10-03', '3', '2022-09-22', 'Iwan Setiadi K', '', 'keadaan mendesak', 'Approve', '2022-09-21', 'SIS20180533', '', 2),
(26, 'Ram1186', 10, 'Full Day', '2022-09-01', '2022-09-21', '21', '2022-09-23', 'Rudy Haryanto', '', 'pulang kampung ', 'Rejected', '2022-09-21', '1234', '', 2),
(27, 'Ram1186', 12, 'Full Day', '2022-09-24', '2022-09-21', '-2', '2022-09-26', 'Rudy Haryanto', 'banyak kerjaan', 'ghgd', 'Rejected', '2022-09-21', '1234', '', 1),
(28, 'Ram1186', 12, 'Full Day', '2022-09-01', '2022-09-21', '21', '', '', '', 'hhhhhhj bbbbbbgffdshdhjcjbnghhjbg', 'Pending', '2022-09-21', '1234', '', 1),
(29, 'Har1369', 12, 'Full Day', '2022-09-23', '2022-09-24', '2', '', '', '', 'urusan keluarga', 'Pending', '2022-09-21', '54321', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `emp_penalty`
--

CREATE TABLE `emp_penalty` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `penalty_id` int(11) NOT NULL,
  `penalty_desc` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `emp_salary`
--

CREATE TABLE `emp_salary` (
  `id` int(11) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `type_id` int(11) NOT NULL,
  `total` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `emp_salary`
--

INSERT INTO `emp_salary` (`id`, `emp_id`, `type_id`, `total`) VALUES
(1, 'Ram1186', 2, '5000000'),
(2, 'Soy1332', 2, '10000000'),
(3, 'sis1159', 2, '3000000'),
(4, 'Sis1477', 2, '2500000'),
(5, 'Kar1627', 2, '15000000'),
(6, 'Har1369', 2, '50000000');

-- --------------------------------------------------------

--
-- Table structure for table `emp_training`
--

CREATE TABLE `emp_training` (
  `id` int(11) NOT NULL,
  `trainig_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `idx` int(11) NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `answered` varchar(255) DEFAULT NULL,
  `faqDate` datetime DEFAULT NULL,
  `submitedByID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `faq`
--

INSERT INTO `faq` (`idx`, `question`, `answered`, `faqDate`, `submitedByID`) VALUES
(1, 'Lorem ipsum dolor sit amet 1', 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', '2022-09-15 00:00:00', NULL),
(2, 'Lorem ipsum dolor sit amet 2', 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', '2022-09-15 00:00:00', NULL),
(3, 'Lorem ipsum dolor sit amet 3', 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', '2022-09-15 00:00:00', NULL),
(4, 'Lorem ipsum dolor sit amet 4', 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', '2022-09-15 00:00:00', NULL),
(5, 'Lorem ipsum dolor sit amet 5', 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.', '2022-09-15 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `field_visit`
--

CREATE TABLE `field_visit` (
  `id` int(14) NOT NULL,
  `project_id` varchar(256) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `field_location` varchar(512) NOT NULL,
  `start_date` varchar(64) DEFAULT NULL,
  `approx_end_date` varchar(28) NOT NULL,
  `total_days` varchar(64) DEFAULT NULL,
  `notes` varchar(500) NOT NULL,
  `actual_return_date` varchar(28) NOT NULL,
  `status` enum('Approved','Not Approve','Rejected') NOT NULL DEFAULT 'Not Approve',
  `attendance_updated` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE `holiday` (
  `id` int(11) NOT NULL,
  `holiday_name` varchar(256) DEFAULT NULL,
  `from_date` varchar(64) DEFAULT NULL,
  `to_date` varchar(64) DEFAULT NULL,
  `number_of_days` varchar(64) DEFAULT NULL,
  `year` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`id`, `holiday_name`, `from_date`, `to_date`, `number_of_days`, `year`) VALUES
(9, 'Libur Natal 2022', '2022-09-26', '2022-09-27', '1', '09-2022');

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `type_id` int(14) NOT NULL,
  `name` varchar(64) NOT NULL,
  `leave_day` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1= Cuti  , 2 = tidak hadir'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`type_id`, `name`, `leave_day`, `status`) VALUES
(10, 'Cuti Tahunan', '12', 1),
(11, 'Sakit', '', 2),
(12, 'Izin', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `loan`
--

CREATE TABLE `loan` (
  `id` int(14) NOT NULL,
  `emp_id` varchar(256) DEFAULT NULL,
  `amount` varchar(256) DEFAULT NULL,
  `interest_percentage` varchar(256) DEFAULT NULL,
  `total_amount` varchar(64) DEFAULT NULL,
  `total_pay` varchar(64) DEFAULT NULL,
  `total_due` varchar(64) DEFAULT NULL,
  `installment` varchar(256) DEFAULT NULL,
  `loan_number` varchar(256) DEFAULT NULL,
  `loan_details` varchar(256) DEFAULT NULL,
  `approve_date` varchar(256) DEFAULT NULL,
  `install_period` varchar(256) DEFAULT NULL,
  `status` enum('Granted','Deny','Pause','Done') NOT NULL DEFAULT 'Pause'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `loan_installment`
--

CREATE TABLE `loan_installment` (
  `id` int(14) NOT NULL,
  `loan_id` int(14) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `loan_number` varchar(256) DEFAULT NULL,
  `install_amount` varchar(256) DEFAULT NULL,
  `pay_amount` varchar(64) DEFAULT NULL,
  `app_date` varchar(256) DEFAULT NULL,
  `receiver` varchar(256) DEFAULT NULL,
  `install_no` varchar(256) DEFAULT NULL,
  `notes` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `logistic_asset`
--

CREATE TABLE `logistic_asset` (
  `log_id` int(14) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `qty` varchar(64) DEFAULT NULL,
  `entry_date` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `logistic_assign`
--

CREATE TABLE `logistic_assign` (
  `ass_id` int(14) NOT NULL,
  `asset_id` int(14) NOT NULL,
  `assign_id` varchar(64) DEFAULT NULL,
  `project_id` int(14) NOT NULL,
  `task_id` int(14) NOT NULL,
  `log_qty` varchar(64) DEFAULT NULL,
  `start_date` varchar(64) DEFAULT NULL,
  `end_date` varchar(64) DEFAULT NULL,
  `back_date` varchar(64) DEFAULT NULL,
  `back_qty` varchar(64) DEFAULT NULL,
  `remarks` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `logs_actvity`
--

CREATE TABLE `logs_actvity` (
  `idx` int(11) NOT NULL,
  `menu_name` varchar(50) DEFAULT NULL,
  `activity_name` varchar(255) DEFAULT NULL,
  `acttivity_script` varchar(255) DEFAULT NULL,
  `createdUserID` varchar(50) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `logs_actvity`
--

INSERT INTO `logs_actvity` (`idx`, `menu_name`, `activity_name`, `acttivity_script`, `createdUserID`, `createdDate`) VALUES
(1, 'emp_leave', 'Delete emp_leave', 'DELETE FROM emp_leave WHERE id=\'6\'', '1234', '2022-09-19 17:12:51'),
(2, 'emp_leave', 'Delete emp_leave', 'DELETE FROM emp_leave WHERE id=\'2\'', '1234', '2022-09-19 17:14:14'),
(3, 'Tidak Hadir', 'Membatalkan form pengajuan Tidak Hadir. Tanggal pengajuan = 19-09-2022 sd 19-09-2022 Alasan Pengajua', 'UPDATE emp_leave SET ? WHERE id = \'3\'', '1234', '2022-09-19 17:46:42'),
(4, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'i64Va20920221129.png\' WHERE em_code=\'1234\'', '1234', '2022-09-20 11:29:23'),
(5, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'hddaO20920221155.png\' WHERE em_code=\'1234\'', '1234', '2022-09-20 11:55:02'),
(6, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'FXBdx2092022121.png\' WHERE em_code=\'1234\'', '1234', '2022-09-20 12:01:18'),
(7, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'tHioo20920221317.png\' WHERE em_code=\'SIS202209187\'', 'SIS202209187', '2022-09-20 13:17:57'),
(8, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = izin karena pergih ke rumah sakit', 'INSERT INTO emp_leave SET ?', 'SIS202209187', '2022-09-20 13:51:16'),
(9, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 20-09-2022 sd 20-09-2022 Alasan Pengajuan = izin karena pergih ke rumah sakit solo', 'UPDATE emp_leave SET ? WHERE id = \'17\'', 'SIS202209187', '2022-09-20 14:00:50'),
(10, 'Tidak Hadir', 'Membatalkan form pengajuan Tidak Hadir. Tanggal pengajuan = 2022-09-20 sd 2022-09-20 Alasan Pengajuan = tidak enak badan', 'DELETE FROM emp_leave WHERE id=\'16\'', 'SIS202209187', '2022-09-20 14:03:22'),
(11, 'Lembur', 'Membuat Pengajuan Lembur. alasan = lembur mengerjakan HRIS mobile', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 14:26:22'),
(12, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_labor SET ? WHERE id = \'7\'', 'SIS202209187', '2022-09-20 14:49:15'),
(13, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'ZD0Ll20920221451.png\' WHERE em_code=\'SIS202209187\'', 'SIS202209187', '2022-09-20 14:51:10'),
(15, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = tes input pengajuan tidak hadir dengan dokument', 'INSERT INTO emp_leave SET ?', NULL, '2022-09-20 14:59:47'),
(16, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = izin sakit test form tidak hadir', 'INSERT INTO emp_leave SET ?', 'SIS202209187', '2022-09-20 15:04:24'),
(17, 'Tidak Hadir', 'Membatalkan form pengajuan Tidak Hadir. Tanggal pengajuan = 2022-09-20 sd 2022-09-20 Alasan Pengajuan = tes input pengajuan tidak hadir dengan dokument', 'DELETE FROM emp_leave WHERE id=\'19\'', 'SIS202209187', '2022-09-20 15:05:08'),
(18, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 20-09-2022 sd 20-09-2022 Alasan Pengajuan = izin sakit test form tidak hadir edit methods', 'UPDATE emp_leave SET ? WHERE id = \'20\'', 'SIS202209187', '2022-09-20 15:05:49'),
(19, 'Lembur', 'Membuat Pengajuan Lembur. alasan = insert form lembur testing 2', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 15:06:54'),
(20, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-20', 'UPDATE emp_labor SET ? WHERE id = \'8\'', 'SIS202209187', '2022-09-20 15:07:36'),
(21, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-22', 'UPDATE emp_labor SET ? WHERE id = \'8\'', 'SIS202209187', '2022-09-20 15:15:53'),
(22, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:30:00 sd 20:30:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-21', 'DELETE FROM emp_leave WHERE id=\'7\'', 'SIS202209187', '2022-09-20 15:16:02'),
(23, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:30:00 sd 20:30:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-21', 'DELETE FROM emp_labor WHERE id=\'7\'', 'SIS202209187', '2022-09-20 15:17:48'),
(24, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:00:00 sd 21:00:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-22', 'DELETE FROM emp_labor WHERE id=\'8\'', 'SIS202209187', '2022-09-20 16:10:39'),
(25, 'Lembur', 'Membuat Pengajuan Lembur. alasan = bug fixing mobile', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 16:15:52'),
(26, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:00:00 sd 21:00:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-20', 'DELETE FROM emp_labor WHERE id=\'9\'', 'SIS202209187', '2022-09-20 17:10:20'),
(27, 'Lembur', 'Membuat Pengajuan Lembur. alasan = fixing mobile ', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 17:11:09'),
(28, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:00:00 sd 20:00:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-20', 'DELETE FROM emp_labor WHERE id=\'10\'', 'SIS202209187', '2022-09-20 17:33:32'),
(29, 'Lembur', 'Membuat Pengajuan Lembur. alasan = fixing mobile', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 17:34:58'),
(30, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = izin tidak enk badan', 'INSERT INTO emp_leave SET ?', 'SIS202209187', '2022-09-20 17:35:58'),
(31, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-20', 'UPDATE emp_labor SET ? WHERE id = \'11\'', 'SIS202209187', '2022-09-20 18:05:22'),
(32, 'Lembur', 'Membuat Pengajuan Lembur. alasan = test lembur', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-20 18:07:05'),
(33, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-20', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-20 18:07:49'),
(34, NULL, NULL, 'INSERT INTO emp_leave SET ?', NULL, '2022-09-20 18:09:47'),
(35, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-22', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-20 18:12:22'),
(36, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'SznhL20920221823.png\' WHERE em_code=\'SIS202209187\'', 'SIS202209187', '2022-09-20 18:23:00'),
(37, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-21 08:43:54'),
(38, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-22', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-21 08:44:17'),
(39, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-22', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-21 09:01:10'),
(40, NULL, NULL, 'INSERT INTO emp_leave SET ?', NULL, '2022-09-21 09:13:55'),
(41, NULL, NULL, 'INSERT INTO emp_leave SET ?', NULL, '2022-09-21 09:17:28'),
(42, 'Cuti', 'Edit Pengajuan Cuti. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_leave SET ? WHERE id = \'24\'', 'SIS202209187', '2022-09-21 09:31:02'),
(43, 'Cuti', 'Membatalkan form pengajuan Cuti. Tanggal = 2022-09-20 sd Tanggal = 2022-09-20 Durasi Cuti = 1 Alasan = test cuti', 'DELETE FROM emp_leave WHERE id=\'22\'', 'SIS202209187', '2022-09-21 09:47:52'),
(44, 'Cuti', 'Membatalkan form pengajuan Cuti. Tanggal = 2022-09-22 sd Tanggal = 2022-09-24 Durasi Cuti = 3 Alasan = test cuti tahunann', 'DELETE FROM emp_leave WHERE id=\'23\'', 'SIS202209187', '2022-09-21 09:49:00'),
(45, 'Cuti', 'Membuat Pengajuan Cuti. alasan = ada event luar kota', 'INSERT INTO emp_leave SET ?', 'SIS202209187', '2022-09-21 09:51:58'),
(46, 'Cuti', 'Edit Pengajuan Cuti. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_leave SET ? WHERE id = \'25\'', 'SIS202209187', '2022-09-21 09:52:35'),
(47, 'Cuti', 'Membatalkan form pengajuan Cuti. Tanggal = 2022-09-25 sd Tanggal = 2022-09-30 Durasi Cuti = 6 Alasan = Keluar kota, ada acaraaaa', 'DELETE FROM emp_leave WHERE id=\'24\'', 'SIS202209187', '2022-09-21 09:52:50'),
(48, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 18:30:00 sd 21:30:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-19', 'DELETE FROM emp_labor WHERE id=\'5\'', '3519', '2022-09-21 10:28:43'),
(49, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'jnAFL21920221516.png\' WHERE em_code=\'1234\'', '1234', '2022-09-21 15:16:48'),
(50, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'FT9b721920221526.png\' WHERE em_code=\'3519\'', '3519', '2022-09-21 15:26:34'),
(51, NULL, NULL, 'INSERT INTO emp_leave SET ?', NULL, '2022-09-21 16:54:01'),
(52, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_labor SET ? WHERE id = \'3\'', '1234', '2022-09-21 16:56:59'),
(53, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-21', 'UPDATE emp_labor SET ? WHERE id = \'3\'', '1234', '2022-09-21 16:57:19'),
(54, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 21-09-2022 sd 21-09-2022 Alasan Pengajuan = test edit pengajuan form tidak hadir dan input log aktifitas', 'UPDATE emp_leave SET ? WHERE id = \'3\'', '1234', '2022-09-21 16:59:04'),
(55, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = ghgd', 'INSERT INTO emp_leave SET ?', '1234', '2022-09-21 17:00:28'),
(56, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = hhh', 'INSERT INTO emp_leave SET ?', '1234', '2022-09-21 17:00:38'),
(57, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 21-09-2022 sd 21-09-2022 Alasan Pengajuan = hhh', 'UPDATE emp_leave SET ? WHERE id = \'28\'', '1234', '2022-09-21 17:00:48'),
(58, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 21-09-2022 sd 21-09-2022 Alasan Pengajuan = hhh', 'UPDATE emp_leave SET ? WHERE id = \'28\'', '1234', '2022-09-21 17:00:57'),
(59, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 01-09-2022 sd 21-09-2022 Alasan Pengajuan = hhhhhhj bbbbbbgffdshdhjcjbnghhjbg', 'UPDATE emp_leave SET ? WHERE id = \'28\'', '1234', '2022-09-21 17:01:18'),
(60, 'Tugas Luar', 'Membuat Pengajuan Tugas Luar. alasan = Event di daerah jakarta pusat', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-21 17:22:09'),
(61, 'Tugas Luar', 'Edit Pengajuan Tugas Luar. Tanggal Pengajuan = 2022-09-23', 'UPDATE emp_labor SET ? WHERE id = \'13\'', 'SIS202209187', '2022-09-21 17:27:44'),
(62, 'Tugas Luar', 'Membuat Pengajuan Tugas Luar. alasan = tugas luar presentasi di pt abc', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-21 17:29:39'),
(63, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 08:00:00 sd 18:00:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-23', 'DELETE FROM emp_labor WHERE id=\'13\'', 'SIS202209187', '2022-09-21 17:29:47'),
(64, 'Tugas Luar', 'Membuat Pengajuan Tugas Luar. alasan = kunjungan ke bekasi ', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-21 17:31:28'),
(65, 'Tidak Hadir', 'Membatalkan form pengajuan Tidak Hadir. Tanggal pengajuan = 2022-09-20 sd 2022-09-20 Alasan Pengajuan = check up', 'DELETE FROM emp_leave WHERE id=\'14\'', '3519', '2022-09-21 20:28:07'),
(66, 'Tidak Hadir', 'Membatalkan form pengajuan Tidak Hadir. Tanggal pengajuan = 2022-09-19 sd 2022-09-19 Alasan Pengajuan = Pulabg kampung', 'DELETE FROM emp_leave WHERE id=\'12\'', '3519', '2022-09-21 20:28:20'),
(67, 'Tidak Hadir', 'Membuat Pengajuan tidak hadir. alasan = urusan keluarga', 'INSERT INTO emp_leave SET ?', '3519', '2022-09-21 20:29:04'),
(68, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'MtxI42292022035.png\' WHERE em_code=\'SIS202209187\'', 'SIS202209187', '2022-09-22 00:35:51'),
(69, 'Lembur', 'Membatalkan form pengajuan Lembur. Waktu Lembur = 19:00:00 sd 21:00:00 Alasan Pengajuan = null Tanggal Pengajuan = 2022-09-19', 'DELETE FROM emp_labor WHERE id=\'6\'', '99', '2022-09-22 12:01:45'),
(70, 'Cuti', 'Approve Pengajuan Cuti pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_leave SET ? WHERE id = \'25\'', 'SIS20180533', '2022-09-22 15:28:34'),
(71, 'Cuti', 'Approve Pengajuan Cuti pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_leave SET ? WHERE id = \'25\'', 'SIS20180533', '2022-09-22 15:37:51'),
(72, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 15:37:51'),
(73, 'Cuti', 'Approve Pengajuan Cuti pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_leave SET ? WHERE id = \'25\'', 'SIS20180533', '2022-09-22 15:44:47'),
(74, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 15:44:47'),
(75, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'11\'', 'SIS20180533', '2022-09-22 16:03:50'),
(76, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'11\'', 'SIS20180533', '2022-09-22 16:06:47'),
(77, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'11\'', 'SIS20180533', '2022-09-22 16:11:08'),
(78, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 16:11:08'),
(79, 'Izin', 'Approve Pengajuan Izin pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_leave SET ? WHERE id = \'17\'', 'SIS20180533', '2022-09-22 16:19:44'),
(80, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 16:19:44'),
(81, 'Tugas Luar', 'Rejected Pengajuan Tugas Luar pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'14\'', 'SIS20180533', '2022-09-22 16:35:19'),
(82, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 16:35:20'),
(83, 'Tugas Luar', 'Approve Pengajuan Tugas Luar pada tanggal 2022-09-22. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'15\'', 'SIS20180533', '2022-09-22 16:54:28'),
(84, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-22 16:54:28'),
(85, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'2\'', NULL, '2022-09-23 09:19:38'),
(86, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'3\'', NULL, '2022-09-23 09:21:20'),
(87, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'4\'', NULL, '2022-09-23 09:21:20'),
(88, 'Lembur', 'Membuat Pengajuan Lembur. alasan = fixing mobile', 'INSERT INTO emp_labor SET ?', 'SIS202209187', '2022-09-23 10:31:31'),
(89, 'Lembur', 'Rejected Pengajuan Lembur pada tanggal 2022-09-23. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS20180533', '2022-09-23 10:32:48'),
(90, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 10:32:48'),
(91, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-23. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'16\'', 'SIS20180533', '2022-09-23 10:32:54'),
(92, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 10:32:54'),
(93, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'7\'', NULL, '2022-09-23 13:08:37'),
(94, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'1\'', NULL, '2022-09-23 13:08:55'),
(95, 'Sakit', 'Rejected Pengajuan Sakit pada tanggal 2022-09-23. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_leave SET ? WHERE id = \'20\'', 'SIS20180533', '2022-09-23 13:41:11'),
(96, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 13:41:14'),
(97, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'7wl5i23920221345.png\' WHERE em_code=\'1234\'', '1234', '2022-09-23 13:45:19'),
(98, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'7\'', NULL, '2022-09-23 16:42:22'),
(99, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'2\'', NULL, '2022-09-23 16:44:05'),
(100, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'9\'', NULL, '2022-09-23 16:44:35'),
(101, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'5\'', NULL, '2022-09-23 16:45:31'),
(102, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'8\'', NULL, '2022-09-23 16:45:59'),
(103, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'3\'', NULL, '2022-09-23 16:46:03'),
(104, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'4\'', NULL, '2022-09-23 16:46:04'),
(105, 'Cuti', 'Approve Pengajuan Cuti pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'10\'', '3519', '2022-09-23 19:20:34'),
(106, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 19:20:34'),
(107, 'Cuti', 'Rejected Pengajuan Cuti pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'13\'', '3519', '2022-09-23 19:20:41'),
(108, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 19:20:41'),
(109, 'Cuti', 'Rejected Pengajuan Cuti pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'26\'', '3519', '2022-09-23 19:20:49'),
(110, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 19:20:49'),
(111, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_labor SET ? WHERE id = \'1\'', '3519', '2022-09-23 19:21:02'),
(112, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 19:21:03'),
(113, 'Izin', 'Approve Pengajuan Izin pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'3\'', '3519', '2022-09-23 19:21:43'),
(114, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 19:21:43'),
(115, 'Cuti', 'Edit Pengajuan Cuti. Tanggal Pengajuan = 2022-09-23', 'UPDATE emp_leave SET ? WHERE id = \'15\'', '3519', '2022-09-23 20:41:47'),
(116, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-23. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_labor SET ? WHERE id = \'2\'', '3519', '2022-09-23 20:42:48'),
(117, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-23 20:42:48'),
(118, NULL, NULL, 'UPDATE notifikasi SET ? WHERE id = \'2\'', NULL, '2022-09-26 10:45:29'),
(119, 'Lembur', 'Approve Pengajuan Lembur pada tanggal 2022-09-26. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_labor SET ? WHERE id = \'3\'', '3519', '2022-09-26 11:31:33'),
(120, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-26 11:31:33'),
(121, 'Lembur', 'Rejected Pengajuan Lembur pada tanggal 2022-09-26. Pengajuan atas nama Bayu Hardiansyah', 'UPDATE emp_labor SET ? WHERE id = \'11\'', 'SIS20180533', '2022-09-26 13:54:23'),
(122, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-26 13:54:23'),
(123, 'Lembur', 'Edit Pengajuan Lembur. Tanggal Pengajuan = 2022-09-22', 'UPDATE emp_labor SET ? WHERE id = \'12\'', 'SIS202209187', '2022-09-26 17:52:09'),
(124, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 26-09-2022 sd 28-09-2022 Alasan Pengajuan = izin tidak enk badannnn', 'UPDATE emp_leave SET ? WHERE id = \'21\'', 'SIS202209187', '2022-09-26 17:53:59'),
(125, 'Tidak Hadir', 'Edit form pengajuan Tidak Hadir. Tanggal pengajuan = 28-09-2022 sd 30-09-2022 Alasan Pengajuan = izin karena pergih ke rumah sakit solooo', 'UPDATE emp_leave SET ? WHERE id = \'17\'', 'SIS202209187', '2022-09-26 17:54:25'),
(126, 'Izin', 'Approve Pengajuan Izin pada tanggal 2022-09-26. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'4\'', '3519', '2022-09-26 18:17:43'),
(127, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-26 18:17:43'),
(128, 'Izin', 'Rejected Pengajuan Izin pada tanggal 2022-09-26. Pengajuan atas nama Budi Ramadhanus', 'UPDATE emp_leave SET ? WHERE id = \'27\'', '3519', '2022-09-26 20:05:07'),
(129, NULL, NULL, 'INSERT INTO notifikasi SET ?', NULL, '2022-09-26 20:05:07'),
(130, 'Setting Profile', 'Mengganti foto profile', 'UPDATE employee SET em_image=\'YNGiZ2692022207.png\' WHERE em_code=\'SIS202209187\'', 'SIS202209187', '2022-09-26 20:07:56');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `id_modul` int(11) NOT NULL,
  `nama_menu` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `gambar` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id_menu`, `id_modul`, `nama_menu`, `url`, `gambar`) VALUES
(1, 1, 'Riwayat Absen', 'HistoryAbsen', 'watch.png'),
(3, 2, 'Pengajuan Cuti', 'FormPengajuanCuti', 'pengajuan_cuti.png'),
(4, 3, 'Riwayat Klaim', '', 'limit_claim.png'),
(5, 3, 'Pengajuan Klaim', '', 'task.png'),
(7, 4, 'Buat Tugas', '', 'buat_tugas.png'),
(8, 4, 'Monitor Tugas', '', 'task.png'),
(9, 4, 'Timeline', '', 'timeline.png'),
(13, 1, 'Lembur', 'Lembur', 'clock.png'),
(14, 1, 'Tidak Hadir', 'TidakMasukKerja', 'tidak_masuk.png'),
(15, 2, 'Riwayat Cuti', 'RiwayatCuti', '

_cuti.png'),
(16, 5, 'Slip Gaji', '', 'slip_gaji.png'),
(17, 5, 'PPH21', '', 'pph.png'),
(18, 5, 'BPJS Tenaga Kerja', '', 'bpjstng.png'),
(19, 5, 'BPJS Kesehatan', '', 'bpjsksh.png'),
(20, 1, 'Tugas Luar', 'TugasLuar', 'tugas_luar.png');

-- --------------------------------------------------------

--
-- Table structure for table `menu-web`
--

CREATE TABLE `menu-web` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `parent_id` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) NOT NULL DEFAULT '',
  `position` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `group_id` tinyint(3) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `menu-web`
--

INSERT INTO `menu-web` (`id`, `parent_id`, `title`, `url`, `position`, `group_id`) VALUES
(1, 0, 'Home', '/', 1, 1),
(2, 0, 'About', 'controller/about', 2, 1),
(3, 0, 'Dropdown', 'dropdown/index', 3, 1),
(4, 3, 'Dropdown 1', 'dropdown/Dropdown1', 1, 1),
(5, 3, 'Dropdown 2', 'dropdown/Dropdown2', 2, 1),
(6, 0, 'Contact Us', 'controller/contact-us', 4, 1),
(7, 3, 'Dropdown 3', 'dropdown/Dropdown3', 3, 1),
(8, 7, 'Dropdown Submenu 1', 'dropdown/submenu-1', 1, 1),
(9, 7, 'Dropdown Submenu 2', 'dropdown/submenu-2', 2, 1),
(10, 3, 'Dropdown 4', 'dropdown/Dropdown-4', 4, 1),
(11, 0, 'Test', 'AddDepartemen', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_config`
--

CREATE TABLE `menu_config` (
  `idx` int(11) NOT NULL,
  `modul_name` varchar(100) DEFAULT NULL,
  `menu_name` varchar(100) DEFAULT NULL,
  `menu_icon` varchar(100) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `isActive` int(11) DEFAULT '0' COMMENT '0=NonActive,1=Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `menu_dashboard`
--

CREATE TABLE `menu_dashboard` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `gambar` varchar(50) NOT NULL,
  `status` int(11) NOT NULL COMMENT '0 = aktifitas, 1 = payroll'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menu_dashboard`
--

INSERT INTO `menu_dashboard` (`id`, `nama`, `url`, `gambar`, `status`) VALUES
(1, 'Absensi', 'HistoryAbsen', 'watch.png', 0),
(2, 'Lembur', 'Lembur', 'clock.png', 0),
(3, 'Cuti', 'RiwayatCuti', 'riwayat_cuti.png', 0),
(4, 'Tugas Luar', 'TugasLuar', 'tugas_luar.png', 0),
(5, 'Tidak Hadir', 'TidakMasukKerja', 'tidak_masuk.png', 0),
(6, 'Klaim', '', 'limit_claim.png', 0),
(7, 'Tugas', '', 'task.png', 0),
(8, 'Lebih Detail', 'lainnya', 'lainnya.png', 0),
(9, 'Slip Gaji', '', 'slip_gaji.png', 1),
(10, 'PPH21', '', 'pph.png', 1),
(11, 'BPJS Tenaga Kerja', '', 'bpjstng.png', 1),
(12, 'BPJS Kesehatan', '', 'bpjsksh.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_group`
--

CREATE TABLE `menu_group` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `menu_group`
--

INSERT INTO `menu_group` (`id`, `title`) VALUES
(1, 'Main Menu'),
(2, 'Master');

-- --------------------------------------------------------

--
-- Table structure for table `menu_web`
--

CREATE TABLE `menu_web` (
  `id_menu` int(11) UNSIGNED ZEROFILL NOT NULL,
  `id_modul` int(11) NOT NULL,
  `nama_menu` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `gambar` varchar(20) NOT NULL,
  `id_menu_parent` int(11) DEFAULT '0',
  `seq_value` int(11) DEFAULT NULL,
  `url_mobile` varchar(100) DEFAULT NULL,
  `gambar_mobile` varchar(50) DEFAULT NULL,
  `isMobile` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menu_web`
--

INSERT INTO `menu_web` (`id_menu`, `id_modul`, `nama_menu`, `url`, `gambar`, `id_menu_parent`, `seq_value`, `url_mobile`, `gambar_mobile`, `isMobile`) VALUES
(00000000001, 1, 'Master', '', '', 0, 1, NULL, NULL, 0),
(00000000002, 2, 'Transaksi', '', '', 0, 2, NULL, NULL, 0),
(00000000003, 3, 'Payroll', '', '', 0, 3, NULL, NULL, 0),
(00000000004, 4, 'Laporan', '', '', 0, 4, NULL, NULL, 0),
(00000000005, 5, 'Pengaturan', '', '', 0, 5, NULL, NULL, 0),
(00000000006, 1, 'Departemen', '', '', 1, 1, NULL, NULL, 0),
(00000000007, 1, 'Jabatan', '', '', 1, 2, NULL, NULL, 0),
(00000000008, 1, 'Rate BPJS', '', '', 1, 3, NULL, NULL, 0),
(00000000009, 1, 'Rate Lembur', '', '', 1, 4, NULL, NULL, 0),
(00000000010, 2, 'Absensi', '', '', 2, 1, NULL, NULL, 1),
(00000000011, 1, 'Karyawan', '', '', 1, 5, NULL, NULL, 0),
(00000000012, 2, 'Cuti', '', '', 2, 2, NULL, NULL, 1),
(00000000013, 2, 'Tidak Hadir', '', '', 2, 3, NULL, NULL, 1),
(00000000014, 2, 'Tugas Luar', '', '', 2, 4, NULL, NULL, 1),
(00000000015, 2, 'Lembur', '', '', 2, 5, NULL, NULL, 1),
(00000000016, 3, 'Generate Payroll', '', '', 3, 1, NULL, NULL, 0),
(00000000017, 3, 'Slip Gaji', '', '', 3, 2, NULL, NULL, 1),
(00000000018, 3, 'BPJS Kesehatan', '', '', 3, 3, NULL, NULL, 1),
(00000000019, 3, 'BPJS Ketenagakerjaan', '', '', 3, 4, NULL, NULL, 1),
(00000000020, 3, 'PPH 21', '', '', 3, 5, NULL, NULL, 1),
(00000000021, 4, 'Laporan Absen', '', '', 4, 1, NULL, NULL, 0),
(00000000022, 4, 'Laporan Cuti', '', '', 4, 2, NULL, NULL, 0),
(00000000023, 5, 'Perusahaan', '', '', 5, 1, NULL, NULL, 0),
(00000000024, 1, 'Tipe Cuti', '', '', 1, 6, NULL, NULL, 0),
(00000000025, 1, 'Hari Libur', '', '', 1, 7, NULL, NULL, 0),
(00000000026, 1, 'Lokasi Absensi', '', '', 1, 8, NULL, NULL, 0),
(00000000027, 1, 'Komponen Gaji', '', '', 1, 9, NULL, NULL, 0),
(00000000028, 2, 'Potongan', '', '', 2, 6, NULL, NULL, 0),
(00000000029, 2, 'Klaim', '', '', 2, 7, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `modul`
--

CREATE TABLE `modul` (
  `id_modul` int(11) NOT NULL,
  `nama_modul` varchar(50) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `modul`
--

INSERT INTO `modul` (`id_modul`, `nama_modul`, `status`) VALUES
(1, 'Absensi', 1),
(2, 'Cuti', 1),
(3, 'Claim', 1),
(4, 'Tugas', 1),
(5, 'Payroll', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE `notice` (
  `id` int(11) NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `desc` varchar(255) NOT NULL,
  `file_url` varchar(256) DEFAULT NULL,
  `date` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`id`, `title`, `desc`, `file_url`, `date`) VALUES
(1, 'Family Gathering with all employee.', 'Ciwidey Bandung, 1 Desember 2022', 'sample_image.jpg', '2022-01-01'),
(2, 'Karyawan Baru', 'Jono | marketing', 'sample_image.jpg', '2022-01-01'),
(3, 'Karyawan Baru', 'Tono | marketing', 'sample_image.jpg', '2022-01-01'),
(4, 'Karyawan Baru', 'Sarah | marketing', 'sample_image.jpg', '2022-01-01'),
(5, 'Karyawan Baru', 'Maumunah | marketing', 'sample_image.jpg', '2022-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `notifikasi`
--

CREATE TABLE `notifikasi` (
  `id` int(11) NOT NULL,
  `em_id` varchar(64) NOT NULL,
  `title` varchar(100) NOT NULL,
  `deskripsi` varchar(225) NOT NULL,
  `url` varchar(50) NOT NULL,
  `atten_date` varchar(64) NOT NULL,
  `jam` varchar(50) NOT NULL,
  `status` int(11) NOT NULL COMMENT '0 = reject, 1 = approve',
  `view` int(11) NOT NULL COMMENT '0 = belum di lihat 1 = dilihat'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifikasi`
--

INSERT INTO `notifikasi` (`id`, `em_id`, `title`, `deskripsi`, `url`, `atten_date`, `jam`, `status`, `view`) VALUES
(1, 'SIS202209187', 'Pengajuan Cuti telah di Approve', 'Pengajuan Cuti kamu telah di Approve oleh Iwan Setiadi K ', 'RiwayatCuti', '2022-09-21', '15:37:50', 1, 0),
(2, 'SIS202209187', 'Pengajuan Cuti telah di Approve', 'Pengajuan Cuti kamu telah di Approve oleh Iwan Setiadi K ', 'RiwayatCuti', '2022-09-22', '15:44:45', 1, 1),
(3, 'SIS202209187', 'Pengajuan Lembur telah di Approve', 'Pengajuan Lembur kamu telah di Approve oleh Iwan Setiadi K ', 'Lembur', '2022-09-22', '16:11:07', 1, 0),
(4, 'SIS202209187', 'Pengajuan Izin telah di Approve', 'Pengajuan Izin kamu telah di Approve oleh Iwan Setiadi K ', 'TidakMasukKerja', '2022-09-22', '16:19:43', 1, 0),
(5, 'SIS202209187', 'Pengajuan Tugas Luar telah di Rejected', 'Pengajuan Tugas Luar kamu telah di Rejected oleh Iwan Setiadi K ', 'TugasLuar', '2022-09-22', '16:35:18', 0, 0),
(6, 'SIS202209187', 'Pengajuan Tugas Luar telah di Approve', 'Pengajuan Tugas Luar kamu telah di Approve oleh Iwan Setiadi K ', 'TugasLuar', '2022-09-22', '16:54:27', 1, 0),
(7, 'SIS202209187', 'Pengajuan Lembur telah di Rejected', 'Pengajuan Lembur kamu telah di Rejected oleh Iwan Setiadi K ', 'Lembur', '2022-09-23', '10:32:47', 0, 1),
(8, 'SIS202209187', 'Pengajuan Lembur telah di Approve', 'Pengajuan Lembur kamu telah di Approve oleh Iwan Setiadi K ', 'Lembur', '2022-09-23', '10:32:53', 1, 1),
(9, 'SIS202209187', 'Pengajuan Sakit telah di Rejected', 'Pengajuan Sakit kamu telah di Rejected oleh Iwan Setiadi K ', 'TidakMasukKerja', '2022-09-23', '13:41:10', 0, 1),
(10, 'Ram1186', 'Pengajuan Cuti telah di Approve', 'Pengajuan Cuti kamu telah di Approve oleh Rudy Haryanto', 'RiwayatCuti', '2022-09-23', '19:20:31', 1, 0),
(11, 'Ram1186', 'Pengajuan Cuti telah di Rejected', 'Pengajuan Cuti kamu telah di Rejected oleh Rudy Haryanto', 'RiwayatCuti', '2022-09-23', '19:20:37', 0, 0),
(12, 'Ram1186', 'Pengajuan Cuti telah di Rejected', 'Pengajuan Cuti kamu telah di Rejected oleh Rudy Haryanto', 'RiwayatCuti', '2022-09-23', '19:20:45', 0, 0),
(13, 'Ram1186', 'Pengajuan Lembur telah di Approve', 'Pengajuan Lembur kamu telah di Approve oleh Rudy Haryanto', 'Lembur', '2022-09-23', '19:20:59', 1, 0),
(14, 'Ram1186', 'Pengajuan Izin telah di Approve', 'Pengajuan Izin kamu telah di Approve oleh Rudy Haryanto', 'TidakMasukKerja', '2022-09-23', '19:21:40', 1, 0),
(15, 'Ram1186', 'Pengajuan Lembur telah di Approve', 'Pengajuan Lembur kamu telah di Approve oleh Rudy Haryanto', 'Lembur', '2022-09-23', '20:42:45', 1, 0),
(16, 'Ram1186', 'Pengajuan Lembur telah di Approve', 'Pengajuan Lembur kamu telah di Approve oleh Rudy Haryanto', 'Lembur', '2022-09-26', '11:31:35', 1, 0),
(17, 'SIS202209187', 'Pengajuan Lembur telah di Rejected', 'Pengajuan Lembur kamu telah di Rejected oleh Iwan Setiadi K ', 'Lembur', '2022-09-26', '13:54:24', 0, 0),
(18, 'Ram1186', 'Pengajuan Izin telah di Approve', 'Pengajuan Izin kamu telah di Approve oleh Rudy Haryanto', 'TidakMasukKerja', '2022-09-26', '18:17:44', 1, 0),
(19, 'Ram1186', 'Pengajuan Izin telah di Rejected', 'Pengajuan Izin kamu telah di Rejected oleh Rudy Haryanto', 'TidakMasukKerja', '2022-09-26', '20:05:08', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `owner`
--

CREATE TABLE `owner` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(64) NOT NULL,
  `owner_position` varchar(64) DEFAULT NULL,
  `note` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pay_salary`
--

CREATE TABLE `pay_salary` (
  `pay_id` int(14) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `type_id` int(14) NOT NULL,
  `month` varchar(64) DEFAULT NULL,
  `year` varchar(64) DEFAULT NULL,
  `paid_date` varchar(64) DEFAULT NULL,
  `total_days` varchar(64) DEFAULT NULL,
  `basic` varchar(64) DEFAULT NULL,
  `medical` varchar(64) DEFAULT NULL,
  `house_rent` varchar(64) DEFAULT NULL,
  `bonus` varchar(64) DEFAULT NULL,
  `bima` varchar(64) DEFAULT NULL,
  `tax` varchar(64) DEFAULT NULL,
  `provident_fund` varchar(64) DEFAULT NULL,
  `loan` varchar(64) DEFAULT NULL,
  `total_pay` varchar(128) DEFAULT NULL,
  `addition` int(128) NOT NULL,
  `diduction` int(128) NOT NULL,
  `status` enum('Paid','Process') DEFAULT 'Process',
  `paid_type` enum('Hand Cash','Bank') NOT NULL DEFAULT 'Bank'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pay_salary`
--

INSERT INTO `pay_salary` (`pay_id`, `emp_id`, `type_id`, `month`, `year`, `paid_date`, `total_days`, `basic`, `medical`, `house_rent`, `bonus`, `bima`, `tax`, `provident_fund`, `loan`, `total_pay`, `addition`, `diduction`, `status`, `paid_type`) VALUES
(1, 'Ram1186', 0, 'September', '2022', '2022-09-30', '40.1', '5000000', NULL, NULL, NULL, NULL, NULL, NULL, '0', '1044270.83', 0, 3955729, 'Process', 'Bank'),
(2, 'Har1369', 0, 'September', '2022', '2022-09-30', '67.8', '50000000', NULL, NULL, NULL, NULL, NULL, NULL, '0', '17656250', 0, 32343750, 'Paid', 'Bank');

-- --------------------------------------------------------

--
-- Table structure for table `penalty`
--

CREATE TABLE `penalty` (
  `id` int(11) NOT NULL,
  `penalty_name` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `places_coordinate`
--

CREATE TABLE `places_coordinate` (
  `idx` int(11) NOT NULL,
  `place` varchar(100) DEFAULT NULL,
  `place_longlat` varchar(100) DEFAULT NULL,
  `place_radius` int(11) DEFAULT NULL COMMENT 'meter',
  `createdDate` datetime DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `isActive` int(11) DEFAULT '0' COMMENT '0=Active,1=Non Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `places_coordinate`
--

INSERT INTO `places_coordinate` (`idx`, `place`, `place_longlat`, `place_radius`, `createdDate`, `createdById`, `isActive`) VALUES
(1, 'Kantor', '-6.1347812,106.7360118', 1000, '2022-09-12 00:00:00', NULL, 0),
(3, 'WFH', '', 0, '2022-09-12 00:00:00', NULL, 0),
(4, 'Tugas Luar', '', 0, '2022-09-12 00:00:00', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(14) NOT NULL,
  `pro_name` varchar(128) DEFAULT NULL,
  `pro_start_date` varchar(128) DEFAULT NULL,
  `pro_end_date` varchar(128) DEFAULT NULL,
  `pro_description` varchar(1024) DEFAULT NULL,
  `pro_summary` varchar(512) DEFAULT NULL,
  `pro_status` enum('upcoming','complete','running') NOT NULL DEFAULT 'running',
  `progress` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project_file`
--

CREATE TABLE `project_file` (
  `id` int(14) NOT NULL,
  `pro_id` int(14) NOT NULL,
  `file_details` varchar(1028) DEFAULT NULL,
  `file_url` varchar(256) DEFAULT NULL,
  `assigned_to` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pro_expenses`
--

CREATE TABLE `pro_expenses` (
  `id` int(14) NOT NULL,
  `pro_id` int(14) NOT NULL,
  `assign_to` varchar(64) DEFAULT NULL,
  `details` varchar(512) DEFAULT NULL,
  `amount` varchar(256) DEFAULT NULL,
  `date` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pro_notes`
--

CREATE TABLE `pro_notes` (
  `id` int(14) NOT NULL,
  `assign_to` varchar(64) DEFAULT NULL,
  `pro_id` int(14) NOT NULL,
  `details` varchar(1024) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pro_task`
--

CREATE TABLE `pro_task` (
  `id` int(14) NOT NULL,
  `pro_id` int(14) NOT NULL,
  `task_title` varchar(256) DEFAULT NULL,
  `start_date` varchar(128) DEFAULT NULL,
  `end_date` varchar(128) DEFAULT NULL,
  `image` varchar(128) DEFAULT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `task_type` enum('Office','Field') NOT NULL DEFAULT 'Office',
  `status` enum('running','complete','cancel') DEFAULT 'running',
  `location` varchar(512) DEFAULT NULL,
  `return_date` varchar(128) DEFAULT NULL,
  `total_days` varchar(128) DEFAULT NULL,
  `create_date` varchar(128) DEFAULT NULL,
  `approve_status` enum('Approved','Not Approve','Rejected') NOT NULL DEFAULT 'Not Approve'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pro_task`
--

INSERT INTO `pro_task` (`id`, `pro_id`, `task_title`, `start_date`, `end_date`, `image`, `description`, `task_type`, `status`, `location`, `return_date`, `total_days`, `create_date`, `approve_status`) VALUES
(1, 1, 'Demo Task Title for Testing', '2022-01-03', '2022-01-31', NULL, 'This is demo details for testing. This is demo details for testing', 'Office', 'running', NULL, NULL, NULL, '2022-01-03', '');

-- --------------------------------------------------------

--
-- Table structure for table `pro_task_assets`
--

CREATE TABLE `pro_task_assets` (
  `id` int(11) NOT NULL,
  `pro_task_id` int(11) NOT NULL,
  `assign_id` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `p_component`
--

CREATE TABLE `p_component` (
  `comp_id` int(11) NOT NULL,
  `comp_name` varchar(50) NOT NULL,
  `acno` varchar(20) DEFAULT NULL COMMENT 'Refference to Acccountiing Modul',
  `grade_id` int(11) DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `slipOn` int(11) NOT NULL DEFAULT '0' COMMENT '0=disable,1=enable'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `p_ratebpjs`
--

CREATE TABLE `p_ratebpjs` (
  `rBPJS_id` int(11) NOT NULL,
  `rBPJS_name` varchar(100) DEFAULT NULL,
  `percent` float NOT NULL,
  `input_by_id` int(11) DEFAULT NULL,
  `input_by_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_ratebpjs`
--

INSERT INTO `p_ratebpjs` (`rBPJS_id`, `rBPJS_name`, `percent`, `input_by_id`, `input_by_datetime`) VALUES
(1, 'test', 0, NULL, NULL),
(2, '% BPJS Kesehatan ditanggung Pemberi Kerja', 0, NULL, NULL),
(3, 'test', 2, NULL, NULL),
(4, 'TES', 1234.6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `p_rateot`
--

CREATE TABLE `p_rateot` (
  `rot_id` int(11) NOT NULL,
  `rateType` int(11) NOT NULL COMMENT 'flat , percentage',
  `hours_s` int(11) NOT NULL,
  `hours_e` int(11) NOT NULL,
  `percent_rate` float NOT NULL,
  `absolute_rate` decimal(10,0) NOT NULL,
  `dayType` int(11) NOT NULL DEFAULT '0' COMMENT '0=Weekday, 1=weekend'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `salary_type`
--

CREATE TABLE `salary_type` (
  `id` int(14) NOT NULL,
  `salary_type` varchar(256) DEFAULT NULL,
  `create_date` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `salary_type`
--

INSERT INTO `salary_type` (`id`, `salary_type`, `create_date`) VALUES
(1, 'Mingguan', '2022-09-01'),
(2, 'Bulanan', '2022-09-01');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `sitelogo` varchar(128) DEFAULT NULL,
  `sitetitle` varchar(256) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `copyright` varchar(128) DEFAULT NULL,
  `contact` varchar(128) DEFAULT NULL,
  `currency` varchar(128) DEFAULT NULL,
  `symbol` varchar(64) DEFAULT NULL,
  `system_email` varchar(128) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `address2` varchar(256) NOT NULL,
  `longlat_comp` varchar(255) DEFAULT NULL,
  `radius` int(11) DEFAULT NULL COMMENT 'meters',
  `saveimage_attend` varchar(10) NOT NULL COMMENT 'YES , NO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `sitelogo`, `sitetitle`, `description`, `copyright`, `contact`, `currency`, `symbol`, `system_email`, `address`, `address2`, `longlat_comp`, `radius`, `saveimage_attend`) VALUES
(1, 'logo.jpg', 'H R I S Siscom', 'Lorem ipsum anum Lorem ipsum anum', 'Anonymouse', '021212111', 'ID', 'Rp', 'contact@siscom.co.id', ' City Resort Rukan Malibu Blok J No. 75-77', 'Cengkareng', '-6.1346052,106.733453', 1000, 'YES');

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` int(14) NOT NULL,
  `emp_id` varchar(64) DEFAULT NULL,
  `facebook` varchar(256) DEFAULT NULL,
  `twitter` varchar(256) DEFAULT NULL,
  `google_plus` varchar(512) DEFAULT NULL,
  `skype_id` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `to-do_list`
--

CREATE TABLE `to-do_list` (
  `id` int(14) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `to_dodata` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `date` varchar(128) DEFAULT NULL,
  `value` varchar(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addition`
--
ALTER TABLE `addition`
  ADD PRIMARY KEY (`addi_id`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`ass_id`);

--
-- Indexes for table `assets_category`
--
ALTER TABLE `assets_category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `assign_leave`
--
ALTER TABLE `assign_leave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assign_task`
--
ALTER TABLE `assign_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_info`
--
ALTER TABLE `bank_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banner_dashboard`
--
ALTER TABLE `banner_dashboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deduction`
--
ALTER TABLE `deduction`
  ADD PRIMARY KEY (`de_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `desciplinary`
--
ALTER TABLE `desciplinary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designation`
--
ALTER TABLE `designation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `earned_leave`
--
ALTER TABLE `earned_leave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `em_code` (`em_code`);

--
-- Indexes for table `employee_file`
--
ALTER TABLE `employee_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_assets`
--
ALTER TABLE `emp_assets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_component_sallary`
--
ALTER TABLE `emp_component_sallary`
  ADD PRIMARY KEY (`idxComp`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `benefit_id` (`comp_id`),
  ADD KEY `rBPJS_id` (`rBPJS_id`);

--
-- Indexes for table `emp_experience`
--
ALTER TABLE `emp_experience`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_labor`
--
ALTER TABLE `emp_labor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_leave`
--
ALTER TABLE `emp_leave`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_penalty`
--
ALTER TABLE `emp_penalty`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emp_salary`
--
ALTER TABLE `emp_salary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `field_visit`
--
ALTER TABLE `field_visit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `holiday`
--
ALTER TABLE `holiday`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `loan`
--
ALTER TABLE `loan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loan_installment`
--
ALTER TABLE `loan_installment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logistic_asset`
--
ALTER TABLE `logistic_asset`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `logistic_assign`
--
ALTER TABLE `logistic_assign`
  ADD PRIMARY KEY (`ass_id`);

--
-- Indexes for table `logs_actvity`
--
ALTER TABLE `logs_actvity`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `menu-web`
--
ALTER TABLE `menu-web`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_config`
--
ALTER TABLE `menu_config`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `menu_dashboard`
--
ALTER TABLE `menu_dashboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_group`
--
ALTER TABLE `menu_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_web`
--
ALTER TABLE `menu_web`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `modul`
--
ALTER TABLE `modul`
  ADD PRIMARY KEY (`id_modul`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pay_salary`
--
ALTER TABLE `pay_salary`
  ADD PRIMARY KEY (`pay_id`);

--
-- Indexes for table `places_coordinate`
--
ALTER TABLE `places_coordinate`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_file`
--
ALTER TABLE `project_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pro_expenses`
--
ALTER TABLE `pro_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pro_notes`
--
ALTER TABLE `pro_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pro_task`
--
ALTER TABLE `pro_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pro_task_assets`
--
ALTER TABLE `pro_task_assets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_component`
--
ALTER TABLE `p_component`
  ADD PRIMARY KEY (`comp_id`);

--
-- Indexes for table `p_ratebpjs`
--
ALTER TABLE `p_ratebpjs`
  ADD PRIMARY KEY (`rBPJS_id`);

--
-- Indexes for table `p_rateot`
--
ALTER TABLE `p_rateot`
  ADD PRIMARY KEY (`rot_id`);

--
-- Indexes for table `salary_type`
--
ALTER TABLE `salary_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `to-do_list`
--
ALTER TABLE `to-do_list`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addition`
--
ALTER TABLE `addition`
  MODIFY `addi_id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `ass_id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assets_category`
--
ALTER TABLE `assets_category`
  MODIFY `cat_id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `assign_leave`
--
ALTER TABLE `assign_leave`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `assign_task`
--
ALTER TABLE `assign_task`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `bank_info`
--
ALTER TABLE `bank_info`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banner_dashboard`
--
ALTER TABLE `banner_dashboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `deduction`
--
ALTER TABLE `deduction`
  MODIFY `de_id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `desciplinary`
--
ALTER TABLE `desciplinary`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `designation`
--
ALTER TABLE `designation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `earned_leave`
--
ALTER TABLE `earned_leave`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `employee_file`
--
ALTER TABLE `employee_file`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emp_assets`
--
ALTER TABLE `emp_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emp_component_sallary`
--
ALTER TABLE `emp_component_sallary`
  MODIFY `idxComp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emp_experience`
--
ALTER TABLE `emp_experience`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `emp_labor`
--
ALTER TABLE `emp_labor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `emp_leave`
--
ALTER TABLE `emp_leave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `emp_penalty`
--
ALTER TABLE `emp_penalty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emp_salary`
--
ALTER TABLE `emp_salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `field_visit`
--
ALTER TABLE `field_visit`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holiday`
--
ALTER TABLE `holiday`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `type_id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `loan`
--
ALTER TABLE `loan`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loan_installment`
--
ALTER TABLE `loan_installment`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logistic_asset`
--
ALTER TABLE `logistic_asset`
  MODIFY `log_id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logistic_assign`
--
ALTER TABLE `logistic_assign`
  MODIFY `ass_id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs_actvity`
--
ALTER TABLE `logs_actvity`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `menu-web`
--
ALTER TABLE `menu-web`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `menu_config`
--
ALTER TABLE `menu_config`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_dashboard`
--
ALTER TABLE `menu_dashboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `menu_group`
--
ALTER TABLE `menu_group`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_web`
--
ALTER TABLE `menu_web`
  MODIFY `id_menu` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `modul`
--
ALTER TABLE `modul`
  MODIFY `id_modul` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifikasi`
--
ALTER TABLE `notifikasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `pay_salary`
--
ALTER TABLE `pay_salary`
  MODIFY `pay_id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `places_coordinate`
--
ALTER TABLE `places_coordinate`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_file`
--
ALTER TABLE `project_file`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pro_expenses`
--
ALTER TABLE `pro_expenses`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pro_notes`
--
ALTER TABLE `pro_notes`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pro_task`
--
ALTER TABLE `pro_task`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pro_task_assets`
--
ALTER TABLE `pro_task_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_component`
--
ALTER TABLE `p_component`
  MODIFY `comp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_ratebpjs`
--
ALTER TABLE `p_ratebpjs`
  MODIFY `rBPJS_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `p_rateot`
--
ALTER TABLE `p_rateot`
  MODIFY `rot_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary_type`
--
ALTER TABLE `salary_type`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `to-do_list`
--
ALTER TABLE `to-do_list`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emp_component_sallary`
--
ALTER TABLE `emp_component_sallary`
  ADD CONSTRAINT `emp_component_sallary_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `t_employee` (`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `emp_component_sallary_ibfk_2` FOREIGN KEY (`comp_id`) REFERENCES `p_component` (`comp_id`),
  ADD CONSTRAINT `emp_component_sallary_ibfk_3` FOREIGN KEY (`rBPJS_id`) REFERENCES `p_ratebpjs` (`rBPJS_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
